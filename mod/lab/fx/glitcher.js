function init() {
    extend(this, {
        short: {
            bias:       .1,
            threshold: .6,
        },
        long: {
            bias:       10,
            threshold: .48,
        },
        shift: {
            fq:        .7,
            short:      0,
            long:       0,
        },
    })
}

function evo(dt) {
    const { short, long, shift } = this

    const v = .5 * (lib.ken.pnoise(env.time * shift.fq, 0, 1) + 1)
    shift.val0 = v
    shift.val1 = clamp(v - (1 - short.threshold), 0, 1) * short.bias
    shift.val2 = clamp(v - (1 - long.threshold), 0, 1)  * long.bias
}
