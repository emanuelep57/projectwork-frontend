//hook che gestisce: Caricamento dei dati dei posti disponibili e dei posti occupati, selezione dei posti
import { useState, useEffect } from 'react';
import { postoAPI } from '@/services/posti.ts';
import { Posto, PostoSelezionato } from '../types/posto';


export const useSeats = (idProiezione: number | undefined) => {

    const [datiPosti, setDatiPosti] = useState<Posto[]>([]);
    const [postiOccupati, setPostiOccupati] = useState<string[]>([]);
    const [postiSelezionati, setPostiSelezionati] = useState<PostoSelezionato[]>([]);
    const [caricamento, setCaricamento] = useState(true);
    const [errore, setErrore] = useState<string | null>(null);

    //carico i dati dei posti
    useEffect(() => {
        const caricaPosti = async () => {
            // Se l'ID della proiezione non è valido, esci senza fare nulla
            if (!idProiezione) return;

            try {
                // Carica i dati dei posti e i posti occupati in parallelo
                const [posti, occupati] = await Promise.all([
                    postoAPI.fetchPosti(idProiezione), // Dati di tutti i posti
                    postoAPI.fetchPostiOccupati(idProiezione), // Elenco dei posti occupati
                ]);

                // Salva i dati dei posti nello stato
                setDatiPosti(posti);

                // Converte i posti occupati in un array di stringhe (es: "A1", "B2")
                setPostiOccupati(occupati.map(posto => `${posto.fila}${posto.numero}`));
            } catch (err) {
                // Gestione degli errori
                setErrore(err instanceof Error ? err.message : 'Si è verificato un errore');
            } finally {
                // Termina lo stato di caricamento
                setCaricamento(false);
            }
        };

        caricaPosti();
    }, [idProiezione]); // Dipende dall'ID della proiezione


    //Funzione per gestire la selezione o deselezione di un posto.
    const gestisciSelezionePosto = (fila: string, numeroPosto: number) => {
        // Crea l'identificativo univoco del posto e.g. "A1"
        const idPosto = `${fila}${numeroPosto}`;

        // Se il posto è occupato, non consentire la selezione
        if (postiOccupati.includes(idPosto)) return;

        // Trova i dati completi del posto nei dati caricati
        const posto = datiPosti.find(
            posto => posto.fila === fila && posto.numero === numeroPosto
        );

        // Se il posto non è nei dati, esci senza fare nulla
        if (!posto) return;

        // Creo un oggetto con i dettagli del posto selezionato
        const infoPosto: PostoSelezionato = {
            id: posto.id,  // ID univoco del posto
            etichetta: idPosto,   // Identificativo leggibile (es: "A1")
            fila,                 // Fila del posto
            numero: numeroPosto,  // Numero del posto
        };

        // Aggiorna lo stato dei posti selezionati
        setPostiSelezionati(prev => {

            // Controlla se il posto è già selezionato
            const selezionato = prev.some(posto => posto.id === infoPosto.id);

            // Se è già selezionato, lo deseleziono altrimenti lo aggiungo
            return selezionato
                ? prev.filter(posto => posto.id !== infoPosto.id)
                : [...prev, infoPosto];
        });
    };

    // Restituisce i dati e le funzioni per gestire i posti
    return {
        datiPosti,
        postiOccupati,
        postiSelezionati,
        caricamento,
        errore,
        gestisciSelezionePosto,
    };
};
