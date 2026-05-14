const STORAGE_KEY = "nz-south-island-trip-data-v5";
const LEGACY_STORAGE_KEYS = [
  "nz-south-island-trip-data-v4",
  "nz-south-island-trip-data-v3",
  "nz-south-island-trip-data-v2"
];
const IMAGE_DB_NAME = "nz-south-island-trip-images";
const IMAGE_STORE_NAME = "images";
const IMAGE_REF_PREFIX = "idb-image:";
const GOOGLE_SHEET_ID = "16Lw_wvC0brbbkvOyXk4X1OIxyhGj2vKizif2kIgxuDA";
const GOOGLE_SHEET_META_GID = "103924319";
const GOOGLE_SHEET_ITINERARY_GID = "40512512";
const GOOGLE_SHEET_META_URL = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/edit?gid=${GOOGLE_SHEET_META_GID}#gid=${GOOGLE_SHEET_META_GID}`;
const GOOGLE_SHEET_ITINERARY_URL = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/edit?gid=${GOOGLE_SHEET_ITINERARY_GID}#gid=${GOOGLE_SHEET_ITINERARY_GID}`;
const GOOGLE_SHEET_META_TSV_URL = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/export?format=tsv&gid=${GOOGLE_SHEET_META_GID}`;
const GOOGLE_SHEET_ITINERARY_TSV_URL = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/export?format=tsv&gid=${GOOGLE_SHEET_ITINERARY_GID}`;
const SHEET_SYNC_INTERVAL_MS = 60000;

const tabs = [
  { id: "overview", label: "總覽" },
  { id: "itinerary", label: "每日行程" },
  { id: "flights", label: "航班與花費" },
  { id: "map", label: "地圖" },
  { id: "offline", label: "離線地圖" },
  { id: "editor", label: "編輯資料" }
];

const panelMap = {
  overview: document.querySelector("#panel-overview"),
  itinerary: document.querySelector("#panel-itinerary"),
  flights: document.querySelector("#panel-flights"),
  map: document.querySelector("#panel-map"),
  offline: document.querySelector("#panel-offline"),
  editor: document.querySelector("#panel-editor")
};

const state = {
  activeTab: "overview",
  dayIndex: 0,
  mapEventIndex: 0,
  editorDayIndex: 0,
  editorDirty: false,
  lastSavedAt: null,
  dayNavScroll: {
    itinerary: 0,
    map: 0,
    offline: 0,
    editor: 0
  },
  imageCache: {},
  imageMetaCache: {},
  pendingImageLoads: new Set(),
  pendingImageMetaLoads: new Set(),
  syncInProgress: false,
  sheetLoadedAt: null,
  sheetError: "",
  sheetBaseData: structuredClone(window.defaultTripData),
  localDraft: null,
  localDraftEnabled: false,
  data: structuredClone(window.defaultTripData)
};

function hydrateData(stored, baseData = window.defaultTripData) {
  const base = structuredClone(baseData);
  if (!stored || typeof stored !== "object") {
    return base;
  }

  const merged = {
    ...base,
    ...stored,
    heroImage: { ...base.heroImage, ...(stored.heroImage || {}) },
    overviewImage: { ...(base.overviewImage || {}), ...(stored.overviewImage || {}) },
    overview: {
      ...(base.overview || {}),
      ...(stored.overview || {}),
      sectionTitles: {
        ...(base.overview?.sectionTitles || {}),
        ...(stored.overview?.sectionTitles || {})
      }
    },
    costs: { ...base.costs, ...(stored.costs || {}) },
    onlineNavigation: stored.onlineNavigation || base.onlineNavigation,
    offlineNavigation: stored.offlineNavigation || base.offlineNavigation,
    preTrip: Array.isArray(stored.preTrip) && stored.preTrip.length ? stored.preTrip : base.preTrip
  };

  merged.overview.journalRows = Array.isArray(stored.overview?.journalRows) && stored.overview.journalRows.length
    ? stored.overview.journalRows
    : base.overview.journalRows;

  merged.itinerary = base.itinerary.map((baseDay, index) => {
    const savedDay = stored.itinerary?.[index] || {};
    const mergedDay = {
      ...baseDay,
      ...savedDay,
      highlight: {
        ...(baseDay.highlight || {}),
        ...(savedDay.highlight || {})
      }
    };

    mergedDay.events = baseDay.events.map((baseEvent, eventIndex) => {
      const savedEvent = savedDay.events?.[eventIndex] || {};
      return {
        ...baseEvent,
        ...savedEvent,
        links: savedEvent.links || baseEvent.links || []
      };
    });

    if (savedDay.events && savedDay.events.length > baseDay.events.length) {
      mergedDay.events.push(...savedDay.events.slice(baseDay.events.length));
    }

    return mergedDay;
  });

  if (stored.itinerary && stored.itinerary.length > base.itinerary.length) {
    merged.itinerary.push(...stored.itinerary.slice(base.itinerary.length));
  }

  return merged;
}

function loadLocalDraft() {
  const stored = localStorage.getItem(STORAGE_KEY);
  let currentData = null;
  if (stored) {
    try {
      currentData = JSON.parse(stored);
    } catch {
      currentData = null;
    }
  }

  let recovered = false;
  for (const legacyKey of LEGACY_STORAGE_KEYS) {
    const legacyStored = localStorage.getItem(legacyKey);
    if (!legacyStored) {
      continue;
    }

    try {
      const legacyData = JSON.parse(legacyStored);
      if (!currentData) {
        currentData = legacyData;
        recovered = true;
        continue;
      }
      const legacyHydrated = hydrateData(legacyData);
      const currentHydrated = currentData ? hydrateData(currentData) : structuredClone(window.defaultTripData);
      const base = structuredClone(window.defaultTripData);

      if (
        JSON.stringify(legacyHydrated.preTrip) !== JSON.stringify(base.preTrip) &&
        JSON.stringify(currentHydrated.preTrip) === JSON.stringify(base.preTrip)
      ) {
        currentData = currentData || {};
        currentData.preTrip = structuredClone(legacyHydrated.preTrip);
        recovered = true;
      }

      if (
        JSON.stringify(legacyHydrated.costs?.required) !== JSON.stringify(base.costs.required) &&
        JSON.stringify(currentHydrated.costs?.required) === JSON.stringify(base.costs.required)
      ) {
        currentData = currentData || {};
        currentData.costs = currentData.costs || {};
        currentData.costs.required = structuredClone(legacyData.costs.required);
        recovered = true;
      }
    } catch {
      // Ignore unreadable legacy drafts.
    }
  }

  if (recovered) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
  }

  return currentData;
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
  state.localDraft = structuredClone(state.data);
  state.localDraftEnabled = true;
  state.editorDirty = false;
  state.lastSavedAt = Date.now();
}

function clearLocalDraft() {
  localStorage.removeItem(STORAGE_KEY);
  state.localDraft = null;
  state.localDraftEnabled = false;
}

function applyDataSources() {
  state.data = state.localDraft && state.localDraftEnabled
    ? hydrateData(state.localDraft, state.sheetBaseData)
    : structuredClone(state.sheetBaseData);
}

function decodeSheetValue(value) {
  return String(value || "").replaceAll(" ⏎ ", "\n");
}

function toNumber(value) {
  return Number.parseInt(value, 10) || 0;
}

function ensureArraySize(target, size, factory) {
  while (target.length < size) {
    target.push(factory(target.length));
  }
}

function createBlankDay(dayNumber) {
  return {
    day: dayNumber,
    date: "",
    title: "",
    highlight: {
      title: "",
      imageUrl: "",
      caption: "",
      prompt: ""
    },
    mode: "",
    route: "",
    stay: "",
    drive: "",
    mapFocus: "",
    offlineSummary: "",
    events: []
  };
}

function createBlankEvent() {
  return {
    time: "",
    title: "",
    duration: "",
    cost: "",
    tag: "",
    mapQuery: "",
    note: "",
    offlineNote: "",
    links: []
  };
}

