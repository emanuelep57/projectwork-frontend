import { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx";
import { useProiezioni } from "@/hooks/useProiezioni.ts";
import { Copertina } from "./Copertina.tsx";
import { DettagliFilm } from "./DettagliFilm.tsx";
import { ListaOrari } from "./ListaOrari.tsx";
import { SezioneOrariProps } from "@/types/proiezione.ts";

// Componente principale che mostra la copertina con alcune info sul film, ma principalmente
// gli orari e i giorni in cui ci sono proiezioni disponibili.
const SezioneOrari = ({ films }: SezioneOrariProps) => {

    // Stato per tenere traccia del film attualmente espanso
    const [filmEspanso, setFilmEspanso] = useState<number | null>(null);

    // Hook per gestire gli orari di proiezione
    const { orari, caricamento, errore, fetchProiezioni } = useProiezioni();

    const [inizialmenteCaricato, setInizialmenteCaricato] = useState(false);

    useEffect(() => {
        if (inizialmenteCaricato) return; // Evita di rieseguire il caricamento se già è stato fatto

        const caricaOrariIniziali = async () => {
            try {
                // Carica gli orari per il giorno corrente di tutti i film
                await Promise.all(
                    films.map((film) => fetchProiezioni(film.id, true))
                );
            } catch (err) {
                //stampo in console perché l'errore viene già gestito nell'hook
                console.log(err);
            } finally {
                setInizialmenteCaricato(true);
            }
        };

        void caricaOrariIniziali(); // Esegue la funzione di caricamento
    }, [films, fetchProiezioni, inizialmenteCaricato]);

    /*
     Gestisce l'espansione e la compressione dei film.
     Se si espande, carica tutti gli orari di quel film.
     Se si comprime, resetta lo stato del film espanso.
     */
    const gestisciEspansione = useCallback(
        async (filmId: number) => {
            const espanso = filmEspanso !== filmId; // Verifica se il film è espanso

            if (espanso) {
                // Carica tutti gli orari per il film se è espanso
                await fetchProiezioni(filmId, false);
                setFilmEspanso(filmId);
            } else {
                // Resetta lo stato se il film viene compresso
                setFilmEspanso(null);
            }
        },
        [filmEspanso, fetchProiezioni]
    );

    return (
        <div className="space-y-8">
            {/* Creo una card per ogni film */}
            {films.map((film) => {
                // Recupera errori e stato di caricamento per il film corrente
                const erroreFilm = errore[film.id];
                const inCaricamento = caricamento[film.id];

                return (
                    <Card key={film.id} className="p-6 bg-transparent">
                        <CardContent className="p-0 flex flex-col md:flex-row gap-6 bg-transparent">
                            {/* Componente per visualizzare la copertina del film */}
                            <Copertina
                                id={film.id}
                                url={film.url_copertina}
                                titolo={film.titolo}
                            />

                            <div className="flex-1">
                                {/* Componente per mostrare i dettagli del film */}
                                <DettagliFilm
                                    titolo={film.titolo}
                                    generi={film.generi}
                                    regista={film.regista}
                                    durata={film.durata}
                                />

                                {erroreFilm && (
                                    <Alert variant="destructive" className="mb-4">
                                        <AlertTitle>Errore</AlertTitle>
                                        <AlertDescription>
                                            Si è verificato un errore nel caricamento degli orari. Riprova più tardi.
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {/* Componente per la lista degli orari */}
                                <ListaOrari
                                    filmId={film.id}
                                    orariProiezione={orari}
                                    espanso={filmEspanso === film.id}
                                    onToggleEspanso={gestisciEspansione} // Callback per cambiare lo stato di espansione
                                    caricamento={inCaricamento}
                                />
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};

export default SezioneOrari;