import Tesseract from 'tesseract.js'

export const textRecognition = (base64Image) => {
  console.log('->', 'textRecognition')

  Tesseract.recognize(
    base64Image,
    'jpn', // Replace with 'jpn' for Japanese recognition
    {
      logger: (m) => console.log(m),
    }
  )
    .then(({ data: { text } }) => {
      console.log('<------------------------->')
      console.log(text)
    })
    .catch((error) => {
      console.error('Error:', error)
    })
}
