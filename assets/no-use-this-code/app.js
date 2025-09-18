
// header menu
function toggleMenu() {
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });

}
toggleMenu();


// hero section form vaildation
const subscribeForm = (event) => {
  event.preventDefault(); // prevent form submission
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (email === "" || password === "") {
    alert("Please fill in all fields");
    return false;
  }
  console.log(`Email: ${email}, Password: ${password}`)

  // clear form fields
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  return true;

}
const form = document.getElementById("subscribeForm")
form.addEventListener("click", subscribeForm)


// tab scection 

const loadLevels = () => {
  const url = "https://openapi.programming-hero.com/api/levels/all";
  fetch(url)
    .then(res => res.json()) // convert to json
    .then(comes => {
      displayLevels(comes.data)
    })
    .catch(error => {
      console.log(error)

    })
}
// display levels
const displayLevels = (lessons) => {
  //1. get the container
  const levelsContainer = document.getElementById("levels-container")
  //2. emplty the container
  levelsContainer.innerHTML = "";
  //3. create a loop
  for (const lesson of lessons) {
    // console.log(lesson)
    const button = document.createElement("button")
    button.className = " lesson-btn px-6 py-3 rounded-lg shadow-md bg-white text-blue-700 font-semibold border border-blue-300 hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center gap-2"

    button.innerHTML = `
        <i class="fa-solid fa-book"></i>
        Level ${lesson.level_no}
      `
    button.addEventListener("click", () => {
      document.querySelectorAll(".lesson-btn")
        .forEach(btn => {
          // after click remove bg and text
          btn.classList.remove("bg-blue-600", "text-white");
          btn.classList.add("bg-white", "text-blue-700");
          // after click remove bg and text
          button.classList.remove("bg-white", "text-blue-700");
          button.classList.add("bg-blue-600", "text-white");

        })
      lessonsBtnClick(lesson.level_no)
    })

    levelsContainer.appendChild(button)

  }
  //
}
// lessons click
const lessonsBtnClick = (id) => {
  console.log(id)
  toggleSpinner(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  console.log(url)
  fetch(url)

    .then(res => res.json())
    .then(comes => {
      displayWords(comes.data)
      console.log(comes.data)
    })
    .catch(error => {
      console.log(error)

    })

}
// search word
const searchWord = () => {
  const searchInput = document.getElementById("search-bar");
  searchInput.addEventListener("input", (e) => {
    const searchText = e.target.value.toLowerCase();
    const cards = document.querySelectorAll("#word-container > div");
    cards.forEach((card) => {
      const word = card.textContent.toLowerCase();
      if (word.includes(searchText)) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    })
  })
}
searchWord()
// word section
const displayWords = (words) => {
  const wordContainer = document.getElementById("word-container");
  const infoSection = document.getElementById("info-section");
  
  // Show search bar

  document.getElementById("search-section").classList.remove("hidden");

  // Hide default info section when lesson clicked
  if (infoSection) {
    infoSection.style.display = "none";
  }
  wordContainer.innerHTML = "";

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
    toggleSpinner(false);

    return;
  }

  words.forEach(word => {
    const div = document.createElement("div");
    div.className =
      "bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl h-[260px] flex flex-col justify-between shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 border border-blue-100";

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
      <button class=" show-modal flex items-center gap-2 text-gray-600 hover:text-blue-600 bg-blue-50 px-3 py-2 rounded-lg shadow-sm transition-all duration-200">
        <i class="fa-solid fa-circle-info"></i>
        <span class="text-sm font-medium">Details</span>
      </button>
      <button class=" listen-btn flex items-center gap-2 text-gray-600 hover:text-blue-600 bg-blue-50 px-3 py-2 rounded-lg shadow-sm transition-all duration-200">
        <i class="fa-solid fa-volume-high"></i>
        <span class="text-sm font-medium">Listen</span>
      </button>
    </div>
  `;

    // Modal button
    const modalButton = div.querySelector(".show-modal");
    modalButton.addEventListener("click", () => {
      showWordDetails(word.id); // pass id

    });
    // Listen button
    const listenButton = div.querySelector(".listen-btn");
    listenButton.addEventListener("click", () => {
      pronounceWord(word.word)
      console.log(word.word)
    })


    wordContainer.appendChild(div);
    toggleSpinner(false);
  });

  // Function to pronounce a word
  const pronounceWord = (word) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-EN'; // You can change this to 'en-US' if you prefer
    window.speechSynthesis.speak(utterance);
  };


}
// show word details
const showWordDetails = (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      displayWordDetails(data.data)
    })

    .catch(err => console.log(err));

};

// toggle spinner
const toggleSpinner = (show) => {

  const spinner = document.getElementById("loading-spinner");
  const wordContainer = document.getElementById("word-container");

  if (show) {
    spinner.classList.remove("hidden");
    wordContainer.classList.add("pointer-events-none");

  } else {
    spinner.classList.add("hidden");
    wordContainer.classList.remove("pointer-events-none");
  }
}
const displayWordDetails = (word) => {
  const modalBody = document.getElementById("modal-body");
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

  const modal = document.getElementById("modal");
  modal.classList.add("modal-open");

}
// Close modal button
document.getElementById("close-modal").addEventListener("click", () => {
  const modal = document.getElementById("modal");
  modal.classList.remove("modal-open");
});


loadLevels()


// faq section 
const faqButtons = document.querySelectorAll(".faq-btn");

faqButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const content = btn.nextElementSibling;
    const icon = btn.querySelector(".faq-icon");

    // Toggle visibility
    content.classList.toggle("hidden");

    // Toggle icon
    if (content.classList.contains("hidden")) {
      icon.textContent = "+";
    } else {
      icon.textContent = "−";
    }
  });
});

