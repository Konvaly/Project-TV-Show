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

const fetchCache = {};

async function fetchJsonOnce(url) {
  if (fetchCache[url]) return fetchCache[url];

  fetchCache[url] = fetch(url).then((response) => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  });

  return fetchCache[url];
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
  const shows = await fetchJsonOnce(SHOWS_API_URL);

  shows.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
  );

  renderShows(shows);
}

function formatEpisodeCode(episode) {
  const season = String(episode.season).padStart(2, "0");
  const number = String(episode.number).padStart(2, "0");
  return `S${season}E${number}`;
}

function createShowCard(show) {
  const card = document.createElement("article");
  card.className = "show-card";

  const title = document.createElement("h2");

  const titleBtn = document.createElement("button");
  titleBtn.type = "button";
  titleBtn.textContent = show.name;
  titleBtn.dataset.showId = show.id;
  title.appendChild(titleBtn);

  const img = document.createElement("img");
  img.alt = `${show.name} poster`;
  if (show.image?.medium) img.src = show.image.medium;
  else img.remove();

  const summary = document.createElement("div");
  summary.innerHTML = show.summary ?? "";

  const meta = document.createElement("p");
  const genres = (show.genres ?? []).join(", ");
  const rating = show.rating?.average ?? "N/A";
  const runtime = show.runtime ?? "N/A";
  meta.textContent = `Genres: ${genres} | Rating: ${rating} | Status: ${show.status} | Runtime: ${runtime}`;

  card.append(title, img, meta, summary);

  return card;
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

function renderShows(shows) {
  const showsRoot = document.getElementById("showsRoot");
  const showsDisplay = document.getElementById("showsDisplay");

  showsRoot.innerHTML = "";

  showsDisplay.textContent = `Showing ${shows.length} show(s)`;

  shows.forEach((show) => {
    const card = createShowCard(show);
    showsRoot.appendChild(card);
  });
}

async function loadEpisodesForShow(showId) {
  const episodesUrl = `https://api.tvmaze.com/shows/${showId}/episodes`;

  const statusEl = document.getElementById("status");
  if (statusEl) statusEl.textContent = "Loading episodes...";

  try {
    const episodes = await fetchJsonOnce(episodesUrl);

    const { inputEl, display, selectorEl, showAllBtn } =
      episodeSearch(episodes);

    inputEl.disabled = false;
    selectorEl.disabled = false;
    showAllBtn.disabled = false;

    showAllBtn.onclick = () => {
      selectorEl.value = "all";
      inputEl.value = "";
      renderEpisodes(episodes, episodes.length, display);
    };

    selectorEl.onchange = () => {
      const selectedId = selectorEl.value;
      if (selectedId === "all") {
        renderEpisodes(episodes, episodes.length, display);
        return;
      }
      const selectedEpisode = episodes.find((ep) => ep.id == selectedId);
      renderEpisodes([selectedEpisode], episodes.length, display);
    };

    filteredEpisodes(episodes, inputEl, display, selectorEl);

    renderEpisodes(episodes, episodes.length, display);

    if (statusEl) statusEl.textContent = "";
  } catch (err) {
    if (statusEl)
      statusEl.textContent = "Sorry, we couldn’t load episodes for this show.";
  }
}

document.getElementById("retryBtn").addEventListener("click", () => {
  // We’ll implement proper retry once we store "last selected show"
});

document.getElementById("backToShows").addEventListener("click", (event) => {
  event.preventDefault();
  showShowsView();
});

document
  .getElementById("showsRoot")
  .addEventListener("click", async (event) => {
    const btn = event.target.closest("button[data-show-id]");
    if (!btn) return;

    const showId = btn.dataset.showId;

    showEpisodesView();
    await loadEpisodesForShow(showId);
  });

window.onload = setup;
