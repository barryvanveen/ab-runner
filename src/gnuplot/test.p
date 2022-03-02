count = ARG1

set terminal png size 500,500
set output 'test.png'
set size 1, 1

set title "Apache Benchmark results"

set style fill solid 0.5 border -1
set style boxplot outliers pointtype 7
set style data boxplot
set boxwidth  0.5
set pointsize 0.5
set border 2

set xtics nomirror
set xtics ("Run 1" 1, "Run ".count count, "Combined" count+1)
set ytics nomirror
set yrange [0:*]
set ylabel "Response time (ms)"
set datafile separator '\t'
unset key

plot for [i=1:count] 'iteration'.i.'.dat' every ::2 using (i):5 t 'run '.i, \
     'combined.dat' every::2 using (count+1):5 t 'combined'
exit