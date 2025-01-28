import { useNavigate } from "react-router-dom"
import {CopertinaProps} from "@/types/film.ts";

export const Copertina = ({ id, url, titolo }: CopertinaProps) => {
    const navigate = useNavigate()

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
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
        </div>
    )
}