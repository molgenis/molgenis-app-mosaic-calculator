import lineReader from '@/helpers/lineReader'

import { Sex } from '@/types/helpers'

function generateRandomString () {
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

function parseArrayFile (array: File, callback: Function) {
  let started = false
  let firstLine = true
  let columns: Array<string> = []
  let lines: Array<any> = []
  lineReader.readSomeLines(array, 1000000, function (line: string) {
    if (line.startsWith('[Data]')) {
      started = true
    } else if (started && firstLine) {
      columns = line.trim().split('\t')
        .map((value) => {
          return value.toLowerCase().replace(/ /g, '_')
        })
      firstLine = false
    } else if (!firstLine) {
      const splitLine: Array<string> = line.trim().split('\t')
      if(splitLine.length > 1){
        lines.push({
          'chr': splitLine[getIndex(columns, 'chr')],
          'position': splitLine[getIndex(columns, 'position')],
          'BAF': splitLine[getIndex(columns, 'b_allele_freq')]
        })
      }
    }
    return true
  }, function () {
    callback(lines)
  }, function (error: string) {
    console.log(error)
  })
}

function parseEventsFile (events: File, callback: Function) {
  let sex: string = ''
  let columns: Array<string> = []
  let lines: Array<Object> = []
  let firstLine = true
  lineReader.readSomeLines(events, 500, function (line: string) {
    if (line.startsWith('#Gender')) {
      sex = line.split(' = ')[1]
        .replace(/(\r\n|\n|\r| |\t)/gm, '')
        .toLowerCase()
    } else if (!line.startsWith('#') && firstLine) {
      columns = line.trim().split('\t')
        .map((value) => {
          return value.toLowerCase().replace(/ /g, '_')
        })
      firstLine = false
    } else if (!firstLine) {
      const splitLine: Array<string> = line.trim().split('\t')
      const chrRegion = splitLine[getIndex(columns, 'chromosome_region')]
        .replace(/,|chr/g, '')
        .split(/:|-/)
      lines.push({
        'chromosome': chrRegion[0],
        'start': chrRegion[1],
        'stop': chrRegion[2],
        'event': splitLine[getIndex(columns, 'event')],
        'length': splitLine[getIndex(columns, 'length')],
        'probes': splitLine[getIndex(columns, 'probes')]
      })
    }
    return true
  }, function () {
    callback(sex, lines)
  }, function (error: string) {
    console.log(error)
  })
}

function getIndex (array: Array<string>, value: string) {
  return array.indexOf(value)
}

function chunks (array: Array<any>, size: number) {
  let results = []
  while (array.length) {
    results.push(array.splice(0, size))
  }
  return results
};

export default {
  generateRandomString,
  parseEventsFile,
  parseArrayFile,
  chunks,
  getIndex
}
