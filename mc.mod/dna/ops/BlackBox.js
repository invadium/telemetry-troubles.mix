class BlackBox {

    constructor(st) {
        extend(this, {
            name: 'blackBox',

            tape: [],
        }, st)
    }

    record(packet) {
        packet.receivedAt = env.time
        this.tape.push(packet)
    }

}
