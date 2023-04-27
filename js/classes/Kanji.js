import * as THREE from 'three'

import { gsap } from 'gsap'

import { bezierConstantDensity } from './Utils/Bezier'
import { Easings } from './Utils/Easing'
import { mix } from './Utils/Maths'
import KanjiMaterial from './Materials/KanjiMaterial'

class _Kanji {
  createPointsCloud(data) {
    // create a BufferGeometry
    const geometry = new THREE.BufferGeometry()

    // create Float32Arrays to hold the position and size data
    const positions = new Float32Array(data.points.length * 3)
    const sizes = new Float32Array(data.sizes.length)
    const randomness = new Float32Array(data.sizes.length * 3)

    // loop through the points array and add the position and size data to the Float32Arrays
    for (let i = 0; i < data.points.length; i++) {
      positions[i * 3] = data.points[i].x //+ Math.random() * 0.2 - 0.1
      positions[i * 3 + 1] = data.points[i].y //+ Math.random() * 0.2 - 0.1
      positions[i * 3 + 2] = data.points[i].z //+ Math.random() * 0.2 - 0.1
      sizes[i] = data.sizes[i]

      randomness[i * 3] = Math.random() * 2 - 1 //+ Math.random() * 0.2 - 0.1
      randomness[i * 3 + 1] = Math.random() * 2 - 1 //+ Math.random() * 0.2 - 0.1
      randomness[i * 3 + 2] = Math.random() * 2 - 1
    }

    // add the position and size data to the BufferGeometry
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randomness, 3))

    // create the material for the points
    const material = new KanjiMaterial()
    this.materials.push(material)

    // create the Points object
    const pointsCloud = new THREE.Points(geometry, material)
    pointsCloud.rotateX(Math.PI)
    pointsCloud.scale.multiplyScalar(0.7)

    this.group.add(pointsCloud)
  }

  getLines(svg) {
    let lines = []

    const pathNodes = svg.querySelectorAll('path')

    pathNodes.forEach((p) => {
      // console.log("path");
      if (p instanceof SVGPathElement && p.pathSegList) {
        let x = 0
        let y = 0
        const segments = p.pathSegList
        let segmentPoints = []

        for (let i = 0; i < segments.numberOfItems; i++) {
          const segment = segments.getItem(i)
          if (segment instanceof SVGPathSegMovetoAbs) {
            // Move
            x = segment.x
            y = segment.y
            segmentPoints.push(new THREE.Vector3(x, y, 0))
          } else if (segment instanceof SVGPathSegCurvetoCubicRel) {
            // Curve relative
            const from = { x, y }
            const to = { x: x + segment.x, y: y + segment.y }
            const p1 = { x: x + segment.x1, y: y + segment.y1 }
            const p2 = { x: x + segment.x2, y: y + segment.y2 }
            segmentPoints = segmentPoints.concat(
              bezierConstantDensity(from, p1, p2, to)
            )
            x += segment.x
            y += segment.y
          } else if (segment instanceof SVGPathSegCurvetoCubicAbs) {
            // Curve absolute
            const from = { x, y }
            const to = { x: segment.x, y: segment.y }
            const p1 = { x: segment.x1, y: segment.y1 }
            const p2 = { x: segment.x2, y: segment.y2 }
            segmentPoints = segmentPoints.concat(
              bezierConstantDensity(from, p1, p2, to)
            )
            x = segment.x
            y = segment.y
          } else if (segment instanceof SVGPathSegCurvetoCubicSmoothRel) {
            // Curve absolute
            const from = { x, y }
            const to = { x: x + segment.x, y: y + segment.y }
            const p = { x: x + segment.x2, y: y + segment.y2 }
            segmentPoints = segmentPoints.concat(
              bezierConstantDensity(from, p, p, to)
            )
            x = x + segment.x
            y = y + segment.y
          } else if (segment instanceof SVGPathSegMovetoRel) {
            // Move
            x += segment.x
            y += segment.y
            segmentPoints.push(new THREE.Vector3(x, y, 0))
          } else if (segment instanceof SVGPathSegCurvetoCubicSmoothAbs) {
            // Curve absolute
            const from = { x, y }
            const to = { x: x + segment.x, y: y + segment.y }
            const p = { x: x + segment.x2, y: y + segment.y2 }
            segmentPoints = segmentPoints.concat(
              bezierConstantDensity(from, p, p, to)
            )
            x = segment.x
            y = segment.y
          } else {
            debugger
          }
        }

        lines.push({ points: segmentPoints })
      }
    })

    // Load

    let min = { x: Infinity, y: Infinity }
    let max = { x: -Infinity, y: -Infinity }

    for (const line of lines) {
      let ptr = 0
      const sizes = []
      for (const p of line.points) {
        // iteratePoint(p);
        p.multiplyScalar(0.1)
        min.x = Math.min(min.x, p.x)
        min.y = Math.min(min.y, p.y)
        max.x = Math.max(max.x, p.x)
        max.y = Math.max(max.y, p.y)

        const s = mix(0, 1, Easings.OutQuint(ptr / line.points.length))
        sizes.push(s)
        ptr++
      }
      line.sizes = sizes
    }
    let c = { x: min.x + (max.x - min.x) / 2, y: min.y + (max.y - min.y) / 2 }

    for (const line of lines) {
      for (const p of line.points) {
        p.x -= c.x
        p.y -= c.y
      }
    }

    return lines
  }

  getSvgParseFromString(text) {
    try {
      const parser = new DOMParser()
      const svg = parser.parseFromString(text, 'image/svg+xml')
      return svg
    } catch (error) {
      console.log('error-svg-parse-from-string', { error })
    }
  }

  setConfig() {
    this.materials = []

    if (!this.group) {
      const { scene, camera } = XR8.Threejs.xrScene()

      const group = new THREE.Group()
      scene.add(group)
      camera.lookAt(group.position)

      this.group = group
    } else {
      this.clear()
    }
  }

  draw(text) {
    this.setConfig()

    const svg = this.getSvgParseFromString(text)
    const lines = this.getLines(svg)

    // Draw kanji
    lines.forEach(({ points, sizes }) => {
      this.createPointsCloud({ points, sizes })
    })

    const scales = this.materials.map((m) => m.uniforms.uScale)

    gsap.to(scales, {
      value: 1,
      duration: 0.8,
      delay: 0.1,
      ease: 'power3.out',
    })
  }

  clear() {
    if (!this.group) return

    while (this.group.children.length > 0) {
      const child = this.group.children[0]
      this.group.remove(child)

      child?.geometry?.dispose()
      child?.material?.dispose()
    }
  }

  update(elapsedTime) {
    if (this.materials) {
      this.materials.forEach((m) => {
        m.uniforms.uTime.value = elapsedTime
      })
    }
  }
}
const Kanji = new _Kanji()
export default Kanji
