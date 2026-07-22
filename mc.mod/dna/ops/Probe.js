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

            lines:      [],
            powerLines: [],
            dataLines:  [],
            ioLines:    [],

            telemetryId:   0,
            telemetryFeed: null,
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
        for (let pod of this._ls) {
            if (isFun(pod.uplink)) {
                pod.uplink()
            }
        }

        this.antenna.registerFeed( this.tapeRecorder )
        this.tapeRecorder.registerFeed( this.antenna )
    }

    registerFeed(pod) {
        if ( !(pod instanceof dna.ops.pod.Pod) ) throw new Error('a pod is expected!')

        this.telemetryFeed = pod
    }

    // enable engineering telemetry - show the pod on the blueprint
    enableTelemetry(pod) {
        if (isStr(pod)) pod = this.locate(pod)
        if (!pod) throw new Error('the pod is missing!')
        if (pod.telemetry) return // already enabled

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
        if (!pod.telemetry) return // already disabled

        this.blueprint.detachPod(pod)
        pod.stopTelemetry()

        if (pod.companions) {
            for (let subPod of pod.companions) {
                this.blueprint.detachPod(subPod)
                subPod.stopTelemetry()
            }
        }
    }

    locatePod(id) {
        if ( isNumber(id) ) {
            return this.lines[id]
        } else if ( isObject(id) ) {
            return id
        }
    }

    openDataLine(id) {
        this.enableTelemetry( this.locatePod(id) )
    }

    closeDataLine(id) {
        this.disableTelemetry( this.locatePod(id) )
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

    openPowerLine(id) {
        this.powerOn( this.locatePod(id) )
    }

    closePowerLine(id) {
        this.powerOff( this.locatePod(id) )
    }

    lastPowerLine() {
        return this.powerLines.length - 1
    }

    in(line) {
        const pod = this.ioLines[line]
        if (!pod) return // TODO send an error here?

        return pod.in()
    }

    out(line, val) {
        const pod = this.ioLines[line]
        if (!pod) return // TODO send an error here?

        return pod.out(val)
    }

    sendTelemetry(packet) {
        packet.at = env.time
        packet.id = ++ this.telemetryId
        packet.title = `#${packet.id}: ${packet.type}.${packet.size}`
        this.telemetryFeed.transmitTelemetry(packet)
    }

    draw() {}

    onAttach(pod) {
        if (pod.type !== 'pod') return
    
        pod.line = this.powerLines.length
        this.lines.push(pod)

        pod.powerLine = this.powerLines.length
        this.powerLines.push(pod)

        pod.dataLine = this.dataLines.length
        this.dataLines.push(pod)

        pod.ioLine = this.ioLines.length
        this.ioLines.push(pod)
    }

}
