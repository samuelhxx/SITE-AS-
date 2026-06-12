/* AS Construction — main.js */

// ── GSAP + ScrollTrigger ───────────────────────
gsap.registerPlugin(ScrollTrigger)

// ── Reduced motion ─────────────────────────────
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// ── Lenis: desativado apenas em celulares (≤480px) ─────
// Lenis 1.0.x com smoothTouch:false não captura eventos touch,
// então ScrollTrigger fica sem atualização no celular.
// Todos os iPads (mínimo 744px) e notebooks ficam inalterados.
const _isMobile = window.innerWidth <= 480
let lenis = null

if (!_isMobile) {
  lenis = new Lenis({
    duration: 1.4,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    smoothTouch: false,
  })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => { lenis.raf(time * 1000) })
  gsap.ticker.lagSmoothing(0)
}

// ── Mobile menu refs ───────────────────────────
const hamburger = document.getElementById('navHamburger')
const navMobile  = document.getElementById('navMobile')

// Anchor links — Lenis em desktop/iPad, scrollTo nativo no celular
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const href = anchor.getAttribute('href')
    if (href === '#') return
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) {
      if (lenis) {
        lenis.scrollTo(target, { offset: -80 })
      } else {
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - 80,
          behavior: 'smooth'
        })
      }
    }
    navMobile.classList.remove('open')
    hamburger.classList.remove('open')
    hamburger.setAttribute('aria-expanded', 'false')
    navMobile.setAttribute('aria-hidden', 'true')
  })
})

// ── Navbar scrolled state ──────────────────────
const navbar = document.getElementById('navbar')
ScrollTrigger.create({
  start: 'top -40',
  onEnter:     () => navbar.classList.add('scrolled'),
  onLeaveBack: () => navbar.classList.remove('scrolled')
})

if (!prefersReducedMotion) {

  // ── Hero entrance ─────────────────────────────
  gsap.timeline({ defaults: { ease: 'power1.out' } })
    .from('.hero-eyebrow',   { opacity: 0, y: 12, duration: 1.2, delay: 0.4 })
    .from('.hero-headline',  { opacity: 0, y: 20, duration: 1.6 }, '-=0.8')
    .from('.hero-sub',       { opacity: 0, y: 16, duration: 1.4 }, '-=1.0')
    .from('.hero-ctas .btn', { opacity: 0, y: 12, duration: 1.2, stagger: 0.18 }, '-=0.9')
    .from('.hero-stat',      { opacity: 0, y: 12, duration: 1.2, stagger: 0.14 }, '-=0.8')
    .from('.stat-divider',   { opacity: 0, duration: 0.8 }, '-=1.0')

  // ── Hero grid parallax ─────────────────────────
  gsap.to('.hero-grid', {
    yPercent: 18,
    ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
  })

  // ── Animated counter ───────────────────────────
  document.querySelectorAll('.stat-value[data-target]').forEach(el => {
    const target = parseInt(el.getAttribute('data-target'))
    gsap.fromTo(el,
      { textContent: 0 },
      {
        textContent: target,
        duration: 2.4,
        ease: 'power1.out',
        snap: { textContent: 1 },
        scrollTrigger: { trigger: el, start: 'top 90%', once: true }
      }
    )
  })

  // ── Section reveal helper ──────────────────────
  const reveal = (selector, trigger, vars = {}) => {
    gsap.from(selector, {
      opacity: 0, y: 20, duration: 1.4, ease: 'power1.out',
      scrollTrigger: { trigger: trigger || selector, start: 'top 88%', once: true },
      ...vars
    })
  }

  reveal('.credibility-label', '.section-credibility')
  reveal('.coverage-item', '.section-coverage', { stagger: 0.12 })
  reveal('#obras .section-header', '#obras')
  reveal('.obras-cta', '.obras-cta')

  const obraItems = document.querySelectorAll('.obra-sticky-item')
  const isDesktop = window.matchMedia('(min-width: 769px)').matches
  obraItems.forEach((item, i) => {
    const card = item.querySelector('.obra-sticky-card')
    // No celular o CSS força opacity:1 e transform:none — animamos apenas em telas maiores
    if (!_isMobile) {
      gsap.from(card, {
        opacity: 0, y: 24, duration: 1.4, ease: 'power1.out',
        scrollTrigger: { trigger: item, start: 'top 90%', once: true }
      })
    }
    if (isDesktop && i < obraItems.length - 1) {
      gsap.to(card, {
        scale: 0.94,
        scrollTrigger: {
          trigger: obraItems[i + 1],
          start: 'top bottom', end: 'top top', scrub: 1.8
        }
      })
    }
  })

  reveal('.diferenciais-left > *', '.diferenciais-layout', { x: -20, y: 0, stagger: 0.14 })
  reveal('.diferencial-card', '.diferenciais-grid', { stagger: 0.1 })
  reveal('.step', '.processo-steps', { x: -16, y: 0, stagger: 0.18 })

  gsap.from('.contato-left > *', {
    opacity: 0, x: -20, duration: 1.4, ease: 'power1.out', stagger: 0.14,
    scrollTrigger: { trigger: '.contato-layout', start: 'top 88%', once: true }
  })
  gsap.from('.contato-form', {
    opacity: 0, x: 20, duration: 1.6, ease: 'power1.out',
    scrollTrigger: { trigger: '.contato-layout', start: 'top 88%', once: true }
  })

  reveal('.footer-brand, .footer-col', '.footer', { stagger: 0.1 })

  // ── Story Scroll — Services (desktop/tablet only) ───
  ;(function initStoryScroll() {
    if (window.innerWidth <= 768) return
    const container = document.getElementById('servicesFlow')
    if (!container) return
    const sections = Array.from(container.querySelectorAll('[data-flow-section]'))
    if (!sections.length) return

    sections.forEach((section, i) => {
      gsap.set(section, { zIndex: i + 1 })
      const inner = section.querySelector('[data-flow-inner]')
      if (!inner) return

      if (i > 0) {
        gsap.set(inner, { rotation: 30, transformOrigin: 'bottom left' })
        gsap.to(inner, {
          rotation: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'top 25%',
            scrub: true
          }
        })
      }

      if (i < sections.length - 1) {
        ScrollTrigger.create({
          trigger: section,
          start: 'bottom bottom',
          end: 'bottom top',
          pin: true,
          pinSpacing: false
        })
      }
    })
  })()

} // end if (!prefersReducedMotion)

