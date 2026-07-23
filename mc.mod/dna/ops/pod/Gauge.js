const Pod = require('/mod/mc/dna/ops/pod/Pod')

class Gauge extends Pod {

    constructor(st) {
        super( extend({
            type:   'gauge',
            level:   0,
            target:  0,
            speed:  .25,
            psize:   2,
        }, st) )
    }

    evo(dt) {
        if (this.level === this.target) return

        // adjust to the target level
        if (this.level < this.target) {
            this.level += this.speed * dt
            if (this.level >= this.target) this.level = this.target
        } else if (this.level > this.target) {
            this.level -= this.speed * dt
            if (this.level <= this.target) this.level = this.target
        }
    }
}
