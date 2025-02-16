interface base {
    id: number
    titolo: string
    url_copertina: string
}

export interface Film extends base {
    generi: string[]
    regista: string
    durata: number
    descrizione?: string
}

// Changed to only require films array
export interface HeroHomepageProps {
    films: Film[]
}

export interface MovieDetailsProps {
    titolo: string
    generi: string[]
    regista: string
    durata: number
}

export interface DettagliProps {
    film: Film
}

export interface HeroDettagli extends DettagliProps {
    onAcquista?: () => void
}

export interface MovieInfoProps {
    titolo: string
    sala: string
    data_ora: string
}

export interface SinossiProps {
    descrizione: string
}

export interface CopertinaProps {
    id: number
    url: string
    titolo: string
}