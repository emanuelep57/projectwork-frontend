import {Posto} from "@/types/posto.ts";

const URL_BASE = `${import.meta.env.VITE_API_URL}/posti`;

export const postoAPI = {
    async fetchPosti(IdProiezione: number): Promise<Posto[]> {
        const response = await fetch(`${URL_BASE}/${IdProiezione}`);
        if (!response.ok) {
            throw new Error(`Errore durante il caricamento dei posti 
            ${response.status} ${response.statusText}`);
        }
        return response.json();
    },

    async fetchPostiOccupati(IdProiezione: number): Promise<Posto[]> {
        const response = await fetch(`${URL_BASE}/occupati/${IdProiezione}`);
        if (!response.ok) {
            throw new Error(`Errore durante il caricamento dei posti occupati ${response.status} ${response.statusText}`);
        }
        const postiOccupati = await response.json();

        // Assegniamo un ID negativo per i posti occupati
        return postiOccupati.map((posto: {fila: string; numero: number}, index: number) => ({
            id: -(index + 1), // ID negativo per distinguere i posti occupati
            fila: posto.fila,
            numero: posto.numero
        }));
    },
};