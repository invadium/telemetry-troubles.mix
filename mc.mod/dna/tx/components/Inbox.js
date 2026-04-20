const ScrollablePanel = require('/mod/mc/dna/tx/components/ScrollablePanel')

class Inbox extends ScrollablePanel {

    constructor(st) {
        super( augment({
            name:  'inbox',

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

        }, st) )

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

    contentLength() {
        return this.imap.messages.length
    }

    open(pos) {
        const message = this.imap.messages[pos]
        // console.dir(message)
        log(message.subject)
        log(message.content)
        message.read = true
        // TODO hide inbox, show email content
    }

    draw() {
        const txt = this.tx
        const { x, y, w, h, stackPointer } = this
        // messages
        const messages = this.imap.messages,
              NMSG     = messages.length,
              UNREAD   = messages.reduce((acc, cur) => cur.read? acc : acc + 1, 0)
        this.title.label = ` ${env.text.email.inbox}(*${UNREAD}/${NMSG}) `

        let by = y
        this.background()

        // precalc column dimensions
        const x1 = x,
              w2 = 6,
              w1 = w - w2 - 1,
              x2 = x1 + w1 + 1

        txt.back(lib.cidx('base'))
           .face(lib.cidx('alert'))

        // === column titles ===
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

}
