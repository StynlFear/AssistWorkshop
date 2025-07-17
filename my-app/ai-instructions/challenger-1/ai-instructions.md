We’re creating a complete application with a futuristic, dark-themed tactical interface—something you’d expect in a spy agency or command center. The design should be responsive and scalable with cards to be easily moved.

The topbar provides:
Breadcrumb navigation to indicate the user's location
Status info (e.g., last update timestamp)
User identity and role
Quick actions like refresh, notifications, or logout
Structure
Section	Contents
Left	TACTICAL COMMAND / OVERVIEW — breadcrumb with current section highlighted
Center	(Currently empty — optional for filters or global search in the future)
Right	LAST UPDATE: 05/06/2025 20:00 UTC + 👤 Demo User (ADMIN) + icons
User Info Block
Username: Demo User
Role: highlighted in orange → (ADMIN)
Optionally expandable for switching users/roles
In smaller screens:
Collapse user info into a dropdown
Hide timestamp if needed
Use Flexbox/Grid to split layout: Left – Center – Right
Recommended to make it sticky/fixed on top when scrolling

Element	Style
Background	#1F1F1F (dark gray, suitable for dark mode UI)
Font	Monospace (e.g., SF Mono, Roboto Mono, Courier New)
Breadcrumb	All-caps, muted gray (#CCCCCC); active section in orange (#FF7B00)
Timestamp	Small font (12px–14px), muted gray
User info	Light gray username, orange accent on role (e.g., (ADMIN))
Icons	Simple line icons, white or gray (#AAAAAA)
Spacing	16px between elements, 24px between functional groups
Height	48–56px (can go up to 64px for more spacing)

when i press the logout button on the top right of the topbar after the nofitications.
The login screen acts as a secure authentication gateway, allowing users to:
Choose a role
Enter their credentials
Log in with clear context and visual hierarchy
Section	Description
Header	Logo + app name TACTICAL OPS, tagline: Secure Access Portal
Role selector	Tabs: ADMIN, ANALYST, OPERATOR, VIEWER – shows active selection
User Profile	Avatar + name + role badge + access level description
Quick Info	Pre-filled credentials for dev/testing
Form	Email + Password inputs
Action Button	Primary button:  Access System (Orange CTA)
Alert Box	DEVELOPMENT MODE note (brown background)
Element	Style Details
Background	#111111 or near black
Card Panel	#1F1F1F, rounded corners, thin border (#333333)
Primary Color	Orange: #FF7B00 (used for buttons, highlights)
Font	Monospace (SF Mono, Roboto Mono, etc.)
Inputs	Dark gray fields, white text, orange focus border
Buttons	Filled orange with white text + lock icon
Badges	Role badge styled with background orange or gray
Role Tabs	Pills with selected role in orange
Alert Box	Dark orange (#402A1F) background, light orange text
Role selector changes the form’s info badge.
Pre-fills may be removed or hidden in production.
Button state: disables if fields are empty.
Allows Enter key to submit.
When the user logs out from anywhere in the app:
Redirect to Login Screen
Show default role (ADMIN or last used)
Clear any session data

 I want it to have a sidebar with the name TACTICAL OPS that can be closed with an arrow.

There are 5 buttons (command center-dashboard, agent network, operations, intelligence, systems) and then a card that shows for how long the system has been online and its status (online/offline), how many agents there are, and how many missions are ongoing.

Next I’ll tell you about every page that the app needs to have.

1. Tactical Dashboard (Overview)
I want a dark-themed tactical dashboard that looks like something out of a spy agency or military command center. It should feel sleek, high-tech, and modern. The main part of the screen should be a grid with multiple panels:

One panel shows Agent Allocation: a count of agents in three categories—Active Field, Undercover, and Training. Below that, there should be a list of agents with their code names, operation names, and color indicators (like red, white, gray, or orange. white for active, gray for standby, red for compromised and orange for training).

Another panel shows an Activity Log: a vertical list of recent agent missions, each with a date and time, agent name, and what happened (e.g., completed a mission, lost communication, etc.).

There should be a panel called Encrypted Chat Activity: it should look like a secure message terminal. Include things like channel ID, agent handle, key locked status, and a cryptic message about a mission override.

A mission overview chart showing trends over time (like number of missions). It should have two lines—one orange, one white.

A panel with mission stats: how many high, medium, and low risk missions were successful vs. failed. Use color to show success or failure—like red for failed, white for success.

2. Agent Network
A search bar to look up agents by name or ID.

Three key stats in card format:

Active Agents: how many agents are active

Compromised: how many agents are compromised

In Training: how many agents are in training

Next to these, there should be two bright buttons—one to Deploy Agent, and one to Filter the list.

Below that, the main agent table should include rows of agents with these details:

Agent ID (like G-078W)

Codename (like VENGEFUL SPIRIT)

Status: ACTIVE, STANDBY, COMPROMISED, or TRAINING — each with a unique dot or color

Location: city or location like “Berlin” or “Base Alpha”

Last Seen: relative time like “2 min ago”

Missions: number of completed missions

Risk Level: labels like HIGH (orange), MEDIUM (gray-blue), LOW (light), or CRITICAL (red)

Actions: a subtle button (three dots) for managing the agent

When I click on an agent I should see a card modal with its name, agent id, status with its color like in point 1, location, missions completed, risk level. We will have 3 buttons: Assign Mission, View History where we will see its mission history, Send Message to message him. The same modal opens when I press the actions button.

Below that there is a box that contains the title SYSTEM ONLINE, and below it: the uptime, how many agents we have, and the missions that are in process.

I will create two pages: OPERATIONS and INTELLIGENCE.
I forgot to mention — the background of the application is black.

3. OPERATIONS:
The title on the left side written in bold and all caps: "OPERATIONS CENTER", and a subtitle: "Mission planning and execution oversight".

On the right side at the same level as the title, there are two orange buttons with white text:
First: "New Operation"
Second: "Mission Brief"

After that, there are 3 rectangular boxes that contain:
First: the text "ACTIVE OPS", and below the text, the number of active operations, and on the left side of the box, a representative icon.
The second: how many completed operations
The third: how many compromised
The fourth: SUCCESS RATE written as a percentage

Below those, there are boxes again — 3 per row.

The content is as follows:
Left-aligned, the title is the name of the operation.
A subtitle, for example: "OP-OMEGA-001" — all operations start with "OP", the middle word varies (delta, alpha, serra, etc...), and the number increases as operations increase.

Below that, there are 2 buttons with larger border-radius, not square:

The first shows the status of the mission, each with a color:
(active – white, completed – white, planning – orange, compromised – red)

The second button on the right is the risk of the mission:
(CRITICAL – red, high – orange, medium – white)

Below these buttons, the mission itself is described in a sentence, for example:
"Track high-value target in Eastern Europe"

And below that, there are 3 items, one under the other, that repeat for each box:

Location (with an icon on the right)

How many agents are assigned

Time when the mission should end

4. Intelligence
At the top, to the left, it has the title, "Intelligence Center" and a short description beneath - "Classified reports and threat analysis".
At top right, it has 2 buttons: New Report and Filter.
Now, all on a row it has more sections:
1. A search bar with the default text "Search intelligence reports"
2. A simply informative section, with a suggestive icon (a piece of paper), Total Reports, that displays the total number of reports. - written in white
3. Another informative section: critical threats - the number is displayed in red and it also has a suggestive earning icon.
4. Another informative section: active sources - the number is written in white and has a suggestive icon.
 
Next, there is a log of Intelligence reports - Intelligence reports is the subtitle of thsi section.
 
The reports are displayed in a single scrollable column, and each of them occupies the whole row.
Each of the reports has a title written in bold, and, under the title, a short it, of the form "INT-year-sequence number"
Below this there is a short description of the report - written in article-title manner.
Each of the reports has a few tags revealing the topics - fro example, "internal", "diplomatic", "terrorism", "trafficking", "political", "weapons" and more. Each report has exactly 3 such tags.
At the top right of the section for each report, there are more labels that indicate the secrecy level (confidential (displayed in white) - secret (yellow) - top secret (red)).
Under these labels, which are displayed next to each other, there is a column of other brief info: location, type (HUMINT, SIGINT, DIPLOMATIC) and date.
The search bar is functional and only searches the desired keywords in the report titles.
The theme of this page is also black with white text, apart from the "New Report" and "Filter" buttons, which are orange, with white text.
 
Now I want to reorganize the System page.
Top left, there is the title - SYSTEMS MONITOR.
Under it, a short description - "Infrastructure health and performance monitoring".
Next, all in a row, 4 informative sections "Systems online", Warnings - yellow text and suggestive icon, AVG uptime  and maintenance.
The 6 different systems each have a dedicated section. They are displayed in 2 rows and 3 columns.
The layout of each such section is like this:
top left, a suggestive icon.
Next to it, the title, in bold and a bigger font, which I already told you for each.
Under the title, with lower font the description.
Beneath, "SYSTEM HEALTH" and a white bar that indicates the percentage. The percentage is also displayed over the bar, at the right side.
Below, all on a single row, there are 3 sections:
1. CPU
2. MEMORY
3. STORAGE
These 3 have, below each title a yellow bar that indicates their percentage, with the percentage also diaplayed, in white, over the bar, on the left side.
At the bottom, there are 2 more rows:
1. Uptime(in days)
2. Location

5. Systems
This page is supposed to track the whole infrastructure, its performance and health.

There are a few details that should be displayed on this page, with informative purpose:

Systems online - displays the number of online systems out of total ones.

Warnings - displays the total number of warnings

Average uptime - the average time the systems were online

Maintenance - the number of maintenance operations done

Furthermore, I need info panels for several components:

Command Server Alpha - role of primary server

Database Cluster Beta - database role

Security Gateway - firewall role

Communication Hub - network role

Backup storage array - storage role

Analytics engine - processing role

For all of these six, I need their name and role to be displayed, their current status (online, maintenance or a warning), the current capacities of their CPU, memory and storage (in percentages). I also need to display their total uptime (in days) and their location. I need a bar that indicates, in percentages, the health of each of these 6. Each of them has its own box. They are also clickable, and clicking them leads to a control panel.

The theme is black and orange. (mainly black and orange buttons)

When clicking any of those info panels, the control panel is displayed. It contains all the info in the info panel, but also 3 options: restart system, view log and schedule maintenance.

The page also has, at the top right corner, two clickable buttons: system scan and maintenance mode.

The whole design should feel like part of a futuristic control room—minimal, professional, dark, and clean. Everything should be easy to read at a glance.

