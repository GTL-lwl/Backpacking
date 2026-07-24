const data = window.TRAVEL_DATA;

const dayThemes = {
  1: {
    label: "抵達夜與凡一深夜美食",
    mood: "機場燈光、釜山夜色、輕量入境節奏",
    image: "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80",
    a: "#2dd4bf",
    b: "#f97316",
  },
  2: {
    label: "城市移防與大邱水岸",
    mood: "高鐵移動、藍色車站、壽城池午後",
    image: "https://images.unsplash.com/photo-1549194898-60fd030ecc0f?auto=format&fit=crop&w=1200&q=80",
    a: "#2563eb",
    b: "#fb7185",
  },
  3: {
    label: "大邱老城與韓系百貨",
    mood: "藥令市、韓屋咖啡、現代百貨冷氣路線",
    image: "https://images.unsplash.com/photo-1558862107-d49ef2a04d72?auto=format&fit=crop&w=1200&q=80",
    a: "#10b981",
    b: "#ec4899",
  },
  4: {
    label: "83塔夕陽與西門夜市",
    mood: "橘色夕陽、夜市霓虹、大邱最後一晚",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80",
    a: "#f97316",
    b: "#db2777",
  },
  5: {
    label: "釜山城市 Spa 與西面霓虹",
    mood: "Spa Land、百貨避暑、夜跑交通排雷",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
    a: "#06b6d4",
    b: "#8b5cf6",
  },
  6: {
    label: "機張海線與高空夜景",
    mood: "Skyline Luge、龍宮寺、海岸列車、X the SKY",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    a: "#0ea5e9",
    b: "#14b8a6",
  },
  7: {
    label: "松島纜車、影島藝術與南浦夜景",
    mood: "海上纜車、Arte Museum、釜山塔霓虹",
    image: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80",
    a: "#4f46e5",
    b: "#ec4899",
  },
  8: {
    label: "西面醫美與多大浦夕陽",
    mood: "韓系美容、血拼退稅、夕陽水舞",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    a: "#fb7185",
    b: "#0ea5e9",
  },
  9: {
    label: "返程清單與機場節奏",
    mood: "退房、轉乘、退稅、金海機場",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
    a: "#64748b",
    b: "#2563eb",
  },
};

window.DAY_THEMES = dayThemes;

const homeDayGrid = document.querySelector("#homeDayGrid");
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

window.escapeTravelHtml = escapeHtml;

function renderHomeDays() {
  if (!homeDayGrid) return;

  homeDayGrid.innerHTML = data.days
    .map((day) => {
      const theme = dayThemes[day.day];
      return `
        <a
          class="day-card"
          href="days/day${day.day}.html"
          style="--card-image: url('${theme.image}'); --card-a: ${theme.a}; --card-b: ${theme.b};"
        >
          <div class="day-card-content">
            <span>Day ${day.day} / ${escapeHtml(day.date)}</span>
            <h3>${escapeHtml(day.title)}</h3>
            <p>${escapeHtml(theme.label)}</p>
          </div>
        </a>
      `;
    })
    .join("");
}

function renderBig5() {
  if (!big5Summary || !big5Table) return;

  big5Summary.innerHTML = `
    <ul>
      ${data.big5.summary.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      <li><a href="${data.links.big5Doc}" target="_blank" rel="noreferrer">開啟 BIG 5 通行證策略原始 Google 文件</a></li>
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
  if (!backupGrid) return;

  backupGrid.innerHTML = data.backups
    .map(
      (item) => `
        <a class="backup-card" href="${item.url}" target="_blank" rel="noreferrer">
          <h3>${escapeHtml(item.title)}</h3>
          <p><strong>最適合放在：</strong>${escapeHtml(item.where)}</p>
          <p>${escapeHtml(item.strategy)}</p>
        </a>
      `,
    )
    .join("");
}

function setupLinks() {
  const links = {
    pdfLink: data.links.pdf,
    naverMapLink: data.links.naverMap,
    kimMapLink: data.links.kimBusanMap,
    kimPassLink: data.links.kimBusanPass,
    cheapMapLink: data.links.cheapMap,
  };

  Object.entries(links).forEach(([id, href]) => {
    const element = document.querySelector(`#${id}`);
    if (element) element.href = href;
  });
}

function parseDay(message) {
  const match = message.match(/day\s*([1-9])|第\s*([1-9])\s*天|([1-9])\s*天/i);
  const value = Number(match?.[1] || match?.[2] || match?.[3]);
  return data.days.find((day) => day.day === value) || null;
}

function formatSchedule(day, maxRows = 5) {
  return day.schedule
    .slice(0, maxRows)
    .map((item) => `${item.time}：${item.activity}`)
    .join("\n");
}

function findNextMap(day) {
  return day.schedule.find((item) => item.mapKeyword && item.mapKeyword !== "-");
}

