// game.js - Core game engine and logic

// Game state
let gameState = {
    config: null,
    allQuestions: [],
    usedQuestionIds: new Set(),
    currentRound: 1,
    currentTeamIndex: 0,
    scores: [],
    currentQuestion: null,
    timerInterval: null,
    timeRemaining: 0,
    totalCircumference: 283 // 2 * PI * 45 (radius of circle)
};

// DOM elements
const elements = {
    currentRound: document.getElementById('currentRound'),
    totalRounds: document.getElementById('totalRounds'),
    currentTeam: document.getElementById('currentTeam'),
    scoreboard: document.getElementById('scoreboard'),
    questionText: document.getElementById('questionText'),
    answerSection: document.getElementById('answerSection'),
    answerText: document.getElementById('answerText'),
    showAnswerBtn: document.getElementById('showAnswerBtn'),
    scoringButtons: document.getElementById('scoringButtons'),
    correctBtn: document.getElementById('correctBtn'),
    wrongBtn: document.getElementById('wrongBtn'),
    timerText: document.getElementById('timerText'),
    timerCircle: document.getElementById('timerCircle'),
    topicBadge: document.getElementById('topicBadge')
};

// Initialize the game
async function init() {
    // Get configuration from sessionStorage
    const configStr = sessionStorage.getItem('gameConfig');
    if (!configStr) {
        alert('No game configuration found. Redirecting to setup...');
        window.location.href = 'index.html';
        return;
    }
    
    gameState.config = JSON.parse(configStr);
    
    // Initialize scores
    gameState.scores = Array(gameState.config.numTeams).fill(0);
    
    // Load questions from selected topics
    await loadQuestions();
    
    // Check if we have enough questions
    const totalQuestionsNeeded = gameState.config.numTeams * gameState.config.numRounds;
    if (gameState.allQuestions.length < totalQuestionsNeeded) {
        alert(`Warning: Not enough questions! You need ${totalQuestionsNeeded} questions but only have ${gameState.allQuestions.length}. The game may repeat questions.`);
    }
    
    // Setup UI
    setupUI();
    
    // Setup event listeners
    setupEventListeners();
    
    // Start the first question
    startNewQuestion();
}

