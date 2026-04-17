# 🎮 Trivia Game

A fun, interactive web-based trivia game that can be played with multiple teams! Perfect for parties, classroom activities, or team building events.

## ✨ Features

- **Customizable Game Setup**: Choose number of teams, timer duration, topics, and rounds
- **Multiple Topics**: History, Science, Sports, Geography, and Entertainment
- **Random Question Selection**: Questions are pulled randomly from selected topics with no repeats during a game
- **Interactive Timer**: Visual countdown timer with color-coded warnings
- **Real-time Scoring**: Track scores for all teams throughout the game
- **Fun UI**: Colorful, animated interface with a game-like feel
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **No Backend Required**: Runs entirely in the browser

## 🎯 How to Play

1. **Setup**: Configure your game
   - Enter the number of teams (1-10)
   - Set seconds per question (10-60 seconds)
   - Select one or more topics
   - Choose number of rounds (1-20)

2. **Play**: Answer trivia questions
   - Each team gets one question per round
   - Click "Show Answer" to reveal the answer, or wait for the timer
   - Mark the answer as Correct or Wrong
   - Correct answers earn 1 point

3. **Results**: View final scores
   - See the winner on the podium
   - View complete rankings
   - Play again or start a new game

## 🚀 Deployment

### GitHub Pages (Recommended)

This trivia game is designed to work perfectly with GitHub Pages for free hosting:

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial trivia game commit"
   git push origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under "Source", select **main** branch
   - Click **Save**
   - Your site will be published at: `https://[username].github.io/trivia-game/`

3. **Access Your Game**:
   - Wait a few minutes for deployment
   - Visit the URL provided by GitHub Pages
   - Share the link with friends!

### Local Development

To run the game locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/[username]/trivia-game.git
   cd trivia-game
   ```

2. **Open in browser**:
   - Simply open `index.html` in your web browser
   - Or use a local server (recommended):
     ```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Node.js (http-server)
     npx http-server
     ```
   - Navigate to `http://localhost:8000`

## 📁 Project Structure

```
trivia-game/
├── index.html          # Setup/configuration page
├── game.html           # Main game board
├── results.html        # Final scores page
├── styles.css          # All styling and animations
├── setup.js            # Setup page logic
├── game.js             # Core game engine
├── results.js          # Results page logic
├── data/               # Question data files
│   ├── history.json
│   ├── science.json
│   ├── sports.json
│   ├── geography.json
│   └── entertainment.json
└── README.md
```

## 📝 Adding New Topics

To add a new topic:

1. **Create a JSON file** in the `data/` directory:
   ```json
   {
     "topic": "Your Topic Name",
     "questions": [
       {
         "id": 1,
         "question": "Your question?",
         "answer": "Your answer"
       }
     ]
   }
   ```

2. **Update setup.js**: Add your topic to the `AVAILABLE_TOPICS` array:
   ```javascript
   const AVAILABLE_TOPICS = [
       // ... existing topics
       { name: 'Your Topic Name', file: 'yourtopic.json' }
   ];
   ```

3. **Add 20-30 questions** for best gameplay experience

## 🎨 Customization

### Colors and Theme

Edit the CSS variables in `styles.css`:

```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #ec4899;
    --success-color: #10b981;
    --danger-color: #ef4444;
    /* ... more variables */
}
```

### Game Limits

Adjust limits in the HTML forms (`index.html`):
- Number of teams: `min="1" max="10"`
- Seconds per question: `min="10" max="60"`
- Number of rounds: `min="1" max="20"`

## 🛠️ Technologies Used

- **HTML5**: Structure and semantic markup
- **CSS3**: Styling, animations, and responsive design
- **JavaScript (ES6+)**: Game logic and interactivity
- **JSON**: Question data storage
- **SessionStorage**: Passing data between pages

## 📱 Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## 🤝 Contributing

Feel free to fork this project and add your own features:
- More question topics
- Difficulty levels
- Team name customization
- Sound effects
- Leaderboard persistence
- Multiplayer features

## 📄 License

This project is open source and available for personal and educational use.

## 🎉 Have Fun!

Enjoy playing trivia with your friends and family! If you encounter any issues or have suggestions, please open an issue on GitHub.

---

**Note**: Questions are stored locally in JSON files. No data is collected or sent to external servers. All game logic runs in your browser.
