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

This is the main mission computer.

It implements DUSTY-12 architecture with 27 basic commands:

```
NOP ( -- ) - skip the operation and do nothing this cycle
DROP (x -- ) - drop the top value on the stack
DUP (x -- x x) - duplicate the top value on the stack
SWAP (x y -- y x) - swap top two values on stack
ROT (x y z -- y z x) - rotate top three values on stack
POKE (@ x -- (memory @ set to x)) - set the specified memory location with the value on top of the stack
PEEK (@ -- x) - read the memory cell at the provided address and place it on top of the data stack
ADD (x y -- [x+y]) - add two values at the top of the data stack
SUB (x y -- [x-y]) - subtract the top number on the stack from the previous one
MUL (x y -- [x*y]) - multiply two values at the top of the data stack
DIV (x y -- [x/y]) - divide
MOD (x y -- [x%y]) - remainder from the division
EQ (x y -- [1|0]) - compares the top two values on the data stack and places 1 if equal and 0 if not
NEQ (x y -- [0|1]) - compares the top two values on the data stack and places 0 if equal and 1 if not
LT (x y -- [1|0]) - compares the top two values on the data stack and places 1 if less than and 0 otherwise
LTE (x y -- [1|0]) - compares the top two values on the data stack and places 1 if less than or equal and 0 otherwise
GT (x y -- [1|0]) - compares the top two values on the data stack and places 1 if greater than and 0 otherwise
GTE (x y -- [1|0]) - compares the top two values on the data stack and places 1 if greater than or equal and 0 otherwise
NOT (x -- [1|0]) - logical NOT for the top value on the data stack
JMP (@ -- ) - unconditional jump to the address specified on the data stack
JNZ (x @ -- ) - conditional jump to the address specified on the data stack only if the second value is not zero
OBUS (x1 -- ) - open data bus line to the specified instrument
CBUS (x1 -- ) - close data bus line to the specified instrument
OPOW (x1 -- ) - open powerline to the specified instrument
CPOW (x1 -- ) - close powerline to the specified instrument
HALT ( -- ) - halt execution
RST ((... -- empty memory and stacks, zeroed registers)) - reset the VM
```



## How to Debug

Available flags:

```
--stream     - enable running stream announcement bar
--plain      - disable the CRT effect
--showBuffer - show the original mission control buffer preview
--magnify    - show magnifying window for pixel-perfect tuning

--autosolve (limit/stopper)
             - create the bot to autosolve the puzzles
             -- provide optional limit of how many experiments to solve before stopping: [--autosolve 5]
             -- provide optional stopper experiment code: [--autosolve s1e4]
--keepTiming - apply delays for email reading and experiment solving
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

