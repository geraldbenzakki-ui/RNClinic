const schedule = [
  {
    patient: "רון ל.",
    time: "09:00-13:00",
    room: "חדר 2",
    status: "מתוכנן",
  },
  {
    patient: "מאיה ש.",
    time: "13:30-17:30",
    room: "חדר 1",
    status: "בביצוע",
  },
];

const staffRecords = [
  {
    id: "000121",
    firstName: "דנה",
    lastName: "כהן",
    role: "רופא",
    employmentType: "שעתי",
    compensation: "₪180 לשעה",
    startDate: "2024-01-12",
    status: "פעיל",
  },
  {
    id: "000122",
    firstName: "נועה",
    lastName: "לוי",
    role: "טכנאית",
    employmentType: "לפי השתלה",
    compensation: "₪900 / ₪700",
    startDate: "2023-08-03",
    status: "בהשתלה",
  },
  {
    id: "000123",
    firstName: "רונית",
    lastName: "פרץ",
    role: "עוזרת",
    employmentType: "גלובלי",
    compensation: "₪9,500",
    startDate: "2022-05-19",
    status: "פעיל",
  },
];

const clients = [
  {
    id: 1,
    firstName: "רון",
    lastName: "לוי",
    phone: "050-123-4567",
    email: "ron.levy@example.com",
    treatment: "FUE 2500 זקיקים",
    nextVisit: "20.05",
    status: "בתהליך",
    history: [
      {
        date: "2024-02-12",
        type: "ייעוץ ראשוני",
        grafts: "-",
        doctor: "ד\"ר כהן",
      },
      {
        date: "2024-03-18",
        type: "השתלת שיער",
        grafts: "2500",
        doctor: "ד\"ר כהן",
      },
    ],
  },
  {
    id: 2,
    firstName: "מאיה",
    lastName: "שמחון",
    phone: "052-987-6543",
    email: "maya.s@example.com",
    treatment: "FUT 3000 זקיקים",
    nextVisit: "27.05",
    status: "ייעוץ",
    history: [
      {
        date: "2024-03-02",
        type: "ייעוץ ראשוני",
        grafts: "-",
        doctor: "ד\"ר לוי",
      },
      {
        date: "2024-04-21",
        type: "השתלת גבות",
        grafts: "800",
        doctor: "ד\"ר לוי",
      },
    ],
  },
];

const transplants = [
  {
    date: "2026-05-20",
    time: "09:30",
    client: "רון לוי",
    type: "השתלת שיער",
    grafts: "2500",
    price: "₪28,000",
    leadDoctor: "ד\"ר כהן",
    status: "מתוכנן",
  },
  {
    date: "2026-05-27",
    time: "11:00",
    client: "מאיה שמחון",
    type: "השתלת גבות",
    grafts: "800",
    price: "₪18,000",
    leadDoctor: "ד\"ר לוי",
    status: "ממתין לאישור",
  },
];

const finance = {
  revenue: "₪120,000",
  costs: "₪42,000",
  profit: "₪78,000",
  payments: [
    { name: "רון ל.", amount: "₪28,000", status: "שולם", method: "אשראי" },
    { name: "מאיה ש.", amount: "₪32,000", status: "ממתין", method: "העברה" },
  ],
};

const hours = [
  { name: "ד\"ר כהן", date: "2026-05-13", hours: "6:00", overtime: "0:30" },
  { name: "נועה לוי", date: "2026-05-13", hours: "7:30", overtime: "1:00" },
];

const API_BASE = window.RNCLINIC_API_BASE || "http://127.0.0.1:5001/api";

const createRow = (values, rowClass = "") => {
  const row = document.createElement("div");
  row.className = "row";
  if (rowClass) {
    rowClass
      .split(" ")
      .map((item) => item.trim())
      .filter(Boolean)
      .forEach((className) => row.classList.add(className));
  }
  values.forEach((value) => {
    const span = document.createElement("span");
    if (value && value.node) {
      if (value.className) {
        span.className = value.className;
      }
      span.append(value.node);
    } else if (value && value.className) {
      span.className = value.className;
      span.textContent = value.label;
    } else {
      span.textContent = value ?? "-";
    }
    row.append(span);
  });
  return row;
};

const normalizeDate = (value) => {
  if (!value) return "";
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  if (value.includes("-")) {
    return value;
  }
  if (value.includes(".")) {
    const [day, month, year] = value.split(".");
    if (day && month && year) {
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
  }
  if (value.includes("/")) {
    const [day, month, year] = value.split("/");
    if (day && month && year) {
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
  }
  return value;
};

const formatDate = (value) => {
  if (!value) return "-";
  const normalized = normalizeDate(value);
  if (!normalized.includes("-")) return value;
  const [year, month, day] = normalized.split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
};

const getTodayValue = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const scheduleTable = document.querySelector("#schedule-table");
const dailyTransplantsTable = document.querySelector("#daily-transplants-table");
const staffTable = document.querySelector("#staff-table");
const clientsTable = document.querySelector("#clients-table");
const clientHistoryTable = document.querySelector("#client-history-table");
const paymentsTable = document.querySelector("#payments-table");
const hoursTable = document.querySelector("#hours-table");
const financeSummary = document.querySelector("#finance-summary");
const transplantsTable = document.querySelector("#transplants-table");
const transplantsMonthInput = document.querySelector("#transplants-month");
const transplantsSearchInput = document.querySelector("#transplants-search");
const dashboardDateInput = document.querySelector("#dashboard-date");
const upcomingCalendarContainer = document.querySelector("#upcoming-calendar");
const upcomingMonthInput = document.querySelector("#upcoming-month");
const calendarExportButton = document.querySelector("#calendar-export");
const financeMonthInput = document.querySelector("#finance-month");
const financeSummaryStandalone = document.querySelector("#finance-summary-standalone");
const financeIncomeTable = document.querySelector("#finance-income-table");
const financeTable = document.querySelector("#finance-table");
const financeForm = document.querySelector("#finance-form");
const financeFormStatus = document.querySelector("#finance-form-status");
const reportTypeSelect = document.querySelector("#report-type");
const reportMonthInput = document.querySelector("#report-month");
const reportShowButton = document.querySelector("#report-show");
const reportResetButton = document.querySelector("#report-reset");
const reportHoursSaveButton = document.querySelector("#report-hours-save");
const reportStatus = document.querySelector("#report-status");
const reportHourlyCard = document.querySelector("#report-hourly-card");
const reportHourlyTable = document.querySelector("#report-hourly-table");
const reportResultsCard = document.querySelector("#report-results-card");
const reportResultsTable = document.querySelector("#report-results-table");
const reportTotal = document.querySelector("#report-total");
const reportEmployeePickerCard = document.querySelector("#report-employee-picker-card");
const reportEmployeePickerTable = document.querySelector("#report-employee-picker-table");
const reportEmployeeSaveButton = document.querySelector("#report-employee-save");
const reportEmployeeResultsCard = document.querySelector("#report-employee-results-card");
const reportEmployeeResultsTable = document.querySelector("#report-employee-results-table");
const reportStatusPickerCard = document.querySelector("#report-status-picker-card");
const reportStatusPickerTable = document.querySelector("#report-status-picker-table");
const reportStatusSaveButton = document.querySelector("#report-status-save");
const reportStatusResultsCard = document.querySelector("#report-status-results-card");
const reportStatusResultsTable = document.querySelector("#report-status-results-table");

const staffTableStandalone = document.querySelector("#staff-table-standalone");
const paymentsTableStandalone = document.querySelector("#payments-table-standalone");

const loginScreen = document.querySelector("#login-screen");
const loginForm = document.querySelector("#login-form");
const loginStatus = document.querySelector("#login-status");
const loginLogo = document.querySelector("#login-logo");
const appLayout = document.querySelector("#app-layout");
const settingsUsersTable = document.querySelector("#settings-users-table");
const addUserForm = document.querySelector("#add-user-form");
const settingsLogoInput = document.querySelector("#settings-logo");
const logoutButton = document.querySelector("#logout-button");
const deleteUserButton = document.querySelector("#delete-user-button");
const metricYearCompleted = document.querySelector("#metric-year-completed");
const metricMonthCompleted = document.querySelector("#metric-month-completed");
const metricUpcoming = document.querySelector("#metric-upcoming");
const clientsSearchInput = document.querySelector("#clients-search");
const clientsFilterButton = document.querySelector("[data-action='filter-clients']");

const navItems = document.querySelectorAll(".nav-item");
const sections = document.querySelectorAll(".section");

const staffForm = document.querySelector("#staff-form");
const transplantForm = document.querySelector("#transplant-form");
const transplantSection = document.querySelector("[data-section='transplants']");
const clientForm = document.querySelector("#client-form");
const staffTableContainer = document.querySelector("#staff-table-standalone");
const staffFormStatus = document.querySelector("#staff-form-status");
const clientFormStatus = document.querySelector("#client-form-status");
const transplantFormStatus = document.querySelector("#transplant-form-status");
const clientsDatalist = document.querySelector("#clients-datalist");
const leadDoctorSelect = document.querySelector("[name='leadDoctor']");
const tech1Select = document.querySelector("[name='tech1']");
const tech2Select = document.querySelector("[name='tech2']");
const tech3Select = document.querySelector("[name='tech3']");
const transplantTimeSelect = document.querySelector("#transplant-time");

let currentClients = [...clients];
let currentStaff = [...staffRecords];
let currentTransplants = [...transplants];
let currentFinance = [];
let transplantSortAsc = true;

const setFormStatus = (element, message = "", type = "") => {
  if (!element) return;
  element.textContent = message;
  element.classList.remove("is-success", "is-error");
  if (type) {
    element.classList.add(`is-${type}`);
  }
};

const setActiveSection = (target) => {
  if (!target) return;
  navItems.forEach((button) => button.classList.remove("is-active"));
  navItems.forEach((button) => {
    if (button.dataset.section === target) {
      button.classList.add("is-active");
    }
  });
  sections.forEach((section) => {
    section.classList.toggle("is-active", section.dataset.section === target);
  });
};

if (scheduleTable) {
  schedule.forEach((item) => {
    scheduleTable.append(
      createRow([
        item.patient,
        item.time,
        item.room,
        { label: item.status, className: "tag" },
      ])
    );
  });
}

const renderStaffTable = (table, records = staffRecords) => {
  if (!table) return;
  table.innerHTML = "";
  const headerCheckbox = document.createElement("input");
  headerCheckbox.type = "radio";
  headerCheckbox.disabled = true;
  table.append(
    createRow(
      [
        { node: headerCheckbox, className: "selection" },
        { label: "מס' עובד", className: "header" },
        { label: "שם פרטי", className: "header" },
        { label: "שם משפחה", className: "header" },
        { label: "תפקיד", className: "header" },
        { label: "סוג משרה", className: "header" },
        { label: "שכר", className: "header" },
        { label: "תאריך קליטה", className: "header" },
        { label: "סטטוס", className: "header" },
      ],
      "staff-row"
    )
  );
  records.forEach((member) => {
    const selector = document.createElement("input");
    selector.type = "radio";
    selector.name = "staff-selected";
    selector.dataset.record = JSON.stringify(member);
    table.append(
      createRow(
        [
          { node: selector, className: "selection" },
          member.id || "-",
          member.firstName || "-",
          member.lastName || "-",
          member.role || "-",
          member.employmentType || "-",
          member.compensation || "-",
          formatDate(member.startDate),
          { label: member.status || "-", className: "tag" },
        ],
        "staff-row"
      )
    );
  });
};

const populatePayments = (table) => {
  if (!table) return;
  finance.payments.forEach((payment) => {
    table.append(
      createRow([
        payment.name,
        payment.amount,
        payment.method,
        { label: payment.status, className: "tag" },
      ])
    );
  });
};

renderStaffTable(staffTable);
renderStaffTable(staffTableStandalone);

const renderClientsTable = (rows = clients) => {
  if (!clientsTable) return;
  clientsTable.innerHTML = "";
  const headerSelector = document.createElement("input");
  headerSelector.type = "radio";
  headerSelector.disabled = true;
  clientsTable.append(
    createRow(
      [
        { node: headerSelector, className: "selection" },
        { label: "מס' לקוח", className: "header" },
        { label: "שם משפחה", className: "header" },
        { label: "שם פרטי", className: "header" },
        { label: "טלפון", className: "header" },
        { label: "אימייל", className: "header" },
        { label: "טיפול", className: "header" },
        { label: "סטטוס", className: "header" },
      ],
      "clients-row"
    )
  );
  rows.forEach((client) => {
    const selector = document.createElement("input");
    selector.type = "radio";
    selector.name = "client-selected";
    selector.dataset.record = JSON.stringify(client);
    clientsTable.append(
      createRow(
        [
          { node: selector, className: "selection" },
          client.id || "-",
          client.lastName || "-",
          client.firstName || "-",
          client.phone || "-",
          client.email || "-",
          client.treatment || "-",
          { label: client.status || "-", className: "tag" },
        ],
        "clients-row"
      )
    );
  });
};

renderClientsTable();

if (clientHistoryTable) {
  clientHistoryTable.append(
    createRow(
      [
        { label: "תאריך", className: "header" },
        { label: "סוג טיפול", className: "header" },
        { label: "זקיקים", className: "header" },
        { label: "רופא", className: "header" },
      ],
      "history-row"
    )
  );
}

if (clientHistoryTable) {
  clients[0].history.forEach((entry) => {
    clientHistoryTable.append(
      createRow(
        [formatDate(entry.date), entry.type, entry.grafts, entry.doctor],
        "history-row"
      )
    );
  });
}

populatePayments(paymentsTable);
populatePayments(paymentsTableStandalone);

if (hoursTable) {
  hours.forEach((entry) => {
    hoursTable.append(
      createRow([entry.name, formatDate(entry.date), entry.hours, entry.overtime])
    );
  });
}

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    const target = item.dataset.section;
    if (!target) return;
    setActiveSection(target);
    if (target === "transplants") {
      renderStaffOptions(currentStaff);
      renderTransplantsTable(currentTransplants);
    }
    if (target === "overview") {
      updateDashboardMetrics();
    }
    if (target === "finance") {
      renderFinanceSection();
    }
  });
});

