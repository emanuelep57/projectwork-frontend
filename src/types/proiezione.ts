// types/proiezione.ts

// Base interface for projection data
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

export interface ProiezioniRaggruppate {
    [date: string]: Proiezione[];
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
