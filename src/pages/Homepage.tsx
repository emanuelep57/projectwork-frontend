import {useEffect, useState} from "react"
import {Skeleton} from "@/components/ui/skeleton"
import {Alert, AlertDescription} from "@/components/ui/alert"
import {AlertCircle} from "lucide-react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import HeroSection from "@/components/film/Homepage/HeroSection.tsx"
import MoviesCarousel from "@/components/film/Homepage/SezioneOrari/SezioneOrari.tsx"
import {filmAPI} from "@/services/films.ts";
import type {Film, HeroFilm} from "../types/film"

const CinemaHomepage = () => {
    const [films, setFilms] = useState<Film[]>([])
    const [caricamento, setCaricamento] = useState(true)
    const [errore, setErrore] = useState<string | null>(null)

    //effetto iniziale per caricare i film
    useEffect(() => {
        fetchFilms()
    }, [])

    //qui inizialmente mentre non ricevo tutti i film setto caricamento a true ed errore a false
    const fetchFilms = async () => {
        try {
            setCaricamento(true)
            setErrore(null)
            const data = await filmAPI.fetchFilms()
            setFilms(data)
        } catch (error) {
            //in caso di errore setto errore a true
            setErrore(error instanceof Error ? error.message : "Failed to fetch films")
        } finally {
            //terminata la richiesta setto caricamento a false
            setCaricamento(false)
        }
    }

    //in caricamento mostro degli skeleton semplicemente sotto l'header
    if (caricamento) {
        return (
            <div className="min-h-screen bg-black text-white">
                <Header/>
                <main>
                    <div className="h-full relative">
                        <Skeleton className="w-full h-full"/>
                    </div>
                    <section className="py-16 md:py-24">
                        <div className="container mx-auto px-4">
                            <div className="space-y-8">
                                <div className="flex gap-6">
                                    <Skeleton className="w-48 h-72"/>
                                    <div className="flex-1 space-y-4">
                                        <Skeleton className="h-8 w-2/3"/>
                                        <Skeleton className="h-4 w-1/3"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        )
    }

    //se c'è un errore uso l'alert per mostrare l'errore
    if (errore) {
        return (
            <div className="min-h-screen bg-black text-white p-4">
                <Header/>
                <main className="container mx-auto mt-8">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4"/>
                        <AlertDescription>{errore}</AlertDescription>
                    </Alert>
                </main>
            </div>
        )
    }

    // Transformo i dati in modo che siano fruibili per il componente HeroSection
    const heroData: HeroFilm[] = films.map(({titolo, url_copertina, id}) => ({
        titolo,
        url_copertina,
        id
    }));

    return (
        <div className="min-h-screen bg-black text-white">
            <Header/>
            <main>
                <HeroSection films={heroData}/>
                <section className="py-16 md:py-24">
                    <div className="container mx-auto px-4">
                        <MoviesCarousel films={films}/>
                    </div>
                </section>
            </main>
            <Footer/>
        </div>
    )
}

export default CinemaHomepage