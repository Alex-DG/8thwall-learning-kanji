import { ShaderMaterial, AdditiveBlending, Color } from 'three'

import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'

class KanjiMaterial extends ShaderMaterial {
  constructor(
    color1 = new Color(0xffffff * Math.random()),
    color2 = new Color(0xffffff * Math.random())
  ) {
    super({
      uniforms: {
        uTime: { value: 0 },
        uScale: { value: 0 },
        uFrequency: { value: 0.15 },
        uColor1: { value: color1 },
        uColor2: { value: color2 },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: AdditiveBlending,
    })
  }
}

export default KanjiMaterial
