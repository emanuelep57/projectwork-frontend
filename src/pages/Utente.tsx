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
import { proiezioneAPI } from '@/services/proiezioni';
import { postoAPI } from '@/services/posti';
import { ordineAPI } from '@/services/ordini';

/*
 * Pagina per la gestione dei biglietti dell'utente.
 * Permette di visualizzare, modificare ed eliminare gli ordini
 * per spettacoli futuri e di visualizzare quelli passati.
 */
const PaginaBigliettiUtente = () => {
    const {ordiniFuturi, ordiniPassati, inCaricamento, errore, fetchOrdini} = useOrdini();

    // Stati per la gestione dell'ordine corrente
    const [ordineSelezionato, setOrdineSelezionato] = useState<Ordine | null>(null);
    const [modalModificaAperta, setModalModificaAperta] = useState(false);
    const [proiezioniDisponibili, setProiezioniDisponibili] = useState<Proiezione[]>([]);
    const [proiezioneTemporanea, setProiezioneTemporanea] = useState<string>("");

    // Stati per la gestione della selezione dei posti
    const [postiDisponibili, setPostiDisponibili] = useState<Posto[]>([]);
    const [postiOccupati, setPostiOccupati] = useState<Posto[]>([]);
    const [postiSelezionati, setPostiSelezionati] = useState<number[]>([]);

    // Stati per il controllo dei modal
    const [dialogoProiezioneAperto, setDialogoProiezioneAperto] = useState(false);
    const [dialogoPostiAperto, setDialogoPostiAperto] = useState(false);
    const [erroreSelezionePosti, setErroreSelezionePosti] = useState<string | null>(null);

    //Recupera le proiezioni disponibili per un film (serve per la modifica)
    const recuperaProiezioniDisponibili = async (ordine: Ordine) => {
        try {
            const proiezioni = await proiezioneAPI.fetchProiezioni(ordine.proiezione.film_id);
            setProiezioniDisponibili(proiezioni);
        } catch (error) {
            toast({
                title: "Errore",
                description: "Impossibile caricare le proiezioni disponibili: " + error,
                variant: "destructive"
            });
        }
    };

    //Gestisce l'eliminazione dell'ordine
    const gestisciEliminaOrdine = async (id: number) => {
        try {
            await ordineAPI.eliminaOrdine(id);
            await fetchOrdini();
            toast({
                title: "Successo",
                description: "Ordine eliminato con successo"
            });
        } catch (error) {
            toast({
                title: "Errore",
                description: "Impossibile eliminare l'ordine: " + error,
                variant: "destructive"
            });
        }
    };

    //Recupera sia i posti disponibili che quelli occupati per una proiezione
    const recuperaPosti = async (idProiezione: number) => {
        try {
            const [rispostaPosti, rispostaOccupati] = await Promise.all([
                postoAPI.fetchPosti(idProiezione),
                postoAPI.fetchPostiOccupati(idProiezione)
            ]);

            setPostiDisponibili(rispostaPosti);
            setPostiOccupati(rispostaOccupati);
        } catch (error) {
            toast({
                title: "Errore",
                description: "Impossibile caricare i posti disponibili: " + error,
                variant: "destructive"
            });
        }
    };

    //Apre il modal di modifica e imposta l'ordine selezionato
    const gestisciModificaOrdine = async (ordine: Ordine) => {
        setOrdineSelezionato(ordine);
        setModalModificaAperta(true);
    };


     //Gestisce il completamento con successo della modifica dell'ordine
     //aggiornando i dati e chiudendo il modal
    const gestisciSuccessoModifica = async () => {
        await fetchOrdini();
        setModalModificaAperta(false);
        setOrdineSelezionato(null);
        toast({
            title: "Successo",
            description: "Ordine modificato con successo"
        });
    };

    //gestisce la modifica recuperando le proiezioni disponibili e aprendo il modal di modifica
    const gestisciModificaProiezione = async (ordine: Ordine) => {
        setOrdineSelezionato(ordine);
        setProiezioneTemporanea("");
        setErroreSelezionePosti(null);
        await recuperaProiezioniDisponibili(ordine);
        setDialogoProiezioneAperto(true);
    };

    //recupera i posti e apre il modal di selezione posti
    const gestisciModificaPosti = async (ordine: Ordine) => {
        setOrdineSelezionato(ordine);
        setErroreSelezionePosti(null);
        await recuperaPosti(ordine.proiezione.id);
        setPostiSelezionati([]);
        setDialogoPostiAperto(true);
    };

    //se cambi proiezione deve anche controllare se gli stessi posti esistono per l'altra data
    const gestisciConfermaProiezione = async () => {
        if (!ordineSelezionato || !proiezioneTemporanea) return;

        await recuperaPosti(parseInt(proiezioneTemporanea));
        setDialogoProiezioneAperto(false);
        setPostiSelezionati([]);
        setErroreSelezionePosti(null);
        setDialogoPostiAperto(true);
    };

    // Il resto del componente rimane invariato poiché la logica di rendering
    // è autoesplicativa grazie ai nomi dei componenti e delle prop

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
        // Layout principale con header e footer
        <div className="min-h-screen flex flex-col">
            <Header/>
            <div className="flex-1 container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">I Miei Biglietti</h1>

                {/* Modal per la modifica dell'ordine: permette di aggiungere o rimuovere posti */}
                {ordineSelezionato && (
                    <ModificaOrdine
                        ordine={ordineSelezionato}
                        isOpen={modalModificaAperta}
                        onClose={() => {
                            setModalModificaAperta(false);
                            setOrdineSelezionato(null)
                        }}
                        onSuccess={gestisciSuccessoModifica}
                    />
                )}

                {/* Modal per il cambio della proiezione: permette di selezionare una nuova data/ora */}
                <ModalModifica
                    isOpen={dialogoProiezioneAperto}
                    onClose={() => setDialogoProiezioneAperto(false)}
                    ordineSelezionato={ordineSelezionato}
                    proiezioniDisponibili={proiezioniDisponibili}
                    proiezioneTemporanea={proiezioneTemporanea}
                    onCambioProiezione={setProiezioneTemporanea}
                    onConferma={gestisciConfermaProiezione}
                />

                {/* Modal per la selezione dei posti: visualizza la griglia dei posti disponibili */}
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

                {/* tab per separare gli ordini futuri da quelli passati */}
                <Tabs defaultValue="future">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="future">Spettacoli Futuri</TabsTrigger>
                        <TabsTrigger value="past">Spettacoli Passati</TabsTrigger>
                    </TabsList>

                    {/* tab ordini futuri */}
                    <TabsContent value="future">
                        {ordiniFuturi.length === 0 ? (
                            <p className="text-center text-muted-foreground">
                                Nessuno spettacolo futuro
                            </p>
                        ) : (
                            // Mappa degli ordini futuri, ciascuno visualizzato in una SchedaOrdine
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

                    {/* tab ordini passati */}
                    <TabsContent value="past">
                        {ordiniPassati.length === 0 ? (
                            <p className="text-center text-muted-foreground">
                                Nessuno spettacolo passato
                            </p>
                        ) : (
                            // Mappa degli ordini passati, ciascuno visualizzato in una SchedaOrdine
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