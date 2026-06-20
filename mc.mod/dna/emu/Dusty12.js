const HALT = 0
const STEP = 1
const WALK = 2
const RUN  = 3

class Dusty12 {

    constructor(st) {
        augment(this, {
            name:  'dusty',
            model: 'DUSTY-12',

            // snap:   [], // memory snapshots
            core:   [], // core memory - consists of packaged capsules
            dstack: [], // data stack
            xstack: [], // execution (return) stack

            time:       0,
            lastCycle:  0,
            walkSpeed:  1,
            runSpeed:  .25,
            runBatch:   128,

            monitors:   [],

            // expose execution modes
            HALT, STEP, WALK, RUN,
        }, st)
    }

    init() {
        this.defineOps()
        this.spy.formatCore()
        this.op('RST')
    }

    registerMonitor(m) {
        this.monitors.push(m)
    }

    defineOps() {
        const _      = this,
              // snap   = _.snap,
              core   = _.core,
              dstack = _.dstack,
              xstack = _.xstack,
              probe  = _.__
        let capsule = null

        // hard-wired limits
        const CAPSULES = 4,
              CAPACITY = 128,
              DSCAP = 64,
              XSCAP = 64

        // registers
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
        }

        function formatCore() {
            // prefill memory cells
            core.capacity = 0
            for (let i = 0; i < CAPSULES; i++) {
                const capsule = core[i] = []
                for (let j = 0; j < CAPACITY; j++) {
                    capsule[j] = null
                }
                capsule.capacity = CAPACITY
                core.capacity += CAPACITY
            }
            capsule = core[CAP] // select current capsule

            return core.capacity
        }

        /*
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
        function clearCore() {
            core.capacity = 0
            for (let i = 0; i < CAPSULES; i++) {
                const capsule = core[i] = []
                for (let j = 0; j < CAPACITY; j++) {
                    capsule[j] = null
                }
                capsule.capacity = CAPACITY
                core.capacity += CAPACITY
            }
        }
        */

        function peek() {
            if (DSP <= 0) throw new Error('Empty stack!')
            return dstack[DSP - 1]
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
                effect: ' -- ',
                info: 'skip the operation and do nothing this cycle'
            },

            // === STACK OPS ===
            {
                name: 'DROP',
                fn: pop,
                effect: 'x -- ',
                info: 'drop the top value on the stack'
            },
            {
                name: 'DUP',
                fn: () => {
                    push( peek() )
                },
                effect: 'x -- x x',
                info: 'duplicate the top value on the stack'
            },
            {
                name: 'SWAP',
                fn: () => {
                    const y = pop(),
                          x = pop()
                    push(y)
                    push(x)
                },
                effect: 'x y -- y x',
                info: 'swap top two values on stack'
            },
            {
                name: 'ROT',
                fn: () => {
                    const z = pop(),
                          y = pop(),
                          x = pop()
                    push(y)
                    push(z)
                    push(x)
                },
                effect: 'x y z -- y z x',
                info: 'rotate top three values on stack'
            },

            // === MEMORY ACCESS ===
            {
                name: 'POKE',
                fn: () => {
                    const x  = pop(),
                          at = pop()
                    capsule[at] = x
                },
                effect: '@ x -- (memory @ set to x)',
                info: 'set the specified memory location with the value on top of the stack'
            },
            {
                name: 'PEEK',
                fn: () => {
                    const at  = pop()
                    push( capsule[ at ] )
                },
                effect: '@ -- x',
                info: 'read the memory cell at the provided address and place it on top of the data stack'
            },


            // === MATH ===
            {
                name: 'ADD',
                fn: () => {
                    push( pop() + pop() )
                },
                effect: 'x y -- [x+y]',
                info: 'add two values at the top of the data stack'
            },
            {
                name: 'SUB',
                fn: () => {
                    const y = pop(),
                          x = pop()
                    push( x - y )
                },
                effect: 'x y -- [x-y]',
                info: 'subtract the top number on the stack from the previous one'
            },
            {
                name: 'MUL',
                fn: () => {
                    push( pop() * pop() )
                },
                effect: 'x y -- [x*y]',
                info: 'multiply two values at the top of the data stack'
            },
            {
                name: 'DIV',
                fn: () => {
                    const y = pop(),
                          x = pop()
                    push( x/y )
                },
                effect: 'x y -- [x/y]',
                info: 'divide'
            },
            {
                name: 'MOD',
                fn: () => {
                    const y = pop(),
                          x = pop()
                    push( x%y )
                },
                effect: 'x y -- [x%y]',
                info: 'remainder from the division'
            },

            // === COMPARISON ====
            {
                name: 'EQ',
                fn: () => {
                    const y = pop(),
                          x = pop()
                    if ( x === y ) push( 1 )
                    else push( 0 )
                },
                effect: 'x y -- [1|0]',
                info: 'compares the top two values on the data stack and places 1 if equal and 0 if not'
            },
            {
                name: 'NEQ',
                fn: () => {
                    const y = pop(),
                          x = pop()
                    if ( x !== y ) push( 1 )
                    else push( 0 )
                },
                effect: 'x y -- [0|1]',
                info: 'compares the top two values on the data stack and places 0 if equal and 1 if not'
            },
            {
                name: 'LT',
                fn: () => {
                    const y = pop(),
                          x = pop()
                    if ( x < y ) push( 1 )
                    else push( 0 )
                },
                effect: 'x y -- [1|0]',
                info: 'compares the top two values on the data stack and places 1 if less than and 0 otherwise'
            },
            {
                name: 'LTE',
                fn: () => {
                    const y = pop(),
                          x = pop()
                    if ( x <= y ) push( 1 )
                    else push( 0 )
                },
                effect: 'x y -- [1|0]',
                info: 'compares the top two values on the data stack and places 1 if less than or equal and 0 otherwise'
            },
            {
                name: 'GT',
                fn: () => {
                    const y = pop(),
                          x = pop()
                    if ( x > y ) push( 1 )
                    else push( 0 )
                },
                effect: 'x y -- [1|0]',
                info: 'compares the top two values on the data stack and places 1 if greater than and 0 otherwise'
            },
            {
                name: 'GTE',
                fn: () => {
                    const y = pop(),
                          x = pop()
                    if ( x >= y ) push( 1 )
                    else push( 0 )
                },
                effect: 'x y -- [1|0]',
                info: 'compares the top two values on the data stack and places 1 if greater than or equal and 0 otherwise'
            },

