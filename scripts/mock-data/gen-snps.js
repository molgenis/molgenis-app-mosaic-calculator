var fs = require('fs')
var os = require("os")

var chromosomeData = {
  '1': [[0, 2300000, 'p36.33'], [2300000, 5400000, 'p36.32'], [5400000, 7200000, 'p36.31'],
    [7200000, 9200000, 'p36.23'], [9200000, 12700000, 'p36.22'], [12700000, 16200000, 'p36.21'],
    [16200000, 20400000, 'p36.13'], [20400000, 23900000, 'p36.12'], [23900000, 28000000, 'p36.11'],
    [28000000, 30200000, 'p35.3'], [30200000, 32400000, 'p35.2'], [32400000, 34600000, 'p35.1'],
    [34600000, 40100000, 'p34.3'], [40100000, 44100000, 'p34.2'], [44100000, 46800000, 'p34.1'],
    [46800000, 50700000, 'p33'], [50700000, 56100000, 'p32.3'], [56100000, 59000000, 'p32.2'],
    [59000000, 61300000, 'p32.1'], [61300000, 68900000, 'p31.3'], [68900000, 69700000, 'p31.2'],
    [69700000, 84900000, 'p31.1'], [84900000, 88400000, 'p22.3'], [88400000, 92000000, 'p22.2'],
    [92000000, 94700000, 'p22.1'], [94700000, 99700000, 'p21.3'], [99700000, 102200000, 'p21.2'],
    [102200000, 107200000, 'p21.1'], [107200000, 111800000, 'p13.3'], [111800000, 116100000, 'p13.2'],
    [116100000, 117800000, 'p13.1'], [117800000, 120600000, 'p12'], [120600000, 121500000, 'p11.2'],
    [121500000, 125000000, 'p11.1'], [125000000, 128900000, 'q11'], [128900000, 142600000, 'q12'],
    [142600000, 147000000, 'q21.1'], [147000000, 150300000, 'q21.2'], [150300000, 155000000, 'q21.3'],
    [155000000, 156500000, 'q22'], [156500000, 159100000, 'q23.1'], [159100000, 160500000, 'q23.2'],
    [160500000, 165500000, 'q23.3'], [165500000, 167200000, 'q24.1'], [167200000, 170900000, 'q24.2'],
    [170900000, 172900000, 'q24.3'], [172900000, 176000000, 'q25.1'], [176000000, 180300000, 'q25.2'],
    [180300000, 185800000, 'q25.3'], [185800000, 190800000, 'q31.1'], [190800000, 193800000, 'q31.2'],
    [193800000, 198700000, 'q31.3'], [198700000, 207200000, 'q32.1'], [207200000, 211500000, 'q32.2'],
    [211500000, 214500000, 'q32.3'], [214500000, 224100000, 'q41'], [224100000, 224600000, 'q42.11'],
    [224600000, 227000000, 'q42.12'], [227000000, 230700000, 'q42.13'], [230700000, 234700000, 'q42.2'],
    [234700000, 236600000, 'q42.3'], [236600000, 243700000, 'q43'], [243700000, 249250621, 'q44']],
  '2': [[0, 4400000, 'p25.3'], [4400000, 7100000, 'p25.2'], [7100000, 12200000, 'p25.1'],
    [12200000, 16700000, 'p24.3'], [16700000, 19200000, 'p24.2'], [19200000, 24000000, 'p24.1'],
    [24000000, 27900000, 'p23.3'], [27900000, 30000000, 'p23.2'], [30000000, 32100000, 'p23.1'],
    [32100000, 36600000, 'p22.3'], [36600000, 38600000, 'p22.2'], [38600000, 41800000, 'p22.1'],
    [41800000, 47800000, 'p21'], [47800000, 52900000, 'p16.3'], [52900000, 55000000, 'p16.2'],
    [55000000, 61300000, 'p16.1'], [61300000, 64100000, 'p15'], [64100000, 68600000, 'p14'],
    [68600000, 71500000, 'p13.3'], [71500000, 73500000, 'p13.2'], [73500000, 75000000, 'p13.1'],
    [75000000, 83300000, 'p12'], [83300000, 90500000, 'p11.2'], [90500000, 93300000, 'p11.1'],
    [93300000, 96800000, 'q11.1'], [96800000, 102700000, 'q11.2'], [102700000, 106000000, 'q12.1'],
    [106000000, 107500000, 'q12.2'], [107500000, 110200000, 'q12.3'], [110200000, 114400000, 'q13'],
    [114400000, 118800000, 'q14.1'], [118800000, 122400000, 'q14.2'], [122400000, 129900000, 'q14.3'],
    [129900000, 132500000, 'q21.1'], [132500000, 135100000, 'q21.2'], [135100000, 136800000, 'q21.3'],
    [136800000, 142200000, 'q22.1'], [142200000, 144100000, 'q22.2'], [144100000, 148700000, 'q22.3'],
    [148700000, 149900000, 'q23.1'], [149900000, 150500000, 'q23.2'], [150500000, 154900000, 'q23.3'],
    [154900000, 159800000, 'q24.1'], [159800000, 163700000, 'q24.2'], [163700000, 169700000, 'q24.3'],
    [169700000, 178000000, 'q31.1'], [178000000, 180600000, 'q31.2'], [180600000, 183000000, 'q31.3'],
    [183000000, 189400000, 'q32.1'], [189400000, 191900000, 'q32.2'], [191900000, 197400000, 'q32.3'],
    [197400000, 203300000, 'q33.1'], [203300000, 204900000, 'q33.2'], [204900000, 209000000, 'q33.3'],
    [209000000, 215300000, 'q34'], [215300000, 221500000, 'q35'], [221500000, 225200000, 'q36.1'],
    [225200000, 226100000, 'q36.2'], [226100000, 231000000, 'q36.3'], [231000000, 235600000, 'q37.1'],
    [235600000, 237300000, 'q37.2'], [237300000, 243199373, 'q37.3']],
  '3': [[0, 2800000, 'p26.3'], [2800000, 4000000, 'p26.2'], [4000000, 8700000, 'p26.1'],
    [8700000, 11800000, 'p25.3'], [11800000, 13300000, 'p25.2'], [13300000, 16400000, 'p25.1'],
    [16400000, 23900000, 'p24.3'], [23900000, 26400000, 'p24.2'], [26400000, 30900000, 'p24.1'],
    [30900000, 32100000, 'p23'], [32100000, 36500000, 'p22.3'], [36500000, 39400000, 'p22.2'],
    [39400000, 43700000, 'p22.1'], [43700000, 44100000, 'p21.33'], [44100000, 44200000, 'p21.32'],
    [44200000, 50600000, 'p21.31'], [50600000, 52300000, 'p21.2'], [52300000, 54400000, 'p21.1'],
    [54400000, 58600000, 'p14.3'], [58600000, 63700000, 'p14.2'], [63700000, 69800000, 'p14.1'],
    [69800000, 74200000, 'p13'], [74200000, 79800000, 'p12.3'], [79800000, 83500000, 'p12.2'],
    [83500000, 87200000, 'p12.1'], [87200000, 87900000, 'p11.2'], [87900000, 91000000, 'p11.1'],
    [91000000, 93900000, 'q11.1'], [93900000, 98300000, 'q11.2'], [98300000, 100000000, 'q12.1'],
    [100000000, 100900000, 'q12.2'], [100900000, 102800000, 'q12.3'], [102800000, 106200000, 'q13.11'],
    [106200000, 107900000, 'q13.12'], [107900000, 111300000, 'q13.13'], [111300000, 113500000, 'q13.2'],
    [113500000, 117300000, 'q13.31'], [117300000, 119000000, 'q13.32'], [119000000, 121900000, 'q13.33'],
    [121900000, 123800000, 'q21.1'], [123800000, 125800000, 'q21.2'], [125800000, 129200000, 'q21.3'],
    [129200000, 133700000, 'q22.1'], [133700000, 135700000, 'q22.2'], [135700000, 138700000, 'q22.3'],
    [138700000, 142800000, 'q23'], [142800000, 148900000, 'q24'], [148900000, 152100000, 'q25.1'],
    [152100000, 155000000, 'q25.2'], [155000000, 157000000, 'q25.31'], [157000000, 159000000, 'q25.32'],
    [159000000, 160700000, 'q25.33'], [160700000, 167600000, 'q26.1'], [167600000, 170900000, 'q26.2'],
    [170900000, 175700000, 'q26.31'], [175700000, 179000000, 'q26.32'], [179000000, 182700000, 'q26.33'],
    [182700000, 184500000, 'q27.1'], [184500000, 186000000, 'q27.2'], [186000000, 187900000, 'q27.3'],
    [187900000, 192300000, 'q28'], [192300000, 198022430, 'q29']],
  '4': [[0, 4500000, 'p16.3'], [4500000, 6000000, 'p16.2'], [6000000, 11300000, 'p16.1'],
    [11300000, 15200000, 'p15.33'], [15200000, 17800000, 'p15.32'], [17800000, 21300000, 'p15.31'],
    [21300000, 27700000, 'p15.2'], [27700000, 35800000, 'p15.1'], [35800000, 41200000, 'p14'],
    [41200000, 44600000, 'p13'], [44600000, 48200000, 'p12'], [48200000, 50400000, 'p11'],
    [50400000, 52700000, 'q11'], [52700000, 59500000, 'q12'], [59500000, 66600000, 'q13.1'],
    [66600000, 70500000, 'q13.2'], [70500000, 76300000, 'q13.3'], [76300000, 78900000, 'q21.1'],
    [78900000, 82400000, 'q21.21'], [82400000, 84100000, 'q21.22'], [84100000, 86900000, 'q21.23'],
    [86900000, 88000000, 'q21.3'], [88000000, 93700000, 'q22.1'], [93700000, 95100000, 'q22.2'],
    [95100000, 98800000, 'q22.3'], [98800000, 101100000, 'q23'], [101100000, 107700000, 'q24'],
    [107700000, 114100000, 'q25'], [114100000, 120800000, 'q26'], [120800000, 123800000, 'q27'],
    [123800000, 128800000, 'q28.1'], [128800000, 131100000, 'q28.2'], [131100000, 139500000, 'q28.3'],
    [139500000, 141500000, 'q31.1'], [141500000, 146800000, 'q31.21'], [146800000, 148500000, 'q31.22'],
    [148500000, 151100000, 'q31.23'], [151100000, 155600000, 'q31.3'], [155600000, 161800000, 'q32.1'],
    [161800000, 164500000, 'q32.2'], [164500000, 170100000, 'q32.3'], [170100000, 171900000, 'q33'],
    [171900000, 176300000, 'q34.1'], [176300000, 177500000, 'q34.2'], [177500000, 183200000, 'q34.3'],
    [183200000, 187100000, 'q35.1'], [187100000, 191154276, 'q35.2']],
  '5': [[0, 4500000, 'p15.33'], [4500000, 6300000, 'p15.32'], [6300000, 9800000, 'p15.31'],
    [9800000, 15000000, 'p15.2'], [15000000, 18400000, 'p15.1'], [18400000, 23300000, 'p14.3'],
    [23300000, 24600000, 'p14.2'], [24600000, 28900000, 'p14.1'], [28900000, 33800000, 'p13.3'],
    [33800000, 38400000, 'p13.2'], [38400000, 42500000, 'p13.1'], [42500000, 46100000, 'p12'],
    [46100000, 48400000, 'p11'], [48400000, 50700000, 'q11.1'], [50700000, 58900000, 'q11.2'],
    [58900000, 62900000, 'q12.1'], [62900000, 63200000, 'q12.2'], [63200000, 66700000, 'q12.3'],
    [66700000, 68400000, 'q13.1'], [68400000, 73300000, 'q13.2'], [73300000, 76900000, 'q13.3'],
    [76900000, 81400000, 'q14.1'], [81400000, 82800000, 'q14.2'], [82800000, 92300000, 'q14.3'],
    [92300000, 98200000, 'q15'], [98200000, 102800000, 'q21.1'], [102800000, 104500000, 'q21.2'],
    [104500000, 109600000, 'q21.3'], [109600000, 111500000, 'q22.1'], [111500000, 113100000, 'q22.2'],
    [113100000, 115200000, 'q22.3'], [115200000, 121400000, 'q23.1'], [121400000, 127300000, 'q23.2'],
    [127300000, 130600000, 'q23.3'], [130600000, 136200000, 'q31.1'], [136200000, 139500000, 'q31.2'],
    [139500000, 144500000, 'q31.3'], [144500000, 149800000, 'q32'], [149800000, 152700000, 'q33.1'],
    [152700000, 155700000, 'q33.2'], [155700000, 159900000, 'q33.3'], [159900000, 168500000, 'q34'],
    [168500000, 172800000, 'q35.1'], [172800000, 176600000, 'q35.2'], [176600000, 180915260, 'q35.3']],
  '6': [[0, 2300000, 'p25.3'], [2300000, 4200000, 'p25.2'], [4200000, 7100000, 'p25.1'],
    [7100000, 10600000, 'p24.3'], [10600000, 11600000, 'p24.2'], [11600000, 13400000, 'p24.1'],
    [13400000, 15200000, 'p23'], [15200000, 25200000, 'p22.3'], [25200000, 27000000, 'p22.2'],
    [27000000, 30400000, 'p22.1'], [30400000, 32100000, 'p21.33'], [32100000, 33500000, 'p21.32'],
    [33500000, 36600000, 'p21.31'], [36600000, 40500000, 'p21.2'], [40500000, 46200000, 'p21.1'],
    [46200000, 51800000, 'p12.3'], [51800000, 52900000, 'p12.2'], [52900000, 57000000, 'p12.1'],
    [57000000, 58700000, 'p11.2'], [58700000, 61000000, 'p11.1'], [61000000, 63300000, 'q11.1'],
    [63300000, 63400000, 'q11.2'], [63400000, 70000000, 'q12'], [70000000, 75900000, 'q13'],
    [75900000, 83900000, 'q14.1'], [83900000, 84900000, 'q14.2'], [84900000, 88000000, 'q14.3'],
    [88000000, 93100000, 'q15'], [93100000, 99500000, 'q16.1'], [99500000, 100600000, 'q16.2'],
    [100600000, 105500000, 'q16.3'], [105500000, 114600000, 'q21'], [114600000, 118300000, 'q22.1'],
    [118300000, 118500000, 'q22.2'], [118500000, 126100000, 'q22.31'], [126100000, 127100000, 'q22.32'],
    [127100000, 130300000, 'q22.33'], [130300000, 131200000, 'q23.1'], [131200000, 135200000, 'q23.3'],
    [135200000, 139000000, 'q23.3'], [139000000, 142800000, 'q24.1'], [142800000, 145600000, 'q24.2'],
    [145600000, 149000000, 'q24.3'], [149000000, 152500000, 'q25.1'], [152500000, 155500000, 'q25.2'],
    [155500000, 161000000, 'q25.3'], [161000000, 164500000, 'q26'], [164500000, 171115067, 'q27']],
  '7': [[0, 2800000, 'p22.3'], [2800000, 4500000, 'p22.2'], [4500000, 7300000, 'p22.1'],
    [7300000, 13800000, 'p21.3'], [13800000, 16500000, 'p21.2'], [16500000, 20900000, 'p21.1'],
    [20900000, 25500000, 'p15.3'], [25500000, 28000000, 'p15.2'], [28000000, 28800000, 'p15.1'],
    [28800000, 35000000, 'p14.3'], [35000000, 37200000, 'p14.2'], [37200000, 43300000, 'p14.1'],
    [43300000, 45400000, 'p13'], [45400000, 49000000, 'p12.3'], [49000000, 50500000, 'p12.2'],
    [50500000, 54000000, 'p12.1'], [54000000, 58000000, 'p11.2'], [58000000, 59900000, 'p11.1'],
    [59900000, 61700000, 'q11.1'], [61700000, 67000000, 'q11.21'], [67000000, 72200000, 'q11.22'],
    [72200000, 77500000, 'q11.23'], [77500000, 86400000, 'q21.11'], [86400000, 88200000, 'q21.12'],
    [88200000, 91100000, 'q21.13'], [91100000, 92800000, 'q21.2'], [92800000, 98000000, 'q21.3'],
    [98000000, 103800000, 'q22.1'], [103800000, 104500000, 'q22.2'], [104500000, 107400000, 'q22.3'],
    [107400000, 114600000, 'q31.1'], [114600000, 117400000, 'q31.2'], [117400000, 121100000, 'q31.31'],
    [121100000, 123800000, 'q31.32'], [123800000, 127100000, 'q31.33'], [127100000, 129200000, 'q32.1'],
    [129200000, 130400000, 'q32.2'], [130400000, 132600000, 'q32.3'], [132600000, 138200000, 'q33'],
    [138200000, 143100000, 'q34'], [143100000, 147900000, 'q35'], [147900000, 152600000, 'q36.1'],
    [152600000, 155100000, 'q36.2'], [155100000, 159138663, 'q36.3']],
  '8': [[0, 2200000, 'p23.3'], [2200000, 6200000, 'p23.2'], [6200000, 12700000, 'p23.1'],
    [12700000, 19000000, 'p22'], [19000000, 23300000, 'p21.3'], [23300000, 27400000, 'p21.2'],
    [27400000, 28800000, 'p21.1'], [28800000, 36500000, 'p12'], [36500000, 38300000, 'p11.23'],
    [38300000, 39700000, 'p11.22'], [39700000, 43100000, 'p11.21'], [43100000, 45600000, 'p11.1'],
    [45600000, 48100000, 'q11.1'], [48100000, 52200000, 'q11.21'], [52200000, 52600000, 'q11.22'],
    [52600000, 55500000, 'q11.23'], [55500000, 61600000, 'q12.1'], [61600000, 62200000, 'q12.2'],
    [62200000, 66000000, 'q12.3'], [66000000, 68000000, 'q13.1'], [68000000, 70500000, 'q13.2'],
    [70500000, 73900000, 'q13.3'], [73900000, 78300000, 'q21.11'], [78300000, 80100000, 'q21.12'],
    [80100000, 84600000, 'q21.13'], [84600000, 86900000, 'q21.2'], [86900000, 93300000, 'q21.3'],
    [93300000, 99000000, 'q22.1'], [99000000, 101600000, 'q22.2'], [101600000, 106200000, 'q22.3'],
    [106200000, 110500000, 'q23.1'], [110500000, 112100000, 'q23.2'], [112100000, 117700000, 'q23.3'],
    [117700000, 119200000, 'q24.11'], [119200000, 122500000, 'q24.12'], [122500000, 127300000, 'q24.13'],
    [127300000, 131500000, 'q24.21'], [131500000, 136400000, 'q24.22'], [136400000, 139900000, 'q24.23'],
    [139900000, 146364022, 'q24.3']],
  '9': [[0, 2200000, 'p24.3'], [2200000, 4600000, 'p24.2'], [4600000, 9000000, 'p24.1'],
    [9000000, 14200000, 'p23'], [14200000, 16600000, 'p22.3'], [16600000, 18500000, 'p22.2'],
    [18500000, 19900000, 'p22.1'], [19900000, 25600000, 'p21.3'], [25600000, 28000000, 'p21.2'],
    [28000000, 33200000, 'p21.1'], [33200000, 36300000, 'p13.3'], [36300000, 38400000, 'p13.2'],
    [38400000, 41000000, 'p13.1'], [41000000, 43600000, 'p12'], [43600000, 47300000, 'p11.2'],
    [47300000, 49000000, 'p11.1'], [49000000, 50700000, 'q11'], [50700000, 65900000, 'q12'],
    [65900000, 68700000, 'q13'], [68700000, 72200000, 'q21.11'], [72200000, 74000000, 'q21.12'],
    [74000000, 79200000, 'q21.13'], [79200000, 81100000, 'q21.2'], [81100000, 84100000, 'q21.31'],
    [84100000, 86900000, 'q21.32'], [86900000, 90400000, 'q21.33'], [90400000, 91800000, 'q22.1'],
    [91800000, 93900000, 'q22.2'], [93900000, 96600000, 'q22.31'], [96600000, 99300000, 'q22.32'],
    [99300000, 102600000, 'q22.33'], [102600000, 108200000, 'q31.1'], [108200000, 111300000, 'q31.2'],
    [111300000, 114900000, 'q31.3'], [114900000, 117700000, 'q32'], [117700000, 122500000, 'q33.1'],
    [122500000, 125800000, 'q33.2'], [125800000, 130300000, 'q33.3'], [130300000, 133500000, 'q34.11'],
    [133500000, 134000000, 'q34.12'], [134000000, 135900000, 'q34.13'], [135900000, 137400000, 'q34.2'],
    [137400000, 141213431, 'q34.3']],
  '10': [[0, 3000000, 'p15.3'], [3000000, 3800000, 'p15.2'], [3800000, 6600000, 'p15.1'],
    [6600000, 12200000, 'p14'], [12200000, 17300000, 'p13'], [17300000, 18600000, 'p12.33'],
    [18600000, 18700000, 'p12.32'], [18700000, 22600000, 'p12.31'], [22600000, 24600000, 'p12.2'],
    [24600000, 29600000, 'p12.1'], [29600000, 31300000, 'p11.23'], [31300000, 34400000, 'p11.22'],
    [34400000, 38000000, 'p11.21'], [38000000, 40200000, 'p11.1'], [40200000, 42300000, 'q11.1'],
    [42300000, 46100000, 'q11.21'], [46100000, 49900000, 'q11.22'], [49900000, 52900000, 'q11.23'],
    [52900000, 61200000, 'q21.1'], [61200000, 64500000, 'q21.2'], [64500000, 70600000, 'q21.3'],
    [70600000, 74900000, 'q22.1'], [74900000, 77700000, 'q22.2'], [77700000, 82000000, 'q22.3'],
    [82000000, 87900000, 'q23.1'], [87900000, 89500000, 'q23.2'], [89500000, 92900000, 'q23.31'],
    [92900000, 94100000, 'q23.32'], [94100000, 97000000, 'q23.33'], [97000000, 99300000, 'q24.1'],
    [99300000, 101900000, 'q24.2'], [101900000, 103000000, 'q24.31'], [103000000, 104900000, 'q24.32'],
    [104900000, 105800000, 'q24.33'], [105800000, 111900000, 'q25.1'], [111900000, 114900000, 'q25.2'],
    [114900000, 119100000, 'q25.3'], [119100000, 121700000, 'q26.11'], [121700000, 123100000, 'q26.12'],
    [123100000, 127500000, 'q26.13'], [127500000, 130600000, 'q26.2'], [130600000, 135534747, 'q26.3']],
  '11': [[0, 2800000, 'p15.5'], [2800000, 10700000, 'p15.4'], [10700000, 12700000, 'p15.3'],
    [12700000, 16200000, 'p15.2'], [16200000, 21700000, 'p15.1'], [21700000, 26100000, 'p14.3'],
    [26100000, 27200000, 'p14.2'], [27200000, 31000000, 'p14.1'], [31000000, 36400000, 'p13'],
    [36400000, 43500000, 'p12'], [43500000, 48800000, 'p11.2'], [48800000, 51600000, 'p11.12'],
    [51600000, 53700000, 'p11.11'], [53700000, 55700000, 'q11'], [55700000, 59900000, 'q12.1'],
    [59900000, 61700000, 'q12.2'], [61700000, 63400000, 'q12.3'], [63400000, 65900000, 'q13.1'],
    [65900000, 68400000, 'q13.2'], [68400000, 70400000, 'q13.3'], [70400000, 75200000, 'q13.4'],
    [75200000, 77100000, 'q13.5'], [77100000, 85600000, 'q14.1'], [85600000, 88300000, 'q14.2'],
    [88300000, 92800000, 'q14.3'], [92800000, 97200000, 'q21'], [97200000, 102100000, 'q22.1'],
    [102100000, 102900000, 'q22.2'], [102900000, 110400000, 'q22.3'], [110400000, 112500000, 'q23.1'],
    [112500000, 114500000, 'q23.2'], [114500000, 121200000, 'q23.3'], [121200000, 123900000, 'q24.1'],
    [123900000, 127800000, 'q24.2'], [127800000, 130800000, 'q24.3'], [130800000, 135006516, 'q25']],
  '12': [[0, 3300000, 'p13.33'], [3300000, 5400000, 'p13.32'], [5400000, 10100000, 'p13.31'],
    [10100000, 12800000, 'p13.2'], [12800000, 14800000, 'p13.1'], [14800000, 20000000, 'p12.3'],
    [20000000, 21300000, 'p12.2'], [21300000, 26500000, 'p12.1'], [26500000, 27800000, 'p11.23'],
    [27800000, 30700000, 'p11.22'], [30700000, 33300000, 'p11.21'], [33300000, 35800000, 'p11.1'],
    [35800000, 38200000, 'q11'], [38200000, 46400000, 'q12'], [46400000, 49100000, 'q13.11'],
    [49100000, 51500000, 'q13.12'], [51500000, 54900000, 'q13.13'], [54900000, 56600000, 'q13.2'],
    [56600000, 58100000, 'q13.3'], [58100000, 63100000, 'q14.1'], [63100000, 65100000, 'q14.2'],
    [65100000, 67700000, 'q14.3'], [67700000, 71500000, 'q15'], [71500000, 75700000, 'q21.1'],
    [75700000, 80300000, 'q21.2'], [80300000, 86700000, 'q21.31'], [86700000, 89000000, 'q21.32'],
    [89000000, 92600000, 'q21.33'], [92600000, 96200000, 'q22'], [96200000, 101600000, 'q23.1'],
    [101600000, 103800000, 'q23.2'], [103800000, 109000000, 'q23.3'], [109000000, 111700000, 'q24.11'],
    [111700000, 112300000, 'q24.12'], [112300000, 114300000, 'q24.13'], [114300000, 116800000, 'q24.21'],
    [116800000, 118100000, 'q24.22'], [118100000, 120700000, 'q24.23'], [120700000, 125900000, 'q24.31'],
    [125900000, 129300000, 'q24.32'], [129300000, 133851895, 'q24.33']],
  '13': [[0, 4500000, 'p13'], [4500000, 10000000, 'p12'], [10000000, 16300000, 'p11.2'],
    [16300000, 17900000, 'p11.1'], [17900000, 19500000, 'q11'], [19500000, 23300000, 'q12.11'],
    [23300000, 25500000, 'q12.12'], [25500000, 27800000, 'q12.13'], [27800000, 28900000, 'q12.2'],
    [28900000, 32200000, 'q12.3'], [32200000, 34000000, 'q13.1'], [34000000, 35500000, 'q13.2'],
    [35500000, 40100000, 'q13.3'], [40100000, 45200000, 'q14.11'], [45200000, 45800000, 'q14.12'],
    [45800000, 47300000, 'q14.13'], [47300000, 50900000, 'q14.2'], [50900000, 55300000, 'q14.3'],
    [55300000, 59600000, 'q21.1'], [59600000, 62300000, 'q21.2'], [62300000, 65700000, 'q21.31'],
    [65700000, 68600000, 'q21.32'], [68600000, 73300000, 'q21.33'], [73300000, 75400000, 'q22.1'],
    [75400000, 77200000, 'q22.2'], [77200000, 79000000, 'q22.3'], [79000000, 87700000, 'q31.1'],
    [87700000, 90000000, 'q31.2'], [90000000, 95000000, 'q31.3'], [95000000, 98200000, 'q32.1'],
    [98200000, 99300000, 'q32.2'], [99300000, 101700000, 'q32.3'], [101700000, 104800000, 'q33.1'],
    [104800000, 107000000, 'q33.2'], [107000000, 110300000, 'q33.3'], [110300000, 115169878, 'q34']],
  '14': [[0, 3700000, 'p13'], [3700000, 8100000, 'p12'], [8100000, 16100000, 'p11.2'],
    [16100000, 17600000, 'p11.1'], [17600000, 19100000, 'q11.1'], [19100000, 24600000, 'q11.2'],
    [24600000, 33300000, 'q12'], [33300000, 35300000, 'q13.1'], [35300000, 36600000, 'q13.2'],
    [36600000, 37800000, 'q13.3'], [37800000, 43500000, 'q21.1'], [43500000, 47200000, 'q21.2'],
    [47200000, 50900000, 'q21.3'], [50900000, 54100000, 'q22.1'], [54100000, 55500000, 'q22.2'],
    [55500000, 58100000, 'q22.3'], [58100000, 62100000, 'q23.1'], [62100000, 64800000, 'q23.2'],
    [64800000, 67900000, 'q23.3'], [67900000, 70200000, 'q24.1'], [70200000, 73800000, 'q24.2'],
    [73800000, 79300000, 'q24.3'], [79300000, 83600000, 'q31.1'], [83600000, 84900000, 'q31.2'],
    [84900000, 89800000, 'q31.3'], [89800000, 91900000, 'q32.11'], [91900000, 94700000, 'q32.12'],
    [94700000, 96300000, 'q32.13'], [96300000, 101400000, 'q32.2'], [101400000, 103200000, 'q32.31'],
    [103200000, 104000000, 'q32.32'], [104000000, 107349540, 'q32.33']],
  '15': [[0, 3900000, 'p13'], [3900000, 8700000, 'p12'], [8700000, 15800000, 'p11.2'],
    [15800000, 19000000, 'p11.1'], [19000000, 20700000, 'q11.1'], [20700000, 25700000, 'q11.2'],
    [25700000, 28100000, 'q12'], [28100000, 30300000, 'q13.1'], [30300000, 31200000, 'q13.2'],
    [31200000, 33600000, 'q13.3'], [33600000, 40100000, 'q14'], [40100000, 42800000, 'q15.1'],
    [42800000, 43600000, 'q15.2'], [43600000, 44800000, 'q15.3'], [44800000, 49500000, 'q21.1'],
    [49500000, 52900000, 'q21.2'], [52900000, 59100000, 'q21.3'], [59100000, 59300000, 'q22.1'],
    [59300000, 63700000, 'q22.2'], [63700000, 67200000, 'q22.31'], [67200000, 67300000, 'q22.32'],
    [67300000, 67500000, 'q22.33'], [67500000, 72700000, 'q23'], [72700000, 75200000, 'q24.1'],
    [75200000, 76600000, 'q24.2'], [76600000, 78300000, 'q24.3'], [78300000, 81700000, 'q25.1'],
    [81700000, 85200000, 'q25.2'], [85200000, 89100000, 'q25.3'], [89100000, 94300000, 'q26.1'],
    [94300000, 98500000, 'q26.2'], [98500000, 102531392, 'q26.3']],
  '16': [[0, 7900000, 'p13.3'], [7900000, 10500000, 'p13.2'],
    [10500000, 12600000, 'p13.13'], [12600000, 14800000, 'p13.12'], [14800000, 16800000, 'p13.11'],
    [16800000, 21200000, 'p12.3'], [21200000, 24200000, 'p12.2'], [24200000, 28100000, 'p12.1'],
    [28100000, 34600000, 'p11.2'], [34600000, 36600000, 'p11.1'], [36600000, 38600000, 'q11.1'],
    [38600000, 47000000, 'q11.2'], [47000000, 52600000, 'q12.1'], [52600000, 56700000, 'q12.2'],
    [56700000, 57400000, 'q13'], [57400000, 66700000, 'q21'], [66700000, 70800000, 'q22.1'],
    [70800000, 72900000, 'q22.2'], [72900000, 74100000, 'q22.3'], [74100000, 79200000, 'q23.1'],
    [79200000, 81700000, 'q23.2'], [81700000, 84200000, 'q23.3'], [84200000, 87100000, 'q24.1'],
    [87100000, 88700000, 'q24.2'], [88700000, 90354753, 'q24.3']],
  '17': [[0, 3300000, 'p13.3'], [3300000, 6500000, 'p13.2'], [6500000, 10700000, 'p13.1'],
    [10700000, 16000000, 'p12'], [16000000, 22200000, 'p11.2'], [22200000, 24000000, 'p11.1'],
    [24000000, 25800000, 'q11.1'], [25800000, 31800000, 'q11.2'], [31800000, 38100000, 'q12'],
    [38100000, 38400000, 'q21.1'], [38400000, 40900000, 'q21.2'], [40900000, 44900000, 'q21.31'],
    [44900000, 47400000, 'q21.32'], [47400000, 50200000, 'q21.33'], [50200000, 57600000, 'q22'],
    [57600000, 58300000, 'q23.1'], [58300000, 61100000, 'q23.2'], [61100000, 62600000, 'q23.3'],
    [62600000, 64200000, 'q24.1'], [64200000, 67100000, 'q24.2'], [67100000, 70900000, 'q24.3'],
    [70900000, 74800000, 'q25.1'], [74800000, 75300000, 'q25.2'], [75300000, 81195210, 'q25.3']],
  '18': [[0, 2900000, 'p11.32'], [2900000, 7100000, 'p11.31'], [7100000, 8500000, 'p11.23'],
    [8500000, 10900000, 'p11.22'], [10900000, 15400000, 'p11.21'], [15400000, 17200000, 'p11.1'],
    [17200000, 19000000, 'q11.1'], [19000000, 25000000, 'q11.2'], [25000000, 32700000, 'q12.1'],
    [32700000, 37200000, 'q12.2'], [37200000, 43500000, 'q12.3'], [43500000, 48200000, 'q21.1'],
    [48200000, 53800000, 'q21.2'], [53800000, 56200000, 'q21.31'], [56200000, 59000000, 'q21.32'],
    [59000000, 61600000, 'q21.33'], [61600000, 66800000, 'q22.1'], [66800000, 68700000, 'q22.2'],
    [68700000, 73100000, 'q22.3'], [73100000, 78077248, 'q23']],
  '19': [[0, 6900000, 'p13.3'], [6900000, 13900000, 'p13.2'], [13900000, 14000000, 'p13.13'],
    [14000000, 16300000, 'p13.12'], [16300000, 20000000, 'p13.11'], [20000000, 24400000, 'p12'],
    [24400000, 26500000, 'p11'], [26500000, 28600000, 'q11'], [28600000, 32400000, 'q12'],
    [32400000, 35500000, 'q13.11'], [35500000, 38300000, 'q13.12'], [38300000, 38700000, 'q13.13'],
    [38700000, 43400000, 'q13.2'], [43400000, 45200000, 'q13.31'], [45200000, 48000000, 'q13.32'],
    [48000000, 51400000, 'q13.33'], [51400000, 53600000, 'q13.41'], [53600000, 56300000, 'q13.42'],
    [56300000, 59128983, 'q13.43']],
  '20': [[0, 5100000, 'p13'], [5100000, 9200000, 'p12.3'], [9200000, 12100000, 'p12.2'],
    [12100000, 17900000, 'p12.1'], [17900000, 21300000, 'p11.23'], [21300000, 22300000, 'p11.22'],
    [22300000, 25600000, 'p11.21'], [25600000, 27500000, 'p11.1'], [27500000, 29400000, 'q11.1'],
    [29400000, 32100000, 'q11.21'], [32100000, 34400000, 'q11.22'], [34400000, 37600000, 'q11.23'],
    [37600000, 41700000, 'q12'], [41700000, 42100000, 'q13.11'], [42100000, 46400000, 'q13.12'],
    [46400000, 49800000, 'q13.13'], [49800000, 55000000, 'q13.2'], [55000000, 56500000, 'q13.31'],
    [56500000, 58400000, 'q13.32'], [58400000, 63025520, 'q13.33']],
  '21': [[0, 2800000, 'p13'], [2800000, 6800000, 'p12'], [6800000, 10900000, 'p11.2'],
    [10900000, 13200000, 'p11.1'], [13200000, 14300000, 'q11.1'], [14300000, 16400000, 'q11.2'],
    [16400000, 24000000, 'q21.1'], [24000000, 26800000, 'q21.2'], [26800000, 31500000, 'q21.3'],
    [31500000, 35800000, 'q22.11'], [35800000, 37800000, 'q22.12'], [37800000, 39700000, 'q22.13'],
    [39700000, 42600000, 'q22.2'], [42600000, 48129895, 'q22.3']],
  '22': [[0, 3800000, 'p13'], [3800000, 8300000, 'p12'], [8300000, 12200000, 'p11.2'],
    [12200000, 14700000, 'p11.1'], [14700000, 17900000, 'q11.1'], [17900000, 22200000, 'q11.21'],
    [22200000, 23500000, 'q11.22'], [23500000, 25900000, 'q11.23'], [25900000, 29600000, 'q12.1'],
    [29600000, 32200000, 'q12.2'], [32200000, 37600000, 'q12.3'], [37600000, 41000000, 'q13.1'],
    [41000000, 44200000, 'q13.2'], [44200000, 48400000, 'q13.31'], [48400000, 49400000, 'q13.32'],
    [49400000, 51304566, 'q13.33']],
  'X': [[0, 4300000, 'p22.33'], [4300000, 6000000, 'p22.32'], [6000000, 9500000, 'p22.31'],
    [9500000, 17100000, 'p22.2'], [17100000, 19300000, 'p22.13'], [19300000, 21900000, 'p22.12'],
    [21900000, 24900000, 'p22.11'], [24900000, 29300000, 'p21.3'], [29300000, 31500000, 'p21.2'],
    [31500000, 37600000, 'p21.1'], [37600000, 42400000, 'p11.4'], [42400000, 46400000, 'p11.3'],
    [46400000, 49800000, 'p11.23'], [49800000, 54800000, 'p11.22'], [54800000, 58100000, 'p11.21'],
    [58100000, 60600000, 'p11.1'], [60600000, 63000000, 'q11.1'], [63000000, 64600000, 'q11.2'],
    [64600000, 67800000, 'q12'], [67800000, 71800000, 'q13.1'], [71800000, 73900000, 'q13.2'],
    [73900000, 76000000, 'q13.3'], [76000000, 84600000, 'q21.1'], [84600000, 86200000, 'q21.2'],
    [86200000, 91800000, 'q21.31'], [91800000, 93500000, 'q21.32'], [93500000, 98300000, 'q21.33'],
    [98300000, 102600000, 'q22.1'], [102600000, 103700000, 'q22.2'], [103700000, 108700000, 'q22.3'],
    [108700000, 116500000, 'q23'], [116500000, 120900000, 'q24'], [120900000, 128700000, 'q25'],
    [128700000, 130400000, 'q26.1'], [130400000, 133600000, 'q26.2'], [133600000, 138000000, 'q26.3'],
    [138000000, 140300000, 'q27.1'], [140300000, 142100000, 'q27.2'], [142100000, 147100000, 'q27.3'],
    [147100000, 155270560, 'q28']],
  'Y': [[0, 2500000, 'p11.32'], [2500000, 3000000, 'p11.31'], [3000000, 11600000, 'p11.2'],
    [11600000, 12500000, 'p11.1'], [12500000, 13400000, 'q11.1'], [13400000, 15100000, 'q11.21'],
    [15100000, 19800000, 'q11.221'], [19800000, 22100000, 'q11.222'], [22100000, 26200000, 'q11.223'],
    [26200000, 28800000, 'q11.23'], [28800000, 59373566, 'q12']]
}

