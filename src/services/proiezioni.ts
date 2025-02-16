import { Proiezione } from "@/types/proiezione.ts";

const URL_BASE = `${import.meta.env.VITE_API_URL}/proiezioni`;

export const proiezioneAPI = {
    async fetchProiezioni(id: number): Promise<Proiezione[]> {
        const response = await fetch(`${URL_BASE}/?film_id=${id}`);
        if (!response.ok) {
            throw new Error(`Errore nel fetch delle proiezioni del film: ${response.status} ${response.statusText}`);
        }
        return response.json();
    },
};