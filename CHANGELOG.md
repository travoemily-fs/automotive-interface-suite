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

`tuesday, december 16th:` completed all of lesson 4, web interface along with video demonstrating successful mobile, web, tablet & server side functionality. have established what final project will be, requiring little change to current file structure to begin implementing new features. also fixed the rest of the issues present in the debugging assignment; will add my annotations to my chosen error for filming later today. desktop interface issue is now fixed and shows all active device connections on dashboard page. completed all demo debugging video and successfully fixed all pre-existing bugs.

`wednesday, december 17th:` officially began rewiring/renaming components and other project files to better fit the batmobile design. completed renaming (kept certain integral file names the same to avoid any headaches on my end if i miss something). decided on a game plan for future changes: first up is switching the map from atlanta to nyc (commonly compared to gotham, the fictional city batman resides in), adding a bat-signal alert broadcast, and cleaning up/fixing the environment logic. after these three fixes are done, it will be time to move into ui/ux revamping and other polishing touches to make the simulation immersive. successfully changed mapping software from atlanta to gotham (nyc). next on the agenda is implementing the bat-signal alert broadcast and environment logic reworking to make sure that's working as expected. this will be accomplished tomorrow, leaving friday, saturday, and sunday for ui/ux & immersion work.

`thursday, december 18th:` began construction of bat-signal alert after deciding on logic of functionality. bat-signal will be raised when a normal alert crosses a severity threshold. by building off of the pre-existing traffic alert structure, alert severity will be added to trigger a bat-signal response when appropriate. finished with bat-signal alert which operates with a random critical-level alert across web dashboard after 1.30 minutes. successful implementation of crime escalation along with lore-friendly crime events to maintain complete immersion. beginning project-wide ui/ux overall. starting with web dashboard and building out. established root color scheme with new palette and changed body and heading/alert text to fonts hosted by adobe.

`friday, december 19th:` starting the day with the web dashboard overhaul. will begin with removing unwanted features amd layout redesign. successful redesign of control panel, admin dashboard, and map section. theming integrated throughout. still left: bat-signal alert styling, wiring alert system to register bat-signal & batman logo for hero section. 

`saturday, december 20th:` completed the dashboard web overhaul. will add batman logo in after web and tablet ui redesigns are complete. tackling the tablet redesign first. everything aside from the gauges are updated in the tablet ui. will address gauges tomorrow before finishing ui redesign with the mobile overhaul. updated speedometer with new styling.

`sunday, december 21st:` finished tablet ui overhaul after updating rpm gauge to match speedometer. moving onto mobile revamp before adding finishing touches. went back in and added batman logo svg to web dashboard and bat-signal alert. verified bat-signal alerts are being stored in the control panel. finished project.