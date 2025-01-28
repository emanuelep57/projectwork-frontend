import { format } from "date-fns";
import { it } from "date-fns/locale";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SelezioneDataProps {
    dateDisponibili: Date[]; // Array delle date disponibili
    dataSelezionata: Date | null; // Data attualmente selezionata (null se nessuna è selezionata)
    onSelezionaData: (data: Date) => void; // Funzione chiamata quando una data viene selezionata
    vistaMobile?: boolean; // variabile per cambiare l'aspetto del componente quando si passa a mobile
}

// - Mobile: le date vengono mostrare in un menù scorrevole orizzontalmente
// - Desktop: Le date vengono mostrate in un elenco verticale
export const SelezioneData = ({dateDisponibili, dataSelezionata, onSelezionaData, vistaMobile = false}: SelezioneDataProps) => {

    // Componente mobile
    if (vistaMobile) {
        return (
            <div className="space-y-4">

                {/* Intestazione */}
                <div className="flex items-center gap-2 text-sm">
                    <CalendarDays className="text-primary" size={18} />
                    <span className="font-medium">Seleziona Data</span>
                </div>

                {/* Contenitore orizzontale */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {dateDisponibili.map((data) => (
                        <Button
                            key={data.toISOString()} // La data è unica quindi va bene come key
                            variant={dataSelezionata?.getTime() === data.getTime() ? "default" : "outline"} // Lo stile del pulsante cambia per la data selezionata
                            className="min-w-[120px]"
                            onClick={() => onSelezionaData(data)} // Imposta la data selezionata
                        >
                            <div className="flex flex-col">
                                {/* Giorno della settimana*/}
                                <span className="text-sm">{format(data, "EEE", { locale: it })}</span>
                                {/* Giorno del mese*/}
                                <span className="text-lg font-semibold">{format(data, "d", { locale: it })}</span>
                            </div>
                        </Button>
                    ))}
                </div>
            </div>
        );
    }

    // Componente desktop
    return (
        <div className="space-y-4">
            {/* Intestazione */}
            <div className="flex items-center gap-2 text-sm">
                <CalendarDays className="text-primary" size={18} />
                <span className="font-medium">Seleziona Data</span>
            </div>

            {/* Elenco verticale delle date, cambia solo lo stile in cui vengono mostrate, stessa logica del mobile */}
            <div className="flex flex-col gap-2">
                {dateDisponibili.map((data) => (
                    <Button
                        key={data.toISOString()}
                        variant={dataSelezionata?.getTime() === data.getTime() ? "default" : "outline"}
                        className="w-full justify-between h-auto py-3 px-4"
                        onClick={() => onSelezionaData(data)}
                    >
                        <div className="flex flex-col items-start">
                            <span className="text-sm text-muted-foreground">
                                {format(data, "EEEE", { locale: it })}
                            </span>
                            <span className="font-semibold">
                                {format(data, "d MMMM", { locale: it })}
                            </span>
                        </div>
                    </Button>
                ))}
            </div>
        </div>
    );
};
