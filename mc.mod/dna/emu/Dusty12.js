class Dusty12 {

    constructor(st) {
        augment(this, {
            name:  'dusty',
            model: 'DUSTY-12',

            snap:   [], // memory snapshots
            core:   [], // core memory - consists of packaged capsules
            dstack: [], // data stack
            xstack: [], // execution (return) stack
        }, st)
        this.defineOps()
        this.spy.clearSnapshots()
        this.op('REST')
    }

    defineOps() {
        const _      = this,
              snap   = _.snap,
              core   = _.core,
              dstack = _.dstack,
              xstack = _.xstack
        let capsule = null

        // limits
        const CAPSULES = 4,
              CAPACITY = 128,
              DSCAP = 64,
              XSCAP = 64

        let MODE =  0,
            PC   = -1,  // program counter - points to the next instruction to execute
            CAP  =  0,  // current capsule
            DSP  =  0,  // data stack pointer
            XSP  =  0   // execution stack pointer

        function reset() {
            PC  = 0
            CAP = 0
            DSP = 0
            XSP = 0

            // prefill memory
            core.capacity = 0
            for (let i = 0; i < CAPSULES; i++) {
                const capsule = core[i] = []
                for (let j = 0; j < CAPACITY; j++) {
                    capsule[j] = null
                }
                capsule.capacity = CAPACITY
                core.capacity += CAPACITY
            }
            capsule = core[CAP]
        }

        function clearSnapshots() {
            snap.capacity = 0
            for (let i = 0; i < CAPSULES; i++) {
                const capSnap = snap[i] = []
                for (let j = 0; j < CAPACITY; j++) {
                    capSnap[j] = null
                }
                capSnap.capacity = CAPACITY
                snap.capacity += CAPACITY
            }
        }

        function pop() {
            if (DSP <= 0) throw new Error('Empty stack!')
            return dstack[--DSP]
        }

        function push(val) {
            if (DSP >= DSCAP) throw new Error('Data stack overflow!')
            dstack[DSP++] = val
        }

        const ops = _.ops = [
            {
                name: 'NOP',
                fn: () => {},
                effect: '( -- )',
                info: 'skip the operation and do nothing this cycle'
            },
            {
                name: 'ADD',
                fn: () => {
                    push( pop() + pop() )
                },
                effect: '(i1 i2 -- ir1)',
                info: 'add two values at the top of the data stack'
            },

            {
                name: 'HALT',
            },
            {
                name: 'REST',
                fn: reset,
                effect: '(... -- empty memory and stacks, zeroed registers)',
                info: 'reset the VM',
            }
        ]

        const mnemonics = this.mnemonics = {}
        const actions   = this.actions   = {}
        ops.forEach((op, i) => {
            op.id = i
            mnemonics[op.name] = op
            actions[op.name] = op.fn
        })

        function cycle() {
            while(true) {
                const code = capsule[PC++]
                if (!code) {
                    return
                } else if (isNum(code)) {
                    push(code)
                } else {
                    const op = actions[code]
                    if (!op) throw new Error(`Unknown operation: [${code}]`)
                    op()
                }
            }
        }

        _.eval = function() {
            cycle()

            log('=== completed ===')
            dir(_.spy.state())
        }

        // step through
        _.step = function() {
        }

        _.spy = {
            PC: () => {
                return PC
            },
            CAP: () => {
                return CAP
            },
            state: () => {
                return {
                    CAPSULES, CAPACITY, DSCAP, XSCAP,
                    MODE, PC, CAP, DSP, XSP,
                    core, capsule, dstack, xstack,
                }
            },
            clearSnapshots,
        }
    }

    compile() {
        const { snap, core } = this

        for (let icapsule = 0; icapsule < snap.length; icapsule++) {
            const capSnap = snap[icapsule],
                  capsule = core[icapsule]
            for (let p = 0; p < capSnap.length; p++) {
                capsule[p] = capSnap[p]
            }
        }
    }

    flush(src) {
        const ops = src
            .split('\n')
            .map(e => e.trim())
            .filter(e => !e.startsWith('--'))
            .map(e => e.split('--')[0])
            .map(e => e.trim())
            .filter(e => e)
            .map(e => e.toUpperCase())
            .map(e => {
                if (e.charAt(0) === '0') return parseInt(e, 16)
                else return e
            })

        const capSnap = this.snap[0] // TODO how to flush other capsules?
                                     //      is it only current? 
                                     //      is it selected in source?
        // clear the capsule snapshot
        for (let i = 0; i < capSnap.capacity; i++) {
            capSnap[i] = null
        }
        // set the capsule cells
        for (let i = 0; i < ops.length; i++) {
            capSnap[i] = ops[i]
        }
    }

    op(name) {
        name = name.toUpperCase()
        const op = this.mnemonics[name]
        if (!op) throw new Error(`Unknown operation: [${name}]`)

        op.fn()
    }

    upload() {
        this.op('REST')
        this.compile()
        this.eval()
    }

    evo(st) {
        // TODO follow the current execution MODE (paused, stepping, slowRun, fastRun)
    }

    capsuleSnap(icapsule) {
        return this.snap[icapsule]
    }
}
