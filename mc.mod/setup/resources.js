function resources() {
    const unmapped = env.sfx.unmapped = []
    for( let sample of res.sfx ) {
        if (!sample) continue

        let mapped = false
        for ( let configName in env.sfx ) {
            const config = env.sfx[ configName ]
            if (config && config.res && config.res === sample.name) {
                mapped = true
                break
            }
        }

        if (!mapped) unmapped.push(sample.name)
    }
}
