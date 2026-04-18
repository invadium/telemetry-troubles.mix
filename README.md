# Telemetry Troubles

_Keep the space mission alive by sending commands to the failing probe to obtain crucial telemetry._


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

