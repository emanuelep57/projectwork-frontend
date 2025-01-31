import {Clock, Film, MapPin} from "lucide-react";
import {MovieInfoProps} from "@/types/film.ts";

export const MovieInfo= ({ titolo, sala, data_ora }: MovieInfoProps) => (
    <div className="bg-muted/5 border-b border-border">
        <div className="container mx-auto py-4 px-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                <h1 className="text-xl font-bold text-primary flex items-center gap-2">
                    <Film className="w-5 h-5" />
                    {titolo || "Errore"}
                </h1>
                <div className="flex items-center gap-6 text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{sala || "Errore"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>
                            {data_ora || "Errore"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
