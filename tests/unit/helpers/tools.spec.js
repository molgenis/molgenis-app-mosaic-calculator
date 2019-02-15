import tools from '@/helpers/tools';
describe('tools', () => {
    describe('getIndex', () => {
        it('should return the index of a value in an array', () => {
            const array = ["snp_name", "sample_id", "chr", "position", "log_r_ratio", "b_allele_freq"];
            const index = tools.getIndex(array, 'b_allele_freq');
            expect(index).toBe(5);
            const index_fail = tools.getIndex(array, 'b allele freq');
            expect(index_fail).toBe(-1);
        });
    });
    describe('getColumnsFromLine', () => {
        it('should return an array with columns with spaces replaced to _ and in lowercase given a string with a header', () => {
            const header = 'SNP Name\tSample ID\tChr\tPosition\tLog R Ratio\tB Allele Freq\n';
            const array = tools.getColumnsFromLine(header);
            expect(array).toEqual(['snp_name', 'sample_id', 'chr', 'position', 'log_r_ratio', 'b_allele_freq']);
        });
    });
    describe('splitLine', () => {
        it('should return an array with all values splitted on \t and with the end of line removed', () => {
            const line = 'SNP Name\tSample ID\tChr\tPosition\tLog R Ratio\tB Allele Freq\n';
            const array = tools.splitLine(line);
            expect(array).toEqual(['SNP Name', 'Sample ID', 'Chr', 'Position', 'Log R Ratio', 'B Allele Freq']);
        });
    });
});
//# sourceMappingURL=tools.spec.js.map