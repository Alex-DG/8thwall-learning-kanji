import Layout from '../classes/Layout'
import Lights from '../classes/Lights'
import ParticlesSystem from '../classes/ParticlesSystem'

import KanjiClient from '../classes/KanjiClient'
import Kanji from '../classes/Kanji'

export const initWorldPipelineModule = () => {
  const initWorld = () => {
    Layout.stopLoading()
    Lights.init()

    // ParticlesSystem.init()

    console.log('✨', 'World ready')
  }

  const init = () => {
    Layout.init()
    KanjiClient.fetchJoyoKanji({ callback: initWorld })
  }

  const render = () => {
    ParticlesSystem?.update()
    Kanji?.update()
  }

  return {
    name: 'world-content',

    onStart: () => init(),

    onRender: () => render(),
  }
}
