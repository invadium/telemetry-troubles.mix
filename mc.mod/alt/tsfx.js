const last = {}

function tsfx(effect, ban) {
    if (!effect) return
    ban = ban || 0

    const lastTime = last[effect]
    if (!lastTime || env.time > lastTime + ban) {
        $.lib.sfx(effect)
        last[effect] = env.time
    }
}
tsfx.last = last
