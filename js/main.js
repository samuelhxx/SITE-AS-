/* AS Construction — main.js */

// ── Lenis smooth scroll ───────────────────────
const lenis = new Lenis({
  duration: 1.4,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true
})

function raf(time) {
  lenis.raf(time)
  ScrollTrigger.update()
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// ── Mobile menu refs (defined early — used in anchor handler) ─
const hamburger = document.getElementById('navHamburger')
const navMobile = document.getElementById('navMobile')

// Anchor links via Lenis
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const href = anchor.getAttribute('href')
    if (href === '#') return
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) lenis.scrollTo(target, { offset: -80 })
    navMobile.classList.remove('open')
    hamburger.classList.remove('open')
    hamburger.setAttribute('aria-expanded', 'false')
    navMobile.setAttribute('aria-hidden', 'true')
  })
})

// ── GSAP setup ────────────────────────────────
gsap.registerPlugin(ScrollTrigger)

// ── Navbar scroll ─────────────────────────────
const navbar = document.getElementById('navbar')
ScrollTrigger.create({
  start: 'top -40',
  onEnter: () => navbar.classList.add('scrolled'),
  onLeaveBack: () => navbar.classList.remove('scrolled')
})

// ── Hero entrance (slow, sober) ───────────────
gsap.timeline({ defaults: { ease: 'power1.out' } })
  .from('.hero-eyebrow',   { opacity: 0, y: 12, duration: 1.2, delay: 0.4 })
  .from('.hero-headline',  { opacity: 0, y: 20, duration: 1.6 }, '-=0.8')
  .from('.hero-sub',       { opacity: 0, y: 16, duration: 1.4 }, '-=1.0')
  .from('.hero-ctas .btn', { opacity: 0, y: 12, duration: 1.2, stagger: 0.18 }, '-=0.9')
  .from('.hero-stat',      { opacity: 0, y: 12, duration: 1.2, stagger: 0.14 }, '-=0.8')
  .from('.stat-divider',   { opacity: 0, duration: 0.8 }, '-=1.0')

// ── Animated counter (20+ only) ───────────────
document.querySelectorAll('.stat-value[data-target]').forEach(el => {
  const target = parseInt(el.getAttribute('data-target'))
  gsap.fromTo(el,
    { textContent: 0 },
    {
      textContent: target,
      duration: 2.4,
      ease: 'power1.out',
      snap: { textContent: 1 },
      scrollTrigger: { trigger: el, start: 'top 85%', once: true }
    }
  )
})

// ── Section reveals ───────────────────────────
function reveal(selector, trigger, vars = {}) {
  gsap.from(selector, {
    opacity: 0, y: 20, duration: 1.4, ease: 'power1.out',
    scrollTrigger: { trigger: trigger || selector, start: 'top 84%', once: true },
    ...vars
  })
}

// Credibility
reveal('.credibility-label', '.section-credibility')

// Services
reveal('#servicos .section-header', '#servicos')
reveal('.service-card', '.services-grid', { stagger: 0.07 })
reveal('.services-cta', '.services-cta')

// Obras header/footer
reveal('#obras .section-header', '#obras')
reveal('.obras-cta', '.obras-cta')

// Obras sticky scroll — desktop only
// CSS disables sticky on mobile; GSAP skips scrub effects too
const obraItems = document.querySelectorAll('.obra-sticky-item')
const isDesktop = window.matchMedia('(min-width: 769px)').matches

obraItems.forEach((item, i) => {
  const card = item.querySelector('.obra-sticky-card')

  // Reveal as each card first enters viewport
  gsap.from(card, {
    opacity: 0, y: 24, duration: 1.4, ease: 'power1.out',
    scrollTrigger: { trigger: item, start: 'top 88%', once: true }
  })

  // Desktop only: scale previous card back as the next slides in
  if (isDesktop && i < obraItems.length - 1) {
    gsap.to(card, {
      scale: 0.94,
      scrollTrigger: {
        trigger: obraItems[i + 1],
        start: 'top bottom',
        end: 'top top',
        scrub: 1.8
      }
    })
  }
})

// Diferenciais
reveal('.diferenciais-left > *', '.diferenciais-layout', { x: -20, y: 0, stagger: 0.14 })
reveal('.diferencial-card', '.diferenciais-grid', { stagger: 0.1 })

// Processo
reveal('.step', '.processo-steps', { x: -16, y: 0, stagger: 0.18 })

// Contato
gsap.from('.contato-left > *', {
  opacity: 0, x: -20, duration: 1.4, ease: 'power1.out', stagger: 0.14,
  scrollTrigger: { trigger: '.contato-layout', start: 'top 82%', once: true }
})
gsap.from('.contato-form', {
  opacity: 0, x: 20, duration: 1.6, ease: 'power1.out',
  scrollTrigger: { trigger: '.contato-layout', start: 'top 82%', once: true }
})

// Footer
reveal('.footer-brand, .footer-col', '.footer', { stagger: 0.1 })

// ── Mobile menu ───────────────────────────────
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

// Refresh ScrollTrigger after fonts load to ensure correct positions
document.fonts.ready.then(() => ScrollTrigger.refresh())
