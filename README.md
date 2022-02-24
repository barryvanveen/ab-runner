# AB runner
An opinionated Apache Benchmark (`ab`) runner and result plotter.

## Purpose

Running `ab` once can give unreliable results. Maybe your server is doing other work or your machine running the test is busy. To circumvent that issue, this script can take multiple measurements with a wait time in between.

## Requirements

- A unix terminal (tested on macOS)
- [Apache Benchmark (ab)](https://httpd.apache.org/docs/2.4/programs/ab.html)
- [Gnuplot](http://gnuplot.info/)
- [NodeJS](https://nodejs.org/en/)

## Installation

- Clone this repository.
- Run `npm install`

## Quick start

```shell
./abrunner.js test --help
```

## Test

### Single run

A typical run that stores its results in the `/myResults` directory can be started like this:
```shell
./abrunner.js test -r 500 -c 10 -u https://localhost.test -o ./results/foo
```

### Multiple requests

If you want to perform the same test 10 times with a 5 minute (=300 seconds) wait in between:
```shell
./abrunner.js test -r 500 -c 10 -u https://localhost.test -o ./results/bar -i 10  -w 300
```

### HTTP Request methods

Making a POST method (or any other method) by supplying the `-m` option:
```shell
./abrunner.js test -u https://localhost.test -o ./results/bar -m POST
```

For POST/PUT methods it may be necessary to add a Content-Type:
```shell
./abrunner.js test -u https://localhost.test -o ./results/bar -m POST -t "application/json"
```

### Adding headers

One or more headers can be added with the `-h` option:
```shell
./abrunner.js test -u https://localhost.test -o ./results/bar -m POST -h "Accept: application/json" "Authorization: Bearer ..."
```

### Results

Running this command will create a bunch of outputs:
- `iteration*.dat` files contain the `ab` raw measurements
- `iteration*.dat` files contain the `ab` output (that is normally outputted in the terminal)
- `combined.dat` contains all combined measurements
- `combined.stats` contain some statistics collected from the combined measurements
- `results.png` contains a plot with which you can visually inspect the response times of the individual runs and everything combined
- `results.p` is the Gnuplot script used to create above plot
