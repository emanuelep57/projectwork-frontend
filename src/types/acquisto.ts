//TODO FIXARE I FILE DEI TIPI IN MODO DA RENDERLO ORDINATO.
import {PostoSelezionato} from "@/types/posto.ts";

export interface CheckoutSheetProps {
    aperto: boolean; // Stato per determinare se lo sheet è visibile
    onStatoChange: (aperto: boolean) => void; // funzione per aggiornare lo stato dello sheet
    postiSelezionati: PostoSelezionato[]; // elenco dei posti selezionati
    idProiezione: number; // ID della proiezione
    dettagliOspite?: { [numeroPosto: string]: { nome: string; cognome: string } }; // nome e cognome degli ospiti per ogni posto
    onSuccess: () => void; //Funzione che reindirizza e scarica il pdf in caso vada a buon fine
    costo: number; // Costo per posto
}