var logger = fs.createWriteStream('mock-snp-data.txt', {
  flags: 'a' // 'a' means appending (old data will be preserved)
})

var EOL = os.EOL

nLines = 800000

logger.write('[Header]' + EOL)
logger.write('GSGT Version	1.x.x' + EOL)
logger.write('Processing Date	01/01/2019' + EOL)
logger.write('Content		HumanOmniExpress-12v1-Multi_H.bpm' + EOL)
logger.write('Num SNPs	800000' + EOL)
logger.write('Total SNPs	800000' + EOL)
logger.write('Num Samples	1' + EOL)
logger.write('Total Samples	1' + EOL)
logger.write('[Data]' + EOL)
logger.write('SNP Name'+ '\t' +	'Sample ID' + '\t' + 'Chr' + '\t' + 'Position'  + '\t' + 'Log R Ratio' + '\t' + 'B Allele Freq' + EOL)

var randomInt = function(max) {
	return Math.floor(Math.random() * Math.floor(max))
}

var semiRandomBAF = function() {
	bafCat = randomInt(3)
	if(bafCat === 0) {
		return Math.random() / 5
	}
	if(bafCat === 1) {
		return (Math.random() / 5) + 0.8
	}
	if(bafCat === 2) {
		return (Math.random()) / 5 + 0.25
	}
	if(bafCat === 3) {
		return (Math.random()) / 5 + 0.5
	}
}

var positionInChrom = function(chr) {
	var maxPosChr = chromosomeData[chr][randomInt((chromosomeData[chr].length))][1]
	return randomInt(maxPosChr)
}

for (var i = 0; i < nLines; i++) {
	snpName = 'name'
	sampleId = 'sampleId'
	chrNr = randomInt(23) + 1
	chr = chrNr === 23 ? 'X' : chrNr
	position = positionInChrom(chr)
	logR = 0.0
	baf = semiRandomBAF()

	logger.write(snpName + '\t' + sampleId + '\t' + chr + '\t' + position  + '\t' + logR  + '\t' + baf + EOL)

}
logger.end()