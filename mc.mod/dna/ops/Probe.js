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
        this.enableTelemetry('antenna')
        this.powerOn('antenna')
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
