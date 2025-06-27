document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("stayForm");
  const resultsDiv = document.getElementById("results");
  const resultsPage = document.getElementById("resultsPage");
  const searchPage = document.getElementById("searchPage");
  const backBtn = document.getElementById("backBtn");
  const errorBox = document.getElementById("errorMessage");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const dest = document.getElementById("dest").value.trim().toUpperCase();
    const dateFrom = new Date(document.getElementById("dateFrom").value);
    const dateTo = new Date(document.getElementById("dateTo").value);
    const persons = parseInt(document.getElementById("persons").value);
    const maxHotels = parseInt(document.getElementById("maxHotels").value);
    const oneDay = 1000 * 60 * 60 * 24;
    const totalNights = Math.round((dateTo - dateFrom) / oneDay);

    if (totalNights < 1 || isNaN(persons) || isNaN(maxHotels)) {
      errorBox.textContent = "Please enter a valid date range and number of guests.";
      errorBox.style.display = "block";
      return;
    } else {
      errorBox.style.display = "none";
    }

    resultsDiv.innerHTML = `<p>Loading hotel results for ${dest}...</p>`;

    const formatDate = d =>
      `${d.getDate().toString().padStart(2, "0")}.${(d.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;

    const apiUrl = `https://brambura-server.onrender.com/api/hotels?city=${dest}&checkIn=${dateFrom.toISOString().split("T")[0]}&checkOut=${dateTo.toISOString().split("T")[0]}&adults=${persons}`;

    try {
      const res = await fetch(apiUrl);
      const data = await res.json();

      if (data.error || !data.data || data.data.length === 0) {
        resultsDiv.innerHTML = `<p>😔 No hotels found for ${dest} between ${formatDate(dateFrom)} and ${formatDate(dateTo)}.</p>`;
        return;
      }

      const hotels = data.data.slice(0, maxHotels);
      resultsDiv.innerHTML = "";

      let markerData = [];

      hotels.forEach((hotel, i) => {
        const name = hotel.hotel.name || "Unnamed Hotel";
        const lat = hotel.hotel.latitude;
        const lng = hotel.hotel.longitude;
        const image = hotel.hotel.media?.[0]?.uri || "images/placeholder.jpeg";
        const nights = totalNights;
        const subtotal = hotel.offers?.[0]?.price?.total || "N/A";
        const currency = hotel.offers?.[0]?.price?.currency || "EUR";
        const rating = hotel.hotel.rating || 7.5;
        const ratingInfo = getRatingLabel(rating);

        resultsDiv.innerHTML += `
          <div>
            <img src="${image}" alt="${name}" class="hotel-image" />
            <div class="rating ${ratingInfo.class}">⭐ ${rating} – ${ratingInfo.text}</div>
            <h3>${name}</h3>
            <p>📍 ${dest}</p>
            <p>🗓️ ${formatDate(dateFrom)} → ${formatDate(dateTo)} (${nights} nights)</p>
            <p>💶 ${subtotal} ${currency} total for ${persons} guest(s)</p>
          </div><hr/>`;

        if (lat && lng) {
          markerData.push({ lat, lng, name });
        }
      });

      if (markerData.length > 0) {
        const mapId = "map-hotels";
        resultsDiv.innerHTML += `<div id="${mapId}" class="category-map"></div>`;
        setTimeout(() => {
          const center = markerData[0];
          const map = L.map(mapId).setView([center.lat, center.lng], 14);
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);
          markerData.forEach(m => {
            L.marker([m.lat, m.lng]).addTo(map).bindPopup(m.name);
          });
        }, 0);
      }

      searchPage.style.display = "none";
      resultsPage.style.display = "block";

    } catch (err) {
      console.error("API error:", err);
      resultsDiv.innerHTML = `<p>🚨 An error occurred while fetching hotel data. Please try again later.</p>`;
    }
  });

  document.querySelectorAll(".step-btn").forEach(button => {
    button.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      const input = document.getElementById(targetId);
      let value = parseInt(input.value) || 1;

      if (this.dataset.action === "increase") {
        if (targetId === "maxHotels" && value >= 5) return;
        input.value = value + 1;
      } else {
        if (value > 1) input.value = value - 1;
      }
    });
  });

  backBtn.addEventListener("click", function () {
    resultsPage.style.display = "none";
    searchPage.style.display = "block";
  });

  function getRatingLabel(score) {
    if (score >= 9.0) return { text: "Excellent", class: "excellent" };
    if (score >= 8.0) return { text: "Very Good", class: "very-good" };
    if (score >= 7.0) return { text: "Good", class: "good" };
    return { text: "Average", class: "average" };
  }
});
