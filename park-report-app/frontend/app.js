const API_URL = "http://localhost:3000/api/reports";
const form = document.getElementById("reportForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "Submitting report...";

  const formData = new FormData();
  formData.append("employee_name", document.getElementById("employeeName").value.trim());
  formData.append("park_name", document.getElementById("parkName").value);
  formData.append("priority", document.getElementById("priority").value);
  formData.append("description", document.getElementById("description").value.trim());
  formData.append("photo", document.getElementById("photo").files[0]);

  try {
    const response = await fetch(API_URL, { method: "POST", body: formData });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Something went wrong.");
    form.reset();
    message.textContent = "Report submitted successfully.";
  } catch (error) {
    message.textContent = error.message;
  }
});
