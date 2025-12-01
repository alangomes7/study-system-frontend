import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { STYLES, NAV_LINKS } from '../data/constants';

interface NavLinksProps {
  isMobile?: boolean;
  onLinkClick?: () => void;
}

export const NavLinks = ({ isMobile = false, onLinkClick }: NavLinksProps) => {
  const pathname = usePathname();

  const getLinkClass = (href: string) => {
    const isActive = pathname.startsWith(href);
    if (isMobile) {
      return isActive ? STYLES.activeMenuItem : STYLES.menuItem;
    }
    return isActive ? STYLES.activeNavLink : STYLES.navLink;
  };

  return (
    <>
      {NAV_LINKS.main.map(link => (
        <Link
          key={link.href}
          href={link.href}
          className={getLinkClass(link.href)}
          onClick={onLinkClick}
        >
          {link.label}
        </Link>
      ))}
    </>
  );
};
