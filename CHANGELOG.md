# changelog

this file will contain relevant notes, pre and post development reflections, as well as detailed descriptions of daily work to supplement issues filed with github.

## pre-development reflection

> i know that this isn't a mandatory component of this project, but keeping a log and detailed account of my process is helpful to me and keeps me accountable along the way!

instead of copying and pasting everything, i am choosing to type out each provided code block myself to help establish mind + memory connection and make the coding process feel more personal. i found this helps keeps me engaged, and writing out notes throughout my files work as a guide for me to look back to later.

trying to focus so much on ensuring my coding style was identical to what was pre-written for us was increasing my sense of burnout and stress. after the brief break between the end of module 2 and the beginning of modules 3 + 4, i decided to go back to my roots for this last project and involve myself as much as possible. as a coder who has adhd, finding these little "tricks" that help me feel more confident and excited about developing is crucial and a process that i believe will continuously evolve as my skills and stylistic choices progress over time.

## daily work log

`thursday, december 11th:` began development process by creating project folder. completed steps 1-7 inside p.1 foundational architecture lesson

`friday, december 12th:` committed project to git after ensuring mobile-controls and tablet-cluster weren't being viewed as individual repositories. completed the entirety of p.1 foundational architecture with successful server connection and html test-client output.

`saturday, december 13th:` completed the entirety of p.2 phone interface with successful server and client side connections.

`sunday, december 14th:` completed lesson 3, tablet interface with successful server and client side connections on tablet and mobile interfaces. added throttling optimization to the useVehicleConnection hook inside mobile-controls and animation cleanup inside tablet-cluster for svg-heavy components speedometer, rpmgauge, and statusindicator files.

`monday, december 15th:` completed parts 1 and 2 of p. 4 web interface lesson.

`tuesday, december 16th:` completed parts 1 and 2 of p. 4 web interface lesson.

## errors within lessons

> whenever i encountered an error within the lesson material, i will note it below!

### lesson 2: phone interface

**_mobile-controls typescript configuration:_** inside the **tsconfig.json** file settings, there is a missing compiler key/value pairing: `"module": "node16"`. further, the `"moduleResolution"` key should be updated to `"node16"` in order to properly compile typescript files.

### lesson 3: tablet interface

**_tablet-cluster gaugeUtils.ts:_** in the return, we have `x` and `y` variables that are declared inside the interface function but never created to be used in object shorthand. in order to fix this, i added the following lines _before_ the return:

```bash
const x = centerX + Math.cos(radians) * radius;
const y = centerY + Math.sin(radians) * radius;
```

**_tablet-cluster speedometer component:_** within the block that starts with `G rotation...`,  needleRotation is an **Animated.Value**, which is something that `react-native-svg's 'G'` doesn't accept. also the `rotation` method itself is _deprecated_ in the svg framework. in order to fix this, the svg animation had to be called via `Animated.createAnimatedComponent`. these are the steps i took to fix these issues:

**_step one:_** create an animated svg group by adding this line at the top of the file with the other imports:

```bash
const AnimatedG = Animated.
createAnimatedComponent(G);
```

**_step two:_** replace `rotation` with `transform` in problematic G rotation line:

```bash
<AnimatedG
  originX={CENTER_X}
  originY={CENTER_Y}
  transform={[
    {
      rotate: needleRotation.interpolate({
        inputRange: [-120, 120],
        outputRange: ["-120deg", "120deg"],
      }),
    },
  ]}
>

{/* needle base */}
<Circle
    cx={CENTER_X}
    cy={CENTER_Y}
    r="8"
    fill="url(#needleGradient)"
    stroke="#fff"
    strokeWidth="2"
/>
</AnimatedG>
```

**_tablet-cluster rpmgauge component:_** has the same type of issue with needing to use `Animated.createAnimatedComponent` instead of the `rotate` method. these were the changes made to solve the error:

_**step one:**_ create an animated svg group by adding this line at the top of the file with the other imports:

```bash
const AnimatedG = Animated.
createAnimatedComponent(G);
```

**_step two:_** replace `rotation` with `transform` in problematic G rotation line:

```bash
<AnimatedG
  originX={CENTER_X}
  originY={CENTER_Y}
  transform={[
    {
      rotate: needleRotation.interpolate({
        inputRange: [-120, 120],
        outputRange: ["-120deg", "120deg"],
      }),
    },
  ]}
>
  <Line
    x1={CENTER_X}
    y1={CENTER_Y}
    x2={CENTER_X}
    y2={CENTER_Y - NEEDLE_LENGTH}
    stroke="url(#rpmNeedleGradient)"
    strokeWidth="3"
    strokeLinecap="round"
  />

  <Circle
    cx={CENTER_X}
    cy={CENTER_Y}
    r="6"
    fill="url(#rpmNeedleGradient)"
    stroke="#fff"
    strokeWidth="2"
  />
</AnimatedG>
```

additionally, inside the `rpmGauge.tsx` component, precisely inside the **RPMGauge function**, the property `redLine` is missing from the original **RPMGaugeProps** type even though it _is_ present. this is because there is a type casing mix-match in the rpm component where it is used throughout as `redline`. change the casing to match the prop type and these errors go away. this error can also be found inside the **MainGauges.tsx** file.

**_tablet-cluster warning panel component:_** there is another spelling issue where **systems** is used throughout despite the correct use being **system**. once the extra _s_ is removed, then the errors clear. this error is also present in the **StatusPanel.tsx** file.

**_web-map hook usetrafficcontrols_** an error with the **date.now()** use. react does not allow impure functions during render so the functions containing that method had to be altered. the first fix was inside the **systemsmetrics** initial state, where i decided to use a stable placeholder. this was my updated block:

```bash
const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
  connectedDevices: { mobile: 0, tablet: 0, web: 0, test: 0 },
  serverUptime: 0,
  networkLatency: 0,
  messagesPerSecond: 0,
  lastUpdate: 0
});
```
i also changed the **lastsecondref** declaration to use refs. the change was this, followed by initializing inside the effect once:

```bash
const lastSecondRef = useRef<number>(0);

useEffect(() => {
  lastSecondRef.current = Date.now();
}, []);
```