//l'icona (la path dell'svg) è stata generata grazie all'ai
// i colori sono:
//grigio chiaro se libero
//grigio scuro se occupato
//arancione se selezionato

export const IconaPosto = ({ selezionato = false, occupato = false }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 20"
        className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 transition-all duration-200 ${
            occupato ? 'text-zinc-700' :
                selezionato ? 'text-primary' :
                    'text-zinc-500 hover:text-zinc-400'
        }`}
    >
        <defs>
            {/*definizione degli stili */}
            <style>
                {`.seat-border{fill:currentColor;fill-rule:evenodd;}
                  .seat-background{fill:${selezionato ? 'currentColor' : '#1e293b'};fill-rule:evenodd;}`}
            </style>
        </defs>
        <g>
            <path
                className="seat-background"
                d="M19.75,.89H4.25c-.83,0-1.5,.67-1.5,1.5V11.6c0,.72,2.94,8.01,2.94,8.01h12.59s2.96-7.29,2.96-8.01V2.39c0-.83-.67-1.5-1.5-1.5Z"
            />
            <path
                className="seat-border"
                d="M22.5,0c-.66,0-1.21,.43-1.41,1.02-.35-.32-.82-.52-1.33-.52H4.26c-.52,0-.99,.2-1.34,.53-.2-.59-.75-1.02-1.42-1.02C.67,0,0,.67,0,1.5V14.26c0,.39,.31,.7,.7,.7h1.6c.39,0,.7-.31,.7-.7v-.26l.74,2.14c.13,.42,.54,1.15,1.1,1.45-.17,.34-.19,.74-.03,1.09l.23,.53c.21,.48,.68,.78,1.2,.78h11.51c.52,0,.99-.31,1.2-.78l.23-.53c.15-.35,.14-.74-.03-1.08,.54-.3,.96-.95,1.11-1.45l.74-2.14v.25c0,.39,.31,.7,.7,.7h1.6c.39,0,.7-.31,.7-.7V1.5c0-.83-.67-1.5-1.5-1.5Z"
            />
        </g>
    </svg>
);