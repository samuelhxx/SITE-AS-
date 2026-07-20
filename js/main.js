/* AS Construction — main.js */

// ── GSAP + ScrollTrigger ──────────────────────
gsap.registerPlugin(ScrollTrigger)

// ── Reduced motion ────────────────────────────
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// ── Mobile detection (celulares, alinhado ao breakpoint CSS 768px) ──
const _isMobile = window.innerWidth <= 767

// ── Lenis: desktop e iPad (> 767px) ─────────────
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

// ── Alimentar ScrollTrigger via scroll nativo (fix mobile) ──────────
// No iOS, o rAF (e portanto o ticker do GSAP) pausa durante o momentum
// do scroll por toque. Sem Lenis, o ScrollTrigger nunca recebe updates.
// Com Lenis + smoothTouch:false, lenis.emit('scroll') também não dispara
// em dispositivos touch. Esta linha garante que o ScrollTrigger seja
// atualizado pelo evento nativo de scroll em TODOS os dispositivos.
window.addEventListener('scroll', ScrollTrigger.update, { passive: true })

// ── Mobile menu refs ─────────────────────────
const hamburger = document.getElementById('navHamburger')
const navMobile  = document.getElementById('navMobile')

// Anchor links
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

// ── Navbar scrolled state ─────────────────────
const navbar = document.getElementById('navbar')
ScrollTrigger.create({
  start: 'top -40',
  onEnter:     () => navbar.classList.add('scrolled'),
  onLeaveBack: () => navbar.classList.remove('scrolled')
})

// ── Reveal helper ────────────────────────────
// Fora do guard de prefersReducedMotion: os fade-ins das seções
// funcionam em todos os dispositivos. Se o usuário tem
// Reduce Motion ativo, os elementos ficam visíveis no CSS
// imediatamente (opacity:1 default) e a função retorna cedo.
const reveal = (selector, trigger, vars = {}) => {
  if (prefersReducedMotion) return
  gsap.from(selector, {
    opacity: 0, y: 20, duration: 1.4, ease: 'power1.out',
    scrollTrigger: { trigger: trigger || selector, start: 'top 88%', once: true },
    ...vars
  })
}

// ── Animações complexas (parallax/scrub/rotation) ───
if (!prefersReducedMotion) {

  // Hero entrance
  gsap.timeline({ defaults: { ease: 'power1.out' } })
    .from('.hero-eyebrow',   { opacity: 0, y: 12, duration: 1.2, delay: 0.4 })
    .from('.hero-headline',  { opacity: 0, y: 20, duration: 1.6 }, '-=0.8')
    .from('.hero-sub',       { opacity: 0, y: 16, duration: 1.4 }, '-=1.0')
    .from('.hero-ctas .btn', { opacity: 0, y: 12, duration: 1.2, stagger: 0.18 }, '-=0.9')
    .from('.hero-services li', { opacity: 0, y: 10, duration: 1, stagger: 0.08 }, '-=0.8')
    .from('.hero-stat',      { opacity: 0, y: 12, duration: 1.2, stagger: 0.14 }, '-=0.8')
    .from('.stat-divider',   { opacity: 0, duration: 0.8 }, '-=1.0')

  // Hero grid parallax
  gsap.to('.hero-grid', {
    yPercent: 18, ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
  })

  // Counter
  document.querySelectorAll('.stat-value[data-target]').forEach(el => {
    const target = parseInt(el.getAttribute('data-target'))
    gsap.fromTo(el, { textContent: 0 }, {
      textContent: target, duration: 2.4, ease: 'power1.out',
      snap: { textContent: 1 },
      scrollTrigger: { trigger: el, start: 'top 90%', once: true }
    })
  })

} // end complex animations

// ── Reveals das seções (sempre ativos) ───────────
reveal('.credibility-label', '.section-credibility')
reveal('.coverage-item', '.section-coverage', { stagger: 0.12 })
reveal('#obras .section-header', '#obras')
reveal('.obras-cta', '.obras-cta')

const obraItems = document.querySelectorAll('.obra-sticky-item')
const isDesktop = window.matchMedia('(min-width: 769px)').matches
obraItems.forEach((item, i) => {
  const card = item.querySelector('.obra-sticky-card')
  // No celular o CSS força opacity:1 e transform:none nas cards
  if (!_isMobile && !prefersReducedMotion) {
    gsap.from(card, {
      opacity: 0, y: 24, duration: 1.4, ease: 'power1.out',
      scrollTrigger: { trigger: item, start: 'top 90%', once: true }
    })
    if (isDesktop && i < obraItems.length - 1) {
      gsap.to(card, {
        scale: 0.94,
        scrollTrigger: { trigger: obraItems[i + 1], start: 'top bottom', end: 'top top', scrub: 1.8 }
      })
    }
  }
})

reveal('.diferenciais-left > *', '.diferenciais-layout', { x: -20, y: 0, stagger: 0.14 })
reveal('.diferencial-card', '.diferenciais-grid', { stagger: 0.1 })
reveal('.step', '.processo-steps', { x: -16, y: 0, stagger: 0.18 })

if (!prefersReducedMotion) {
  gsap.from('.contato-left > *', {
    opacity: 0, x: -20, duration: 1.4, ease: 'power1.out', stagger: 0.14,
    scrollTrigger: { trigger: '.contato-layout', start: 'top 88%', once: true }
  })
  gsap.from('.contato-form', {
    opacity: 0, x: 20, duration: 1.6, ease: 'power1.out',
    scrollTrigger: { trigger: '.contato-layout', start: 'top 88%', once: true }
  })
}

