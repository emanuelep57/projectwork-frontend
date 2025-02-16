import {PostoUtente} from "@/types/posto.ts";

export interface Biglietto {
    id_biglietto: number;
    posti: PostoUtente[];
    film_titolo: string;
    data_ora: string;
    sala_nome: string;
    pdf_url: string;
    nome_titolare?: string;
    cognome_titolare?: string;
}

// First, let's update the BigliettoOrdine interface in ordine.ts
export interface BigliettoOrdine {
    id_biglietto: number;
    posti: PostoUtente[]; // Change this from Posto[] to PostoUtente[]
}