function buildDataFromSheetRows(rows) {
  const base = structuredClone(window.defaultTripData);
  if (!Array.isArray(rows) || rows.length <= 1) {
    return base;
  }

  const data = structuredClone(base);
  const itineraryDays = [];
  const flightMap = [];
  const airfare = [];
  const daylight = [];
  const onlineNavigation = [];
  const offlineNavigation = [];
  const preTripGroups = [];
  const requiredCosts = [];
  const extrasCosts = [];
  const alreadyPaid = [];
  const paidLinks = [];
  const fieldBudget = [];
  const journalRows = [];
  const sectionTitles = { ...(base.overview?.sectionTitles || {}) };

  rows.slice(1).forEach((row) => {
    const [section, key1, key2, key3, value1 = "", value2 = "", value3 = "", value4 = "", value5 = ""] = row;
    const v1 = decodeSheetValue(value1);
    const v2 = decodeSheetValue(value2);
    const v3 = decodeSheetValue(value3);
    const v4 = decodeSheetValue(value4);
    const v5 = decodeSheetValue(value5);

    if (!section) {
      return;
    }

    switch (section) {
      case "site_meta":
        if (key1 === "title") data.title = v1;
        if (key1 === "period") data.period = v1;
        if (key1 === "travelers") data.travelers = v1;
        if (key1 === "heroImage" && key2 === "url") data.heroImage.url = v1;
        if (key1 === "heroImage" && key2 === "alt") data.heroImage.alt = v1;
        if (key1 === "overviewImage" && key2 === "url") data.overviewImage.url = v1;
        if (key1 === "overviewImage" && key2 === "alt") data.overviewImage.alt = v1;
        if (key1 === "posterStyle" && key2 === "title") data.posterStyle.title = v1;
        if (key1 === "posterStyle" && key2 === "prompt") data.posterStyle.prompt = v1;
        break;
      case "overview_journal":
        if (key1 === "coverTitle") {
          data.overview.coverTitle = v1;
        } else if (key1 === "journalTitle") {
          data.overview.journalTitle = v1;
        } else if (key1 === "row") {
          journalRows[toNumber(key2) - 1] = { label: v1, text: v2 };
        } else if (key1 === "sectionTitle") {
          sectionTitles[key2] = v1;
        }
        break;
      case "pretrip": {
        const groupIndex = toNumber(key2) - 1;
        ensureArraySize(preTripGroups, groupIndex + 1, () => ({ title: "", items: [] }));
        if (key3 === "title") {
          preTripGroups[groupIndex].title = v1;
        } else {
          preTripGroups[groupIndex].items[toNumber(key3) - 1] = v1;
        }
        break;
      }
      case "cost_required":
        requiredCosts[toNumber(key1) - 1] = [v1, v2];
        break;
      case "cost_extras":
        extrasCosts[toNumber(key1) - 1] = [v1, v2];
        break;
      case "cost_paid":
        alreadyPaid[toNumber(key1) - 1] = [v1, v2, v3];
        break;
      case "cost_paid_links":
        paidLinks[toNumber(key1) - 1] = { title: v1, label: v2, url: v3 };
        break;
      case "cost_field_budget":
        fieldBudget[toNumber(key1) - 1] = [v1, v2, v3, v4];
        break;
      case "cost_totals":
        if (key1 === "fixedSubtotal") data.costs.fixedSubtotal = v1;
        if (key1 === "flexibleBudget") data.costs.flexibleBudget = v1;
        break;
      case "flights": {
        const flightIndex = toNumber(key1) - 1;
        ensureArraySize(flightMap, flightIndex + 1, () => ({ date: "", title: "", notes: [] }));
        if (key2 === "date") flightMap[flightIndex].date = v1;
        if (key2 === "title") flightMap[flightIndex].title = v1;
        if (key2 === "note") flightMap[flightIndex].notes[toNumber(key3) - 1] = v1;
        break;
      }
      case "airfare":
        airfare[toNumber(key1) - 1] = { traveler: v1, detail: v2 };
        break;
      case "daylight":
        daylight[toNumber(key1) - 1] = { month: v1, sunrise: v2, sunset: v3, duration: v4 };
        break;
      case "online_navigation":
        onlineNavigation[toNumber(key1) - 1] = { name: v1, description: v2 };
        break;
      case "offline_navigation":
        offlineNavigation[toNumber(key1) - 1] = { name: v1, description: v2 };
        break;
      case "itinerary_days": {
        const dayIndex = toNumber(key1) - 1;
        ensureArraySize(itineraryDays, dayIndex + 1, (index) => createBlankDay(index + 1));
        const day = itineraryDays[dayIndex];
        if (key2 === "date") day.date = v1;
        if (key2 === "title") day.title = v1;
        if (key2 === "mode") day.mode = v1;
        if (key2 === "route") day.route = v1;
        if (key2 === "stay") day.stay = v1;
        if (key2 === "drive") day.drive = v1;
        if (key2 === "mapFocus") day.mapFocus = v1;
        if (key2 === "offlineSummary") day.offlineSummary = v1;
        if (key2 === "highlightTitle") day.highlight.title = v1;
        if (key2 === "highlightImageUrl") day.highlight.imageUrl = v1;
        if (key2 === "highlightCaption") day.highlight.caption = v1;
        if (key2 === "highlightPrompt") day.highlight.prompt = v1;
        break;
      }
      case "itinerary_events":
      case "itinerary_event_links": {
        const dayIndex = toNumber(key1) - 1;
        const eventIndex = toNumber(key2) - 1;
        ensureArraySize(itineraryDays, dayIndex + 1, (index) => createBlankDay(index + 1));
        ensureArraySize(itineraryDays[dayIndex].events, eventIndex + 1, () => createBlankEvent());
        const event = itineraryDays[dayIndex].events[eventIndex];
        if (section === "itinerary_events") {
          if (key3 === "time") event.time = v1;
          if (key3 === "title") event.title = v1;
          if (key3 === "duration") event.duration = v1;
          if (key3 === "cost") event.cost = v1;
          if (key3 === "tag") event.tag = v1;
          if (key3 === "mapQuery") event.mapQuery = v1;
          if (key3 === "note") event.note = v1;
          if (key3 === "offlineNote") event.offlineNote = v1;
        } else {
          event.links[toNumber(key3) - 1] = { label: v1, url: v2 };
        }
        break;
      }
      default:
        break;
    }
  });

  if (journalRows.filter(Boolean).length) {
    data.overview.journalRows = journalRows.filter(Boolean);
  }

  data.overview.sectionTitles = sectionTitles;
  if (preTripGroups.filter(Boolean).length) {
    data.preTrip = preTripGroups.filter(Boolean).map((group) => ({
      title: group.title,
      items: (group.items || []).filter(Boolean)
    }));
  }

  if (requiredCosts.filter(Boolean).length) data.costs.required = requiredCosts.filter(Boolean);
  if (extrasCosts.filter(Boolean).length) data.costs.extras = extrasCosts.filter(Boolean);
  if (alreadyPaid.filter(Boolean).length) data.costs.alreadyPaid = alreadyPaid.filter(Boolean);
  data.costs.paidLinks = paidLinks.filter(Boolean);
  if (fieldBudget.filter(Boolean).length) data.costs.fieldBudget = fieldBudget.filter(Boolean);
  if (flightMap.filter(Boolean).length) {
    data.flights = flightMap.filter(Boolean).map((flight) => ({ ...flight, notes: (flight.notes || []).filter(Boolean) }));
  }
  if (airfare.filter(Boolean).length) data.airfare = airfare.filter(Boolean);
  if (daylight.filter(Boolean).length) data.daylight = daylight.filter(Boolean);
  if (onlineNavigation.filter(Boolean).length) data.onlineNavigation = onlineNavigation.filter(Boolean);
  if (offlineNavigation.filter(Boolean).length) data.offlineNavigation = offlineNavigation.filter(Boolean);
  if (itineraryDays.filter(Boolean).length) {
    data.itinerary = itineraryDays.filter(Boolean).map((day, index) => ({
      ...createBlankDay(index + 1),
      ...day,
      events: (day.events || []).filter(Boolean).map((event) => ({
        ...createBlankEvent(),
        ...event,
        links: (event.links || []).filter(Boolean)
      }))
    }));
  }

  return data;
}

function parseTsv(text) {
  return text
    .trim()
    .split("\n")
    .map((line) => line.replace(/\r$/, "").split("\t"));
}

function formatSheetDateValue(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return "";
  }

  const serial = Number(raw);
  if (!Number.isFinite(serial) || !/^\d+(\.\d+)?$/.test(raw) || serial < 40000) {
    return raw;
  }

  const utcTime = Date.UTC(1899, 11, 30) + Math.round(serial) * 86400000;
  const date = new Date(utcTime);
  return `${date.getUTCMonth() + 1}/${date.getUTCDate()}`;
}

