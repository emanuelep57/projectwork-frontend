import { IconaPosto } from './IconaPosto';


//legenda dei posti dova mostra che il posto è grigio chiaro se libero
//grigio scuro se occupato
//arancione se selezionato

export const LegendaPosti = () => (
    <div className="flex flex-wrap justify-center gap-4 mt-8">
        <div className="flex items-center gap-2">
            <div className="transform scale-75">
                <IconaPosto />
            </div>
            <span className="text-xs text-zinc-400">Disponibile</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="transform scale-75">
                <IconaPosto occupato={true}/>
            </div>
            <span className="text-xs text-zinc-400">Occupato</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="transform scale-75">
                <IconaPosto selezionato={true}/>
            </div>
            <span className="text-xs text-zinc-400">Selezionato</span>
        </div>
    </div>
);

export default LegendaPosti;
