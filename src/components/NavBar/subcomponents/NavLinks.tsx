import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { STYLES, NAV_LINKS } from '../types/constants';

// Helper to determine active state
const getLinkClass = (pathname: string, href: string, isMobile = false) => {
  const isActive = pathname.startsWith(href);
  const baseClass = isMobile ? STYLES.menuItem : STYLES.navLink;
  const activeClass = isMobile ? STYLES.activeMenuItem : STYLES.activeNavLink;
  return isActive ? activeClass : baseClass;
};

interface NavLinksProps {
  isMobile?: boolean;
  onLinkClick?: () => void;
}

export const NavLinks = ({ isMobile = false, onLinkClick }: NavLinksProps) => {
  const pathname = usePathname();

  return (
    <>
      {NAV_LINKS.main.map(link => (
        <Link
          key={link.href}
          href={link.href}
          className={getLinkClass(pathname, link.href, isMobile)}
          onClick={onLinkClick}
        >
          {link.label}
        </Link>
      ))}
    </>
  );
};
