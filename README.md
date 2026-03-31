# EcoScore - Carbon Footprint Calculator 🌍

> **[🚀 Try it Live!](https://eco-score-carbon-calculator.vercel.app/)**

A web app I built to help people calculate their personal carbon footprint and get practical tips to reduce it.

---

## The Story Behind This

So I've been planning to study sustainability management abroad, and I realized I should probably build something related to it rather than just talking about it in my applications. That's how this project started.

The idea is simple — you answer some questions about how you travel, how much electricity you use, what you eat, and how often you fly. The app crunches the numbers and tells you how much CO2 you're responsible for every year. Plus, it gives you a "sustainability score" out of 1000 (yeah, I made that up, but the math behind it is solid).

---

## What Can You Do With It?

**Calculate your footprint:**
- Pick your transport mode (car, bike, bus, walk, etc.)
- Enter your monthly electricity bill
- Select your diet type (vegan to heavy meat eater)
- Add how many flights you take per year

**See where you stand:**
- Get your total CO2 emissions in tons/year
- Compare yourself to Indian average (1.9 tons) and world average (4.0 tons)
- See a breakdown of which habits are hurting the most

**Get actual useful tips:**
- Not generic stuff like "plant trees"
- Specific recommendations based on YOUR data
- Like "take the bus 3 days a week and you'll save 0.8 tons/year"

**Earn badges** (because who doesn't like achievements):
- First Step, Eco Warrior, Below Average, Paris Achiever, etc.
- Some are easy to get, some are actually challenging

---

## Tech Stuff

**Built with:**
- Python + Flask (backend)
- Vanilla HTML/CSS/JavaScript (no React, kept it simple)
- Plotly for charts
- Pandas for data handling
- Scikit-learn for the prediction parts

**Data sources:**
- IPCC emission factors
- India-specific electricity grid data

---

## How to Run It Locally

First, grab the code:

    git clone https://github.com/barishavm29-ui/ecoscore-carbon-calculator.git
    cd ecoscore-carbon-calculator

Setup environment (I used conda, but venv works too):

    conda create -n ecoscore python=3.11 -y
    conda activate ecoscore

Install the packages:

    pip install -r requirements.txt

Run the app:

    python app.py

Then open http://localhost:5000 in browser.

---

## Screenshots

Adding these soon — need to take some good ones.

---

## How Everything is Organized

The project structure looks like this:

    ecoscore-carbon-calculator/
    │
    ├── app.py                    # main Flask app with all the routes
    ├── requirements.txt          # list of Python packages needed
    │
    ├── templates/                # all the HTML pages
    │   ├── index.html            # homepage with hero section
    │   ├── calculator.html       # the 4-step calculator form
    │   ├── dashboard.html        # results page with charts
    │   └── components/           # reusable pieces
    │       ├── navbar.html       # navigation bar
    │       ├── footer.html       # footer section
    │       └── modal.html        # share popup
    │
    ├── static/                   # frontend stuff
    │   ├── css/
    │   │   └── style.css         # all the styling
    │   ├── js/
    │   │   └── script.js         # interactivity
    │   └── images/               # any images used
    │
    ├── utils/                    # helper functions
    │   └── calculator.py         # carbon calculation logic
    │
    └── data/                     # data files
        └── carbon_data.csv       # emission factors

---

## Things I'm Proud Of

- **The scoring system** — took me a while to figure out a fair algorithm that actually makes sense
- **The recommendations engine** — it looks at your data and suggests relevant stuff, not just generic tips
- **Making charts work** — Plotly was completely new to me
- **The multi-step form** — smoother than putting everything on one page

---

## Things That Were Annoying

- Finding accurate emission data for India (most data is US/Europe focused)
- Getting the CSS right (why is centering things still so hard?)
- Making it work on mobile without breaking desktop layout

---

## What's Next?

If I get time, I want to add:

- User accounts so people can track progress over months
- Some kind of community feature (leaderboards maybe?)
- Monthly challenges like "no car week" or "meatless monday"
- Integration with electricity bills for auto-calculation
- Maybe a mobile app someday

---

## Random Notes

- The emission factors are from 2023 IPCC data, so they're pretty recent
- Indian electricity grid is mostly coal, which is why energy scores tend to be higher
- A vegetarian in India already has a lower footprint than the average American
- The Paris Agreement target is 2 tons per person by 2030 — that's really hard to achieve

---

## About Me

I'm currently working on building my profile for sustainability management programs. This is one of the projects I built to show that I can actually build things, not just talk about ideas.

If you have feedback or find bugs, feel free to open an issue!

