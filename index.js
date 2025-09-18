// ==================== HEADER MENU TOGGLE FUNCTIONALITY ====================

/**
 * Toggles the mobile menu visibility when the menu button is clicked
 * Adds click event listener to menu button to show/hide mobile menu
 */
function toggleMenu() {
    // Get references to menu button and mobile menu elements
    const menuBtn = document.getElementById("menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");

    // Add click event listener to menu button
    menuBtn.addEventListener("click", () => {
        // Toggle the 'hidden' class to show/hide the mobile menu
        mobileMenu.classList.toggle("hidden");
    });
}
// Initialize the menu toggle functionality
toggleMenu();

// ==================== HERO SECTION FORM VALIDATION ====================

/**
 * Handles form submission for the subscribe form
 * Validates email and password fields before submission
 * @param {Event} event - The form submission event
 * @returns {boolean} - Returns false if validation fails, true if successful
 */
const subscribeForm = (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    // Get values from form fields
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Validate that both fields are filled
    if (email === "" || password === "") {
        alert("Please fill in all fields");
        return false; // Return false if validation fails
    }

    // Log form data to console (for debugging purposes)
    console.log(`Email: ${email}, Password: ${password}`);

    // Clear form fields after successful submission
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";

    return true; // Return true if validation passes
};

// Get reference to the subscribe form and add click event listener
const form = document.getElementById("subscribeForm");
form.addEventListener("click", subscribeForm);

// ==================== TAB SECTION FUNCTIONALITY ====================

/**
 * Fetches all available levels from the API
 * Calls displayLevels function to render the levels
 */
const loadLevels = () => {
    const url = "https://openapi.programming-hero.com/api/levels/all";

    // Fetch levels data from API
    fetch(url)
        .then(res => res.json()) // Convert response to JSON format
        .then(comes => {
            // Pass the levels data to display function
            displayLevels(comes.data);
        })
        .catch(error => {
            // Handle any errors that occur during fetch
            console.log(error);
        });
};

/**
 * Displays all available levels as buttons
 * @param {Array} lessons - Array of lesson objects containing level data
 */
const displayLevels = (lessons) => {
    // Get reference to the levels container element
    const levelsContainer = document.getElementById("levels-container");

    // Clear any existing content in the container
    levelsContainer.innerHTML = "";

    // Loop through each lesson and create a button for it
    for (const lesson of lessons) {
        // Create a button element for the lesson
        const button = document.createElement("button");

        // Set button classes for styling
        button.className = " cursor-pointer lesson-btn px-6 py-3 rounded-lg shadow-md bg-white text-blue-700 font-semibold border border-blue-300 hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center gap-2";

        // Set button HTML content with icon and level number
        button.innerHTML = `
        <i class="fa-solid fa-book"></i>
        Level ${lesson.level_no}
      `;

        // Add click event listener to the button
        button.addEventListener("click", () => {
            // Remove active styling from all buttons
            document.querySelectorAll(".lesson-btn")
                .forEach(btn => {
                    btn.classList.remove("bg-blue-600", "text-white");
                    btn.classList.add("bg-white", "text-blue-700");
                });

            // Add active styling to the clicked button
            button.classList.remove("bg-white", "text-blue-700");
            button.classList.add("bg-blue-600", "text-white");

            // Load words for the selected level
            lessonsBtnClick(lesson.level_no);
        });

        // Add the button to the levels container
        levelsContainer.appendChild(button);
    }
};

/**
 * Handles click events on lesson buttons
 * Fetches words for the selected level and displays them
 * @param {number} id - The ID of the selected level
 */
const lessonsBtnClick = (id) => {
    console.log(id); // Log the selected level ID

    toggleSpinner(true); // Show loading spinner

    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    console.log(url); // Log the API URL

    // Fetch words for the selected level
    fetch(url)
        .then(res => res.json())
        .then(comes => {
            // Display the words in the UI
            displayWords(comes.data);
            console.log(comes.data); // Log the words data
        })
        .catch(error => {
            // Handle any errors that occur during fetch
            console.log(error);
        });
};

