const URL_BASE = `${import.meta.env.VITE_API_URL}/biglietti`; // Base URL per le chiamate API relative ai biglietti

export const bigliettoAPI = {
    /* Funzione per acquistare i biglietti per una specifica proiezione.
       parametri:
          - L'ID della proiezione per cui si vogliono acquistare i biglietti
          - Un Array di biglietti Ogni biglietto ha:
               `id`: ID del posto
               `dettagliOspite`: Nome e cognome delle persone per cui stiamo acquistando i biglietti

       ritorna un oggetto contenente:
           - `id_biglietti`: Array con gli ID dei biglietti acquistati
           - `url_pdf`: URL per scaricare i PDF dei biglietti
    */
    async acquistaBiglietti(
        IdProiezione: number,
        biglietti: Array<{
            id_posto: number;
            nome_ospite?: string;
            cognome_ospite?: string;
        }>
    ): Promise<{ id_biglietti: number[]; pdf_urls: string[] }> {
        const response = await fetch(`${URL_BASE}/acquisto`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({
                id_proiezione: IdProiezione,
                biglietti: biglietti,
            }),
        });

        if (!response.ok) {
            throw new Error(`Errore nell'acquisto dei biglietti: ${response.status} ${response.statusText}`);
        }

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
    }
};
