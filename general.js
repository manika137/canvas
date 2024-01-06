// Drop down screen

function openNav() {
  document.getElementById("myNav").style.height = "100%";
}

function closeNav() {
  document.getElementById("myNav").style.height = "0%";
}

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
// window.onclick = function (event) {
//   if (!event.target.matches(".dropbtn")) {
//     var dropdowns = document.getElementsByClassName("dropdown-content");
//     var i;
//     for (i = 0; i < dropdowns.length; i++) {
//       var openDropdown = dropdowns[i];
//       if (openDropdown.classList.contains("show")) {
//         openDropdown.classList.remove("show");
//       }
//     }
//   }
// };

// Close the dropdown if the user clicks outside of it
// window.onclick = function (event) {
//   if (!event.target.matches(".dropdown button")) {
//     var dropdowns = document.getElementsByClassName("dropdown-content");
//     for (var i = 0; i < dropdowns.length; i++) {
//       var openDropdown = dropdowns[i];
//       if (openDropdown.style.display === "block") {
//         openDropdown.style.display = "none";
//       }
//     }
//   }
// };

let dropdownVisible = false; // Variable to track the dropdown visibility

function toggleDropdown() {
  if (!dropdownVisible) {
    document.getElementById("dropdownContent").style.display = "block";
    dropdownVisible = true;
  }
}

function closeDropdown() {
  document.getElementById("dropdownContent").style.display = "none";
  dropdownVisible = false;
}
