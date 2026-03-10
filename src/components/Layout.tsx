import { type ReactNode, useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AREAS_SERVED, CONTACT_DETAILS, LOGO_URL, PRIMARY_NAV, SERVICE_NAV, SOCIAL_LINKS } from '../constants'

interface LayoutProps {
  children: ReactNode
}

const SiteHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const closeServicesMenu = () => setServicesOpen(false)
  const closeAllMenus = () => {
    setMobileOpen(false)
    setServicesOpen(false)
  }

  useEffect(() => {
    if (!mobileOpen && !servicesOpen) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false)
        setServicesOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [mobileOpen, servicesOpen])

  useEffect(() => {
    if (!servicesOpen) {
      return
    }

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target
      if (!(target instanceof HTMLElement)) {
        return
      }

      if (!target.closest('.site-dropdown')) {
        setServicesOpen(false)
      }
    }

    window.addEventListener('pointerdown', onPointerDown)
    return () => window.removeEventListener('pointerdown', onPointerDown)
  }, [servicesOpen])

  return (
    <header className="site-header">
      <a href="#site-main-content" className="skip-link">
        Skip to content
      </a>

      <div className="site-nav-shell">
        <div className="container site-nav-row">
          <Link
            to="/home"
            className="brand-link"
            aria-label="Advanced Benefit Designs home"
            onClick={closeAllMenus}
          >
            <img src={LOGO_URL} alt="Advanced Benefit Designs" className="brand-logo" />
          </Link>

          <nav className="site-nav" aria-label="Primary">
            <NavLink to="/home" onClick={closeAllMenus}>
              Home
            </NavLink>
            <NavLink to="/financial-company" onClick={closeAllMenus}>
              About Us
            </NavLink>

            <div
              className={`site-dropdown ${servicesOpen ? 'is-open' : ''}`}
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={closeServicesMenu}
            >
              <button
                type="button"
                className="dropdown-trigger"
                aria-haspopup="true"
                aria-expanded={servicesOpen}
                onClick={() => setServicesOpen((current) => !current)}
              >
                Services <span aria-hidden="true">v</span>
              </button>
              <div className={`dropdown-panel ${servicesOpen ? 'is-open' : ''}`} role="menu">
                {SERVICE_NAV.map((item) => (
                  <NavLink key={item.to} to={item.to} role="menuitem" onClick={closeAllMenus}>
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>

            <NavLink to="/retirement-calculator" onClick={closeAllMenus}>
              Retirement Calculator
            </NavLink>
            <NavLink to="/community" onClick={closeAllMenus}>
              Community
            </NavLink>
            <NavLink to="/blogs" onClick={closeAllMenus}>
              Blogs
            </NavLink>
          </nav>

          <a
            className="site-signup"
            href="https://community.advancedbenefitsdesigns.com/login"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Secure Future Hub"
            onClick={closeAllMenus}
          >
            Sign Up
          </a>

          <button
            className={`mobile-menu-toggle ${mobileOpen ? 'is-open' : ''}`}
            onClick={() => {
              setMobileOpen((current) => !current)
              setServicesOpen(false)
            }}
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation"
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <div className={`mobile-menu ${mobileOpen ? 'is-open' : ''}`} aria-hidden={!mobileOpen}>
          <div className="mobile-menu-grid container">
            <section>
              <h3>Primary</h3>
              {PRIMARY_NAV.map((item) => (
                <NavLink key={item.to} to={item.to} onClick={closeAllMenus}>
                  {item.label}
                </NavLink>
              ))}
            </section>

            <section>
              <h3>Services</h3>
              {SERVICE_NAV.map((item) => (
                <NavLink key={item.to} to={item.to} onClick={closeAllMenus}>
                  {item.label}
                </NavLink>
              ))}
            </section>

            <section>
              <h3>Contact</h3>
              <a href={`tel:${CONTACT_DETAILS.phone}`}>{CONTACT_DETAILS.phone}</a>
              <a href={`mailto:${CONTACT_DETAILS.email}`}>{CONTACT_DETAILS.email}</a>
              <p>{CONTACT_DETAILS.address}</p>
              <a
                href="https://community.advancedbenefitsdesigns.com/login"
                target="_blank"
                rel="noopener noreferrer"
              >
                Sign Up
              </a>
            </section>
          </div>
        </div>
      </div>
    </header>
  )
}

const SiteFooter = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="footer-shape" aria-hidden="true" />

      <div className="container footer-grid">
        <section>
          <img src={LOGO_URL} alt="Advanced Benefit Designs" className="footer-logo" />
          <p>
            Advanced Benefit Designs delivers custom planning strategies for tax efficiency, retirement
            confidence, and long-term protection.
          </p>
          <div className="footer-social-links" aria-label="Social channels">
            {SOCIAL_LINKS.map((social) => (
              <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer">
                {social.label}
              </a>
            ))}
          </div>
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
          <a
            className="btn btn-outline"
            href="https://community.advancedbenefitsdesigns.com/login"
            target="_blank"
            rel="noopener noreferrer"
          >
            Client Login
          </a>
        </section>
      </div>

      <div className="site-legal">
        <p>
          Copyright (c) Advanced Benefit Designs {currentYear} | Powered by{' '}
          <a href="https://gcsrvllc.com/?Advancedbenefitsdesigns" target="_blank" rel="noopener noreferrer">
            Global Creative Services
          </a>{' '}
          | <NavLink to="/privacy-policy">Privacy Policy</NavLink> |{' '}
          <NavLink to="/terms-conditions">Terms and Conditions</NavLink>
        </p>
      </div>
    </footer>
  )
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <SiteHeader />
      <main id="site-main-content">{children}</main>
      <SiteFooter />
    </>
  )
}

export default Layout
