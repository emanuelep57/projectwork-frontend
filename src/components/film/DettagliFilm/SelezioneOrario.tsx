import { Clock } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Proiezione } from "@/types/proiezione";
import { Button } from "@/components/ui/button";

interface SelezioneOrarioProps {
    proiezioni: Proiezione[]; // Array delle proiezioni
    onSelezionaOrario: (proiezione: Proiezione) => void; // Funzione per gestire la selezione di un orario.
}

export const SelezioneOrario = ({proiezioni, onSelezionaOrario}: SelezioneOrarioProps) => {
    return (
        <div className="space-y-4">
            {/* Intestazione */}
            <h3 className="font-medium flex items-center gap-2">
                <Clock className="text-primary" size={18} /> {/* Icona "orologio" */}
                Seleziona Orario
            </h3>

            {/* Verifico prima se ci sono proiezioni disponibili */}
            {proiezioni.length > 0 ? (
                // Griglia con pulsanti per ogni orario di proiezione
                <div className="grid grid-cols-2 gap-3">
                    {proiezioni.map((proiezione) => (
                        <Button
                            key={proiezione.id} // l'id funziona come chiave perché univoco
                            onClick={() => onSelezionaOrario(proiezione)} // Chiama la funzione per selezionare l'orario.
                            variant="outline"
                            className="h-auto py-3 hover:border-primary hover:text-primary"
                        >
                            {/* Contenuto del pulsante*/}
                            <div className="flex flex-col items-center gap-1">
                                {/* Orario della proiezione*/}
                                <span className="text-lg font-semibold">
                                    {format(parseISO(proiezione.data_ora), "HH:mm")}
                                </span>
                                {/* Sala */}
                                <span className="text-sm text-muted-foreground">
                                    Sala {proiezione.sala}
                                </span>
                                {/* Prezzo */}
                                <span className="text-sm text-muted-foreground">
                                    €{proiezione.costo}
                                </span>
                            </div>
                        </Button>
                    ))}
                </div>
            ) : (
                // Messaggio mostrato quando non ci sono orari disponibili
                <div className="text-center py-8 text-muted-foreground">
                    Nessun orario disponibile per questa data
                </div>
            )}
        </div>
    );
};
