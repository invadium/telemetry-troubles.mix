const Pod = require('/mod/mc/dna/ops/pod/Pod')

class Battery extends Pod {

    constructor(st) {
        super( augment({
            name: 'battery',
        }, st) )
    }

}
