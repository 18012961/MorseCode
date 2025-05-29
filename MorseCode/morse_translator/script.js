const morseCodeMap = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".",
  F: "..-.", G: "--.", H: "....", I: "..", J: ".---",
  K: "-.-", L: ".-..", M: "--", N: "-.", O: "---",
  P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-",
  U: "..-", V: "...-", W: ".--", X: "-..-", Y: "-.--",
  Z: "--..", 1: ".----", 2: "..---", 3: "...--",
  4: "....-", 5: ".....", 6: "-....", 7: "--...",
  8: "---..", 9: "----.", 0: "-----",
  ' ': '/', '.': '.-.-.-', ',': '--..--', '?': '..--..',
  "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.',
  ')': '-.--.-', '&': '.-...', ':': '---...', ';': '-.-.-.',
  '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-',
  '"': '.-..-.', '$': '...-..-', '@': '.--.-.', '¿': '..-.-',
  '¡': '--...-'
};

const reverseMorseCodeMap = Object.fromEntries(
  Object.entries(morseCodeMap).map(([key, value]) => [value, key])
);

// DOM Elements
const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");
const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");
const playAudioBtn = document.getElementById("playAudioBtn");
const flashBtn = document.getElementById("flashBtn");
const swapBtn = document.getElementById("swapBtn");
const modeRadios = document.getElementsByName("mode");
const inputLabel = document.getElementById("inputLabel");
const outputLabel = document.getElementById("outputLabel");
const inputCount = document.getElementById("inputCount");
const outputCount = document.getElementById("outputCount");
const cheatsheet = document.getElementById("cheatsheet");
const themeToggle = document.getElementById("themeToggle");

// Create particles
function createParticles() {
  const particlesContainer = document.getElementById("particles");
  const particleCount = 30;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");
    
    const size = Math.random() * 5 + 2;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const delay = Math.random() * 5;
    const duration = Math.random() * 10 + 10;
    const alpha = Math.random() * 0.5 + 0.1;
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    particle.style.animationDelay = `${delay}s`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.backgroundColor = `rgba(58, 134, 255, ${alpha})`;
    
    particlesContainer.appendChild(particle);
  }
}

// Create cheatsheet
function createCheatsheet() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '.,?\'!/()&:;=+-_"$@¿¡';
  
  const allChars = letters + numbers + symbols;
  
  allChars.split('').forEach(char => {
    if (morseCodeMap[char]) {
      const item = document.createElement("div");
      item.className = "cheat-item";
      item.innerHTML = `
        <div class="cheat-char">${char}</div>
        <div class="cheat-code">${morseCodeMap[char]}</div>
      `;
      cheatsheet.appendChild(item);
    }
  });
}

// Translation functions
function translateText(text) {
  return text.toUpperCase().split('').map(ch => morseCodeMap[ch] || ch).join(' ');
}

function translateMorse(morse) {
  return morse.trim().split(' ').map(symbol => reverseMorseCodeMap[symbol] || symbol).join('');
}

function getCurrentMode() {
  return Array.from(modeRadios).find(r => r.checked).value;
}

function updateLabels() {
  const mode = getCurrentMode();
  inputLabel.textContent = mode === 'text-to-morse' ? 'Text Input' : 'Morse Code Input';
  outputLabel.textContent = mode === 'text-to-morse' ? 'Morse Code Output' : 'Text Output';
}

function updateCounts() {
  inputCount.textContent = `${inputText.value.length} chars`;
  outputCount.textContent = `${outputText.value.length} chars`;
}

function updateTranslation() {
  const mode = getCurrentMode();
  const input = inputText.value;
  outputText.value = mode === 'text-to-morse' ? translateText(input) : translateMorse(input);
  updateCounts();
}

// Flash screen for visual morse code
function flashMorse() {
  const morse = getCurrentMode() === 'text-to-morse' ? outputText.value : inputText.value;
  const flashElement = document.createElement("div");
  flashElement.className = "flash-effect";
  document.body.appendChild(flashElement);
  
  let time = 0;
  
  morse.split('').forEach(symbol => {
    if (symbol === '.') {
      setTimeout(() => {
        flashElement.style.opacity = '0.8';
        setTimeout(() => flashElement.style.opacity = '0', 100);
      }, time * 1000);
      time += 0.3;
    } else if (symbol === '-') {
      setTimeout(() => {
        flashElement.style.opacity = '0.8';
        setTimeout(() => flashElement.style.opacity = '0', 300);
      }, time * 1000);
      time += 0.7;
    } else if (symbol === ' ') {
      time += 0.3;
    } else if (symbol === '/') {
      time += 1.4;
    }
  });
  
  setTimeout(() => flashElement.remove(), time * 1000);
}

// Theme toggle
function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
}

// Initialize
function init() {
  createParticles();
  createCheatsheet();
  
  // Set theme from localStorage or prefer-color-scheme
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.checked = true;
  }
  
  updateLabels();
  updateCounts();
}

// Event Listeners
inputText.addEventListener("input", updateTranslation);
modeRadios.forEach(radio => radio.addEventListener("change", () => {
  updateTranslation();
  updateLabels();
}));

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(outputText.value);
  copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
  setTimeout(() => {
    copyBtn.innerHTML = '<i class="far fa-copy"></i> Copy';
  }, 2000);
});

clearBtn.addEventListener("click", () => {
  inputText.value = '';
  outputText.value = '';
  updateCounts();
});

playAudioBtn.addEventListener("click", () => {
  const morse = getCurrentMode() === 'text-to-morse' ? outputText.value : inputText.value;
  const context = new (window.AudioContext || window.webkitAudioContext)();
  let time = context.currentTime;

  morse.split('').forEach(symbol => {
    if (symbol === '.') playBeep(context, time, 0.1);
    else if (symbol === '-') playBeep(context, time, 0.3);
    time += symbol === ' ' ? 0.7 : (symbol === '/' ? 1.4 : 0.2);
  });
});

flashBtn.addEventListener("click", flashMorse);

swapBtn.addEventListener("click", () => {
  const currentMode = getCurrentMode();
  const newMode = currentMode === 'text-to-morse' ? 'morse-to-text' : 'text-to-morse';
  
  document.querySelector(`input[value="${newMode}"]`).checked = true;
  const temp = inputText.value;
  inputText.value = outputText.value;
  outputText.value = temp;
  
  updateLabels();
  updateCounts();
});

themeToggle.addEventListener("change", toggleTheme);

function playBeep(context, startTime, duration) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.type = 'sine';
  oscillator.frequency.value = 600;
  gain.gain.setValueAtTime(1, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

// Initialize the app
init();