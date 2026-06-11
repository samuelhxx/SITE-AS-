/* AS Construction — main.js */

// ── Lenis smooth scroll ────────────────────
const lenis = new Lenis({
  duration: 1.2,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true
})

function raf(time) {
  lenis.raf(time)
  ScrollTrigger.update()
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

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

// ── GSAP setup ───────────────────────
gsap.registerPlugin(ScrollTrigger)

// ── Navbar scroll behavior ────────────────
const navbar = document.getElementById('navbar')
ScrollTrigger.create({
  start: 'top -40',
  onEnter: () => navbar.classList.add('scrolled'),
  onLeaveBack: () => navbar.classList.remove('scrolled')
})

// ── Hero entrance ────────────────────
gsap.timeline({ defaults: { ease: 'power3.out' } })
  .from('.hero-eyebrow',    { opacity: 0, y: 16, duration: 0.7, delay: 0.3 })
  .from('.hero-headline',   { opacity: 0, y: 36, duration: 0.9 }, '-=0.4')
  .from('.hero-sub',        { opacity: 0, y: 24, duration: 0.7 }, '-=0.6')
  .from('.hero-ctas .btn',  { opacity: 0, y: 16, duration: 0.6, stagger: 0.12 }, '-=0.4')
  .from('.hero-stat',       { opacity: 0, y: 16, duration: 0.6, stagger: 0.1 },  '-=0.3')
  .from('.stat-divider',    { opacity: 0, duration: 0.4 }, '-=0.4')

// ── Hero glow parallax ───────────────────
gsap.to('.hero-glow-1', {
  y: -60, x: 30,
  scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.5 }
})
gsap.to('.hero-glow-2', {
  y: -40, x: -20,
  scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 2 }
})

// ── Animated counters ───────────────────
document.querySelectorAll('.stat-value[data-target]').forEach(el => {
  const target = parseInt(el.getAttribute('data-target'))
  gsap.fromTo(el,
    { textContent: 0 },
    {
      textContent: target,
      duration: 2,
      ease: 'power2.out',
      snap: { textContent: 1 },
      scrollTrigger: { trigger: el, start: 'top 85%', once: true }
    }
  )
})

// ── Section reveals ─────────────────────
// Services
gsap.from('#servicos .section-header', {
  opacity: 0, y: 32, duration: 0.8, ease: 'power3.out',
  scrollTrigger: { trigger: '#servicos', start: 'top 80%', once: true }
})
gsap.from('.service-card', {
  opacity: 0, y: 40, duration: 0.7, ease: 'power3.out', stagger: 0.09,
  scrollTrigger: { trigger: '.services-grid', start: 'top 82%', once: true }
})
gsap.from('.services-cta', {
  opacity: 0, y: 24, duration: 0.7,
  scrollTrigger: { trigger: '.services-cta', start: 'top 88%', once: true }
})

// Obras — sticky scroll with scale-back
gsap.from('#obras .section-header', {
  opacity: 0, y: 32, duration: 0.8, ease: 'power3.out',
  scrollTrigger: { trigger: '#obras', start: 'top 80%', once: true }
})
const obraItems = document.querySelectorAll('.obra-sticky-item')
obraItems.forEach((item, i) => {
  const card = item.querySelector('.obra-sticky-card')
  gsap.from(card, {
    opacity: 0, y: 40, duration: 0.8, ease: 'power3.out',
    scrollTrigger: { trigger: item, start: 'top 85%', once: true }
  })
  if (i < obraItems.length - 1) {
    gsap.to(card, {
      scale: 0.94, opacity: 0.6,
      scrollTrigger: {
        trigger: obraItems[i + 1],
        start: 'top bottom',
        end: 'top 30%',
        scrub: 1.2
      }
    })
  }
})

// Diferenciais
gsap.from('.diferenciais-left > *', {
  opacity: 0, x: -32, duration: 0.7, ease: 'power3.out', stagger: 0.12,
  scrollTrigger: { trigger: '.diferenciais-layout', start: 'top 80%', once: true }
})
gsap.from('.diferencial-card', {
  opacity: 0, y: 32, duration: 0.7, ease: 'power3.out', stagger: 0.1,
  scrollTrigger: { trigger: '.diferenciais-grid', start: 'top 82%', once: true }
})

// Processo
gsap.from('.step', {
  opacity: 0, x: -24, duration: 0.7, ease: 'power3.out', stagger: 0.15,
  scrollTrigger: { trigger: '.processo-steps', start: 'top 80%', once: true }
})

// Contato
gsap.from('.contato-left > *', {
  opacity: 0, x: -32, duration: 0.7, ease: 'power3.out', stagger: 0.12,
  scrollTrigger: { trigger: '.contato-layout', start: 'top 80%', once: true }
})
gsap.from('.contato-form', {
  opacity: 0, x: 32, duration: 0.9, ease: 'power3.out',
  scrollTrigger: { trigger: '.contato-layout', start: 'top 80%', once: true }
})

// Footer
gsap.from('.footer-brand, .footer-col', {
  opacity: 0, y: 24, duration: 0.7, ease: 'power3.out', stagger: 0.08,
  scrollTrigger: { trigger: '.footer', start: 'top 90%', once: true }
})

// Credibility
gsap.from('.credibility-label', {
  opacity: 0, y: 16, duration: 0.7,
  scrollTrigger: { trigger: '.section-credibility', start: 'top 85%', once: true }
})

// ── Mobile menu ──────────────────────
const hamburger = document.getElementById('navHamburger')
const navMobile = document.getElementById('navMobile')

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

// ── Service card mouse glow ────────────────
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect()
    card.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width) * 100}%`)
    card.style.setProperty('--mouse-y', `${((e.clientY - rect.top) / rect.height) * 100}%`)
  })
})

// ── Form → WhatsApp ────────────────────
const form = document.getElementById('contatoForm')
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault()
    const data = new FormData(form)
    const msg = encodeURIComponent(
      `Olá, vim pelo site!\n\nNome: ${data.get('nome')}\nEmpresa: ${data.get('empresa')}\nTelefone: ${data.get('telefone')}\nDemanda: ${data.get('demanda') || 'não especificado'}\n\n${data.get('mensagem')}`
    )
    window.open(`https://wa.me/5511XXXXXXXXX?text=${msg}`, '_blank')
    const btn = form.querySelector('button[type="submit"]')
    const orig = btn.innerHTML
    btn.innerHTML = 'Mensagem enviada! ✓'
    btn.style.background = '#16a34a'
    setTimeout(() => { btn.innerHTML = orig; btn.style.background = '' }, 3000)
  })
}
