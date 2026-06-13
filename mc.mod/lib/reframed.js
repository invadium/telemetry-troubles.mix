const NORMAL    = 0,
      PREFORMAT = 1

function isWhitespace(c) {
    return (c === ' ' || c === '\t')
}

function isLineFeed(c) {
    return (c === '\r' || c === '\n')
}

function nonEmpty(c) {
    return (!isWhitespace(c) && !isLineFeed(c))
}
      
function parse(src, LW) {
    const seg = [],
          t   = src.split(''),
          N   = t.length

    let at       = 0,
        line     = 0,
        linePos  = 0,
        mode     = NORMAL

    function more() {
        return (at < N)
    }

    function aheadc() {
        return t[at]
    }

    function getc() {
        const c = t[at++]
        if ((c === '\r' && t[at] !== '\n') || c === '\n') {
            line++
            linePos = 0
        } else {
            linePos++
        }
        return c
    }

    function skipc() {
        getc()
    }

    // skip the current character and return the next one without eating it
    function skipAheadc() {
        getc()
        return t[at]
    }

    /*
    function retc() {
        if (at === 0) throw new Error('Nothing to return!')
        linePos-- // ???? MUST be more reliable
        at--
    }
    */

    function skipWhitespaces() {
        let c = aheadc(),
            i = 0

        while(isWhitespace(c)) {
            c = skipAheadc()
            i++
        }

        return i
    }

    function skipLineFeed() {
        const c = aheadc()
        if (c === '\r') {
            const n = skipAheadc()
            if (n === '\n') skipc()
            return true
        }
        if (c === '\n') {
            skipc()
            return true
        }
        return false
    }

    function nextEmptyLine() {
        let c = aheadc()
    }

    function nextLine() {
        if (!more()) return

        const w = []

        let c = aheadc()
        while(c && !isLineFeed(c)) {
            w.push(c)
            skipc()
            if (w.length >= LW) {
                // TODO the mode will be lost on next words! preserve till the actual CRLF?
                return {
                    type:  2, // the line
                    chars: w,
                }
            }

            c = aheadc()
        }

        return {
            type:  2,
            chars: w,
        }
    }

    function nextWord() {
        if (linePos === 0 && skipWhitespaces() > 0) {
            // preformatted line
            return nextLine()
        } else {
            skipWhitespaces()
        }
        if (!more()) return

        const w = []
        let c = aheadc()

        while(c && nonEmpty(c)) {
            w.push(c)
            skipc()
            if (w.length >= LW) {
                return {
                    type:  2, // the line
                    chars: w,
                }
            }

            c = aheadc()
        }

        return {
            type:  1,
            chars: w,
        }
    }

    function nextSegment() {
        if (mode === NORMAL) {
            const lp = linePos
            if (skipLineFeed() && lp === 0) {
                // empty line segment
                return {
                    type: 0,
                    text: '\n',
                }
            }

            return nextWord()
        } else if (mode === PREFORMAT) {
            return nextSpan()
        }
    }

    function resolveSegment(sg) {
        if (sg.chars
                && sg.chars[0] === '$'
                && sg.chars[1] === '['
                && sg.chars[sg.chars.length - 1] === ']') {
            log('^^^^^^^^ resolve the data link: ' + sg.text)
        }
        return sg
    }

    function normalizeSegment(sg) {
        if (sg.chars) {
            sg.text = sg.chars.join('')
            sg.len  = sg.chars.length
        }
        return resolveSegment(sg)
    }

    let sg = nextSegment()
    while(sg) {
        seg.push( normalizeSegment(sg) )
        sg = nextSegment()
    }

    return seg
}

function format(segments, w) {
    const lines = []

    let cur  = 0,
        line = ''
    for (let i = 0; i < segments.length; i++) {
        const seg = segments[i]
        if (seg.type === 0 || seg.type === 2) {
            if (cur > 0) {
                cur = 0
                lines.push(line)
                line = ''
            }
            if (seg.type === 2) lines.push(seg.text)
            else lines.push('')
        } else if (cur === 0) {
            cur += seg.len
            line += seg.text
        } else {
            if (cur + 1 + seg.len < w) {
                cur += seg.len + 1
                line += ' '
                line += seg.text
            } else {
                lines.push(line)
                // start a new line with current segment
                cur = seg.len
                line = seg.text
            }
        }
    }
    if (cur > 0) {
        lines.push(line)
    }

    return lines
}
