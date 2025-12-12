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


const inputEl=document.createElement("input")
inputEl.setAttribute("placeholder", "Case sensitive...");
inputEl.setAttribute("type", "text");
inputEl.setAttribute("minlength", "2");
inputEl.setAttribute("maxlength", "40");
inputEl.setAttribute("aria-label", "Search episodes");
inputEl.className="searchInput"
const bodyEl=document.querySelector("body")
const rootEl=document.getElementById("root")
bodyEl.insertBefore(inputEl,rootEl)

window.onload = setup;