function buildEditableItineraryFromRows(rows, baseItinerary) {
  if (!Array.isArray(rows) || rows.length <= 1) {
    return structuredClone(baseItinerary);
  }

  const itinerary = structuredClone(baseItinerary).map((day, index) => ({
    ...createBlankDay(index + 1),
    ...day,
    highlight: {
      ...createBlankDay(index + 1).highlight,
      ...(day.highlight || {})
    },
    events: []
  }));

  rows.slice(1).forEach((row) => {
    const [
      dayValue = "",
      eventValue = "",
      date = "",
      dayTitle = "",
      mode = "",
      route = "",
      stay = "",
      drive = "",
      mapFocus = "",
      offlineSummary = "",
      highlightTitle = "",
      highlightImageUrl = "",
      highlightCaption = "",
      highlightPrompt = "",
      time = "",
      title = "",
      duration = "",
      cost = "",
      tag = "",
      mapQuery = "",
      note = "",
      offlineNote = "",
      link1Label = "",
      link1Url = "",
      link2Label = "",
      link2Url = "",
      link3Label = "",
      link3Url = ""
    ] = row.map((cell) => decodeSheetValue(cell));

    const dayIndex = toNumber(dayValue) - 1;
    if (dayIndex < 0) {
      return;
    }

    ensureArraySize(itinerary, dayIndex + 1, (index) => createBlankDay(index + 1));
    const day = itinerary[dayIndex];

    day.day = dayIndex + 1;
    day.date = formatSheetDateValue(date) || day.date;
    day.title = dayTitle || day.title;
    day.mode = mode || day.mode;
    day.route = route || day.route;
    day.stay = stay || day.stay;
    day.drive = drive || day.drive;
    day.mapFocus = mapFocus || day.mapFocus;
    day.offlineSummary = offlineSummary || day.offlineSummary;
    day.highlight = {
      title: highlightTitle || day.highlight?.title || "",
      imageUrl: highlightImageUrl || day.highlight?.imageUrl || "",
      caption: highlightCaption || day.highlight?.caption || "",
      prompt: highlightPrompt || day.highlight?.prompt || ""
    };

    if (!eventValue && !title && !time && !note && !mapQuery) {
      return;
    }

    const eventIndex = Math.max(toNumber(eventValue) - 1, 0);
    ensureArraySize(day.events, eventIndex + 1, () => createBlankEvent());

    const links = [
      [link1Label, link1Url],
      [link2Label, link2Url],
      [link3Label, link3Url]
    ]
      .filter(([label, url]) => label || url)
      .map(([label, url]) => ({ label, url }));

    day.events[eventIndex] = {
      ...createBlankEvent(),
      ...day.events[eventIndex],
      time,
      title,
      duration,
      cost,
      tag,
      mapQuery,
      note,
      offlineNote,
      links
    };
  });

  return itinerary.map((day, index) => ({
    ...createBlankDay(index + 1),
    ...day,
    highlight: {
      ...createBlankDay(index + 1).highlight,
      ...(day.highlight || {})
    },
    events: (day.events || []).filter((event) => event && (event.title || event.note || event.mapQuery))
  }));
}

async function fetchTsvRows(url) {
  const response = await fetch(`${url}&cachebust=${Date.now()}`);
  if (!response.ok) {
    throw new Error(`Google Sheet 讀取失敗 (${response.status})`);
  }

  const text = await response.text();
  return parseTsv(text);
}

async function fetchSheetData() {
  const [metaRows, itineraryRows] = await Promise.all([
    fetchTsvRows(GOOGLE_SHEET_META_TSV_URL),
    fetchTsvRows(GOOGLE_SHEET_ITINERARY_TSV_URL)
  ]);
  const data = buildDataFromSheetRows(metaRows);
  data.itinerary = buildEditableItineraryFromRows(itineraryRows, data.itinerary);
  return data;
}

async function syncSheetData({ resetLocalDraft = false } = {}) {
  state.syncInProgress = true;
  state.sheetError = "";
  renderEditor();
  setActiveTab(state.activeTab);

  try {
    const remoteData = await fetchSheetData();
    state.sheetBaseData = remoteData;
    state.sheetLoadedAt = Date.now();
    if (resetLocalDraft) {
      clearLocalDraft();
    }
    applyDataSources();
    renderAll();
  } catch (error) {
    state.sheetError = error.message;
    renderEditor();
    setActiveTab(state.activeTab);
  } finally {
    state.syncInProgress = false;
    renderEditor();
    setActiveTab(state.activeTab);
  }
}

function formatSyncTime() {
  if (!state.sheetLoadedAt) {
    return "尚未同步";
  }

  return `已同步 ${new Date(state.sheetLoadedAt).toLocaleTimeString("zh-Hant", {
    hour: "2-digit",
    minute: "2-digit"
  })}`;
}

function formatSavedAt() {
  if (!state.lastSavedAt) {
    return "尚未儲存";
  }

  return `已儲存 ${new Date(state.lastSavedAt).toLocaleTimeString("zh-Hant", {
    hour: "2-digit",
    minute: "2-digit"
  })}`;
}

function updateEditorSaveState() {
  const status = panelMap.editor.querySelector("#editor-save-status");
  if (!status) {
    return;
  }

  status.textContent = state.editorDirty ? "尚未儲存" : formatSavedAt();
  status.classList.toggle("dirty", state.editorDirty);
}

function markEditorDirty() {
  state.editorDirty = true;
  updateEditorSaveState();
}

function attachEditorDirtyTracking() {
  panelMap.editor
    .querySelectorAll("input, textarea, select")
    .forEach((field) => {
      if (field.id === "raw-json-editor") {
        field.addEventListener("input", markEditorDirty);
        return;
      }

      field.addEventListener("input", markEditorDirty);
      field.addEventListener("change", markEditorDirty);
    });
}

function isStoredImageRef(value) {
  return typeof value === "string" && value.startsWith(IMAGE_REF_PREFIX);
}

function createImageRef() {
  const id = typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${IMAGE_REF_PREFIX}${id}`;
}

function openImageDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(IMAGE_DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(IMAGE_STORE_NAME)) {
        db.createObjectStore(IMAGE_STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("圖片資料庫開啟失敗"));
  });
}

async function putImageData(ref, dataUrl) {
  const db = await openImageDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(IMAGE_STORE_NAME, "readwrite");
    transaction.objectStore(IMAGE_STORE_NAME).put(dataUrl, ref);
    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error || new Error("圖片儲存失敗"));
    };
  });
}

async function getImageData(ref) {
  const db = await openImageDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(IMAGE_STORE_NAME, "readonly");
    const request = transaction.objectStore(IMAGE_STORE_NAME).get(ref);
    request.onsuccess = () => {
      db.close();
      resolve(request.result || "");
    };
    request.onerror = () => {
      db.close();
      reject(request.error || new Error("圖片讀取失敗"));
    };
  });
}

async function deleteImageData(ref) {
  if (!isStoredImageRef(ref)) {
    return;
  }

  const db = await openImageDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(IMAGE_STORE_NAME, "readwrite");
    transaction.objectStore(IMAGE_STORE_NAME).delete(ref);
    transaction.oncomplete = () => {
      db.close();
      delete state.imageCache[ref];
      resolve();
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error || new Error("圖片刪除失敗"));
    };
  });
}

function loadHtmlImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("圖片載入失敗"));
    image.src = src;
  });
}

async function optimizeImageDataUrl(file) {
  const sourceDataUrl = await readFileAsDataUrl(file);
  if (!file.type.startsWith("image/") || file.type.includes("svg") || file.type.includes("gif")) {
    return sourceDataUrl;
  }

  const image = await loadHtmlImage(sourceDataUrl);
  const maxDimension = 1800;
  const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL("image/webp", 0.84);
}

async function storeUploadedImage(file) {
  const ref = createImageRef();
  const dataUrl = await optimizeImageDataUrl(file);
  await putImageData(ref, dataUrl);
  state.imageCache[ref] = dataUrl;
  return ref;
}

function forEachImageField(visitor) {
  visitor(state.data.heroImage, "url");
  visitor(state.data.overviewImage, "url");
  state.data.itinerary.forEach((day) => {
    if (day.highlight) {
      visitor(day.highlight, "imageUrl");
    }
  });
}

async function normalizeImageValue(nextValue, previousValue = "") {
  const trimmed = (nextValue || "").trim();
  if (!trimmed) {
    if (isStoredImageRef(previousValue)) {
      await deleteImageData(previousValue);
    }
    return "";
  }

  if (isStoredImageRef(trimmed) || !trimmed.startsWith("data:image/")) {
    if (isStoredImageRef(previousValue) && previousValue !== trimmed && !isStoredImageRef(trimmed)) {
      await deleteImageData(previousValue);
    }
    return trimmed;
  }

  const ref = createImageRef();
  await putImageData(ref, trimmed);
  state.imageCache[ref] = trimmed;
  if (isStoredImageRef(previousValue) && previousValue !== ref) {
    await deleteImageData(previousValue);
  }
  return ref;
}

async function migrateEmbeddedImages() {
  let changed = false;
  const tasks = [];

  forEachImageField((container, key) => {
    if (container?.[key]?.startsWith("data:image/")) {
      tasks.push(
        normalizeImageValue(container[key], "").then((ref) => {
          container[key] = ref;
          changed = true;
        })
      );
    }
  });

  if (tasks.length) {
    await Promise.all(tasks);
  }

  if (changed) {
    saveData();
  }
}

function getActiveDay() {
  return state.data.itinerary[state.dayIndex];
}

function getMapEvent() {
  const day = getActiveDay();
  return day.events[state.mapEventIndex] || day.events[0];
}

function qs(value) {
  return encodeURIComponent(value || "");
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function createPlaceholderImage(label) {
  const safeLabel = escapeHtml(label || "New Zealand South Island");
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#33546d" />
          <stop offset="52%" stop-color="#5f8096" />
          <stop offset="100%" stop-color="#dce8f2" />
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#bg)" />
      <circle cx="932" cy="176" r="74" fill="rgba(255,255,255,0.26)" />
      <path d="M0 560 L210 432 L365 506 L582 298 L740 390 L944 214 L1200 418 V800 H0 Z" fill="rgba(18,41,60,0.28)" />
      <path d="M0 624 L182 504 L358 586 L544 410 L746 512 L952 356 L1200 538 V800 H0 Z" fill="rgba(255,255,255,0.2)" />
      <text x="80" y="118" font-family="Arial, sans-serif" font-size="28" letter-spacing="7" fill="rgba(255,255,255,0.76)">SOUTH ISLAND WINTER</text>
      <text x="80" y="666" font-family="Arial, sans-serif" font-size="54" font-weight="700" fill="#f7fbff">${safeLabel}</text>
      <text x="80" y="718" font-family="Arial, sans-serif" font-size="24" fill="rgba(247,251,255,0.88)">Upload your own image in the editor panel anytime.</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function getImageSource(url, fallbackLabel) {
  if (isStoredImageRef(url)) {
    if (state.imageCache[url]) {
      return state.imageCache[url];
    }

    if (!state.pendingImageLoads.has(url)) {
      state.pendingImageLoads.add(url);
      getImageData(url)
        .then((dataUrl) => {
          if (dataUrl) {
            state.imageCache[url] = dataUrl;
            renderAll();
          }
        })
        .catch(() => {})
        .finally(() => {
          state.pendingImageLoads.delete(url);
        });
    }

    return createPlaceholderImage(fallbackLabel);
  }

  return url && url.trim() ? url.trim() : createPlaceholderImage(fallbackLabel);
}

function getImageLayoutClass(imageKey, imageSrc) {
  const cacheKey = imageKey || imageSrc;
  const cachedMeta = state.imageMetaCache[cacheKey];
  if (cachedMeta?.variant) {
    return cachedMeta.variant;
  }

  if (imageSrc && !state.pendingImageMetaLoads.has(cacheKey)) {
    state.pendingImageMetaLoads.add(cacheKey);
    loadHtmlImage(imageSrc)
      .then((image) => {
        const ratio = image.width / image.height;
        const variant = ratio > 1.08 ? "landscape" : ratio < 0.92 ? "portrait" : "square";
        state.imageMetaCache[cacheKey] = { width: image.width, height: image.height, variant };
        renderAll();
      })
      .catch(() => {})
      .finally(() => {
        state.pendingImageMetaLoads.delete(cacheKey);
      });
  }

  return "portrait";
}

function attachImageFallbacks(scope = document) {
  scope.querySelectorAll("img[data-fallback-label]").forEach((image) => {
    const applyFallback = () => {
      image.src = createPlaceholderImage(image.dataset.fallbackLabel || "South Island");
    };

    image.addEventListener("error", applyFallback, { once: true });

    if (image.complete && image.naturalWidth === 0) {
      applyFallback();
    }
  });
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error("圖片讀取失敗"));
    reader.readAsDataURL(file);
  });
}

function mapsSearchUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${qs(query)}`;
}