const getMonthKeyFromDate = (value) => {
  const normalized = normalizeDate(value);
  if (!normalized.includes("-")) return "";
  return normalized.slice(0, 7);
};

const getSelectedTransplantMonth = () => {
  if (!transplantsMonthInput) return "";
  const value = transplantsMonthInput.value;
  if (value) return value;
  const todayKey = getTodayValue().slice(0, 7);
  transplantsMonthInput.value = todayKey;
  return todayKey;
};

const getStoredUsers = () => {
  const raw = localStorage.getItem("RNCLINIC_USERS");
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }
  return [];
};

const saveUsers = (users) => {
  localStorage.setItem("RNCLINIC_USERS", JSON.stringify(users));
};

const ensureDefaultAdmin = () => {
  const users = getStoredUsers();
  if (users.length) return users;
  const defaultUsers = [{ username: "Admin", password: "#admin#" }];
  saveUsers(defaultUsers);
  return defaultUsers;
};

const setLoginLogo = () => {
  if (!loginLogo) return;
  const stored = localStorage.getItem("RNCLINIC_LOGO");
  if (stored) {
    loginLogo.src = stored;
    loginLogo.style.display = "block";
  } else {
    loginLogo.style.display = "none";
  }
};

const setAppVisibility = (loggedIn) => {
  if (loginScreen) {
    loginScreen.classList.toggle("is-hidden", loggedIn);
  }
  if (appLayout) {
    appLayout.style.display = loggedIn ? "grid" : "none";
  }
};

const renderUsersTable = () => {
  if (!settingsUsersTable) return;
  const users = ensureDefaultAdmin();
  settingsUsersTable.innerHTML = "";
  settingsUsersTable.append(
    createRow(
      [
        { label: "בחירה", className: "header" },
        { label: "שם משתמש", className: "header" },
        { label: "סיסמה", className: "header" },
      ],
      "report-row"
    )
  );
  users.forEach((user) => {
    const selector = document.createElement("input");
    selector.type = "radio";
    selector.name = "user-selected";
    selector.dataset.username = user.username;
    settingsUsersTable.append(
      createRow(
        [{ node: selector, className: "selection" }, user.username, "********"],
        "report-row"
      )
    );
  });
};

const updateDashboardMetrics = () => {
  if (!metricYearCompleted || !metricMonthCompleted || !metricUpcoming) return;
  const today = normalizeDate(getTodayValue());
  const [year, month] = today.split("-");
  const yearStart = `${year}-01-01`;
  const monthStart = `${year}-${month}-01`;
  const completed = currentTransplants.filter(
    (item) => item.status === "בוצע"
  );
  const completedYear = completed.filter(
    (item) => normalizeDate(item.date) >= yearStart
  );
  const completedMonth = completed.filter(
    (item) => normalizeDate(item.date) >= monthStart
  );
  const upcoming = currentTransplants.filter((item) => {
    const normalized = normalizeDate(item.date);
    return normalized >= today && item.status === "מתוכנן";
  });
  metricYearCompleted.textContent = completedYear.length;
  metricMonthCompleted.textContent = completedMonth.length;
  metricUpcoming.textContent = upcoming.length;
};

const filterClients = () => {
  const term = (clientsSearchInput?.value || "").trim().toLowerCase();
  if (!term) {
    renderClientsTable(currentClients);
    return;
  }
  const filtered = currentClients.filter((client) => {
    const first = (client.firstName || "").toLowerCase();
    const last = (client.lastName || "").toLowerCase();
    const phone = String(client.phone || "");
    return (
      first.includes(term) ||
      last.includes(term) ||
      phone.includes(term)
    );
  });
  renderClientsTable(filtered);
};

