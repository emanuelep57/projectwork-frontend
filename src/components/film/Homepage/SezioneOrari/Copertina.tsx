import { useNavigate } from "react-router-dom"
import {CopertinaProps} from "@/types/film.ts";

//componente che rappresenta la copertina della card, quando viene cliccata porta alla pagina dei dettagli sul film.
export const Copertina = ({ id, url, titolo }: CopertinaProps) => {
    const navigate = useNavigate()

    //tailwind docs : If you need to style an element based on the descendants of a parent element,
    //you can mark the parent with the group class and use the group-has-* variant to style the target element:
    return (
        <div className="w-32 md:w-48 flex-shrink-0">
            <div
                className="relative aspect-[2/3] rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => navigate(`/movie/${id}`)}
            >
                <img
                    src={url}
                    alt={titolo}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center" />
            </div>
        </div>
    )
}