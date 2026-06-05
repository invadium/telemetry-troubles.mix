const Pod = require('/mod/mc/dna/ops/pod/Pod')

class TapeRecorder extends Pod {

    constructor(st) {
        super( augment({
            name: 'TapeRecorder',
        }, st) )
    }

}