            // === LOGICAL OPS ===
            {
                name: 'NOT',
                fn: () => {
                    const x = pop()
                    if ( x === 0 ) push( 1 )
                    else push( 0 )
                },
                effect: 'x -- [1|0]',
                info: 'logical NOT for the top value on the data stack'
            },

            // === FLOW CONTROL ===
            {
                name: 'JMP',
                fn: () => {
                    PC = pop()
                },
                effect: '@ -- ',
                info: 'unconditional jump to the address specified on the data stack'
            },
            {
                name: 'JNZ',
                fn: () => {
                    const at = pop(),
                          x  = pop()
                    if (x !== 0) PC = at
                },
                effect: 'x @ -- ',
                info: 'conditional jump to the address specified on the data stack only if the second value is not zero'
            },

            {
                name: 'OBUS',
                fn: () => {
                    probe.openDataLine( pop() )
                },
                effect: 'x1 -- ',
                info: 'open data bus line to the specified instrument'
            },
            {
                name: 'CBUS',
                fn: () => {
                    probe.closeDataLine( pop() )
                },
                effect: 'x1 -- ',
                info: 'close data bus line to the specified instrument'
            },
            {
                name: 'OPOW',
                fn: () => {
                    probe.openPowerLine( pop() )
                },
                effect: 'x1 -- ',
                info: 'open powerline to the specified instrument'
            },
            {
                name: 'CPOW',
                fn: () => {
                    probe.closePowerLine( pop() )
                },
                effect: 'x1 -- ',
                info: 'close powerline to the specified instrument'
            },

            {
                name: 'HALT',
                fn: () => {
                    _.halt()
                },
                effect: ' -- ',
                info: 'halt execution'
            },
            {
                name: 'RST',
                fn: reset,
                effect: '(... -- empty memory and stacks, zeroed registers)',
                info: 'reset the VM',
            },
        ]

        const mnemonics = this.mnemonics = {}
        const actions   = this.actions   = {}
        ops.forEach((op, i) => {
            op.id = i
            mnemonics[op.name] = op
            actions[op.name] = op.fn
        })

        _.cycle = function cycle(steps) {
            while(steps) {
                const code = capsule[PC++]
                if (code == null) {
                    break
                } else if (isNum(code)) {
                    push(code)
                } else {
                    const op = actions[code]
                    if (!op) throw new Error(`Unknown operation: [${code}]`)
                    op()
                }
                steps--
            }
            _.lastCycle = _.time
            if (steps) {
                _.halt()
            }
        }

        // one step through
        _.step = function() {
            MODE = STEP
            log('STEP')
            cycle(1)
        }

        // walk instructions slowly one-by-one
        _.walk = function() {
            MODE = WALK
            _.lastCycle = _.time
        }

        // run instructions fast
        _.run = function() {
            MODE = RUN
            _.lastCycle = _.time
        }

        _.halt = function() {
            MODE = HALT
            _.monitors.forEach(m => {
                if (isFun(m.onHalt)) m.onHalt()
            })
        }

        _.spy = {
            MODE: () => {
                return MODE
            },
            PC: () => {
                return PC
            },
            CAP: () => {
                return CAP
            },
            DSP: () => {
                return DSP
            },
            XSP: () => {
                return XSP
            },
            state: () => {
                return {
                    CAPSULES, CAPACITY, DSCAP, XSCAP,
                    MODE, PC, CAP, DSP, XSP,
                    core, capsule, dstack, xstack,
                }
            },
            formatCore: () => {
                return formatCore()
            },
        }
    }

    /*
    compile() {
        const { core } = this

        for (let icapsule = 0; icapsule < snap.length; icapsule++) {
            const capSnap = snap[icapsule],
                  capsule = core[icapsule]
            for (let p = 0; p < capSnap.length; p++) {
                capsule[p] = capSnap[p]
            }
        }
    }
    */

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

        const capsule = this.core[0] // TODO how to flush other capsules?
                                     //      is it only current? 
                                     //      is it selected in source?
        // clear the capsule snapshot
        for (let i = 0; i < capsule.capacity; i++) {
            capsule[i] = null
        }
        // set the capsule cells
        for (let i = 0; i < ops.length; i++) {
            capsule[i] = ops[i]
        }

        signal('flush', src)
    }

    op(name) {
        name = name.toUpperCase()
        const op = this.mnemonics[name]
        if (!op) throw new Error(`Unknown operation: [${name}]`)

        op.fn()
    }

    // upload and evaluate 
    upload() {
        this.op('RST')
        // this.compile()
        this.walk()
    }

    evo(dt) {
        this.time += dt
        // TODO follow the current execution MODE (paused, stepping, slowRun, fastRun)
        
        switch(this.spy.MODE()) {
            case WALK:
                if (this.time >= this.lastCycle + this.walkSpeed) {
                    this.cycle(1)
                }
                break
            case RUN:
                if (this.time >= this.lastCycle + this.runSpeed) {
                    this.cycle(this.runBatch)
                }
                break
        }
    }

    capsule(icapsule) {
        return this.core[icapsule]
    }
}
