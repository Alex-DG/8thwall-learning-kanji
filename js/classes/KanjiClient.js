import Layout from './Layout'

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
        console.log('->', 'details', { data })
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
}
const KanjiClient = new _KanjiClient()
export default KanjiClient
