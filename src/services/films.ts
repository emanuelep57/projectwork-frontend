import { Film } from "@/types/film.ts";

const URL_BASE = `${import.meta.env.VITE_API_URL}/films`;

export const filmAPI = {

    // Metodo per ottenere tutti i film
    async fetchFilms(): Promise<Film[]> {
        const response = await fetch(`${URL_BASE}`);
        if (!response.ok) {
            throw new Error(`Errore nel fetch dei film: ${response.status} ${response.statusText}`);
        }
        return response.json();
    },

    // Metodo per ottenere i dettagli di un film specifico
    async fetchDettagli(id: number): Promise<Film> {
        const response = await fetch(`${URL_BASE}/${id}`);
        if (!response.ok) {
            throw new Error(`Errore nel fetch dei dettagli del film: ${response.status} ${response.statusText}`);
        }
        return response.json();
    },
};
