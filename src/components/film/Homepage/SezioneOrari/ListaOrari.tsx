import { Button } from "@/components/ui/button.tsx";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx";
import { ChevronDown, ChevronUp } from "lucide-react";
import { formatShowDate } from "@/utils/utilsDate.ts";
import type { ListaOrariProps, Proiezione } from "@/types/proiezione.ts";
import { useNavigate } from "react-router-dom";
import Orari from "@/components/film/Homepage/SezioneOrari/Orari.tsx";
import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';

export const ListaOrari = ({filmId, titolo, orariProiezione, espanso, onToggleEspanso, caricamento}: ListaOrariProps) => {
    const navigate = useNavigate();

    //data odierna in formato ISO e prende solo la parte della data
    const oggi = new Date().toISOString().split("T")[0];

    // Estrae gli orari per il film specifico o restituisce un oggetto vuoto se non esistono
    const orariFilm = orariProiezione[filmId] || {};
    // Verifica se ci sono orari disponibili
    const checkOrari = Object.keys(orariFilm).length > 0;
    // C'è errore in caso non ci sono orari disponibili e non è in caricamento
    const erroreOrari = !checkOrari && !caricamento;

    // Funzione per determinare quali orari mostrare
    const filtraOrari = () => {

        // Se non ci sono orari, restituisce un oggetto vuoto o solo gli orari di oggi
        if (!checkOrari) {
            return espanso ? {} : { [oggi]: [] };
        }

        // Se la vista è espansa, mostra tutti gli orari
        if (espanso) {
            return orariFilm;
        }

        // Altrimenti mostra solo gli orari di oggi
        return {
            [oggi]: orariFilm[oggi] || [],
        };
    };

    // Funzione che mostra un alert per il caricamento
    const contenutoOrari = () => {
        // Mostra un messaggio di caricamento
        if (caricamento) {
            return (
                <Alert>
                    <AlertDescription>Caricamento orari in corso...</AlertDescription>
                </Alert>
            );
        }

        // FUnzione che un messaggio di errore se non ci sono orari disponibili
        if (erroreOrari) {
            return (
                <Alert variant="destructive">
                    <AlertTitle>Proiezioni non disponibili</AlertTitle>
                    <AlertDescription>
                        Non ci sono orari disponibili per questo film. Torna più tardi!
                    </AlertDescription>
                </Alert>
            );
        }

        const orariFiltrati = filtraOrari();

        // Mappa gli orari filtrati e per ogni orario "istanzia" un componente Orari
        return Object.entries(orariFiltrati).map(([data, orari]) => {
            if (!orari?.length) return null;

            const { isToday, formatted } = formatShowDate(data);

            return (
                <Orari
                    key={data}
                    data={{ isToday, formatted }}
                    orari={orari}
                    onOrarioClick={(proiezione: Proiezione) => {
                        // Costruisce la data ISO completa combinando data e ora
                        const fullDate = `${data}T${proiezione.data_ora}:00`;
                        // Naviga alla pagina di selezione posti con i dettagli della proiezione
                        navigate('/select-seats', {
                            state: {
                                titoloFilm: titolo,
                                data_ora: format(parseISO(fullDate), 'PPpp', {locale: it}),
                                filmId: filmId,
                                proiezioneId: proiezione.id,
                                costo: proiezione.costo,
                                sala: proiezione.sala
                            }
                        })
                    }}
                />
            );
        });
    };

    return (
        <div className="space-y-4">
            {contenutoOrari()}
            {/* Bottone per espandere/comprimere la lista degli orari */}
            <Button
                variant="link"
                className="text-primary p-0 h-auto font-medium"
                onClick={() => void onToggleEspanso(filmId)}
                disabled={caricamento}
            >
                {espanso ? (
                    <>
                        <ChevronUp className="w-4 h-4 mr-1" />
                        MOSTRA MENO
                    </>
                ) : (
                    <>
                        <ChevronDown className="w-4 h-4 mr-1" />
                        MOSTRA GLI ORARI DI TUTTI I GIORNI
                    </>
                )}
            </Button>
        </div>
    );
};