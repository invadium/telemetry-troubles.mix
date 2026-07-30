from:    Tech Sup
subject: Unlocked ADD
----------------------------

New instruction available:

ADD ( [n1] [n2] -- [n3] ) - adds two top values on the data stack and places the result value back

Let's say we have two numbers on top of the stack:

  05
  07

We can apply the ADD instruction to them, resulting in the following data stack:

  0C

Which is hexadecimal for decimal 13.

Don't forget to ensure that the data stack has two values before applying ADD.
The "empty stack" error will be raised otherwise.

