//SInossi del film

interface SinossiProps {
    descrizione: string;
}

export const Sinossi = ({ descrizione }: SinossiProps) => {
    return (
        <div className="container mx-auto max-w-6xl px-8 py-12">
            <div className="max-w-2xl">
                <h2 className="text-2xl font-bold mb-4">Trama</h2>
                <p className="text-muted-foreground leading-relaxed">
                    {descrizione}
                </p>
            </div>
        </div>
    );
};
