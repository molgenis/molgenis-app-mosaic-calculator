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
function parseEventsFile(events, done) {
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
            columns = line.replace('\n', '').split('\t')
                .map((value) => {
                return value.toLowerCase().replace(' ', '_');
            });
            firstLine = false;
        }
        else if (!firstLine) {
            const splitLine = line.replace('\n', '').split('\t');
            const chrRegion = splitLine[_getIndex(columns, 'chromosome_region')]
                .replace(/,|chr/g, '')
                .split(/:|-/);
            lines.push({
                'chromosome': chrRegion[0],
                'start': chrRegion[1],
                'stop': chrRegion[2],
                'event': splitLine[_getIndex(columns, 'event')],
                'length': splitLine[_getIndex(columns, 'length')],
                'probes': splitLine[_getIndex(columns, 'probes')]
            });
        }
        return true;
    }, function () {
        done(sex, lines);
    }, function (error) {
        console.log(error);
    });
}
function _getIndex(array, value) {
    return array.findIndex((arrVal) => arrVal === value);
}
export default {
    generateRandomString,
    parseEventsHeader: parseEventsFile
};
//# sourceMappingURL=tools.js.map