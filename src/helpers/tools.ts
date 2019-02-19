function generateRandomString() {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  // First character must be a letter
  const possibleLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  text += possibleLetters.charAt(Math.floor(Math.random() * possibleLetters.length))
  for (let i = 0; i < 20; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}


function getIndex(array: Array<string>, value: string) {
  return array.indexOf(value)
}

function chunks(array: Array<any>, size: number) {
  let results = []
  while (array.length) {
    results.push(array.splice(0, size))
  }
  return results
}


export default {
  generateRandomString,
  chunks,
  getIndex
}
