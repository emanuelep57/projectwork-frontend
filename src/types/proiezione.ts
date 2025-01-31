import type {Film} from "@/types/film.ts";

export interface Proiezione {
    id: string;
    data_ora: string;
    sala?: string;
    costo?: number;
}

export interface ProiezioniPerData {
    [data: string]: Proiezione[];
}

export interface ProiezioniPerFilm {
    [filmId: number]: ProiezioniPerData;
}

export interface SezioneOrariProps {
    films: Film[]; // Array di film da visualizzare nel carosello
}

export interface OrariProps {
    data: {
        isToday: boolean; // Indica se la data rappresenta oggi
        formatted: string; // Data formattata da visualizzare
    };
    orari: Proiezione[]; // Lista degli orari di proiezione
    onOrarioClick: (proiezione: Proiezione) => void; // Funzione callback chiamata quando si seleziona un orario
}

export interface ListaOrariProps {
    filmId: number; // ID del film corrente
    titolo: string;
    orariProiezione: ProiezioniPerFilm; // È l'oggetto che contiene gli orari di proiezione organizzati per giorno
    espanso: boolean; // Indica se la lista è espansa (mostra tutti i giorni) o compressa (mostra solo le proiezioni di oggi)
    onToggleEspanso: (filmId: number) => Promise<void>; // Cambia lo stato espanso/compresso
    caricamento: boolean;
}

export interface SidebarBase {
    dateDisponibili: Date[]; // Array delle date disponibili
    dataSelezionata: Date | null; // Data attualmente selezionata (null se nessuna è selezionata)
    onSelezionaData: (data: Date) => void; // Funzione chiamata quando una data viene selezionata
}

export interface SelezioneDataProps extends SidebarBase{
    vistaMobile?: boolean; // variabile per cambiare l'aspetto del componente quando si passa a mobile
}

export interface SelezioneOrarioProps {
    proiezioni: Proiezione[]; // Array delle proiezioni
    onSelezionaOrario: (proiezione: Proiezione) => void; // Funzione per gestire la selezione di un orario.
}

export interface SidebarProps extends SidebarBase, SelezioneOrarioProps {
}

export interface SidebarMobileProps extends SidebarProps{
    aperto: boolean; // Stato di apertura e chiusura
    onCambiaStatoAperto: (aperto: boolean) => void; // Callback per modificare lo stato di apertura.
}