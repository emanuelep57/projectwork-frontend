// hooks/useOrdini.ts

import { useState, useEffect } from 'react';
import { parseISO } from 'date-fns';
import { Ordine } from '@/types/ordine';
import { ordineAPI } from '@/services/ordini';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';


 //Hook che permette di recuperare, filtrare e eliminare gli ordini e divide gli ordini tra futuri e passati
export const useOrdini = () => {
    const [ordiniFuturi, setOrdiniFuturi] = useState<Ordine[]>([]);
    const [ordiniPassati, setOrdiniPassati] = useState<Ordine[]>([]);
    const [inCaricamento, setInCaricamento] = useState(true);
    const [errore, setErrore] = useState<string | null>(null);
    const { autenticato } = useAuth();

    //fetch di tutti gli ordini
    const fetchOrdini = async () => {
        if (!autenticato) return;

        try {
            setInCaricamento(true);
            // Chiamata all'API per recuperare gli ordini
            const ordini = await ordineAPI.fetchOrdini();
            const adesso = new Date();

            const futuri: Ordine[] = [];
            const passati: Ordine[] = [];

            // Smisto, in base al tempo attuale gli ordini passati e futuri
            ordini.forEach((ordine) => {
                const dataProiezione = parseISO(ordine.proiezione.data_ora);
                if (dataProiezione > adesso) {
                    futuri.push(ordine);
                } else {
                    passati.push(ordine);
                }
            });

            setOrdiniFuturi(futuri);
            setOrdiniPassati(passati);
        } catch (errore) {
            const messaggio = errore instanceof Error ? errore.message : 'Errore sconosciuto';
            setErrore(messaggio);
            toast({
                title: "Errore",
                description: messaggio,
                variant: "destructive"
            });
        } finally {
            setInCaricamento(false);
        }
    };

    //Elimina un ordine
    const eliminaOrdine = async (idOrdine: number) => {
        try {
            await ordineAPI.eliminaOrdine(idOrdine);
            //lo rimuovo dagli ordini futuri, ovviamente non avrebbe senso cancellare un ordine passato.
            setOrdiniFuturi(prev => prev.filter(ordine => ordine.id !== idOrdine));
            toast({
                title: "Successo",
                description: "SchedaOrdine eliminato con successo"
            });
        } catch (errore) {
            toast({
                title: "Errore",
                description: errore instanceof Error ? errore.message : 'Impossibile eliminare l\'ordine',
                variant: "destructive"
            });
        }
    };

    // Effettua il recupero degli ordini quando cambia lo stato di autenticazione
    useEffect(() => {
        fetchOrdini();
    }, [autenticato]);

    return {
        ordiniFuturi,
        ordiniPassati,
        inCaricamento,
        errore,
        fetchOrdini,
        eliminaOrdine
    };
};