import tools from '@/helpers/tools'

describe('tools', () => {
  describe('getIndex', () => {
    it('should return the index of a value in an array', () => {
      const array = ['snp_name', 'sample_id', 'chr', 'position', 'log_r_ratio', 'b_allele_freq']
      const index = tools.getIndex(array, 'b_allele_freq')
      expect(index).toBe(5)
      const indexFail = tools.getIndex(array, 'b allele freq')
      expect(indexFail).toBe(-1)
    })
  })
  describe('generateRandomString', () => {
    it('should return a random string of 21 characters starting with a letter', () => {
      const string = tools.generateRandomString()
      // Check if length is 21
      expect(string.length).toBe(21)
      // Check if string starts with letter
      expect(string.toLowerCase()[0]).toMatch(/[abcdefghijklmnopqrstuvwxyz]/)
    })
  })
  describe('chunks', () => {
    it.only('should return an array with arrays with the length of the specified chunks', () => {
      const bigArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
      const size = 4
      // First slice should be the first x (size) number of elements from the big array
      const firstSlice = bigArray.slice(0, size)
      // Last elements index is the number of times the size fits in the length of the big array
      const lastElement = Math.floor(bigArray.length/size)
      // The length of the last element should be equal to the length of th big array modulo the size
      const lengthOfLastElement = bigArray.length%size
      const choppedArray = tools.chunks(bigArray, size)
      expect(choppedArray[0]).toEqual(firstSlice)
      expect(choppedArray[1].length).toBe(size)
      expect(choppedArray[lastElement].length).toBe(lengthOfLastElement)
    })
  })
})