const renderTransplantsTable = (rows = transplants) => {
  if (!transplantsTable) return;
  transplantsTable.innerHTML = "";
  const dateSortButton = document.createElement("button");
  dateSortButton.type = "button";
  dateSortButton.className = "sort-btn";
  dateSortButton.textContent = `תאריך ${transplantSortAsc ? "▲" : "▼"}`;
  dateSortButton.addEventListener("click", () => {
    transplantSortAsc = !transplantSortAsc;
    renderTransplantsTable(currentTransplants);
  });
  transplantsTable.append(
    createRow(
      [
        { node: dateSortButton, className: "header" },
        { label: "שעה", className: "header" },
        { label: "מס' השתלה", className: "header" },
        { label: "סטטוס", className: "header" },
        { label: "שם לקוח", className: "header" },
        { label: "רופא מטפל", className: "header" },
        { label: "טכנאית 1", className: "header" },
        { label: "טכנאית 2", className: "header" },
        { label: "טכנאית 3", className: "header" },
        { label: "כמות זקיקים", className: "header" },
        { label: "מחיר", className: "header" },
      ],
      "transplants-row"
    )
  );
  const selectedMonth = getSelectedTransplantMonth();
  const searchValue = (transplantsSearchInput?.value || "").trim();
  const filteredRows = rows.filter((entry) => {
    const normalized = normalizeDate(entry.date);
    if (!normalized) return false;
    if (!selectedMonth) return true;
    const matchesMonth = getMonthKeyFromDate(normalized) === selectedMonth;
    if (!searchValue) return matchesMonth;
    const idValue = String(entry.id || "").trim();
    return matchesMonth && idValue.includes(searchValue);
  });
  const sortedRows = [...filteredRows].sort((a, b) => {
    const dateA = normalizeDate(a.date);
    const dateB = normalizeDate(b.date);
    if (dateA !== dateB) {
      return transplantSortAsc
        ? dateA.localeCompare(dateB)
        : dateB.localeCompare(dateA);
    }
    const timeA = a.time || "";
    const timeB = b.time || "";
    return transplantSortAsc
      ? timeA.localeCompare(timeB)
      : timeB.localeCompare(timeA);
  });
  sortedRows.forEach((entry) => {
    const row = createRow(
      [
        formatDate(entry.date),
        entry.time,
        entry.id || "-",
        entry.status || "-",
        entry.client,
        entry.leadDoctor,
        entry.tech1,
        entry.tech2,
        entry.tech3,
        entry.grafts,
        entry.price,
      ],
      "transplants-row"
    );
    row.dataset.record = JSON.stringify(entry);
    row.style.cursor = "pointer";
    row.addEventListener("click", () => {
      fillTransplantForm(entry);
      transplantForm?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    transplantsTable.append(
      row
    );
  });
};

renderTransplantsTable();

const buildTimeOptions = (startHour = 8, endHour = 20, stepMinutes = 15) => {
  if (!transplantTimeSelect) return;
  transplantTimeSelect.innerHTML = "";
  for (let hour = startHour; hour <= endHour; hour += 1) {
    for (let minutes = 0; minutes < 60; minutes += stepMinutes) {
      if (hour === endHour && minutes > 0) break;
      const value = `${String(hour).padStart(2, "0")}:${String(
        minutes
      ).padStart(2, "0")}`;
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      transplantTimeSelect.append(option);
    }
  }
};

buildTimeOptions();

const renderSelectOptions = (select, options = [], placeholder = "") => {
  if (!select) return;
  select.innerHTML = "";
  if (placeholder) {
    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.textContent = placeholder;
    select.append(placeholderOption);
  }
  options.forEach((optionText) => {
    const option = document.createElement("option");
    option.value = optionText;
    option.textContent = optionText;
    select.append(option);
  });
};

const renderStaffOptions = (records = []) => {
  const names = records
    .map((record) =>
      [record.firstName, record.lastName].filter(Boolean).join(" ").trim()
    )
    .filter(Boolean);
  const doctors = records
    .filter((record) => (record.role || "").includes("רופא"))
    .map((record) =>
      [record.firstName, record.lastName].filter(Boolean).join(" ").trim()
    )
    .filter(Boolean);
  const technicians = records
    .filter((record) => (record.role || "").includes("טכנאית"))
    .map((record) =>
      [record.firstName, record.lastName].filter(Boolean).join(" ").trim()
    )
    .filter(Boolean);
  const fallbackNames = names.length ? names : records
    .map((record) => record.name || record.fullName || "")
    .filter(Boolean);
  renderSelectOptions(
    leadDoctorSelect,
    doctors.length ? doctors : fallbackNames,
    "בחר רופא"
  );
  renderSelectOptions(
    tech1Select,
    technicians.length ? technicians : fallbackNames,
    "בחר טכנאית"
  );
  renderSelectOptions(
    tech2Select,
    technicians.length ? technicians : fallbackNames,
    "בחר טכנאית"
  );
  renderSelectOptions(
    tech3Select,
    technicians.length ? technicians : fallbackNames,
    "בחר טכנאית"
  );
};

const renderClientOptions = (records = []) => {
  if (!clientsDatalist) return;
  clientsDatalist.innerHTML = "";
  records.forEach((record) => {
    const name = [record.firstName, record.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();
    const label = record.phone
      ? `${name} - ${record.phone}`.trim()
      : name;
    if (!label) return;
    const option = document.createElement("option");
    option.value = label;
    clientsDatalist.append(option);
  });
};

const getNextId = (records = []) => {
  const numericIds = records
    .map((record) => Number.parseInt(record.id, 10))
    .filter((value) => Number.isFinite(value));
  if (numericIds.length === 0) {
    return String(records.length + 1);
  }
  return String(Math.max(...numericIds) + 1);
};

const ensureAutoId = (input, records) => {
  if (!input) return "";
  const current = (input.value || "").trim();
  if (!current || current.toUpperCase() === "AUTO") {
    const nextId = getNextId(records);
    input.value = nextId;
    return nextId;
  }
  if (!recordExistsById(records, current)) {
    input.value = current;
    return current;
  }
  return current;
};

const ensureUniqueAutoId = (input, records) => {
  if (!input) return "";
  const current = (input.value || "").trim();
  if (!current || current.toUpperCase() === "AUTO") {
    const nextId = getNextId(records);
    input.value = nextId;
    return nextId;
  }
  if (recordExistsById(records, current)) {
    const nextId = getNextId(records);
    input.value = nextId;
    return nextId;
  }
  return current;
};

const recordExistsById = (records, id) =>
  records.some((record) => String(record.id) === String(id));

const formatDateForStorage = (value) => {
  if (!value) return "";
  if (value.includes("/")) return value;
  if (value.includes("-")) {
    const [year, month, day] = value.split("-");
    if (!year || !month || !day) return value;
    return `${day}/${month}/${year}`;
  }
  if (value.includes(".")) {
    const [day, month, year] = value.split(".");
    if (!day || !month || !year) return value;
    return `${day}/${month}/${year}`;
  }
  return value;
};

const parseCurrency = (value) => {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return value;
  const normalized = String(value).replace(/[^\d.-]/g, "");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const populateFinanceSummary = (container, summary) => {
  if (!container) return;
  const profitValue = parseCurrency(summary.profit);
  const profitClass = profitValue >= 0 ? "kpi-positive" : "kpi-negative";
  container.innerHTML = `
    <div class="kpi">הכנסות<strong>${summary.revenue}</strong></div>
    <div class="kpi">הוצאות<strong>${summary.expenses}</strong></div>
    <div class="kpi ${profitClass}">רווח חודשי<strong>${summary.profit}</strong></div>
  `;
};

populateFinanceSummary(financeSummary, {
  revenue: finance.revenue,
  expenses: finance.costs,
  profit: finance.profit,
});
populateFinanceSummary(financeSummaryStandalone, {
  revenue: finance.revenue,
  expenses: finance.costs,
  profit: finance.profit,
});

const formatCurrency = (value) =>
  `₪${Number(value || 0).toLocaleString("he-IL")}`;

const getSelectedFinanceMonth = () => {
  if (!financeMonthInput) return "";
  const value = financeMonthInput.value;
  if (value) return value;
  const todayKey = getTodayValue().slice(0, 7);
  financeMonthInput.value = todayKey;
  return todayKey;
};

const calculateFinanceSummary = (monthKey, financeRows, transplantRows) => {
  const expenses = financeRows
    .filter((row) => row.month === monthKey && row.type === "הוצאה")
    .reduce((sum, row) => sum + parseCurrency(row.amount), 0);
  const manualIncome = financeRows
    .filter((row) => row.month === monthKey && row.type === "הכנסה")
    .reduce((sum, row) => sum + parseCurrency(row.amount), 0);
  const completedTransplants = transplantRows.filter(
    (row) =>
      row.status === "בוצע" && getMonthKeyFromDate(row.date) === monthKey
  );
  const hairIncome = completedTransplants
    .filter((row) => row.type === "השתלת שיער")
    .reduce((sum, row) => sum + parseCurrency(row.price), 0);
  const browIncome = completedTransplants
    .filter((row) => row.type === "השתלת גבות")
    .reduce((sum, row) => sum + parseCurrency(row.price), 0);
  const totalIncome = manualIncome + hairIncome + browIncome;
  return {
    revenue: formatCurrency(totalIncome),
    expenses: formatCurrency(expenses),
    profit: formatCurrency(totalIncome - expenses),
    breakdown: [
      { label: "השתלות שיער", amount: formatCurrency(hairIncome) },
      { label: "השתלות גבות", amount: formatCurrency(browIncome) },
      { label: "הכנסות ידניות", amount: formatCurrency(manualIncome) },
    ],
  };
};

const renderFinanceIncomeTable = (rows) => {
  if (!financeIncomeTable) return;
  financeIncomeTable.innerHTML = "";
  financeIncomeTable.append(
    createRow(
      [
        { label: "סוג הכנסה", className: "header" },
        { label: "סכום", className: "header" },
      ],
      "finance-row"
    )
  );
  rows.forEach((row) => {
    financeIncomeTable.append(createRow([row.label, row.amount], "finance-row"));
  });
};

const renderFinanceTable = (rows, monthKey) => {
  if (!financeTable) return;
  financeTable.innerHTML = "";
  financeTable.append(
    createRow(
      [
        { label: "סוג", className: "header" },
        { label: "קטגוריה", className: "header" },
        { label: "סכום", className: "header" },
        { label: "הערות", className: "header" },
      ],
      "finance-row"
    )
  );
  const summary = calculateFinanceSummary(
    monthKey,
    currentFinance,
    currentTransplants
  );
  summary.breakdown.forEach((row) => {
    financeTable.append(
      createRow(
        ["הכנסה", row.label, row.amount, "חישוב אוטומטי"],
        "finance-row finance-income"
      )
    );
  });
  rows.forEach((row) => {
    const rawType = (row.type || "").trim();
    const typeValue = rawType.toLowerCase();
    const isExpense =
      rawType === "הוצאה" ||
      typeValue === "הוצאה" ||
      typeValue === "expense" ||
      typeValue === "cost";
    const rowClass = isExpense
      ? "finance-row finance-expense"
      : "finance-row finance-income";
    financeTable.append(
      createRow(
        [
          row.type || "-",
          row.category || "-",
          formatCurrency(parseCurrency(row.amount)),
          row.notes || "-",
        ],
        rowClass
      )
    );
  });
};

const renderFinanceSection = () => {
  if (!financeMonthInput) return;
  const monthKey = getSelectedFinanceMonth();
  const monthRows = currentFinance.filter((row) => row.month === monthKey);
  const summary = calculateFinanceSummary(
    monthKey,
    currentFinance,
    currentTransplants
  );
  populateFinanceSummary(financeSummaryStandalone, summary);
  renderFinanceTable(monthRows, monthKey);
};

const getStaffDisplayName = (record) => {
  if (!record) return "";
  const name = [record.firstName, record.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  return name || record.name || record.fullName || "";
};

const parseCompensationNumbers = (value) => {
  if (!value) return [];
  const matches = String(value).match(/[\d.]+/g);
  if (!matches) return [];
  return matches.map((match) => parseCurrency(match));
};

const getSelectedReportMonth = () => {
  if (!reportMonthInput) return "";
  const value = reportMonthInput.value;
  if (value) return value;
  const todayKey = getTodayValue().slice(0, 7);
  reportMonthInput.value = todayKey;
  return todayKey;
};

const hideReportCards = () => {
  reportHourlyCard?.classList.add("is-hidden");
  reportResultsCard?.classList.add("is-hidden");
  reportEmployeePickerCard?.classList.add("is-hidden");
  reportEmployeeResultsCard?.classList.add("is-hidden");
  reportStatusPickerCard?.classList.add("is-hidden");
  reportStatusResultsCard?.classList.add("is-hidden");
};

const getCompletedTransplantsForMonth = (monthKey) =>
  currentTransplants.filter(
    (record) => record.status === "בוצע" && getMonthKeyFromDate(record.date) === monthKey
  );

const getStaffRoleLabel = (staffRecord, name) => {
  if (staffRecord?.role) return staffRecord.role;
  if ((name || "").includes("ד\"ר")) return "רופא";
  return "טכנאית";
};

const renderHourlyInputs = (records, existingValues = {}) => {
  if (!reportHourlyTable || !reportHourlyCard) return;
  reportHourlyTable.innerHTML = "";
  if (!records.length) {
    reportHourlyCard.classList.add("is-hidden");
    return;
  }
  reportHourlyCard.classList.remove("is-hidden");
  reportHourlyTable.append(
    createRow(
      [
        { label: "שם עובד", className: "header" },
        { label: "שכר לשעה", className: "header" },
        { label: "שעות לתשלום", className: "header" },
      ],
      "report-hourly-row"
    )
  );
  records.forEach((record) => {
    const name = getStaffDisplayName(record);
    const [hourlyRate] = parseCompensationNumbers(record.compensation);
    const input = document.createElement("input");
    input.type = "number";
    input.min = "0";
    input.step = "0.5";
    input.placeholder = "לדוגמה: 8";
    input.className = "input";
    input.dataset.staffId = record.id || name;
    const key = input.dataset.staffId;
    if (existingValues[key] !== undefined) {
      input.value = existingValues[key];
    }
    reportHourlyTable.append(
      createRow(
        [
          name,
          formatCurrency(hourlyRate),
          { node: input },
        ],
        "report-hourly-row"
      )
    );
  });
};

const getHourlyInputs = () => {
  if (!reportHourlyTable) return { values: {}, missing: [] };
  const inputs = reportHourlyTable.querySelectorAll("input[data-staff-id]");
  const values = {};
  const missing = [];
  inputs.forEach((input) => {
    const key = input.dataset.staffId;
    if (!input.value) {
      missing.push(key);
      values[key] = 0;
    } else {
      values[key] = parseCurrency(input.value);
    }
  });
  return { values, missing };
};

const renderReportResults = (rows) => {
  if (!reportResultsTable || !reportResultsCard) return;
  reportResultsTable.innerHTML = "";
  if (!rows.length) {
    reportResultsCard.classList.add("is-hidden");
    if (reportTotal) reportTotal.textContent = formatCurrency(0);
    return;
  }
  reportResultsCard.classList.remove("is-hidden");
  reportResultsTable.append(
    createRow(
      [
        { label: "שם עובד", className: "header" },
        { label: "כמות השתלות", className: "header" },
        { label: "שכר לתשלום", className: "header" },
      ],
      "report-row"
    )
  );
  rows.forEach((row) => {
    reportResultsTable.append(
      createRow(
        [row.name, row.count, formatCurrency(row.pay)],
        "report-row"
      )
    );
  });
  const total = rows.reduce((sum, row) => sum + row.pay, 0);
  if (reportTotal) reportTotal.textContent = formatCurrency(total);
};

const renderEmployeePicker = (entries, selected = new Set()) => {
  if (!reportEmployeePickerTable || !reportEmployeePickerCard) return;
  reportEmployeePickerTable.innerHTML = "";
  if (!entries.length) {
    reportEmployeePickerCard.classList.add("is-hidden");
    return;
  }
  reportEmployeePickerCard.classList.remove("is-hidden");
  reportEmployeePickerTable.append(
    createRow(
      [
        { label: "בחירה", className: "header" },
        { label: "שם עובד", className: "header" },
        { label: "תפקיד", className: "header" },
      ],
      "report-selection-row"
    )
  );
  entries.forEach((entry) => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = selected.has(entry.key);
    checkbox.dataset.staffKey = entry.key;
    reportEmployeePickerTable.append(
      createRow(
        [{ node: checkbox }, entry.name, entry.role],
        "report-selection-row"
      )
    );
  });
};

const renderStatusPicker = (statuses, selected = new Set()) => {
  if (!reportStatusPickerTable || !reportStatusPickerCard) return;
  reportStatusPickerTable.innerHTML = "";
  if (!statuses.length) {
    reportStatusPickerCard.classList.add("is-hidden");
    return;
  }
  reportStatusPickerCard.classList.remove("is-hidden");
  reportStatusPickerTable.append(
    createRow(
      [
        { label: "בחירה", className: "header" },
        { label: "סטטוס", className: "header" },
        { label: "תיאור", className: "header" },
      ],
      "report-selection-row"
    )
  );
  statuses.forEach((status) => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = selected.has(status);
    checkbox.dataset.status = status;
    reportStatusPickerTable.append(
      createRow(
        [{ node: checkbox }, status, " "],
        "report-selection-row"
      )
    );
  });
};

const getSelectedCheckboxValues = (selector, attribute) => {
  const values = new Set();
  const inputs = document.querySelectorAll(selector);
  inputs.forEach((input) => {
    if (input.checked && input.dataset[attribute]) {
      values.add(input.dataset[attribute]);
    }
  });
  return values;
};

const renderEmployeeReportResults = (entries) => {
  if (!reportEmployeeResultsTable || !reportEmployeeResultsCard) return;
  reportEmployeeResultsTable.innerHTML = "";
  if (!entries.length) {
    reportEmployeeResultsCard.classList.add("is-hidden");
    return;
  }
  reportEmployeeResultsCard.classList.remove("is-hidden");
  entries.forEach((entry, index) => {
    const monthlySummary = `כמות השתלות ראשונות: ${entry.firstCount} | כמות השתלות כפולות: ${entry.doubleCount} | כמות ההשתלות שבוצעו: ${entry.totalCount}`;
    reportEmployeeResultsTable.append(
      createRow(
        [`${entry.name}`, `תפקיד: ${entry.role}`, monthlySummary],
        "report-employee-title"
      )
    );
    entry.days.forEach((day) => {
      reportEmployeeResultsTable.append(
        createRow([`תאריך: ${formatDate(day.date)}`], "report-employee-date")
      );
      day.transplants.forEach((transplant) => {
        reportEmployeeResultsTable.append(
          createRow(
            [
              `מס' השתלה: ${transplant.id || "-"}`,
              `שם המטופל: ${transplant.client || "-"}`,
            ],
            "report-employee-detail"
          )
        );
      });
      reportEmployeeResultsTable.append(
        createRow(
          [`סיכום יומי: ${day.transplants.length} השתלות`],
          "report-employee-day-summary"
        )
      );
    });
    if (index < entries.length - 1) {
      reportEmployeeResultsTable.append(
        createRow([""], "report-spacer")
      );
    }
  });
};

const renderStatusReportResults = (entries) => {
  if (!reportStatusResultsTable || !reportStatusResultsCard) return;
  reportStatusResultsTable.innerHTML = "";
  if (!entries.length) {
    reportStatusResultsCard.classList.add("is-hidden");
    return;
  }
  reportStatusResultsCard.classList.remove("is-hidden");
  reportStatusResultsTable.append(
    createRow(
      [
        { label: "תאריך", className: "header" },
        { label: "שעה", className: "header" },
        { label: "מס' השתלה", className: "header" },
        { label: "סטטוס", className: "header" },
        { label: "שם לקוח", className: "header" },
        { label: "רופא מטפל", className: "header" },
        { label: "טכנאית 1", className: "header" },
        { label: "טכנאית 2", className: "header" },
        { label: "טכנאית 3", className: "header" },
        { label: "כמות זקיקים", className: "header" },
        { label: "מחיר", className: "header" },
      ],
      "transplants-row"
    )
  );
  entries.forEach((entry) => {
    reportStatusResultsTable.append(
      createRow(
        [
          formatDate(entry.date),
          entry.time,
          entry.id || "-",
          entry.status || "-",
          entry.client,
          entry.leadDoctor,
          entry.tech1,
          entry.tech2,
          entry.tech3,
          entry.grafts,
          entry.price,
        ],
        "transplants-row"
      )
    );
  });
};

const resetReportView = () => {
  setFormStatus(reportStatus, "");
  if (reportResultsTable) reportResultsTable.innerHTML = "";
  if (reportResultsCard) reportResultsCard.classList.add("is-hidden");
  if (reportTotal) reportTotal.textContent = formatCurrency(0);
  if (reportHourlyTable) reportHourlyTable.innerHTML = "";
  if (reportHourlyCard) reportHourlyCard.classList.add("is-hidden");
  if (reportEmployeePickerTable) reportEmployeePickerTable.innerHTML = "";
  if (reportEmployeePickerCard) reportEmployeePickerCard.classList.add("is-hidden");
  if (reportEmployeeResultsTable) reportEmployeeResultsTable.innerHTML = "";
  if (reportEmployeeResultsCard) reportEmployeeResultsCard.classList.add("is-hidden");
  if (reportStatusPickerTable) reportStatusPickerTable.innerHTML = "";
  if (reportStatusPickerCard) reportStatusPickerCard.classList.add("is-hidden");
  if (reportStatusResultsTable) reportStatusResultsTable.innerHTML = "";
  if (reportStatusResultsCard) reportStatusResultsCard.classList.add("is-hidden");
  if (reportTypeSelect) reportTypeSelect.value = "payroll";
  if (reportMonthInput) {
    reportMonthInput.value = getTodayValue().slice(0, 7);
  }
};

const calculatePerTransplantPay = (countsByDate, compensation) => {
  const [firstRate, secondRate] = parseCompensationNumbers(compensation);
  if (!firstRate) return 0;
  const additionalRate = secondRate ?? firstRate;
  return Object.values(countsByDate).reduce((sum, count) => {
    if (count <= 0) return sum;
    const extra = Math.max(0, count - 1);
    return sum + firstRate + extra * additionalRate;
  }, 0);
};

const renderPayrollReport = () => {
  hideReportCards();
  const monthKey = getSelectedReportMonth();
  renderReportResults([]);
  if (reportTotal) reportTotal.textContent = formatCurrency(0);
  const staffByName = new Map(
    currentStaff
      .map((record) => [getStaffDisplayName(record), record])
      .filter(([name]) => name)
  );
  const countsByStaff = new Map();
  const transplantsInMonth = currentTransplants.filter(
    (record) => getMonthKeyFromDate(record.date) === monthKey
  );
  const completedTransplants = transplantsInMonth.filter(
    (record) =>
      record.status === "בוצע"
  );

  const transplantsForCounts = completedTransplants.length
    ? completedTransplants
    : transplantsInMonth;

  transplantsForCounts.forEach((record) => {
    const participants = [
      record.leadDoctor,
      record.tech1,
      record.tech2,
      record.tech3,
    ].filter(Boolean);
    const dateKey = normalizeDate(record.date);
    participants.forEach((name) => {
      const staffRecord = staffByName.get(name);
      if (!staffRecord) return;
      const staffKey = staffRecord.id || name;
      const entry =
        countsByStaff.get(staffKey) ||
        {
          staff: staffRecord,
          name,
          total: 0,
          byDate: {},
        };
      entry.total += 1;
      entry.byDate[dateKey] = (entry.byDate[dateKey] || 0) + 1;
      countsByStaff.set(staffKey, entry);
    });
  });

  const reportEntries = Array.from(countsByStaff.values()).filter(
    (entry) => entry.total > 0
  );
  const hourlyEntries = reportEntries.filter(
    (entry) => entry.staff.employmentType === "שעתי"
  );
  const previousHourly = getHourlyInputs();
  renderHourlyInputs(hourlyEntries.map((entry) => entry.staff), previousHourly.values);

  if (!completedTransplants.length) {
    setFormStatus(
      reportStatus,
      "אין השתלות שבוצעו בחודש שנבחר, מוצגות השתלות מתוכננות לצורך הזנת שעות.",
      "error"
    );
    renderReportResults([]);
    return;
  }

  const hourlyInputs = getHourlyInputs();
  const missingHourly = hourlyEntries.filter((entry) => {
    const key = entry.staff.id || entry.name;
    return hourlyInputs.missing.includes(String(key));
  });

  if (missingHourly.length > 0) {
    setFormStatus(
      reportStatus,
      "נא להזין שעות לתשלום לכל עובד שעתי ואז ללחוץ הצג.",
      "error"
    );
    renderReportResults([]);
    return;
  }

  const rows = reportEntries.map((entry) => {
    const staff = entry.staff;
    let pay = 0;
    if (staff.employmentType === "גלובלי") {
      pay = parseCompensationNumbers(staff.compensation)[0] || 0;
    } else if (staff.employmentType === "לפי השתלה") {
      pay = calculatePerTransplantPay(entry.byDate, staff.compensation);
    } else if (staff.employmentType === "שעתי") {
      const key = staff.id || entry.name;
      const hourlyRate = parseCompensationNumbers(staff.compensation)[0] || 0;
      pay = hourlyRate * (hourlyInputs.values[key] || 0);
    }
    return {
      name: entry.name,
      count: entry.total,
      pay,
    };
  });

  rows.sort((a, b) => b.pay - a.pay);
  setFormStatus(reportStatus, "", "");
  renderReportResults(rows);
};

const buildEmployeeReportData = (monthKey, selectedStaff) => {
  const staffByName = new Map(
    currentStaff
      .map((record) => [getStaffDisplayName(record), record])
      .filter(([name]) => name)
  );
  const completed = getCompletedTransplantsForMonth(monthKey);
  const transplantsByStaff = new Map();
  completed.forEach((record) => {
    const participants = [
      record.leadDoctor,
      record.tech1,
      record.tech2,
      record.tech3,
    ].filter(Boolean);
    const dateKey = normalizeDate(record.date);
    participants.forEach((name) => {
      if (!selectedStaff.has(name)) return;
      const staffRecord = staffByName.get(name);
      const key = staffRecord?.id || name;
      const entry =
        transplantsByStaff.get(key) || {
          key,
          name,
          role: getStaffRoleLabel(staffRecord, name),
          byDate: {},
          totalCount: 0,
        };
      entry.totalCount += 1;
      entry.byDate[dateKey] = entry.byDate[dateKey] || [];
      entry.byDate[dateKey].push(record);
      transplantsByStaff.set(key, entry);
    });
  });

  return Array.from(transplantsByStaff.values()).map((entry) => {
    const dates = Object.keys(entry.byDate).sort((a, b) => a.localeCompare(b));
    const days = dates.map((date) => ({
      date,
      transplants: entry.byDate[date],
    }));
    const firstCount = days.length;
    const doubleCount = days.filter((day) => day.transplants.length > 1).length;
    return {
      name: entry.name,
      role: entry.role,
      days,
      firstCount,
      doubleCount,
      totalCount: entry.totalCount,
    };
  });
};

const renderTransplantsByEmployeeReport = () => {
  hideReportCards();
  const monthKey = getSelectedReportMonth();
  const completed = getCompletedTransplantsForMonth(monthKey);
  if (!completed.length) {
    setFormStatus(reportStatus, "אין השתלות שבוצעו בחודש שנבחר.", "error");
    renderEmployeePicker([]);
    renderEmployeeReportResults([]);
    return;
  }

  const staffByName = new Map(
    currentStaff
      .map((record) => [getStaffDisplayName(record), record])
      .filter(([name]) => name)
  );
  const participants = new Map();
  completed.forEach((record) => {
    const names = [
      record.leadDoctor,
      record.tech1,
      record.tech2,
      record.tech3,
    ].filter(Boolean);
    names.forEach((name) => {
      const staffRecord = staffByName.get(name);
      const key = name;
      if (participants.has(key)) return;
      participants.set(key, {
        key,
        name,
        role: getStaffRoleLabel(staffRecord, name),
      });
    });
  });

  if (!participants.size) {
    setFormStatus(reportStatus, "אין עובדים להשתלות שבוצעו בחודש שנבחר.", "error");
    renderEmployeePicker([]);
    renderEmployeeReportResults([]);
    return;
  }

  setFormStatus(reportStatus, "בחר עובדים ולחץ שמירה להצגת הדוח.", "");
  renderEmployeePicker(Array.from(participants.values()));
  renderEmployeeReportResults([]);
};

const handleEmployeeReportSave = () => {
  const monthKey = getSelectedReportMonth();
  const selected = getSelectedCheckboxValues(
    "#report-employee-picker-table input[type='checkbox']",
    "staffKey"
  );
  if (!selected.size) {
    setFormStatus(reportStatus, "נא לבחור לפחות עובד אחד.", "error");
    renderEmployeeReportResults([]);
    return;
  }
  const reportData = buildEmployeeReportData(monthKey, selected);
  if (!reportData.length) {
    setFormStatus(reportStatus, "לא נמצאו השתלות לעובדים שנבחרו.", "error");
    renderEmployeeReportResults([]);
    return;
  }
  setFormStatus(reportStatus, "", "");
  renderEmployeeReportResults(reportData);
};

const renderTransplantsByStatusReport = () => {
  hideReportCards();
  const monthKey = getSelectedReportMonth();
  const transplants = currentTransplants.filter(
    (record) => getMonthKeyFromDate(record.date) === monthKey
  );
  if (!transplants.length) {
    setFormStatus(reportStatus, "אין השתלות בחודש שנבחר.", "error");
    renderStatusPicker([]);
    renderStatusReportResults([]);
    return;
  }
  setFormStatus(reportStatus, "בחר סטטוסים ולחץ שמירה להצגת הדוח.", "");
  renderStatusPicker(["מתוכנן", "בוצע", "נדחה", "בוטל"]);
  renderStatusReportResults([]);
};

const handleStatusReportSave = () => {
  const monthKey = getSelectedReportMonth();
  const selected = getSelectedCheckboxValues(
    "#report-status-picker-table input[type='checkbox']",
    "status"
  );
  if (!selected.size) {
    setFormStatus(reportStatus, "נא לבחור לפחות סטטוס אחד.", "error");
    renderStatusReportResults([]);
    return;
  }
  const filtered = currentTransplants
    .filter((record) => getMonthKeyFromDate(record.date) === monthKey)
    .filter((record) => selected.has(record.status))
    .sort((a, b) => {
      const dateA = normalizeDate(a.date);
      const dateB = normalizeDate(b.date);
      if (dateA !== dateB) return dateA.localeCompare(dateB);
      return (a.time || "").localeCompare(b.time || "");
    });
  if (!filtered.length) {
    setFormStatus(reportStatus, "לא נמצאו השתלות בסטטוסים שנבחרו.", "error");
    renderStatusReportResults([]);
    return;
  }
  setFormStatus(reportStatus, "", "");
  renderStatusReportResults(filtered);
};

const DAILY_TRANSPLANTS_COLUMNS = [
  { label: "מס' השתלה/סטטוס", className: "header" },
  { label: "שעה", className: "header" },
  { label: "לקוח", className: "header" },
  { label: "סוג טיפול", className: "header" },
  { label: "כמות זקיקים", className: "header" },
  { label: "רופא מוביל", className: "header" },
  { label: "טכנאית 1", className: "header" },
  { label: "טכנאית 2", className: "header" },
  { label: "טכנאית 3", className: "header" },
  { label: "מחיר", className: "header" },
  { label: "סטטוס", className: "header" },
];

const renderDailyTransplantsHeader = (container) => {
  container.append(createRow(DAILY_TRANSPLANTS_COLUMNS, "daily-row"));
};

const renderDailyTransplantRows = (container, entries) => {
  entries.forEach((entry) => {
    container.append(
      createRow(
        [
          `${entry.id || "-"} / ${entry.status || "-"}`,
          entry.time,
          entry.client,
          entry.type,
          entry.grafts,
          entry.leadDoctor,
          entry.tech1,
          entry.tech2,
          entry.tech3,
          entry.price,
          entry.status,
        ],
        "daily-row"
      )
    );
  });
};

const renderEmptyDailyRow = (container, message) => {
  container.append(
    createRow(
      [message, "", "", "", "", "", "", "", "", "", ""],
      "daily-row empty-row"
    )
  );
};

const renderDailyTransplants = (selectedDate, rows = transplants) => {
  if (!dailyTransplantsTable) return;
  dailyTransplantsTable.innerHTML = "";
  renderDailyTransplantsHeader(dailyTransplantsTable);

  const filtered = rows
    .filter((entry) => normalizeDate(entry.date) === selectedDate)
    .sort((a, b) => (a.time || "").localeCompare(b.time || ""));
  if (filtered.length === 0) {
    renderEmptyDailyRow(dailyTransplantsTable, "אין השתלות בתאריך זה.");
    return;
  }

  renderDailyTransplantRows(dailyTransplantsTable, filtered);
};

const getHebrewDayName = (date) => {
  const dayNames = [
    "יום א'",
    "יום ב'",
    "יום ג'",
    "יום ד'",
    "יום ה'",
    "יום ו'",
    "שבת",
  ];
  return dayNames[date.getDay()] || "";
};

const getCalendarStartDate = (monthKey) => {
  if (!monthKey) return new Date();
  const [year, month] = monthKey.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  const day = date.getDay();
  const start = new Date(date);
  start.setDate(date.getDate() - day);
  return start;
};

const renderUpcomingCalendar = (rows = transplants) => {
  if (!upcomingCalendarContainer) return;
  upcomingCalendarContainer.innerHTML = "";
  const monthKey = upcomingMonthInput?.value || getTodayValue().slice(0, 7);
  if (upcomingMonthInput && !upcomingMonthInput.value) {
    upcomingMonthInput.value = monthKey;
  }
  const startDate = getCalendarStartDate(monthKey);
  const dayHeaders = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי"];

  dayHeaders.forEach((label) => {
    const header = document.createElement("div");
    header.className = "calendar-cell calendar-header";
    header.textContent = label;
    upcomingCalendarContainer.append(header);
  });

  for (let week = 0; week < 5; week += 1) {
    for (let dayOffset = 0; dayOffset < 7; dayOffset += 1) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + week * 7 + dayOffset);
      if (currentDate.getDay() === 6) {
        continue;
      }
      const normalized = normalizeDate(currentDate);
      const entries = rows
        .filter((entry) => normalizeDate(entry.date) === normalized)
        .sort((a, b) => (a.time || "").localeCompare(b.time || ""));

      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "calendar-cell";
      cell.dataset.date = normalized;

      const dateLabel = document.createElement("div");
      dateLabel.className = "calendar-date";
      dateLabel.textContent = formatDate(normalized);

      const list = document.createElement("div");
      list.className = "calendar-list";
      if (entries.length === 0) {
        cell.classList.add("is-empty");
        const empty = document.createElement("div");
        empty.className = "calendar-empty";
        empty.textContent = "אין השתלות";
        list.append(empty);
      } else {
        cell.classList.add("is-busy");
        entries.forEach((entry) => {
          const row = document.createElement("div");
          row.className = "calendar-item";
          row.textContent = `${entry.time || ""} ${entry.client || ""}`.trim();
          list.append(row);
        });
      }

      cell.append(dateLabel, list);
      cell.addEventListener("click", () => {
        if (dashboardDateInput) {
          dashboardDateInput.value = normalized;
        }
        renderDailyTransplants(normalized, currentTransplants);
      });
      upcomingCalendarContainer.append(cell);
    }
  }
};

const getDashboardSelectedDate = () => {
  if (!dashboardDateInput) return "";
  const rawValue = dashboardDateInput.value || "";
  const normalized = normalizeDate(rawValue);
  if (normalized) return normalized;
  const today = getTodayValue();
  dashboardDateInput.value = today;
  return today;
};

if (dashboardDateInput) {
  dashboardDateInput.value = getTodayValue();
  renderDailyTransplants(getDashboardSelectedDate());
  renderUpcomingCalendar(currentTransplants);
  const handleDateChange = () => {
    renderDailyTransplants(getDashboardSelectedDate(), currentTransplants);
  };
  dashboardDateInput.addEventListener("change", handleDateChange);
  dashboardDateInput.addEventListener("input", handleDateChange);
}

if (transplantsMonthInput) {
  transplantsMonthInput.value = getTodayValue().slice(0, 7);
  transplantsMonthInput.addEventListener("change", () => {
    renderTransplantsTable(currentTransplants);
  });
}

if (transplantsSearchInput) {
  transplantsSearchInput.addEventListener("input", () => {
    renderTransplantsTable(currentTransplants);
  });
}

if (clientsSearchInput) {
  clientsSearchInput.addEventListener("input", () => {
    filterClients();
  });
}

if (clientsFilterButton) {
  clientsFilterButton.addEventListener("click", () => {
    filterClients();
  });
}

if (upcomingMonthInput) {
  upcomingMonthInput.value = getTodayValue().slice(0, 7);
  upcomingMonthInput.addEventListener("change", () => {
    renderUpcomingCalendar(currentTransplants);
  });
}

if (calendarExportButton) {
  calendarExportButton.addEventListener("click", () => {
    document.body.classList.add("print-calendar-only");
    window.print();
    setTimeout(() => {
      document.body.classList.remove("print-calendar-only");
    }, 0);
  });
}

if (loginForm) {
  ensureDefaultAdmin();
  setLoginLogo();
  if (localStorage.getItem("RNCLINIC_ACTIVE_USER")) {
    setAppVisibility(true);
    setLoginLogo();
  } else {
    setLoginLogo();
    setAppVisibility(false);
  }
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(loginForm);
    const username = (formData.get("username") || "").toString().trim();
    const password = (formData.get("password") || "").toString();
    const users = ensureDefaultAdmin();
    const match = users.find(
      (user) => user.username === username && user.password === password
    );
    if (match) {
      localStorage.setItem("RNCLINIC_ACTIVE_USER", username);
      setFormStatus(loginStatus, "");
      setAppVisibility(true);
      updateDashboardMetrics();
    } else {
      setFormStatus(loginStatus, "פרטי התחברות שגויים.", "error");
    }
  });
}

