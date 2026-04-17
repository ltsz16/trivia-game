// results.js - Display final scores and winner

// DOM elements
const elements = {
    podium: document.getElementById('podium'),
    finalScoreboard: document.getElementById('finalScoreboard'),
    playAgainBtn: document.getElementById('playAgainBtn'),
    newGameBtn: document.getElementById('newGameBtn')
};

// Game results
let results = null;

// Initialize results page
function init() {
    // Get results from sessionStorage
    const resultsStr = sessionStorage.getItem('gameResults');
    if (!resultsStr) {
        alert('No game results found. Redirecting to setup...');
        window.location.href = 'index.html';
        return;
    }
    
    results = JSON.parse(resultsStr);
    
    // Display results
    displayPodium();
    displayFullScoreboard();
    
    // Setup event listeners
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    elements.playAgainBtn.addEventListener('click', playAgain);
    elements.newGameBtn.addEventListener('click', newGame);
}

// Display top 3 teams on podium
function displayPodium() {
    // Create array of teams with their scores
    const teams = results.scores.map((score, index) => ({
        teamNumber: index + 1,
        score: score
    }));
    
    // Sort by score (descending)
    teams.sort((a, b) => b.score - a.score);
    
    // Take top 3
    const topThree = teams.slice(0, Math.min(3, teams.length));
    
    // Reorder for podium display: 2nd, 1st, 3rd
    let podiumOrder = [];
    if (topThree.length >= 2) {
        podiumOrder = [topThree[1]]; // 2nd place (left)
    }
    if (topThree.length >= 1) {
        podiumOrder.push(topThree[0]); // 1st place (center)
    }
    if (topThree.length >= 3) {
        podiumOrder.push(topThree[2]); // 3rd place (right)
    }
    
    // Display podium
    elements.podium.innerHTML = '';
    
    podiumOrder.forEach((team, displayIndex) => {
        // Determine actual place (1st, 2nd, or 3rd)
        let place;
        if (displayIndex === 1 || (displayIndex === 0 && podiumOrder.length === 1)) {
            place = 1; // Center position is always 1st
        } else if (displayIndex === 0) {
            place = 2; // Left position is 2nd
        } else {
            place = 3; // Right position is 3rd
        }
        
        const podiumPlace = document.createElement('div');
        podiumPlace.className = 'podium-place';
        
        const podiumBlock = document.createElement('div');
        podiumBlock.className = 'podium-block';
        
        const position = document.createElement('div');
        position.className = 'podium-position';
        
        // Add medal emoji based on place
        if (place === 1) {
            position.textContent = '🥇';
        } else if (place === 2) {
            position.textContent = '🥈';
        } else {
            position.textContent = '🥉';
        }
        
        podiumBlock.appendChild(position);
        
        const podiumInfo = document.createElement('div');
        podiumInfo.className = 'podium-info';
        
        const teamName = document.createElement('div');
        teamName.className = 'podium-team';
        teamName.textContent = `Team ${team.teamNumber}`;
        
        const teamScore = document.createElement('div');
        teamScore.className = 'podium-score';
        teamScore.textContent = `${team.score} points`;
        
        podiumInfo.appendChild(teamName);
        podiumInfo.appendChild(teamScore);
        
        podiumPlace.appendChild(podiumBlock);
        podiumPlace.appendChild(podiumInfo);
        
        elements.podium.appendChild(podiumPlace);
    });
}

// Display full scoreboard
function displayFullScoreboard() {
    // Create array of teams with their scores
    const teams = results.scores.map((score, index) => ({
        teamNumber: index + 1,
        score: score
    }));
    
    // Sort by score (descending)
    teams.sort((a, b) => b.score - a.score);
    
    // Display scoreboard
    elements.finalScoreboard.innerHTML = '';
    
    teams.forEach((team, index) => {
        const scoreItem = document.createElement('div');
        scoreItem.className = 'final-score-item';
        
        const teamInfo = document.createElement('div');
        teamInfo.className = 'final-team';
        
        // Add rank emoji for top 3
        let rankEmoji = '';
        if (index === 0) {
            rankEmoji = '🥇 ';
        } else if (index === 1) {
            rankEmoji = '🥈 ';
        } else if (index === 2) {
            rankEmoji = '🥉 ';
        } else {
            rankEmoji = `${index + 1}. `;
        }
        
        teamInfo.textContent = `${rankEmoji}Team ${team.teamNumber}`;
        
        const scoreValue = document.createElement('div');
        scoreValue.className = 'final-score';
        scoreValue.textContent = team.score;
        
        scoreItem.appendChild(teamInfo);
        scoreItem.appendChild(scoreValue);
        
        elements.finalScoreboard.appendChild(scoreItem);
    });
}

// Play again with same configuration
function playAgain() {
    // Keep game config, clear results
    sessionStorage.removeItem('gameResults');
    window.location.href = 'game.html';
}

// Start new game (back to setup)
function newGame() {
    // Clear all stored data
    sessionStorage.clear();
    window.location.href = 'index.html';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
