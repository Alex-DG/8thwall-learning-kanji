import Kanji from './Kanji'
import KanjiClient from './KanjiClient'

import { gsap } from 'gsap'

class _Layout {
  async onClickNextBtn() {
    this.startLoading()

    const randomJojoKanji = KanjiClient.getRandomJoyoKanji()
    console.log('->', 'Next Kanji', randomJojoKanji)

    const kanjiDetails = await KanjiClient.fetchKanjiDetails(randomJojoKanji)
    const { text } = await KanjiClient.fetchKanjiSvg(kanjiDetails?.unicode)

    await Kanji.draw(text)

    this.updateKanjiPanel(kanjiDetails)
    this.stopLoading()
  }

  onToggleTopBtn() {
    if (this.topMenuEnabled) {
      gsap.to(this.toggleTopMBtn, {
        opacity: 0.2,
        duration: 0.5,
        ease: 'power3.out',
        onStart: () => {
          this.topMenu.style.display = 'none'
        },
      })
    } else {
      gsap.to(this.toggleTopMBtn, {
        opacity: 1,
        duration: 0.5,
        ease: 'power3.out',
        onStart: () => {
          this.topMenu.style.display = 'flex'
        },
      })
    }

    this.topMenuEnabled = !this.topMenuEnabled
  }

  ////////////////////////////////////////////////////////////////

  updateKanjiPanel(data) {
    const {
      kanji,
      stroke,
      meanings,
      gradeJltp,
      kunReadings,
      nameReadings,
      unicode,
    } = this.kanjiPanel

    kanji.innerText = data.kanji
    stroke.innerText = data.stroke_count
    gradeJltp.innerText = `${data.grade} | ${data.jlpt}`
    meanings.innerText = data.meanings.join(', ')

    if (data.kun_readings?.length > 0) {
      this.sectionKun.style.display = 'block'
      kunReadings.innerText = data.kun_readings.join(', ')
    } else {
      this.sectionKun.style.display = 'none'
    }

    if (data.name_readings?.length > 0) {
      this.sectionName.style.display = 'block'
      nameReadings.innerText = data.name_readings.join(', ')
    } else {
      this.sectionName.style.display = 'none'
    }

    unicode.innerText = data.unicode
  }

  startLoading() {
    this.loading.style.display = 'flex'
    this.nextBtn.disabled = true
  }

  stopLoading() {
    this.loading.style.display = 'none'
    this.nextBtn.disabled = false
  }

  ////////////////////////////////////////////////////////////////

  setBottom() {
    document.querySelector('.bottom-container').innerHTML = `
        <div class="bottom-menu">
           <button id="next-btn">Next 漢字</button>
        </div>
    `

    this.nextBtn = document.getElementById('next-btn')
    this.nextBtn.addEventListener('click', this.onClickNextBtn)
  }

  setTop() {
    document.querySelector('.top-container').innerHTML = `
        <button id="toggle-top-btn"></button>

        <div class="top-menu">
          <div>
            <span>Kanji: </span><span id="kanji-value"></span>
          </div>

          <div>
            <span>Stoke count: </span><span id="stroke-value"></span>
          </div>

          <div>
            <span>Grade | jlpt: </span><span id="grade-jlpt-value"></span>
          </div>

          <div>
            <span>Meaning(s): </span><span id="meanings-value"></span>
          </div>

          <div id="section-kun">
            <span>Kun reading(s): </span><span id="kun-readings-value"></span>
          </div>

          <div id="section-name">
            <span>Name reading(s): </span><span id="name-readings-value"></span>
          </div>

          <div>
            <span>Unicode: </span><span id="unicode-value"></span>
          </div>
        </div>
    `
    this.topMenu = document.querySelector('.top-menu')
    this.toggleTopMBtn = document.getElementById('toggle-top-btn')
    this.toggleTopMBtn.addEventListener('click', this.onToggleTopBtn)

    this.sectionKun = document.getElementById('section-kun')
    this.sectionName = document.getElementById('section-name')

    this.kanjiPanel = {
      kanji: document.getElementById('kanji-value'),
      stroke: document.getElementById('stroke-value'),
      gradeJltp: document.getElementById('grade-jlpt-value'),
      meanings: document.getElementById('meanings-value'),
      kunReadings: document.getElementById('kun-readings-value'),
      nameReadings: document.getElementById('name-readings-value'),
      unicode: document.getElementById('unicode-value'),
    }

    this.onToggleTopBtn()
  }

  setLoading() {
    document.querySelector('.loading-container').innerHTML = `
        <div class="spinner"></div>
    `

    this.loading = document.querySelector('.loading-container')
  }

  ////////////////////////////////////////////////////////////////

  bind() {
    this.onClickNextBtn = this.onClickNextBtn.bind(this)
    this.onToggleTopBtn = this.onToggleTopBtn.bind(this)
  }

  init() {
    this.topMenuEnabled = false

    this.bind()
    this.setBottom()
    this.setTop()
    this.setLoading()

    this.startLoading()
  }
}
const Layout = new _Layout()
export default Layout
