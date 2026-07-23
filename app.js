const data = window.TRAVEL_DATA;

const dayTabs = document.querySelector("#dayTabs");
const dayPanel = document.querySelector("#dayPanel");
const big5Summary = document.querySelector("#big5Summary");
const big5Table = document.querySelector("#big5Table");
const backupGrid = document.querySelector("#backupGrid");
const chatLauncher = document.querySelector("#chatLauncher");
const chatWindow = document.querySelector("#chatWindow");
const chatClose = document.querySelector("#chatClose");
const chatMessages = document.querySelector("#chatMessages");
const chatSuggestions = document.querySelector("#chatSuggestions");
const chatForm = document.querySelector("#chatForm");
const chatInput = document.querySelector("#chatInput");

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

function openChat() {
  chatWindow.classList.add("is-open");
  chatWindow.setAttribute("aria-hidden", "false");
  chatLauncher.setAttribute("aria-expanded", "true");
  chatInput.focus();
}

function closeChat() {
  chatWindow.classList.remove("is-open");
  chatWindow.setAttribute("aria-hidden", "true");
  chatLauncher.setAttribute("aria-expanded", "false");
}

function addMessage(role, text) {
  const message = document.createElement("div");
  message.className = `chat-message ${role}`;
  message.textContent = text;
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function parseDay(message) {
  const match = message.match(/day\s*([1-9])|第\s*([1-9])\s*天|([1-9])\s*日/i);
  const value = Number(match?.[1] || match?.[2] || match?.[3]);
  return data.days.find((day) => day.day === value) || null;
}

function formatSchedule(day, maxRows = 5) {
  return day.schedule
    .slice(0, maxRows)
    .map((item) => `${item.time}｜${item.activity}`)
    .join("\n");
}

function findNextMap(day) {
  return day.schedule.find((item) => item.mapKeyword && item.mapKeyword !== "-");
}

function buildReply(rawMessage) {
  const message = rawMessage.trim();
  const lower = message.toLowerCase();
  const day = parseDay(message) || data.days[0];
  const isRain = /雨|下雨|暴雨|雷雨|rain/.test(lower);
  const isHot = /熱|高溫|太陽|hot|曬/.test(lower);
  const isTired = /累|體力|走不動|疲|低/.test(lower);
  const asksMap = /naver|地圖|導航|怎麼去|交通|地址|map/.test(lower);
  const asksRefund = /退稅|dozn|tax|機場/.test(lower);
  const asksBig5 = /big\s*5|通行證|pass|票券|回本/.test(lower);
  const asksFood = /吃|餐|早餐|午餐|晚餐|美食|烤肉|市場/.test(lower);
  const asksSchedule = /行程|時間|幾點|安排|今天|明天|day|第/.test(lower);

  if (/你好|嗨|hello|hi|卡迪巴拉/.test(lower) && message.length < 12) {
    return "我在。你可以直接問：\n- Day6 下雨怎麼改？\n- Day8 醫美後還能去多大浦嗎？\n- BIG 5 怎麼用最回本？\n- Day9 幾點要去機場？";
  }

  if (asksBig5) {
    const list = data.big5.items.map((item) => `${item.order}｜${item.name}｜${item.group}｜${item.price}`).join("\n");
    return `BIG 5 建議照這個順序使用：\n${list}\n\n重點：A 組留給 Skyline Luge 與 X the SKY。Spa Land 放 Day5 但建議自費或用折扣票，不要浪費 A 組名額。`;
  }

  if (asksRefund) {
    return `退稅策略：\n1. Day3 大邱現代百貨/東城路先做第一波。\n2. Day5 西面或新世界百貨消費後做第二波。\n3. Day7 南浦/樂天超市光復店做伴手禮退稅。\n4. Day8 西面是最後防線。\n5. Day9 到金海機場只做海關條碼確認與必要補件，避免排隊壓線。`;
  }

  if (asksMap) {
    const nextStop = findNextMap(day);
    return nextStop
      ? `Day ${day.day} 建議用 NAVER Map 搜尋：${nextStop.mapKeyword}\n下一個主要點：${nextStop.activity}\n交通提醒：${nextStop.transport}\n\n若你要給司機看，直接複製韓文關鍵字最穩。`
      : "韓國導航以 NAVER Map 為主。請複製行程表中的韓文關鍵字到 NAVER Map 搜尋。";
  }

  if (isRain || isHot || isTired) {
    const advice = [];
    if (isRain) advice.push("下雨時優先改室內：百貨、美術館、Spa Land、Arte Museum。");
    if (isHot) advice.push("高溫時中午到下午少走路，計程車比硬轉乘更值得。");
    if (isTired) advice.push("體力低時只保留今日核心景點，刪掉逛街或遠距離支線。");
    if (day.day <= 4) advice.push("大邱備案：EXCO、間松美術館、大邱美術館、壽城池噴泉、西門夜市。");
    if (day.day === 5) advice.push("Day5 避開廣安里/BEXCO，留在西面與 Spa Land 最穩。");
    if (day.day === 6) advice.push("Day6 若機張海線下雨，縮短戶外龍宮寺與海岸列車，改海雲台室內商場或提早 X the SKY。");
    if (day.day === 7) advice.push("Day7 若松島或影島下雨，保留 Arte Museum，松島纜車視風雨狀況延後或取消。");
    if (day.day === 8) advice.push("Day8 醫美後若臉敏感，取消多大浦，改西面室內百貨與提早休息。");
    if (day.day === 9) advice.push("Day9 不加景點，11:20 前到金海機場。");
    return `Day ${day.day} 調整建議：\n${advice.map((item) => `- ${item}`).join("\n")}`;
  }

  if (asksFood) {
    const foodRows = day.schedule.filter((item) => /餐|市場|美食|烤肉|早餐|午餐|晚餐/.test(item.activity + item.note));
    if (foodRows.length) {
      return `Day ${day.day} 跟吃有關的安排：\n${foodRows.map((item) => `${item.time}｜${item.activity}｜${item.note}`).join("\n")}`;
    }
    return `Day ${day.day} 這天行程表沒有明確餐廳列，但可以用金導遊地圖與韓國乞丐地圖找附近高 CP 值餐點。`;
  }

  if (asksSchedule) {
    return `Day ${day.day}｜${day.title}\n${day.focus}\n\n前幾個行程：\n${formatSchedule(day)}\n\n要看完整內容可以點該日的 Google 線上規劃書。`;
  }

  return `我先用 Day ${day.day} 幫你判斷：${day.focus}\n\n你可以問得更具體，例如「Day${day.day} 下雨怎麼改」、「Day${day.day} 下一站 NAVER」、「Day${day.day} 晚餐」、「退稅怎麼安排」。`;
}

function renderSuggestions() {
  const suggestions = ["Day6 下雨怎麼改？", "BIG 5 怎麼最回本？", "Day8 醫美後備案", "Day9 幾點去機場？", "退稅怎麼排？"];
  chatSuggestions.innerHTML = suggestions
    .map((text) => `<button class="chat-suggestion" type="button">${escapeHtml(text)}</button>`)
    .join("");
  chatSuggestions.addEventListener("click", (event) => {
    const button = event.target.closest(".chat-suggestion");
    if (!button) return;
    chatInput.value = button.textContent;
    chatForm.requestSubmit();
  });
}

function setupChat() {
  chatLauncher.addEventListener("click", openChat);
  document.querySelectorAll("[data-open-chat]").forEach((button) => button.addEventListener("click", openChat));
  chatClose.addEventListener("click", closeChat);
  chatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = chatInput.value.trim();
    if (!message) return;
    addMessage("user", message);
    chatInput.value = "";
    window.setTimeout(() => addMessage("bot", buildReply(message)), 180);
  });
  renderSuggestions();
  addMessage("bot", "你好，我是卡迪巴拉。你可以直接問我每天行程、下雨備案、NAVER 導航、BIG 5、退稅或返程安排。");
}

renderTabs();
renderDay(1);
renderBig5();
renderBackups();
setupLinks();
setupChat();
