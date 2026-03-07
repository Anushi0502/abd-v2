import { type ReactNode, useMemo, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import {
  AREAS_SERVED,
  COMMUNITY_BADGE_URL,
  CONTACT_DETAILS,
  LOGO_URL,
  PRIMARY_NAV,
  SERVICE_NAV,
  SOCIAL_LINKS,
} from '../constants'

interface LayoutProps {
  children: ReactNode
}

const SiteHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false)

  const flattenedLinks = useMemo(() => {
    return [...PRIMARY_NAV, ...SERVICE_NAV]
  }, [])

  return (
    <header className="site-header">
      <div className="site-topbar">
        <div className="container site-topbar-inner">
          <div className="site-contact-meta">
            <span>{CONTACT_DETAILS.address}</span>
            <a href={`mailto:${CONTACT_DETAILS.email}`}>{CONTACT_DETAILS.email}</a>
            <a href={`tel:${CONTACT_DETAILS.phone}`}>{CONTACT_DETAILS.phone}</a>
          </div>

          <div className="site-social-row" aria-label="Social channels">
            {SOCIAL_LINKS.slice(0, 2).map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                title={social.label}
              >
                {social.label === 'Facebook' ? 'f' : 'in'}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="site-nav-shell">
        <div className="container site-nav-row">
          <Link to="/home" className="brand-link" aria-label="Advanced Benefit Designs home">
            <img src={LOGO_URL} alt="Advanced Benefit Designs" className="brand-logo" />
          </Link>

          <nav className="site-nav" aria-label="Primary">
            <NavLink to="/home">Home</NavLink>
            <NavLink to="/financial-company">About Us</NavLink>

            <div className="site-dropdown">
              <button type="button" className="dropdown-trigger">
                Services
              </button>
              <div className="dropdown-panel" role="menu">
                {SERVICE_NAV.map((item) => (
                  <NavLink key={item.to} to={item.to} role="menuitem">
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>

            <NavLink to="/retirement-calculator">Retirement Calculator</NavLink>
            <NavLink to="/community">Community</NavLink>
            <NavLink to="/blogs">Blogs</NavLink>
          </nav>

          <a
            className="community-badge"
            href="https://community.advancedbenefitsdesigns.com/login"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={COMMUNITY_BADGE_URL} alt="Secure Future Hub" />
          </a>

          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileOpen((current) => !current)}
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? 'Close' : 'Menu'}
          </button>
        </div>

        {mobileOpen && (
          <div className="mobile-menu">
            {flattenedLinks.map((item) => (
              <NavLink key={item.to} to={item.to} onClick={() => setMobileOpen(false)}>
                {item.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}

const SiteFooter = () => {
  return (
    <footer className="site-footer">
      <div className="footer-shape" aria-hidden="true" />

      <div className="container footer-grid">
        <section>
          <img src={LOGO_URL} alt="Advanced Benefit Designs" className="footer-logo" />
          <p>
            Advanced Benefit Designs delivers customized strategies for tax efficiency, retirement
            confidence, and long-term protection.
          </p>
        </section>

        <section>
          <h3>Services</h3>
          <ul>
            {SERVICE_NAV.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to}>{item.label}</NavLink>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3>Areas We Serve</h3>
          <ul>
            {AREAS_SERVED.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to}>{item.label}</NavLink>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3>Get Connected</h3>
          <p>{CONTACT_DETAILS.address}</p>
          <p>
            <a href={`tel:${CONTACT_DETAILS.phone}`}>{CONTACT_DETAILS.phone}</a>
          </p>
          <p>
            <a href={`mailto:${CONTACT_DETAILS.email}`}>{CONTACT_DETAILS.email}</a>
          </p>

          <div className="footer-social-links" aria-label="Social channels">
            {SOCIAL_LINKS.map((social) => (
              <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer">
                {social.label}
              </a>
            ))}
          </div>
        </section>
      </div>

      <div className="site-legal">
        <p>
          Copyright © Advanced Benefit Designs 2026 | Powered by{' '}
          <a href="https://gcsrvllc.com/?Advancedbenefitsdesigns" target="_blank" rel="noopener noreferrer">
            Global Creative Services
          </a>{' '}
          | <NavLink to="/privacy-policy">Privacy Policy</NavLink> |{' '}
          <NavLink to="/terms-conditions">Terms &amp; Conditions</NavLink>
        </p>
      </div>
    </footer>
  )
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  )
}

export default Layout
