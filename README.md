# Telemetry Troubles

_Keep the space mission alive by sending commands to the failing probe to obtain crucial telemetry._


## Key Metrics

* Day
* Burn Rate
* Balance

## Stats

* Mission Days: XXX
* Experiments Completed: XX
* Science $ Earned: $$$$


## Probe Components

The probe has a wide range or instruments and subsystems crucial for it's mission.

* RTG power source
* High-gain antenna - HGA
* Attitude and Articulation Control Subsystem - AACS
* Mission Command and Control Unit - MCCU
* Tape Recorder to store the telemetry

* Wide-angle camera
* Telescopic camera
* Infrared Spectrometer - IS
* Ultraviolet Spectrograph - UVS
* Photopolarimeter
* RADAR (LIDAR?)
* Magnetometers on a boom
* Ion Mass Spectrometer
* Plasma Spectrometer - PLS - isn't that the same as Ion?
* Cosmic Dust Detector
* Cosmic Ray Detector


## Mission Command and Control Unit

* JMP
* JZ
* JNZ


## How to Debug

Available flags:

```
--plain      - disable the CRT effect
--showBuffer - show the original mission control buffer preview
```

Use it with ```jam``` command like so:

```
jam -d --showBuffer
```

Or by directly setting the env variable in JS:

```
env.showBuffer = true
```

