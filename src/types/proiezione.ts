// types/proiezione.ts

// Base interface for projection data
import type {Film} from "@/types/film.ts";

export interface Proiezione {
    id: string;
    data_ora: string;
    sala_id: string;
    costo?: number;
}

// Interface for raw projection data from API
export interface DatiProiezione {
    id: string;
    data_ora: string;
    sala_id: string;
    sala?: string; // Add this line
    costo?: number;
}

// Interface for grouped projections by date
export interface ProiezioniPerData {
    [data: string]: Proiezione[];
}

export interface SezioneOrariProps {
    films: Film[]; // Array di film da visualizzare nel carosello
}


// Interface for raw projections grouped by date
export interface ProiezioniRaggruppate {
    [date: string]: DatiProiezione[];
}

// Interface for projections grouped by film
export interface ProiezioniPerFilm {
    [filmId: number]: ProiezioniPerData;
}

export interface OrariProps {
    date: {
        isToday: boolean; // Indica se la data rappresenta oggi
        formatted: string; // Data formattata da visualizzare
    };
    times: Proiezione[]; // Lista degli orari di proiezione
    onTimeSelect: () => void; // Funzione callback chiamata quando si seleziona un orario
}

export interface ListaOrariProps {
    filmId: number; // ID del film corrente
    orariProiezione: ProiezioniPerFilm; // È l'oggetto che contiene gli orari di proiezione organizzati per giorno
    espanso: boolean; // Indica se la lista è espansa (mostra tutti i giorni) o compressa (mostra solo le proiezioni di oggi)
    onToggleEspanso: (filmId: number) => Promise<void>; // Cambia lo stato espanso/compresso
    caricamento: boolean;
}
