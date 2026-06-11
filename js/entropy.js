/* AS Construction — entropy.js */

class Particle {
  constructor(x, y, order, w, h) {
    this.ox = x; this.oy = y
    this.x = x + (Math.random() - 0.5) * 4
    this.y = y + (Math.random() - 0.5) * 4
    this.vx = (Math.random() - 0.5) * 1.5
    this.vy = (Math.random() - 0.5) * 1.5
    this.size = 1.2
    this.order = order
    this.w = w; this.h = h
    this.influence = 0
  }

  update() {
    if (this.order) {
      const dx = this.ox - this.x
      const dy = this.oy - this.y
      this.vx = (this.vx + dx * 0.08) * 0.82
      this.vy = (this.vy + dy * 0.08) * 0.82
      this.x += this.vx + (Math.random() - 0.5) * 0.2 * this.influence
      this.y += this.vy + (Math.random() - 0.5) * 0.2 * this.influence
      this.influence = Math.max(0, this.influence - 0.01)
    } else {
      this.vx += (Math.random() - 0.5) * 0.12
      this.vy += (Math.random() - 0.5) * 0.12
      this.vx *= 0.97
      this.vy *= 0.97
      this.x += this.vx
      this.y += this.vy
      const minX = this.w / 2
      if (this.x < minX)   { this.x = minX;    this.vx *= -1 }
      if (this.x > this.w) { this.x = this.w;  this.vx *= -1 }
      if (this.y < 0)      { this.y = 0;        this.vy *= -1 }
      if (this.y > this.h) { this.y = this.h;   this.vy *= -1 }
    }
  }

  draw(ctx) {
    const alpha = this.order ? Math.max(0.04, 0.28 - this.influence * 0.12) : 0.22
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255,255,255,${alpha})`
    ctx.fill()
  }
}

class EntropyBg {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId)
    if (!this.canvas) return
    this.ctx = this.canvas.getContext('2d')
    this.particles = []
    this.frame = 0
    this.dpr = Math.min(window.devicePixelRatio || 1, 2)
    this.W = 0; this.H = 0
    this.resize()
    window.addEventListener('resize', () => this.resize())
    this.animate()
  }

  resize() {
    const parent = this.canvas.parentElement
    const W = parent.offsetWidth
    const H = parent.offsetHeight
    this.canvas.width  = Math.round(W * this.dpr)
    this.canvas.height = Math.round(H * this.dpr)
    this.canvas.style.width  = W + 'px'
    this.canvas.style.height = H + 'px'
    this.ctx.setTransform(1, 0, 0, 1, 0, 0)
    this.ctx.scale(this.dpr, this.dpr)
    this.W = W; this.H = H
    this.buildParticles()
  }

  buildParticles() {
    this.particles = []
    const SPACING = 52
    const cols = Math.floor(this.W / SPACING)
    const rows = Math.floor(this.H / SPACING)
    if (cols < 2 || rows < 2) return
    const midCol = Math.floor(cols / 2)
    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c <= cols; c++) {
        const px = (c / cols) * this.W
        const py = (r / rows) * this.H
        const order = c < midCol
        this.particles.push(new Particle(px, py, order, this.W, this.H))
      }
    }
  }

  connectNeighbors() {
    const maxDist = 56
    const ctx = this.ctx
    for (let i = 0; i < this.particles.length; i++) {
      const a = this.particles[i]
      if (!a.order) continue
      for (let j = i + 1; j < this.particles.length; j++) {
        const b = this.particles[j]
        if (!b.order) continue
        const dx = a.x - b.x
        const dy = a.y - b.y
        if (Math.abs(dx) > maxDist || Math.abs(dy) > maxDist) continue
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < maxDist) {
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = `rgba(255,255,255,${0.04 * (1 - dist / maxDist)})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }
    }
  }

  animate() {
    const ctx = this.ctx
    ctx.clearRect(0, 0, this.W, this.H)
    this.particles.forEach(p => { p.update(); p.draw(ctx) })
    if (this.frame % 3 === 0) this.connectNeighbors()
    const midX = this.W / 2
    const gradient = ctx.createLinearGradient(midX, 0, midX, this.H)
    gradient.addColorStop(0, 'transparent')
    gradient.addColorStop(0.25, 'rgba(115,1,140,0.20)')
    gradient.addColorStop(0.75, 'rgba(115,1,140,0.20)')
    gradient.addColorStop(1, 'transparent')
    ctx.beginPath()
    ctx.moveTo(midX, 0)
    ctx.lineTo(midX, this.H)
    ctx.strokeStyle = gradient
    ctx.lineWidth = 1
    ctx.stroke()
    this.frame++
    requestAnimationFrame(() => this.animate())
  }
}

document.addEventListener('DOMContentLoaded', () => new EntropyBg('heroEntropyCanvas'))
