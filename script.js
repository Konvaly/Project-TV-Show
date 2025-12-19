//You can edit ALL of the code here
const EPISODES_API_URL = "https://api.tvmaze.com/shows/82/episodes";
let cachedEpisodes = null;

function showShowsView() {
  document.getElementById("shows-view").hidden = false;
  document.getElementById("episodes-view").hidden = true;
}

function showEpisodesView() {
  document.getElementById("shows-view").hidden = true;
  document.getElementById("episodes-view").hidden = false;
}

async function fetchEpisodesOnce() {
  if (cachedEpisodes) return cachedEpisodes;

  const statusEl = document.getElementById("status");
  const retryBtn = document.getElementById("retryBtn");

  statusEl.textContent = "Loading episodes...";
  retryBtn.hidden = true;

  try {
    const response = await fetch(EPISODES_API_URL);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const episodes = await response.json();
    cachedEpisodes = episodes;

    statusEl.textContent = "";
    return episodes;
  } catch (err) {
    statusEl.textContent =
      "Sorry, we couldn’t load episodes right now. Please refresh the page and try again.";
    retryBtn.hidden = false;
    return null;
  }
}

async function setup() {
  showShowsView();

  const SHOWS_API_URL = "https://api.tvmaze.com/shows";
  let showSelector = document.getElementById("showSelector");
  if (showSelector) showSelector.remove();

  showSelector = document.createElement("select");
  showSelector.id = "showSelector";
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select a show...";
  showSelector.appendChild(defaultOption);

  try {
    const response = await fetch(SHOWS_API_URL);
    if (response.ok) {
      const shows = await response.json();
      shows.forEach((show) => {
        const option = document.createElement("option");
        option.value = show.id;
        option.textContent = show.name;
        showSelector.appendChild(option);
      });
    }
  } catch (err) {}

  const episodesView = document.getElementById("episodes-view");
  const rootEl = document.getElementById("root");
  episodesView.insertBefore(showSelector, rootEl);

  showSelector.addEventListener("change", async function () {
    const showId = showSelector.value;
    if (!showId) return;
    const episodesUrl = `https://api.tvmaze.com/shows/${showId}/episodes`;
    const statusEl = document.getElementById("status");
    if (statusEl) statusEl.textContent = "Loading episodes...";

    try {
      const response = await fetch(episodesUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const episodes = await response.json();

      const { inputEl, display, selectorEl, showAllBtn } =
        episodeSearch(episodes);

      inputEl.disabled = false;
      selectorEl.disabled = false;
      showAllBtn.disabled = false;

      showAllBtn.addEventListener("click", function () {
        selectorEl.value = "all";
        inputEl.value = "";
        renderEpisodes(episodes, episodes.length, display);
      });
      renderEpisodes(episodes, episodes.length, display);

      selectorEl.addEventListener("change", function () {
        const selectedId = selectorEl.value;
        if (selectedId === "all") {
          renderEpisodes(episodes, episodes.length, display);
          return;
        }
        const selectedEpisode = episodes.find((ep) => ep.id == selectedId);
        renderEpisodes([selectedEpisode], episodes.length, display);
      });

      filteredEpisodes(episodes, inputEl, display, selectorEl);

      if (statusEl) statusEl.textContent = "";
    } catch (err) {
      if (statusEl)
        statusEl.textContent =
          "Sorry, we couldn’t load episodes for this show. Please try again.";
    }
  });
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

  const contentEl = document.createElement("div");
  contentEl.className = "episode-content";

  if (episode.image?.medium) {
    const imageEl = document.createElement("img");
    imageEl.src = episode.image.medium;
    imageEl.alt = `${episode.name} episode image`;
    contentEl.appendChild(imageEl);
  }

  const summaryEl = document.createElement("div");
  summaryEl.innerHTML = episode.summary ?? "";
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
  document.getElementById("searchInput")?.remove();
  document.getElementById("display")?.remove();
  document.getElementById("episodeSelector")?.remove();
  document.getElementById("showAllBtn")?.remove();

  const inputEl = document.createElement("input");
  inputEl.setAttribute("placeholder", "Search episodes...");
  inputEl.setAttribute("type", "text");
  inputEl.setAttribute("maxlength", "40");
  inputEl.setAttribute("aria-label", "Search episodes");
  inputEl.id = "searchInput";

  const display = document.createElement("div");
  display.id = "display";

  const selectorEl = document.createElement("select");
  selectorEl.id = "episodeSelector";

  const showAllBtn = document.createElement("button");
  showAllBtn.type = "button";
  showAllBtn.id = "showAllBtn";
  showAllBtn.textContent = "Show all";

  const episodesView = document.getElementById("episodes-view");
  const rootEl = document.getElementById("root");

  episodesView.insertBefore(inputEl, rootEl);
  episodesView.insertBefore(display, rootEl);
  episodesView.insertBefore(selectorEl, rootEl);
  episodesView.insertBefore(showAllBtn, rootEl);

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
        (episode.summary ?? "").toLowerCase().includes(inputValue.toLowerCase())
    );
    renderEpisodes(matchedEpisodes, allEpisodes.length, display);
  });
}

document.getElementById("retryBtn").addEventListener("click", async () => {
  cachedEpisodes = null;
  await setup();
});

document.getElementById("backToShows").addEventListener("click", (event) => {
  event.preventDefault();
  showShowsView();
});

window.onload = setup;
