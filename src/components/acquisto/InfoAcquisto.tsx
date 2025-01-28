import React from "react";
import {Clock, Film, MapPin} from "lucide-react";

interface MovieInfoProps {
    title: string;
    sala: string;
    showtime: string;
}

export const MovieInfo: React.FC<MovieInfoProps> = ({ title, sala, showtime }) => (
    <div className="bg-muted/5 border-b border-border">
        <div className="container mx-auto py-4 px-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                <h1 className="text-xl font-bold text-primary flex items-center gap-2">
                    <Film className="w-5 h-5" />
                    {title || "Select your seats"}
                </h1>
                <div className="flex items-center gap-6 text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>Sala {sala || "1"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{showtime ? new Date(showtime).toLocaleTimeString('it-IT', {
                            hour: '2-digit',
                            minute: '2-digit'
                        }) : "Select time"}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