if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    localStorage.removeItem("RNCLINIC_ACTIVE_USER");
    if (loginForm) loginForm.reset();
    setLoginLogo();
    setAppVisibility(false);
  });
}

if (addUserForm) {
  renderUsersTable();
  addUserForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(addUserForm);
    const username = (formData.get("newUsername") || "").toString().trim();
    const password = (formData.get("newPassword") || "").toString();
    const confirm = (formData.get("confirmPassword") || "").toString();
    if (!username || !password) return;
    if (password !== confirm) {
      alert("הסיסמאות אינן זהות.");
      return;
    }
    const users = ensureDefaultAdmin();
    if (users.some((user) => user.username === username)) {
      alert("שם משתמש כבר קיים.");
      return;
    }
    users.push({ username, password });
    saveUsers(users);
    addUserForm.reset();
    renderUsersTable();
  });
}

if (deleteUserButton) {
  deleteUserButton.addEventListener("click", () => {
    const selected = settingsUsersTable?.querySelector("input[name='user-selected']:checked");
    if (!selected) return;
    const username = selected.dataset.username;
    if (!username || username === "Admin") {
      alert("לא ניתן למחוק את משתמש ה-Admin.");
      return;
    }
    const users = ensureDefaultAdmin().filter((user) => user.username !== username);
    saveUsers(users);
    renderUsersTable();
  });
}