function mapsDirectionsUrl(destination) {
  const origin = getActiveDay().mapFocus || destination;
  return `https://www.google.com/maps/dir/?api=1&origin=${qs(origin)}&destination=${qs(destination)}&travelmode=driving`;
}

function formatTag(tagKey) {
  const tag = state.data.tags.find((item) => item.key === tagKey);
  if (!tag) {
    return "";
  }

  return `<span class="tag-pill tag-${tag.key}">${tag.label}</span>`;
}

function renderTabbar() {
  const tabbar = document.querySelector("#tabbar");
  tabbar.innerHTML = tabs
    .map(
      (tab) => `
        <button class="tab-button ${tab.id === state.activeTab ? "active" : ""}" data-tab="${tab.id}">
          ${tab.label}
        </button>
      `
    )
    .join("");

  tabbar.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", () => {
      setActiveTab(button.dataset.tab);
    });
  });
}

function setActiveTab(tabId) {
  state.activeTab = tabId;
  renderTabbar();
  document.querySelectorAll(".panel").forEach((panel) => panel.classList.remove("active"));
  panelMap[state.activeTab].classList.add("active");
}

function renderHero() {
  document.querySelector("#hero-banner").innerHTML = `
    <div class="hero-banner-image hero-banner-image-full">
      <img
        class="trip-image"
        src="${getImageSource(state.data.heroImage.url, state.data.heroImage.alt || state.data.title)}"
        alt="${state.data.heroImage.alt}"
        data-fallback-label="${escapeHtml(state.data.heroImage.alt || state.data.title)}"
      />
      <div class="hero-cover-card">
        <p class="hero-cover-kicker">South Island Winter</p>
        <h2>${state.data.title}</h2>
        <div class="hero-cover-meta">
          <span>${state.data.period}</span>
          <span>賞景打卡風景明信片之旅</span>
        </div>
      </div>
    </div>
  `;
  attachImageFallbacks(document.querySelector("#hero-banner"));
}

function renderOverview() {
  const overviewImageValue = state.data.overviewImage?.url || state.data.heroImage.url;
  const overviewImageAlt = state.data.overviewImage?.alt || state.data.title;
  const overviewImageSrc = getImageSource(overviewImageValue, overviewImageAlt);
  const overviewImageLayoutClass = getImageLayoutClass(overviewImageValue, overviewImageSrc);
  const overviewTitle = (state.data.overview?.coverTitle || state.data.title).split("\n").join("<br />");
  const journalRows = (state.data.overview?.journalRows || [])
    .map(
      (row) => `
        <div class="journal-row">
          <strong>${row.label}</strong>
          <p>${row.text}</p>
        </div>
      `
    )
    .join("");
  const requiredCosts = state.data.costs.required
    .map(([name, price]) => `<li><span>${name}</span><strong>${price}</strong></li>`)
    .join("");

  const fieldBudgetRows = state.data.costs.fieldBudget
    .map(
      ([name, total, avg, desc]) => `
        <tr>
          <td>${name}</td>
          <td>${total}</td>
          <td>${avg}</td>
          <td>${desc}</td>
        </tr>
      `
    )
    .join("");

  panelMap.overview.innerHTML = `
    <article class="surface overview-cover">
      <div class="overview-copy">
        <p class="overview-kicker">${state.data.period}</p>
        <h2 class="overview-title">${overviewTitle}</h2>
      </div>
      <div class="overview-book">
        <div class="overview-book-spine"></div>
        <div class="overview-book-cover ${overviewImageLayoutClass}">
          <img
            class="trip-image"
            src="${overviewImageSrc}"
            alt="${overviewImageAlt}"
            data-fallback-label="${escapeHtml(overviewImageAlt)}"
          />
        </div>
      </div>
    </article>

    <article class="surface journal-panel">
      <h2>${state.data.overview?.journalTitle || "這趟旅程"}</h2>
      <div class="journal-list">${journalRows}</div>
    </article>

    <article class="surface">
      <h2>${state.data.overview?.sectionTitles?.preTrip || "行前整理"}</h2>
      <div class="mini-grid">
        ${state.data.preTrip
          .map(
            (group) => `
              <article class="mini-card prep-card">
                <strong>${group.title}</strong>
                <ul class="checklist compact">${group.items.map((item) => `<li>${item}</li>`).join("")}</ul>
              </article>
            `
          )
          .join("")}
      </div>
    </article>

    <article class="surface">
      <h2>${state.data.overview?.sectionTitles?.requiredCosts || "必須花費"}</h2>
      <ul class="price-list">${requiredCosts}</ul>
    </article>

    <article class="surface">
      <h2>${state.data.overview?.sectionTitles?.fieldBudget || "現場花費預估"}</h2>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>類別</th>
              <th>總支出</th>
              <th>平均每人</th>
              <th>說明</th>
            </tr>
          </thead>
          <tbody>${fieldBudgetRows}</tbody>
        </table>
      </div>
    </article>
  `;
  attachImageFallbacks(panelMap.overview);
}

function renderDayNav(activeIndex, className = "day-chip") {
  return state.data.itinerary
    .map(
      (day, index) => `
        <button class="${className} ${index === activeIndex ? "active" : ""}" data-day-index="${index}">
          Day ${day.day}<span>${day.date}</span>
        </button>
      `
    )
    .join("");
}

function bindDayNavState(root, key) {
  const nav = root.querySelector(".day-nav");
  if (!nav) {
    return;
  }

  nav.scrollLeft = state.dayNavScroll[key] || 0;
  nav.addEventListener(
    "scroll",
    () => {
      state.dayNavScroll[key] = nav.scrollLeft;
    },
    { passive: true }
  );
}

function renderLinks(links) {
  if (!links || !links.length) {
    return "";
  }

  return `
    <div class="link-list">
      ${links
        .map((link) => {
          const disabled = !link.url ? "disabled-link" : "";
          const href = link.url || "#";
          const target = link.url ? 'target="_blank" rel="noreferrer"' : "";
          return `<a class="inline-link ${disabled}" href="${href}" ${target}>${link.label}</a>`;
        })
        .join("")}
    </div>
  `;
}

