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

            lines: [],
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
        return this.lines.length
    }

    setText(text) {
        this.text = text.split('\n')
    }

    setEmail(envelope) {
        this.envelope = envelope
        this.lines = envelope.lines
        this.message = envelope.message
        this.title.label = envelope.label
        this.stackPointer = envelope.pos
    }

    formatEnvelope(e) {
        const w = this.w

        if (!e.segments) {
            e.segments = lib.reframed.parse(e.message.content, w, job.data.resolver)
            // dir(e.segments)
        }
        e.lines = lib.reframed.format(e.segments, w)
        // dir(e.lines)

        // @deprecated simple legacy split
        // e.lines = e.message.content.split('\n') // TODO adjust the content and mark the plumbing points
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
            // lines:    message.content.split('\n'), // TODO adjust the content and mark the plumbing points
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

    open(at) {
        // TODO do Plan9-like plumbing over the email text to follow links and execute commands
        log(`TODO plumbing #${at}: ${this.lines[at]}`)
    }

    close() {
        this.hide()
        this.inbox.show()
    }

    draw() {
        const { x, y, w, h, stackPointer, lines, message } = this
        const txt = this.tx

        this.background()
        if (!lines) return

        let by = y
        const x1 = x
        const w1 = w
        txt.back(cidx.base)
           .face(cidx.alert)

        /*
        // subject
        this.clipText(message.subject, x1, by, w1)

        // content separator
        by++
        this.hseparator(x1, by, w1)
        by++
        */

        for (let i = stackPointer; i < lines.length && by < y + h; i++, by++) {
            const line = lines[i]

            // regular text
            txt.back(cidx.base)
               .face(cidx.alert)

            this.clipText(line, x1, by, w1)
        }
    }

}
