import { Film } from "@/types/film.ts";

const API_BASE_URL = 'http://localhost:5000/api/films';

export const filmAPI = {
    // Metodo per ottenere tutti i film
    async fetchFilms(): Promise<Film[]> {
        const response = await fetch(`${API_BASE_URL}`);
        if (!response.ok) {
            throw new Error(`Errore nel fetch dei film: ${response.status} ${response.statusText}`);
        }
        return response.json();
    },

    // Metodo per ottenere i dettagli di un film specifico
    async fetchDettagli(id: number): Promise<Film> {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) {
            throw new Error(`Errore nel fetch dei dettagli del film: ${response.status} ${response.statusText}`);
        }
        return response.json();
    },
};