reveal('.footer-brand, .footer-col', '.footer', { stagger: 0.1 })

// ── Story Scroll — Services (desktop/tablet only) ──
if (!prefersReducedMotion) {
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
          rotation: 0, ease: 'none',
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'top 25%', scrub: true }
        })
      }
      if (i < sections.length - 1) {
        ScrollTrigger.create({
          trigger: section, start: 'bottom bottom', end: 'bottom top',
          pin: true, pinSpacing: false
        })
      }
    })
  })()
}

// ── Mobile menu ────────────────────────────
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

// ── Form → WhatsApp ─────────────────────────
const form = document.getElementById('contatoForm')
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault()
    const data = new FormData(form)
    const msg = encodeURIComponent(
      `Olá, vim pelo site!\n\nNome: ${data.get('nome')}\nEmpresa: ${data.get('empresa')}\nTelefone: ${data.get('telefone')}\nDemanda: ${data.get('demanda') || 'não especificado'}\n\n${data.get('mensagem')}`
    )
    if (typeof gtag_report_conversion === 'function') {
      gtag_report_conversion(`https://wa.me/5511933680596?text=${msg}`)
    } else {
      window.open(`https://wa.me/5511933680596?text=${msg}`, '_blank')
    }
    const btn = form.querySelector('button[type="submit"]')
    const orig = btn.innerHTML
    btn.innerHTML = 'Mensagem enviada ✓'
    btn.style.background = '#16a34a'
    setTimeout(() => { btn.innerHTML = orig; btn.style.background = '' }, 3000)
  })
}

// ── Botões de WhatsApp: roteamento por dispositivo ──────────────────
// Celular → vai DIRETO ao WhatsApp (link nativo, instantâneo) e dispara
// a conversão do Google Ads no clique (fire-and-forget via beacon, que
// sobrevive à navegação).
// Desktop → abre modal simplificado (só telefone), captura via Formspree
// e então encaminha ao WhatsApp por gtag_report_conversion (conversão +
// nova aba). Falha no Formspree não bloqueia o contato.
const CONVERSION_ID = 'AW-18234421982/E4_ACLf1_sccEN7l7PZD'
const isMobileDevice = () =>
  window.matchMedia('(max-width: 767px)').matches ||
  /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)

const leadOverlay = document.getElementById('leadModalOverlay')
const leadForm    = document.getElementById('leadForm')
const leadClose   = document.getElementById('leadModalClose')
let leadWhatsUrl  = 'https://wa.me/5511933680596'

const waLinks = document.querySelectorAll('a[href^="https://wa.me/"]')

if (leadOverlay && leadForm) {
  const openLeadModal = url => {
    leadWhatsUrl = url
    leadOverlay.classList.add('open')
    leadOverlay.setAttribute('aria-hidden', 'false')
    document.body.style.overflow = 'hidden'
    const tel = document.getElementById('leadTelefone')
    if (tel) setTimeout(() => tel.focus(), 60)
  }
  const closeLeadModal = () => {
    leadOverlay.classList.remove('open')
    leadOverlay.setAttribute('aria-hidden', 'true')
    document.body.style.overflow = ''
  }

  waLinks.forEach(link => {
    link.addEventListener('click', e => {
      if (isMobileDevice()) {
        // Celular: dispara a conversão e deixa o href abrir o WhatsApp.
        // Sem preventDefault e sem callback → abertura instantânea.
        if (typeof gtag === 'function') {
          gtag('event', 'conversion', { send_to: CONVERSION_ID })
        }
        return
      }
      e.preventDefault()
      openLeadModal(link.getAttribute('href'))
    })
  })

  leadClose.addEventListener('click', closeLeadModal)
  leadOverlay.addEventListener('click', e => { if (e.target === leadOverlay) closeLeadModal() })
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLeadModal() })

  const goToWhats = () => {
    const url = leadWhatsUrl
    closeLeadModal()
    if (typeof gtag_report_conversion === 'function') {
      gtag_report_conversion(url)
    } else {
      const win = window.open(url, '_blank')
      if (!win) window.location.href = url
    }
  }

  leadForm.addEventListener('submit', e => {
    e.preventDefault()
    const btn  = leadForm.querySelector('button[type="submit"]')
    const orig = btn.textContent
    btn.disabled = true
    btn.textContent = 'Enviando...'
    const done = () => {
      btn.disabled = false
      btn.textContent = orig
      leadForm.reset()
      goToWhats()
    }
    // Timeout de 4s: rede lenta não pode segurar o lead nem estourar a
    // janela de ativação do navegador (popup em nova aba)
    Promise.race([
      fetch('https://formspree.io/f/xeeygjla', {
        method: 'POST',
        body: new FormData(leadForm),
        headers: { 'Accept': 'application/json' },
        keepalive: true
      }),
      new Promise(resolve => setTimeout(resolve, 4000))
    ]).then(done, done)
  })
}

// ── ScrollTrigger refresh ─────────────────────
document.fonts.ready.then(() => ScrollTrigger.refresh())
setTimeout(() => ScrollTrigger.refresh(), 300)

let _refreshTimer
window.addEventListener('resize', () => {
  clearTimeout(_refreshTimer)
  _refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 250)
})
window.addEventListener('orientationchange', () => {
  // Espera o browser recalcular o layout após rotação antes de refrescar
  setTimeout(() => ScrollTrigger.refresh(), 600)
})
