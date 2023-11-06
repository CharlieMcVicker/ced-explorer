import { dict } from "./dict_verbs.js";

function hasFields(word) {
  return (
    word.sentence.phonetics.length > 0 &&
    word.sentence.syllabary.length > 0 &&
    !word.sentence.phonetics.startsWith("[")
  );
}

const wordIds = Object.keys(dict).filter((id) => hasFields(dict[id]));

function randomWord() {
  const idx = Math.floor(Math.random() * wordIds.length);
  return dict[wordIds[idx]];
}

function subAsterisk(text, pattern) {
  var bold = /\*(.*?)\*/gm;
  var html = text.replace(bold, pattern);
  return html;
}

function removeAsterisk(text) {
  return subAsterisk(text, "$1");
}

function boldAsterisk(text) {
  return subAsterisk(text, "<strong>$1</strong>");
}

function setExampleSentence(word) {
  sentenceSyllabary.innerHTML = boldAsterisk(word.sentence.syllabary);
  sentencePhonetics.innerHTML = boldAsterisk(word.sentence.phonetics);
}

function nextWord() {
  const word = randomWord();
  setExampleSentence(word);
}

const nextBtn = document.querySelector(".next");
nextBtn.addEventListener("click", () => nextWord());
const sentenceSyllabary = document.querySelector(".example-syllabary"); // Get the button from the page
const sentencePhonetics = document.querySelector(".example-phonetics"); // Get the button from the page

nextWord();
