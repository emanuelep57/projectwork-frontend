// Importazione delle dipendenze necessarie
import { useState, useCallback, useRef } from 'react'
import {proiezioneAPI} from "@/services/proiezioni.ts";
import {raggruppaDate} from "@/utils/dateFormatter.ts";
import {ProiezioniPerFilm} from "@/types/proiezione.ts";

// Hook personalizzato per gestire gli orari delle proiezioni
export const useProiezioni = () => {
    const [orari, setOrari] = useState<ProiezioniPerFilm>({})
    const [caricamento, setCaricamento] = useState<Record<string, boolean>>({})
    const [errore, setErrore] = useState<Record<string, string | null>>({})

    // Riferimento per evitare richieste multiple simultanee per lo stesso film
    const loadingRef = useRef<Set<number>>(new Set())

    // Funzione per recuperare gli orari delle proiezioni
    const fetchProiezioni = useCallback(async (filmId: number, soloOggi = false) => {

        // Controllo se il film è già stato fetchato
        if (loadingRef.current.has(filmId)) return;

        // Salta se abbiamo già i dati completi
        if (!soloOggi && orari[filmId] && Object.keys(orari[filmId]).length > 1) {
            return;
        }

        try {
            //aggiungo il film al ref e setto il caricamento a true
            loadingRef.current.add(filmId)
            setCaricamento(prev => ({ ...prev, [filmId]: true }))
            setErrore(prev => ({ ...prev, [filmId]: null }))

            // Recupera i dati
            const datiProiezione = await proiezioneAPI.fetchProiezioni(filmId)

            // Raggruppa le proiezioni per data
            let proiezioniRaggruppate = raggruppaDate(datiProiezione)

            // filtra solo per oggi
            if (soloOggi) {
                //prende la data di oggi
                const oggi = new Date().toISOString().split('T')[0]
                proiezioniRaggruppate = {
                    [oggi]: proiezioniRaggruppate[oggi] || []
                }
            }

            // Aggiorna lo stato
            setOrari(prev => ({
                ...prev,
                [filmId]: proiezioniRaggruppate
            }))

        } catch (errore) {
            // Gestione degli errori
            setErrore(prev => ({
                ...prev,
                //non necessario, ma typescript dava problemi con il tipo dell'errore.
                [filmId]: errore instanceof Error ? errore.message :`Errore nel recupero degli orari`,
            }))

        } finally {
            // Pulizia dello stato di caricamento
            loadingRef.current.delete(filmId)
            setCaricamento(prev => ({ ...prev, [filmId]: false }))
        }
    }, [orari])

    // Restituisce gli stati e la funzione di fetch
    return { orari, caricamento, errore, fetchProiezioni }
}