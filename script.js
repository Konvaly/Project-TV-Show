//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
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

window.onload = setup;
