const Panel = require('/mod/mc/dna/tx/components/Panel')

class Inbox extends Panel {

    constructor(st) {
        super( augment({
            name: 'inbox',
            x:     0,
            y:     0,
            w:     0,
            h:     0,

            imap: {
                messages: [
                    {
                        read:     false,
                        time:     1.1,
                        subject: 'One',
                        body:    'some data here',
                    },
                    {
                        read:     false,
                        time:     11.4,
                        subject: 'Two',
                        body: 'some data here as well',
                    },
                    {
                        read:     true,
                        time:     271.9,
                        subject: 'Many',
                        body: 'no data',
                    },
                ],
            },

            stackPointer: 0,
        }) )
    }

    adjust() {
        // TODO adjust to leave the space for control buttons
        if (this.port) {
            this.x = this.port.x
            this.y = this.port.y
            this.w = this.port.w
            this.h = this.port.h
        } else {
            this.x = 1
            this.y = 1
            this.w = this.__.tw - 2
            this.h = this.__.th - 2
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
        const x1 = 2,
              w1 = 7,
              x2 = x1 + 9,
              w2 = w - w1 - 3
        // === column titles ===
        by += 2
        this.clipText('Day', x1, by, w1)
        this.clipText('Subject', x2, by, w2)
        txt.put(x1 + w1, by, '|')

        // content separator
        by++
        this.hseparator(x1, by, w1 + w2 + 1)

        // messages
        by++
        for (let i = NMSG - 1 - stackPointer; i >= 0 && by < h-1; i--, by++) {
            const msg   = messages[i],
                  stime = lib.time.toString(msg.time)

            this.clipText(stime, x1, by, w1)
            this.clipText(msg.subject, x2, by, w2)
            txt.put(x1 + w1, by, '|')
        }
        if (by < h-1) {
            this.hseparator(x1, by, w1 + w2 + 1)
        }

        this.rect(x, y + 1, w, h - 1)
    }


    onMouseDown(tx, ty, b, e) {
        log(`mouse #${e.button + 1} down: ${tx}:${ty}`)
    }

    onMouseUp(tx, ty, b, e) {
        log(`mouse #${e.button + 1} up: ${tx}:${ty}`)
    }

    onMouseMove(tx, ty, e) {
        // log(`mouse move: ${tx}:${ty}`)
    }

    onMouseEnter() {
        // log('menu: the mouse is in!')
    }

    onMouseExit() {
        // log('menu: the mouse is out!')
    }

}
