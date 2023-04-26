import Kanji from './Kanji'
import KanjiClient from './KanjiClient'

class _Layout {
  async onClickNextBtn() {
    this.startLoading()

    const randomJojoKanji = KanjiClient.getRandomJoyoKanji()
    console.log('->', 'Next Kanji', randomJojoKanji)

    const kanjiDetails = await KanjiClient.fetchKanjiDetails(randomJojoKanji)
    const { text } = await KanjiClient.fetchKanjiSvg(kanjiDetails?.unicode)

    await Kanji.draw(text)

    this.stopLoading()
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
    document.querySelector('.bottom-container.bottom-menu').innerHTML = `
        <button id="next-btn">Next 漢字</button>
    `

    this.nextBtn = document.getElementById('next-btn')
    this.nextBtn.addEventListener('click', this.onClickNextBtn)
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
  }

  init() {
    this.bind()
    this.setBottom()
    this.setLoading()

    this.startLoading()
  }
}
const Layout = new _Layout()
export default Layout
