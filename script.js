const ANSWERS_STATUS = {
  "one": "",
  "two": "",
  "three": ""
};

function onResetButtonClickListener() {
  const divResult = document.querySelector(".result");
  divResult.classList.add("hidden");
  for (const div of ALL_ANSWER_WRAPPERS) {
    if (div.classList.contains("unselected")) {
      div.classList.remove("unselected");
    } else {
      div.classList.remove("selected");
      div.querySelector(".checkbox").src = "images/unchecked.png";
    }
  }
  for (const div of ALL_ANSWER_WRAPPERS) {
    div.addEventListener("click", onAnswerWrapperClickListener);
  }
}

function endQuiz() {
  for (const ans of ALL_ANSWER_WRAPPERS) {
    ans.removeEventListener("click", onAnswerWrapperClickListener);
  }
  const div = document.querySelector(".result");
  const titolo = div.querySelector("h1");
  const paragrafo = div.querySelector("p");
  const button = div.querySelector("div");
  const res = checkAnswerStatus();
  for (const key in ANSWERS_STATUS) {
    /*resetto le risposte */
    ANSWERS_STATUS[key] = "";
  }
  titolo.textContent = RESULTS_MAP[res].title;
  paragrafo.textContent = RESULTS_MAP[res].contents;
  button.addEventListener("click", onResetButtonClickListener);
  div.classList.remove("hidden");
}

function checkAnswerStatus() {
  let res = "";
  for (const key in ANSWERS_STATUS) {
    if (ANSWERS_STATUS[key] === "") {
      return res;
    }
  }
  if (ANSWERS_STATUS["two"] === ANSWERS_STATUS["three"]) {
    res = ANSWERS_STATUS["two"];
  } else {
    res = ANSWERS_STATUS["one"];
  }
  return res;
}

function getAnswerWrappersByQuestionId(questionId) {
  return document.querySelectorAll(`div[data-question-id=${questionId}]`);
}

function changeAnswer(div) {
  const questionId = div.dataset.questionId;
  for (const ans of getAnswerWrappersByQuestionId(questionId)) {
    if (ans.classList.contains("selected")) {
      ans.classList.remove("selected");
      ans.classList.add("unselected");
      ans.querySelector(".checkbox").src = "images/unchecked.png";
    }
  }
  div.classList.remove("unselected");
  div.classList.add("selected");
  div.querySelector(".checkbox").src = "images/checked.png";
  const answerId = div.dataset.choiceId;
  ANSWERS_STATUS[questionId] = answerId;
}

function selectFirstAnswer(div) {
  div.classList.add("selected");
  div.querySelector(".checkbox").src = "images/checked.png";
  const questionId = div.dataset.questionId;
  for (const ans of getAnswerWrappersByQuestionId(questionId)) {
    if (ans !== div) {
      ans.classList.add("unselected");
    }
  }
  const answerId = div.dataset.choiceId;
  ANSWERS_STATUS[questionId] = answerId;
}

function onAnswerWrapperClickListener(event) {
  const div = event.currentTarget;
  if (div.classList.contains("unselected")) {
    changeAnswer(div);
  }
  if (!div.classList.contains("selected")) {
    selectFirstAnswer(div);
    if (checkAnswerStatus() !== "") {
      endQuiz();
    }
  }
}

const ALL_ANSWER_WRAPPERS = document.querySelectorAll("section.choice-grid div");
for (const div of ALL_ANSWER_WRAPPERS) {
  div.addEventListener("click", onAnswerWrapperClickListener);
}
