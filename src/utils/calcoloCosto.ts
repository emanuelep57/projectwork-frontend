// Calcola il costo in base al numero dei posti selezionati * il costo della proiezione
export const calcolaCosto = (postiSelezionati: Array<{id: number}>, costoProiezione: number) => {
    const totale = postiSelezionati.length * costoProiezione;
    return {
        costoProiezione,
        totale
    };
};