#!/usr/bin/env node

const { Command, Option } = require('commander');
const { ApacheBenchmark } = require("./src/ab");

/**
 * Test (run Apache Benchmark)
 */

const test = new Command('test');

test.addOption(new Option('-o, --output-dir <string>', 'directory to store output').makeOptionMandatory())
    .addOption(new Option('-r, --requests <int>', 'number of requests to make to url').default(500))
    .addOption(new Option('-c, --concurrency <int>', 'number of concurrent requests').default(10))
    .addOption(new Option('-u, --url <string>', 'url to test').makeOptionMandatory())
    .addOption(new Option('-i, --iterations <int>', 'how often should the test be repeated').default(1))
    .addOption(new Option('-w, --wait <int>', 'how long to wait between iterations (in seconds)').default(300, '5 minutes'))
    .action((options) => {
        try {
            const test = new ApacheBenchmark(options);
            test.run();
        } catch (error) {
            console.error(error)
        }
    })

/**
 * Main
 */

program = new Command();
program.showHelpAfterError('(add --help for additional information)');
program.addCommand(test);
program.parse(process.argv);
