// Get the theme toggle button element
var themeToggle = document.getElementById('theme-toggle');

// Function to toggle the dark theme
function toggleDarkTheme() {
  document.body.classList.toggle('dark-theme');
  document.getElementById("themeToggle").innerHTML = "18 degrees";
}

// Event listener for the theme toggle button
themeToggle.addEventListener('click', toggleDarkTheme);