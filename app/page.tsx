'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './page.module.css'

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      render()
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      })
    }

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', handleMouseMove)
    resize()

    function render() {
      if (!ctx || !canvas) return

      const w = canvas.width
      const h = canvas.height

      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.6)
      skyGrad.addColorStop(0, '#87CEEB')
      skyGrad.addColorStop(1, '#B0D8F0')
      ctx.fillStyle = skyGrad
      ctx.fillRect(0, 0, w, h * 0.6)

      // Ground
      ctx.fillStyle = '#2a2a2a'
      ctx.fillRect(0, h * 0.6, w, h * 0.4)

      // Sun/light source
      const sunX = w * (0.7 + mousePos.x * 0.2)
      const sunY = h * (0.15 + mousePos.y * 0.1)
      const sunGrad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 150)
      sunGrad.addColorStop(0, 'rgba(255, 255, 200, 0.8)')
      sunGrad.addColorStop(1, 'rgba(255, 255, 200, 0)')
      ctx.fillStyle = sunGrad
      ctx.fillRect(0, 0, w, h * 0.6)

      // Building base measurements
      const buildingWidth = Math.min(w * 0.5, 600)
      const buildingHeight = h * 0.55
      const buildingX = (w - buildingWidth) / 2
      const buildingY = h * 0.6 - buildingHeight

      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
      ctx.beginPath()
      ctx.moveTo(buildingX - 20, h * 0.6)
      ctx.lineTo(buildingX - 60, h * 0.6 + 40)
      ctx.lineTo(buildingX + buildingWidth - 60, h * 0.6 + 40)
      ctx.lineTo(buildingX + buildingWidth - 20, h * 0.6)
      ctx.closePath()
      ctx.fill()

      // Concrete base section
      const concreteGrad = ctx.createLinearGradient(buildingX, buildingY, buildingX + buildingWidth, buildingY)
      concreteGrad.addColorStop(0, '#6a6a6a')
      concreteGrad.addColorStop(0.5, '#8a8a8a')
      concreteGrad.addColorStop(1, '#6a6a6a')
      ctx.fillStyle = concreteGrad
      ctx.fillRect(buildingX, buildingY + buildingHeight * 0.7, buildingWidth, buildingHeight * 0.3)

      // Concrete texture lines
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)'
      ctx.lineWidth = 2
      for (let i = 0; i < 4; i++) {
        const y = buildingY + buildingHeight * 0.7 + (buildingHeight * 0.3 / 4) * i
        ctx.beginPath()
        ctx.moveTo(buildingX, y)
        ctx.lineTo(buildingX + buildingWidth, y)
        ctx.stroke()
      }

      // Wood accent panels
      const woodY = buildingY + buildingHeight * 0.35
      const woodHeight = buildingHeight * 0.35
      const panelWidth = buildingWidth * 0.15

      // Left wood panel
      const woodGrad1 = ctx.createLinearGradient(buildingX, woodY, buildingX + panelWidth, woodY)
      woodGrad1.addColorStop(0, '#5c4033')
      woodGrad1.addColorStop(0.5, '#8b6f47')
      woodGrad1.addColorStop(1, '#5c4033')
      ctx.fillStyle = woodGrad1
      ctx.fillRect(buildingX, woodY, panelWidth, woodHeight)

      // Right wood panel
      const woodGrad2 = ctx.createLinearGradient(buildingX + buildingWidth - panelWidth, woodY, buildingX + buildingWidth, woodY)
      woodGrad2.addColorStop(0, '#5c4033')
      woodGrad2.addColorStop(0.5, '#8b6f47')
      woodGrad2.addColorStop(1, '#5c4033')
      ctx.fillStyle = woodGrad2
      ctx.fillRect(buildingX + buildingWidth - panelWidth, woodY, panelWidth, woodHeight)

      // Wood grain texture
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)'
      ctx.lineWidth = 1
      for (let i = 0; i < 25; i++) {
        const y = woodY + (woodHeight / 25) * i
        ctx.beginPath()
        ctx.moveTo(buildingX, y)
        ctx.lineTo(buildingX + panelWidth, y)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(buildingX + buildingWidth - panelWidth, y)
        ctx.lineTo(buildingX + buildingWidth, y)
        ctx.stroke()
      }

      // Glass facade (center section)
      const glassX = buildingX + panelWidth
      const glassWidth = buildingWidth - panelWidth * 2
      const glassGrad = ctx.createLinearGradient(glassX, buildingY, glassX, buildingY + buildingHeight * 0.7)
      glassGrad.addColorStop(0, 'rgba(135, 206, 235, 0.7)')
      glassGrad.addColorStop(0.3, 'rgba(176, 224, 230, 0.5)')
      glassGrad.addColorStop(0.7, 'rgba(70, 130, 180, 0.6)')
      glassGrad.addColorStop(1, 'rgba(100, 149, 237, 0.4)')
      ctx.fillStyle = glassGrad
      ctx.fillRect(glassX, buildingY, glassWidth, buildingHeight * 0.7)

      // Glass reflections
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.fillRect(glassX + glassWidth * 0.1, buildingY + 20, glassWidth * 0.3, 80)
      ctx.fillRect(glassX + glassWidth * 0.6, buildingY + buildingHeight * 0.2, glassWidth * 0.25, 60)

      // Sun reflection on glass
      const reflectGrad = ctx.createRadialGradient(
        glassX + glassWidth * 0.7,
        buildingY + buildingHeight * 0.15,
        0,
        glassX + glassWidth * 0.7,
        buildingY + buildingHeight * 0.15,
        glassWidth * 0.3
      )
      reflectGrad.addColorStop(0, 'rgba(255, 255, 200, 0.6)')
      reflectGrad.addColorStop(1, 'rgba(255, 255, 200, 0)')
      ctx.fillStyle = reflectGrad
      ctx.fillRect(glassX, buildingY, glassWidth, buildingHeight * 0.7)

      // Vertical mullions (window frames)
      ctx.fillStyle = 'rgba(60, 60, 60, 0.8)'
      const mullionCount = 6
      for (let i = 0; i <= mullionCount; i++) {
        const x = glassX + (glassWidth / mullionCount) * i
        ctx.fillRect(x - 2, buildingY, 4, buildingHeight * 0.7)
      }

      // Horizontal mullions
      const floorCount = 8
      for (let i = 0; i <= floorCount; i++) {
        const y = buildingY + (buildingHeight * 0.7 / floorCount) * i
        ctx.fillRect(glassX, y - 2, glassWidth, 4)
      }

      // Top concrete cap
      const capGrad = ctx.createLinearGradient(buildingX, buildingY, buildingX + buildingWidth, buildingY)
      capGrad.addColorStop(0, '#4a4a4a')
      capGrad.addColorStop(0.5, '#7a7a7a')
      capGrad.addColorStop(1, '#4a4a4a')
      ctx.fillStyle = capGrad
      ctx.fillRect(buildingX, buildingY, buildingWidth, buildingHeight * 0.08)

      // Geometric accent lines on top
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(buildingX + buildingWidth * 0.2, buildingY + buildingHeight * 0.04)
      ctx.lineTo(buildingX + buildingWidth * 0.8, buildingY + buildingHeight * 0.04)
      ctx.stroke()

      // Edge highlights
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(buildingX, buildingY)
      ctx.lineTo(buildingX, buildingY + buildingHeight)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(buildingX + buildingWidth, buildingY)
      ctx.lineTo(buildingX + buildingWidth, buildingY + buildingHeight)
      ctx.stroke()
    }

    let animationFrame: number
    const animate = () => {
      render()
      animationFrame = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrame)
    }
  }, [mousePos])

  return (
    <main className={styles.main}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.overlay}>
        <div className={styles.title}>
          <h1>MODERN FAÇADE</h1>
          <p>Concrete · Glass · Wood</p>
        </div>
        <div className={styles.specs}>
          <div className={styles.specItem}>
            <span className={styles.label}>Materials</span>
            <span className={styles.value}>Exposed Concrete, Tempered Glass, Natural Wood</span>
          </div>
          <div className={styles.specItem}>
            <span className={styles.label}>Design</span>
            <span className={styles.value}>Clean Lines, Geometric Rhythm</span>
          </div>
          <div className={styles.specItem}>
            <span className={styles.label}>Lighting</span>
            <span className={styles.value}>Natural Daylight Integration</span>
          </div>
          <div className={styles.specItem}>
            <span className={styles.label}>Quality</span>
            <span className={styles.value}>8K Photo-Realistic Render</span>
          </div>
        </div>
      </div>
    </main>
  )
}
