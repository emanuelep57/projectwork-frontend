//TODO IMPLEMENTA DESCRIZIONE 

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { X } from "lucide-react";
import { SelezioneOrario } from "@/components/film/DettagliFilm/SelezioneOrario.tsx";
import { Proiezione } from "@/types/proiezione";
import { Button } from "@/components/ui/button";
import { SelezioneData } from "@/components/film/DettagliFilm/SelezioneData.tsx";

interface SidebarMobileProps {
    aperto: boolean; // Stato di apertura e chiusura
    onCambiaStatoAperto: (aperto: boolean) => void; // Callback per modificare lo stato di apertura.
    dateDisponibili: Date[]; // Elenco delle date disponibili per la selezione.
    dataSelezionata: Date | null; // Data attualmente selezionata dall'utente.
    proiezioni: Proiezione[]; // Elenco degli orari di proiezione disponibili per la data selezionata.
    onSelezionaData: (data: Date) => void; // Callback per gestire la selezione di una data.
    onSelezionaOrario: (proiezione: Proiezione) => void; // Callback per gestire la selezione di un orario.
}

export const SidebarMobile = ({aperto, onCambiaStatoAperto, dateDisponibili, dataSelezionata,
                                  proiezioni, onSelezionaData, onSelezionaOrario,}: SidebarMobileProps) => {
    return (
        <Sheet open={aperto} onOpenChange={onCambiaStatoAperto}>
            {/* Contenuto dello sheet, posizionato nella parte bassa dello schermo */}
            <SheetContent side="bottom" className="h-[85vh] p-0">
                {/* Intestazione */}
                <SheetHeader className="p-6 border-b">
                    <SheetTitle className="flex items-center justify-between">
                        <span>Acquista Biglietti</span>
                        {/* Pulsante per chiudere il pannello */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onCambiaStatoAperto(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </SheetTitle>
                </SheetHeader>

                {/* Contenuto principale dello sheet per selezionare data e orario */}
                <div className="p-6 space-y-6 overflow-y-auto h-full">
                    <SelezioneData
                        dateDisponibili={dateDisponibili}
                        dataSelezionata={dataSelezionata}
                        onSelezionaData={onSelezionaData}
                        vistaMobile
                    />

                    {dataSelezionata && (
                        <SelezioneOrario
                            proiezioni={proiezioni}
                            onSelezionaOrario={onSelezionaOrario}
                        />
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
};
