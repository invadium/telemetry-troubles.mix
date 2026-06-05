const Pod = require('/mod/mc/dna/ops/pod/Pod')

class Magnetometer extends Pod {

    constructor(st) {
        super( augment({
            name: 'magnetometer',
        }, st) )
    }

}
