// setup.js - Game configuration and setup

// Available topics (update this array if you add more topic files)
const AVAILABLE_TOPICS = [
    { name: 'History', file: 'history.json' },
    { name: 'Science', file: 'science.json' },
    { name: 'Sports', file: 'sports.json' },
    { name: 'Geography', file: 'geography.json' },
    { name: 'Entertainment', file: 'entertainment.json' }
];

// DOM elements
const setupForm = document.getElementById('setupForm');
const topicsContainer = document.getElementById('topicsContainer');
const secondsSlider = document.getElementById('secondsPerQuestion');
const secondsDisplay = document.getElementById('secondsDisplay');

// Initialize the setup page
function init() {
    renderTopicCheckboxes();
    setupEventListeners();
}

// Render topic checkboxes dynamically
function renderTopicCheckboxes() {
    topicsContainer.innerHTML = '';
    
    AVAILABLE_TOPICS.forEach(topic => {
        const checkboxWrapper = document.createElement('div');
        checkboxWrapper.className = 'topic-checkbox';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `topic-${topic.file}`;
        checkbox.name = 'topics';
        checkbox.value = topic.file;
        
        const label = document.createElement('label');
        label.htmlFor = `topic-${topic.file}`;
        label.textContent = topic.name;
        
        checkboxWrapper.appendChild(checkbox);
        checkboxWrapper.appendChild(label);
        topicsContainer.appendChild(checkboxWrapper);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Update slider value display
    secondsSlider.addEventListener('input', (e) => {
        secondsDisplay.textContent = `${e.target.value}s`;
    });
    
    // Form submission
    setupForm.addEventListener('submit', handleFormSubmit);
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const numTeams = parseInt(document.getElementById('numTeams').value);
    const secondsPerQuestion = parseInt(document.getElementById('secondsPerQuestion').value);
    const numRounds = parseInt(document.getElementById('numRounds').value);
    
    // Get selected topics
    const selectedTopics = Array.from(document.querySelectorAll('input[name="topics"]:checked'))
        .map(checkbox => checkbox.value);
    
    // Validate inputs
    if (!validateInputs(numTeams, selectedTopics, numRounds)) {
        return;
    }
    
    // Store configuration in sessionStorage
    const gameConfig = {
        numTeams,
        secondsPerQuestion,
        selectedTopics,
        numRounds
    };
    
    sessionStorage.setItem('gameConfig', JSON.stringify(gameConfig));
    
    // Navigate to game page
    window.location.href = 'game.html';
}

// Validate form inputs
function validateInputs(numTeams, selectedTopics, numRounds) {
    if (numTeams < 1 || numTeams > 10) {
        alert('Please enter a valid number of teams (1-10)');
        return false;
    }
    
    if (selectedTopics.length === 0) {
        alert('Please select at least one topic');
        return false;
    }
    
    if (numRounds < 1 || numRounds > 20) {
        alert('Please enter a valid number of rounds (1-20)');
        return false;
    }
    
    return true;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
