const morseCodeMap = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".",
  F: "..-.", G: "--.", H: "....", I: "..", J: ".---",
  K: "-.-", L: ".-..", M: "--", N: "-.", O: "---",
  P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-",
  U: "..-", V: "...-", W: ".--", X: "-..-", Y: "-.--",
  Z: "--..", 1: ".----", 2: "..---", 3: "...--",
  4: "....-", 5: ".....", 6: "-....", 7: "--...",
  8: "---..", 9: "----.", 0: "-----",
  ' ': '/'
};

const reverseMorseCodeMap = Object.fromEntries(
  Object.entries(morseCodeMap).map(([key, value]) => [value, key])
);

const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");
const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");
const playAudioBtn = document.getElementById("playAudioBtn");
const modeRadios = document.getElementsByName("mode");

function translateText(text) {
  return text.toUpperCase().split('').map(ch => morseCodeMap[ch] || '').join(' ');
}

function translateMorse(morse) {
  return morse.trim().split(' ').map(symbol => reverseMorseCodeMap[symbol] || '').join('');
}

function getCurrentMode() {
  return Array.from(modeRadios).find(r => r.checked).value;
}

function updateTranslation() {
  const mode = getCurrentMode();
  const input = inputText.value;
  outputText.value = mode === 'text-to-morse' ? translateText(input) : translateMorse(input);
}

inputText.addEventListener("input", updateTranslation);
modeRadios.forEach(radio => radio.addEventListener("change", updateTranslation));

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(outputText.value);
});

clearBtn.addEventListener("click", () => {
  inputText.value = '';
  outputText.value = '';
});

playAudioBtn.addEventListener("click", () => {
  const morse = getCurrentMode() === 'text-to-morse' ? outputText.value : inputText.value;
  const context = new (window.AudioContext || window.webkitAudioContext)();
  let time = context.currentTime;

  morse.split('').forEach(symbol => {
    if (symbol === '.') playBeep(context, time, 0.1);
    else if (symbol === '-') playBeep(context, time, 0.3);
    time += 0.4;
  });
});

function playBeep(context, startTime, duration) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.frequency.value = 600;
  gain.gain.setValueAtTime(1, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}
