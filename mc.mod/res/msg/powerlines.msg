from:    Tech Sup
subject: Power lines
----------------------------

The fact that you can see an instrument telemetry doesn't mean the instrument is activated.
The power is controlled through separate power lines.

These lines are controlled through OPOW and CPOW instructions.
So, to enable the power line #4, push 0x04 and call OPOW:

  04
  OPOW

Power lines are connected in the same order as data telemetry lines:

 0. Gyroscope*
 1. RTGs*
 2. Battery*
 3. Command & Control System*
 4. Antenna
 5. Tape Recorder
 6. Wide Angle Camera
 7. Stack Inspector*


However, some datalines are wired in and always connected, so they just ignore OPOW and CPOW instructions.
They are marked with (*) in the manifest. For example, there is no reason to enable the power line to the battery or the gyroscope - they are always connected to power.
