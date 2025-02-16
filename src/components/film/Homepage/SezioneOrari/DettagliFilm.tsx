import {MovieDetailsProps} from "@/types/film.ts";

//semplice componente con dettagli minimi riguardo generi, regia e durata
export const DettagliFilm = ({titolo, generi, regista, durata}: MovieDetailsProps) => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-2 text-white">{titolo}</h2>
            <div className="space-y-2 text-white mb-6">
                {generi && generi.length > 0 && (
                    <p>Genere: {generi.join(", ")}</p>
                )}
                {regista && <p>Regia: {regista}</p>}
                {durata && <p>Durata: {durata} min.</p>}
            </div>
        </div>
    )
}
