// play a configured sound
//
// Sound effects are configured in /env/sfx
//
module.exports = function(name, vol, pan) {
    if (!env._touched || env.opt.mute || !env.opt.sfx) return // sfx is off

    vol = vol || 1
    vol *= env.opt.sfxVolume

    const sfxConfig = mod.mc.env.sfx
    const container = mod.mc.res.sfx

    let clip = container[name]
    let config = sfxConfig[name]

    if (!config) {
        config = sfxConfig['default']
        log.warn(`missing config for sfx [${name}], using default`)
    } else {
        if (config.res) clip = container[config.res]
    }

    if (config.vol) vol *= config.vol
    if (!clip) {
        clip = container['default']
        vol  = 1
        log.warn(`missing resource for [${name}], using default tone`)
    }

    log(`plaing [${name}] - !${vol}`)
    sys.sfx(clip, vol, pan)
}