function scrollMapPanelIntoView() {
  const target = panelMap.map.querySelector(".map-panel") || panelMap.map;
  if (!target) {
    return;
  }

  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

function eventActionButtons(eventIndex, event) {
  return `
    <div class="action-row">
      <button class="action-button small" data-map-tab="${eventIndex}">看地圖</button>
      <a class="action-button ghost small" href="${mapsSearchUrl(event.mapQuery || event.title)}" target="_blank" rel="noreferrer">Google Maps</a>
      <button class="action-button ghost small" data-offline-tab="${eventIndex}">離線收藏</button>
    </div>
  `;
}

function renderItinerary() {
  const day = getActiveDay();
  const dayThemeRows = [
    ["主題", day.highlight?.title || day.title],
    ["路線", day.route],
    ["移動", `${day.mode} / ${day.drive}`],
    ["住宿", day.stay],
    ["離線", day.offlineSummary || "尚未填寫"]
  ]
    .map(
      ([label, value]) => `
        <div class="editorial-row">
          <strong>${label}</strong>
          <p>${value}</p>
        </div>
      `
    )
    .join("");

  const eventCards = day.events
    .map(
      (event, index) => `
        <article class="event-card">
          <div class="event-top">
            <span class="time-pill">${event.time}</span>
            ${event.tag ? formatTag(event.tag) : ""}
          </div>
          <h3>${event.title}</h3>
          ${event.duration ? `<p><strong>移動 / 時長：</strong>${event.duration}</p>` : ""}
          ${event.cost ? `<p><strong>費用：</strong>${event.cost}</p>` : ""}
          ${event.note ? `<p>${event.note}</p>` : ""}
          ${renderLinks(event.links)}
          ${eventActionButtons(index, event)}
        </article>
      `
    )
    .join("");

  panelMap.itinerary.innerHTML = `
    <div class="surface">
      <div class="day-nav">${renderDayNav(state.dayIndex)}</div>
    </div>
    <section class="itinerary-editorial-head">
      <p class="overview-kicker">Day ${day.day} / ${day.date}</p>
      <h2 class="overview-title itinerary-title">${day.title}</h2>
    </section>
    <article class="surface itinerary-feature">
      <div class="highlight-media editorial-media">
        <img
          class="trip-image"
          src="${getImageSource(day.highlight?.imageUrl || state.data.heroImage.url, day.highlight?.title || day.title)}"
          alt="${day.highlight?.title || day.title}"
          data-fallback-label="${escapeHtml(day.highlight?.title || day.title)}"
        />
      </div>
      <div class="editorial-copy">
        <p class="eyebrow">當日大景點</p>
        <h3>${day.highlight?.title || day.title}</h3>
        <p class="editorial-caption">${day.highlight?.caption || "之後可以在編輯資料頁幫這一天補上大景點圖片說明。"}</p>
        <div class="editorial-table">${dayThemeRows}</div>
      </div>
    </article>
    <div class="event-list itinerary-events">
      ${eventCards}
    </div>
  `;

  attachDayNavListeners(panelMap.itinerary);
  attachEventJumpListeners(panelMap.itinerary);
  attachImageFallbacks(panelMap.itinerary);
  bindDayNavState(panelMap.itinerary, "itinerary");
}

function attachDayNavListeners(root) {
  root.querySelectorAll("[data-day-index]").forEach((button) => {
    button.addEventListener("click", () => {
      const nav = root.querySelector(".day-nav");
      if (nav) {
        if (root === panelMap.itinerary) {
          state.dayNavScroll.itinerary = nav.scrollLeft;
        } else if (root === panelMap.map) {
          state.dayNavScroll.map = nav.scrollLeft;
        } else if (root === panelMap.offline) {
          state.dayNavScroll.offline = nav.scrollLeft;
        }
      }
      state.dayIndex = Number(button.dataset.dayIndex);
      state.mapEventIndex = 0;
      renderItinerary();
      renderMap();
      renderOffline();
      renderEditor();
      if (root === panelMap.map) {
        scrollMapPanelIntoView();
      }
    });
  });
}

function attachEditorDayNavListeners(root) {
  root.querySelectorAll("[data-day-index]").forEach((button) => {
    button.addEventListener("click", () => {
      const nav = root.querySelector(".day-nav");
      if (nav) {
        state.dayNavScroll.editor = nav.scrollLeft;
      }
      state.editorDayIndex = Number(button.dataset.dayIndex);
      renderEditor();
      setActiveTab("editor");
    });
  });
}

function attachEventJumpListeners(root) {
  root.querySelectorAll("[data-map-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      state.mapEventIndex = Number(button.dataset.mapTab);
      renderMap();
      setActiveTab("map");
      scrollMapPanelIntoView();
    });
  });

  root.querySelectorAll("[data-offline-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      state.mapEventIndex = Number(button.dataset.offlineTab);
      renderOffline();
      setActiveTab("offline");
    });
  });
}

function renderFlights() {
  const flightCards = state.data.flights
    .map(
      (item) => `
        <article class="flight-card">
          <p class="eyebrow">${item.date}</p>
          <h3>${item.title}</h3>
          <ul>${item.notes.map((note) => `<li>${note}</li>`).join("")}</ul>
        </article>
      `
    )
    .join("");

  const airfareCards = state.data.airfare
    .map(
      (item) => `
        <article class="mini-card">
          <strong>${item.traveler}</strong>
          <p>${item.detail}</p>
        </article>
      `
    )
    .join("");

  const daylightCards = state.data.daylight
    .map(
      (item) => `
        <article class="mini-card">
          <strong>${item.month}</strong>
          <p>日出 ${item.sunrise}</p>
          <p>日落 ${item.sunset}</p>
          <p>日照 ${item.duration}</p>
        </article>
      `
    )
    .join("");

  const paidLinkCards = (state.data.costs.paidLinks || [])
    .map(
      (item) => `
        <article class="mini-card">
          <strong>${item.title}</strong>
          <p><a class="inline-link" href="${item.url}" target="_blank" rel="noreferrer">${item.label}</a></p>
        </article>
      `
    )
    .join("");

  panelMap.flights.innerHTML = `
    <div class="grid two-up">
      <article class="surface">
        <h2>主要航班節點</h2>
        <div class="flight-grid">${flightCards}</div>
      </article>
      <article class="surface">
        <h2>機票概況</h2>
        <div class="mini-grid">${airfareCards}</div>
      </article>
    </div>
    <div class="grid two-up">
      <article class="surface">
        <h2>已花費</h2>
        <div class="mini-grid">
          ${state.data.costs.alreadyPaid
            .map(
              ([name, price, total]) => `
                <article class="mini-card">
                  <strong>${name}</strong>
                  <p>${price}</p>
                  <p>${total}</p>
                </article>
              `
            )
            .join("")}
          ${paidLinkCards}
        </div>
      </article>
      <article class="surface">
        <h2>日照參考</h2>
        <div class="mini-grid">${daylightCards}</div>
      </article>
    </div>
  `;
}

function renderMap() {
  const day = getActiveDay();
  const event = getMapEvent();
  const eventCards = day.events
    .map(
      (item, index) => `
        <article class="event-card compact ${index === state.mapEventIndex ? "active" : ""}">
          <div class="event-top">
            <span class="time-pill">${item.time}</span>
            ${item.tag ? formatTag(item.tag) : ""}
          </div>
          <h3>${item.title}</h3>
          ${item.note ? `<p>${item.note}</p>` : ""}
          ${renderLinks(item.links)}
          <div class="action-row">
            <button class="action-button small" data-map-focus="${index}">嵌入地圖</button>
            <a class="action-button ghost small" href="${mapsSearchUrl(item.mapQuery || item.title)}" target="_blank" rel="noreferrer">搜尋景點</a>
            <a class="action-button ghost small" href="${mapsDirectionsUrl(item.mapQuery || item.title)}" target="_blank" rel="noreferrer">開車導航</a>
          </div>
        </article>
      `
    )
    .join("");

  panelMap.map.innerHTML = `
    <div class="surface">
      <div class="day-nav">${renderDayNav(state.dayIndex, "day-chip map-day-chip")}</div>
    </div>
    <div class="grid map-layout">
      <article class="surface map-panel">
        <div class="map-copy">
          <p class="eyebrow">Day ${day.day}</p>
          <h2>${day.title}</h2>
          <p>${day.route}</p>
          <p class="detail-block"><strong>目前焦點景點：</strong>${event.title}</p>
          ${event.note ? `<p>${event.note}</p>` : ""}
          <div class="action-row">
            <a class="action-button small" href="${mapsSearchUrl(event.mapQuery || event.title)}" target="_blank" rel="noreferrer">打開景點地圖</a>
            <a class="action-button ghost small" href="${mapsDirectionsUrl(event.mapQuery || event.title)}" target="_blank" rel="noreferrer">開車導航</a>
          </div>
          ${renderLinks(event.links)}
        </div>
        <iframe
          title="map"
          src="https://www.google.com/maps?q=${qs(event.mapQuery || event.title)}&output=embed"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </article>
      <article class="surface">
        <div class="map-feature-card">
          <img
            class="trip-image"
            src="${getImageSource(day.highlight?.imageUrl || state.data.heroImage.url, day.highlight?.title || day.title)}"
            alt="${day.highlight?.title || day.title}"
            data-fallback-label="${escapeHtml(day.highlight?.title || day.title)}"
          />
          <div>
            <p class="eyebrow">Map Spotlight</p>
            <h3>${day.highlight?.title || day.title}</h3>
            <p>${day.highlight?.caption || ""}</p>
            <p class="mini-prompt">${day.highlight?.prompt || state.data.posterStyle.prompt}</p>
          </div>
        </div>
        <h2>今天全部景點地圖</h2>
        <div class="event-list">${eventCards}</div>
      </article>
    </div>
  `;

  attachDayNavListeners(panelMap.map);
  panelMap.map.querySelectorAll("[data-map-focus]").forEach((button) => {
    button.addEventListener("click", () => {
      state.mapEventIndex = Number(button.dataset.mapFocus);
      renderMap();
      scrollMapPanelIntoView();
    });
  });
  attachImageFallbacks(panelMap.map);
  bindDayNavState(panelMap.map, "map");
}

