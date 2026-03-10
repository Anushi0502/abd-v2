import { useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toInternalPath } from '../lib/html'
import { transformContentHtml } from '../lib/html'

interface RichContentProps {
  html: string
  className?: string
  preserveStyles?: boolean
  preserveIframes?: boolean
  unsafeRaw?: boolean
  executeScripts?: boolean
}

const shouldBypassInternalNavigation = (event: MouseEvent, anchor: HTMLAnchorElement) => {
  if (event.defaultPrevented || event.button !== 0) {
    return true
  }

  if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) {
    return true
  }

  const target = anchor.getAttribute('target')
  if (target && target.toLowerCase() !== '_self') {
    return true
  }

  return false
}

const createHtmlSignature = (value: string): string => {
  let hash = 0

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) | 0
  }

  return `${value.length}:${Math.abs(hash)}`
}

const RichContent = ({
  html,
  className,
  preserveStyles = false,
  preserveIframes = true,
  unsafeRaw = false,
  executeScripts = false,
}: RichContentProps) => {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement | null>(null)

  const transformed = useMemo(() => {
    if (unsafeRaw) {
      return html
    }

    return transformContentHtml(html, {
      preserveStyles,
      preserveIframes,
    })
  }, [html, preserveStyles, preserveIframes, unsafeRaw])
  const htmlSignature = useMemo(() => {
    return createHtmlSignature(html)
  }, [html])

  useEffect(() => {
    const node = containerRef.current
    if (!node) {
      return
    }

    const onClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof HTMLElement)) {
        return
      }

      const anchor = target.closest('a[href]')
      if (!(anchor instanceof HTMLAnchorElement)) {
        return
      }

      if (shouldBypassInternalNavigation(event, anchor)) {
        return
      }

      const href = anchor.getAttribute('href')
      if (!href) {
        return
      }

      const internal = toInternalPath(href)
      if (!internal) {
        return
      }

      event.preventDefault()
      navigate(internal)
    }

    node.addEventListener('click', onClick)
    return () => {
      node.removeEventListener('click', onClick)
    }
  }, [navigate])

  useEffect(() => {
    if (!executeScripts) {
      return
    }

    const node = containerRef.current
    if (!node) {
      return
    }

    const windowWithRegistry = window as Window & {
      __abdExecutedHtmlScripts?: Record<string, boolean>
    }
    const signature = `${className ?? 'default'}:${htmlSignature}`

    if (!windowWithRegistry.__abdExecutedHtmlScripts) {
      windowWithRegistry.__abdExecutedHtmlScripts = {}
    }

    if (windowWithRegistry.__abdExecutedHtmlScripts[signature]) {
      return
    }

    windowWithRegistry.__abdExecutedHtmlScripts[signature] = true

    const scripts = Array.from(node.querySelectorAll('script'))
    scripts.forEach((script) => {
      const replacement = document.createElement('script')
      Array.from(script.attributes).forEach((attribute) => {
        replacement.setAttribute(attribute.name, attribute.value)
      })
      replacement.text = script.textContent ?? ''
      script.replaceWith(replacement)
    })
  }, [className, executeScripts, htmlSignature])

  return <div ref={containerRef} className={className} dangerouslySetInnerHTML={{ __html: transformed }} />
}

export default RichContent
