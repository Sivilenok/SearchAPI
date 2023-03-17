"use strict"

const mainEl = document.querySelector(".main");
const wrapper = document.createElement("div");
const formEl = document.createElement("form");

const inputEl = document.createElement("input");
inputEl.classList.add("search-input");
inputEl.setAttribute("name", "name");

const searchButtonEl = document.createElement("button");
searchButtonEl.classList.add("search-button");
searchButtonEl.innerHTML = "Поиск";

formEl.appendChild(inputEl);
formEl.appendChild(searchButtonEl);
mainEl.appendChild(formEl);
mainEl.appendChild(wrapper);

formEl.addEventListener("submit", async (event) => {
  event.preventDefault();
  const inputValue = inputEl.value.trim();
  if (inputValue.length < 3) {
    wrapper.innerHTML = "";
    wrapper.appendChild(createErrorEl("Введите не менее 3 символов"));
  } else {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${inputValue}`
    );

    if (response.ok) {
      const data = await response.json();
      const reposCount = data.total_count;

      if (reposCount > 0) {
        wrapper.innerHTML = "";
        wrapper.appendChild(createResultsEl(data.items));
      } else {
        wrapper.innerHTML = "";
        wrapper.appendChild(createErrorEl("Ничего не найдено"));
      }
    } else {
      wrapper.innerHTML = "";
      wrapper.appendChild(
        createErrorEl("Произошла ошибка при выполнении запроса")
      );
    }
  }
});


function createResultsEl(reposData) {
  const element = document.createElement("div");
  element.classList.add("results");

  for (let i = 0; i < 10 && i < reposData.length; i++) {
    const repoData = reposData[i];
    const repoEl = document.createElement("div");
    repoEl.classList.add("repo");
    repoEl.innerHTML = `
        <a class="repo-name" href="${repoData.html_url}" target="_blank">${repoData.name}
        <img class="repo-image" src="${repoData.owner.avatar_url}" alt="${repoData.owner.login}'s profile picture"></img>
        </a>
      `;
    element.appendChild(repoEl);
  }

  return element;
}

function createErrorEl(errorMessage) {
  const element = document.createElement("span");
  element.classList.add("error");
  element.innerText = errorMessage;
  return element;
}


