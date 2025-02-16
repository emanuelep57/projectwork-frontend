import {useState} from 'react';
import {useOrdini} from '@/hooks/useOrdini';
import {SchedaOrdine} from '@/components/ordini/SchedaOrdine';
import {ModificaOrdine} from '@/components/ordini/ModificaOrdine';
import {ModalModifica} from '@/components/ordini/ModalModifica';
import {ModalSelezionePosti} from '@/components/ordini/ModalSelezionePosti';
import {Ordine} from '@/types/ordine';
import {Posto} from '@/types/posto';
import {Proiezione} from '@/types/proiezione';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {toast} from '@/hooks/use-toast';
import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer";

const PaginaBigliettiUtente = () => {
    const {ordiniFuturi, ordiniPassati, inCaricamento, errore, fetchOrdini, eliminaOrdine} = useOrdini();

    // Stati per la gestione dell'ordine
    const [ordineSelezionato, setOrdineSelezionato] = useState<Ordine | null>(null);
    const [modalModificaAperta, setModalModificaAperta] = useState(false);
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
            setProiezioniDisponibili(dati);
        } catch (error) {
            toast({
                title: "Errore",
                description: "Impossibile caricare le proiezioni disponibili"+error,
                variant: "destructive"
            });
        }
    };

    const gestisciEliminaOrdine = async (id: number) => {
        try {
            // Chiama la funzione di eliminazione
            await eliminaOrdine(id);
            // Aggiorna i dati
            await fetchOrdini();
            // Mostra un toast di successo
            toast({
                title: "Successo",
                description: "Ordine eliminato con successo"
            });
        } catch (error) {
            // Gestisci l'errore
            toast({
                title: "Errore" + error,
                description: "Impossibile eliminare l'ordine",
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
     * Gestisce l'apertura della modale di modifica ordine
     */
    const gestisciModificaOrdine = async (ordine: Ordine) => {
        setOrdineSelezionato(ordine);
        setModalModificaAperta(true);
    };

    /**
     * Gestisce il successo della modifica dell'ordine
     */
    const gestisciSuccessoModifica = async () => {
        await fetchOrdini();
        setModalModificaAperta(false);
        setOrdineSelezionato(null);
        toast({
            title: "Successo",
            description: "Ordine modificato con successo"
        });
    };

    /**
     * Gestisce la modifica dei posti per un cambio proiezione
     */
    const gestisciModificaProiezione = async (ordine: Ordine) => {
        setOrdineSelezionato(ordine);
        setProiezioneTemporanea("");
        setErroreSelezionePosti(null);
        await recuperaProiezioniDisponibili(ordine);
        setDialogoProiezioneAperto(true);
    };

    /**
     * Gestisce la modifica dei soli posti
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

    // Gestione stati di caricamento e errore
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

                {/* Modal per la modifica dell'ordine (aggiunta/rimozione posti) */}
                {ordineSelezionato && (
                    <ModificaOrdine
                        ordine={ordineSelezionato}
                        isOpen={modalModificaAperta}
                        onClose={() => {setModalModificaAperta(false);
                                               setOrdineSelezionato(null) }}
                        onSuccess={gestisciSuccessoModifica}
                    />
                )}

                {/* Modal per il cambio proiezione */}
                <ModalModifica
                    isOpen={dialogoProiezioneAperto}
                    onClose={() => setDialogoProiezioneAperto(false)}
                    ordineSelezionato={ordineSelezionato}
                    proiezioniDisponibili={proiezioniDisponibili}
                    proiezioneTemporanea={proiezioneTemporanea}
                    onCambioProiezione={setProiezioneTemporanea}
                    onConferma={gestisciConfermaProiezione}
                />

                {/* Modal per la selezione dei posti */}
                <ModalSelezionePosti
                    isAperto={dialogoPostiAperto}
                    onChiudi={() => setDialogoPostiAperto(false)}
                    ordineSelezionato={ordineSelezionato}
                    postiDisponibili={postiDisponibili}
                    postiOccupati={postiOccupati}
                    postiSelezionati={postiSelezionati}
                    errore={erroreSelezionePosti}
                    onTogglePosto={(idPosto) => {
                        setPostiSelezionati(prev =>
                            prev.includes(idPosto)
                                ? prev.filter(id => id !== idPosto)
                                : [...prev, idPosto]
                        );
                    }}
                    onConferma={gestisciModificaPosti}
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
                                    onModificaPosti={() => gestisciModificaOrdine(ordine)}
                                    onModificaOrdine={() => gestisciModificaProiezione(ordine)}
                                    onEliminaOrdine={gestisciEliminaOrdine}
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
                                    onModificaPosti={() => gestisciModificaOrdine(ordine)}
                                    onModificaOrdine={() => gestisciModificaProiezione(ordine)}
                                    onEliminaOrdine={gestisciEliminaOrdine}
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