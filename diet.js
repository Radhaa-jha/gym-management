// Sample initial meals data
      // dietjs.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
  remove
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
// add your Firebase configuration
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Get today's date in yyyy-mm-dd
const today = new Date().toISOString().split('T')[0];

// Reference path: /meals/yyyy-mm-dd/
const mealsRef = ref(db, 'meals/' + today);

// Submit Meal
document.getElementById('meal-form').addEventListener('submit', e => {
  e.preventDefault();

  const type = document.getElementById('meal-type').value;
  const time = document.getElementById('meal-time').value;
  const food = document.getElementById('food-name').value;
  const calories = parseInt(document.getElementById('calories').value);
  const protein = parseFloat(document.getElementById('protein').value || 0);
  const notes = document.getElementById('notes').value;

  const meal = {
    type,
    time,
    foods: [
      {
        name: food,
        calories,
        protein
      }
    ],
    notes,
    timestamp: new Date().toISOString()
  };

  const newMealRef = push(mealsRef);
  set(newMealRef, meal).then(() => {
    alert("Meal added successfully!");
    document.getElementById('meal-form').reset();
  });
});

// Load Meals
onValue(mealsRef, snapshot => {
  const container = document.getElementById('meals-container');
  container.innerHTML = ''; // Clear previous

  if (!snapshot.exists()) {
    container.innerHTML = '<p>No meals added today.</p>';
    return;
  }

  snapshot.forEach(child => {
    const meal = child.val();
    const mealId = child.key;

    const totalCalories = meal.foods.reduce((sum, f) => sum + f.calories, 0);

    const card = document.createElement('div');
    card.className = 'meal-card';

    card.innerHTML = `
      <button class="delete-btn" data-id="${mealId}">
        <i class="fas fa-trash"></i>
      </button>
      <div class="meal-header">
        <div class="meal-title">${capitalize(meal.type)}</div>
        <div class="meal-time">${meal.time}</div>
      </div>
      ${meal.foods.map(f => `
        <div class="food-item">
          <div class="food-name">${f.name}</div>
          <div class="calories">${f.calories} cal</div>
        </div>
      `).join('')}
      <div class="totals">
        <div>Total:</div>
        <div class="calories">${totalCalories} cal</div>
      </div>
    `;

    container.appendChild(card);

    // Delete button functionality
    card.querySelector('.delete-btn').addEventListener('click', () => {
      if (confirm("Delete this meal?")) {
        remove(ref(db,` meals/${today}/${mealId}`));
      }
    });
  });
});

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}