function renderOffline() {
  const day = getActiveDay();
  const event = getMapEvent();

  const appCards = state.data.offlineNavigation
    .map(
      (app) => `
        <article class="mini-card">
          <strong>${app.name}</strong>
          <p>${app.description}</p>
        </article>
      `
    )
    .join("");

  const eventCards = day.events
    .map(
      (item, index) => `
        <article class="event-card compact ${index === state.mapEventIndex ? "active" : ""}">
          <div class="event-top">
            <span class="time-pill">${item.time}</span>
            ${item.tag ? formatTag(item.tag) : ""}
          </div>
          <h3>${item.title}</h3>
          <p>${item.offlineNote || "建議先把這個景點的地圖與停車點收藏到離線地圖。"}</p>
          <div class="action-row">
            <button class="action-button small" data-offline-focus="${index}">設為重點</button>
            <a class="action-button ghost small" href="${mapsSearchUrl(item.mapQuery || item.title)}" target="_blank" rel="noreferrer">開啟定位</a>
          </div>
        </article>
      `
    )
    .join("");

  panelMap.offline.innerHTML = `
    <div class="surface">
      <div class="day-nav">${renderDayNav(state.dayIndex, "day-chip map-day-chip")}</div>
    </div>
    <div class="grid map-layout">
      <article class="surface">
        <p class="eyebrow">離線地圖重點</p>
        <h2>Day ${day.day} ${day.title}</h2>
        <p>${day.offlineSummary || "尚未填寫離線摘要"}</p>
        <div class="offline-box">
          <h3>目前重點景點</h3>
          <p><strong>${event.title}</strong></p>
          <p>${event.offlineNote || "把景點、停車點、回營地路線收藏起來。"}</p>
        </div>
        <h3>推薦離線工具</h3>
        <div class="mini-grid">${appCards}</div>
      </article>
      <article class="surface">
        <h2>今天要先收藏的點</h2>
        <div class="event-list">${eventCards}</div>
      </article>
    </div>
  `;

  attachDayNavListeners(panelMap.offline);
  panelMap.offline.querySelectorAll("[data-offline-focus]").forEach((button) => {
    button.addEventListener("click", () => {
      state.mapEventIndex = Number(button.dataset.offlineFocus);
      renderOffline();
    });
  });
  bindDayNavState(panelMap.offline, "offline");
}

function parseLinks(text) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, url] = line.split("|");
      return {
        label: (label || "").trim(),
        url: (url || "").trim()
      };
    });
}

function serializeLinks(links) {
  return (links || []).map((link) => `${link.label || ""}|${link.url || ""}`).join("\n");
}

function syncRawEditor() {
  const raw = document.querySelector("#raw-json-editor");
  if (raw) {
    raw.value = JSON.stringify(state.data, null, 2);
  }
}

function rawJsonHasChanges() {
  const raw = document.querySelector("#raw-json-editor");
  if (!raw) {
    return false;
  }

  return raw.value.trim() !== JSON.stringify(state.data, null, 2).trim();
}

