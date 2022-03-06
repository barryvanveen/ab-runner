count = ARG1

set terminal png size 500,500
set output 'compare.png'
set size 1, 1
set title "Benchmark testing"

set style fill solid 0.5 border -1
set style boxplot nooutliers
set style data boxplot
set boxwidth  0.5
set pointsize 0.5
set border 2

set for [i = 1:count] xtics (ARGV[i+1] i)
set ytics nomirror
set yrange [0:*]
set ylabel "Response time (ms)"
set datafile separator '\t'
unset key

plot for [i=1:count] 'run'.i.'.dat' every ::2 using (i):5