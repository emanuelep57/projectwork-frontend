import { format } from 'date-fns'
import { it } from 'date-fns/locale'
import type { DatiProiezione, ProiezioniRaggruppate } from '@/types/proiezione'

//TODO SEPARARE DATA E ORARIO SEMPLIFICHEREBBE QUESTO CODICE E SAREBBE PIÙ MANUTENIBILE.

//questa funzione deve raggruppare tutti gli orari delle proiezioni dello stesso giorno
//quindi le metto in un oggetto che ha come chiave la data
export const raggruppaDate = (proiezioni: DatiProiezione[]): ProiezioniRaggruppate => {

    const proiezioniRaggruppate: ProiezioniRaggruppate = {};

    proiezioni.forEach(datiProiezione => {
        //siccome io ho un campo DateTime avrebbe un formato del tipo: 2000-10-31T01:30:00.000-05:00
        //quindi siccome io voglio solo la data, prendo il valore prima della T.
        const dataProiezione = new Date(datiProiezione.data_ora).toISOString().split("T")[0];

        // Mi assicuro che la data non esista già
        if (!proiezioniRaggruppate[dataProiezione]) {
            // Se non esiste, inizializzo un array vuoto per quella data
            proiezioniRaggruppate[dataProiezione] = [];
        }

        // Aggiungo i dati della proiezione all'array della data
        proiezioniRaggruppate[dataProiezione].push({
            id: datiProiezione.id,           // Added this line
            sala_id: datiProiezione.sala_id,
            data_ora: format(new Date(datiProiezione.data_ora), "HH:mm"),
            sala: datiProiezione.sala,       // Optional property
            costo: datiProiezione.costo      // Optional property
        });
    })

    return proiezioniRaggruppate;
};

export const formatShowDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const isToday = date.toDateString() === new Date().toDateString()

    return {
        isToday,
        formatted: format(date, "EEE dd MMM", {locale: it}).toUpperCase()
    }
}