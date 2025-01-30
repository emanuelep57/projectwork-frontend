import {NavLink} from './NavLink';

export const SezioneNavLink = ({vistaMobile}: { vistaMobile?: boolean }) => (
    <>
        <NavLink href="/" vistaMobile={vistaMobile}>Home</NavLink>
        <NavLink href="/movies" vistaMobile={vistaMobile}>Film</NavLink>
        <NavLink href="/menu" vistaMobile={vistaMobile}>Menù</NavLink>
        <NavLink href="/evento-privato" vistaMobile={vistaMobile}>Eventi Privati</NavLink>
    </>
);