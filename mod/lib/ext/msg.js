function msg(src) {
    if (!src) return
    const m = {}

    const endOfHeader = src.indexOf('----')
    if (endOfHeader < 0) throw new Error(`Unknown email message format: ${src}`)
    let soc = endOfHeader,
        ch  = src.charAt(soc)

    while((ch === '-' || ch === '\r' || ch === '\n') && soc < src.length) {
        ch = src.charAt(++soc)
    }

    const header = src.substring(0, endOfHeader)
    m.content = src.substring(soc)

    const lines = header.split('\n')
    lines.forEach(line => {
        const pair = line.split(':').map(e => e.trim())
        switch(pair[0]) {
            case 'at':
                m.at = parseFloat(pair[1])
                break
            case 'from':
                m.from = pair[1]
                break
            case 'subject':
                m.subject = pair[1]
                break
        }
    })

    return m
}
