// Function to load the CSV data and display it in the table
function loadCSVData() {
    Papa.parse('workout-data_stephen.csv', {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: function(results) {
            console.log(results);
            const exercises = results.data;

            // Populate the dropdown with exercise names
            const exerciseSelect = document.getElementById('exercise-select');
            exercises.forEach(exercise => {
                let option = document.createElement('option');
                option.value = exercise.Exercise;
                option.textContent = exercise.Exercise;
                exerciseSelect.appendChild(option);
            });

            // Handle the change of exercise selection
            exerciseSelect.addEventListener('change', function() {
                updateTable(exerciseSelect.value, exercises);
            });

            // Initially show all exercises
            updateTable('', exercises);
        }
    });
}

// Function to update the table based on selected exercise
function updateTable(exerciseFilter, exercises) {
    const tableBody = document.getElementById('workout-table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear the table

    exercises.filter(exercise => {
        return !exerciseFilter || exercise.Exercise === exerciseFilter;
    }).forEach(exercise => {
        const row = tableBody.insertRow();

        const exerciseCell = row.insertCell(0);
        const setsRepsCell = row.insertCell(1);
        const rpeCell = row.insertCell(2);
        const weightUsedCell = row.insertCell(3);
        const sessionCell = row.insertCell(4);

        exerciseCell.textContent = exercise.Exercise;
        setsRepsCell.textContent = exercise['Sets x Reps'];
        rpeCell.textContent = exercise.RPE;
        weightUsedCell.innerHTML = `<input type="number" class="weight-input" id="weight-${exercise.Exercise}" placeholder="Enter weight" />`;
        sessionCell.innerHTML = `<span class="session-output" id="session-${exercise.Exercise}">5%: 0 | 10%: 0</span>`;

        // Add event listener to the weight input to calculate the percentages when the user enters a value
        const weightInput = document.getElementById(`weight-${exercise.Exercise}`);
        weightInput.addEventListener('input', function() {
            calculateWeight(exercise.Exercise);
        });
    });
}

// Function to calculate weight increase automatically when weight is entered
function calculateWeight(exerciseName) {
    const weightInput = document.getElementById(`weight-${exerciseName}`);
    const sessionOutput = document.getElementById(`session-${exerciseName}`);

    if (!weightInput || !sessionOutput) {
        console.error(`Weight input or session output for ${exerciseName} not found!`);
        return;
    }

    const weight = parseFloat(weightInput.value);

    if (isNaN(weight)) {
        sessionOutput.textContent = '5%: 0 | 10%: 0'; // Reset if the value is invalid
        return;
    }

    // Calculate 5% and 10% increments
    const fivePercentIncrease = weight * 1.05;
    const tenPercentIncrease = weight * 1.10;

    // Display the results in the session output field
    sessionOutput.textContent = `5%: ${fivePercentIncrease.toFixed(1)} | 10%: ${tenPercentIncrease.toFixed(1)}`;
}

// Function to load and display workout data from the CSV file
function loadWorkoutData() {
    Papa.parse('workout-data_stephen.csv', {
        download: true,
        header: true, // Treats the first row as headers
        dynamicTyping: true,
        complete: function(results) {
            displayWorkoutTable(results.data);  // Process the CSV data
        }
    });
}

function displayWorkoutTable(workoutData) {
    const tableBody = document.querySelector('#workout-table tbody');
    
    // Clear existing rows
    tableBody.innerHTML = '';

    workoutData.forEach(exercise => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${exercise.Exercise}</td>
            <td>${exercise['Sets x Reps'] || 'N/A'}</td>
            <td>${exercise.RPE || 'N/A'}</td>
            <td>${exercise['Weight Used (lbs)']}</td>
            <td>${exercise.Session}</td> <!-- Display the session -->
        `;
        
        tableBody.appendChild(row);
    });
}

// Create the weight chart when the page loads
let weightChart; // Global variable for the chart

function createWeightChart(weightData) {
    const ctx = document.getElementById('weightChart').getContext('2d');
    
    // If the chart already exists, destroy it and create a new one
    if (weightChart) {
        weightChart.destroy();
    }
    
    weightChart = new Chart(ctx, {
        type: 'line', // Line chart for tracking weight over time
        data: {
            labels: weightData.dates, // Dates of the workout sessions
            datasets: [{
                label: 'Weight Used (lbs)',
                data: weightData.weights, // The weights used for each session
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: false,
                lineTension: 0.1
            }]
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Example of data to use for the graph
const exampleData = {
    dates: ['Session 1', 'Session 2', 'Session 3', 'Session 4'],
    weights: [150, 155, 160, 165]
};

// Create the chart when the page loads
window.onload = function() {
    loadWorkoutData();
    createWeightChart(exampleData); // You can replace exampleData with real data
};
