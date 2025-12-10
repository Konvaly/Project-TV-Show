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
    titleEl.textContent = `${formatEpisodeCode(episode)} - ${episode.name}`;

    const infoEl = document.createElement("p");
    infoEl.textContent = `Season ${episode.season}, Episode ${episode.number}`;

    episodeEl.appendChild(titleEl);
    episodeEl.appendChild(infoEl);
    rootEl.appendChild(episodeEl);
  });
}

window.onload = setup;
