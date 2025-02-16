import {Posto} from "@/types/posto.ts";

const URL_BASE = `${import.meta.env.VITE_API_URL}/posti`;

export const postoAPI = {

    //qui prendo tutti i posti in sala per una specifica proiezione
    async fetchPosti(IdProiezione: number): Promise<Posto[]> {
        const response = await fetch(`${URL_BASE}/${IdProiezione}`);
        if (!response.ok)
            throw new Error(`Errore durante il caricamento dei posti ${response.status} ${response.statusText}`);
        return response.json();
    },

    //qui faccio il fetch dei posti occupati per la proiezione
    async fetchPostiOccupati(IdProiezione: number): Promise<{ fila: string; numero: number }[]> {
        const response = await fetch(`${URL_BASE}/occupati/${IdProiezione}`);
        if (!response.ok)
            throw new Error(`Errore durante il caricamento dei posti occupati ${response.status} ${response.statusText}`);
        return response.json();
    },
};