function buildReply(rawMessage) {
  const message = rawMessage.trim();
  const lower = message.toLowerCase();
  const day = parseDay(message) || data.days[0];
  const isRain = /下雨|雨天|豪雨|rain/.test(lower);
  const isHot = /太熱|炎熱|hot|中暑/.test(lower);
  const isTired = /太累|疲勞|休息|走不動/.test(lower);
  const asksMap = /naver|地圖|導航|怎麼去|map/.test(lower);
  const asksRefund = /退稅|dozn|tax|機場/.test(lower);
  const asksBig5 = /big\s*5|通行證|pass|回本|票券/.test(lower);
  const asksFood = /吃|美食|餐|烤肉|咖啡|夜市/.test(lower);
  const asksSchedule = /行程|時間|安排|順序|day|第/.test(lower);

  if (/你好|哈囉|hello|hi|卡迪巴拉/.test(lower) && message.length < 12) {
    return "你好，我是卡迪巴拉 AI。可以問我：\n- Day6 下雨怎麼改？\n- Day8 醫美後適合去哪？\n- BIG 5 怎麼用最回本？\n- Day9 機場退稅怎麼排？";
  }

  if (asksBig5) {
    const list = data.big5.items.map((item) => `${item.order}：${item.name}｜${item.group}｜${item.price}`).join("\n");
    return `BIG 5 建議照高價與順路程度使用：\n${list}\n\n重點是把 Spa Land 放 Day5，Skyline Luge 與 X the SKY 放 Day6，松島纜車、Arte Museum、釜山塔放 Day7，避免每天來回拉車。`;
  }

  if (asksRefund) {
    return "退稅建議：\n1. Day3 大邱現代百貨先做市區退稅。\n2. Day5 回釜山後可整理大邱購物單據。\n3. Day8 西面血拼後做最後退稅與行李整理。\n4. Day9 提早到金海機場，先報到、再退稅、再安檢。";
  }

  if (asksMap) {
    const nextStop = findNextMap(day);
    return nextStop
      ? `Day ${day.day} 建議先用 NAVER Map 搜尋：${nextStop.mapKeyword}\n對應行程：${nextStop.activity}\n交通提醒：${nextStop.transport}\n\n韓國現地導航以 NAVER Map 為主，Google 地圖比較適合出發前總覽。`
      : "韓國現地導航建議直接用 NAVER Map；每日行程頁的地點按鈕會開對應搜尋。";
  }

  if (isRain || isHot || isTired) {
    const advice = [];
    if (isRain) advice.push("下雨時優先改室內：百貨、美術館、Spa Land、Arte Museum。");
    if (isHot) advice.push("太熱時把戶外壓到早上或傍晚，中午改百貨、咖啡廳、展館。");
    if (isTired) advice.push("太累時刪掉最遠或最低優先景點，保留住宿附近餐飲與已預約項目。");
    if (day.day <= 4) advice.push("大邱段可用 EXCO、間松美術館、大邱美術館或百貨作備案。");
    if (day.day === 5) advice.push("Day5 以西面和 Spa Land 為主，可以避開廣安里夜跑人潮。");
    if (day.day === 6) advice.push("Day6 若機張海線下雨，縮短龍宮寺與海岸列車，改海雲台室內商場或提早 X the SKY。");
    if (day.day === 7) advice.push("Day7 若戶外不順，保留 Arte Museum 與釜山塔，松島纜車視風雨決定。");
    if (day.day === 8) advice.push("Day8 醫美後以西面室內購物為主，多大浦夕陽水舞視體力與天氣決定。");
    if (day.day === 9) advice.push("Day9 不加景點，機場與退稅時間要保守。");
    return `Day ${day.day} 調整建議：\n${advice.map((item) => `- ${item}`).join("\n")}`;
  }

  if (asksFood) {
    const foodRows = day.schedule.filter((item) => /美食|餐|咖啡|烤肉|夜市|覓食/.test(item.activity + item.note));
    if (foodRows.length) {
      return `Day ${day.day} 餐飲相關安排：\n${foodRows.map((item) => `${item.time}：${item.activity}｜${item.note}`).join("\n")}`;
    }
    return `Day ${day.day} 主要不是美食日，建議用 NAVER Map 或韓國乞丐地圖查住宿與景點附近高評價餐廳。`;
  }

  if (asksSchedule) {
    return `Day ${day.day}：${day.title}\n${day.focus}\n\n前段行程：\n${formatSchedule(day)}\n\n完整安排請打開 Day ${day.day} 頁面或 Google 線上規劃書。`;
  }

  return `我先用 Day ${day.day} 回答：${day.focus}\n\n你可以更精準地問我「Day${day.day} 下雨怎麼改」、「Day${day.day} 怎麼搭 NAVER」、「Day${day.day} 吃什麼」或「BIG 5 怎麼排」。`;
}

function openChat() {
  if (!chatWindow || !chatLauncher || !chatInput) return;
  chatWindow.classList.add("is-open");
  chatWindow.setAttribute("aria-hidden", "false");
  chatLauncher.setAttribute("aria-expanded", "true");
  chatInput.focus();
}

function closeChat() {
  if (!chatWindow || !chatLauncher) return;
  chatWindow.classList.remove("is-open");
  chatWindow.setAttribute("aria-hidden", "true");
  chatLauncher.setAttribute("aria-expanded", "false");
}

function addMessage(role, text) {
  if (!chatMessages) return;
  const message = document.createElement("div");
  message.className = `chat-message ${role}`;
  message.textContent = text;
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function renderSuggestions() {
  if (!chatSuggestions || !chatForm || !chatInput) return;
  const suggestions = ["Day6 下雨怎麼改？", "BIG 5 怎麼最回本？", "Day8 醫美後備案", "Day9 機場退稅", "NAVER Map 怎麼用？"];
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
  if (!chatLauncher || !chatWindow || !chatClose || !chatForm || !chatInput) return;

  chatLauncher.addEventListener("click", openChat);
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
  addMessage("bot", "你好，我是卡迪巴拉 AI。你可以問我每日行程、雨天備案、NAVER 導航、BIG 5 通行證或退稅安排。");
}

renderHomeDays();
renderBig5();
renderBackups();
setupLinks();
setupChat();
