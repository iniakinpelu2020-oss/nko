import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * Zone callouts. `at` is a point in the building's local space; each frame it is
 * projected to screen space and the HTML tag is positioned over the model.
 */
const ZONES = [
  { id: 'office', label: 'Office Floor', note: 'Daily & periodic cleaning', at: new THREE.Vector3(1.0, 1.32, 0.55) },
  { id: 'glass', label: 'Glass Facade', note: 'Pure-water pole system', at: new THREE.Vector3(-1.1, -0.12, 0.5) },
  { id: 'reception', label: 'Reception & Sanitisation', note: 'Touchpoint disinfection', at: new THREE.Vector3(0.92, -1.22, 0.86) },
]

function environmentTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 128
  const g = canvas.getContext('2d')
  if (!g) return null

  const sky = g.createLinearGradient(0, 0, 0, 128)
  sky.addColorStop(0, '#070f24')
  sky.addColorStop(0.34, '#13284a')
  sky.addColorStop(0.5, '#3f7f74')
  sky.addColorStop(0.56, '#0b132b')
  sky.addColorStop(1, '#040a18')
  g.fillStyle = sky
  g.fillRect(0, 0, 256, 128)

  const bloom = g.createRadialGradient(196, 34, 2, 196, 34, 46)
  bloom.addColorStop(0, 'rgba(255,255,255,0.95)')
  bloom.addColorStop(0.4, 'rgba(167,243,208,0.55)')
  bloom.addColorStop(1, 'rgba(16,185,129,0)')
  g.fillStyle = bloom
  g.fillRect(140, 0, 120, 90)

  const floorGlow = g.createLinearGradient(0, 96, 0, 128)
  floorGlow.addColorStop(0, 'rgba(16,185,129,0.5)')
  floorGlow.addColorStop(1, 'rgba(16,185,129,0)')
  g.fillStyle = floorGlow
  g.fillRect(0, 96, 256, 32)

  const tex = new THREE.CanvasTexture(canvas)
  tex.mapping = THREE.EquirectangularReflectionMapping
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function sparkleTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 64
  const g = canvas.getContext('2d')
  if (!g) return null
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.32, 'rgba(209,250,229,0.8)')
  grad.addColorStop(0.7, 'rgba(52,211,153,0.22)')
  grad.addColorStop(1, 'rgba(16,185,129,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 64, 64)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export default function FacilityScene() {
  const holder = useRef(null)
  const tagRefs = useRef([])

  useEffect(() => {
    const el = holder.current
    if (!el) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const compact = window.innerWidth < 760

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    } catch {
      return
    }

    const width = () => el.clientWidth || 1
    const height = () => el.clientHeight || 1

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compact ? 1.5 : 2))
    renderer.setSize(width(), height(), false)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.02
    renderer.domElement.setAttribute('aria-hidden', 'true')
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(34, width() / height(), 0.1, 60)

    // Procedural studio environment — gives the glass real reflections
    // without loading an HDR file.
    const envCanvas = environmentTexture()
    let envRT = null
    if (envCanvas) {
      const pmrem = new THREE.PMREMGenerator(renderer)
      envRT = pmrem.fromEquirectangular(envCanvas)
      scene.environment = envRT.texture
      envCanvas.dispose()
      pmrem.dispose()
    }

    scene.add(new THREE.HemisphereLight(0xd9fbf1, 0x0b132b, 1.1))

    const key = new THREE.DirectionalLight(0xffffff, 2.1)
    key.position.set(4.5, 7, 5)
    scene.add(key)

    const rim = new THREE.DirectionalLight(0x6ee7b7, 1.4)
    rim.position.set(-5, 2.5, -4)
    scene.add(rim)

    const under = new THREE.PointLight(0x10b981, 16, 7, 2)
    under.position.set(0, -1.1, 1.4)
    scene.add(under)

    // ---------------------------------------------------------------- model
    const building = new THREE.Group()
    scene.add(building)

    const M = {
      glass: new THREE.MeshPhysicalMaterial({
        color: 0x2f8074,
        metalness: 0.35,
        roughness: 0.05,
        transparent: true,
        opacity: 0.54,
        clearcoat: 1,
        clearcoatRoughness: 0.04,
        envMapIntensity: 2.6,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
      frame: new THREE.MeshStandardMaterial({ color: 0xf2faf8, metalness: 0.9, roughness: 0.2, envMapIntensity: 1.4 }),
      slab: new THREE.MeshStandardMaterial({ color: 0xe3eae9, metalness: 0.08, roughness: 0.55 }),
      dark: new THREE.MeshStandardMaterial({ color: 0x0b132b, metalness: 0.55, roughness: 0.35 }),
      stone: new THREE.MeshStandardMaterial({ color: 0xdbe6e4, metalness: 0.08, roughness: 0.7 }),
      plant: new THREE.MeshStandardMaterial({ color: 0x0f9d6f, metalness: 0.05, roughness: 0.75 }),
      lit: new THREE.MeshBasicMaterial({ color: 0xd6fff0, transparent: true, opacity: 0.34 }),
    }

    const box = (w, h, d, mat, x, y, z, parent = building) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
      mesh.position.set(x, y, z)
      parent.add(mesh)
      return mesh
    }

    // plinth / site
    box(3.6, 0.2, 2.9, M.dark, 0, -1.7, 0)
    box(3.68, 0.04, 2.98, M.stone, 0, -1.59, 0)
    box(3.72, 0.014, 3.02, new THREE.MeshBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.65 }), 0, -1.56, 0)

    // reception volume (double height)
    box(2.24, 0.82, 1.68, M.glass, 0, -1.13, 0)
    box(2.3, 0.08, 1.74, M.slab, 0, -0.7, 0)
    ;[
      [-1.1, 0, -0.82],
      [1.1, 0, -0.82],
      [-1.1, 0, 0.82],
      [1.1, 0, 0.82],
    ].forEach(([x, , z]) => box(0.07, 0.84, 0.07, M.frame, x, -1.13, z))
    box(2.34, 0.07, 1.82, M.frame, 0, -0.6, 0)
    box(2.2, 0.02, 1.62, M.lit, 0, -1.4, 0)
    // reception desk + seating
    box(0.62, 0.16, 0.24, M.slab, -0.1, -1.32, 0.42)
    box(0.05, 0.14, 0.22, M.frame, -0.38, -1.4, 0.42)
    box(0.05, 0.14, 0.22, M.frame, 0.18, -1.4, 0.42)
    box(0.24, 0.1, 0.24, M.dark, 0.72, -1.38, -0.28)

    // three office floors
    const floors = 3
    for (let i = 0; i < floors; i++) {
      const base = -0.6 + i * 0.66
      box(2.14, 0.04, 1.6, M.slab, 0, base, 0)
      box(2.08, 0.54, 1.54, M.glass, 0, base + 0.31, 0)
      box(2.18, 0.04, 1.64, M.slab, 0, base + 0.6, 0)
      // structural cage
      ;[
        [-1.02, -0.77],
        [1.02, -0.77],
        [-1.02, 0.77],
        [1.02, 0.77],
      ].forEach(([x, z]) => box(0.055, 0.6, 0.055, M.frame, x, base + 0.3, z))
      // facade mullions
      ;[-0.52, 0, 0.52].forEach((x) => box(0.035, 0.54, 0.035, M.frame, x, base + 0.31, 0.77))
      ;[-0.52, 0.52].forEach((x) => box(0.035, 0.54, 0.035, M.frame, x, base + 0.31, -0.77))
      ;[-0.5, 0.5].forEach((z) => box(0.035, 0.54, 0.035, M.frame, -1.02, base + 0.31, z))
      // interior glow strip
      box(1.9, 0.03, 0.03, M.lit, 0, base + 0.56, 0.6)
    }

    // roof plant + green roof
    box(2.18, 0.05, 1.64, M.slab, 0, 1.37, 0)
    box(1.46, 0.1, 1.02, M.plant, 0, 1.45, 0)
    box(0.5, 0.22, 0.42, M.dark, -0.44, 1.6, -0.1)
    box(0.24, 0.16, 0.24, M.frame, 0.48, 1.57, 0.25)
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.55, 8), M.frame)
    mast.position.set(0.82, 1.66, -0.5)
    building.add(mast)
    const beacon = new THREE.Mesh(
      new THREE.SphereGeometry(0.035, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0x6ee7b7 })
    )
    beacon.position.set(0.82, 1.95, -0.5)
    building.add(beacon)

    // entrance canopy + steps
    box(1.5, 0.05, 0.62, M.frame, 0, -0.86, 1.05)
    box(1.9, 0.06, 0.22, M.stone, 0, -1.5, 1.02)
    box(2.02, 0.05, 0.18, M.stone, 0, -1.58, 1.16)

    // planters / greenery
    ;[
      [-1.85, 1.28],
      [1.85, 1.28],
      [-1.85, -1.05],
    ].forEach(([x, z]) => {
      box(0.26, 0.16, 0.26, M.stone, x, -1.48, z)
      const bush = new THREE.Mesh(new THREE.IcosahedronGeometry(0.19, 1), M.plant)
      bush.position.set(x, -1.3, z)
      bush.scale.y = 1.25
      building.add(bush)
    })

    // emerald zone rings
    const ringGeo = new THREE.RingGeometry(0.62, 0.68, 72)
    const ringMat = () =>
      new THREE.MeshBasicMaterial({
        color: 0x34d399,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })

    const rings = [
      { mesh: new THREE.Mesh(ringGeo, ringMat()), y: 0.62, r: 1.55, axis: 'y', scale: 1 },
      { mesh: new THREE.Mesh(ringGeo, ringMat()), y: -1.5, r: 1.7, axis: 'y', scale: 1.1 },
      { mesh: new THREE.Mesh(ringGeo, ringMat()), y: 0.1, r: 1.0, axis: 'x', scale: 1 },
    ]
    rings.forEach((ring, i) => {
      ring.mesh.position.set(i === 2 ? -1.12 : 0, ring.axis === 'y' ? ring.y : 0.1, i === 2 ? 0 : 0)
      if (ring.axis === 'y') ring.mesh.rotation.x = -Math.PI / 2
      else ring.mesh.rotation.y = Math.PI / 2
      ring.mesh.scale.set(ring.r / 0.65, ring.r / 0.65, 1)
      ring.base = 0.4
      building.add(ring.mesh)
    })

    // zone markers at each anchor
    const markers = ZONES.map((zone) => {
      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(0.042, 14, 14),
        new THREE.MeshBasicMaterial({ color: 0xa7f3d0 })
      )
      marker.position.copy(zone.at)
      building.add(marker)
      return marker
    })

    // cleaning sparkle motes
    const sparkTex = sparkleTexture()
    const count = compact ? 70 : 150
    const pos = new Float32Array(count * 3)
    const seed = new Float32Array(count * 2)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 4.4
      pos[i * 3 + 1] = -1.6 + Math.random() * 3.6
      pos[i * 3 + 2] = (Math.random() - 0.5) * 3.2
      seed[i * 2] = Math.random() * Math.PI * 2
      seed[i * 2 + 1] = 0.05 + Math.random() * 0.12
    }
    const sparkGeo = new THREE.BufferGeometry()
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const sparkMat = new THREE.PointsMaterial({
      map: sparkTex || undefined,
      color: 0xd1fae5,
      size: compact ? 0.09 : 0.11,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    })
    const sparks = new THREE.Points(sparkGeo, sparkMat)
    building.add(sparks)

    // ------------------------------------------------------------ interaction
    const orbit = { theta: 0.66, phi: 1.14, radius: 8.4 }
    const target = { theta: 0.66, phi: 1.14, radius: 8.4 }
    const pointer = new THREE.Vector2(0, 0)
    const pointerSmooth = new THREE.Vector2(0, 0)
    let dragging = false
    let lastX = 0
    let lastY = 0
    let scroll = 0
    let active = 0

    const place = () => {
      const r =
        orbit.radius * (compact ? 1.12 : 1) * (camera.aspect < 1 ? Math.min(1.3, 1 / camera.aspect) : 1)
      const sp = Math.sin(orbit.phi)
      camera.position.set(r * sp * Math.sin(orbit.theta), r * Math.cos(orbit.phi) + 0.1, r * sp * Math.cos(orbit.theta))
      camera.lookAt(0, -0.15, 0)
    }
    place()

    const onDown = (event) => {
      dragging = true
      lastX = event.clientX
      lastY = event.clientY
      el.setPointerCapture?.(event.pointerId)
      el.classList.add('is-dragging')
    }
    const onMove = (event) => {
      const rect = el.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1
      pointer.y = ((event.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1
      if (!dragging) return
      target.theta -= (event.clientX - lastX) * 0.0085
      target.phi = Math.min(1.46, Math.max(0.62, target.phi - (event.clientY - lastY) * 0.006))
      lastX = event.clientX
      lastY = event.clientY
    }
    const onUp = () => {
      dragging = false
      el.classList.remove('is-dragging')
    }
    const onScroll = () => {
      scroll = window.scrollY || 0
    }

    el.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    window.addEventListener('pointercancel', onUp, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })

    // ------------------------------------------------------------- rendering
    const clock = new THREE.Clock()
    const projected = new THREE.Vector3()
    let raf = 0
    let visible = true

    const updateTags = () => {
      const w = width()
      const h = height()
      ZONES.forEach((zone, i) => {
        const tag = tagRefs.current[i]
        const marker = markers[i]
        if (!tag || !marker) return
        projected.copy(marker.position)
        projected.y += 0.06
        projected.project(camera)
        const onScreen = projected.z < 1 && Math.abs(projected.x) < 1.3 && Math.abs(projected.y) < 1.3
        const x = Math.min(Math.max((projected.x * 0.5 + 0.5) * w, 40), w - 40)
        const y = (-projected.y * 0.5 + 0.5) * h
        const toRight = x < w * 0.55
        tag.classList.toggle('is-left', !toRight)
        tag.style.transform = toRight
          ? `translate3d(${x}px, ${y}px, 0) translate(-9px, -50%)`
          : `translate3d(${x}px, ${y}px, 0) translate(-100%, -50%) translateX(9px)`
        tag.style.opacity = onScreen ? '1' : '0'
        tag.classList.toggle('is-active', i === active)
        marker.scale.setScalar(i === active ? 1.5 : 0.9)
      })
    }

    const render = () => {
      renderer.render(scene, camera)
      updateTags()
    }

    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!visible) return

      const t = clock.getElapsedTime()
      pointerSmooth.lerp(pointer, 0.05)

      if (!dragging) target.theta += 0.0012
      target.phi += (1.14 - pointerSmooth.y * 0.16 - target.phi) * 0.012

      orbit.theta += (target.theta - orbit.theta) * 0.075
      orbit.phi += (target.phi - orbit.phi) * 0.075
      place()

      building.position.y = Math.sin(t * 0.8) * 0.035 - Math.min(scroll * 0.0011, 0.4)
      building.rotation.x = pointerSmooth.y * 0.03

      // zone focus follows the scroll position through the hero
      const next = Math.min(ZONES.length - 1, Math.max(0, Math.floor(scroll / 480)))
      active = next

      rings.forEach((ring, i) => {
        const on = i === active
        const pulse = 0.32 + Math.sin(t * 1.8 + i * 1.7) * 0.1
        ring.mesh.material.opacity = on ? pulse + 0.32 : pulse * 0.55
        const s = (ring.r / 0.65) * (on ? 1 + Math.sin(t * 1.8 + i) * 0.02 : 1)
        ring.mesh.scale.set(s, s, 1)
        ring.mesh.rotation.z += on ? 0.0035 : 0.0008
      })

      // sparkling motes drift upward and shimmer
      const arr = sparkGeo.attributes.position.array
      for (let i = 0; i < count; i++) {
        arr[i * 3 + 1] += 0.004 + seed[i * 2 + 1] * 0.02
        arr[i * 3] += Math.sin(t * 0.9 + seed[i * 2]) * 0.0016
        if (arr[i * 3 + 1] > 2.1) arr[i * 3 + 1] = -1.6
      }
      sparkGeo.attributes.position.needsUpdate = true
      sparkMat.opacity = 0.55 + Math.sin(t * 2.3) * 0.22

      beacon.material.color.setHSL(0.44, 0.7, 0.55 + Math.sin(t * 2.6) * 0.12)

      render()
    }

    if (reduce) {
      render()
    } else {
      tick()
    }

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true
        if (visible && !reduce) raf || (raf = requestAnimationFrame(tick))
      },
      { threshold: 0.01 }
    )
    io.observe(el)

    const ro = new ResizeObserver(() => {
      const w = width()
      const h = height()
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      if (reduce) render()
    })
    ro.observe(el)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      el.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      window.removeEventListener('scroll', onScroll)
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
          mats.forEach((m) => {
            if (m.map) m.map.dispose()
            m.dispose()
          })
        }
      })
      if (envRT) envRT.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div className="hero-visual" ref={holder}>
      <div className="scene-halo" aria-hidden="true" />
      <div className="scene-tags" aria-hidden="true">
        {ZONES.map((zone, i) => (
          <div className="scene-tag" key={zone.id} ref={(node) => (tagRefs.current[i] = node)} style={{ opacity: 0 }}>
            <i className="scene-dot" />
            <span className="scene-tag-body">
              <strong>{zone.label}</strong>
              <em>{zone.note}</em>
            </span>
          </div>
        ))}
      </div>
      <span className="scene-hint">Drag to orbit · 360° facility view</span>
    </div>
  )
}
