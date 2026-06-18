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
--stream     - enable running stream announcement bar
--plain      - disable the CRT effect
--showBuffer - show the original mission control buffer preview
--magnify    - show magnifying window for pixel-perfect tuning

--autosolve  - create the bot to autosolve the puzzles
```

Use it with ```jam``` command like so:

```
jam -d --showBuffer
```

Or by directly setting the env variable in JS:

```
env.showBuffer = true
```

## Time Control

You can manipulate the mission time speed with the following keystrokes:

```
Ctrl+P - pause, press any other key to resume
Ctrl+[ - hold to slow down
Ctrl+] - hold to speed up
Ctrl+Shift+[ - slow down
Ctrl+Shift+] - speed up
```

You need to hold a simple Ctrl combination to apply speed up or slow down.
If you want the changes to be permanent, use the combinations with Shift.
To go back to the normal speed once changed permanently,
just use the holding speed up or slow down combination and it will be back
to normal once you stop holding.

