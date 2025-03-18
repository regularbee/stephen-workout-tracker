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
