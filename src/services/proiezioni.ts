import { Proiezione } from "@/types/proiezione.ts";

const API_BASE_URL = 'http://localhost:5000/api/proiezioni';

export const proiezioneAPI = {
    async fetchProiezioni(id: number): Promise<Proiezione[]> {
        const response = await fetch(`${API_BASE_URL}/?film_id=${id}`);
        if (!response.ok) {
            throw new Error(`Errore nel fetch delle proiezioni del film: ${response.status} ${response.statusText}`);
        }
        return response.json();
    },
};