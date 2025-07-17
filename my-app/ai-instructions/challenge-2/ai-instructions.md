This document defines the design system guidelines, layout principles, and component consistency rules for the future Tactical OPS. The AI agent should strictly adhere to these design patterns when generating UI ideas, components, or page structures.

Design System Principles
Consistent Visual Language
Use the same typography, spacing, color palette, and interaction patterns across the entire app.

Component Reusability
Components should be modular, reusable, and visually consistent.

Minimalist Aesthetic
Prioritize clarity and remove unnecessary visual noise.

Mobile-First Approach
Design should adapt gracefully to different screen sizes.

Accessibility First
Designs must meet WCAG 2.1 AA minimum standards.

Core Design Elements
Typography
Base font: ui-monospace, SFMono-Regular
Headings: Consistent hierarchy (h1, h2, h3)
Body text: Clear, readable font size
Avoid using more than two font weights in one component

Color Palette
Primary color: #ffffff
Secondary color: #a0a0a0
Accent color: #ff7300
Background: Dark (#0b0b0c)
Borders/Dividers: #2a2a2a
Error: #FF3B30
Card/Box Background: #151515
Use color intentionally for emphasis only

Spacing & Layout
Use a base unit (8px scale)
Consistent margins and paddings across components
White space used deliberately to improve readability

UI Components Guidelines
General Rules
Components must visually align with existing system (Shadcn UI + Tailwind CSS)
Components must be responsive and accessible
Ensure consistent hover, active, and disabled states

Example Components
Button
Variants: Primary, Secondary, Tertiary
Sizes: Small, Medium, Large
Avoid introducing new button variants without approval

Card
Always include consistent padding and rounded corners
Use for grouping related content

Input Fields
Use consistent styling for text inputs, selects, and textareas
Show validation feedback consistently (red borders, messages)

Modals
Always center on screen, use backdrop
Include a clear title, body content, and primary/secondary actions

Tables & Lists
Consistent column padding
Use alternating row backgrounds only if necessary
Tables should adapt to small screens via horizontal scrolling

Layout Patterns
Use consistent page structures:
Header (always at top)
Sidebar (optional, based on user role)
Content Area (scrollable)
Footer (if necessary)

Keep navigation consistent:
Active item highlighted
Breadcrumbs optional but encouraged for deep navigation

UI Consistency Checks
AI agent should validate:
Spacing consistency (using design tokens)
Typography hierarchy consistency
Proper contrast and color use
Components visually aligning with previously generated designs

Tasks for AI Agent
When suggesting new components:
Respect existing design system
Suggest consistent variants (e.g., button styles)
Validate spacing, typography, and color usage

When generating page layouts:
Use consistent structural patterns
Prioritize content clarity and hierarchy

When suggesting UI improvements:
Focus on simplifying interactions and enhancing readability

On the Command Center page, inside the Agent Allocation card, each agent will be shown in a separate section, one below the other. Each section will display the agent's name in plain white text, with their ID shown first, and then the name underneath.

In the Mission Information section, we have Successful Missions and Failed Missions, and for each of these, we display how many are high, medium, and low risk. Each of these categories should be displayed one below the other.

On the Agent Network page, for risk levels, only use the colors specified above:
#ff7300 for high
#8e949e for medium
white for low, but make sure it stands out more than medium
critical: #ff3b3b

Buttons
Primary Button
Text: white
Border-radius: 12 px

Secondary Button
Background: transparent / #E0E0E0
Radius: 16 px
Background: #FFFFFF
Shadow: 0px 4px 12px rgba(0, 0, 0, 0.05)
Content: icon + title + descriptive text + action

Navbar / Tabbar
Background: #FFFFFF
Text under icon: 12 px, Medium

Lists and Items
Row height: 56 px
Vertical padding: 12 px
Divider: thin line #E0E0E0

Notifications / Toasts
Background: #FF3B30 for errors, #00C2A8 for success
Text: white, 14 px
Rounded corners

Inputs:

Element	Details
Text field	Border-radius: 12 px, gray border (#E0E0E0)
Label	14 px, #7A7A7A
Placeholder	#BDBDBD
Error state	Border #FF3B30, red text under the field

Spacing and Grid
Component margin: 16 px
Internal padding: 12–24 px
Grid: 4pt baseline grid
Layout: max 2 columns (mobile-first)

#Colors
Night Mode
Neutral colors are mainly used, with the exceptions listed below.

Sidebar:
Page names are gray, but when a page is selected, the text turns white and the background becomes orange. The title TACTICAL OPS is written in orange.

Header:
The background color is dark gray, and the text is predominantly a slightly lighter gray. Only OVERVIEW and (ADMIN) are in orange.

Main buttons are orange with white text.

Most of the text is white, but subtitles or less relevant elements are in dark gray. The application's background is black, and the boxes (information containers) are in a shade of gray that is not too close to black but still distinct from the background.

Progress bars are orange.

Mission statuses or similar elements have colors depending on difficulty:
Critical – Red
Standby – Gray
Active – White
High – Orange
Planning – Orange
Medium – Gray
Completed – White
Compromised – Red

The buttons for these statuses are slightly more prominent, with rounded corners. The text color is a lighter red compared to the button’s background, which is a darker, more transparent shade. Anything related to Critical or Mission Failed will be in red.

Agent names are displayed in orange. Most operation titles are in white, while the rest of the information is in gray.

When hovering over different containers (e.g., in the Intelligence page), the borders of the containers turn orange—same for Operations and System pages. In Command Center and Agent Network, when hovering over list items, the button background turns a lighter gray.