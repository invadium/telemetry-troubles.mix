const EMPTY_CH = '.'

function padLeft(str, len, c) {
    if (str.length >= len) return str
    const ch = c || ' '

    const prefix = []
    for (let i = len - str.length; i > 0; i--) {
        prefix.push(ch)
    }

    return prefix.join('') + str
}

function toHexString(n, padding) {
    return n.toString(16).padStart(padding || 1, '0').toUpperCase()
}

function toCodeString(v, padding) {
    if (v === undefined) return padLeft('', padding, EMPTY_CH)
    if (isNum(v)) return padLeft(toHexString(v, 2), padding, EMPTY_CH)
    return v
}
