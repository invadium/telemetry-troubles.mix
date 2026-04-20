const ScrollablePanel = require('/mod/mc/dna/tx/components/ScrollablePanel')

class EmailView extends ScrollablePanel {

    constructor(st) {
        super( augment({
            name: 'emailView',

            header: 0,
            margins: {
                north: 1,
                east:  0,
                south: 1,
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

    showEmail(message) {
        this.message = message
        this.title.label = message.subject
        this.lines = message.content.split('\n') // TODO adjust the content and mark the plumbing points
        this.inbox.hide()
        this.show()
    }

    open(at) {
        // TODO do Plan9-like plumbing over the email text to follow links and execute commands
        log(`plumbing #${at}: ${this.lines[at]}`)
    }

    draw() {
        const { x, y, w, h, stackPointer, lines, message } = this
        const txt = this.tx

        this.background()
        if (!lines) return

        let by = y
        const x1 = x
        const w1 = w
        txt.back(lib.cidx('base'))
           .face(lib.cidx('alert'))

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
            txt.back(lib.cidx('base'))
               .face(lib.cidx('alert'))

            this.clipText(line, x1, by, w1)
        }
    }

}
