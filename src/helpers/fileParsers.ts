import lineReader from "@/helpers/lineReader"
import tools from "@/helpers/tools"


function parseArrayFile(array: File, callback: Function, eventExp: string, errorFunction: Function) {
  let started = false
  let firstLine = true
  let columns: Array<string> = []
  let lines: Array<any> = []
  let errorMsg = ''
  let headerFound = false
  let exp = ''
  lineReader.readSomeLines(array, 1000000, function (line: string) {
    if (line.startsWith('#')) {
      errorMsg = 'Array file not valid: lines in file cannot start with "#"'
      return false
    } else if (line.startsWith('[Header]')) {
      headerFound = true
    } else if (line.startsWith('[Data]')) {
      if (!headerFound) {
        errorMsg = 'Array file not valid: no [Header] defined above [Data]'
        return false
      }
      started = true
    } else if (started && firstLine) {
      columns = getColumnsFromLine(line)
      firstLine = false
      if (!areColumnsValid(columns, ['chr', 'position', 'b_allele_freq'])) {
        errorMsg = 'Array file not valid: file should at least contain "chr", "position", and "b allele freq" column'
        return false
      }
    } else if (!firstLine) {
      const lineArray: Array<string> = splitLine(line)
      if (exp === '') {
        exp = lineArray[tools.getIndex(columns, 'sample_id')]
        if (exp.trim() !== eventExp) {
          errorMsg = `Experiment ID from events file: "${eventExp}" does not match experiment ID from array file: "${exp}"`
          return false
        }
      }
      if (lineArray.length > 1) {
        lines.push({
          'chr': lineArray[tools.getIndex(columns, 'chr')],
          'position': lineArray[tools.getIndex(columns, 'position')],
          'BAF': lineArray[tools.getIndex(columns, 'b_allele_freq')]
        })
      }
    }
    return true
  }, function () {
    callback(lines)
  }, function (errorMessage: string) {
    if (errorMsg.length > 0) {
      errorFunction(errorMsg)
    } else {
      errorFunction(errorMessage)
    }
  })
}

function parseEventsFile(events: File, callback: Function, errorFunction: Function) {
  let sex: string = ''
  let exp: string = ''
  let columns: Array<string> = []
  let lines: Array<Object> = []
  let firstLine = true
  let errorMsg = ''
  lineReader.readSomeLines(events, 500, function (line: string) {
    if (line.startsWith('#File Sample ID')) {
      exp = line.split(' = ')[1].trim()
    } else if (line.startsWith('#Gender')) {
      sex = line.split(' = ')[1]
        .replace(/(\r\n|\n|\r| |\t)/gm, '')
        .toLowerCase()
    } else if (!line.startsWith('#') && firstLine) {
      columns = getColumnsFromLine(line)
      firstLine = false
      if (!areColumnsValid(columns, ['chromosome_region', 'event', 'length', 'probes'])) {
        errorMsg = 'Events file not valid: file should at least contain "chromosome region", "event", "length", and "probes" column'
        return false
      }
    } else if (!firstLine) {
      const lineArray: Array<string> = splitLine(line)
      const chrRegion = lineArray[tools.getIndex(columns, 'chromosome_region')]
        .replace(/,|chr/g, '')
        .split(/:|-/)
      lines.push({
        'chromosome': chrRegion[0],
        'start': chrRegion[1],
        'stop': chrRegion[2],
        'event': lineArray[tools.getIndex(columns, 'event')],
        'length': lineArray[tools.getIndex(columns, 'length')],
        'probes': lineArray[tools.getIndex(columns, 'probes')]
      })
    }
    return true
  }, function () {
    callback(sex, lines, exp)
  }, function (errorMessage: string) {
    if (errorMsg.length > 0) {
      errorFunction(errorMsg)
    } else {
      errorFunction(errorMessage)
    }
  })
}

function areColumnsValid(columns: Array<string>, requiredColumns: Array<string>) {
  let valid = true
  requiredColumns.forEach((column) => {
    if (tools.getIndex(columns, column) === -1) {
      valid = false
    }
  })
  return valid
}

function splitLine(line: string) {
  return line.trim().split('\t')
}

function getColumnsFromLine(line: string) {
  return splitLine(line).map((value) => {
    return value.toLowerCase().replace(/ /g, '_')
  })
}


export default {
  parseEventsFile,
  parseArrayFile,
  getColumnsFromLine,
  splitLine,
  areColumnsValid
}
