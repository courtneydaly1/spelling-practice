import { wordsByCategory } from './data.js';

// Start Area
const categoryList = document.getElementById('category-list');

// Practice Area
const practiceArea = document.getElementById('practice-area');
const selectedTopic = document.getElementById('selected-topic');
const wordInfo = document.getElementById('word-info');
const voiceSelect = document.getElementById('voice-select');

// word navigator buttons
const playButton = document.getElementById('play-btn');
const prevButton = document.getElementById('prev-btn');
const nextButton = document.getElementById('next-btn');

// Set up some initial values
practiceArea.style.display = 'none';
prevButton.disabled = true;

let wordsToPlay = [];
let currentWordIndex = 0;

// todo: add shuffle button
// todo: submit function
// todo: submit on Enter
// todo: show answer after submit
// todo: scoring
// todo: filter words
// todo: styling
// todo: mobile responsive
// todo: highlight selected category
// todo: clean up and organize code

// Set up category list
Object.entries(wordsByCategory).forEach(([group, words]) => {
  const button = document.createElement('button');

  button.textContent = group;
  button.addEventListener('click', () => {
    selectedTopic.textContent = `Category: ${group}`;
    practiceArea.style.display = 'block';
    wordsToPlay = words;
    currentWordIndex = 0;
    wordInfo.textContent = `${currentWordIndex + 1}/${wordsToPlay.length}`;
  });

  categoryList.appendChild(button);
});

// ============ START SpeechSynthesis set up ============
const utterance = new SpeechSynthesisUtterance();

// todo: move to helpers file
function getSpeechVoices() {
  return new Promise(function (resolve, reject) {
    let synth = window.speechSynthesis;
    let id;

    id = setInterval(() => {
      if (synth.getVoices().length !== 0) {
        resolve(synth.getVoices());
        clearInterval(id);
      }
    }, 10);
  });
}

const voicesPromise = getSpeechVoices();
let allVoices = [];

voicesPromise.then((voices) => {
  utterance.voice = voices[0];
  allVoices = voices;

  // set up voice options
  voices.forEach((voice) => {
    const option = document.createElement('option');
    option.textContent = `${voice.name} (${voice.lang})`;

    if (voice.default) {
      option.textContent += ' — DEFAULT';
    }

    option.dataset.lang = voice.lang;
    option.dataset.name = voice.name;
    voiceSelect.appendChild(option);
  });
});

voiceSelect.addEventListener('change', function (e) {
  const voiceName = e.target.options[e.target.selectedIndex].dataset.name;
  utterance.voice = allVoices.find((voice) => voice.name === voiceName);
});
// ============ END SpeechSynthesis set up ============

// ============ START Play, Prev, Next buttons ============
playButton.addEventListener('click', () => {
  utterance.text = wordsToPlay[currentWordIndex];
  window.speechSynthesis.speak(utterance);
});

prevButton.addEventListener('click', () => {
  if (nextButton.disabled) {
    nextButton.disabled = false;
  }
  currentWordIndex--;
  wordInfo.textContent = `${currentWordIndex + 1}/${wordsToPlay.length}`;

  if (currentWordIndex === 0) {
    prevButton.disabled = true;
  }
});

nextButton.addEventListener('click', () => {
  if (prevButton.disabled) {
    prevButton.disabled = false;
  }
  currentWordIndex++;
  wordInfo.textContent = `${currentWordIndex + 1}/${wordsToPlay.length}`;

  if (currentWordIndex === wordsToPlay.length - 1) {
    nextButton.disabled = true;
  }
});
// ============ END Play, Prev, Next buttons ============