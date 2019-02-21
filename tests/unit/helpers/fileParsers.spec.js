import fileParsers from '@/helpers/fileParsers';
describe('fileParsers', () => {
    describe('getIndex', () => {
        describe('getColumnsFromLine', () => {
            it('should return an array with columns with spaces replaced to _ and in lowercase given a string with a header', () => {
                const header = 'SNP Name\tSample ID\tChr\tPosition\tLog R Ratio\tB Allele Freq\n';
                const array = fileParsers.getColumnsFromLine(header);
                expect(array).toEqual(['snp_name', 'sample_id', 'chr', 'position', 'log_r_ratio', 'b_allele_freq']);
            });
        });
        describe('splitLine', () => {
            it('should return an array with all values splitted on \t and with the end of line removed', () => {
                const line = 'SNP Name\tSample ID\tChr\tPosition\tLog R Ratio\tB Allele Freq\n';
                const array = fileParsers.splitLine(line);
                expect(array).toEqual(['SNP Name', 'Sample ID', 'Chr', 'Position', 'Log R Ratio', 'B Allele Freq']);
            });
        });
        describe('areColumnsValid', () => {
            it('should return an array with all values splitted on \t and with the end of line removed', () => {
                const columns = ['snp_name', 'sample_id', 'chr', 'position', 'log_r_ratio', 'b_allele_freq'];
                const requiredColumns = ['chr', 'position', 'b_allele_freq'];
                const isValidTrue = fileParsers.areColumnsValid(columns, requiredColumns);
                expect(isValidTrue).toBe(true);
                const requiredColumnsFail = ['chr', 'position', 'other_value'];
                const isValidFalse = fileParsers.areColumnsValid(columns, requiredColumnsFail);
                expect(isValidFalse).toBe(false);
            });
        });
        describe('parseEventsLine', () => {
            it('should set experiment id', () => {
                const line = '#File Sample ID = experiment1\n';
                let firstLine = true;
                let columns = [];
                let lines = [];
                let errorMsg = '';
                let exp = '';
                let sex = '';
                const parsedLine = fileParsers.parseEventsLine(line, sex, exp, columns, lines, firstLine, errorMsg);
                expect(parsedLine.firstLine).toBe(firstLine);
                expect(parsedLine.columns).toBe(columns);
                expect(parsedLine.lines).toBe(lines);
                expect(parsedLine.errorMsg).toBe(errorMsg);
                expect(parsedLine.exp).toBe('experiment1');
                expect(parsedLine.sex).toBe(sex);
                expect(parsedLine.toGoOnOrNotToGoOn).toBe(true);
            });
            it('should set sex', () => {
                const line = '#Gender = Male\n';
                let firstLine = true;
                let columns = [];
                let lines = [];
                let errorMsg = '';
                let exp = 'experiment1';
                let sex = '';
                const parsedLine = fileParsers.parseEventsLine(line, sex, exp, columns, lines, firstLine, errorMsg);
                expect(parsedLine.firstLine).toBe(firstLine);
                expect(parsedLine.columns).toBe(columns);
                expect(parsedLine.lines).toBe(lines);
                expect(parsedLine.errorMsg).toBe(errorMsg);
                expect(parsedLine.exp).toBe(exp);
                expect(parsedLine.sex).toBe('male');
                expect(parsedLine.toGoOnOrNotToGoOn).toBe(true);
            });
            it('should set columns', () => {
                const line = 'Chromosome Region\tEvent\tLength\tCytoband\t% of CNV Overlap\tProbe Median\t% Heterozygous\tProbes\tCount of Gene Symbols\n';
                let firstLine = true;
                let columns = [];
                let lines = [];
                let errorMsg = '';
                let exp = 'experiment1';
                let sex = 'male';
                const parsedLine = fileParsers.parseEventsLine(line, sex, exp, columns, lines, firstLine, errorMsg);
                const expectedColumns = ['chromosome_region', 'event', 'length', 'cytoband', '%_of_cnv_overlap', 'probe_median',
                    '%_heterozygous', 'probes', 'count_of_gene_symbols'];
                expect(parsedLine.firstLine).toBe(false);
                expect(parsedLine.columns).toEqual(expectedColumns);
                expect(parsedLine.lines).toBe(lines);
                expect(parsedLine.errorMsg).toBe(errorMsg);
                expect(parsedLine.exp).toBe(exp);
                expect(parsedLine.sex).toBe(sex);
                expect(parsedLine.toGoOnOrNotToGoOn).toBe(true);
            });
            it('should return false and set error message if not all columns are set', () => {
                const line = 'Chromosome Region\tLength\tCytoband\t% of CNV Overlap\tProbe Median\t% Heterozygous\tProbes\tCount of Gene Symbols\n';
                let firstLine = true;
                let columns = [];
                let lines = [];
                let errorMsg = '';
                let exp = 'experiment1';
                let sex = 'male';
                const parsedLine = fileParsers.parseEventsLine(line, sex, exp, columns, lines, firstLine, errorMsg);
                const expectedColumns = ['chromosome_region', 'length', 'cytoband', '%_of_cnv_overlap', 'probe_median',
                    '%_heterozygous', 'probes', 'count_of_gene_symbols'];
                const expectedErrorMsg = 'Events file not valid: file should at least contain "chromosome region", "event", "length", and "probes" column';
                expect(parsedLine.firstLine).toBe(false);
                expect(parsedLine.columns).toEqual(expectedColumns);
                expect(parsedLine.lines).toBe(lines);
                expect(parsedLine.errorMsg).toBe(expectedErrorMsg);
                expect(parsedLine.exp).toBe(exp);
                expect(parsedLine.sex).toBe(sex);
                expect(parsedLine.toGoOnOrNotToGoOn).toBe(false);
            });
            it('should add line to lines array', () => {
                const line = 'chr1:9,902,514-10,735,816\tLOH\t833303\tp36.22\t11.530873560845889\t-0.01675529219210148\t1.1857707509881423\t253\t15\n\n';
                let firstLine = false;
                let columns = ['chromosome_region', 'event', 'length', 'cytoband', '%_of_cnv_overlap', 'probe_median',
                    '%_heterozygous', 'probes', 'count_of_gene_symbols'];
                let lines = [];
                let errorMsg = '';
                let exp = 'experiment1';
                let sex = 'male';
                const parsedLine = fileParsers.parseEventsLine(line, sex, exp, columns, lines, firstLine, errorMsg);
                const expectedLines = [{
                        'chromosome': '1',
                        'start': '9902514',
                        'stop': '10735816',
                        'event': 'LOH',
                        'length': '833303',
                        'probes': '253'
                    }];
                expect(parsedLine.firstLine).toBe(firstLine);
                expect(parsedLine.columns).toBe(columns);
                expect(parsedLine.lines).toEqual(expectedLines);
                expect(parsedLine.errorMsg).toBe(errorMsg);
                expect(parsedLine.exp).toBe(exp);
                expect(parsedLine.sex).toBe(sex);
                expect(parsedLine.toGoOnOrNotToGoOn).toBe(true);
            });
        });
        describe('parseArrayLine', () => {
            it('should fail if the line starts with #, returning false to throw error and setting error message', () => {
                const line = '#This is an events file, not an array file\n';
                let started = false;
                let firstLine = true;
                let columns = [];
                let lines = [];
                let errorMsg = '';
                let headerFound = false;
                let exp = '';
                let eventExp = 'experiment1';
                const parsedLine = fileParsers.parseArrayLine(line, started, firstLine, columns, lines, errorMsg, headerFound, exp, eventExp);
                expect(parsedLine.started).toBe(started);
                expect(parsedLine.firstLine).toBe(firstLine);
                expect(parsedLine.columns).toEqual(columns);
                expect(parsedLine.lines).toEqual(lines);
                expect(parsedLine.errorMsg).toBe('Array file not valid: lines in file cannot start with "#"');
                expect(parsedLine.headerFound).toBe(headerFound);
                expect(parsedLine.exp).toBe(exp);
                expect(parsedLine.eventExp).toBe(eventExp);
                expect(parsedLine.toGoOnOrNotToGoOn).toBe(false);
            });
            it('should parse the first line of an array file, setting header found to true', () => {
                const line = '[Header]\n';
                let started = false;
                let firstLine = true;
                let columns = [];
                let lines = [];
                let errorMsg = '';
                let headerFound = false;
                let exp = '';
                let eventExp = 'experiment1';
                const parsedLine = fileParsers.parseArrayLine(line, started, firstLine, columns, lines, errorMsg, headerFound, exp, eventExp);
                expect(parsedLine.started).toBe(started);
                expect(parsedLine.firstLine).toBe(firstLine);
                expect(parsedLine.columns).toEqual(columns);
                expect(parsedLine.lines).toEqual(lines);
                expect(parsedLine.errorMsg).toBe(errorMsg);
                expect(parsedLine.headerFound).toBe(true);
                expect(parsedLine.exp).toBe(exp);
                expect(parsedLine.eventExp).toBe(eventExp);
                expect(parsedLine.toGoOnOrNotToGoOn).toBe(true);
            });
        });
        it('should parse the data line of an array file, setting started to true', () => {
            const line = '[Data]\n';
            let started = false;
            let firstLine = true;
            let columns = [];
            let lines = [];
            let errorMsg = '';
            let headerFound = true;
            let exp = '';
            let eventExp = 'experiment1';
            const parsedLine = fileParsers.parseArrayLine(line, started, firstLine, columns, lines, errorMsg, headerFound, exp, eventExp);
            expect(parsedLine.started).toBe(true);
            expect(parsedLine.firstLine).toBe(firstLine);
            expect(parsedLine.columns).toEqual(columns);
            expect(parsedLine.lines).toEqual(lines);
            expect(parsedLine.errorMsg).toBe(errorMsg);
            expect(parsedLine.headerFound).toBe(headerFound);
            expect(parsedLine.exp).toBe(exp);
            expect(parsedLine.eventExp).toBe(eventExp);
            expect(parsedLine.toGoOnOrNotToGoOn).toBe(true);
        });
        it('should parse the data line of an array file without header, setting an error message and returning false to throw error', () => {
            const line = '[Data]\n';
            let started = true;
            let firstLine = true;
            let columns = [];
            let lines = [];
            let errorMsg = '';
            let headerFound = false;
            let exp = '';
            let eventExp = 'experiment1';
            const parsedLine = fileParsers.parseArrayLine(line, started, firstLine, columns, lines, errorMsg, headerFound, exp, eventExp);
            expect(parsedLine.started).toBe(started);
            expect(parsedLine.firstLine).toBe(firstLine);
            expect(parsedLine.columns).toEqual(columns);
            expect(parsedLine.lines).toEqual(lines);
            expect(parsedLine.errorMsg).toBe('Array file not valid: no [Header] defined above [Data]');
            expect(parsedLine.headerFound).toBe(headerFound);
            expect(parsedLine.exp).toBe(exp);
            expect(parsedLine.eventExp).toBe(eventExp);
            expect(parsedLine.toGoOnOrNotToGoOn).toBe(false);
        });
        it('should make an array of columns from the table header', () => {
            const line = 'SNP Name\tSample ID\tChr\tPosition\tLog R Ratio\tB Allele Freq\n';
            let started = true;
            let firstLine = true;
            let columns = [];
            let lines = [];
            let errorMsg = '';
            let headerFound = true;
            let exp = '';
            let eventExp = 'experiment1';
            const expectedColumns = ['snp_name', 'sample_id', 'chr', 'position', 'log_r_ratio', 'b_allele_freq'];
            const parsedLine = fileParsers.parseArrayLine(line, started, firstLine, columns, lines, errorMsg, headerFound, exp, eventExp);
            expect(parsedLine.started).toBe(started);
            expect(parsedLine.firstLine).toBe(false);
            expect(parsedLine.columns).toEqual(expectedColumns);
            expect(parsedLine.lines).toEqual(lines);
            expect(parsedLine.errorMsg).toBe('');
            expect(parsedLine.headerFound).toBe(headerFound);
            expect(parsedLine.exp).toBe(exp);
            expect(parsedLine.eventExp).toBe(eventExp);
            expect(parsedLine.toGoOnOrNotToGoOn).toBe(true);
        });
        it('should set an error and return false if chromosome, position of BAF are missing in columns', () => {
            const line = 'SNP Name\tSample ID\tPosition\tLog R Ratio\tB Allele Freq\n';
            let started = true;
            let firstLine = true;
            let columns = [];
            let lines = [];
            let errorMsg = '';
            let headerFound = true;
            let exp = '';
            let eventExp = 'experiment1';
            const expectedColumns = ['snp_name', 'sample_id', 'position', 'log_r_ratio', 'b_allele_freq'];
            const parsedLine = fileParsers.parseArrayLine(line, started, firstLine, columns, lines, errorMsg, headerFound, exp, eventExp);
            expect(parsedLine.started).toBe(started);
            expect(parsedLine.firstLine).toBe(false);
            expect(parsedLine.columns).toEqual(expectedColumns);
            expect(parsedLine.lines).toEqual(lines);
            expect(parsedLine.errorMsg).toBe('Array file not valid: file should at least contain "chr", "position", and "b allele freq" column');
            expect(parsedLine.headerFound).toBe(headerFound);
            expect(parsedLine.exp).toBe(exp);
            expect(parsedLine.eventExp).toBe(eventExp);
            expect(parsedLine.toGoOnOrNotToGoOn).toBe(false);
        });
        it('should return error on mismatching experiment', () => {
            const line = 'snpx\texperiment2\tX\t68757767\t-0.2910374\t0.9888574\n';
            let started = true;
            let firstLine = false;
            let columns = ['snp_name', 'sample_id', 'chr', 'position', 'log_r_ratio', 'b_allele_freq'];
            let lines = [];
            let errorMsg = '';
            let headerFound = true;
            let exp = '';
            let eventExp = 'experiment1';
            const expectedLines = [[]];
            const parsedLine = fileParsers.parseArrayLine(line, started, firstLine, columns, lines, errorMsg, headerFound, exp, eventExp);
            expect(parsedLine.started).toBe(started);
            expect(parsedLine.firstLine).toBe(firstLine);
            expect(parsedLine.columns).toEqual(columns);
            expect(parsedLine.lines).toEqual(lines);
            expect(parsedLine.errorMsg).toBe('Experiment ID from events file: "experiment1" does not match experiment ID from array file: "experiment2"');
            expect(parsedLine.headerFound).toBe(headerFound);
            expect(parsedLine.exp).toBe('experiment2');
            expect(parsedLine.eventExp).toBe(eventExp);
            expect(parsedLine.toGoOnOrNotToGoOn).toBe(false);
        });
        it('should return lines with new line added', () => {
            const line = 'snpx\texperiment1\tX\t68757767\t-0.2910374\t0.9888574\n';
            let started = true;
            let firstLine = false;
            let columns = ['snp_name', 'sample_id', 'chr', 'position', 'log_r_ratio', 'b_allele_freq'];
            let lines = [];
            let errorMsg = '';
            let headerFound = true;
            let exp = '';
            let eventExp = 'experiment1';
            const expectedLines = [{ 'chr': 'X', 'position': '68757767', 'BAF': '0.9888574' }];
            const parsedLine = fileParsers.parseArrayLine(line, started, firstLine, columns, lines, errorMsg, headerFound, exp, eventExp);
            expect(parsedLine.started).toBe(started);
            expect(parsedLine.firstLine).toBe(firstLine);
            expect(parsedLine.columns).toEqual(columns);
            expect(parsedLine.lines).toEqual(expectedLines);
            expect(parsedLine.errorMsg).toBe('');
            expect(parsedLine.headerFound).toBe(headerFound);
            expect(parsedLine.exp).toBe('experiment1');
            expect(parsedLine.eventExp).toBe(eventExp);
            expect(parsedLine.toGoOnOrNotToGoOn).toBe(true);
        });
        it('should same lines if line is empty', () => {
            const line = '\n';
            let started = true;
            let firstLine = false;
            let columns = ['snp_name', 'sample_id', 'chr', 'position', 'log_r_ratio', 'b_allele_freq'];
            let lines = [{ 'chr': 'X', 'position': '68757767', 'BAF': '0.9888574' }];
            let errorMsg = '';
            let headerFound = true;
            let exp = 'experiment1';
            let eventExp = 'experiment1';
            const parsedLine = fileParsers.parseArrayLine(line, started, firstLine, columns, lines, errorMsg, headerFound, exp, eventExp);
            expect(parsedLine.started).toBe(started);
            expect(parsedLine.firstLine).toBe(firstLine);
            expect(parsedLine.columns).toEqual(columns);
            expect(parsedLine.lines).toEqual(lines);
            expect(parsedLine.errorMsg).toBe('');
            expect(parsedLine.headerFound).toBe(headerFound);
            expect(parsedLine.exp).toBe('experiment1');
            expect(parsedLine.eventExp).toBe(eventExp);
            expect(parsedLine.toGoOnOrNotToGoOn).toBe(true);
        });
        it('should add a second line', () => {
            const line = 'snpx\texperiment1\tX\t68757767\t-0.2910374\t0.9888574\n';
            let started = true;
            let firstLine = false;
            let columns = ['snp_name', 'sample_id', 'chr', 'position', 'log_r_ratio', 'b_allele_freq'];
            let lines = [{ 'chr': 'X', 'position': '68757767', 'BAF': '0.9888574' }];
            let errorMsg = '';
            let headerFound = true;
            let exp = 'experiment1';
            let eventExp = 'experiment1';
            const expectedLines = [
                { 'chr': 'X', 'position': '68757767', 'BAF': '0.9888574' },
                {
                    'chr': 'X', 'position': '68757767', 'BAF': '0.9888574'
                }
            ];
            const parsedLine = fileParsers.parseArrayLine(line, started, firstLine, columns, lines, errorMsg, headerFound, exp, eventExp);
            expect(parsedLine.started).toBe(started);
            expect(parsedLine.firstLine).toBe(firstLine);
            expect(parsedLine.columns).toEqual(columns);
            expect(parsedLine.lines).toEqual(expectedLines);
            expect(parsedLine.errorMsg).toBe('');
            expect(parsedLine.headerFound).toBe(headerFound);
            expect(parsedLine.exp).toBe('experiment1');
            expect(parsedLine.eventExp).toBe(eventExp);
            expect(parsedLine.toGoOnOrNotToGoOn).toBe(true);
        });
    });
});
//# sourceMappingURL=fileParsers.spec.js.map