function renderEditor() {
  const day = state.data.itinerary[state.editorDayIndex];
  panelMap.editor.innerHTML = `
    <div class="surface">
      <div class="editor-savebar">
        <div class="editor-savecopy">
          <strong>Google Sheet 正式資料</strong>
          <span class="save-status ${state.sheetError ? "dirty" : ""}">
            ${state.sheetError ? `同步失敗：${state.sheetError}` : formatSyncTime()}
          </span>
          <span class="muted">目前正式來源分成兩份：<a class="inline-link" href="${GOOGLE_SHEET_META_URL}" target="_blank" rel="noreferrer">網站資料</a> 供總覽與花費，<a class="inline-link" href="${GOOGLE_SHEET_ITINERARY_URL}" target="_blank" rel="noreferrer">editable-itinerary</a> 供每日行程。旅伴重新整理後會看到這兩份正式資料。</span>
        </div>
        <div class="editor-toolbar compact">
          <button class="action-button small" id="sync-sheet-button" ${state.syncInProgress ? "disabled" : ""}>
            ${state.syncInProgress ? "同步中..." : "重新同步 Google Sheet"}
          </button>
          <button class="action-button ghost small" id="reset-to-sheet-button" ${state.syncInProgress ? "disabled" : ""}>
            清除本機草稿並套用 Google Sheet
          </button>
        </div>
      </div>
      <div class="editor-savebar">
        <div class="editor-savecopy">
          <strong>本機草稿編輯</strong>
          <span id="editor-save-status" class="save-status ${state.editorDirty ? "dirty" : ""}">
            ${state.editorDirty ? "尚未儲存" : formatSavedAt()}
          </span>
          <span class="muted">
            ${state.localDraft
              ? state.localDraftEnabled
                ? "目前正在套用這台裝置的本機草稿，所以你看到的內容可能和 Google Sheet 正式版本不同。"
                : "這台裝置有舊的本機草稿，但目前公開站預設顯示 Google Sheet 正式版本。"
              : "這裡按儲存只會存到你目前這台裝置的瀏覽器，不會直接回寫 Google Sheet。"}
          </span>
        </div>
        <div class="editor-toolbar compact">
          ${state.localDraft && !state.localDraftEnabled
            ? '<button class="action-button ghost small" id="apply-local-draft-button">套用這台裝置的本機草稿</button>'
            : ""}
          <button class="action-button small" id="save-all-button">儲存全部編輯</button>
        </div>
      </div>
      <div class="editor-toolbar">
        <button class="action-button small" id="save-json-button">套用整份 JSON</button>
        <button class="action-button ghost small" id="export-json-button">匯出 JSON</button>
        <button class="action-button ghost small" id="export-share-button">匯出 GitHub Pages 資料</button>
        <button class="action-button ghost small" id="reset-data-button">重設回預設</button>
      </div>
      <h2>全站圖片</h2>
      <div class="image-editor-card">
        <div class="image-preview">
          <img
            class="trip-image"
            src="${getImageSource(state.data.heroImage.url, state.data.heroImage.alt || state.data.title)}"
            alt="${state.data.heroImage.alt}"
            data-fallback-label="${escapeHtml(state.data.heroImage.alt || state.data.title)}"
          />
        </div>
        <div class="image-editor-copy">
          <p class="muted">如果你的圖片是自己生成、存在電腦裡，直接選檔就可以，不需要先上傳到網路拿網址。</p>
          <div class="editor-toolbar compact">
            <label class="upload-button">
              上傳首頁 Hero 圖
              <input type="file" id="edit-hero-file" accept="image/*" />
            </label>
            <button class="action-button ghost small" id="clear-hero-image">清除首頁圖片</button>
          </div>
        </div>
      </div>
      <div class="image-editor-card">
        <div class="image-preview">
          <img
            class="trip-image"
            src="${getImageSource(state.data.overviewImage?.url || state.data.heroImage.url, state.data.overviewImage?.alt || state.data.title)}"
            alt="${state.data.overviewImage?.alt || state.data.title}"
            data-fallback-label="${escapeHtml(state.data.overviewImage?.alt || state.data.title)}"
          />
        </div>
        <div class="image-editor-copy">
          <p class="muted">這張圖只會用在總覽頁右側的大封面，不會跟首頁 Hero 綁在一起。</p>
          <div class="editor-toolbar compact">
            <label class="upload-button">
              上傳總覽封面圖
              <input type="file" id="edit-overview-file" accept="image/*" />
            </label>
            <button class="action-button ghost small" id="clear-overview-image">清除總覽封面圖</button>
          </div>
        </div>
      </div>
      <div class="editor-grid">
        <label>首頁 Hero 圖片網址或 data URL<input id="edit-hero-url" value="${state.data.heroImage.url}" /></label>
        <label>首頁 Hero 圖片替代文字<input id="edit-hero-alt" value="${state.data.heroImage.alt}" /></label>
        <label>總覽封面圖網址或 data URL<input id="edit-overview-url" value="${state.data.overviewImage?.url || ""}" /></label>
        <label>總覽封面圖替代文字<input id="edit-overview-alt" value="${state.data.overviewImage?.alt || ""}" /></label>
        <label>統一海報風標題<input id="edit-poster-style-title" value="${state.data.posterStyle.title}" /></label>
        <label>統一海報風 prompt<textarea id="edit-poster-style-prompt">${state.data.posterStyle.prompt}</textarea></label>
      </div>
      <h2>總覽文案</h2>
      <div class="editor-grid">
        <label>總覽封面標題（可換行）
          <textarea id="edit-overview-cover-title">${state.data.overview?.coverTitle || ""}</textarea>
        </label>
        <label>旅程摘要標題
          <input id="edit-overview-journal-title" value="${state.data.overview?.journalTitle || ""}" />
        </label>
        <label>Tag 區標題
          <input id="edit-overview-tags-title" value="${state.data.overview?.sectionTitles?.tags || ""}" />
        </label>
        <label>行前整理標題
          <input id="edit-overview-pretrip-title" value="${state.data.overview?.sectionTitles?.preTrip || ""}" />
        </label>
        <label>必須花費標題
          <input id="edit-overview-required-title" value="${state.data.overview?.sectionTitles?.requiredCosts || ""}" />
        </label>
        <label>額外活動標題
          <input id="edit-overview-extras-title" value="${state.data.overview?.sectionTitles?.extras || ""}" />
        </label>
        <label>現場花費預估標題
          <input id="edit-overview-budget-title" value="${state.data.overview?.sectionTitles?.fieldBudget || ""}" />
        </label>
        ${(state.data.overview?.journalRows || [])
          .map(
            (row, index) => `
              <div class="editor-stack">
                <label>摘要欄位標題 ${index + 1}
                  <input data-overview-row-label="${index}" value="${row.label}" />
                </label>
                <label>摘要內容 ${index + 1}
                  <textarea data-overview-row-text="${index}">${row.text}</textarea>
                </label>
              </div>
            `
          )
          .join("")}
      </div>
      <h2>行前整理</h2>
      <div class="editor-grid">
        ${state.data.preTrip
          .map(
            (group, index) => `
              <div class="editor-stack">
                <label>欄目標題
                  <input data-pretrip-title-index="${index}" value="${group.title}" />
                </label>
                <label>${group.title} 內容（每行一項）
                  <textarea data-pretrip-index="${index}">${group.items.join("\n")}</textarea>
                </label>
              </div>
            `
          )
          .join("")}
      </div>
      <h2>快速編輯：每日行程</h2>
      <div class="day-nav">${renderDayNav(state.editorDayIndex, "day-chip editor-day-chip")}</div>
      <div class="editor-grid">
        <label>標題<input id="edit-day-title" value="${day.title}" /></label>
        <label>日期<input id="edit-day-date" value="${day.date}" /></label>
        <label>模式<input id="edit-day-mode" value="${day.mode}" /></label>
        <label>主路線<input id="edit-day-route" value="${day.route}" /></label>
        <label>住宿<input id="edit-day-stay" value="${day.stay}" /></label>
        <label>車程 / 節奏<input id="edit-day-drive" value="${day.drive}" /></label>
        <label>主地圖定位<input id="edit-day-mapfocus" value="${day.mapFocus}" /></label>
        <label>離線摘要<textarea id="edit-day-offline">${day.offlineSummary || ""}</textarea></label>
        <label>大景點標題<input id="edit-day-highlight-title" value="${day.highlight?.title || ""}" /></label>
        <label>大景點圖片網址或 data URL<input id="edit-day-highlight-image" value="${day.highlight?.imageUrl || ""}" /></label>
        <label>大景點圖片說明<textarea id="edit-day-highlight-caption">${day.highlight?.caption || ""}</textarea></label>
        <label>大景點 AI prompt<textarea id="edit-day-highlight-prompt">${day.highlight?.prompt || ""}</textarea></label>
      </div>
      <div class="image-editor-card day-highlight-card">
        <div class="image-preview">
          <img
            class="trip-image"
            src="${getImageSource(day.highlight?.imageUrl || state.data.heroImage.url, day.highlight?.title || day.title)}"
            alt="${day.highlight?.title || day.title}"
            data-fallback-label="${escapeHtml(day.highlight?.title || day.title)}"
          />
        </div>
        <div class="image-editor-copy">
          <p class="muted">這張圖會出現在每日行程卡和地圖頁的當日主視覺。你可以放 AI 圖、照片、海報都可以。</p>
          <div class="editor-toolbar compact">
            <label class="upload-button">
              上傳這一天的大景點圖
              <input type="file" id="edit-day-highlight-file" accept="image/*" />
            </label>
            <button class="action-button ghost small" id="clear-day-highlight-image">清除這一天圖片</button>
          </div>
        </div>
      </div>
      <div class="editor-toolbar">
        <button class="action-button small" id="save-day-button">儲存全部編輯</button>
        <button class="action-button ghost small" id="add-event-button">新增景點 / 備註</button>
      </div>
      <div class="editor-event-list">
        ${day.events
          .map(
            (event, index) => `
              <article class="surface editor-event-card">
                <div class="editor-toolbar">
                  <strong>事件 ${index + 1}</strong>
                  <button class="action-button ghost small danger" data-remove-event="${index}">刪除</button>
                </div>
                <div class="editor-grid">
                  <label>時間<input data-field="time" data-event-index="${index}" value="${event.time || ""}" /></label>
                  <label>標題<input data-field="title" data-event-index="${index}" value="${event.title || ""}" /></label>
                  <label>時長<input data-field="duration" data-event-index="${index}" value="${event.duration || ""}" /></label>
                  <label>費用<input data-field="cost" data-event-index="${index}" value="${event.cost || ""}" /></label>
                  <label>tag
                    <select data-field="tag" data-event-index="${index}">
                      <option value="">無</option>
                      ${state.data.tags
                        .map(
                          (tag) => `
                            <option value="${tag.key}" ${event.tag === tag.key ? "selected" : ""}>
                              ${tag.label}
                            </option>
                          `
                        )
                        .join("")}
                    </select>
                  </label>
                  <label>地圖定位<input data-field="mapQuery" data-event-index="${index}" value="${event.mapQuery || ""}" /></label>
                  <label>備註<textarea data-field="note" data-event-index="${index}">${event.note || ""}</textarea></label>
                  <label>離線說明<textarea data-field="offlineNote" data-event-index="${index}">${event.offlineNote || ""}</textarea></label>
                  <label>連結（每行 標題|網址）<textarea data-field="links" data-event-index="${index}">${serializeLinks(event.links)}</textarea></label>
                </div>
              </article>
            `
          )
          .join("")}
      </div>
    </div>
    <div class="surface">
      <h2>完整 JSON 編輯器</h2>
      <p class="muted">如果你想一次改航班、花費、地圖、文字結構，可以直接編輯完整 JSON。</p>
      <textarea id="raw-json-editor" class="raw-json"></textarea>
    </div>
  `;

  syncRawEditor();
  attachEditorDayNavListeners(panelMap.editor);
  attachImageFallbacks(panelMap.editor);
  bindDayNavState(panelMap.editor, "editor");
  attachEditorDirtyTracking();
  updateEditorSaveState();

  panelMap.editor.querySelector("#save-all-button").addEventListener("click", saveEditorChanges);
  panelMap.editor.querySelector("#save-day-button").addEventListener("click", saveEditorChanges);
  panelMap.editor.querySelector("#add-event-button").addEventListener("click", addEventToDay);
  panelMap.editor.querySelector("#save-json-button").addEventListener("click", applyRawJson);
  panelMap.editor.querySelector("#export-json-button").addEventListener("click", exportJson);
  panelMap.editor.querySelector("#export-share-button").addEventListener("click", exportShareData);
  panelMap.editor.querySelector("#reset-data-button").addEventListener("click", resetData);
  panelMap.editor.querySelector("#sync-sheet-button").addEventListener("click", () => syncSheetData());
  panelMap.editor.querySelector("#reset-to-sheet-button").addEventListener("click", () => syncSheetData({ resetLocalDraft: true }));
  panelMap.editor.querySelector("#apply-local-draft-button")?.addEventListener("click", () => {
    state.localDraftEnabled = true;
    applyDataSources();
    renderAll();
    setActiveTab("editor");
  });
  panelMap.editor.querySelector("#clear-hero-image").addEventListener("click", async () => {
    await deleteImageData(state.data.heroImage.url);
    state.data.heroImage.url = "";
    saveData();
    renderAll();
    setActiveTab("editor");
  });
  panelMap.editor.querySelector("#clear-overview-image").addEventListener("click", async () => {
    await deleteImageData(state.data.overviewImage?.url);
    state.data.overviewImage = {
      ...state.data.overviewImage,
      url: ""
    };
    saveData();
    renderAll();
    setActiveTab("editor");
  });
  panelMap.editor.querySelector("#clear-day-highlight-image").addEventListener("click", async () => {
    await deleteImageData(state.data.itinerary[state.editorDayIndex].highlight?.imageUrl);
    state.data.itinerary[state.editorDayIndex].highlight = {
      ...state.data.itinerary[state.editorDayIndex].highlight,
      imageUrl: ""
    };
    saveData();
    renderAll();
    setActiveTab("editor");
  });

  panelMap.editor.querySelectorAll("[data-remove-event]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.removeEvent);
      state.data.itinerary[state.editorDayIndex].events.splice(index, 1);
      saveData();
      renderAll();
      setActiveTab("editor");
    });
  });

  panelMap.editor.querySelector("#edit-hero-file").addEventListener("change", async (event) => {
    const [file] = event.target.files || [];
    if (!file) {
      return;
    }

    try {
      await deleteImageData(state.data.heroImage.url);
      state.data.heroImage.url = await storeUploadedImage(file);
      saveData();
      renderAll();
      setActiveTab("editor");
    } catch (error) {
      alert(`首頁圖片匯入失敗：${error.message}`);
    }
  });

  panelMap.editor.querySelector("#edit-overview-file").addEventListener("change", async (event) => {
    const [file] = event.target.files || [];
    if (!file) {
      return;
    }

    try {
      await deleteImageData(state.data.overviewImage?.url);
      state.data.overviewImage = {
        ...state.data.overviewImage,
        url: await storeUploadedImage(file)
      };
      saveData();
      renderAll();
      setActiveTab("editor");
    } catch (error) {
      alert(`總覽封面圖匯入失敗：${error.message}`);
    }
  });

  panelMap.editor.querySelector("#edit-day-highlight-file").addEventListener("change", async (event) => {
    const [file] = event.target.files || [];
    if (!file) {
      return;
    }

    try {
      await deleteImageData(state.data.itinerary[state.editorDayIndex].highlight?.imageUrl);
      state.data.itinerary[state.editorDayIndex].highlight = {
        ...state.data.itinerary[state.editorDayIndex].highlight,
        imageUrl: await storeUploadedImage(file)
      };
      saveData();
      renderAll();
      setActiveTab("editor");
    } catch (error) {
      alert(`當日圖片匯入失敗：${error.message}`);
    }
  });
}

