import { Badge } from "@/components/ui/badge"; // Componente per etichette (badge)
import { Button } from "@/components/ui/button"; // Componente per bottoni
import {HeroDettagli} from "@/types/film"; // Tipo personalizzato per i film
import { Dettagli } from "@/components/film/DettagliFilm/Dettagli.tsx"; // Componente per i metadati del film


export const Hero = ({ film, onAcquista }: HeroDettagli) => {
    return (
        <div className="h-[70vh] relative">
            {/* Immagine di copertina */}
            <img
                src={film.url_copertina}
                alt={film.titolo}
                className="w-full h-full object-cover"
            />

            {/* Filtro gradient usato anche nella hero homepage sull'immagine */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

            {/* Contenuto */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="container mx-auto max-w-6xl">

                    {/* Mostro i generi del film come badge, che sarebbero delle specie di iconcine fornite da shadcn */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {film.generi?.map(genre => (
                            <Badge
                                key={genre} // Chiave unica per ogni genere
                                variant="secondary"
                                className="bg-primary/20 text-primary hover:bg-primary/30"
                            >
                                {genre}
                            </Badge>
                        ))}
                    </div>

                    {/* Titolo del film */}
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                        {film.titolo}
                    </h1>

                    {/* Dettagli del film */}
                    <Dettagli film={film} />

                    {/* Pulsante per acquistare i biglietti (solo su dispositivi mobili) */}
                    <Button
                        size="lg"
                        className="font-semibold md:hidden bg-primary hover:bg-primary/90"
                        onClick={onAcquista} // Callback al clic
                    >
                        Acquista Biglietti
                    </Button>
                </div>
            </div>
        </div>
    );
};
