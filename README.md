AI Password Analyzer
A simple, client-side web app that evaluates the strength of a password using AI-like heuristics and provides actionable feedback to help create stronger passwords.

Live Demo: ai-password-analyzer.vercel.app

Tech Stack: HTML, CSS, JavaScript

Deployment: Vercel

Features
Real-time password strength analysis (e.g., length, character variety, common patterns)

Visual strength meter with color-coded feedback

Suggestions to improve weak passwords

Fully client-side (no passwords are sent to a server)

Responsive, minimalist UI

Project Structure
index.html — App layout and UI

style.css — Styling and responsive design

app.js — Password analysis logic and interactivity

vercel.json — Vercel deployment configuration

Getting Started
Prerequisites
Any modern web browser

Optional: Node.js and Vercel CLI for deployment

Run Locally
Clone the repository:

git clone https://github.com/shreyasunhle0110/ai-password-analyzer.git

cd ai-password-analyzer

Open index.html directly in a browser, or serve it locally:

Python: python3 -m http.server 8080

Node (http-server): npx http-server -p 8080

Visit http://localhost:8080

Deploy to Vercel
Sign in to Vercel and import the repo, or:

vercel

This is a static site; no special build step is required.

How It Works
The analyzer scores a password using common-strength heuristics:

Length (short passwords are penalized; longer ones are rewarded)

Character diversity (uppercase, lowercase, digits, symbols)

Pattern detection (sequences like 1234, qwerty, repeated characters)

Dictionary/common password checks (if implemented)

Final score is mapped to strength categories (e.g., Weak, Medium, Strong) and color-coded.

Note: The app runs entirely in the browser and does not store or transmit passwords.

Usage
Type a password in the input field.

Watch the strength meter update in real-time.

Follow the suggestions below the meter to improve strength.

Use the generated guidance to create a more secure password.

Security Notes
Never reuse passwords across websites.

Prefer passphrases (4–5 random words) or a random 16+ character password.

Use a reputable password manager to generate and store credentials.

Enable multi-factor authentication wherever possible.

Customization
Tweak scoring rules in app.js to fit specific policies.

Adjust minimum length or required character classes.

Modify UI colors and meter thresholds in style.css.

Add custom dictionaries or blocklists (e.g., company-specific banned patterns).

Roadmap
Add zxcvbn-based scoring option for improved accuracy

Toggle to show/hide password

Optional offline dictionary checks

i18n for feedback messages

Unit tests for scoring functions

Contributing
Contributions are welcome:

Fork the repo

Create a feature branch: git checkout -b feature/my-improvement

Commit changes: git commit -m "Add improvement"

Push to branch: git push origin feature/my-improvement

Open a pull request

Please keep PRs focused and include brief descriptions and screenshots if UI changes are involved.
