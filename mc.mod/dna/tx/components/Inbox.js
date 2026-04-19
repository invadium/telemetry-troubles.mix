const ScrollablePanel = require('/mod/mc/dna/tx/components/ScrollablePanel')

class Inbox extends ScrollablePanel {

    constructor(st) {
        super( augment({
            name:  'inbox',
            x:      0,
            y:      0,
            w:      0,
            h:      0,

            imap: {
                messages: [
                    {
                        read:     false,
                        time:     1.1,
                        subject: 'One',
                        content: 'some data here',
                    },
                    {
                        read:     false,
                        time:     11.4,
                        subject: 'Two',
                        content: 'some data here as well',
                    },
                    {
                        read:     true,
                        time:     271.9,
                        subject: 'Many',
                        content: 'no data',
                    },
                ],
            },

            stackPointer: 0,
        }) )

        for(let i = 0; i < 25; i++) {
            const N = i + 1
            this.imap.messages.push({
                read: false,
                time: i + 4 + i/15,
                subject: 'Message #' + N,
                content: 'Content #' + N,
            })
        }
    }

    selectionCapacity() {
        return this.h - 4
    }

    select(tx, ty) {
        const { x, y, w, h } = this
        if (tx < x || tx >= x + w || ty < 3 || ty >= y + h) {
            this.selection = -1
        } else {
            this.selection = ty - 3
        }
    }

    clearSelection() {
        this.selection = -1
    }

    open(message) {
        // console.dir(message)
        log(message.subject)
        log(message.content)
        message.read = true
    }

    enter(tx, ty) {
        this.select(tx, ty)
        if (this.selection < 0) return

        const messages     = this.imap.messages,
              stackPointer = this.stackPointer
        const pos = messages.length - 1 - stackPointer - this.selection
        if (pos < 0) return

        this.open(messages[pos])
    }

    scrollUp() {
        if (this.stackPointer > 0) this.stackPointer --
    }

    scrollDown() {
        const messages     = this.imap.messages,
              stackPointer = this.stackPointer
        // TODO adjust to the screen capacity
        if (stackPointer < messages.length - this.selectionCapacity() - 1) this.stackPointer ++
    }

    draw() {
        const txt = this.tx
        const { x, y, w, h, stackPointer } = this
        // messages
        const messages = this.imap.messages,
              NMSG     = messages.length,
              UNREAD   = messages.reduce((acc, cur) => cur.read? acc : acc + 1, 0)

        let by = y

        this.background()

        // === title ===
        const TW = w + 1
        txt.back(lib.cidx('alert'))
           .face(lib.cidx('base'))
        this.hseparator(x, y, TW, '=')
        // TODO figure how many unread and total
        const title = `   ${env.text.email.inbox}(*${UNREAD}/${NMSG})   `
        this.centerText(title, x + .5 * TW, by)

        // precalc column dimensions
        const x1 = x,
              w2 = 6,
              w1 = w - w2 - 1,
              x2 = x1 + w1 + 1

        txt.back(lib.cidx('base'))
           .face(lib.cidx('alert'))

        // === column titles ===
        by ++
        this.clipText('Subject', x1, by, w1)
        this.clipText('Day',     x2, by, w2)
        txt.at(x1 + w1, by).out('|')

        // content separator
        by++
        this.hseparator(x1, by, w1 + w2 + 1)

        // messages
        by++
        let selectionPos = 0
        for (let i = NMSG - 1 - stackPointer; i >= 0 && by < y+h; i--, by++, selectionPos++) {
            const msg   = messages[i],
                  stime = lib.time.toFixedString(msg.time, w2),
                  selected = (selectionPos === this.selection)
            let subject = msg.read? msg.subject : `*${msg.subject}`

            if (selected) {
                txt.back(lib.cidx('alert'))
                   .face(lib.cidx('base'))
                // subject = `[${subject}]`
            } else {
                txt.back(lib.cidx('base'))
                   .face(lib.cidx('alert'))
            }

            this.clipText(subject, x1, by, w1)
            this.clipText(stime,   x2, by, w2)
            txt.at(x1 + w1, by).out('|')
        }
        if (by < y+h-1) {
            this.hseparator(x1, by, w1 + w2 + 1)
        }
        // this.rect(x, y + 1, w, h - 1)
    }

    onMouseDown(tx, ty, b, e) {
        // log(`mouse #${e.button + 1} down: ${tx}:${ty}`)
        this.enter(tx, ty)
    }

    onMouseUp(tx, ty, b, e) {
        // log(`mouse #${e.button + 1} up: ${tx}:${ty}`)
    }

    onMouseMove(tx, ty, e) {
        // log(`mouse move: ${tx}:${ty}`)
        this.select(tx, ty)
    }

    onMouseEnter() {
        // log('menu: the mouse is in!')
    }

    onMouseExit() {
        // log('menu: the mouse is out!')
        this.clearSelection()
    }

    onMouseWheel(delta, tx, ty, e) {
        if (delta > 0) this.scrollUp()
        else if (delta < 0) this.scrollDown()
    }
}
