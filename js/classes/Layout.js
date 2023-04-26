import Kanji from './Kanji'
import KanjiClient from './KanjiClient'

class _Layout {
  async onClickNextBtn() {
    const randomJojoKanji = KanjiClient.getRandomJoyoKanji()
    console.log('->', 'Next Kanji', randomJojoKanji)

    const kanjiDetails = await KanjiClient.fetchKanjiDetails(randomJojoKanji)
    const { text } = await KanjiClient.fetchKanjiSvg(kanjiDetails?.unicode)

    await Kanji.draw(text)
  }

  ////////////////////////////////////////////////////////////////

  setBottom() {
    document.querySelector('.bottom-container.bottom-menu').innerHTML = `
        <button id="next-btn">Next 漢字</button>
    `

    this.nextBtn = document.getElementById('next-btn')
    this.nextBtn.addEventListener('click', this.onClickNextBtn)
  }

  ////////////////////////////////////////////////////////////////

  bind() {
    this.onClickNextBtn = this.onClickNextBtn.bind(this)
  }

  init() {
    this.bind()
    this.setBottom()
  }
}
const Layout = new _Layout()
export default Layout
