import {OrariProps} from "@/types/proiezione.ts";
import { Button } from "@/components/ui/button.tsx";

// Mostra la data e gli orari disponibili per un singolo giorno
const Orari = ({ date, times, onTimeSelect }: OrariProps) => (
    <div className="space-y-3">
        {/* Mostra la data della proiezione. Se è oggi, aggiunge "OGGI" */}
        <div className="text-primary">
            {date.isToday && <span className="mr-2">OGGI</span>}
            <span>{date.formatted}</span>
        </div>

        {/* Lista degli orari di proiezione */}
        <div className="flex flex-wrap gap-3">
            {times.map((show, index) => (
                // Pulsante per ogni orario di proiezione
                <Button
                    key={index}
                    variant="secondary" // Stile pulsante preso da shadcn
                    onClick={onTimeSelect} //chiama la funzione che ci reindirizza alla pagina di acquisto quando l'orario viene cliccato
                    className="flex-col h-auto py-2"
                >
                    {/* Ora della proiezione */}
                    <span className="text-lg">{show.data_ora}</span>

                    {/* Scritta 4K per farlo sembrare più realistico */}
                    <span className="text-xs text-muted-foreground">
                        4K ULTRA
                    </span>
                </Button>
            ))}
        </div>
    </div>
);

export default Orari;
