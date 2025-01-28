export interface Film {
    id: number
    titolo: string
    url_copertina: string
    generi: string[]
    regista: string
    durata: number
    descrizione?: string
}

export interface HeroFilm {
    titolo: string
    url_copertina: string
    id: number
}

export interface DettagliFilm extends Film {
    descrizione: string
    durata: number  // Aggiunto qui anche per assicurarsi che sia presente
}

export interface CopertinaProps {
    id: number
    url: string
    titolo: string
}