// ── Mobile menu ──────────────────────────────
hamburger.addEventListener('click', () => {
  const isOpen = navMobile.classList.toggle('open')
  hamburger.classList.toggle('open', isOpen)
  hamburger.setAttribute('aria-expanded', isOpen)
  navMobile.setAttribute('aria-hidden', !isOpen)
})

window.addEventListener('resize', () => {
  if (window.innerWidth > 900) {
    navMobile.classList.remove('open')
    hamburger.classList.remove('open')
    hamburger.setAttribute('aria-expanded', 'false')
    navMobile.setAttribute('aria-hidden', 'true')
  }
})

// ── Form → WhatsApp ───────────────────────────
const form = document.getElementById('contatoForm')
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault()
    const data = new FormData(form)
    const msg = encodeURIComponent(
      `Olá, vim pelo site!\n\nNome: ${data.get('nome')}\nEmpresa: ${data.get('empresa')}\nTelefone: ${data.get('telefone')}\nDemanda: ${data.get('demanda') || 'não especificado'}\n\n${data.get('mensagem')}`
    )
    window.open(`https://wa.me/5511933680596?text=${msg}`, '_blank')
    const btn = form.querySelector('button[type="submit"]')
    const orig = btn.innerHTML
    btn.innerHTML = 'Mensagem enviada ✓'
    btn.style.background = '#16a34a'
    setTimeout(() => { btn.innerHTML = orig; btn.style.background = '' }, 3000)
  })
}

// ── ScrollTrigger refresh ──────────────────────
document.fonts.ready.then(() => ScrollTrigger.refresh())

let _refreshTimer
window.addEventListener('resize', () => {
  clearTimeout(_refreshTimer)
  _refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 250)
})
window.addEventListener('orientationchange', () => {
  setTimeout(() => ScrollTrigger.refresh(), 350)
})
