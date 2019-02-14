import lineReader from '@/helpers/lineReader'

const createFile= function (fileData: any) {
  let create: any = [fileData]
  let blob: Blob = new Blob([create], {'type': 'text/plain'})
  return (blob.size > 0 ? blob : 'file creation error')
}

describe('LineReader', () => {
  describe('readSomeLines', () => {
    it('should use read lines until maxLines is read and the call onComplete', (done) => {
      const multiLineFileData = `Authentic bitters blue bottle hella swag.
Shaman subway tile meditation, church-key small batch prism sunt paleo.
Pitchfork banh mi leggings try-hard voluptate 3 wolf moon artisan keytar.
Eiusmod adipisicing ethical pug single-origin coffee organic semiotics master
cleanse kinfolk crucifix marfa gochujang elit chicharrones food truck.`
      const file: Blob|"file creation error" = createFile(multiLineFileData)
      const maxLines = 3
      let linesRead: Array<string> = []
      let onCompleteCalled = false

      const forEachLine = function (line: string) {
        linesRead.push(line)
        return true
      }

      const onError = function (error: any) {
        return error
      }

      const onComplete = function () {
        onCompleteCalled = true
        expect(linesRead.length).toBe(3)
        expect(linesRead[0]).toBe('Authentic bitters blue bottle hella swag.\n')
        expect(linesRead[1]).toBe('Shaman subway tile meditation, church-key small batch prism sunt paleo.\n')
        expect(linesRead[2]).toBe('Pitchfork banh mi leggings try-hard voluptate 3 wolf moon artisan keytar.\n')
        expect(onCompleteCalled).toBe(true)
        done()
      }
      lineReader.readSomeLines(file, maxLines, forEachLine, onComplete, onError)
    })

    it('should return error message when file is not correct', (done) => {
      const multiLineFileData = `Authentic bitters blue bottle hella swag.
Shaman subway tile meditation, church-key small batch prism sunt paleo.
Pitchfork banh mi leggings try-hard voluptate 3 wolf moon artisan keytar.
Eiusmod adipisicing ethical pug single-origin coffee organic semiotics master
cleanse kinfolk crucifix marfa gochujang elit chicharrones food truck.`
      const file: Blob|"file creation error" = createFile(multiLineFileData)
      const maxLines = 3
      let linesRead = []

      const forEachLine = function (line: string) {
        linesRead.push(line)
        return false
      }

      const onError = function (error: any) {
        expect(error).toBe('[Invalid data] the data of the file is not valid')
        done()
      }

      const onComplete = function () {
        // This function should never be called
        expect(true).toBe(false)
      }
      lineReader.readSomeLines(file, maxLines, forEachLine, onComplete, onError)
    })
  })
})
