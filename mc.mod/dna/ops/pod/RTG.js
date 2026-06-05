const Pod = require('/mod/mc/dna/ops/pod/Pod')

class RTG extends Pod {

    constructor(st) {
        super( augment({
            name: 'RTG',
        }, st) )
        this.powerOn()
    }

    powerOn() {
        this.power = true
        this.poweredAt = env.time
    }

    powerOff() {
        // can't be powered off - always on!
    }

}