async function saveDayEdits() {
  const day = state.data.itinerary[state.editorDayIndex];
  state.data.heroImage.url = await normalizeImageValue(
    document.querySelector("#edit-hero-url").value,
    state.data.heroImage.url
  );
  state.data.heroImage.alt = document.querySelector("#edit-hero-alt").value.trim();
  state.data.overviewImage = {
    ...(state.data.overviewImage || {}),
    url: await normalizeImageValue(
      document.querySelector("#edit-overview-url").value,
      state.data.overviewImage?.url
    ),
    alt: document.querySelector("#edit-overview-alt").value.trim()
  };
  state.data.posterStyle.title = document.querySelector("#edit-poster-style-title").value.trim();
  state.data.posterStyle.prompt = document.querySelector("#edit-poster-style-prompt").value.trim();
  state.data.overview = {
    ...(state.data.overview || {}),
    coverTitle: document.querySelector("#edit-overview-cover-title").value.trim(),
    journalTitle: document.querySelector("#edit-overview-journal-title").value.trim(),
    sectionTitles: {
      ...(state.data.overview?.sectionTitles || {}),
      tags: document.querySelector("#edit-overview-tags-title").value.trim(),
      preTrip: document.querySelector("#edit-overview-pretrip-title").value.trim(),
      requiredCosts: document.querySelector("#edit-overview-required-title").value.trim(),
      extras: document.querySelector("#edit-overview-extras-title").value.trim(),
      fieldBudget: document.querySelector("#edit-overview-budget-title").value.trim()
    },
    journalRows: (state.data.overview?.journalRows || []).map((row, index) => ({
      label: document.querySelector(`[data-overview-row-label="${index}"]`)?.value.trim() || row.label,
      text: document.querySelector(`[data-overview-row-text="${index}"]`)?.value.trim() || row.text
    }))
  };
  day.title = document.querySelector("#edit-day-title").value.trim();
  day.date = document.querySelector("#edit-day-date").value.trim();
  day.mode = document.querySelector("#edit-day-mode").value.trim();
  day.route = document.querySelector("#edit-day-route").value.trim();
  day.stay = document.querySelector("#edit-day-stay").value.trim();
  day.drive = document.querySelector("#edit-day-drive").value.trim();
  day.mapFocus = document.querySelector("#edit-day-mapfocus").value.trim();
  day.offlineSummary = document.querySelector("#edit-day-offline").value.trim();
  day.highlight = {
    title: document.querySelector("#edit-day-highlight-title").value.trim(),
    imageUrl: await normalizeImageValue(
      document.querySelector("#edit-day-highlight-image").value,
      day.highlight?.imageUrl
    ),
    caption: document.querySelector("#edit-day-highlight-caption").value.trim(),
    prompt: document.querySelector("#edit-day-highlight-prompt").value.trim()
  };

  document.querySelectorAll("[data-pretrip-index]").forEach((field) => {
    const index = Number(field.dataset.pretripIndex);
    state.data.preTrip[index].items = field.value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  });

  document.querySelectorAll("[data-pretrip-title-index]").forEach((field) => {
    const index = Number(field.dataset.pretripTitleIndex);
    state.data.preTrip[index].title = field.value.trim() || state.data.preTrip[index].title;
  });

  document.querySelectorAll("[data-event-index]").forEach((field) => {
    const eventIndex = Number(field.dataset.eventIndex);
    const eventField = field.dataset.field;
    if (!day.events[eventIndex]) {
      return;
    }

    if (eventField === "links") {
      day.events[eventIndex].links = parseLinks(field.value);
    } else {
      day.events[eventIndex][eventField] = field.value.trim();
    }
  });

  saveData();
  renderAll();
  setActiveTab("editor");
}

async function saveEditorChanges() {
  if (rawJsonHasChanges()) {
    applyRawJson();
    return;
  }

  await saveDayEdits();
}

function addEventToDay() {
  state.data.itinerary[state.editorDayIndex].events.push({
    time: "待補",
    title: "新景點 / 新備註",
    duration: "",
    cost: "",
    tag: "",
    mapQuery: "",
    note: "",
    offlineNote: "",
    links: []
  });
  saveData();
  renderAll();
  setActiveTab("editor");
}

function applyRawJson() {
  const raw = document.querySelector("#raw-json-editor").value;
  try {
    state.data = hydrateData(JSON.parse(raw));
    state.dayIndex = 0;
    state.mapEventIndex = 0;
    state.editorDayIndex = 0;
    saveData();
    renderAll();
    setActiveTab("editor");
  } catch (error) {
    alert(`JSON 格式有誤：${error.message}`);
  }
}

function exportJson() {
  const blob = new Blob([JSON.stringify(state.data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "nz-trip-data.json";
  link.click();
  URL.revokeObjectURL(url);
}

async function resolveShareableData() {
  const clone = structuredClone(state.data);
  const tasks = [];

  const resolveField = (container, key) => {
    const value = container?.[key];
    if (!isStoredImageRef(value)) {
      return;
    }

    tasks.push(
      getImageData(value)
        .then((dataUrl) => {
          container[key] = dataUrl || "";
        })
        .catch(() => {
          container[key] = "";
        })
    );
  };

  resolveField(clone.heroImage, "url");
  resolveField(clone.overviewImage, "url");
  clone.itinerary.forEach((day) => resolveField(day.highlight, "imageUrl"));

  await Promise.all(tasks);
  return clone;
}

async function exportShareData() {
  try {
    const shareableData = await resolveShareableData();
    const shareJs = `window.defaultTripData = ${JSON.stringify(shareableData, null, 2)};\n`;
    const blob = new Blob([shareJs], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "trip-data.github-pages.js";
    link.click();
    URL.revokeObjectURL(url);
    alert("已匯出 GitHub Pages 分享版資料。把下載的 trip-data.github-pages.js 覆蓋專案內的 trip-data.js，再 commit/push 就能更新公開網站。");
  } catch (error) {
    alert(`分享版資料匯出失敗：${error.message}`);
  }
}

function resetData() {
  clearLocalDraft();
  state.data = structuredClone(state.sheetBaseData);
  state.dayIndex = 0;
  state.mapEventIndex = 0;
  state.editorDayIndex = 0;
  state.editorDirty = false;
  state.lastSavedAt = null;
  renderAll();
  setActiveTab("editor");
}

function renderAll() {
  renderTabbar();
  renderHero();
  renderOverview();
  renderItinerary();
  renderFlights();
  renderMap();
  renderOffline();
  renderEditor();
  attachImageFallbacks();
  setActiveTab(state.activeTab);
}

async function initializeApp() {
  state.localDraft = loadLocalDraft();
  state.localDraftEnabled = false;
  applyDataSources();

  try {
    await migrateEmbeddedImages();
  } catch (error) {
    console.error(error);
  }

  renderAll();
  await syncSheetData();
  window.setInterval(() => {
    syncSheetData();
  }, SHEET_SYNC_INTERVAL_MS);
}

initializeApp();
