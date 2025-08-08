**AI Password Analyzer**

A fast, client‑side password strength analyzer with real‑time feedback and practical suggestions to help users create stronger passwords.

- Demo: ai-password-analyzer.vercel.app
- Stack: HTML, CSS, JavaScript
- Hosting: Static (Vercel-friendly)

Features

- Real-time strength meter with color-coded feedback
- Heuristic analysis: length, character diversity, common patterns, sequences, repeats
- Actionable suggestions to improve weak passwords
- 100% client-side (no passwords leave the browser)
- Clean, responsive UI

Quick Start

- Clone: git clone https://github.com/shreyasunhle0110/ai-password-analyzer.git
- Open locally: open index.html in your browser
- Or serve locally:
  - Python: python3 -m http.server 8080
  - Node: npx http-server -p 8080
- Visit: http://localhost:8080

Deploy

- Vercel (recommended): vercel in the repo root, or import the GitHub repo in the Vercel dashboard
- No build step required (static site)

How It Works

- Scores password based on:
  - Length (longer is stronger)
  - Character variety (upper, lower, digits, symbols)
  - Pattern detection (e.g., 1234, qwerty, repeated chars)
  - Optional dictionary/common-password checks (if enabled)
- Maps score to strength levels (e.g., Weak, Fair, Good, Strong) and displays suggestions

Project Structure

- index.html — UI and layout
- style.css — Styling and responsive design
- app.js — Scoring logic and interactivity
- vercel.json — Static deploy configuration

Usage

- Type a password in the input
- Watch the meter and messages update in real-time
- Apply suggestions to improve strength

Security Notes

- Passwords are processed only in your browser; nothing is stored or sent
- Use unique passwords per site
- Prefer long passphrases (e.g., 4–5 random words) or 16+ character random passwords
- Use a password manager and enable MFA where available

Customization

- Tweak scoring rules and thresholds in app.js
- Adjust minimum length or required character classes
- Change meter colors and breakpoints in style.css
- Add custom dictionaries or blocklists for organization-specific policies

Roadmap

- Optional zxcvbn-based scoring
- Show/hide password toggle
- Offline dictionary checks
- i18n for feedback messages
- Unit tests for scoring utilities

Contributing

- Fork and create a feature branch: git checkout -b feature/my-change
- Commit: git commit -m "Describe your change"
- Push: git push origin feature/my-change
- Open a pull request with a brief description and screenshots for UI changes

Troubleshooting

- Blank styles or scripts: verify index.html references to style.css and app.js
- Local server not loading: ensure you’re serving the folder root and visiting the correct port
- Vercel 404: confirm vercel.json and that index.html is at the project root
