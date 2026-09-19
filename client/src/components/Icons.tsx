type IconProps = { size?: number; className?: string };
const Svg = ({ children, size = 20, className }: IconProps & { children: React.ReactNode }) => (
  <svg aria-hidden="true" className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);
export const ArrowIcon = (p: IconProps) => <Svg {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Svg>;
export const UserIcon = (p: IconProps) => <Svg {...p}><circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-4 3-6 7-6s6.2 2 7 6"/></Svg>;
export const MenuIcon = (p: IconProps) => <Svg {...p}><path d="M4 7h16M4 12h16M4 17h16"/></Svg>;
export const CloseIcon = (p: IconProps) => <Svg {...p}><path d="m6 6 12 12M18 6 6 18"/></Svg>;
export const UsersIcon = (p: IconProps) => <Svg {...p}><circle cx="9" cy="9" r="3"/><circle cx="17" cy="10" r="2"/><path d="M3 20c.5-4 2.5-6 6-6s5.5 2 6 6M15 15c3 0 4.5 1.5 5 4"/></Svg>;
export const CalendarIcon = (p: IconProps) => <Svg {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></Svg>;
export const LocationIcon = (p: IconProps) => <Svg {...p}><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></Svg>;
export const StarIcon = (p: IconProps) => <Svg {...p}><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z"/></Svg>;
export const MusicIcon = (p: IconProps) => <Svg {...p}><path d="M9 18V5l11-2v13M9 9l11-2"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/></Svg>;
export const SmokeIcon = (p: IconProps) => <Svg {...p}><path d="M5 20h14M9 20c0-6 6-6 6-11 0-3-2-4-4-5M14 20c0-3 3-4 3-7"/></Svg>;

