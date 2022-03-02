input = ARG1
output = ARG2

set datafile separator '\t'
set print output
stat input every ::2 using 5 name "STATS" nooutput

print sprintf("Mean: %.2f", STATS_mean)
print sprintf("Min: %.2f", STATS_min)
print sprintf("Lower 1st quartile: %.2f", STATS_lo_quartile)
print sprintf("Median: %.2f", STATS_median)
print sprintf("Upper 3rd quartile: %.2f", STATS_up_quartile)
print sprintf("Max: %.2f", STATS_max)
