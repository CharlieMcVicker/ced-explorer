import { dict } from "./dict_verbs.js";

function hasFields(word) {
  return (
    word.sentence.phonetics.length > 0 &&
    word.sentence.syllabary.length > 0 &&
    word.sentence.phonetics.includes("*") &&
    word.sentence.syllabary.includes("*") &&
    !word.sentence.phonetics.startsWith("[")
  );
}

const wordIds = Object.keys(dict).filter((id) => hasFields(dict[id]));

function pickNRandom(options, n) {
  const randomNumbers = new Array(n)
    .fill(0)
    .map((_, idx) => Math.floor(Math.random() * (options.length - idx)));

  const [picked] = randomNumbers.reduce(
    ([pickedOptions, pickedIdc], nextRandomNumber) => {
      const nextIdx = pickedIdc.reduce(
        (adjustedIdx, alreadyPickedIdx) =>
          // bump up the index for each element we've removed if we are past it
          // eg. [3] has been picked from [0 1 2 _3_ 4 5] and we have 3 has nextRandom number
          // we bump up to 4, as if 3 weren't there
          adjustedIdx + Number(adjustedIdx >= alreadyPickedIdx),
        nextRandomNumber
      );
      return [
        [...pickedOptions, options[nextIdx]],
        [...pickedIdc, nextIdx].sort(),
      ];
    },
    [[], []]
  );

  return picked;
}

function shuffled(list) {
  const indexed = list.map((e) => [Math.random(), e]);
  indexed.sort(([a], [b]) => a - b);
  return indexed.map(([_, e]) => e);
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
  sentenceEnglish.innerHTML = "";
}

function setOptions(options, revealTranslation) {
  const renderedOptions = options.map((option, idx) => {
    let clicked = false;
    const elm = document.createElement("li");
    const button = document.createElement("button");

    button.innerHTML = option.third_present_syllabary;
    button.addEventListener("click", () => {
      if(clicked) return;
      else clicked = true;
      const wordTranslation = document.createElement("span");
      wordTranslation.innerHTML = option.definition;
      wordTranslation.classList.add("translation");
      elm.append(wordTranslation);
      if (idx === 0) {
        button.style = "background: var(--color-bg);";
        revealTranslation();
      } else {
        button.style = "background: red";
      }
    });

    elm.append(button);
    return elm;
  });

  optionsElm.replaceChildren(...shuffled(renderedOptions));
}

function nextWord() {
  const options = pickNRandom(wordIds, 4).map((id) => dict[id]);
  const word = options[0];

  function revealTranslation() {
    sentenceEnglish.innerHTML = boldAsterisk(word.sentence.english);
  }

  setExampleSentence(word);
  setOptions(options, revealTranslation);
}

const nextBtn = document.querySelector(".next");
nextBtn.addEventListener("click", () => nextWord());

const sentenceSyllabary = document.querySelector(".example-syllabary");
const sentencePhonetics = document.querySelector(".example-phonetics");
const sentenceEnglish = document.querySelector(".example-english");
const optionsElm = document.querySelector(".options");

nextWord();
