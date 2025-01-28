export interface BigliettoOrdine {
    id: number;
    posto: string;
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

export interface RichiestaAggiornamentoOrdine {
    id_ordine: number;
    id_nuova_proiezione: number;
    nuovi_posti: number[];
}

export interface RichiestaCambioPosto {
    id_ordine: number;
    nuovi_posti: number[];
}