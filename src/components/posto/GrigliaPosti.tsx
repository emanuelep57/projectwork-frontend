// Importazione dei componenti e dei tipi necessari
import { IconaPosto } from "@/components/posto/IconaPosto.tsx"; // Componente per l'icona del singolo posto
import { GrigliaPostiProps } from "@/types/posto.ts"; // Interfaccia delle props per la griglia

// Componente GrigliaPosti: Visualizza una griglia interattiva di posti a sedere
export const GrigliaPosti = ({
                                 file,
                                 postiPerFila,
                                 postiOccupati,
                                 postiSelezionati,
                                 onPostoClick,
                             }: GrigliaPostiProps) => (
    // Container principale
    <div className="w-full overflow-x-auto pb-4">
        {/* Container flex per le file */}
        <div className="flex flex-col items-center gap-0.5 sm:gap-1 md:gap-2 min-w-fit">
            {/* Mapping delle righe della griglia */}
            {file.map((fila) => (
                // Ogni fila ha la lettera corrispondente al lato
                <div key={fila} className="flex items-center justify-center gap-1 sm:gap-2">
                    {/* Lettera della fila */}
                    <span className="w-4 text-[10px] sm:text-xs text-center text-muted-foreground font-medium">
                        {fila}
                    </span>

                    {/* Container dei posti della fila */}
                    <div className="flex gap-0.5 sm:gap-1">
                        {/* Genera i posti per ogni riga basandosi su postiPerFila */}
                        {[...Array(postiPerFila)].map((_, indice) => (
                            // Bottone per ogni posto
                            <button
                                key={`${fila}${indice + 1}`}
                                onClick={() => onPostoClick(fila, indice + 1)}
                                // Disabilita il bottone se il posto è occupato
                                disabled={postiOccupati.includes(`${fila}${indice + 1}`)}
                                className="p-0.5"
                                aria-label={`Posto ${fila}${indice + 1}`}
                            >
                                {/* Componente IconaPosto con stati selezionato e occupato */}
                                <IconaPosto
                                    selezionato={postiSelezionati.some(
                                        (posto) => posto.etichetta === `${fila}${indice + 1}`
                                    )}
                                    occupato={postiOccupati.includes(`${fila}${indice + 1}`)}
                                />

                                {/* Numero del posto con dimensioni responsive */}
                                <span className="text-[8px] sm:text-[10px] md:text-xs text-muted-foreground mt-0.5 block">
                                    {indice + 1}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Etichetta destra della riga (identica alla sinistra) */}
                    <span className="w-4 text-[10px] sm:text-xs text-center text-muted-foreground font-medium">
                        {fila}
                    </span>
                </div>
            ))}
        </div>
    </div>
);
