const HALT = 0
const STEP = 1
const WALK = 2
const RUN  = 3
const WAIT = 4

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
            waitTime:   0,
            waitMode:   0,

            monitors:   [],

            // expose execution modes
            HALT, STEP, WALK, RUN, WAIT,
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

        function formatCapsule(i) {
            const icapsule = i ?? CAP
            const capsule = core[icapsule]
            for (let j = 0; j < CAPACITY; j++) {
                capsule[j] = null
            }
        }

        function formatCore() {
            // prefill memory cells
            core.capacity = 0
            for (let i = 0; i < CAPSULES; i++) {
                const capsule = core[i] = []
                formatCapsule(i)
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
                    const at  = pop(),
                           x = pop()
                    capsule[at] = x
                },
                effect: 'x @ -- ',
                info: 'set the memory cell with the specified value'
            },
            {
                name: 'PEEK',
                fn: () => {
                    const at  = pop()
                    push( capsule[ at ] )
                },
                effect: '@ -- x',
                info: 'push on stack the value at the provided address'
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
                info: 'subtract the top number from the previous one'
            },
            {
                name: 'MUL',
                fn: () => {
                    push( pop() * pop() )
                },
                effect: 'x y -- [x*y]',
                info: 'multiply two values'
            },
            {
                name: 'DIV',
                fn: () => {
                    const y = pop(),
                          x = pop()
                    push( x/y )
                },
                effect: 'x y -- [x/y]',
                info: 'divide by the top value'
            },
            {
                name: 'MOD',
                fn: () => {
                    const y = pop(),
                          x = pop()
                    push( x%y )
                },
                effect: 'x y -- [x%y]',
                info: 'get the remainder from the division'
            },
            {
                name: 'NEG',
                fn: () => {
                    const x = pop()
                    push( -x )
                },
                effect: 'x -- -x',
                info: 'negate the top data stack value'
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
                effect: 'x y -- 1/0',
                info: 'compare if the top two values are equal'
            },
            {
                name: 'NEQ',
                fn: () => {
                    const y = pop(),
                          x = pop()
                    if ( x !== y ) push( 1 )
                    else push( 0 )
                },
                effect: 'x y -- 0/1',
                info: 'check if the top two values are not equal'
            },
            {
                name: 'LT',
                fn: () => {
                    const y = pop(),
                          x = pop()
                    if ( x < y ) push( 1 )
                    else push( 0 )
                },
                effect: 'x y -- 1/0',
                info: 'check if the top value is less than the next'
            },
            {
                name: 'LTE',
                fn: () => {
                    const y = pop(),
                          x = pop()
                    if ( x <= y ) push( 1 )
                    else push( 0 )
                },
                effect: 'x y -- 1/0',
                info: 'check on less or equal'
            },
            {
                name: 'GT',
                fn: () => {
                    const y = pop(),
                          x = pop()
                    if ( x > y ) push( 1 )
                    else push( 0 )
                },
                effect: 'x y -- 1/0',
                info: 'check if the top value is greater than the next'
            },
            {
                name: 'GTE',
                fn: () => {
                    const y = pop(),
                          x = pop()
                    if ( x >= y ) push( 1 )
                    else push( 0 )
                },
                effect: 'x y -- 1/0',
                info: 'check on greater or equal'
            },

            // === LOGICAL OPS ===
            {
                name: 'NOT',
                fn: () => {
                    const x = pop()
                    if ( x === 0 ) push( 1 )
                    else push( 0 )
                },
                effect: 'x -- 1/0',
                info: 'logical NOT for the top value on the data stack'
            },

            // === FLOW CONTROL ===
            {
                name: 'JMP',
                fn: () => {
                    PC = pop()
                },
                effect: '@ -- ',
                info: 'unconditional jump to the specified address'
            },
            {
                name: 'JNZ',
                fn: () => {
                    const at = pop(),
                          x  = pop()
                    if (x !== 0) PC = at
                },
                effect: 'x @ -- ',
                info: 'jump only if the second value is not zero'
            },

            {
                name: 'OBUS',
                fn: () => {
                    probe.openDataLine( pop() )
                },
                effect: 'x1 -- ',
                info: 'open data line to the specified instrument'
            },
            {
                name: 'CBUS',
                fn: () => {
                    probe.closeDataLine( pop() )
                },
                effect: 'x1 -- ',
                info: 'close the data line to the specified instrument'
            },
            {
                name: 'OPOW',
                fn: () => {
                    probe.openPowerLine( pop() )
                },
                effect: 'x1 -- ',
                info: 'open the power line to the specified instrument'
            },
            {
                name: 'CPOW',
                fn: () => {
                    probe.closePowerLine( pop() )
                },
                effect: 'x1 -- ',
                info: 'close the power line to the specified instrument'
            },
            {
                name: 'IN',
                fn: () => {
                    probe.in( pop() )
                },
                effect: 'n -- ',
                info: 'read the specified #n i/o line'
            },
            {
                name: 'OUT',
                fn: () => {
                    probe.out( pop(), pop() )
                },
                effect: 'd n  -- ',
                info: 'send the value d to #n i/o line'
            },
            {
                name: 'WAIT',
                fn: () => {
                    _.waitMode = MODE
                    _.waitTime = pop()
                    _.wait()
                },
                effect: 'n -- ',
                info: 'wait for n seconds'
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
                effect: '(... -- clear memory, stacks and registers)',
                info: 'reset the VM',
            },
        ]

        const mnemonics = _.mnemonics = {}
        const actions   = _.actions   = {}
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
                // we still have steps, but no ops to run - HALT the system
                _.halt()
            }
        }

        _.suspend = function() {
            MODE = STEP
            log('SUS')
        }

        // one step through
        _.step = function() {
            MODE = STEP
            log('STEP')
            _.cycle(1)
        }

        // walk instructions slowly one-by-one
        _.walk = function() {
            if (MODE !== STEP) {
                _.op('RST')
            }
            MODE = WALK
            _.lastCycle = _.time
        }

        // run instructions fast
        _.run = function() {
            MODE = RUN
            _.lastCycle = _.time
        }

        _.wait = function() {
            MODE = WAIT
            _.lastCycle = _.time
        }

        _.halt = function() {
            if (MODE === HALT) return
            MODE = HALT
            _.monitors.forEach(m => {
                if (isFun(m.onHalt)) m.onHalt()
            })
            signal('halt')
        }

        _.mode = function(val) {
            MODE = val
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
            formatCore,
            formatCapsule,
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

    flush(src, icapsule, unlocked) {
        const ops = src
            .split('\n')
            .map(e => e.trim())
            .filter(e => !e.startsWith('--'))
            .map(e => e.split('--')[0])
            .map(e => e.trim())
            .filter(e => e)
            .map(e => e.split(/\s+/))
            .flat()
            .map(e => e.toUpperCase())
            .map(e => {
                if (e.charAt(0) === '0') return parseInt(e, 16)
                else return e
            })

        icapsule = icapsule ?? this.spy.CAP()
        const capsule = this.core[icapsule] // TODO how to flush other capsules?
                                            //      is it only current? 
                                            //      is it selected in source?
        this.spy.formatCapsule(icapsule)
        // set the capsule cells
        for (let i = 0; i < ops.length; i++) {
            capsule[i] = ops[i]
        }

        const e = {
            icapsule,
            src,
            ops,
            unlocked: !!unlocked,
        }
        this.monitors.forEach(m => {
            if (isFun(m.onFlush)) m.onFlush(e)
        })
        signal('flush', e)
    }

    op(name) {
        name = name.toUpperCase()
        const op = this.mnemonics[name]
        if (!op) throw new Error(`Unknown operation: [${name}]`)

        op.fn()
    }

    /*
    // upload and evaluate 
    upload() {
        this.op('RST')
        // this.compile()
        this.walk()
    }
    */

    evo(dt) {
        this.time += dt
        // TODO follow the current execution MODE (paused, stepping, slowRun, fastRun)
        
        switch(this.spy.MODE()) {
            case WALK:
                if (this.time >= this.lastCycle + this.walkSpeed) {
                    this.cycle(1)
                    this.monitors.forEach(m => {
                        if (m.onStep) m.onStep()
                    })
                }
                break
            case RUN:
                if (this.time >= this.lastCycle + this.runSpeed) {
                    this.cycle(this.runBatch)
                }
                break
            case WAIT:
                if (this.time >= this.lastCycle + this.waitTime) {
                    this.waitTime = 0
                    this.mode(this.waitMode)
                }
                break
        }
    }

    capsule(icapsule) {
        return this.core[icapsule]
    }
}
