import { Order, OrderUpdateRequest, SeatChangeRequest } from '@/types/ordine';

const BASE_URL = 'http://localhost:5000/api/ordini';

export const ordineAPI = {
    //TODO IMPLEMENTARE (DA BACKEND E RICHIAMARE QUI) UN ENDPOINT PER ELIMINARE DEI POSTI O AGGIUNGERNE.

    //funzione che effettua il fetch degli ordini dell'utente
    async fetchOrdini(): Promise<Order[]> {
        const response = await fetch(`${BASE_URL}/ordini`, {
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
        const response = await fetch(`${BASE_URL}/${orderId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`Errore durante la cancellazione della prenotazione ${response.status} ${response.statusText}`);
        }
    },

    //funzione per cambiare sia la data della proiezione sia il posto, perché se si cambia data bisogna scegliere per forza un nuovo posto.
    async cambiaDataProiezione(data: OrderUpdateRequest): Promise<void> {
        const response = await fetch(`${BASE_URL}/change-projection-and-seats`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Non è stato possibile modificare la prenotazione ${response.status} ${response.statusText}`);
        }
    },

    //funziona invece per cambiare solo il posto
    async cambiaPosto(data: SeatChangeRequest): Promise<void> {
        const response = await fetch(`${BASE_URL}/change-seats`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Non è stato possibile modificare la prenotazione ${response.status} ${response.statusText}`);
        }
    }
};