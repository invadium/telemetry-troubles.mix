class BlackBox {

    constructor(st) {
        extend(this, {
            name: 'blackBox',

            tape: [],
        }, st)
    }

    record(packet) {
        this.tape.push(packet)
    }

}
