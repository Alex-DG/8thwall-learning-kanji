import Layout from './Layout'

import axios from 'axios'

class _KanjiClient {
  getApi() {
    return {
      kanjiapi_base_url: 'https://kanjiapi.dev/v1/kanji',
      kanjivg_base_url:
        'https://api.github.com/repos/KanjiVG/kanjivg/contents/kanji',
    }
  }
  getRandomJoyoKanji() {
    const arr = this._jojoKanjiList
    const randomIndex = Math.floor(Math.random() * arr.length)
    return arr[randomIndex]
  }

  getJoyoKanjiList() {
    return this._jojoKanjiList
  }

  ////////////////////////////////////////////////////////////////

  async fetchJoyoKanji() {
    console.log('->', 'in progress: ', ' [ fetch Joyo Kanji ]')

    try {
      const url = `${this.getApi().kanjiapi_base_url}/jouyou`
      const response = await fetch(url)

      if (response.ok) {
        const kanjiList = await response.json()
        this._jojoKanjiList = kanjiList
      } else {
        throw new Error(`Failed to fetch Jōyō kanji: ${response.statusText}`)
      }
    } catch (error) {
      console.log('error-fetch-jojo-kanji', { error })
    }

    Layout.stopLoading()

    console.log('->', 'done: ', ' [ fetch Joyo Kanji ]')
  }

  async fetchKanjiDetails(kanjiCharacter) {
    console.log(
      '->',
      'in progress: ',
      ' [ fetch Kanji Details ]',
      'kanji: ',
      kanjiCharacter
    )

    try {
      const url = `${this.getApi().kanjiapi_base_url}/${kanjiCharacter}`
      const response = await fetch(url)

      if (response.ok) {
        const data = await response.json()
        // console.log('->', 'details', { data })
        return data
      } else {
        throw new Error(`Failed to fetch kanji details: ${response.statusText}`)
      }
    } catch (error) {
      console.log('error-fetch-kanji-details', { error })
    }

    console.log('->', 'done: ', ' [ fetch Kanji Details ]')
  }

  async fetchKanjiSvg(kanjiUnicode) {
    console.log(
      '->',
      'in progress: ',
      ' [ fetch Kanji Svg ]',
      'unicode: ',
      kanjiUnicode
    )

    try {
      const paddedUnicode = kanjiUnicode.padStart(5, '0')

      const token = import.meta.env.VITE_GITHUB_TOKEN

      const url = `${this.getApi().kanjivg_base_url}/${paddedUnicode}.svg`

      const response = await fetch(url, {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()

        const responseFromUrl = await fetch(data.download_url)
        const text = await responseFromUrl.text()

        return { data, text }
      } else {
        throw new Error(`Failed to fetch kanji Svg: ${response.statusText}`)
      }
    } catch (error) {
      console.log('error-fetch-kanji-svg', { error })
    }

    console.log('->', 'done: ', ' [ fetch Kanji Svg ]')
  }

  async searchKanjiByWord(word) {
    console.log('->', 'in progress: ', ' [ search Kanji By Word ]', word)

    const isKanji = (ch) => {
      return ch >= '\u4e00' && ch <= '\u9faf'
    }

    try {
      const isDebug = import.meta.env.VITE_GITHUB_TOKEN ? true : false
      const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
      const targetUrl = `https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(
        word.toLowerCase()
      )}`
      const url = proxyUrl + targetUrl

      const response = await fetch(isDebug ? url : targetUrl)

      if (response.ok) {
        const data = await response.json()

        const kanjiReadings = data.data
          .flatMap((entry) => entry.japanese)
          .filter((japanese) => japanese.word && isKanji(japanese.word))

        // Extract Kanji
        const kanjiList = kanjiReadings?.map((japanese) => japanese.word)
        // console.log({ kanjiList })
        const kanji = kanjiList[0]

        // const length = data.data.length
        // let index = 0
        // let kanji = null

        // while (kanji === null && index <= length - 1) {
        //   const value = data.data[index].japanese[0]?.word

        //   if (value) {
        //     kanji = value
        //   } else {
        //     index += 1
        //   }
        // }

        // console.log({ data, kanji })

        return kanji
      } else {
        throw new Error(
          `Failed to search Kanji by word: ${response.statusText}`
        )
      }
    } catch (error) {
      console.log('error-search-kanji-by-word', { error })
    }

    console.log('->', 'done: ', ' [ search Kanji By Word ]')
  }
}
const KanjiClient = new _KanjiClient()
export default KanjiClient
