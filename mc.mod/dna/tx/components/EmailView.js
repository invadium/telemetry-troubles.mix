const ScrollablePanel = require('/mod/mc/dna/tx/components/ScrollablePanel')


class EmailView extends ScrollablePanel {

    constructor(st) {
        super( augment({
            name: 'emailView',

            header: 0,
            margins: {
                north: 1,
                east:  0,
                south: 0,
                west:  1,
            },

            spans: [],
        }, st) )
        this.inbox.view = this
    }

    show() {
        this.hidden = false
        this.__.adjust()
        this.title.show()
        this.scrollBar.show()
    }

    hide() {
        if (this.envelope) {
            this.envelope.pos = this.stackPointer
        }
        this.title.hide()
        this.scrollBar.hide()
        this.hidden = true
        this.__.adjust()
    }

    contentLength() {
        return this.spans.length
    }

    setText(text) {
        this.text = text.split('\n')
    }

    setEmail(envelope) {
        this.envelope = envelope
        this.spans = envelope.spans
        this.message = envelope.message
        this.title.label = envelope.label
        this.stackPointer = envelope.pos
    }

    formatEnvelope(e) {
        const w = this.w

        if (!e.segments) {
            e.segments = lib.reframed.parse(e.message.content, w, job.data.resolver)
            dir(e.segments)
        }
        e.spans = lib.reframed.formatSegments(e.segments, w)
        dir(e.spans)

        // @deprecated simple legacy split
        // e.spans = e.message.content.split('\n') // TODO adjust the content and mark the plumbing points
    }

    openEmail(message) {
        const _       = this
        const display = _._display
        const itabs   = display.bevel.countTabs()

        if (itabs >= 4) {
            // TODO ignore open request until we'll find an acceptable solution for many tabs
            // TODO make a negative feedback effect (shake?, blink red?)
            // TODO play 'deny' sfx
            return
        }

        // create the message container
        // TODO a way to determine the proper tag for each message
        const tag = message.read? ' ' : '*'
        const envelope = {
            message:  message,
            label:   `[${tag}]${message.from}: ${message.subject}`,
            // spans :    message.content.split('\n'), // TODO adjust the content and mark the plumbing points
            pos:      0,
        }

        this.formatEnvelope(envelope)

        // create a new tab and setup display state with the message
        const nextTab = display.bevel.spawnTab({
            title: 'Msg' + itabs,
            displayState: {
                activate: function() {
                    _.setEmail( envelope )
                    _.show()
                },
                deactivate: function() {
                    _.hide()
                },
            }
        })
        nextTab.display()
        // this.inbox.hide()
        // this.show()
    }

    open(line, tx, ty, e) {
        // TODO do Plan9-like plumbing over the email text to follow links and execute commands
        // determine the span
        const spans = this.spans
        let target
        for (let i = 0; i < spans.length; i++) {
            const span = spans[i]
            if (span.text && span.line === line && span.at < tx) target = span
        }

        if (target) {
            dir(target)
            log(`TODO plumbing #${line}: ${target.text}`)
        }
    }

    close() {
        this.hide()
        this.inbox.show()
    }

    draw() {
        const { x, y, w, h, stackPointer, spans, message } = this
        const txt = this.tx

        this.background()
        if (!spans) return

        const w1 = w

        let cy   = -1,
            ll   = -1,
            cx   =  x,
            ww   =  0,
            back =  cidx.base,
            face =  cidx.alert
        /*
        txt.back(cidx.base)
           .face(cidx.alert)
        // subject
        this.clipText(message.subject, x1, by, w1)

        // content separator
        by++
        this.hseparator(x1, by, w1)
        by++
        */

        for (let i = 0; i < spans.length && cy < h; i++) {
            const span = spans[i]
            if (span.line < stackPointer) continue

            if (ll < span.line) {
                cy ++
                ll = span.line
            }

            switch(span.type) {
                case spans.STRONG:
                    face = cidx.base
                    back = cidx.alert
                    break
                case spans.UNSTRONG:
                    back = cidx.base
                    face = cidx.alert
                    break
                case spans.LINK:
                    face = cidx.base
                    back = cidx.alert
                    break
                case spans.UNLINK:
                    back = cidx.base
                    face = cidx.alert
                    break
            }

            if (span.type <= spans.SPACE) {
                // regular text
                txt.back(back)
                   .face(face)

                cx = span.at
                ww = w1 - cx
                this.clipText(span.text, cx, y + cy, w1)
            }
        }
    }
}
