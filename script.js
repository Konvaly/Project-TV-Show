//You can edit ALL of the code here
const EPISODES_API_URL = "https://api.tvmaze.com/shows/82/episodes";

async function fetchEpisodesOnce() {
  const statusEl = document.getElementById("status");
  statusEl.textContent = "Loading episodes...";

  try {
    const response = await fetch(EPISODES_API_URL);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const episodes = await response.json();

    statusEl.textContent = "";
    return episodes;
  } catch (err) {
    statusEl.textContent =
      "Sorry, we couldn’t load episodes right now. Please refresh the page and try again.";
    return null;
  }
}

async function setup() {
  const allEpisodes = await fetchEpisodesOnce();
  if (!allEpisodes) return;

  const { inputEl, display, selectorEl, showAllBtn } =
    episodeSearch(allEpisodes);

  inputEl.disabled = false;
  selectorEl.disabled = false;
  showAllBtn.disabled = false;

  showAllBtn.addEventListener("click", function () {
    selectorEl.value = "all";
    inputEl.value = "";
    renderEpisodes(allEpisodes, allEpisodes.length, display);
  });

  renderEpisodes(allEpisodes, allEpisodes.length, display);

  selectorEl.addEventListener("change", function () {
    const selectedId = selectorEl.value;

    if (selectedId === "all") {
      renderEpisodes(allEpisodes, allEpisodes.length, display);
      return;
    }

    const selectedEpisode = allEpisodes.find((ep) => ep.id == selectedId);
    renderEpisodes([selectedEpisode], allEpisodes.length, display);
  });

  filteredEpisodes(allEpisodes, inputEl, display, selectorEl);
}

function formatEpisodeCode(episode) {
  const season = String(episode.season).padStart(2, "0");
  const number = String(episode.number).padStart(2, "0");
  return `S${season}E${number}`;
}

function createEpisodeCard(episode) {
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

  return episodeEl;
}

function makePageForEpisodes(episodeList) {
  const rootEl = document.getElementById("root");

  rootEl.innerHTML = "";

  episodeList.forEach((episode) => {
    rootEl.appendChild(createEpisodeCard(episode));
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

  const showAllBtn = document.createElement("button");
  showAllBtn.type = "button";
  showAllBtn.id = "showAllBtn";
  showAllBtn.textContent = "Show all";

  inputEl.disabled = true;
  selectorEl.disabled = true;
  showAllBtn.disabled = true;

  bodyEl.insertBefore(inputEl, rootEl);
  bodyEl.insertBefore(display, rootEl);
  bodyEl.insertBefore(selectorEl, rootEl);
  bodyEl.insertBefore(showAllBtn, rootEl);

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

  return { inputEl, display, selectorEl, showAllBtn };
}

function renderEpisodes(episodesToShow, totalCount, display) {
  makePageForEpisodes(episodesToShow);
  display.innerHTML = `Displaying ${episodesToShow.length}/${totalCount} episodes`;
}

function filteredEpisodes(allEpisodes, inputEl, display, selectorEl) {
  inputEl.addEventListener("input", function () {
    selectorEl.value = "all";
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
