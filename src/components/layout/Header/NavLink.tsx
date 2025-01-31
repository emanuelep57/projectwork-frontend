//lascio qui l'interfaccia perché è l'unica per un component navbar
interface NavLinkProps {
    href: string;
    vistaMobile?: boolean;
    children: string;
}

export const NavLink = ({ href, vistaMobile, children }: NavLinkProps) => {
    const baseStyles = "text-foreground hover:text-primary transition-all duration-300";
    const mobileStyles = "w-full text-center py-3 text-base border-b border-border px-4";
    const desktopStyles = "text-sm font-medium px-3 py-2";

    return (
        <a
            href={href}
    className={`${baseStyles} ${vistaMobile ? mobileStyles : desktopStyles}`}
>
    {children}
    </a>
)};