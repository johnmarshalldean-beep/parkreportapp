const API_URL = "http://localhost:3000/api/reports";
const completedList = document.getElementById("completedList");

async function loadCompleted() {
  completedList.innerHTML = '<div class="empty">Loading completed reports...</div>';
  const response = await fetch(`${API_URL}?status=completed`);
  const reports = await response.json();

  if (reports.length === 0) {
    completedList.innerHTML = '<div class="empty">No completed reports yet.</div>';
    return;
  }

  completedList.innerHTML = reports.map(report => {
    const priorityClass = report.priority.toLowerCase();
    return `
      <article class="report-card ${priorityClass}">
        <h3>${escapeHtml(report.park_name)}</h3>
        <p><strong>Employee:</strong> ${escapeHtml(report.employee_name)}</p>
        <p><strong>Priority:</strong> ${escapeHtml(report.priority)}</p>
        <p>${escapeHtml(report.description)}</p>
        <p class="meta">Submitted: ${new Date(report.created_at).toLocaleString()}</p>
        <p class="meta">Completed: ${new Date(report.completed_at).toLocaleString()}</p>
        ${report.photo_url ? `<img src="${report.photo_url}" alt="Report photo" />` : ""}
      </article>
    `;
  }).join("");
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

loadCompleted();
