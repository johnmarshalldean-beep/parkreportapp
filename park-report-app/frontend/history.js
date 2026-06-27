const API_URL = "http://localhost:3000/api/reports";
const historyList = document.getElementById("historyList");
const searchInput = document.getElementById("searchInput");
const priorityFilter = document.getElementById("priorityFilter");
const refreshBtn = document.getElementById("refreshBtn");
let reports = [];

async function loadReports() {
  historyList.innerHTML = '<div class="empty">Loading reports...</div>';
  const response = await fetch(`${API_URL}?status=open`);
  reports = await response.json();
  renderReports();
}

function renderReports() {
  const search = searchInput.value.toLowerCase();
  const priority = priorityFilter.value;

  const filtered = reports.filter(report => {
    const text = `${report.employee_name} ${report.park_name} ${report.description}`.toLowerCase();
    const matchesText = text.includes(search);
    const matchesPriority = !priority || report.priority === priority;
    return matchesText && matchesPriority;
  });

  if (filtered.length === 0) {
    historyList.innerHTML = '<div class="empty">No open reports found.</div>';
    return;
  }

  historyList.innerHTML = filtered.map(report => reportCard(report, true)).join("");
}

function reportCard(report, showComplete) {
  const priorityClass = report.priority.toLowerCase();
  return `
    <article class="report-card ${priorityClass}">
      <h3>${escapeHtml(report.park_name)}</h3>
      <p><strong>Employee:</strong> ${escapeHtml(report.employee_name)}</p>
      <p><strong>Priority:</strong> ${escapeHtml(report.priority)}</p>
      <p>${escapeHtml(report.description)}</p>
      <p class="meta">Submitted: ${new Date(report.created_at).toLocaleString()}</p>
      ${report.photo_url ? `<img src="${report.photo_url}" alt="Report photo" />` : ""}
      <div class="actions">
        ${showComplete ? `<button class="complete-btn" onclick="markComplete('${report.id}')">Mark Complete</button>` : ""}
        <button class="delete-btn" onclick="deleteReport('${report.id}')">Delete</button>
      </div>
    </article>
  `;
}

async function markComplete(id) {
  await fetch(`${API_URL}/${id}/complete`, { method: "PATCH" });
  await loadReports();
}

async function deleteReport(id) {
  if (!confirm("Delete this report?")) return;
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  await loadReports();
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

searchInput.addEventListener("input", renderReports);
priorityFilter.addEventListener("change", renderReports);
refreshBtn.addEventListener("click", loadReports);
loadReports();
