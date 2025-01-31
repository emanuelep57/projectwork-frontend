import {Posto} from "@/types/posto.ts";
import {Proiezione} from "@/types/proiezione.ts";

export interface BigliettoOrdine {
    id: number;
    posti:Array<Posto>;
    nome_ospite?: string;
    cognome_ospite?: string;
}

export interface Ordine {
    id: number;
    data_acquisto: string;
    proiezione: {
        id: number;
        film_id: number;
        film_titolo: string;
        data_ora: string;
        costo: number;
    };
    pdf_url?: string;
    biglietti: BigliettoOrdine[];
}

export interface PropsDialogoProiezione {
    isOpen: boolean;
    onClose: () => void;
    ordineSelezionato: Ordine | null;
    proiezioniDisponibili: Proiezione[];           // Lista delle proiezioni che l'utente può scegliere
    proiezioneTemporanea: string;                      // ID della proiezione temporaneamente selezionata
    onCambioProiezione: (valore: string) => void;
    onConferma: () => Promise<void>;
}

export interface SchedaOrdineProps {
    ordine: Ordine;
    isOrdineFuturo: boolean;
    onModificaPosti: (ordine: Ordine) => void;
    onModificaOrdine: (ordine: Ordine) => void;
    onEliminaOrdine: (ordineId: number) => void;
}

export interface RichiestaCambioPosto {
    id_ordine: number;
    nuovi_posti: { id_posto: number }[];
}

export interface RichiestaAggiornamentoOrdine extends RichiestaCambioPosto {
    id_nuova_proiezione: number;
}