if (settingsLogoInput) {
  settingsLogoInput.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      localStorage.setItem("RNCLINIC_LOGO", String(reader.result || ""));
      setLoginLogo();
    };
    reader.readAsDataURL(file);
  });
}

if (reportMonthInput) {
  reportMonthInput.value = getTodayValue().slice(0, 7);
}

if (reportShowButton) {
  reportShowButton.addEventListener("click", () => {
    if (!reportTypeSelect) return;
    const reportType = reportTypeSelect.value;
    if (reportType === "payroll") {
      renderPayrollReport();
      return;
    }
    if (reportType === "transplants-by-employee") {
      renderTransplantsByEmployeeReport();
      return;
    }
    if (reportType === "transplants-by-status") {
      renderTransplantsByStatusReport();
      return;
    }
    setFormStatus(reportStatus, "בחר דוח להצגה.", "error");
  });
}

if (reportHoursSaveButton) {
  reportHoursSaveButton.addEventListener("click", () => {
    renderPayrollReport();
  });
}

if (reportEmployeeSaveButton) {
  reportEmployeeSaveButton.addEventListener("click", () => {
    handleEmployeeReportSave();
  });
}

if (reportStatusSaveButton) {
  reportStatusSaveButton.addEventListener("click", () => {
    handleStatusReportSave();
  });
}

