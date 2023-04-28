import Drawing from './Drawing'
import Kanji from './Kanji'
import KanjiClient from './KanjiClient'

import { gsap } from 'gsap'
import { textRecognition } from './Utils/OCR'

class _Layout {
  onClickRecognitionBtn() {
    console.log('->', 'click Recognition Btn')

    const base64Image = Drawing.createb64Img()
    const myimg = document.getElementById('myimg')
    myimg.src = base64Image
    myimg.style.display = 'block'

    console.log({ base64Image })
    textRecognition(base64Image)
  }

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

  async onClickSearchBtn() {
    this.startLoading()

    const word = this.wordInput.value

    const kanji = await KanjiClient.searchKanjiByWord(word)

    if (kanji?.length > 0) {
      Array.from(kanji).forEach(async (char, index) => {
        const details = await KanjiClient.fetchKanjiDetails(char)

        const { text } = await KanjiClient.fetchKanjiSvg(details?.unicode)

        await Kanji.draw(text, index)

        this.updateKanjiPanel(details, index)
      })
    } else {
      const details = await KanjiClient.fetchKanjiDetails(kanji)

      const { text } = await KanjiClient.fetchKanjiSvg(details?.unicode)

      await Kanji.draw(text)

      this.updateKanjiPanel(details)
    }

    setTimeout(() => {
      this.stopLoading()
    }, 500)
  }

  onToggleTopBtn() {
    const topMenus = document.querySelectorAll('.top-menu')

    if (this.topMenuEnabled) {
      gsap.to(this.toggleTopMBtn, {
        opacity: 0.2,
        duration: 0.5,
        ease: 'power3.out',
        onStart: () => {
          topMenus?.forEach((element) => {
            element.style.display = 'none'
          })
        },
      })
    } else {
      gsap.to(this.toggleTopMBtn, {
        opacity: 1,
        duration: 0.5,
        ease: 'power3.out',
        onStart: () => {
          topMenus?.forEach((element) => {
            element.style.display = 'flex'
          })
        },
      })
    }

    this.topMenuEnabled = !this.topMenuEnabled
  }

  ////////////////////////////////////////////////////////////////

  updateKanjiPanel(data, index = 0) {
    const innerHTML = `
      <div>
        <span>Kanji: </span><span id="kanji-value">${data.kanji}</span>
      </div>

      <div>
        <span>Stoke count: </span><span id="stroke-value">${
          data.stroke_count
        }</span>
      </div>

      <div>
        <span>JLPT: </span><span id="grade-jlpt-value">${data.jlpt}</span>
      </div>

      <div>
        <span>Meaning(s): </span><span id="meanings-value">${data.meanings.join(
          ', '
        )}</span>
      </div>

      <div id="section-kun">
        <span>Kun reading(s): </span><span id="kun-readings-value">${
          data.kun_readings.join(', ') || ''
        }</span>
      </div>

      <div id="section-name">
        <span>Name reading(s): </span><span id="name-readings-value">${
          data.name_readings.join(', ') || ''
        }</span>
      </div>
    `

    const menu = document.createElement('div')
    menu.classList.add('top-menu')
    menu.classList.add(`${index}`)
    menu.innerHTML = innerHTML

    this.topContainer.appendChild(menu)
  }

  clearMenus() {
    const topMenus = document.querySelectorAll('.top-menu')
    topMenus?.forEach((element) => {
      element?.remove()
    })
  }

  startLoading() {
    this.clearMenus()
    Kanji.clear()

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
          <input id="word-input" placeholder="type a word" value="" />
          <button id="next-btn">Random 漢字</button>
          <button id="search-btn">Search 漢字</button>
          <button id="recognition-btn">Recognition 漢字</button>
        </div>
    `

    this.wordInput = document.getElementById('word-input')

    this.nextBtn = document.getElementById('next-btn')
    this.nextBtn.addEventListener('click', this.onClickNextBtn)

    this.searchBtn = document.getElementById('search-btn')
    this.searchBtn.addEventListener('click', this.onClickSearchBtn)

    this.searchBtn = document.getElementById('recognition-btn')
    this.searchBtn.addEventListener('click', this.onClickRecognitionBtn)
  }

  setTop() {
    document.querySelector('.top-container').innerHTML = `
        <button id="toggle-top-btn"></button>
        <div class="top-container-wrapper"></div>
    `
    this.topContainer = document.querySelector('.top-container-wrapper')
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

    // this.onToggleTopBtn()
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
    this.onClickSearchBtn = this.onClickSearchBtn.bind(this)
    this.onClickRecognitionBtn = this.onClickRecognitionBtn.bind(this)
    this.onToggleTopBtn = this.onToggleTopBtn.bind(this)
  }

  init() {
    this.topMenuEnabled = false

    this.bind()
    this.setBottom()
    this.setTop()
    this.setLoading()

    // this.startLoading()
  }
}
const Layout = new _Layout()
export default Layout
