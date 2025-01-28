// In questo Hook ho messo la logica che gestisce il caricamento dei dettagli e delle proiezioni disponibili
import { useState, useEffect } from 'react';
import { DettagliFilm } from '@/types/film';
import { Proiezione } from '../types/proiezione';
import { filmAPI } from '@/services/films';
import { format, parseISO, isSameDay } from 'date-fns';
import { proiezioneAPI } from "@/services/proiezioni.ts";

interface UseDettagli {
    film: DettagliFilm | null;
    proiezioni: Proiezione[];
    caricamento: boolean;
    errore: string | null;
    dataSelezionata: Date | null;
    dateDisponibili: Date[];
    setDataSelezionata: (data: Date | null) => void;
    getProiezioniPerData: (data: Date) => Proiezione[];
}

export const useDettagli = (idFilm: number): UseDettagli => {

    const [film, setFilm] = useState<DettagliFilm | null>(null);
    const [proiezioni, setProiezioni] = useState<Proiezione[]>([]);
    const [caricamento, setCaricamento] = useState<boolean>(true);
    const [errore, setErrore] = useState<string | null>(null);
    const [dataSelezionata, setDataSelezionata] = useState<Date | null>(null);
    const [dateDisponibili, setDateDisponibili] = useState<Date[]>([]);


    useEffect(() => {

        const caricaDati = async () => {
            try {
                // Carica i dettagli del film e le proiezioni in parallelo
                const [datiFilm, datiProiezioni] = await Promise.all([
                    filmAPI.fetchDettagli(idFilm),
                    proiezioneAPI.fetchProiezioni(idFilm)
                ]);

                // Aggiorna lo stato con i dati ricevuti
                setFilm(datiFilm as DettagliFilm);
                setProiezioni(datiProiezioni);

                //Allora, qui praticamente parto da tutte le datetime delle proiezioni e
                //le trasformo in Date, quindi giorno mese anno e le metto in un set così
                //da evitare doppioni e le mostro all'utente in ordine dalla più vicina
                const dateUniche = [...new Set(datiProiezioni.map(p =>
                    format(parseISO(p.data_ora), 'dd-MM-yyyy')
                ))]
                    .map(data => parseISO(data))
                    .sort((a, b) => a.getTime() - b.getTime());

                setDateDisponibili(dateUniche);


                const oggi = new Date();

                //di default prendo la data più vicina e la seleziono come attiva
                const dataPredefinita = dateUniche.find(data => data >= oggi) || dateUniche[0];
                setDataSelezionata(dataPredefinita);

            } catch (errore) {
                // Gestione degli errori
                setErrore(errore instanceof Error ? errore.message : 'Si è verificato un errore');
            } finally {
                // Disattiva lo stato di caricamento
                setCaricamento(false);
            }
        };

        caricaDati();
    }, [idFilm]);

    
     //Qui, passo la data come argomento e ritorno tutte le proiezioni ordinate per orario per quella data
    const getProiezioniPerData = (data: Date): Proiezione[] => {
        return proiezioni
            .filter(p => isSameDay(parseISO(p.data_ora), data))
            .sort((a, b) =>
                parseISO(a.data_ora).getTime() - parseISO(b.data_ora).getTime()
            );
    };

    // Restituisce tutti i dati e le funzioni necessari
    return {
        film,
        proiezioni,
        caricamento,
        errore,
        dataSelezionata,
        dateDisponibili,
        setDataSelezionata,
        getProiezioniPerData
    };
};
