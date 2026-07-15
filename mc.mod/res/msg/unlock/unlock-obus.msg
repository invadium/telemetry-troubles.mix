at:      2.1
from:    Tech Sup
subject: Unlocked OBUS
----------------------------

New instruction available:

OBUS ( [data-line-number] -- ) - open data bus.

It connects a particular data line to the telemetry stream.

If you want to get telemetry from a particular device, use this command like so:

  05
  OBUS

First, we place the desired line number on the data stack, then call OBUS.
OBUS will take the top value from the data stack (05) and connect
the data line with that number to telemetry.

Notice the so-called "stack effect" in the parentheses.
DUSTY-12 is a stack-based machine and all operands and results are placed
on the data stack.
The stack effect for OBUS tells us that OBUS expects the data line number
to be at the top of the stack. The line on the right of "--" shows that
OBUS will consume that number and place nothing back.
So the stack is going to loose one number.

