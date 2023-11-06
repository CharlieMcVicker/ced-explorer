import dict from "./dict_verbs.json";

const wordIds = Object.keys(dict);

function randomWord() {
  const idx = Math.floor(Math.random() * wordIds.length);
  return dict[wordIds[idx]];
}

const sentence = document.querySelector(".example-sentence"); // Get the button from the page
sentence.innerHTML = randomWord().sentence.phonetics;

