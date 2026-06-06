class Probe extends sys.LabFrame {

    constructor(st) {
        super( augment({
            name:   'probe',
            hidden:  true,

            _pods: [
                'Antenna',
                'TapeRecorder',
                'Camera',
                'Magnetometer',
                'CosmicRayDetector',
                'CCS',
                'Battery',
                'RTG',
            ],
        }, st) )
    }

    init() {
        for (let pod of this._pods) {
            this.spawn(pod)
        }
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
            name: 'bandwidthGauge',

            x:    10,
            y:    110,
            w:    80,
            h:    1,
            dir: -1,

            evo: function(dt) {
                this.level = .5 * (sin(env.time * .45) + 1)
            },
        })

        this.spawn('HGauge', {
            name: 'thermalGauge',

            x:    10,
            y:    100,
            w:    80,
            h:    1,
            dir:  1,

            evo: function(dt) {
                this.level = .5 * (sin(env.time * .29) + 1)
            },
        })

        this.enableTelemetry('antenna')
        this.enableTelemetry('tapeRecorder')
        this.enableTelemetry('camera')
        this.enableTelemetry('powerGauge')
        this.enableTelemetry('bandwidthGauge')
        this.enableTelemetry('thermalGauge')

        this.powerOn('antenna')
        this.powerOn('tapeRecorder')
        this.powerOn('camera')

    }

    // enable engineering telemetry - show the pod on the blueprint
    enableTelemetry(pod) {
        if (isStr(pod)) pod = this.locate(pod)
        if (!pod) throw new Error('the pod is missing!')

        this.blueprint.linkPod(pod)
        pod.startTelemetry()
    }

    // disable engineering telemetry - hide the pod on the blueprint
    disableTelemetry(pod) {
        if (isStr(pod)) pod = this.locate(pod)
        if (!pod) throw new Error('the pod is missing!')

        this.blueprint.detachPod(pod)
        pod.stopTelemetry()
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

    draw() {}
}
