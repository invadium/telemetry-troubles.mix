const Panel = require('/mod/mc/dna/mode/components/Panel')

const df = {
    x: 0,
    y: 0,
    w: 10,
    h: 10,
    text: [],
}

class TextView extends Panel {
    constructor(st) {
        super( augment({}, df, st) )
    }

    draw() {
        const tx = this.__
        tx.back(lib.cidx('base'))
            .face(lib.cidx('alert'))

        const w = tx.tw
        const header = 5
        const margin = floor(w * .2)
        let x = margin
        let y = header

        function nextLine() {
            y++
            x = margin
        }

        function println(line) {
            const words = line.split(' ')
            for (let i = 0; i < words.length; i++) {
                const word = words[i]
                if (x + word.length > w - margin) {
                    nextLine()
                }
                tx.at(x, y).print(word)
                x += word.length + 1
            }
            nextLine()
            y++
        }

        this.text.forEach(line => {
            println(line)
        })
    }

    setText(text) {
        this.text = text.split('\n')
    }
}