if (reportResetButton) {
  reportResetButton.addEventListener("click", () => {
    resetReportView();
  });
}

const getJson = async (path) => {
  const response = await fetch(`${API_BASE}${path}`, {
    cache: "no-store",
    headers: { "Cache-Control": "no-cache" },
  });
  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }
  return response.json();
};

const postJson = async (path, payload) => {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Failed to post ${path}`);
  }
  return response.json();
};

const putJson = async (path, payload) => {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Failed to update ${path}`);
  }
  return response.json();
};

const mapStaffRow = (row) => ({
  id: row.id || row.employeeId || row["מספר עובד"] || row["מס' עובד"],
  firstName: row.firstName || row["שם פרטי"],
  lastName: row.lastName || row["שם משפחה"],
  role: row.role || row["תפקיד"],
  employmentType: row.employmentType || row["סוג משרה"],
  compensation: row.compensation || row["שכר"],
  startDate: normalizeDate(row.startDate || row["תאריך קליטה"]),
  status: row.status || row["סטטוס"],
});

const mapClientRow = (row) => ({
  id: row.id || row["#"] || row["מספר"] || row["מס' לקוח"],
  firstName: row.firstName || row["שם פרטי"],
  lastName: row.lastName || row["שם משפחה"],
  phone: row.phone || row["טלפון"],
  email: row.email || row["אימייל"],
  treatment: row.treatment || row["טיפול"],
  status: row.status || row["סטטוס"],
});

