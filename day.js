const travelData = window.TRAVEL_DATA;
const themes = window.DAY_THEMES;
const escapeText = window.escapeTravelHtml;
const dayNumber = Number(document.body.dataset.day);
const day = travelData.days.find((item) => item.day === dayNumber) || travelData.days[0];
const theme = themes[day.day];

function setDayTheme() {
  document.title = `Day ${day.day}｜${day.title}`;
  document.body.classList.add(`theme-day-${day.day}`);
  document.documentElement.style.setProperty("--hero-image", `url("${theme.image}")`);
}

function renderRoutePoints() {
  return day.schedule
    .filter((item) => item.mapKeyword && item.mapKeyword !== "-")
    .slice(0, 5)
    .map((item) => `<li>${escapeText(item.mapKeyword)}</li>`)
    .join("");
}

function renderSchedule() {
  const list = document.querySelector("#scheduleList");
  list.innerHTML = day.schedule
    .map(
      (item) => `
        <article class="schedule-item">
          <div class="schedule-time">${escapeText(item.time)}</div>
          <div>
            <h3>${escapeText(item.activity)}</h3>
            <p class="schedule-meta">${escapeText(item.transport || "依現場狀況調整")}</p>
            ${
              item.mapKeyword && item.mapKeyword !== "-"
                ? `<a class="map-btn" href="${item.naverUrl}" target="_blank" rel="noreferrer">開啟 NAVER：${escapeText(item.mapKeyword)}</a>`
                : ""
            }
            ${item.note ? `<p class="note">${escapeText(item.note)}</p>` : ""}
          </div>
        </article>
      `,
    )
    .join("");
}

function renderPage() {
  document.querySelector("#dayKicker").textContent = `Day ${day.day} / ${day.date}`;
  document.querySelector("#dayTitle").textContent = day.title;
  document.querySelector("#dayFocus").textContent = day.focus;
  document.querySelector("#themeLabel").textContent = theme.label;
  document.querySelector("#themeMood").textContent = theme.mood;
  document.querySelector("#docLink").href = day.docUrl;
  document.querySelector("#naverLink").href = travelData.links.naverMap;
  document.querySelector("#summaryTitle").textContent = `Day ${day.day} 行程重點`;
  document.querySelector("#summaryText").textContent = day.focus;
  document.querySelector("#routePoints").innerHTML = renderRoutePoints();

  const tags = document.querySelector("#tagRow");
  tags.innerHTML = [theme.label, "NAVER Map 導航", "Google 線上規劃書"]
    .map((tag) => `<span>${escapeText(tag)}</span>`)
    .join("");

  const prev = document.querySelector("#prevDay");
  const next = document.querySelector("#nextDay");
  if (day.day > 1) {
    prev.href = `day${day.day - 1}.html`;
    prev.textContent = `上一天 Day ${day.day - 1}`;
  } else {
    prev.href = "../index.html#days";
    prev.textContent = "回首頁";
  }
  if (day.day < 9) {
    next.href = `day${day.day + 1}.html`;
    next.textContent = `下一天 Day ${day.day + 1}`;
  } else {
    next.href = "../index.html#maps";
    next.textContent = "查看地圖工具";
  }

  renderSchedule();
}

setDayTheme();
renderPage();
