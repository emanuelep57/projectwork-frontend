import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SelezioneOrario } from "@/components/film/DettagliFilm/SelezioneOrario.tsx";
import {SidebarMobileProps} from "@/types/proiezione";
import { SelezioneData } from "@/components/film/DettagliFilm/SelezioneData.tsx";


//sidebar mobile che in realtà è uno sheet che si apre dal basso per essere più comoda
//mi mostra i giorni e gli orari con un menù che poi scorro in orizzontale
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
