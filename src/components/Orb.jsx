import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vPos;

  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    vPos = position;
    gl_Position = projectionMatrix * mv;
  }
`

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uA;
  uniform vec3 uB;
  uniform vec3 uC;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vPos;

  float hash(vec3 p) {
    return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453123);
  }

  float vnoise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float n000 = hash(i);
    float n100 = hash(i + vec3(1.0, 0.0, 0.0));
    float n010 = hash(i + vec3(0.0, 1.0, 0.0));
    float n110 = hash(i + vec3(1.0, 1.0, 0.0));
    float n001 = hash(i + vec3(0.0, 0.0, 1.0));
    float n101 = hash(i + vec3(1.0, 0.0, 1.0));
    float n011 = hash(i + vec3(0.0, 1.0, 1.0));
    float n111 = hash(i + vec3(1.0, 1.0, 1.0));
    float x00 = mix(n000, n100, f.x);
    float x10 = mix(n010, n110, f.x);
    float x01 = mix(n001, n101, f.x);
    float x11 = mix(n011, n111, f.x);
    return mix(mix(x00, x10, f.y), mix(x01, x11, f.y), f.z);
  }

  void main() {
    vec3 n = normalize(vNormal);
    vec3 view = normalize(vView);
    float fres = pow(1.0 - clamp(dot(n, view), 0.0, 1.0), 2.6);

    float f1 = vnoise(vPos * 1.9 + vec3(0.0, uTime * 0.13, uTime * 0.09));
    float f2 = vnoise(vPos * 4.2 - vec3(uTime * 0.11, 0.0, uTime * 0.07));
    float band = smoothstep(0.30, 0.78, f1 * 0.62 + f2 * 0.55);

    vec3 col = mix(uA, uB, band);
    col = mix(col, uC, clamp(fres * 0.92, 0.0, 1.0));

    vec3 lightDir = normalize(vec3(0.55, 0.85, 0.65));
    float spec = pow(max(dot(reflect(-view, n), lightDir), 0.0), 26.0);
    col += spec * 0.85;

    float alpha = clamp(0.20 + fres * 0.80 + band * 0.10, 0.0, 1.0);
    gl_FragColor = vec4(col, alpha);
    #include <colorspace_fragment>
  }
`

/**
 * The "360° Purity Orb" — a lightweight iridescent glass sphere with a faceted
 * geometric shell, an orbit ring and drifting droplet motes.
 * Cursor + scroll reactive, DPR capped, paused off-screen and when reduced
 * motion is requested.
 */
export default function Orb() {
  const holder = useRef(null)

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

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compact ? 1.6 : 2))
    renderer.setSize(el.clientWidth || 1, el.clientHeight || 1, false)
    renderer.domElement.setAttribute('aria-hidden', 'true')
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, (el.clientWidth || 1) / (el.clientHeight || 1), 0.1, 100)
    camera.position.set(0, 0, 5.8)

    const group = new THREE.Group()
    scene.add(group)

    const uniforms = {
      uTime: { value: 0 },
      uA: { value: new THREE.Color('#0b9c6d') },
      uB: { value: new THREE.Color('#6ee7b7') },
      uC: { value: new THREE.Color('#eafff8') },
    }

    const sphereGeo = new THREE.SphereGeometry(1.28, compact ? 64 : 96, compact ? 64 : 96)
    const sphereMat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    })
    const orb = new THREE.Mesh(sphereGeo, sphereMat)
    group.add(orb)

    const shellGeo = new THREE.IcosahedronGeometry(1.66, 1)
    const shellMat = new THREE.MeshBasicMaterial({
      color: 0x6ee7b7,
      wireframe: true,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
    })
    const shell = new THREE.Mesh(shellGeo, shellMat)
    group.add(shell)

    const ringGeo = new THREE.TorusGeometry(1.98, 0.006, 6, 180)
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.55 })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.rotation.x = Math.PI / 2.35
    ring.rotation.y = 0.35
    group.add(ring)

    const ring2 = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0xa7f3d0, transparent: true, opacity: 0.22 }))
    ring2.scale.setScalar(1.12)
    ring2.rotation.x = Math.PI / 1.7
    ring2.rotation.z = 0.6
    group.add(ring2)

    const moteCount = compact ? 90 : 160
    const positions = new Float32Array(moteCount * 3)
    for (let i = 0; i < moteCount; i++) {
      const r = 1.9 + Math.random() * 1.5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.cos(phi) * 0.85
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
    }
    const moteGeo = new THREE.BufferGeometry()
    moteGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const moteMat = new THREE.PointsMaterial({
      color: 0xa7f3d0,
      size: 0.028,
      transparent: true,
      opacity: 0.75,
      sizeAttenuation: true,
      depthWrite: false,
    })
    const motes = new THREE.Points(moteGeo, moteMat)
    group.add(motes)

    const pointer = new THREE.Vector2(0, 0)
    const target = new THREE.Vector2(0, 0)
    const clock = new THREE.Clock()
    let raf = 0
    let visible = true
    let scroll = 0

    const onPointerMove = (event) => {
      const rect = el.getBoundingClientRect()
      target.x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1
      target.y = ((event.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1
    }
    const onScroll = () => {
      scroll = window.scrollY || 0
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })

    const render = () => {
      renderer.render(scene, camera)
    }

    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!visible) return

      const t = clock.getElapsedTime()
      uniforms.uTime.value = t

      pointer.lerp(target, 0.055)

      group.position.y = -Math.min(scroll * 0.0012, 0.55)
      group.rotation.y += 0.0024
      group.rotation.x += (pointer.y * 0.28 - group.rotation.x) * 0.045
      group.rotation.z += (pointer.x * -0.12 - group.rotation.z) * 0.045

      shell.rotation.y -= 0.0034
      shell.rotation.x += 0.0011
      ring.rotation.z += 0.0016
      ring2.rotation.z -= 0.0011
      motes.rotation.y += 0.0007

      camera.position.x += (pointer.x * 0.52 - camera.position.x) * 0.05
      camera.position.y += (pointer.y * -0.36 - camera.position.y) * 0.05
      camera.lookAt(0, 0, 0)

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
      },
      { threshold: 0.01 }
    )
    io.observe(el)

    const ro = new ResizeObserver(() => {
      const w = el.clientWidth || 1
      const h = el.clientHeight || 1
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
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('scroll', onScroll)
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
          mats.forEach((m) => m.dispose())
        }
      })
      renderer.dispose()
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div className="orb-wrap" ref={holder}>
      <span className="orb-caption">360° Purity Orb — drag to explore</span>
    </div>
  )
}
