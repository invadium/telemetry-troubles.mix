// list of possible text effects
const fx = [
    {
        // no fx
        set: function(fx, tx, i) {},
        evo: function(dt, fx, tx, i) {},
        unset: function(fx, tx, i) {},
    },
    {
        // face <-> back flip fx
        set: function(fx, tx, i) {
            fx.period = 1
            fx.timer = 0
        },
        evo: function(dt, fx, tx, i) {
            let st = 0
            if (fx.timer > fx.period) {
                st = 1
            }
            fx.timer += dt

            if ((st === 0 && fx.timer > fx.period)
                    || fx.timer > 2*fx.period) {

                // swap face and back styles
                const face = tx.buf.face[i]
                const back = tx.buf.back[i]
                tx.buf.face[i] = back
                tx.buf.back[i] = face

                if (st === 1) {
                    fx.timer = 0
                }
            }
        },
    },
    {
        // heat wave
        set: function(fx, tx, i) {
            fx.period = 1
            fx.timer = 0
            fx.color = hsl(.1, .5, 0)
        },
        evo: function(dt, fx, tx, i) {
            fx.timer += dt
            const t = fx.timer % (2*fx.peroid)
            if (t < fx.peroid) fx.color = hsl(.1, .5, t/fx.peroid)
            else fx.color = hsl(.1, .5, 1-t/fx.peroid)
        },
    },
]
