count = ARG1

set terminal png size 500,500
set output 'results.png'
set size 1, 1

set title "Apache benchmark results"

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

set print 'combined.stats'
stat 'combined.dat' every ::2 using 5 name "STATS" nooutput

print sprintf("Mean: %.2f", STATS_mean)
print sprintf("Min: %.2f", STATS_min)
print sprintf("Lower 1st quartile: %.2f", STATS_lo_quartile)
print sprintf("Median: %.2f", STATS_median)
print sprintf("Upper 3rd quartile: %.2f", STATS_up_quartile)
print sprintf("Max: %.2f", STATS_max)

plot for [i=1:count] 'iteration'.i.'.dat' every ::2 using (i):5 t 'run '.i, \
     'combined.dat' every::2 using (count+1):5 t 'combined'
exit