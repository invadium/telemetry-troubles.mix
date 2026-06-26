const NORMAL    = 0,
      PREFORMAT = 1

const EMPTY_LINE = 0,
      LINE       = 1,
      WORD       = 2,
      SEGMENT    = 3,
      SPACE      = 4,
      STRONG     = 5,
      UNSTRONG   = 6,
      LINK       = 7,
      UNLINK     = 8,
      ACTION     = 9

function isWhitespace(c) {
    return (c === ' ' || c === '\t')
}

function isLineFeed(c) {
    return (c === '\r' || c === '\n')
}

function nonEmpty(c) {
    return (!isWhitespace(c) && !isLineFeed(c))
}
      
function parse(src, LW, dataResolver) {
    const seg = [],
          t   = src.split(''),
          N   = t.length

    let at       = 0,
        line     = 0,
        linePos  = 0,
        mode     = NORMAL,
        flag     = {}

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
            /*
            if (w.length >= LW) {
                // TODO the mode will be lost on next words! preserve till the actual CRLF?
                return {
                    type:  LINE, // the line
                    chars: w,
                }
            }
            */

            c = aheadc()
        }

        return {
            type:  LINE,
            chars: w,
        }
    }

    function spanUntil(stopper) {
        if (!more()) return

        const w = []

        let c = aheadc()
        while(c && c != stopper) {
            w.push(c)
            skipc()
            c = aheadc()
        }

        return {
            type:  SEGMENT,
            chars: w,
        }
    }

    function lastOf(type) {
        for (let i = seg.length - 1; i >= 0; i--) {
            const sg = seg[i]
            if (sg.type === type) return sg
        }
    }

    function nextWord() {
        const startedAt = linePos
        const whitespaces = skipWhitespaces()
        if (startedAt === 0 && whitespaces > 0) {
            // preformatted line
            return nextLine()
        }
        if (!more()) return

        const gap = startedAt === 0? 1 : whitespaces
        const w = []
        let c = aheadc()

        function currentWord() {
            return {
                type:  WORD,
                chars: w,
                gap:   gap,
            }
        }

        while(c && nonEmpty(c)) {

            if (flag.escape) {
                flag.escape = false
            } else {
                switch(c) {
                    case '\\':
                        flag.escape = true
                        skipc()
                        c = aheadc()
                        continue
                    case '*':
                        if (w.length > 0) return currentWord()

                        skipc()
                        if (flag.strong) {
                            flag.strong = false
                            return {
                                type: UNSTRONG,
                                mod:  c,
                                gap:   gap,
                            }
                        } else {
                            flag.strong = true
                            return {
                                type: STRONG,
                                mod:  c,
                                gap:   gap,
                            }
                        }
                        break
                    case '[':
                        if (w.length > 0) return currentWord()

                        skipc()
                        flag.link = true
                        return {
                            type: LINK,
                            mod:  c,
                            gap:   gap,
                        }
                        break
                    case '|':
                        if (flag.link) {
                            if (w.length > 0) return currentWord()

                            skipc()
                            const action = spanUntil(']')
                            if (action) {
                                const link = action.chars.join('')
                                const lead = lastOf(LINK)
                                if (lead) {
                                    lead.link = link
                                }
                                return {
                                    type: ACTION,
                                    link: link,
                                    len:  link.length,
                                    mod:  '|',
                                    gap:  gap,
                                }
                            }
                        }
                        break
                    case ']':
                        if (w.length > 0) {
                            return {
                                type:  WORD,
                                chars: w,
                                gap:   gap,
                            }
                        }
                        skipc()
                        flag.link = false
                        return {
                            type: UNLINK,
                            mod:  c,
                            gap:   gap,
                        }
                        break
                }
            }
            w.push(c)
            skipc()
            if (w.length >= LW) {
                return {
                    type:  LINE,
                    chars: w,
                    gap:   gap,
                }
            }

            c = aheadc()
        }

        return {
            type:  WORD,
            chars: w,
            gap:   gap,
        }
    }

    function nextSegment() {
        if (mode === NORMAL) {
            const lp = linePos
            if (skipLineFeed() && lp === 0) {
                // empty line segment
                return {
                    type: EMPTY_LINE,
                    text: '',
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
            const text = sg.text
            const pattern = text.substring(2, text.length - 1)
            let replacement = dataResolver.match(pattern)
            if (replacement !== undefined) {
                replacement = '' + replacement
                sg.text = replacement
                sg.chars = replacement.split('')
                sg.len = sg.text.length
            } else {
                log.warn(`unable to replace ${text}`)
            }
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

function formatSegments(segments, w) {
    const spans = []

    let cur  = 0,
        line = 0,
        text = ''
    for (let i = 0; i < segments.length; i++) {
        const seg = segments[i]

        if (seg.type === EMPTY_LINE || seg.type === LINE) {
            if (cur > 0) {
                // we are in the middle of the previous line, capture it first
                spans.push({
                    at:   cur - text.length,
                    line: line,
                    type: LINE,
                    text: text,
                })
                cur  = 0
                text = ''
                line ++
            }
            spans.push({
                at:   cur,
                line: line,
                type: seg.type,
                text: seg.text,
            })
            line ++
            /*
            if (seg.type === LINE) {
            } else {
                spans.push({
                    at:   cur,
                    line: line,
                    type: seg.type,
                    text: seg.text,
                })
            }
            */
        } else if (seg.type >= STRONG) {
            // a modifier
            if (text.length > 0) {
                // consume existing line as a segment
                spans.push({
                    at:   cur - text.length,
                    line: line,
                    type: SEGMENT,
                    text: text,
                })
                // add space if required
                if (cur < w && seg.gap > 0) {
                    spans.push({
                        at:   cur,
                        line: line,
                        type: SPACE,
                        text: ' ',
                    })
                    cur ++
                }
                text = ''
            }

            if (seg.type === ACTION) {
                for (let i = spans.length - 1; i >= 0; i--) {
                    const span = spans[i]
                    if (span.type === LINK) break
                    else span.link = seg.link
                }
            } else {
                // emit the modifier
                const modifier = ({
                    at:   cur,
                    line: line,
                    gap:  seg.gap,
                    type: seg.type,
                    mod:  seg.mod,
                })
                if (seg.link) modifier.link = seg.link
                spans.push(modifier)
            }

        } else if (cur === 0) {
            cur  += seg.len
            text += seg.text
        } else {
            if (seg.gap > 0 && cur + 1 + seg.len < w) {
                // accumulate current line
                cur  += seg.len + 1
                text += ' '
                text += seg.text
            } else if (cur + seg.len < w) {
                // accumulate current line skipping space
                cur  += seg.len
                text += seg.text
            } else {
                spans.push({
                    at:   cur - text.length,
                    line: line,
                    type: LINE,
                    text: text,
                })
                // start a new line with current segment
                cur  = seg.len
                text = seg.text
                line ++
            }
        }
    }
    if (cur > 0) {
        spans.push({
            at:   cur - text.length,
            line: line,
            type: LINE,
            text: text,
        })
        line ++
    }

    spans.EMPTY_LINE = EMPTY_LINE
    spans.LINE       = LINE
    spans.WORD       = WORD
    spans.SEGMENT    = SEGMENT
    spans.SPACE      = SPACE,
    spans.STRONG     = STRONG
    spans.UNSTRONG   = UNSTRONG
    spans.LINK       = LINK
    spans.UNLINK     = UNLINK
    spans.ACTION     = ACTION

    return spans
}
