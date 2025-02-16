import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ModificaOrdineProps } from '@/types/ordine';
import { Posto } from '@/types/posto';
import { ModalSelezionePosti } from './ModalSelezionePosti';
import Checkout from '@/components/acquisto/Checkout';
import { ordineAPI } from "@/services/ordini";
import { toast } from '@/hooks/use-toast';

//Il codice è troppo lungo qui, me ne rendo conto scusate in anticipo
type Step = 'selezione-azione' | 'selezione-posti' | 'dettagli-ospiti' | 'checkout';

export const ModificaOrdine = ({ ordine, isOpen, onClose, onSuccess }: ModificaOrdineProps) => {
    // Base states
    const [step, setStep] = useState<Step>('selezione-azione');
    const [azione, setAzione] = useState<'aggiungi' | 'rimuovi' | null>(null);
    const [numeroPostiDaAggiungere, setNumeroPostiDaAggiungere] = useState<number>(1);
    const [postoDaRimuovere, setPostoDaRimuovere] = useState<number | null>(null);
    const [errore, setErrore] = useState<string | null>(null);

    // Modal states with separate open states
    const [isMainDialogOpen, setIsMainDialogOpen] = useState(false);
    const [isModalPostiOpen, setIsModalPostiOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    // Data states
    const [postiDisponibili, setPostiDisponibili] = useState<Posto[]>([]);
    const [postiOccupati, setPostiOccupati] = useState<Posto[]>([]);
    const [postiSelezionati, setPostiSelezionati] = useState<Posto[]>([]);
    const [dettagliOspiti, setDettagliOspiti] = useState<{ [key: string]: { nome: string, cognome: string } }>({});


    useEffect(() => {
        setIsMainDialogOpen(isOpen);
    }, [isOpen]);

    // Resetta tutti gli stati
    const resetStates = () => {
        setStep('selezione-azione');
        setAzione(null);
        setNumeroPostiDaAggiungere(1);
        setPostoDaRimuovere(null);
        setErrore(null);
        setIsModalPostiOpen(false);
        setIsCheckoutOpen(false);
        setPostiDisponibili([]);
        setPostiOccupati([]);
        setPostiSelezionati([]);
        setDettagliOspiti({});
    };

    // chiusura del modal
    const handleClose = () => {
        setIsMainDialogOpen(false);
        setTimeout(() => {
            resetStates();
            onClose();
        }, 200); // Chiusura del modal con timeout per garantire l'animazione
    };

    useEffect(() => {
        const fetchPosti = async () => {
            if (isModalPostiOpen && ordine) {
                try {
                    const [disponibili, occupati] = await Promise.all([
                        fetch(`http://localhost:5000/api/posti/${ordine.proiezione.id}`, {
                            credentials: 'include'
                        }).then(res => res.json()),
                        fetch(`http://localhost:5000/api/posti/occupati/${ordine.proiezione.id}`, {
                            credentials: 'include'
                        }).then(res => res.json())
                    ]);

                    setPostiDisponibili(disponibili);
                    setPostiOccupati(occupati);
                } catch (error) {
                    setErrore('Impossibile caricare i posti disponibili' + error);
                    setIsModalPostiOpen(false);
                }
            }
        };

        fetchPosti();
    }, [isModalPostiOpen, ordine]);

    const handleAzioneChange = (value: 'aggiungi' | 'rimuovi') => {
        setAzione(value);
        setErrore(null);
        setPostoDaRimuovere(null);
        setNumeroPostiDaAggiungere(1);
        setPostiSelezionati([]);
        setDettagliOspiti({});
        setStep('selezione-azione');
    };

    const handleRimuoviPosto = async () => {
        if (!postoDaRimuovere) return;

        try {
            await ordineAPI.rimuoviPosto(ordine.id, postoDaRimuovere);
            toast({
                title: "Successo",
                description: "Il posto è stato rimosso e verrà emesso un rimborso"
            });
            onSuccess();
            handleClose();
        } catch (error) {
            setErrore(error instanceof Error ? error.message : 'Errore durante la rimozione del posto');
        }
    };

    const handleTogglePosto = (idPosto: number) => {
        const posto = postiDisponibili.find(p => p.id === idPosto);
        if (!posto) return;

        setPostiSelezionati(prev => {
            if (prev.some(p => p.id === idPosto)) {
                return prev.filter(p => p.id !== idPosto);
            }
            if (prev.length < numeroPostiDaAggiungere) {
                return [...prev, posto];
            }
            return prev;
        });
    };

    const handleConfermaSelezionePosti = () => {
        if (postiSelezionati.length === numeroPostiDaAggiungere) {
            setIsModalPostiOpen(false);
            setStep('dettagli-ospiti');
        } else {
            setErrore(`Devi selezionare esattamente ${numeroPostiDaAggiungere} posti`);
        }
    };

    const handleAggiornaDettagliOspite = (posto: Posto, campo: 'nome' | 'cognome', valore: string) => {
        const etichetta = `${posto.fila}${posto.numero}`;
        setDettagliOspiti(prev => ({
            ...prev,
            [etichetta]: {
                ...prev[etichetta],
                [campo]: valore
            }
        }));
    };

    const handleConfermaDettagliOspiti = () => {
        const tuttiDettagliInseriti = postiSelezionati.every(posto => {
            const dettagli = dettagliOspiti[`${posto.fila}${posto.numero}`];
            return dettagli?.nome && dettagli?.cognome;
        });

        if (tuttiDettagliInseriti) {
            setStep('checkout');
            setIsCheckoutOpen(true);
        } else {
            setErrore('Inserisci i dettagli per tutti gli ospiti');
        }
    };

    const handleCheckoutSuccess = async () => {
        try {
            toast({
                title: "Successo",
                description: "I nuovi posti sono stati aggiunti al tuo ordine"
            });
            onSuccess();
            handleClose();
        } catch (error) {
            setErrore(error instanceof Error ? error.message : 'Errore durante l\'aggiunta dei posti');
        }
    };

    const renderDettagliOspiti = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dettagli Ospiti</h3>

            {postiSelezionati.map((posto) => {
                const etichetta = `${posto.fila}${posto.numero}`;
                return (
                    <div key={posto.id} className="space-y-4 p-4 border rounded-lg">
                        <div className="flex justify-between items-center">
                            <h4 className="font-medium">Posto {etichetta}</h4>
                            <span className="text-muted-foreground">€ {ordine.proiezione.costo}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor={`nome-${etichetta}`}>Nome</Label>
                                <Input
                                    id={`nome-${etichetta}`}
                                    value={dettagliOspiti[etichetta]?.nome || ''}
                                    onChange={(e) => handleAggiornaDettagliOspite(posto, 'nome', e.target.value)}
                                    placeholder="Nome dell'ospite"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`cognome-${etichetta}`}>Cognome</Label>
                                <Input
                                    id={`cognome-${etichetta}`}
                                    value={dettagliOspiti[etichetta]?.cognome || ''}
                                    onChange={(e) => handleAggiornaDettagliOspite(posto, 'cognome', e.target.value)}
                                    placeholder="Cognome dell'ospite"
                                />
                            </div>
                        </div>
                    </div>
                );
            })}

            <div className="flex justify-between items-center pt-4 border-t">
                <span>Totale</span>
                <span className="font-bold">€ {postiSelezionati.length * ordine.proiezione.costo}</span>
            </div>

            <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsModalPostiOpen(true)}>
                    Indietro
                </Button>
                <Button className="flex-1" onClick={handleConfermaDettagliOspiti}>
                    Procedi al pagamento
                </Button>
            </div>
        </div>
    );

    return (
        <>
            <Dialog open={isMainDialogOpen} onOpenChange={(open) => {
                if (!open) handleClose();
            }}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Modifica Ordine</DialogTitle>
                    </DialogHeader>

                    {errore && (
                        <Alert variant="destructive">
                            <AlertDescription>{errore}</AlertDescription>
                        </Alert>
                    )}

                    {step === 'selezione-azione' && (
                        <div className="space-y-4">
                            <div>
                                <Label>Azione</Label>
                                <Select onValueChange={handleAzioneChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleziona azione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="aggiungi">Aggiungi posti</SelectItem>
                                        {ordine.biglietti.length > 1 && (
                                            <SelectItem value="rimuovi">Rimuovi posto</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            {azione === 'aggiungi' && (
                                <div>
                                    <Label>Numero di posti da aggiungere</Label>
                                    <Input
                                        type="number"
                                        min={1}
                                        max={10}
                                        value={numeroPostiDaAggiungere}
                                        onChange={(e) => setNumeroPostiDaAggiungere(parseInt(e.target.value) || 1)}
                                    />
                                    <Button
                                        className="mt-2 w-full"
                                        onClick={() => setIsModalPostiOpen(true)}
                                    >
                                        Seleziona Posti
                                    </Button>
                                </div>
                            )}

                            {azione === 'rimuovi' && (
                                <div>
                                    <Label>Seleziona posto da rimuovere</Label>
                                    <Select onValueChange={(value) => setPostoDaRimuovere(Number(value))}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleziona posto" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ordine.biglietti.slice(1).map((biglietto) => (
                                                biglietto.posti.map((posto) => (
                                                    <SelectItem key={posto.id} value={posto.id.toString()}>
                                                        Posto {posto.fila}{posto.numero}
                                                        {biglietto.nome_ospite ? ` - ${biglietto.nome_ospite} ${biglietto.cognome_ospite}` : ''}
                                                    </SelectItem>
                                                ))
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Button
                                        className="mt-4 w-full"
                                        onClick={handleRimuoviPosto}
                                        disabled={!postoDaRimuovere}
                                        variant="destructive"
                                    >
                                        Rimuovi Posto
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 'dettagli-ospiti' && renderDettagliOspiti()}
                </DialogContent>
            </Dialog>

            {isModalPostiOpen && (
                <ModalSelezionePosti
                    isAperto={isModalPostiOpen}
                    onChiudi={() => {
                        setIsModalPostiOpen(false);
                        setPostiSelezionati([]);
                    }}
                    ordineSelezionato={{
                        ...ordine,
                        biglietti: Array(numeroPostiDaAggiungere).fill(ordine.biglietti[0])
                    }}
                    postiDisponibili={postiDisponibili}
                    postiOccupati={postiOccupati}
                    postiSelezionati={postiSelezionati.map(p => p.id)}
                    errore={errore}
                    onTogglePosto={handleTogglePosto}
                    onConferma={handleConfermaSelezionePosti}
                />
            )}

            {isCheckoutOpen && (
                <Checkout
                    aperto={isCheckoutOpen}
                    onStatoChange={(stato) => {
                        setIsCheckoutOpen(stato);
                        if (!stato) {
                            handleClose();
                        }
                    }}
                    postiSelezionati={postiSelezionati.map(posto => ({
                        ...posto,
                        etichetta: `${posto.fila}${posto.numero}`
                    }))}
                    idProiezione={ordine.proiezione.id}
                    dettagliOspite={dettagliOspiti}
                    onSuccess={handleCheckoutSuccess}
                    costo={ordine.proiezione.costo}
                    isModificaOrdine={true}
                    idOrdineEsistente={ordine.id}
                />
            )}
        </>
    );
};