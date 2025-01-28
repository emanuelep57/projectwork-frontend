import { Button } from "@/components/ui/button.tsx";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx";
import { ChevronDown, ChevronUp } from "lucide-react";
import { formatShowDate } from "@/utils/dateFormatter.ts";
import type { ListaOrariProps } from "@/types/proiezione.ts";
import { useNavigate } from "react-router-dom";
import Orari from "@/components/film/Homepage/SezioneOrari/Orari.tsx";


//TODO NON DOVREI PRENDERE LE PROIEZIONI PASSATE MA SOLO FUTURE, NON ANCORA IMPLEMENTATO PER FACILITARE IL TESTING.


export const ListaOrari = ({filmId, orariProiezione, espanso, onToggleEspanso, caricamento}: ListaOrariProps) => {
    const navigate = useNavigate();
    const oggi = new Date().toISOString().split("T")[0] //tolgo l'orario e tengo solo la data

    // Estrae gli orari relativi al film attuale
    const orariFilm = orariProiezione[filmId] || {}; // Recupero gli orari del film oppure restituisco un oggetto vuoto
    const checkOrari = Object.keys(orariFilm).length > 0; // Verifica se ci sono orari disponibili
    const erroreOrari = !checkOrari && !caricamento; // Se non ci sono orari e non è in caricamento, c'è un errore.


    const filtraOrari = () => {
        // Se non ci sono orari disponibili restituisce un oggetto vuoto se la vista è espansa
        // e un oggetto con la data di oggi ma nessun orario in caso sia compresso
        if (!checkOrari) {
            return espanso ? {} : { [oggi]: [] };
        }

        // Se ci sono orari disponibili e la lista è espansa, restituisce tutti gli orari
        if (espanso) {
            return orariFilm;
        }

        // Se ci sono orari disponibili ma la lista è compressa, restituisce solo gli orari di oggi
        return {
            [oggi]: orariFilm[oggi] || [], // Usa un array vuoto se non ci sono orari per oggi
        };
    };

    //setto il contenuto del componete Orari
    const contenutoOrari = () => {

        if (caricamento) {
            return (
                <Alert>
                    <AlertDescription>Caricamento orari in corso...</AlertDescription>
                </Alert>
            );
        }

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

        // Creo una lista di Orari disponibili per ogni giorno in cui ci sono proiezioni, se
        //l'utente ci clicca, viene portato alla pagina per l'acquisto.
        return Object.entries(orariFiltrati).map(([data, orari]) => {

            if (!orari?.length) return null; // Salta i giorni senza orari

            const { isToday, formatted } = formatShowDate(data); // Formatta la data per la visualizzazione

            return (
                <Orari
                    key={data} // Chiave univoca per React
                    date={{ isToday, formatted }} // Passa la data (indica anche se è oggi)
                    times={orari} // Orari di proiezione per quel giorno
                    onTimeSelect={() => navigate(`/movie/${filmId}`)} // Naviga alla pagina del film selezionato
                />
            );
        });
    };

    return (
        <div className="space-y-4">
            {/* Contenuto della lista orari */}
            {contenutoOrari()}

            {/* Pulsante per alternare lo stato espanso/compressione */}
            <Button
                variant="link"
                className="text-primary p-0 h-auto font-medium"
                onClick={() => void onToggleEspanso(filmId)} // Chiama la funzione per espandere/comprimere
                disabled={caricamento} // Disabilita il pulsante se i dati sono in caricamento
            >
                {/* Icona e testo per sezione espansa e compressa */}
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