/**
 * Implements search functionality for words
 * Filters words based on user input in search bar
 */
const searchWord = () => {
    const searchInput = document.getElementById("search-bar"); // Get search input
    const searchButton = document.getElementById("search-btn"); // Get search button

    // Function to filter cards based on search text

    const filterCards = () => {
        const searchText = searchInput.value.trim().toLowerCase(); // Get search text
        const cards = document.querySelectorAll("#word-container > div");

        cards.forEach((card) => {
            const word = card.textContent.toLowerCase();
            if (word.includes(searchText)) {
                card.classList.remove("hidden");
            } else {
                card.classList.add("hidden");
            }
        });
    };

    // Real-time search as user types
    searchInput.addEventListener("input", filterCards);

    // Search on button click
     searchButton.addEventListener("click", filterCards);
};

// Initialize search
searchWord();


// Initialize the search functionality
searchWord();

// ==================== WORD DISPLAY FUNCTIONALITY ====================

/**
 * Displays words in the word container
 * @param {Array} words - Array of word objects to display
 */
const displayWords = (words) => {
    const wordContainer = document.getElementById("word-container");
    const infoSection = document.getElementById("info-section");

    // Show search bar when words are displayed
    document.getElementById("search-section").classList.remove("hidden");

    // Hide default info section when lesson is clicked
    if (infoSection) {
        infoSection.style.display = "none";
    }

    // Clear any existing content in the word container
    wordContainer.innerHTML = "";

    // Display message if no words are found
    if (words.length === 0 || words === undefined) {
        wordContainer.innerHTML = `
    <div class="col-span-full flex flex-col items-center justify-center p-10 rounded-xl ">
      <img src="/assets/alert-error.png" alt="empty" class="w-28 h-28 object-contain mb-6 opacity-80" />
      <h2 class="text-2xl font-bold text-gray-800 mb-2">No Words Found</h2>
      <p class="text-gray-600 text-center font-bangla">
        এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।  
        নতুন শব্দ যুক্ত হলে এখানে দেখতে পাবেন।
      </p>
    </div>
  `;
        toggleSpinner(false); // Hide loading spinner
        return; // Exit function early
    }

    // Loop through each word and create a card for it
    words.forEach(word => {
        const div = document.createElement("div");

        // Set card classes for styling
        div.className = "bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl h-[260px] flex flex-col justify-between shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 border border-blue-100";

        // Set card HTML content with word information
        div.innerHTML = `
    <div>
      <h2 class="text-2xl font-bold text-gray-800 mb-2">${word.word ? word.word : "No Words Found"}</h2>
      <p class="text-gray-500 text-sm">Meaning / Pronunciation</p>
      <span class="text-blue-700 font-medium mt-3 block font-bangla text-lg">
        ${word.meaning ? word.meaning : "No Words Found"}  
        <span class="text-gray-500">/</span>  
        ${word.pronunciation ? word.pronunciation : "No Words Found"}
      </span>
    </div>

    <div class="flex items-center justify-between mt-4">
      <button class=" cursor-pointer show-modal flex items-center gap-2 text-gray-600 hover:text-blue-600 bg-blue-50 px-3 py-2 rounded-lg shadow-sm transition-all duration-200">
        <i class="fa-solid fa-circle-info"></i>
        <span class="text-sm font-medium">Details</span>
      </button>
      <button class=" cursor-pointer listen-btn flex items-center gap-2 text-gray-600 hover:text-blue-600 bg-blue-50 px-3 py-2 rounded-lg shadow-sm transition-all duration-200">
        <i class="fa-solid fa-volume-high"></i>
        <span class="text-sm font-medium">Listen</span>
      </button>
    </div>
  `;

        // Add event listener to modal button
        const modalButton = div.querySelector(".show-modal");
        modalButton.addEventListener("click", () => {
            showWordDetails(word.id); // Show word details in modal
        });

        // Add event listener to listen button
        const listenButton = div.querySelector(".listen-btn");
        listenButton.addEventListener("click", () => {
            pronounceWord(word.word); // Pronounce the word
            console.log(word.word); // Log the word being pronounced
        });

        // Add the card to the word container
        wordContainer.appendChild(div);
        toggleSpinner(false); // Hide loading spinner
    });

    /**
     * Pronounces a word using the browser's speech synthesis API
     * @param {string} word - The word to pronounce
     */
    const pronounceWord = (word) => {
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'en-EN'; // Set language to English
        window.speechSynthesis.speak(utterance); // Speak the word
    };
};

