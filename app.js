const data = window.TRAVEL_DATA;

const dayTabs = document.querySelector("#dayTabs");
const dayPanel = document.querySelector("#dayPanel");
const big5Summary = document.querySelector("#big5Summary");
const big5Table = document.querySelector("#big5Table");
const backupGrid = document.querySelector("#backupGrid");
const assistantDay = document.querySelector("#assistantDay");
const assistantWeather = document.querySelector("#assistantWeather");
const assistantEnergy = document.querySelector("#assistantEnergy");
const assistantOutput = document.querySelector("#assistantOutput");

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderTabs() {
  dayTabs.innerHTML = data.days
    .map(
      (day, index) => `
        <button class="day-tab" type="button" role="tab" data-day="${day.day}" aria-selected="${index === 0}">
          Day ${day.day}
        </button>
      `,
    )
    .join("");

  dayTabs.addEventListener("click", (event) => {
    const button = event.target.closest(".day-tab");
    if (!button) return;
    renderDay(Number(button.dataset.day));
  });
}

function renderDay(dayNumber) {
  const day = data.days.find((item) => item.day === dayNumber) || data.days[0];
  document.querySelectorAll(".day-tab").forEach((tab) => {
    tab.setAttribute("aria-selected", String(Number(tab.dataset.day) === day.day));
  });

  const rows = day.schedule
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.time)}</td>
          <td>${escapeHtml(item.activity)}</td>
          <td>${escapeHtml(item.transport)}</td>
          <td>
            <div>${escapeHtml(item.mapKeyword)}</div>
            <a class="map-btn" href="${item.naverUrl}" target="_blank" rel="noreferrer">開啟 NAVER</a>
          </td>
          <td>${escapeHtml(item.note)}</td>
        </tr>
      `,
    )
    .join("");

  dayPanel.innerHTML = `
    <div class="day-header">
      <p class="eyebrow">Day ${day.day} · ${escapeHtml(day.date)}</p>
      <h3>${escapeHtml(day.title)}</h3>
      <p>${escapeHtml(day.focus)}</p>
      <div class="day-actions">
        <a class="doc-btn" href="${day.docUrl}" target="_blank" rel="noreferrer">Google 線上規劃書</a>
        <a class="map-btn" href="${data.links.naverMap}" target="_blank" rel="noreferrer">NAVER Map</a>
      </div>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>時間</th>
            <th>行程活動</th>
            <th>交通</th>
            <th>NAVER Map</th>
            <th>備註</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function renderBig5() {
  big5Summary.innerHTML = `
    <ul>
      ${data.big5.summary.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      <li><a href="${data.links.big5Doc}" target="_blank" rel="noreferrer">BIG 5 通行證策略線上規劃書</a></li>
    </ul>
  `;

  big5Table.innerHTML = data.big5.items
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.order)}</td>
          <td>${escapeHtml(item.name)}</td>
          <td>${escapeHtml(item.group)}</td>
          <td>${escapeHtml(item.price)}</td>
          <td>${escapeHtml(item.strategy)}</td>
        </tr>
      `,
    )
    .join("");
}

function renderBackups() {
  backupGrid.innerHTML = data.backups
    .map(
      (item) => `
        <a class="backup-card" href="${item.url}" target="_blank" rel="noreferrer">
          <h3>${escapeHtml(item.title)}</h3>
          <p><strong>最適合：</strong>${escapeHtml(item.where)}</p>
          <p>${escapeHtml(item.strategy)}</p>
        </a>
      `,
    )
    .join("");
}

function setupLinks() {
  document.querySelector("#pdfLink").href = data.links.pdf;
  document.querySelector("#naverMapLink").href = data.links.naverMap;
  document.querySelector("#kimMapLink").href = data.links.kimBusanMap;
  document.querySelector("#kimPassLink").href = data.links.kimBusanPass;
  document.querySelector("#cheapMapLink").href = data.links.cheapMap;
}

function setupAssistant() {
  assistantDay.innerHTML = data.days
    .map((day) => `<option value="${day.day}">Day ${day.day} · ${escapeHtml(day.date)}</option>`)
    .join("");

  document.querySelector("#askAssistant").addEventListener("click", renderAssistantAdvice);
  renderAssistantAdvice();
}

function renderAssistantAdvice() {
  const day = data.days.find((item) => item.day === Number(assistantDay.value)) || data.days[0];
  const weather = assistantWeather.value;
  const energy = assistantEnergy.value;

  const advice = [];
  if (weather === "rain") {
    advice.push("優先改走室內備案：百貨、美術館、Spa Land、Arte Museum 或提早回飯店整理。");
  } else if (weather === "hot") {
    advice.push("中午到下午避免長時間戶外，計程車與冷氣景點的價值高於省小錢。");
  } else {
    advice.push("天氣穩定時可照原時間軸走，但仍保留餐廳排隊與交通緩衝。");
  }

  if (energy === "low") {
    advice.push("體力偏低時，只保留今日核心景點，刪掉逛街或遠距離支線。");
  } else if (energy === "high") {
    advice.push("體力很好時可加拍照點或夜間活動，但退稅與交通任務不能延後。");
  } else {
    advice.push("體力普通時維持主線，晚餐後再決定是否加夜間備案。");
  }

  if (day.day <= 4) {
    advice.push("大邱備案池：EXCO、間松美術館、大邱美術館、壽城池噴泉、西門夜市或七星夜市。");
  } else if (day.day === 5) {
    advice.push("Day5 避開廣安里與 BEXCO 周邊人潮，西面與 Spa Land 是最佳配置。");
  } else if (day.day === 8) {
    advice.push("醫美後若臉部敏感，取消多大浦海邊，改西面室內百貨與提早休息。");
  } else if (day.day === 9) {
    advice.push("返台日不加景點，11:20 前抵達金海機場最穩。");
  } else {
    advice.push("釜山備案池：海雲台室內商場、南浦商圈、Arte Museum、多大浦水舞。");
  }

  const nextStop = day.schedule.find((item) => item.mapKeyword && item.mapKeyword !== "-");
  assistantOutput.innerHTML = `
    <strong>卡迪巴拉建議：Day ${day.day} ${escapeHtml(day.title)}</strong>
    <ul>${advice.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    ${
      nextStop
        ? `<p><a class="map-btn" href="${nextStop.naverUrl}" target="_blank" rel="noreferrer">開啟下一個 NAVER 搜尋：${escapeHtml(nextStop.mapKeyword)}</a></p>`
        : ""
    }
  `;
}

renderTabs();
renderDay(1);
renderBig5();
renderBackups();
setupLinks();
setupAssistant();
