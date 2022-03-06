# Advanced measure commands

## Single run

A typical run that stores its results in the `./results/foo` directory can be started like this:
```shell
./abrunner.js measure -r 500 -c 10 -i 1 -u https://localhost.test/ -o results/foo
```

## Multiple requests

If you want to perform the same measurement 10 times with a 5 minute (=300 seconds) wait in between:
```shell
./abrunner.js measure -r 500 -c 10 -u https://localhost.test/ -o results/bar -i 10  -w 300
 ```

## HTTP Request methods

Making a POST method (or any other method) by supplying the `-m` option:
```shell
./abrunner.js measure -u https://localhost.test/ -o results/bar -m POST
```

For POST/PUT methods it may be necessary to add a Content-Type:
```shell
./abrunner.js measure -u https://localhost.test/ -o results/bar -m POST -t "application/json"
```

## Adding headers

One or more headers can be added with the `-h` option:
```shell
./abrunner.js measure -u https://localhost.test/ -o results/bar -m POST -h "Accept: application/json" "Authorization: Bearer ..."
```