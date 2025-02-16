import {Clock, User} from "lucide-react";
import {DettagliProps} from "@/types/film.ts";

//semplice componente che mostra i dettagli come durata e regista.
export const Dettagli = ({ film }: DettagliProps) => {
    return (
        <div className="flex flex-wrap gap-6 text-sm text-white/80 mb-6">
            <div className="flex items-center gap-2">
                <Clock className="text-primary" size={18} />
                <span>{film.durata} min</span>
            </div>
            <div className="flex items-center gap-2">
                <User className="text-primary" size={18} />
                <span>{film.regista}</span>
            </div>
        </div>
    );
};