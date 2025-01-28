// Barra laterale (sidebar) che contiene le sezioni per la selezione di data e orario.
// L'utente può scegliere una data e un orario per essere indirizzato alla pagina di acquisto.

import { SelezioneOrario } from "@/components/film/DettagliFilm/SelezioneOrario.tsx";
import { SelezioneData } from "@/components/film/DettagliFilm/SelezioneData.tsx";
import { Proiezione } from "@/types/proiezione.ts";

interface SidebarProps {
    dateDisponibili: Date[]; //array delle date disponibili
    dataSelezionata: Date | null; //data selezionata
    proiezioni: Proiezione[]; //array di proiezioni disponibili per la data
    onSelezionaData: (data: Date) => void; //funzione chiamata quando si seleziona la data
    onSelezionaOrario: (proiezione: Proiezione) => void; //funzione chiamata quando si seleziona l'orario
}

export const Sidebar = ({dateDisponibili, dataSelezionata, proiezioni, onSelezionaData, onSelezionaOrario}: SidebarProps) => {
    return (
        // Container principale.
        <div className="hidden md:block w-[400px] border-l border-border/50 bg-background/95">
            {/*container sticky che abilità lo scroll verticale in caso i giorni e le date eccedano in lunghezza visivamente*/}
            <div className="sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
                <div className="p-6">
                    {/* intestazione */}
                    <h2 className="text-xl font-bold mb-6">Acquista Biglietti</h2>

                    {/*div che serve alla spaziatura verticale fra le date e gli orari.*/}
                    <div className="space-y-6">
                        <SelezioneData
                            dateDisponibili={dateDisponibili}
                            dataSelezionata={dataSelezionata}
                            onSelezionaData={onSelezionaData}
                        />
                        {/*gli orari vengono mostrati se la data viene selezionata*/}
                        {dataSelezionata && (
                            <SelezioneOrario
                                proiezioni={proiezioni}
                                onSelezionaOrario={onSelezionaOrario}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
