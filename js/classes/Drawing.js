import * as THREE from 'three'
import { MeshLine, MeshLineMaterial } from 'three.meshline'

class _Drawing {
  createb64Img(width = window.innerWidth, height = window.innerHeight) {
    const group = this.lines

    //  const { camera, scene } = XR8.Threejs.xrScene()
    // Create a new scene and camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)

    // Add the group to the new scene
    const scene = new THREE.Scene()
    scene.add(group.clone())

    // Position the camera to look at the center of the group
    const box = new THREE.Box3().setFromObject(group)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    camera.position.set(
      center.x,
      center.y,
      center.z + Math.max(size.x, size.y, size.z)
    )
    camera.lookAt(center)

    // Create a WebGLRenderer and set its size
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.render(scene, camera)

    // Get the PNG data URL from the renderer
    const dataUrl = renderer.domElement.toDataURL('image/png')

    // Clean up memory
    renderer.dispose()

    return dataUrl
  }

  createLine(points) {
    const geometry = new THREE.BufferGeometry().setFromPoints(points)

    const line = new MeshLine()
    line.setGeometry(geometry)

    const material = new MeshLineMaterial({
      useMap: true,
      map: this.texture,
      color: this.color,
      lineWidth: 0.25,
      sizeAttenuation: 1,
      depthTest: false,
      opacity: 1,
      transparent: true,
      side: THREE.DoubleSide,
    })

    return new THREE.Mesh(line.geometry, material)

    // return new THREE.Line(geometry, material)
  }

  screenToWorld(x, y) {
    const { camera } = XR8.Threejs.xrScene()

    const vector = new THREE.Vector3(
      (x / window.innerWidth) * 2 - 1,
      -(y / window.innerHeight) * 2 + 1,
      0.5
    )
    vector.unproject(camera)

    const dir = vector.sub(camera.position).normalize()
    const distance = -camera.position.z / dir.z

    return camera.position.clone().add(dir.multiplyScalar(distance))
  }

  ////////////////////////////////////////////////////////////

  onTouchStart(event) {
    event.preventDefault()

    this.drawing = true
    this.points = [] // clear points

    const point = this.screenToWorld(
      event.touches[0].clientX,
      event.touches[0].clientY
    )
    this.points.push(point)
  }

  onTouchMove(event) {
    event.preventDefault()

    if (!this.drawing) return
    const point = this.screenToWorld(
      event.touches[0].clientX,
      event.touches[0].clientY
    )
    this.points.push(point)

    // Remove the last line from the scene and clear it from memory
    // if (this.lines.children.length > 0) {
    //   const lastLine = this.lines.children[this.lines.children.length - 1]
    //   // this.lines.remove(lastLine)
    //   // lastLine.geometry.dispose()
    //   // lastLine.material.dispose()
    // }

    const line = this.createLine(this.points)
    this.lines.add(line)
  }

  onTouchEnd(event) {
    event.preventDefault()
    this.drawing = false

    // Create a new line with the current points and add it to the lines object
    const line = this.createLine(this.points)
    this.lines.add(line)

    // Reset points for the next drawing
    this.points = []
  }

  ////////////////////////////////////////////////////////////

  setColor(value) {
    this.color = new THREE.Color(value)
  }

  setDrawingEvents() {
    const { renderer } = XR8.Threejs.xrScene()
    const canvas = renderer.domElement

    canvas.addEventListener('touchstart', this.onTouchStart)
    canvas.addEventListener('touchmove', this.onTouchMove)
    canvas.addEventListener('touchend', this.onTouchEnd)
  }

  async loadTexture(source = '/textures/stroke.png') {
    try {
      const textureLoader = new THREE.TextureLoader()
      const texture = await textureLoader.loadAsync(source)
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping

      this.texture = texture

      this.setDrawingEvents()
    } catch (error) {
      console.log('load-glb-error', { error })
    }
  }

  ////////////////////////////////////////////////////////////

  bind() {
    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchMove = this.onTouchMove.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)
  }

  init() {
    this.bind()

    const { scene } = XR8.Threejs.xrScene()

    this.scene = scene

    this.isReady = false
    this.drawing = false
    this.points = []

    this.color = new THREE.Color('black')

    this.lines = new THREE.Group()

    this.scene.add(this.lines)

    this.currentLine = null

    this.loadTexture()
  }

  ////////////////////////////////////////////////////////////

  update(elapsedTime) {
    // if (this.lines) {
    //   this.lines.traverse((child) => {
    //     if (child.material && child.material.uniforms) {
    //       // child.material.uniforms.time.value += 0.1
    //     }
    //   })
    // }
  }
}

const Drawing = new _Drawing()
export default Drawing
