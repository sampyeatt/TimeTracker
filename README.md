# TimeTracker

Track time worked on tasks with this nifty little app. Add time to your dashboard and start tracking your billable time!
Pressing the button starts tracking. Everything is displayed as a decimal of an hour. At the end of the day, all the times are rounded up the nearest half-hour.

### Frameworks
Uses Angular, primeNG, and tailwind for the frontend. Rust and SQlite make up the "backend". Tauri ties it all together.

### History
TL;DR This project started as a simple python script. I eventually settled on Tauri for its size, speed, and simplicity in connecting to a SQlite DB.
#### In the Beninging
This was a project of mine that has gone through many iterations. It started as a simple python script that I ran in the command line. 
This was fine, but if my computer needed to restart or I had to close the terminal, I would lose all my tacking. 
#### The Early Years
So I created an angular frontend and an express/node backend. This was a great solution because I could run in the browser and connect to the backend which I had running in docker.
Eventually I used electron to package it up and make it a desktop app. This was neat but clunky.
The downside of this was size. It was large and entirely unnecessary to have an entire backend api for such a simple app.
#### Young and Functional
I was poking around for a better solution and came across Tauri. Tauri seemed like the perfect fit for this project. Lightweight, fast, and (most importantly) compatible with the front end I had already built!
#### The Future!
My plans for this project are as follows:
- Live time incrementing (Display only)

#### Why are you still reading this?
I learned a lot on this project. Such a simple app taught me so much. I use this app everyday at work to track how much time I spend on each project.

