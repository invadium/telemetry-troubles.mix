let id = 0

class CentralMessage {

    constructor(st) {
        augment(this, {
            name: 'centralMessage' + (++id),
            label: '',

            x: 0,
            y: 0,
            w: 0,
            h: 0,
        }, st)
    }

    adjust() {
        const tx = this.__
        const W = tx.tw
        const H = tx.th
        const len = this.label.length

        this.x = ceil(W/2 - len/2)
        this.y = floor(H/2)
        this.w = len
        this.h = 1
    }

    draw() {
        const tx = this.__
        const w = tx.tw
        const h = tx.th
        const len = this.label.length

        tx
            .back(lib.cidx('baseHi'))
            .face(lib.cidx('alert'))
            .at(ceil(w/2 - len/2), floor(h/2))
            .mode(1).set({
                period: .5,
            })
            .print(this.label)
    }
}

