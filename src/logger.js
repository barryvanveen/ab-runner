const fs = require("fs");

class Logger {
    constructor(outputfile) {
        this.logger = new console.Console(fs.createWriteStream(outputfile))
    }

    log(data) {
        this.logger.log(data);
    }

    logToScreen(data) {
        console.log(data);
    }
}

exports.Logger = Logger;