const mapTransplantRow = (row) => ({
  id: row.id || row["מספר השתלה"] || row["מס' השתלה"],
  date: normalizeDate(row.date || row["תאריך"]),
  time: row.time || row["שעה"],
  client: row.client || row["לקוח"],
  type: row.type || row["סוג טיפול"],
  grafts: row.grafts || row["זקיקים"],
  price: row.price || row["מחיר"],
  leadDoctor: row.leadDoctor || row["רופא מוביל"],
  tech1: row.tech1 || row["טכנאית 1"],
  tech2: row.tech2 || row["טכנאית 2"],
  tech3: row.tech3 || row["טכנאית 3"],
  status: row.status || row["סטטוס"],
});

const mapFinanceRow = (row) => ({
  id: row.id || row["מספר"] || row["מס' רשומה"],
  month: row.month || row["חודש"],
  type: row.type || row["סוג"],
  category: row.category || row["קטגוריה"],
  amount: row.amount || row["סכום"],
  notes: row.notes || row["הערות"],
});

const loadFromApi = async () => {
  try {
    const [clientsRows, staffRows, transplantRows, financeRows] =
      await Promise.all([
      getJson("/clients"),
      getJson("/staff"),
      getJson("/transplants"),
      getJson("/finance"),
    ]);

    const mappedClients = clientsRows.map(mapClientRow);
    const mappedStaff = staffRows.map(mapStaffRow);
    const mappedTransplants = transplantRows.map(mapTransplantRow);
    const mappedFinance = financeRows.map(mapFinanceRow);

    currentClients = mappedClients;
    currentStaff = mappedStaff;
    currentTransplants = mappedTransplants;
    currentFinance = mappedFinance;

    window.RNCLINIC_CLIENTS = mappedClients;
    renderClientsTable(mappedClients);
    renderStaffTable(staffTableStandalone, mappedStaff);
    renderTransplantsTable(mappedTransplants);
    renderStaffOptions(mappedStaff);
    renderClientOptions(mappedClients);
    if (dashboardDateInput && !dashboardDateInput.value) {
      dashboardDateInput.value = getTodayValue();
    }
    if (dashboardDateInput) {
      renderDailyTransplants(getDashboardSelectedDate(), mappedTransplants);
    }
    renderUpcomingCalendar(mappedTransplants);
    renderFinanceSection();
    renderUsersTable();
    updateDashboardMetrics();
  } catch (error) {
    console.warn("API unavailable, using sample data.", error);
    currentClients = [...clients];
    currentStaff = [...staffRecords];
    currentTransplants = [...transplants];
    currentFinance = [];
    renderStaffOptions(staffRecords);
    renderClientOptions(clients);
    renderFinanceSection();
    renderUpcomingCalendar(transplants);
    renderUsersTable();
    updateDashboardMetrics();
  }
};

const buildStaffPayload = (formData) => {
  const employmentType = formData.get("employmentType");
  let compensation = "";
  if (employmentType === "שעתי") {
    compensation = `${formData.get("hourlyRate") || ""} לשעה`;
  } else if (employmentType === "לפי השתלה") {
    const first = formData.get("perTransplant1") || "";
    const second = formData.get("perTransplant2") || "";
    compensation = `${first} / ${second}`;
  } else if (employmentType === "גלובלי") {
    compensation = formData.get("globalSalary") || "";
  }

  return {
    id: formData.get("id") || "",
    firstName: formData.get("firstName") || "",
    lastName: formData.get("lastName") || "",
    role: formData.get("role") || "",
    employmentType: employmentType || "",
    compensation,
    startDate: formatDateForStorage(formData.get("startDate") || ""),
    status: "פעיל",
  };
};

const buildClientPayload = (formData) => ({
  id: formData.get("id") || "",
  firstName: formData.get("firstName") || "",
  lastName: formData.get("lastName") || "",
  phone: formData.get("phone") || "",
  email: formData.get("email") || "",
  treatment: formData.get("treatment") || "",
  status: formData.get("status") || "",
});

const buildTransplantPayload = (formData) => ({
  id: formData.get("id") || "",
  date: formatDateForStorage(formData.get("date") || ""),
  time: formData.get("time") || "",
  client: formData.get("client") || "",
  type: formData.get("type") || "",
  grafts: formData.get("grafts") || "",
  price: formData.get("price") || "",
  leadDoctor: formData.get("leadDoctor") || "",
  tech1: formData.get("tech1") || "",
  tech2: formData.get("tech2") || "",
  tech3: formData.get("tech3") || "",
  status: formData.get("status") || "מתוכנן",
});

