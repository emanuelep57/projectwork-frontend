import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, Pagination, Autoplay, EffectFade} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import {useNavigate} from "react-router-dom";
import {Film, HeroHomepageProps} from "@/types/film.ts";


const HeroSection = ({films} : HeroHomepageProps) => {

    const navigate = useNavigate()

    const filmClick = (filmId: number) => {
        navigate(`/movie/${filmId}`)
    }

    return (
        //definizione del componente swiper (funziona come un carosello) e delle sue props
        <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectFade]}
            slidesPerView={1} //1 sola immagine visibile alla volta
            navigation //aggiunge i bottoni per scorrere le immagini manualmente
            pagination={{clickable: true}} //aggiunge gli indicatori delle immagini sotto
            autoplay={{delay: 6500}} //scorre automaticamente le immagini dopo 6.5 secondi
            effect="fade" //aggiunge l'effetto
            loop={true} //le immagini scorrono in loop
            className="w-full heroHeight" //heroheight è definito in index.css, praticamente altezapagina - navbar
        >

            {/*per ogni film mi creo una Slide con l'immagine a schermo intero
                + il titolo sopra l'immagine e i bottoni */}
            {films.map((film : Film, index: number  ) => (
                <SwiperSlide key={index}>
                    <div className="relative w-full h-full cursor-pointer">
                        <img
                            src={film.url_copertina}
                            alt={film.titolo}
                            className="w-full h-full object-cover"
                        />
                        {/* questo div copre tutta l'immagine ed aggiunge un gradiente dal basso verso l'alto,
                            partendo da nero in basso fino ad arrivare ad essere trasparente in alto, rende più distinguibile
                            il titolo del film con il bottone che si trovano in basso */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
                            {/*questa invece è la sezione in basso a sinistra sull'immagine dove posiziono il titolo con i bottoni */}
                            <div className="absolute bottom-8 left-4 md:bottom-16 md:left-16 max-w-xl">
                                <h1 className="text-2xl md:text-5xl font-bold mb-2 md:mb-8">{film.titolo}</h1>
                                <div className="flex space-x-3 md:space-x-4">
                                    <button
                                        className="bg-primary/85 text-white px-4 py-2 md:px-8 md:py-3 rounded text-sm md:text-base font-medium hover:bg-primary transition-colors"
                                        onClick={() => filmClick(film.id)}>
                                        ACQUISTA ORA
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default HeroSection;
