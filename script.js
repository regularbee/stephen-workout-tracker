function calculateWeight(exercise) {
    // Get the weight entered by the user
    let weight = document.getElementById(exercise + "-weight").value;

    // If the user hasn't entered a weight, show an alert
    if (!weight) {
        alert("Please enter a weight.");
        return;
    }

    // Convert the weight to a number
    weight = parseFloat(weight);

    // Calculate 5% and 10% more
    let weight5 = (weight * 1.05).toFixed(2); // +5% weight
    let weight10 = (weight * 1.10).toFixed(2); // +10% weight

    // Display the calculated weights
    alert(`For ${exercise.charAt(0).toUpperCase() + exercise.slice(1)}:\n+5% Weight: ${weight5} lbs\n+10% Weight: ${weight10} lbs`);
}

// Function to load and display workout data from the CSV file
function loadWorkoutData() {
    Papa.parse('workout_data_stephen.csv', {
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
            <td><button onclick="calculateWeight(${exercise['Weight Used (lbs)']})">Calculate</button></td>
        `;
        
        tableBody.appendChild(row);
    });
}



// Call loadWorkoutData() when the page loads
window.onload = loadWorkoutData;

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


Papa.parse('workout_data_stephen.csv', {
    download: true,
    header: true,
    dynamicTyping: true,
    complete: function(results) {
        const workoutData = results.data;

        // Populate the exercise dropdown
        const exerciseSelect = document.getElementById('exercise-select');
        const exercises = [...new Set(workoutData.map(ex => ex.Exercise))];  // Get unique exercises

        exercises.forEach(exercise => {
            const option = document.createElement('option');
            option.value = exercise;
            option.textContent = exercise;
            exerciseSelect.appendChild(option);
        });

        // Display workout data in the table
        displayWorkoutTable(workoutData);

        // Filter data based on the selected exercise
        exerciseSelect.addEventListener('change', function() {
            const selectedExercise = exerciseSelect.value;
            const filteredData = selectedExercise ? workoutData.filter(ex => ex.Exercise === selectedExercise) : workoutData;
            displayWorkoutTable(filteredData);
        });
    }
});

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
            <td><input type="number" value="${exercise['Weight Used (lbs)']}" class="weight-input" /></td>
            <td><button onclick="calculateWeight(${exercise['Weight Used (lbs)']})">Calculate</button></td>
        `;
        
        tableBody.appendChild(row);
    });
}


    createWeightChart(exampleData); // You can replace exampleData with real data
};

