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
    const oggi = new Date().toISOString().split("T")[0];

    const orariFilm = orariProiezione[filmId] || {};
    const checkOrari = Object.keys(orariFilm).length > 0;
    const erroreOrari = !checkOrari && !caricamento;

    const filtraOrari = () => {
        if (!checkOrari) {
            return espanso ? {} : { [oggi]: [] };
        }

        if (espanso) {
            return orariFilm;
        }

        return {
            [oggi]: orariFilm[oggi] || [],
        };
    };

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

        return Object.entries(orariFiltrati).map(([data, orari]) => {
            if (!orari?.length) return null;

            const { isToday, formatted } = formatShowDate(data);

            return (
                <Orari
                    key={data}
                    data={{ isToday, formatted }}
                    orari={orari}
                    onOrarioClick={(proiezione: Proiezione) => {
                        // Construct the full ISO date string by combining the date and time
                        const fullDate = `${data}T${proiezione.data_ora}:00`;
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