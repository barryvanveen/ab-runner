const { execSync } = require('child_process');
const path = require("path");
const { Logger } = require("./logger");
const { exists, createDir, copyFile} = require("./fileSystem");

class Compare {
    #inputFiles;
    #labels;
    #outputDir;
    #logger;

    constructor(options) {
        this.#inputFiles = options.inputFiles;
        this.#labels = options.labels;
        this.#outputDir = path.normalize(options.outputDir);

        // check if we have an even number of input files and labels
        if (this.#inputFiles.length !== this.#labels.length) {
            throw new Error('Please define exactly one label for each input file');
        }

        // check if all input files exist
        for (let i in this.#inputFiles) {
            this.#inputFiles[i] = path.normalize(this.#inputFiles[i]);

            if (exists(this.#inputFiles[i]) === false) {
                throw new Error(`Input file ${this.#inputFiles[i]} does not exist`);
            }
        }

        // check if the output directory does not exist yet
        if (exists(this.#outputDir)) {
            throw new Error('Output directory already exists');
        }

        if (!createDir(this.#outputDir)) {
            throw new Error('Directory could not be created');
        }

        const logFile = path.join(this.#outputDir, 'output.log');
        this.#logger = new Logger(logFile)
        this.#logger.log(options);
    }

    #execute(command) {
        this.#logger.log(command)
        execSync(command, { cwd: this.#outputDir });
    }

    #getGnuplotCommand() {
        let command = [
            `gnuplot -c 'compare.p' ${this.#inputFiles.length}`,
        ];

        for (let i in this.#labels) {
            command = command.concat(`"${this.#labels[i]}"`);
        }

        return command.join(' ');
    }


    run() {
        copyFile(path.join(__dirname, 'gnuplot/stats.p'), this.#outputDir);
        copyFile(path.join(__dirname, 'gnuplot/compare.p'), this.#outputDir);

        for (let i in this.#inputFiles) {
            const runNumber = Number(i) + 1;

            copyFile(
                this.#inputFiles[i],
                path.join(this.#outputDir, `run${runNumber}.dat`)
            );

            this.#execute(`gnuplot -c stats.p run${runNumber}.dat run${runNumber}.stats`);
        }

        this.#execute(this.#getGnuplotCommand());
    }
}

exports.Compare = Compare;
