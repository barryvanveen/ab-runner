const { execSync } = require('child_process');
const fs = require("fs");
const path = require("path");

class ApacheBenchmark {
    constructor(options) {
        this.outputDir = path.normalize(options.outputDir);
        this.requests = options.requests;
        this.concurrency = options.concurrency;
        this.url = options.url;
        this.method = options.method;
        this.contentType = options.contentType;
        this.headers = options.headers;
        this.iterations = options.iterations;
        this.wait = options.wait;

        if (fs.existsSync(this.outputDir)) {
            throw new Error('Directory already exists');
        }

        if (!createOutputDir(this.outputDir)) {
            throw new Error('Directory could not be created');
        }

        const logFile = path.join(this.outputDir, 'output.log');
        this.logger = new console.Console(fs.createWriteStream(logFile))
        this.logger.log(options);
    }

    getAbCommand(iteration) {
        const dataFile = path.join(this.outputDir, `iteration${iteration}.dat`);
        const outputFile = path.join(this.outputDir, `iteration${iteration}.out`);

        let command = [
            'ab',
            `-n ${this.requests}`,
            `-c ${this.concurrency}`,
            `-g ${dataFile}`,
            `-m ${this.method}`,
        ];

        command = command.concat(this.getAbOptionalCommandParts());

        command = command.concat([
            `-l`,
            this.url,
            `&> ${outputFile}`
        ]);

        return command.join(' ');
    }

    getAbOptionalCommandParts() {
        let command = [];

        if (this.contentType) {
            command = command.concat([
                `-T "${this.contentType}"`,
            ]);
        }

        if (this.headers) {
            for (let i in this.headers) {
                command = command.concat([
                    `-H "${this.headers[i]}"`,
                ]);
            }
        }

        return command;
    }

    run() {
        for (let iteration=1; iteration<=this.iterations; iteration++) {
            exec(this.logger, this.getAbCommand(iteration));

            if (iteration<this.iterations) {
                exec(this.logger, getSleepCommand(this.wait));
            }
        }

        exec(this.logger, getCombineDataCommand(this.outputDir))

        copyGnuplotFile(this.outputDir);
        execFromCwd(this.logger, getPlotCommand(this.iterations), this.outputDir);
    }
}

function createOutputDir(dir) {
    try {
        fs.mkdir(dir, { recursive: true }, (error) => {
            if (error) throw error;
        });
    } catch (Error) {
        return false;
    }

    return true;
}

function exec(logger, command) {
    logger.log(command);
    execSync(command)
}

function execFromCwd(logger, command, cwd) {
    logger.log(command)
    execSync(command, { cwd: cwd });
}

function getSleepCommand(seconds) {
    return `sleep ${seconds}`;
}

function getCombineDataCommand(dir) {
    return `awk "FNR>1 || NR==1" ${dir}/iteration*.dat > ${dir}/combined.dat`;
}

function copyGnuplotFile(dir) {
    fs.copyFileSync(
        path.join(__dirname, 'gnuplot/results.p'),
        path.join(dir, 'results.p')
    );
}

function getPlotCommand(iterations) {
    return `gnuplot -c results.p ${iterations}`;
}

exports.ApacheBenchmark = ApacheBenchmark;
