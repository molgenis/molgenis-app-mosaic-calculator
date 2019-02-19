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
})
