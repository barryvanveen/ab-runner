#!/usr/bin/env node

const { Command, Option } = require('commander');
const { Compare } = require('./src/compare');
const { Test } = require('./src/test');

/**
 * Test (run Apache Benchmark)
 */

const test = new Command('test');

test.addOption(new Option('-o, --output-dir <string>', 'directory to store output').makeOptionMandatory())
    .addOption(new Option('-r, --requests <int>', 'number of requests to make to url').default(500))
    .addOption(new Option('-c, --concurrency <int>', 'number of concurrent requests').default(10))
    .addOption(new Option('-u, --url <string>', 'url to test').makeOptionMandatory())
    .addOption(new Option('-m, --method <string>', 'GET, POST, PUT, HEAD, etc').default('GET'))
    .addOption(new Option('-t, --content-type <string>', 'Content-Type header for POST/PUT requests'))
    .addOption(new Option('-h, --headers <string...>', 'One or more headers to add to the request, eg. \'Accept-Encoding: gzip\''))
    .addOption(new Option('-i, --iterations <int>', 'how often should the test be repeated').default(10))
    .addOption(new Option('-w, --wait <int>', 'how long to wait between iterations (in seconds)').default(300, '5 minutes'))
    .action((options) => {
        try {
            const test = new Test(options);
            test.run();
        } catch (error) {
            console.error(error)
        }
    })

/**
 * Compare
 */

const compare = new Command('compare');

compare
    .addOption(new Option('-i, --input-files <string...>', 'input files to compare').makeOptionMandatory())
    .addOption(new Option('-l, --labels <string...>', 'label for each directory (used in plot)').makeOptionMandatory())
    .addOption(new Option('-o, --output-dir <string>', 'directory to store output').makeOptionMandatory())
    .action((options) => {
        try {
            const compare = new Compare(options);
            compare.run();
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
program.addCommand(compare);
program.parse(process.argv);
