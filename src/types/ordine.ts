import {Posto, PostoSelezionato} from "@/types/posto.ts";
import {Proiezione, ProiezioneTitolo} from "@/types/proiezione.ts";

interface BaseOrdine {
    id: number;
    data_acquisto: string;
    pdf_url?: string;
}

export interface BigliettoBase {
    id_biglietto: number;
    posti: Posto[];
}

export interface BigliettoOrdine extends BigliettoBase {
    nome_ospite?: string;
    cognome_ospite?: string;
}

export interface Biglietto extends BigliettoBase {
    film_titolo: string;
    data_ora: string;
    sala_nome: string;
    pdf_url?: string;
}


export interface Ordine extends BaseOrdine {
    proiezione: {
        id: number;
        film_id: number;
        film_titolo: string;
        data_ora: string;
        costo: number;
    };
    biglietti: BigliettoOrdine[];
}

export interface OrdineUtente extends BaseOrdine {
    proiezione: ProiezioneTitolo;
    biglietti: Biglietto[];
    nome_titolare?: string;
    cognome_titolare?: string;
}

export interface SchedaOrdineProps {
    ordine: Ordine;
    isOrdineFuturo: boolean;
    onModificaPosti: (ordine: Ordine) => void;
    onModificaOrdine: (ordine: Ordine) => void;
    onEliminaOrdine: (id: number) => void;
}

export interface ModalSelezionePostiProps {
    isAperto: boolean;
    onChiudi: () => void;
    ordineSelezionato: Ordine | null;
    postiDisponibili: Posto[];
    postiOccupati: Posto[];
    postiSelezionati: number[];
    errore: string | null;
    onTogglePosto: (idPosto: number) => void;
    onConferma: (ordine: Ordine) => void; // Updated signature
    isCambioProiezione?: boolean;
}

export interface RiepilogoOrdineProps {
    vistaMobile?: boolean;
    postiSelezionati: PostoSelezionato[];
    onIndietro: () => void;
    onConferma: (dettagliOspiti: {[chiave: string]: { nome: string; cognome: string }}) => void
    isProcessing: boolean;
    costo: number;
}

export interface RichiestaModificaOrdine {
    id_ordine: number;
    id_nuova_proiezione?: number;
    nuovi_posti?: { id_posto: number }[];
    posti_da_aggiungere?: number;
    posto_da_rimuovere?: number;
}

export interface PropsDialogoProiezione {
    isOpen: boolean;
    onClose: () => void;
    ordineSelezionato: Ordine | null;
    proiezioniDisponibili: Proiezione[];
    proiezioneTemporanea: string;
    onCambioProiezione: (valore: string) => void;
    onConferma: () => Promise<void>;
}

export interface RichiestaCambioPosto {
    id_ordine: number;
    nuovi_posti: { id_posto: number }[];
}

export interface RichiestaAggiornamentoOrdine extends RichiestaCambioPosto {
    id_nuova_proiezione: number;
}

export interface AggiungiBigliettiResponse {
    message: string;
    pdf_url: string;
}

export interface ModificaOrdineProps {
    ordine: Ordine;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}