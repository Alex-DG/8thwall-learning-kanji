import { Clock } from 'three'

import Layout from '../classes/Layout'
import Lights from '../classes/Lights'

import KanjiClient from '../classes/KanjiClient'
import Kanji from '../classes/Kanji'

export const initWorldPipelineModule = () => {
  const clock = new Clock()

  const init = () => {
    Layout.init()
    Lights.init()

    KanjiClient.fetchJoyoKanji()
  }

  const render = () => {
    const elapsedTime = clock.getElapsedTime()

    Kanji?.update(elapsedTime)
  }

  return {
    name: 'world-content',

    onStart: () => init(),

    onRender: () => render(),
  }
}
