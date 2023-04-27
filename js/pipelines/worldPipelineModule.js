import { Clock } from 'three'

import Layout from '../classes/Layout'
import Lights from '../classes/Lights'
import Kanji from '../classes/Kanji'
import ParticlesSystem from '../classes/ParticlesSystem'

import KanjiClient from '../classes/KanjiClient'

export const initWorldPipelineModule = () => {
  const clock = new Clock()

  const init = () => {
    Layout.init()
    Lights.init()
    ParticlesSystem.init()

    KanjiClient.fetchJoyoKanji()
  }

  const render = () => {
    const elapsedTime = clock.getElapsedTime()

    Kanji?.update(elapsedTime)
    ParticlesSystem?.update(elapsedTime)
  }

  return {
    name: 'world-content',

    onStart: () => init(),

    onRender: () => render(),
  }
}
