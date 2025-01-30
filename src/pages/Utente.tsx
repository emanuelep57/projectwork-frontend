import {useState, useCallback} from 'react';
import {useOrdini} from '@/hooks/useOrdini';
import {SchedaOrdine} from '@/components/ordini/SchedaOrdine';
import {ModalModifica} from '@/components/ordini/ModalModifica';
import {ModalSelezionePosti} from '@/components/ordini/ModalSelezionePosti';
import {Ordine} from '@/types/ordine';
import {Posto} from '@/types/posto';
import {Proiezione} from '@/types/proiezione';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {ordineAPI} from '@/services/ordini';
import {toast} from '@/hooks/use-toast';
import Header from "@/components/layout/Header/Header.tsx";
import Footer from "@/components/layout/Footer";

/**
 * Pagina che gestisce la visualizzazione e modifica dei biglietti dell'utente
 * Permette di:
 * - Visualizzare biglietti per spettacoli futuri e passati
 * - Modificare data/ora della proiezione
 * - Modificare i posti selezionati
 * - Eliminare ordini
 */
const PaginaBigliettiUtente = () => {
    const {ordiniFuturi, ordiniPassati, inCaricamento, errore, fetchOrdini, eliminaOrdine} = useOrdini();

    // Stati per la gestione dell'ordine
    const [ordineSelezionato, setOrdineSelezionato] = useState<Ordine | null>(null);
    const [proiezioniDisponibili, setProiezioniDisponibili] = useState<Proiezione[]>([]);
    const [proiezioneTemporanea, setProiezioneTemporanea] = useState<string>("");

    // Stati per la gestione dei posti
    const [postiDisponibili, setPostiDisponibili] = useState<Posto[]>([]);
    const [postiOccupati, setPostiOccupati] = useState<Posto[]>([]);
    const [postiSelezionati, setPostiSelezionati] = useState<number[]>([]);

    // Stati per il controllo dei dialoghi
    const [dialogoProiezioneAperto, setDialogoProiezioneAperto] = useState(false);
    const [dialogoPostiAperto, setDialogoPostiAperto] = useState(false);
    const [erroreSelezionePosti, setErroreSelezionePosti] = useState<string | null>(null);

    /**
     * Recupera le proiezioni disponibili per un film
     */
    const recuperaProiezioniDisponibili = async (ordine: Ordine) => {
        try {
            const risposta = await fetch(
                `http://localhost:5000/api/proiezioni?film_id=${ordine.proiezione.film_id}`,
                { credentials: 'include' }
            );

            if (!risposta.ok) {
                throw new Error('Impossibile recuperare le proiezioni');
            }

            const dati = await risposta.json();

            if (!Array.isArray(dati)) {
                throw new Error('Dati proiezioni non validi');
            }

            setProiezioniDisponibili(dati);
        } catch (error) {
            console.error(error);
            toast({
                title: "Errore",
                description: "Impossibile caricare le proiezioni disponibili",
                variant: "destructive"
            });
        }
    };

    /**
     * Recupera i posti disponibili e occupati per una proiezione
     */
    const recuperaPostiDisponibili = async (idProiezione: number) => {
        try {
            const [rispostaPosti, rispostaOccupati] = await Promise.all([
                fetch(`http://localhost:5000/api/posti/${idProiezione}`, {
                    credentials: 'include'
                }),
                fetch(`http://localhost:5000/api/posti/occupati/${idProiezione}`, {
                    credentials: 'include'
                })
            ]);

            if (!rispostaPosti.ok || !rispostaOccupati.ok) {
                throw new Error('Impossibile recuperare i posti');
            }

            const datiPosti = await rispostaPosti.json();
            const datiOccupati = await rispostaOccupati.json();

            setPostiDisponibili(datiPosti);
            setPostiOccupati(datiOccupati);
        } catch {
            toast({
                title: "Errore",
                description: "Impossibile caricare i posti disponibili",
                variant: "destructive"
            });
        }
    };

    /**
     * Gestisce la modifica di un ordine (cambio proiezione)
     */
    const gestisciModificaOrdine = async (ordine: Ordine) => {
        setOrdineSelezionato(ordine);
        setProiezioneTemporanea("");
        setErroreSelezionePosti(null);
        await recuperaProiezioniDisponibili(ordine);
        setDialogoProiezioneAperto(true);
    };

    /**
     * Gestisce la modifica dei posti per un ordine
     */
    const gestisciModificaPosti = async (ordine: Ordine) => {
        setOrdineSelezionato(ordine);
        setErroreSelezionePosti(null);
        await recuperaPostiDisponibili(ordine.proiezione.id);
        setPostiSelezionati([]);
        setDialogoPostiAperto(true);
    };

    /**
     * Conferma il cambio proiezione e procede alla selezione dei posti
     */
    const gestisciConfermaProiezione = async () => {
        if (!ordineSelezionato || !proiezioneTemporanea) return;

        await recuperaPostiDisponibili(parseInt(proiezioneTemporanea));
        setDialogoProiezioneAperto(false);
        setPostiSelezionati([]);
        setErroreSelezionePosti(null);
        setDialogoPostiAperto(true);
    };

    /**
     * Gestisce il cambio sia della proiezione che dei posti
     */
    const gestisciCambioProiezioneEPosti = async () => {
        if (!ordineSelezionato || !proiezioneTemporanea || postiSelezionati.length === 0) return;

        if (postiSelezionati.length !== ordineSelezionato.biglietti.length) {
            setErroreSelezionePosti(`Seleziona esattamente ${ordineSelezionato.biglietti.length} posti`);
            return;
        }

        const postiFormattati = postiSelezionati.map(posto => ({ id_posto: posto}));


        console.log("Payload inviato:", JSON.stringify({
            order_id: ordineSelezionato.id,
            new_projection_id: parseInt(proiezioneTemporanea),
            new_seats: postiFormattati
        }, null, 2));


        try {
            await ordineAPI.cambiaDataProiezione({
                order_id: ordineSelezionato.id,
                new_projection_id: parseInt(proiezioneTemporanea),
                new_seats: postiFormattati
            });

            toast({
                title: "Successo",
                description: "Orario spettacolo e posti modificati con successo"
            });

            await fetchOrdini();
            gestisciChiusuraDialoghi();
        } catch (errore) {
            setErroreSelezionePosti(errore instanceof Error ? errore.message : 'Impossibile cambiare orario e posti');
            toast({
                title: "Errore",
                description: errore instanceof Error ? errore.message : 'Impossibile cambiare orario e posti',
                variant: "destructive"
            });
        }
    };

    /**
     * Gestisce il cambio dei soli posti
     */
    const gestisciCambioPosti = async () => {
        if (!ordineSelezionato || postiSelezionati.length === 0) return;

        if (postiSelezionati.length !== ordineSelezionato.biglietti.length) {
            setErroreSelezionePosti(`Seleziona esattamente ${ordineSelezionato.biglietti.length} posti`);
            return;
        }

        try {
            await ordineAPI.cambiaPosto({
                id_ordine: ordineSelezionato.id,
                nuovi_posti: postiSelezionati
            });

            toast({
                title: "Successo",
                description: "Posti modificati con successo"
            });

            await fetchOrdini();
            gestisciChiusuraDialoghi();
        } catch (errore) {
            setErroreSelezionePosti(errore instanceof Error ? errore.message : 'Impossibile cambiare i posti');
            toast({
                title: "Errore",
                description: errore instanceof Error ? errore.message : 'Impossibile cambiare i posti',
                variant: "destructive"
            });
        }
    };

    /**
     * Gestisce la selezione/deselezione di un posto
     */
    const gestisciTogglePosto = useCallback((idPosto: number) => {
        setErroreSelezionePosti(null);

        const postoOccupato = postiOccupati.some(p => p.id === idPosto) &&
            !ordineSelezionato?.biglietti.some(b => parseInt(b.posto) === idPosto);

        if (postoOccupato) {
            setErroreSelezionePosti("Questo posto è già occupato");
            return;
        }

        setPostiSelezionati(prev => {
            if (prev.includes(idPosto)) {
                return prev.filter(id => id !== idPosto);
            } else if (prev.length < ordineSelezionato?.biglietti.length!) {
                return [...prev, idPosto];
            } else {
                setErroreSelezionePosti(`Puoi selezionare solo ${ordineSelezionato?.biglietti.length} posti`);
                return prev;
            }
        });
    }, [postiOccupati, ordineSelezionato?.biglietti]);

    /**
     * Chiude tutti i dialoghi e resetta gli stati
     */
    const gestisciChiusuraDialoghi = useCallback(() => {
        setDialogoPostiAperto(false);
        setDialogoProiezioneAperto(false);
        setPostiSelezionati([]);
        setProiezioneTemporanea("");
        setErroreSelezionePosti(null);
        setOrdineSelezionato(null);
    }, []);

    // Stati di caricamento e errore
    if (inCaricamento) {
        return (
            <div className="container mx-auto p-6 text-center">
                <div className="animate-pulse">Caricamento...</div>
            </div>
        );
    }

    if (errore) {
        return (
            <div className="container mx-auto p-6">
                <div className="text-red-500 text-center">
                    <p>Errore durante il caricamento dei biglietti:</p>
                    <p>{errore}</p>
                </div>
            </div>
        );
    }

    return (

        <div className="min-h-screen flex flex-col">
            <Header/>
            <div className="flex-1 container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">I Miei Biglietti</h1>

                <ModalModifica
                    isOpen={dialogoProiezioneAperto}
                    onClose={() => setDialogoProiezioneAperto(false)}
                    ordineSelezionato={ordineSelezionato}
                    proiezioniDisponibili={proiezioniDisponibili}
                    proiezioneTemporanea={proiezioneTemporanea}
                    onCambioProiezione={setProiezioneTemporanea}
                    onConferma={gestisciConfermaProiezione}
                />

                <ModalSelezionePosti
                    isAperto={dialogoPostiAperto}
                    onChiudi={() => setDialogoPostiAperto(false)}
                    ordineSelezionato={ordineSelezionato}
                    postiDisponibili={postiDisponibili}
                    postiOccupati={postiOccupati}
                    postiSelezionati={postiSelezionati}
                    errore={erroreSelezionePosti}
                    onTogglePosto={gestisciTogglePosto}
                    onConferma={proiezioneTemporanea ? gestisciCambioProiezioneEPosti : gestisciCambioPosti}
                    isCambioProiezione={!!proiezioneTemporanea}
                />

                <Tabs defaultValue="future">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="future">Spettacoli Futuri</TabsTrigger>
                        <TabsTrigger value="past">Spettacoli Passati</TabsTrigger>
                    </TabsList>

                    <TabsContent value="future">
                        {ordiniFuturi.length === 0 ? (
                            <p className="text-center text-muted-foreground">
                                Nessuno spettacolo futuro
                            </p>
                        ) : (
                            ordiniFuturi.map(ordine => (
                                <SchedaOrdine
                                    key={ordine.id}
                                    ordine={ordine}
                                    isOrdineFuturo={true}
                                    onModificaPosti={gestisciModificaPosti}
                                    onModificaOrdine={gestisciModificaOrdine}
                                    onEliminaOrdine={eliminaOrdine}
                                />
                            ))
                        )}
                    </TabsContent>

                    <TabsContent value="past">
                        {ordiniPassati.length === 0 ? (
                            <p className="text-center text-muted-foreground">
                                Nessuno spettacolo passato
                            </p>
                        ) : (
                            ordiniPassati.map(ordine => (
                                <SchedaOrdine
                                    key={ordine.id}
                                    ordine={ordine}
                                    isOrdineFuturo={false}
                                    onModificaPosti={gestisciModificaPosti}
                                    onModificaOrdine={gestisciModificaOrdine}
                                    onEliminaOrdine={eliminaOrdine}
                                />
                            ))
                        )}
                    </TabsContent>
                </Tabs>
            </div>
            <Footer/>
        </div>
    );
};

export default PaginaBigliettiUtente;