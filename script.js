//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootEl = document.getElementById("root");

  rootEl.innerHTML = "";

  episodeList.forEach((episode) => {
    const episodeEl = document.createElement("section");
    episodeEl.className = "episode";

    const titleEl = document.createElement("h2");
    titleEl.textContent = episode.name;

    episodeEl.appendChild(titleEl);
    rootEl.appendChild(episodeEl);
  });
}

window.onload = setup;
