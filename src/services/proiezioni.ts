import { Proiezione } from "@/types/proiezione.ts";

const API_BASE_URL = 'http://localhost:5000/api/proiezioni';

export const proiezioneAPI = {

    // Metodo per ottenere gli orari delle proiezioni di un film
    async getShowtimes(filmId: number): Promise<Proiezione[]> {
        const response = await fetch(`${API_BASE_URL}/${filmId}`);
        if (!response.ok) {
            throw new Error(`Errore nel fetch delle proiezioni del film: ${response.status} ${response.statusText}`);
        }
        return response.json();
    },

    // Metodo per ottenere le proiezioni basate su un ID
    async fetchProiezioni(id: number): Promise<Proiezione[]> {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) {
            throw new Error(`Errore nel fetch delle proiezioni del film: ${response.status} ${response.statusText}`);
        }
        return response.json();
    },
};
