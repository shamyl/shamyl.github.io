// Get the theme toggle button element
var themeToggle = document.getElementById('theme-toggle');

// Function to toggle the dark theme
function toggleDarkTheme() {
  document.body.classList.toggle('dark-theme');
  document.getElementById("theme-toggle").innerHTML = "Mode";
}

// Event listener for the theme toggle button
themeToggle.addEventListener('click', toggleDarkTheme);