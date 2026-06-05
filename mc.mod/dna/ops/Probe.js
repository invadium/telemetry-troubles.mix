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
        this.activatePod('antenna')
    }

    activatePod(pod) {
        if (isStr(pod)) pod = this.locate(pod)
        if (!pod) return

        this.blueprint.linkPod(pod)
    }

    deactivatePod(pod) {
        if (isStr(pod)) pod = this.locate(pod)
        if (!pod) return

        this.blueprint.detachPod(pod)
    }

    draw() {}
}
