let workoutData = null;
let selectedWeek = 5;
let selectedDay = null;

// Load the JSON data
async function loadData() {
    try {
        const response = await fetch('current.json');
        const data = await response.json();
        workoutData = data.program;
        
        // Set program title and subtitle
        document.getElementById('program-title').textContent = workoutData.title;
        document.getElementById('program-subtitle').textContent = workoutData.subtitle;
        
        // Initialize the UI
        renderWeekButtons();
        updatePhaseInfo();
        renderDayGrid();
    } catch (error) {
        console.error('Error loading workout data:', error);
        document.getElementById('day-grid').innerHTML = '<p style="color: #dc2626;">Error loading workout data. Please check that current.json is in the same directory.</p>';
    }
}

function renderWeekButtons() {
    const weekButtonsContainer = document.getElementById('week-buttons');
    weekButtonsContainer.innerHTML = '';
    
    const weeks = Object.keys(workoutData.weeks);
    weeks.forEach((week, index) => {
        const btn = document.createElement('button');
        btn.className = 'week-btn';
        if (index === 0) btn.classList.add('active');
        btn.dataset.week = week;
        btn.innerHTML = `
            <div class="week-label">WEEK</div>
            <div class="week-num">${week}</div>
        `;
        btn.addEventListener('click', () => selectWeek(week));
        weekButtonsContainer.appendChild(btn);
    });
}

function selectWeek(week) {
    selectedWeek = week;
    
    document.querySelectorAll('.week-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.week === week);
    });
    
    updatePhaseInfo();
    renderDayGrid();
}

function updatePhaseInfo() {
    const weekData = workoutData.weeks[selectedWeek];
    document.getElementById('phase-title').textContent = weekData.phase;
    document.getElementById('phase-goal').textContent = weekData.goal;
}

function renderDayGrid() {
    const dayGrid = document.getElementById('day-grid');
    dayGrid.innerHTML = '';
    
    const days = workoutData.weeks[selectedWeek].days;
    days.forEach(day => {
        const card = document.createElement('button');
        card.className = 'day-card';
        card.innerHTML = `
            <div class="day-header">
                <div class="day-num">DAY ${day.day}</div>
                <svg width="20" height="20" fill="none" stroke="#404040" viewBox="0 0 24 24">
                    <polyline points="9 18 15 12 9 6" stroke-width="2"></polyline>
                </svg>
            </div>
            <div class="day-name">${day.name}</div>
            <div class="day-blocks">${day.blocks.length} blocks</div>
        `;
        card.addEventListener('click', () => showWorkout(day.day));
        dayGrid.appendChild(card);
    });
}

function showWorkout(day) {
    selectedDay = day;
    const dayData = workoutData.weeks[selectedWeek].days.find(d => d.day === day);
    
    document.getElementById('workout-label').textContent = `WEEK ${selectedWeek} / DAY ${day}`;
    document.getElementById('workout-title').textContent = dayData.name;
    
    const blocksContainer = document.getElementById('workout-blocks');
    blocksContainer.innerHTML = '';
    
    dayData.blocks.forEach(block => {
        const blockDiv = document.createElement('div');
        blockDiv.className = 'block';
        
        const blockType = getBlockType(block.header);
        const blockLabel = block.label || block.header;
        
        let html = `<div class="block-header ${blockType}">${blockLabel}</div>`;
        
        if (block.note) {
            html += `<div class="block-note">${block.note}</div>`;
        }
        
        html += '<ul class="exercise-list">';
        block.exercises.forEach(exercise => {
            html += `<li class="exercise-item">${exercise}</li>`;
        });
        html += '</ul>';
        
        blockDiv.innerHTML = html;
        blocksContainer.appendChild(blockDiv);
    });
    
    document.getElementById('selection-view').classList.add('hidden');
    document.getElementById('workout-view').classList.add('active');
}

function getBlockType(header) {
    if (header === 'WU') return 'wu';
    if (header === 'FIN') return 'fin';
    return 'work';
}

function showSelection() {
    selectedDay = null;
    document.getElementById('selection-view').classList.remove('hidden');
    document.getElementById('workout-view').classList.remove('active');
}

// Event listener for back button
document.getElementById('back-btn').addEventListener('click', showSelection);

// Load data on page load
loadData();