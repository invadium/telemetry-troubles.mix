const Pod = require('/mod/mc/dna/ops/pod/Pod')

class CosmicRayDetector extends Pod {

    constructor(st) {
        super( augment({
            name: 'cosmicRayDetector',
        }, st) )
    }

}
