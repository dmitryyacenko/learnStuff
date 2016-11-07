const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function countSize(obj) {
    var d=0;
    for(var k in obj){
        if(obj.hasOwnProperty(k)){
            d+=obj[k].toString(2).length;
        }
    }
    return d;
}
var LZW = {
        compress: function (uncompressed) {
            "use strict";
            // Build the dictionary.
            var i,
                dictionary = {},
                c,
                wc,
                w = "",
                result = [],
                dictSize = 256;
            console.log('Create initial dictionary')
            for (i = 0; i < 256; i += 1) {
                dictionary[String.fromCharCode(i)] = i;
                console.log(i+'\t'+String.fromCharCode(i)+'\t'+i+'\t'+countSize(dictionary));
            }
            console.log('Compress data')
            for (i = 0; i < uncompressed.length; i += 1) {

                c = uncompressed.charAt(i);
                wc = w + c;
                if (dictionary.hasOwnProperty(wc)) {
                    console.log(i+256+'\t'+wc+'\t'+dictionary[wc]+'\t'+countSize(dictionary)+'\t o')
                    w = wc;
                } else {
                    result.push(dictionary[w]);
                    dictionary[wc] = dictSize++;
                    console.log(i+256+'\t'+wc+'\t'+dictSize+'\t'+countSize(dictionary))
                    w = String(c);
                }
            }
            // Output the code for w.
            if (w !== "") {
                result.push(dictionary[w]);
            }
            return result;
        },


        decompress: function (compressed) {
            "use strict";
            // Build the dictionary.
            var i,
                dictionary = [],
                w,
                result,
                k,
                entry = "",
                dictSize = 256;
            for (i = 0; i < 256; i += 1) {
                dictionary[i] = String.fromCharCode(i);
            }

            w = String.fromCharCode(compressed[0]);
            result = w;
            for (i = 1; i < compressed.length; i += 1) {
                k = compressed[i];
                if (dictionary[k]) {
                    entry = dictionary[k];
                } else {
                    if (k === dictSize) {
                        entry = w + w.charAt(0);
                    } else {
                        return null;
                    }
                }

                result += entry;

                // Add w+entry[0] to the dictionary.
                dictionary[dictSize++] = w + entry.charAt(0);

                w = entry;
            }
            return result;
        }
    }



var ask=function(){
    rl.question('Which string I should compress?\n', (answer) => {
        comp = LZW.compress(answer);
        decomp = LZW.decompress(comp);
        console.log('Input string:%s', answer);
        console.log('Compressed string:%s', String.fromCharCode(...comp));
        console.log('Decompressed string:%s', decomp);
        console.log('Compress efficiency: %d%', 100-(String.fromCharCode(...comp).length*100/answer.length));
        console.log(answer==decomp?'Strings are equal':'strings are not equal');
        ask();
    });
}
ask();

