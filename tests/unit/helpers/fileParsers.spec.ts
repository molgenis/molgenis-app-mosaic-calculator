import tools from '@/helpers/fileParsers'

describe('fileParsers', () => {
  describe('getIndex', () => {
    describe('getColumnsFromLine', () => {
      it('should return an array with columns with spaces replaced to _ and in lowercase given a string with a header', () => {
        const header = 'SNP Name\tSample ID\tChr\tPosition\tLog R Ratio\tB Allele Freq\n'
        const array = tools.getColumnsFromLine(header)
        expect(array).toEqual(['snp_name', 'sample_id', 'chr', 'position', 'log_r_ratio', 'b_allele_freq'])
      })
    })
    describe('splitLine', () => {
      it('should return an array with all values splitted on \t and with the end of line removed', () => {
        const line = 'SNP Name\tSample ID\tChr\tPosition\tLog R Ratio\tB Allele Freq\n'
        const array = tools.splitLine(line)
        expect(array).toEqual(['SNP Name', 'Sample ID', 'Chr', 'Position', 'Log R Ratio', 'B Allele Freq'])
      })
    })
    describe('areColumnsValid', () => {
      it('should return an array with all values splitted on \t and with the end of line removed', () => {
        const columns = ['snp_name', 'sample_id', 'chr', 'position', 'log_r_ratio', 'b_allele_freq']
        const requiredColumns = ['chr', 'position', 'b_allele_freq']
        const isValidTrue = tools.areColumnsValid(columns, requiredColumns)
        expect(isValidTrue).toBe(true)
        const requiredColumnsFail = ['chr', 'position', 'other_value']
        const isValidFalse = tools.areColumnsValid(columns, requiredColumnsFail)
        expect(isValidFalse).toBe(false)
      })
    })
  })
})
