// Morse Code Dictionary
const morseCode = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",
  1: ".----",
  2: "..---",
  3: "...--",
  4: "....-",
  5: ".....",
  6: "-....",
  7: "--...",
  8: "---..",
  9: "----.",
  0: "-----",
  ".": ".-.-.-",
  ",": "--..--",
  "?": "..--..",
  "'": ".----.",
  "!": "-.-.--",
  "/": "-..-.",
  "(": "-.--.",
  ")": "-.--.-",
  "&": ".-...",
  ":": "---...",
  ";": "-.-.-.",
  "=": "-...-",
  "+": ".-.-.",
  "-": "-....-",
  _: "..--.-",
  '"': ".-..-.",
  $: "...-..-",
  "@": ".--.-.",
  " ": "/",
};

// Function to convert text to Morse code
function textToMorse(text) {
  return text
    .toUpperCase()
    .split("")
    .map((char) => morseCode[char] || char)
    .join(" ");
}

// Function to convert Morse code to text
function morseToText(morse) {
  const reverseMorseCode = Object.fromEntries(
    Object.entries(morseCode).map(([k, v]) => [v, k])
  );
  return morse
    .split(" ")
    .map((code) => reverseMorseCode[code] || code)
    .join("");
}

// Function to update translation history
function updateHistory(input, output) {
  const history = JSON.parse(localStorage.getItem("history")) || [];
  history.unshift({ input, output });
  if (history.length > 5) history.pop(); // Keep only the last 5 translations
  localStorage.setItem("history", JSON.stringify(history));
  renderHistory();
}

// Function to render translation history
function renderHistory() {
  const historyList = document.getElementById("historyList");
  const history = JSON.parse(localStorage.getItem("history")) || [];
  historyList.innerHTML = "";
  history.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.input} → ${item.output}`;
    historyList.appendChild(li);
  });
}

// Event listeners
document.getElementById("toMorse").addEventListener("click", () => {
  const inputText = document.getElementById("inputText").value.trim();
  if (inputText) {
    const output = textToMorse(inputText);
    document.getElementById("outputText").value = output;
    updateHistory(inputText, output);
  }
});

document.getElementById("toText").addEventListener("click", () => {
  const inputText = document.getElementById("inputText").value.trim();
  if (inputText) {
    const output = morseToText(inputText);
    document.getElementById("outputText").value = output;
    updateHistory(inputText, output);
  }
});

// Language selector
document
  .getElementById("languageSelector")
  .addEventListener("change", (event) => {
    const lang = event.target.value;
    const title = document.getElementById("title");
    const toMorseBtn = document.getElementById("toMorse");
    const toTextBtn = document.getElementById("toText");
    const historySection = document.getElementById("history");

    if (lang === "en") {
      title.textContent = "Morse Code Translator";
      toMorseBtn.textContent = "To Morse Code";
      toTextBtn.textContent = "To Text";
      historySection.querySelector("h2").textContent = "Translation History";
    } else if (lang === "zu") {
      title.textContent = "Umhumushi weKhowudi yeMorse";
      toMorseBtn.textContent = "Kuya kwiMorse Code";
      toTextBtn.textContent = "Kuya kwiText";
      historySection.querySelector("h2").textContent = "Umlando Wokuhumusha";
    } else if (lang === "ts") {
      title.textContent = "Mutshino wa Kihumisi wa Morse";
      toMorseBtn.textContent = "Kuya eka Morse Code";
      toTextBtn.textContent = "Kuya eka Text";
      historySection.querySelector("h2").textContent = "Nhluvuko wa Ku Humesa";
    }
  });

// Initialize history on page load
document.addEventListener("DOMContentLoaded", renderHistory);
