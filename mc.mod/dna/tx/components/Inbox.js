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
                        day:     10.1,
                        subject: 'One',
                        body: 'some data here',
                    },
                    {
                        day:     11.2,
                        subject: 'Two',
                        body: 'some data here as well',
                    },
                    {
                        day:     21.2,
                        subject: 'Many',
                        body: 'no data',
                    },
                ],
            },
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
        const { x, y, w, h } = this

        let by = y

        // === title ===
        this.hseparator(x, y, w, '=')
        // TODO figure how many unread and total
        const title = `   ${env.text.email.inbox}(*2/10)   `
        this.centerText(x + .5 * w, by, title)

        // === column titles ===

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
