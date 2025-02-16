//mi sembrava un overkill creare un file per questa interfaccia
interface NavLinkProps {
    href: string;
    vistaMobile?: boolean;
    children: string;
}

//componente che rappresenta i link sulla navbar, c'è lo stile di base poi in base a se--
//è vista mobile o meno si aggiungono le classi necessarie
export const NavLink = ({ href, vistaMobile, children }: NavLinkProps) => {
    const baseStyle = "text-foreground hover:text-primary transition-all duration-300";
    const mobileStyles = "w-full text-center py-3 text-base border-b border-border px-4";
    const desktopStyles = "text-sm font-medium px-3 py-2";

    return (
        <a
            href={href}
    className={`${baseStyle} ${vistaMobile ? mobileStyles : desktopStyles}`}
>
    {children}
    </a>
)};