// Load questions from JSON files
async function loadQuestions() {
    const loadPromises = gameState.config.selectedTopics.map(topicFile => 
        fetch(`data/${topicFile}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${topicFile}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error(`Error loading ${topicFile}:`, error);
                return { topic: 'Unknown', questions: [] };
            })
    );
    
    const topicData = await Promise.all(loadPromises);
    
    // Combine all questions with their topic information
    topicData.forEach(data => {
        data.questions.forEach(q => {
            gameState.allQuestions.push({
                ...q,
                topicName: data.topic
            });
        });
    });
    
    // Shuffle all questions
    shuffleArray(gameState.allQuestions);
}

// Shuffle array (Fisher-Yates algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Setup UI elements
function setupUI() {
    elements.totalRounds.textContent = gameState.config.numRounds;
    updateScoreboard();
}

// Setup event listeners
function setupEventListeners() {
    elements.showAnswerBtn.addEventListener('click', showAnswer);
    elements.correctBtn.addEventListener('click', () => handleAnswer(true));
    elements.wrongBtn.addEventListener('click', () => handleAnswer(false));
}

// Update scoreboard display
function updateScoreboard() {
    elements.scoreboard.innerHTML = '';
    
    gameState.scores.forEach((score, index) => {
        const scoreItem = document.createElement('div');
        scoreItem.className = 'score-item';
        if (index === gameState.currentTeamIndex) {
            scoreItem.classList.add('active');
        }
        
        const teamName = document.createElement('div');
        teamName.className = 'score-team-name';
        teamName.textContent = `Team ${index + 1}`;
        
        const scoreValue = document.createElement('div');
        scoreValue.className = 'score-value';
        scoreValue.textContent = score;
        
        scoreItem.appendChild(teamName);
        scoreItem.appendChild(scoreValue);
        elements.scoreboard.appendChild(scoreItem);
    });
}

// Start a new question
function startNewQuestion() {
    // Reset UI
    elements.answerSection.style.display = 'none';
    elements.showAnswerBtn.style.display = 'block';
    elements.scoringButtons.style.display = 'none';
    
    // Update round and team display
    elements.currentRound.textContent = gameState.currentRound;
    elements.currentTeam.textContent = `Team ${gameState.currentTeamIndex + 1}`;
    updateScoreboard();
    
    // Get a random question that hasn't been used
    gameState.currentQuestion = getRandomUnusedQuestion();
    
    if (!gameState.currentQuestion) {
        // This shouldn't happen if we validated properly, but just in case
        alert('No more questions available!');
        endGame();
        return;
    }
    
    // Display question
    elements.questionText.textContent = gameState.currentQuestion.question;
    elements.answerText.textContent = gameState.currentQuestion.answer;
    elements.topicBadge.textContent = gameState.currentQuestion.topicName;
    
    // Start timer
    startTimer();
}

// Get a random unused question
function getRandomUnusedQuestion() {
    // Filter out used questions
    const unusedQuestions = gameState.allQuestions.filter(
        q => !gameState.usedQuestionIds.has(q.id)
    );
    
    if (unusedQuestions.length === 0) {
        // If we've used all questions, reset the used questions set
        // This allows questions to be reused if necessary
        gameState.usedQuestionIds.clear();
        return gameState.allQuestions[Math.floor(Math.random() * gameState.allQuestions.length)];
    }
    
    const randomIndex = Math.floor(Math.random() * unusedQuestions.length);
    const selectedQuestion = unusedQuestions[randomIndex];
    
    // Mark as used
    gameState.usedQuestionIds.add(selectedQuestion.id);
    
    return selectedQuestion;
}

// Start countdown timer
function startTimer() {
    gameState.timeRemaining = gameState.config.secondsPerQuestion;
    updateTimerDisplay();
    
    gameState.timerInterval = setInterval(() => {
        gameState.timeRemaining--;
        updateTimerDisplay();
        
        if (gameState.timeRemaining <= 0) {
            clearInterval(gameState.timerInterval);
            // Auto-show answer when time runs out
            showAnswer();
        }
    }, 1000);
}

// Update timer display
function updateTimerDisplay() {
    elements.timerText.textContent = gameState.timeRemaining;
    
    // Calculate progress
    const progress = gameState.timeRemaining / gameState.config.secondsPerQuestion;
    const offset = gameState.totalCircumference * (1 - progress);
    elements.timerCircle.style.strokeDashoffset = offset;
    
    // Change color based on time remaining
    if (gameState.timeRemaining <= 5) {
        elements.timerCircle.classList.add('danger');
        elements.timerCircle.classList.remove('warning');
    } else if (gameState.timeRemaining <= 10) {
        elements.timerCircle.classList.add('warning');
        elements.timerCircle.classList.remove('danger');
    } else {
        elements.timerCircle.classList.remove('warning', 'danger');
    }
}

// Show answer
function showAnswer() {
    // Stop timer
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
    
    // Show answer and scoring buttons
    elements.answerSection.style.display = 'block';
    elements.showAnswerBtn.style.display = 'none';
    elements.scoringButtons.style.display = 'flex';
}

// Handle answer (correct or wrong)
function handleAnswer(isCorrect) {
    // Update score
    if (isCorrect) {
        gameState.scores[gameState.currentTeamIndex]++;
    }
    
    // Move to next team
    gameState.currentTeamIndex++;
    
    // Check if round is complete
    if (gameState.currentTeamIndex >= gameState.config.numTeams) {
        gameState.currentTeamIndex = 0;
        gameState.currentRound++;
        
        // Check if game is complete
        if (gameState.currentRound > gameState.config.numRounds) {
            endGame();
            return;
        }
    }
    
    // Small delay before next question for better UX
    setTimeout(() => {
        startNewQuestion();
    }, 500);
}

// End game and navigate to results
function endGame() {
    // Store final scores
    const results = {
        scores: gameState.scores,
        numRounds: gameState.config.numRounds,
        numTeams: gameState.config.numTeams
    };
    
    sessionStorage.setItem('gameResults', JSON.stringify(results));
    
    // Navigate to results page
    window.location.href = 'results.html';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
