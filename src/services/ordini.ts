import {AggiungiBigliettiResponse, Ordine} from '@/types/ordine';

const URL_BASE = `${import.meta.env.VITE_API_URL}/ordini`;

export const ordineAPI = {

    //funzione che effettua il fetch degli ordini dell'utente
    async fetchOrdini(): Promise<Ordine[]> {
        const response = await fetch(`${URL_BASE}`, {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`Non è stato possibile recuperare gli ordini ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.orders;
    },

    //funzione che elimina una prenotazione / ordine
    async eliminaOrdine(orderId: number): Promise<void> {
        const response = await fetch(`${URL_BASE}/${orderId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`Errore durante la cancellazione della prenotazione ${response.status} ${response.statusText}`);
        }
    },

    async rimuoviPosto(ordineId: number, idPosto: number): Promise<void> {
        const response = await fetch(`${URL_BASE}/${ordineId}/rimuovi-posto`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ idPosto })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Impossibile rimuovere il posto: ${errorText}`);
        }
    },

    async aggiungiBigliettiAOrdine(ordineId: number, biglietti: {
        id_posto: number,
        nome_ospite?: string,
        cognome_ospite?: string
    }[]): Promise<AggiungiBigliettiResponse> {
        const response = await fetch(`${URL_BASE}/${ordineId}/aggiungi-posto`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ biglietti })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Impossibile aggiungere i biglietti: ${errorText}`);
        }

        return response.json();
    }
};