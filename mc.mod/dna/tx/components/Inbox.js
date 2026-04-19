const Panel = require('/mod/mc/dna/tx/components/Panel')

class Inbox extends Panel {

    constructor(st) {
        super( augment({
            name:  'inbox',
            x:      0,
            y:      0,
            w:      0,
            h:      0,
            margin: 2,

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

    adjust() {
        // TODO adjust to leave the space for control buttons
        if (this.port) {
            this.x = this.port.x
            this.y = this.port.y
            this.w = this.port.w
            this.h = this.port.h
        } else {
            const m = this.margin
            this.x = m
            this.y = m
            this.w = this.__.tw - 2*m
            this.h = this.__.th - 2*m
        }
    }

    lx(ux) {
        return ux - this.x
    }

    ly(uy) {
        return uy - this.y
    }

    gx(lx) {
        return lx + this.x
    }

    gy(ly) {
        return ly + this.y
    }

    selectionCapacity() {
        return this.h - 5
    }

    select(tx, ty) {
        const { x, y, w, h } = this
        if (tx < x + 1 || tx >= x + w - 1 || ty < 4 || ty >= y + h - 3) {
            this.selection = -1
        } else {
            this.selection = ty - 4
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
        log('^SP: ' + this.stackPointer)
    }

    scrollDown() {
        const messages     = this.imap.messages,
              stackPointer = this.stackPointer
        // TODO adjust to the screen capacity
        if (stackPointer < messages.length - this.selectionCapacity() - 1) this.stackPointer ++
        log('vSP: ' + this.stackPointer)
    }

    draw() {
        const txt = this.tx
        const { x, y, w, h, stackPointer } = this
        // messages
        const messages = this.imap.messages,
              NMSG     = messages.length,
              UNREAD   = messages.reduce((acc, cur) => cur.read? acc : acc + 1, 0)

        let by = y

        // === title ===
        this.hseparator(x, y, w, '=')
        // TODO figure how many unread and total
        const title = `   ${env.text.email.inbox}(*${UNREAD}/${NMSG})   `
        this.centerText(title, x + .5 * w, by)

        // precalc column dimensions
        const x1 = x + 1,
              w2 = 6,
              w1 = w - w2 - 3,
              x2 = x1 + w1 + 1

        // === column titles ===
        by += 2
        this.clipText('Subject', x1, by, w1)
        this.clipText('Day',     x2, by, w2)
        txt.put(x1 + w1, by, '|')

        // content separator
        by++
        this.hseparator(x1, by, w1 + w2 + 1)

        // messages
        by++
        let selectionPos = 0
        for (let i = NMSG - 1 - stackPointer; i >= 0 && by < y+h-1; i--, by++, selectionPos++) {
            const msg   = messages[i],
                  stime = lib.time.toFixedString(msg.time, w2)
            let subject = msg.read? msg.subject : `*${msg.subject}`
            if (selectionPos === this.selection) subject = `[${subject}]`

            this.clipText(subject, x1, by, w1)
            this.clipText(stime,   x2, by, w2)
            txt.put(x1 + w1, by, '|')
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
