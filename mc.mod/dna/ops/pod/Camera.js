const Pod = require('/mod/mc/dna/ops/pod/Pod')

class Camera extends Pod {

    constructor(st) {
        super( augment({
            name: 'camera',
        }, st) )
    }

}
