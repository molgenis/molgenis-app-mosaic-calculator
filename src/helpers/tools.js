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
function parseArrayFile(array, callback, errorFunction) {
    let started = false;
    let firstLine = true;
    let columns = [];
    let lines = [];
    let errorMsg = '';
    let headerFound = false;
    lineReader.readSomeLines(array, 1000000, function (line) {
        if (line.startsWith('#')) {
            errorMsg = 'Array file not valid: lines in file cannot start with "#"';
            return false;
        }
        else if (line.startsWith('[Header]')) {
            headerFound = true;
        }
        else if (line.startsWith('[Data]')) {
            if (!headerFound) {
                errorMsg = 'Array file not valid: no [Header] defined above [Data]';
                return false;
            }
            started = true;
        }
        else if (started && firstLine) {
            columns = getColumnsFromLine(line);
            firstLine = false;
            if (!areColumnsValid(columns, ['chr', 'position', 'b_allele_freq'])) {
                errorMsg = 'Array file not valid: file should at least contain "chr", "position", and "b allele freq" column';
                return false;
            }
        }
        else if (!firstLine) {
            const lineArray = splitLine(line);
            if (lineArray.length > 1) {
                lines.push({
                    'chr': lineArray[getIndex(columns, 'chr')],
                    'position': lineArray[getIndex(columns, 'position')],
                    'BAF': lineArray[getIndex(columns, 'b_allele_freq')]
                });
            }
        }
        return true;
    }, function () {
        callback(lines);
    }, function (errorMessage) {
        if (errorMsg.length > 0) {
            errorFunction(errorMsg);
        }
        else {
            errorFunction(errorMessage);
        }
    });
}
function parseEventsFile(events, callback, errorFunction) {
    let sex = '';
    let columns = [];
    let lines = [];
    let firstLine = true;
    let errorMsg = '';
    lineReader.readSomeLines(events, 500, function (line) {
        if (line.startsWith('#Gender')) {
            sex = line.split(' = ')[1]
                .replace(/(\r\n|\n|\r| |\t)/gm, '')
                .toLowerCase();
        }
        else if (!line.startsWith('#') && firstLine) {
            columns = getColumnsFromLine(line);
            firstLine = false;
            if (!areColumnsValid(columns, ['chromosome_region', 'event', 'length', 'probes'])) {
                errorMsg = 'Events file not valid: file should at least contain "chromosome region", "event", "length", and "probes" column';
                return false;
            }
        }
        else if (!firstLine) {
            const lineArray = splitLine(line);
            const chrRegion = lineArray[getIndex(columns, 'chromosome_region')]
                .replace(/,|chr/g, '')
                .split(/:|-/);
            lines.push({
                'chromosome': chrRegion[0],
                'start': chrRegion[1],
                'stop': chrRegion[2],
                'event': lineArray[getIndex(columns, 'event')],
                'length': lineArray[getIndex(columns, 'length')],
                'probes': lineArray[getIndex(columns, 'probes')]
            });
        }
        return true;
    }, function () {
        callback(sex, lines);
    }, function (errorMessage) {
        if (errorMsg.length > 0) {
            errorFunction(errorMsg);
        }
        else {
            errorFunction(errorMessage);
        }
    });
}
function splitLine(line) {
    return line.trim().split('\t');
}
function getColumnsFromLine(line) {
    return splitLine(line).map((value) => {
        return value.toLowerCase().replace(/ /g, '_');
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
function areColumnsValid(columns, requiredColumns) {
    let valid = true;
    requiredColumns.forEach((column) => {
        if (getIndex(columns, column) === -1) {
            valid = false;
        }
    });
    return valid;
}
export default {
    generateRandomString,
    parseEventsFile,
    parseArrayFile,
    chunks,
    getIndex,
    getColumnsFromLine,
    splitLine,
    areColumnsValid
};
//# sourceMappingURL=tools.js.map