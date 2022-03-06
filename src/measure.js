const { execSync } = require('child_process');
const path = require("path");
const { Logger } = require("./logger");
const { copyFile, createDir, exists } = require("./fileSystem");

class Measure {
    #outputDir;
    #requests;
    #concurrency;
    #url;
    #method;
    #contentType;
    #headers;
    #iterations;
    #wait;
    #logger;

    constructor(options) {
        this.#outputDir = path.normalize(options.outputDir);
        this.#requests = options.requests;
        this.#concurrency = options.concurrency;
        this.#url = options.url;
        this.#method = options.method;
        this.#contentType = options.contentType;
        this.#headers = options.headers;
        this.#iterations = options.iterations;
        this.#wait = options.wait;

        if (exists(this.#outputDir)) {
            throw new Error('Directory already exists');
        }

        if (!createDir(this.#outputDir)) {
            throw new Error('Directory could not be created');
        }

        const logFile = path.join(this.#outputDir, 'output.log');
        this.#logger = new Logger(logFile)
        this.#logger.log(options);
    }

    #getAbCommand(iteration) {
        const dataFile = `iteration${iteration}.dat`;
        const outputFile = `iteration${iteration}.out`;

        let command = [
            'ab',
            `-n ${this.#requests}`,
            `-c ${this.#concurrency}`,
            `-g ${dataFile}`,
            `-m ${this.#method}`,
        ];

        command = command.concat(this.#getAbOptionalCommandParts());

        command = command.concat([
            `-l`,
            this.#url,
            `&> ${outputFile}`
        ]);

        return command.join(' ');
    }

    #getAbOptionalCommandParts() {
        let command = [];

        if (this.#contentType) {
            command = command.concat([
                `-T "${this.#contentType}"`,
            ]);
        }

        if (this.#headers) {
            for (let i in this.#headers) {
                command = command.concat([
                    `-H "${this.#headers[i]}"`,
                ]);
            }
        }

        return command;
    }

    #execute(command) {
        this.#logger.log(command)
        execSync(command, { cwd: this.#outputDir });
    }

    run() {
        for (let iteration=1; iteration<=this.#iterations; iteration++) {
            this.#logger.logToScreen(`Running ab (${iteration})`);
            this.#execute(this.#getAbCommand(iteration));

            if (iteration<this.#iterations) {
                this.#logger.logToScreen(`Wait (${iteration})`);
                this.#execute(`sleep ${this.#wait}`);
            }
        }

        this.#execute(`awk "FNR>1 || NR==1" iteration*.dat > combined.dat`);

        copyFile(path.join(__dirname, 'gnuplot/measure.p'), this.#outputDir);
        this.#execute(`gnuplot -c measure.p ${this.#iterations}`);

        copyFile(path.join(__dirname, 'gnuplot/stats.p'), this.#outputDir);
        this.#execute(`gnuplot -c stats.p combined.dat combined.stats`);
    }
}

exports.Measure = Measure;
