//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  const { inputEl, display, selectorEl } = episodeSearch(allEpisodes);
  selectorEl.addEventListener("change", function () {
    const selectedId = selectorEl.value;
  });
  if (selectedId === "all") {
    renderEpisodes(allEpisodes, allEpisodes.length, display);
  } else {
    const selectedEpisode = allEpisodes.find((ep) => ep.id == selectedId);
    renderEpisodes([selectedEpisode], allEpisodes.length, display);
  }

  filteredEpisodes(allEpisodes, inputEl, display);
}

function formatEpisodeCode(episode) {
  const season = String(episode.season).padStart(2, "0");
  const number = String(episode.number).padStart(2, "0");
  return `S${season}E${number}`;
}

function makePageForEpisodes(episodeList) {
  const rootEl = document.getElementById("root");

  rootEl.innerHTML = "";

  episodeList.forEach((episode) => {
    const episodeEl = document.createElement("section");
    episodeEl.className = "episode";

    const titleEl = document.createElement("h2");
    titleEl.textContent = `${episode.name} - ${formatEpisodeCode(episode)}`;

    const imageEl = document.createElement("img");
    imageEl.src = episode.image.medium;
    imageEl.alt = `${episode.name} episode image`;

    const summaryEl = document.createElement("div");
    summaryEl.innerHTML = episode.summary;

    const contentEl = document.createElement("div");
    contentEl.className = "episode-content";
    contentEl.appendChild(imageEl);
    contentEl.appendChild(summaryEl);

    episodeEl.appendChild(titleEl);
    episodeEl.appendChild(contentEl);
    rootEl.appendChild(episodeEl);
  });
}

function episodeSearch(allEpisodes) {
  const inputEl = document.createElement("input");
  inputEl.setAttribute("placeholder", "Search episodes...");
  inputEl.setAttribute("type", "text");
  inputEl.setAttribute("minlength", "2");
  inputEl.setAttribute("maxlength", "40");
  inputEl.setAttribute("aria-label", "Search episodes");
  inputEl.id = "searchInput";

  const bodyEl = document.querySelector("body");
  const rootEl = document.getElementById("root");

  const display = document.createElement("div");
  display.id = "display";

  const selectorEl = document.createElement("select");
  selectorEl.id = "episodeSelector";
  bodyEl.insertBefore(inputEl, rootEl);
  bodyEl.insertBefore(display, rootEl);
  bodyEl.insertBefore(selectorEl, rootEl);
  display.innerHTML = `Displaying ${allEpisodes.length}/${allEpisodes.length} episodes`;

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All Episodes";
  selectorEl.appendChild(allOption);
  allEpisodes.forEach((episode) => {
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `${formatEpisodeCode(episode)} - ${episode.name}`;
    selectorEl.appendChild(option);
  });

  return { inputEl, display, selectorEl };
}

function renderEpisodes(episodesToShow, totalCount, display) {
  makePageForEpisodes(episodesToShow);
  display.innerHTML = `Displaying ${episodesToShow.length}/${totalCount} episodes`;
}

function filteredEpisodes(allEpisodes, inputEl, display) {
  makePageForEpisodes(allEpisodes);
  inputEl.addEventListener("input", function () {
    const inputValue = inputEl.value;
    const matchedEpisodes = allEpisodes.filter(
      (episode) =>
        episode.name.toLowerCase().includes(inputValue.toLowerCase()) ||
        episode.summary.toLowerCase().includes(inputValue.toLowerCase())
    );
    renderEpisodes(matchedEpisodes, allEpisodes.length, display);
  });
}

window.onload = setup;
