import * as THREE from 'three'

class _Lights {
  setDirectionalLight() {
    const directionalLight = new THREE.DirectionalLight('#ffffff', 1.2)
    directionalLight.position.set(4, 3, 1)

    const { scene } = XR8.Threejs.xrScene()
    scene.add(directionalLight)
  }

  setAmbientLight() {
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.4)

    const { scene } = XR8.Threejs.xrScene()
    scene.add(ambientLight)
  }

  init() {
    this.setDirectionalLight()
    this.setAmbientLight()
  }
}

const Lights = new _Lights()
export default Lights