/**
 * Fetches detailed information about a specific word
 * @param {number} id - The ID of the word to fetch details for
 */
const showWordDetails = (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;

    // Fetch word details from API
    fetch(url)
        .then(res => res.json())
        .then(data => {
            displayWordDetails(data.data); // Display word details in modal
        })
        .catch(err => console.log(err)); // Handle errors
};

// ==================== LOADING SPINNER FUNCTIONALITY ====================

/**
 * Shows or hides the loading spinner
 * @param {boolean} show - Whether to show the spinner (true) or hide it (false)
 */
const toggleSpinner = (show) => {
    const spinner = document.getElementById("loading-spinner");
    const wordContainer = document.getElementById("word-container");

    if (show) {
        spinner.classList.remove("hidden"); // Show spinner
        wordContainer.classList.add("pointer-events-none"); // Disable interactions with word container
    } else {
        spinner.classList.add("hidden"); // Hide spinner
        wordContainer.classList.remove("pointer-events-none"); // Enable interactions with word container
    }
};

/**
 * Displays word details in the modal
 * @param {Object} word - The word object containing detailed information
 */
const displayWordDetails = (word) => {
    const modalBody = document.getElementById("modal-body");

    // Set modal content with word details
    modalBody.innerHTML = `
        <h2 class="text-3xl font-bold mb-2">${word.word || "No Word Found"}</h2>
        <p class="text-gray-500 mb-2"><span class="font-semibold">Part of Speech:</span> ${word.partsOfSpeech || "N/A"}</p>
        <p class="text-gray-500 mb-2"><span class="font-semibold">Level:</span> ${word.level || "N/A"} | <span class="font-semibold">Points:</span> ${word.points || 0}</p>
        <p class="text-gray-600 mb-2"><span class="font-semibold">Meaning / Pronunciation:</span></p>
        <p class="text-lg font-bangla text-blue-700">
          ${word.meaning || "N/A"} / ${word.pronunciation || "N/A"}
        </p>
        <p class="text-gray-600 mb-2"><span class="font-semibold">Sentence:</span></p>
        <p class="italic text-gray-700">${word.sentence || "N/A"}</p>
        <p class="text-gray-600 mb-2"><span class="font-semibold">Synonyms:</span></p>
        <ul class="list-disc list-inside text-gray-700">
          ${word.synonyms && word.synonyms.length > 0
            ? word.synonyms.map(s => `<li>${s}</li>`).join("")
            : "<li>N/A</li>"}
        </ul>
      `;

    // Show the modal
    const modal = document.getElementById("modal");
    modal.classList.add("modal-open");
};

// Add event listener to close modal button
document.getElementById("close-modal").addEventListener("click", () => {
    const modal = document.getElementById("modal");
    modal.classList.remove("modal-open"); // Hide the modal
});

// ==================== INITIALIZATION ====================

// Load levels when the page loads
loadLevels();

// ==================== FAQ SECTION FUNCTIONALITY ====================

// Get all FAQ buttons
const faqButtons = document.querySelectorAll(".faq-btn");

// Add click event listeners to each FAQ button
faqButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const content = btn.nextElementSibling; // Get the content element
        const icon = btn.querySelector(".faq-icon"); // Get the icon element

        // Toggle content visibility
        content.classList.toggle("hidden");

        // Toggle icon between plus and minus
        if (content.classList.contains("hidden")) {
            icon.textContent = "+"; // Show plus icon when content is hidden
        } else {
            icon.textContent = "−"; // Show minus icon when content is visible
        }
    });
});