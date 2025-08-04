document
  .getElementById("activityForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const institute = document.getElementById("institute").value.trim();
    const water = parseFloat(document.getElementById("water").value);

    if (!institute || isNaN(water)) {
      alert("Please enter valid institute and water usage");
      return;
    }

    const res = await fetch("/api/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ institute, water }),
    });

    const data = await res.json();
    if (data.success) {
      document.getElementById("institute").value = "";
      document.getElementById("water").value = "";
      loadActivities();
    }
  });

async function loadActivities() {
  const res = await fetch("/api/activities");
  const data = await res.json();

  const list = document.getElementById("activityList");
  list.innerHTML = "";

  data.activities.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `🏫 ${item.institute} — 💧 ${item.water} L 
      <button onclick="deleteActivity(${index})" class="red"><i class="fa-solid fa-trash"></i></button>`;
    list.appendChild(li);
  });
  document.getElementById("totalEntries").textContent = data.activities.length;
}

async function deleteActivity(index) {
  const res = await fetch(`/api/activities/${index}`, { method: "DELETE" });
  const data = await res.json();
  if (data.success) loadActivities();
}

loadActivities();

