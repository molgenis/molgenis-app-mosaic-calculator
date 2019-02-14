import lineReader from '@/helpers/lineReader';
function generateRandomString() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    // First character must be a letter
    const possibleLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    text += possibleLetters.charAt(Math.floor(Math.random() * possibleLetters.length));
    for (let i = 0; i < 20; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
function parseArrayFile(array, callback) {
    let started = false;
    let firstLine = true;
    let columns = [];
    let lines = [];
    lineReader.readSomeLines(array, 1000000, function (line) {
        if (line.startsWith('[Data]')) {
            started = true;
        }
        else if (started && firstLine) {
            columns = line.trim().split('\t')
                .map((value) => {
                return value.toLowerCase().replace(/ /g, '_');
            });
            firstLine = false;
        }
        else if (!firstLine) {
            const splitLine = line.trim().split('\t');
            if (splitLine.length > 1) {
                lines.push({
                    'chr': splitLine[getIndex(columns, 'chr')],
                    'position': splitLine[getIndex(columns, 'position')],
                    'BAF': splitLine[getIndex(columns, 'b_allele_freq')]
                });
            }
        }
        return true;
    }, function () {
        callback(lines);
    }, function (error) {
        console.log(error);
    });
}
function parseEventsFile(events, callback) {
    let sex = '';
    let columns = [];
    let lines = [];
    let firstLine = true;
    lineReader.readSomeLines(events, 500, function (line) {
        if (line.startsWith('#Gender')) {
            sex = line.split(' = ')[1]
                .replace(/(\r\n|\n|\r| |\t)/gm, '')
                .toLowerCase();
        }
        else if (!line.startsWith('#') && firstLine) {
            columns = line.trim().split('\t')
                .map((value) => {
                return value.toLowerCase().replace(/ /g, '_');
            });
            firstLine = false;
        }
        else if (!firstLine) {
            const splitLine = line.trim().split('\t');
            const chrRegion = splitLine[getIndex(columns, 'chromosome_region')]
                .replace(/,|chr/g, '')
                .split(/:|-/);
            lines.push({
                'chromosome': chrRegion[0],
                'start': chrRegion[1],
                'stop': chrRegion[2],
                'event': splitLine[getIndex(columns, 'event')],
                'length': splitLine[getIndex(columns, 'length')],
                'probes': splitLine[getIndex(columns, 'probes')]
            });
        }
        return true;
    }, function () {
        callback(sex, lines);
    }, function (error) {
        console.log(error);
    });
}
function getIndex(array, value) {
    return array.indexOf(value);
}
function chunks(array, size) {
    let results = [];
    while (array.length) {
        results.push(array.splice(0, size));
    }
    return results;
}
;
export default {
    generateRandomString,
    parseEventsFile,
    parseArrayFile,
    chunks,
    getIndex
};
//# sourceMappingURL=tools.js.map