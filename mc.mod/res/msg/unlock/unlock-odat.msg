at:      2.1
from:    Tech Sup
subject: Unlocked ODAT
----------------------------

New instruction available:

ODAT ( [data-line-number] -- ) - open data bus.

It connects a particular data line to the telemetry stream.

If you want to get telemetry from a particular device, use this command like so:

  05
  ODAT

First, we place the desired line number on the data stack, then call ODAT.
ODAT will take the top value from the data stack (05) and connect
the data line with that number to telemetry.

Notice the so-called "stack effect" in the parentheses.
DUSTY-12 is a stack-based machine, and all operands and results are placed
on the data stack.

Each instruction could take parameters from the stack and then place the results back.

There is a "stack effect" notation after the instruction name in the parentheses.
It specifies which values go in and what gets out.

The stack effect for ODAT tells us that ODAT expects one value,
the data line number, to be at the top of the stack.
That value MUST be already on the data stack, or an "empty stack" error will be raised.

The ODAT instruction will consume the number and return nothing. The stack will lose one number as a result.

