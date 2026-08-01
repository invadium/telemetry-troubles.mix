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
        return this.spans.lines
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
            // dir(e.segments)
        }
        e.spans = lib.reframed.formatSegments(e.segments, w)
        // dir(e.spans)
    }

    openEmail(message) {
        const _       = this
        const display = _._display
        const itabs   = display.bevel.countTabs()

        if (itabs >= 4) {
            // TODO ignore open request until we'll find an acceptable solution for many tabs
            // TODO make a negative feedback effect (shake?, blink red?)
            // TODO play 'deny' sfx
            sfx('tab-denied')
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
            },
            onTap: function(e) {
                if (e.buttons & 1) this.target.scrollHome()
                else if (e.buttons & 2) this.target.scrollEnd()
            },
        })
        nextTab.setTarget(this)
        nextTab.display()
        // this.inbox.hide()
        // this.show()
    }

    spanAt(tx, ty) {
        const line = this.stackPointer + this.selection
        if (line < 0 || line >= this.contentLength()) return

        const spans = this.spans

        let target
        for (let i = 0; i < spans.length; i++) {
            const span = spans[i]
            if (span.text && span.line === line && span.at < tx) target = span
        }
        return target
    }

    open(line, tx, ty, e) {
        // TODO do Plan9-like plumbing over the email text to follow links and execute commands
        const target = this.spanAt(tx, ty)
        this.openTarget = target
        dir(target)
    }

    onSelect(tx, ty, e) {
        const { x, y, w, h } = this
        if (tx < 0 || tx >= w || ty < this.header || ty >= h) {
            if (this.selectedSpan) {
                this.selectedSpan.over = false
                this.selectedSpan.down = false
            }
        } else {
            const target = this.spanAt(tx, ty)
            if (target) {
                if (this.selectedSpan) this.selectedSpan.over = false
                if (target.link && this.selectedSpan !== target) {
                    sfx('email-selected')
                }
                this.selectedSpan = target

                target.over = true
                if (e.buttons & 1) target.down = true
                else target.down = false
            }
        }
    }

    onMouseUp(tx, ty, b, e) {
        // log(`mouse #${e.button + 1} up: ${tx}:${ty}`)
        this.select(tx, ty, e)

        if (this.openTarget) {
            if (this.openTarget.link) {
                signal('plumb', this.openTarget.link)
            }
            this.openTarget = null
        }
    }

    close() {
        this.hide()
        this.inbox.show()
    }

    draw() {
        const { x, y, w, h, stackPointer, spans, message } = this
        const txt = this.tx

        txt.unsetFlag('strong')
        txt.unsetFlag('underscore')
        this.background()
        if (!spans) return

        const w1 = w

        let cy   = -1,
            ll   = -1,
            cx   =  x,
            ww   =  0,
            back =  cidx.base,
            face =  cidx.alert

        for (let i = 0; i < spans.length && cy < h; i++) {
            const span = spans[i]
            if (span.line < stackPointer) continue

            if (ll < span.line) {
                cy ++
                ll = span.line
            }
            if (cy >= h) break

            switch(span.type) {
                case spans.STRONG:
                    // txt.setFlag('underscore')
                    txt.setFlag('strong')
                    break
                case spans.UNSTRONG:
                    // txt.unsetFlag('underscore')
                    txt.unsetFlag('strong')
                    break
                case spans.LINK:
                    txt.setFlag('underscore')

                    span.over = false
                    span.down = false
                    for (let s of span.spans) {
                        if (s.over) span.over = true
                        if (s.down) span.down = true
                    }
                    if (span.over) {
                        face = cidx.base
                        back = cidx.alert
                    }
                    if (span.down) {
                        txt.setFlag('strong')
                    }
                    break
                case spans.UNLINK:
                    txt.unsetFlag('strong')
                    txt.unsetFlag('underscore')
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
