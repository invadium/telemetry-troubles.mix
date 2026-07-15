const GYROSCOPE       = 0
const RTG             = 1
const BATTERY         = 2
const SPACEFRAME      = 3
const ANTENNA         = 4
const TAPE_RECORDER   = 5
const WA_CAMERA       = 6
const STACK_INSPECTOR = 7

class Probe extends sys.LabFrame {

    constructor(st) {
        super( augment({
            name:   'probe',
            hidden:  true,

            _pods: [
                'Dusty12',

                'Gyroscope',       // reflects the probe attitude
                'RTG',
                'Battery',
                'Spaceframe',      // dusty 12 status panel
                'Antenna',
                'TapeRecorder',
                'WideAngleCamera',

                'StackInspector',  // depends on Dusty12

                'Magnetometer',
                'CosmicRayDetector',
            ],

            powerLines: [],
            dataLines:  [],
            ioLines:    [],
        }, st) )

        extend(this, {
            GYROSCOPE,       
            RTG,
            BATTERY,
            SPACEFRAME,
            ANTENNA,
            TAPE_RECORDER,
            WA_CAMERA,
            STACK_INSPECTOR,
        })
    }

    init() {
        for (let pod of this._pods) {
            this.spawn(pod)
        }

        /*
        this.spawn('VGauge', {
            name: 'powerGauge',

            x:    5,
            y:    10,
            w:    1,
            h:    100,

            evo: function(dt) {
                this.level = .5 * (sin(env.time * .25) + 1)
            },
        })
        this.spawn('HGauge', {
            name: 'thermalGauge',

            x:    10,
            y:    105,
            w:    80,
            h:    1,
            dir:  1,

            evo: function(dt) {
                this.level = .5 * (sin(env.time * .29) + 1)
            },
        })
        this.spawn('HGauge', {
            name: 'bandwidthGauge',

            x:    10,
            y:    115,
            w:    80,
            h:    1,
            dir: -1,

            evo: function(dt) {
                this.level = .5 * (sin(env.time * .45) + 1)
            },
        })
        */

        /*
        this.enableTelemetry('RTG')
        this.enableTelemetry('antenna')
        this.enableTelemetry('tapeRecorder')
        this.enableTelemetry('spaceframe')
        this.enableTelemetry('wideAngleCamera')
        this.enableTelemetry('battery')
        this.enableTelemetry('powerGauge')
        this.enableTelemetry('bandwidthGauge')
        this.enableTelemetry('thermalGauge')

        this.enableTelemetry('stackInspector')

        this.powerOn('antenna')
        this.powerOn('tapeRecorder')
        this.powerOn('wideAngleCamera')
        */
    }

    // enable engineering telemetry - show the pod on the blueprint
    enableTelemetry(pod) {
        if (isStr(pod)) pod = this.locate(pod)
        if (!pod) throw new Error('the pod is missing!')

        this.blueprint.linkPod(pod)
        pod.startTelemetry()

        if (pod.companions) {
            for (let subPod of pod.companions) {
                this.blueprint.linkPod(subPod)
                subPod.startTelemetry()
            }
        }
    }

    // disable engineering telemetry - hide the pod on the blueprint
    disableTelemetry(pod) {
        if (isStr(pod)) pod = this.locate(pod)
        if (!pod) throw new Error('the pod is missing!')

        this.blueprint.detachPod(pod)
        pod.stopTelemetry()

        if (pod.companions) {
            for (let subPod of pod.companions) {
                this.blueprint.detachPod(subPod)
                subPod.stopTelemetry()
            }
        }
    }

    openDataLine(n) {
        const pod = this.dataLines[n]
        if (pod) this.enableTelemetry(pod)
    }

    closeDataLine(n) {
        const pod = this.dataLines[n]
        if (pod) this.disableTelemetry(pod)
    }

    lastDataLine() {
        return this.dataLines.length - 1
    }

    powerOn(pod) {
        if (isStr(pod)) pod = this.locate(pod)
        if (!pod) throw new Error('the pod is missing!')

        pod.powerOn()
    }

    powerOff(pod) {
        if (isStr(pod)) pod = this.locate(pod)
        if (!pod) throw new Error('the pod is missing!')

        pod.powerOff()
    }

    openPowerLine(n) {
        const pod = this.powerLines[n]
        if (pod) this.powerOn(pod)
    }

    closePowerLine(n) {
        const pod = this.powerLines[n]
        if (pod) this.powerOff(pod)
    }

    lastPowerLine() {
        return this.powerLines.length - 1
    }

    draw() {}

    onAttach(pod) {
        if (pod.type !== 'pod') return

        pod.powerLine = this.powerLines.length
        this.powerLines.push(pod)

        pod.dataLine = this.dataLines.length
        this.dataLines.push(pod)

        pod.ioLine = this.ioLines.length
        this.ioLines.push(pod)
        /*
        if (pod.isPowerControlled()) {
        }
        if (pod.isTelemetric()) {
        }
        */
    }
}
