const URL_BASE = 'http://localhost:5000/api/biglietti'; // Base URL per le chiamate API relative ai biglietti

export const bigliettoAPI = {
     /* Funzione per acquistare i biglietti per una specifica proiezione.
        parametri:
           - L'ID della proiezione per cui si vogliono acquistare i biglietti
           - Un Array di biglietti Ogni biglietto ha:
                `id`: ID del posto
                `dettagliOspite` (opzionale): Nome e cognome delle persone per cui stiamo acquistando i biglietti

        ritorna un oggetto contenente:
            - `id_biglietti`: Array con gli ID dei biglietti acquistati
            - `url_pdf`: URL per scaricare i PDF dei biglietti
     */
    async acquistaBiglietti(
        IdProiezione: number,
        biglietti: Array<{ id: number; dettagliOspite?: { nome?: string; cognome?: string } }>
    ): Promise<{ ticket_ids: number[]; pdf_urls: string[] }> {

            const response = await fetch(`${URL_BASE}/acquisto`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }, // Indica che il corpo è in formato JSON
                credentials: 'include', // Invia i cookie per mantenere la sessione utente
                body: JSON.stringify({
                    id_proiezione: IdProiezione,
                    biglietti: biglietti.map(({ id, dettagliOspite }) => ({
                        id_posto: id, // ID del posto
                        nome_ospite: dettagliOspite?.nome, // Nome dell'ospite (se presente)
                        cognome_ospite: dettagliOspite?.cognome, // Cognome dell'ospite (se presente)
                    })),
                }),
            });

            // Controlla se la risposta è andata a buon fine
            if (!response.ok) {
                throw new Error(`Errore nel fetch delle proiezioni del film: ${response.status} ${response.statusText}`);
            }

            // Restituisci i dati della risposta come JSON
            return await response.json();

    },

    //Funzione per scaricare il pdf relativo all'ordine.
    async downloadPdf(pdfUrl: string): Promise<void> {

            // Effettua una richiesta per ottenere il file PDF
            const response = await fetch(pdfUrl);

            // Controlla se la risposta è valida
            if (!response.ok) {
                throw new Error(`Errore nel download del PDF: ${response.status} ${response.statusText}`);
            }

            // Converto la risposta in un file binario
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob); // Crea un URL temporaneo per il file

            // qui creo una sorta di autoclick del pdf, creando un elemento <a> che poi autoclicko
            const link = document.createElement('a');
            link.href = url;
            link.download = 'biglietto.pdf'; // Nome del file scaricato
            document.body.appendChild(link); // Aggiungi il link al DOM
            link.click(); // Simula un click per avviare il download
            link.remove(); // Rimuovi il link dal DOM

            // Rilascia la memoria associata all'URL temporaneo
            window.URL.revokeObjectURL(url);
    },
};
