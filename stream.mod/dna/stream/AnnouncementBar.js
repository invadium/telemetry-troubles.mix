const Segment = require('dna/stream/Segment')

function parseMessage(msg, __) {
        // TODO parse the message here
        //      *bold*
        //      _underscore_
        //      ~wobbling text~
        //      ^blinking^

    // This *message* is _quite_ *_^complex^_* and hard to parse
    const ls = []

    let i = 0,
        bold       = false,
        underscore = false,
        wobble     = false,
        blink      = false,
        escape     = false,
        buf        = [],
        lastSeg    = null

    function captureSegment() {
        if (buf.length === 0) return

        const seg = new Segment({
            msg: buf.join(''),
            bold,  
            underscore,
            wobble,
            blink,
            prev: lastSeg,
        })
        if (lastSeg) lastSeg.next = seg
        ls.push(seg)
        lastSeg = seg

        buf = []
    }

    while( i < msg.length ) {
        const ch = msg.charAt(i++)

        if (escape) {
            buf.push(ch)
            escape = false
        } else {
            switch(ch) {
                case '*':
                    captureSegment()
                    bold = !bold
                    break
                case '_':
                    captureSegment()
                    underscore = !underscore
                    break
                case '~':
                    captureSegment()
                    wobble = !wobble
                    break
                case '%':
                    captureSegment()
                    blink = !blink
                    break
                case '\\':
                    escape = true
                    break
                default:
                    buf.push(ch)
            }
        }
    }
    captureSegment()

    // append the gap
    const gapSeg = new Segment({
        msg:   null,
        prev:  lastSeg,
        next:  null,
        width: __.gap,
    })
    if (lastSeg) lastSeg.next = gapSeg
    ls.push(gapSeg)
    
    return ls
}

class AnnouncementBar {

    constructor(st) {
        augment(this, {
            stick:  'bottom', // top or bottom
            font:   '32px dotrice-regular',
            color:   hsl(.10, .9, .6),
            h:       42,
            adjustY: 4,

            background:  '#00000080',
            scrollSpeed: pb(5),

            message:  '',
            segments: [],
            // cur:      null,
            gap:      256,
        }, st)

    }

    push(msg) {
        const _        = this,
              segments = _.segments

        parseMessage(msg, this).forEach( s => {
            _.pushSegment(s)
        })
    }

    pushSegment(seg) {
        this.segments.push(seg)
        seg.__ = this
    }

    evo(dt) {
        // this.cx -= this.scrollSpeed * dt
        const segments = this.segments

        for (let i = segments.length - 1; i >= 0; i--) {
            segments[i].evo(dt)
        }
    }

    activateAt(at) {
        const segments = this.segments
        if (at >= segments.length) at = 0
        const next = segments[at]

        if (next) next.run()
    }

    draw() {
        const _ = this
        const { color, stick, h, adjustY, segments, cx } = this
        if (!segments) return
        // let cur = this.cur || segments[0]

        for (let i = segments.length - 1; i >= 0; i--) {
            segments[i]._visible = false
        }

        const sy = stick === 'bottom'? ny(1) - h : 0
        const by = sy + .5 * h + adjustY

        if (this.background) {
            fill(this.background)
            rect(0, sy, nx(1), h)
        }

        let bx = 0
        let lastActive = -1
        alignLeft()
        baseMiddle()

        for (let i = 0; i < segments.length; i++) {
            const seg = segments[i]
            if (seg.running) {
                const lx = seg.draw(by)
                if (lx > bx) {
                    bx = lx
                    lastActive = i
                }
            }
        }

        if (bx < nx(1)) {
            this.activateAt(lastActive + 1)
        }
        /*
        let activated
        function runSegments(i) {
            cur = segments[i]
            while(cur && bx < lab.w) {
                if (cur.running) {
                    bx = cur.draw(by)
                } else {
                    if (!activated) {
                        cur.run()
                        activated = cur
                    }
                }

                i++
                cur = segments[i]
                if (bx < 0) {
                    // it is time to select the next lead!
                    if (i >= segments.length) _.cur = segments[0]
                    else _.cur = segments[i]
                }
            }

        }

        const curIndex = segments.indexOf(cur)
        runSegments( curIndex )
        runSegments(0)
        */
    }
}
