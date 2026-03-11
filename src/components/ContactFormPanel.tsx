import { type FormEvent, useState } from 'react'
import { SITE_ORIGIN } from '../constants'

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}

const RECAPTCHA_SITE_KEY = '6Le7hhcsAAAAAB0MzOWIFFf4EJNvUoNaeGZlwqTS'
const CONTACT_ACTION_URL = `${SITE_ORIGIN}/wp-admin/admin-ajax.php`

const ensureRecaptcha = async (): Promise<string | null> => {
  if (typeof window === 'undefined') {
    return null
  }

  if (!window.grecaptcha) {
    await new Promise<void>((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>('script[data-abd-recaptcha]')
      if (existing) {
        existing.addEventListener('load', () => resolve(), { once: true })
        existing.addEventListener('error', () => reject(new Error('Failed to load reCAPTCHA')), {
          once: true,
        })
        return
      }

      const script = document.createElement('script')
      script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`
      script.async = true
      script.defer = true
      script.dataset.abdRecaptcha = 'true'
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load reCAPTCHA'))
      document.body.append(script)
    })
  }

  if (!window.grecaptcha) {
    return null
  }

  return new Promise<string>((resolve, reject) => {
    window.grecaptcha?.ready(() => {
      window.grecaptcha
        ?.execute(RECAPTCHA_SITE_KEY, { action: 'Form' })
        .then((token) => resolve(token))
        .catch((error) => reject(error))
    })
  })
}

const ContactFormPanel = () => {
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [marketingConsent, setMarketingConsent] = useState(false)
  const [serviceConsent, setServiceConsent] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    setSubmitting(true)
    setStatus('idle')
    setMessage('')

    try {
      const recaptchaToken = await ensureRecaptcha().catch(() => null)
      const payload = new URLSearchParams()

      payload.append('action', 'elementor_pro_forms_send_form')
      payload.append('post_id', '30')
      payload.append('form_id', '8c6eec9')
      payload.append(
        'referer_title',
        'Contact Advanced Benefit Designs | Financial Planning Services in Doylestown, PA',
      )
      payload.append('queried_id', '30')
      payload.append('form_fields[name]', name)
      payload.append('form_fields[email]', email)
      payload.append('form_fields[field_e288f98]', phone)
      payload.append('form_fields[message]', notes)
      payload.append('form_fields[field_8934a62]', marketingConsent ? 'on' : '')
      payload.append('form_fields[field_3516905]', serviceConsent ? 'on' : '')

      if (recaptchaToken) {
        payload.append('form_fields[field_1878964]', recaptchaToken)
      }

      const response = await fetch(CONTACT_ACTION_URL, {
        method: 'POST',
        body: payload,
      })

      const result = (await response.json()) as {
        success?: boolean
        data?: {
          message?: string
          errors?: Record<string, string>
        }
      }

      if (result.success) {
        setStatus('success')
        setMessage('Thanks. Your message has been sent to Advanced Benefit Designs.')
        setName('')
        setEmail('')
        setPhone('')
        setNotes('')
        setMarketingConsent(false)
        setServiceConsent(false)
      } else {
        const apiMessage = result.data?.message ?? 'Submission failed. Please try again in a moment.'
        const firstFieldError = result.data?.errors
          ? Object.values(result.data.errors).find((item) => item && item.trim().length > 0)
          : null

        setStatus('error')
        setMessage(firstFieldError ?? apiMessage)
      }
    } catch {
      setStatus('error')
      setMessage('Unable to submit right now. Please try again in a moment.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="contact-panel contact-panel-2026">
      <article className="contact-panel-intro">
        <p className="eyebrow">Client Intake</p>
        <h2>Build Your Financial Roadmap With a Focused Consultation</h2>
        <p>
          Share your goals and concerns. We will review your details and respond with practical next
          steps tailored to your timeline, cash flow, and risk comfort.
        </p>

        <div className="contact-panel-signal-row" aria-label="Service highlights">
          <span>Response within 1 business day</span>
          <span>Private and secure intake workflow</span>
        </div>

        <div className="contact-panel-meta-grid" aria-label="Contact details">
          <article>
            <span>Call</span>
            <a href="tel:215-262-5456">215-262-5456</a>
          </article>
          <article>
            <span>Email</span>
            <a href="mailto:info@advancedbenefitsdesigns.com">info@advancedbenefitsdesigns.com</a>
          </article>
          <article>
            <span>Location</span>
            <strong>Doylestown, PA</strong>
          </article>
        </div>
      </article>

      <form className="contact-panel-form" onSubmit={handleSubmit}>
        <div className="contact-panel-form-head">
          <h3>Get In Touch</h3>
          <p>All fields are required so we can respond with the right strategy context.</p>
        </div>

        <div className="contact-panel-field-grid">
          <label>
            Name
            <input value={name} onChange={(event) => setName(event.target.value)} required />
          </label>

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="is-full">
            Phone
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              pattern="[0-9()#&+*=.\\- ]+"
              required
            />
          </label>

          <label className="is-full">
            Message
            <textarea rows={4} value={notes} onChange={(event) => setNotes(event.target.value)} required />
          </label>
        </div>

        <div className="contact-panel-consent-stack">
          <label className="checkbox-label contact-panel-checkbox">
            <input
              type="checkbox"
              checked={marketingConsent}
              onChange={(event) => setMarketingConsent(event.target.checked)}
              required
            />
            I consent to receive marketing text messages.
          </label>

          <label className="checkbox-label contact-panel-checkbox">
            <input
              type="checkbox"
              checked={serviceConsent}
              onChange={(event) => setServiceConsent(event.target.checked)}
              required
            />
            I consent to receive non-marketing updates.
          </label>
        </div>

        <div className="contact-panel-action-row">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Sending...' : 'Unlock Tax Savings - Get in Touch'}
          </button>
        </div>

        {status !== 'idle' && (
          <p className={`form-status ${status === 'success' ? 'form-status-success' : 'form-status-error'}`}>
            {message}
          </p>
        )}
      </form>
    </section>
  )
}

export default ContactFormPanel