const fillStaffForm = (record) => {
  if (!staffForm || !record) return;
  const setValue = (selector, value) => {
    const field = staffForm.querySelector(selector);
    if (field) field.value = value;
  };
  setValue("[name='id']", record.id || "");
  setValue("[name='firstName']", record.firstName || "");
  setValue("[name='lastName']", record.lastName || "");
  setValue("[name='role']", record.role || "רופא");
  const employmentType = record.employmentType || "שעתי";
  setValue("[name='employmentType']", employmentType);
  setValue("[name='startDate']", record.startDate || "");
  setValue("[name='hourlyRate']", "");
  setValue("[name='perTransplant1']", "");
  setValue("[name='perTransplant2']", "");
  setValue("[name='globalSalary']", "");
  const [firstValue, secondValue] = parseCompensationNumbers(record.compensation);
  if (employmentType === "שעתי") {
    setValue("[name='hourlyRate']", firstValue || "");
  } else if (employmentType === "לפי השתלה") {
    setValue("[name='perTransplant1']", firstValue || "");
    setValue("[name='perTransplant2']", secondValue || "");
  } else if (employmentType === "גלובלי") {
    setValue("[name='globalSalary']", firstValue || "");
  }
};

const fillTransplantForm = (record) => {
  if (!transplantForm || !record) return;
  const setValue = (selector, value) => {
    const field = transplantForm.querySelector(selector);
    if (field) field.value = value;
  };
  setValue("[name='id']", record.id || "");
  setValue("[name='date']", normalizeDate(record.date || ""));
  setValue("[name='time']", record.time || "");
  setValue("[name='client']", record.client || "");
  setValue("[name='type']", record.type || "השתלת שיער");
  setValue("[name='grafts']", record.grafts || "");
  setValue("[name='price']", record.price || "");
  setValue("[name='leadDoctor']", record.leadDoctor || "");
  setValue("[name='tech1']", record.tech1 || "");
  setValue("[name='tech2']", record.tech2 || "");
  setValue("[name='tech3']", record.tech3 || "");
  setValue("[name='status']", record.status || "מתוכנן");
};

const fillClientForm = (record) => {
  if (!clientForm || !record) return;
  const setValue = (selector, value) => {
    const field = clientForm.querySelector(selector);
    if (field) field.value = value;
  };
  setValue("[name='id']", record.id || "");
  setValue("[name='firstName']", record.firstName || "");
  setValue("[name='lastName']", record.lastName || "");
  setValue("[name='phone']", record.phone || "");
  setValue("[name='email']", record.email || "");
  setValue("[name='treatment']", record.treatment || "");
  setValue("[name='status']", record.status || "בתהליך");
};

if (staffForm) {
  staffForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const staffId = ensureAutoId(
      staffForm.querySelector("[name='id']"),
      currentStaff
    );
    const payload = buildStaffPayload(new FormData(staffForm));
    try {
      setFormStatus(staffFormStatus, "שומר פרטי עובד...");
      if (recordExistsById(currentStaff, staffId)) {
        await putJson(`/staff/${staffId}`, payload);
      } else {
        await postJson("/staff", payload);
      }
      await loadFromApi();
      setFormStatus(staffFormStatus, "פרטי העובד נשמרו בהצלחה.", "success");
    } catch (error) {
      setFormStatus(
        staffFormStatus,
        "שמירת העובד נכשלה. ודא שהשרת פועל ושהחיבור ל-API זמין.",
        "error"
      );
      console.warn("Failed to save staff record.", error);
    }
  });
}

if (transplantForm) {
  transplantForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const transplantId = ensureAutoId(
      transplantForm.querySelector("[name='id']"),
      currentTransplants
    );
    const payload = buildTransplantPayload(new FormData(transplantForm));
    try {
      setFormStatus(transplantFormStatus, "שומר השתלה...");
      if (recordExistsById(currentTransplants, transplantId)) {
        await putJson(`/transplants/${transplantId}`, payload);
      } else {
        await postJson("/transplants", payload);
      }
      await loadFromApi();
      updateDashboardMetrics();
      setFormStatus(transplantFormStatus, "ההשתלה נשמרה בהצלחה.", "success");
      transplantForm.reset();
      ensureAutoId(
        transplantForm.querySelector("[name='id']"),
        currentTransplants
      );
    } catch (error) {
      setFormStatus(
        transplantFormStatus,
        "שמירת ההשתלה נכשלה. ודא שהשרת פועל ושהחיבור ל-API זמין.",
        "error"
      );
      console.warn("Failed to save transplant record.", error);
    }
  });
}

if (financeMonthInput) {
  financeMonthInput.addEventListener("change", () => {
    renderFinanceSection();
  });
}

if (financeForm) {
  financeForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const financeId = ensureUniqueAutoId(
      financeForm.querySelector("[name='id']"),
      currentFinance
    );
    const monthKey = getSelectedFinanceMonth();
    const formData = new FormData(financeForm);
    const payload = {
      id: financeId,
      month: monthKey,
      type: formData.get("type") || "הוצאה",
      category: formData.get("category") || "",
      amount: formData.get("amount") || "",
      notes: formData.get("notes") || "",
    };
    try {
      setFormStatus(financeFormStatus, "שומר רשומה...");
      await postJson("/finance", payload);
      currentFinance = [...currentFinance, payload];
      renderFinanceSection();
      await loadFromApi();
      setFormStatus(financeFormStatus, "הרשומה נשמרה בהצלחה.", "success");
      financeForm.reset();
      ensureUniqueAutoId(
        financeForm.querySelector("[name='id']"),
        currentFinance
      );
      setActiveSection("finance");
    } catch (error) {
      setFormStatus(
        financeFormStatus,
        "שמירת הרשומה נכשלה. ודא שהשרת פועל ושהחיבור ל-API זמין.",
        "error"
      );
      console.warn("Failed to save finance record.", error);
    }
  });
}

if (clientForm) {
  clientForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const clientId = ensureAutoId(
      clientForm.querySelector("[name='id']"),
      currentClients
    );
    const payload = buildClientPayload(new FormData(clientForm));
    try {
      setFormStatus(clientFormStatus, "שומר לקוח...");
      if (recordExistsById(currentClients, clientId)) {
        await putJson(`/clients/${clientId}`, payload);
      } else {
        await postJson("/clients", payload);
      }
      await loadFromApi();
      setFormStatus(clientFormStatus, "פרטי הלקוח נשמרו בהצלחה.", "success");
    } catch (error) {
      setFormStatus(
        clientFormStatus,
        "שמירת הלקוח נכשלה. ודא שהשרת פועל ושהחיבור ל-API זמין.",
        "error"
      );
      console.warn("Failed to save client record.", error);
    }
  });
}

if (staffTableContainer) {
  staffTableContainer.addEventListener("change", (event) => {
    const target = event.target;
    if (target && target.name === "staff-selected") {
      const record = JSON.parse(target.dataset.record || "{}");
      fillStaffForm(record);
      staffForm?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

if (clientsTable) {
  clientsTable.addEventListener("change", (event) => {
    const target = event.target;
    if (target && target.name === "client-selected") {
      const record = JSON.parse(target.dataset.record || "{}");
      fillClientForm(record);
      clientForm?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}


document.querySelectorAll("[data-action='add-staff']").forEach((button) => {
  button.addEventListener("click", () => {
    staffForm?.reset();
    fillStaffForm({});
    ensureAutoId(staffForm?.querySelector("[name='id']"), currentStaff);
    setFormStatus(staffFormStatus);
    staffForm?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.querySelectorAll("[data-action='edit-staff']").forEach((button) => {
  button.addEventListener("click", () => {
    const selected = staffTableContainer?.querySelector(
      "input[name='staff-selected']:checked"
    );
    if (selected) {
      fillStaffForm(JSON.parse(selected.dataset.record || "{}"));
      staffForm?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

document.querySelectorAll("[data-action='add-client']").forEach((button) => {
  button.addEventListener("click", () => {
    clientForm?.reset();
    fillClientForm({});
    ensureAutoId(clientForm?.querySelector("[name='id']"), currentClients);
    setFormStatus(clientFormStatus);
    clientForm?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.querySelectorAll("[data-action='finance-add']").forEach((button) => {
  button.addEventListener("click", () => {
    financeForm?.reset();
    ensureUniqueAutoId(financeForm?.querySelector("[name='id']"), currentFinance);
    setFormStatus(financeFormStatus);
    financeForm?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.querySelectorAll("[data-action='edit-client']").forEach((button) => {
  button.addEventListener("click", () => {
    const selected = clientsTable?.querySelector(
      "input[name='client-selected']:checked"
    );
    if (selected) {
      fillClientForm(JSON.parse(selected.dataset.record || "{}"));
      clientForm?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

document.querySelectorAll("[data-action='new-transplant']").forEach((button) => {
  button.addEventListener("click", () => {
    transplantForm?.reset();
    ensureAutoId(transplantForm?.querySelector("[name='id']"), currentTransplants);
    setFormStatus(transplantFormStatus);
    transplantForm?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.querySelectorAll("[data-action='transplant-summary']").forEach((button) => {
  button.addEventListener("click", () => {
    transplantForm?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

loadFromApi();
