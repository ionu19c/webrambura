document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("stayForm");
  const resultsDiv = document.getElementById("results");
  const resultsPage = document.getElementById("resultsPage");
  const searchPage = document.getElementById("searchPage");
  const backBtn = document.getElementById("backBtn");
  const errorBox = document.getElementById("errorMessage");

  const hotels = [
    { name: "Budget Inn", category: "💸 Smart Saver", price: 80, rating: 7.8 },
    { name: "Saver Stay", category: "💸 Smart Saver", price: 75, rating: 8.1 },
    { name: "Value Lodge", category: "💸 Smart Saver", price: 85, rating: 7.5 },
    { name: "Urban Rest", category: "⚖️ Balanced Choice", price: 110, rating: 8.6 },
    { name: "Comfort Square", category: "⚖️ Balanced Choice", price: 105, rating: 8.2 },
    { name: "MidTown Hotel", category: "⚖️ Balanced Choice", price: 115, rating: 8.9 },
    { name: "Grand Brambura", category: "💎 Premium Escape", price: 160, rating: 9.2 },
    { name: "Royal Retreat", category: "💎 Premium Escape", price: 180, rating: 9.0 },
    { name: "Luxury Loft", category: "💎 Premium Escape", price: 175, rating: 8.7 }
  ];

  const categories = [
    { name: "💸 Smart Saver", label: "Smart Saver", sort: (a, b) => a.price - b.price },
    { name: "⚖️ Balanced Choice", label: "Balanced", sort: (a, b) => a.price - b.price },
    { name: "💎 Premium Escape", label: "Premium", sort: (a, b) => b.price - a.price }
  ];

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const dest = document.getElementById("dest").value;
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

    resultsDiv.innerHTML = "";
    const formatDate = d => `${d.getDate().toString().padStart(2, "0")}.${(d.getMonth() + 1).toString().padStart(2, "0")}`;

    categories.forEach(cat => {
      const matching = hotels.filter(h => h.category === cat.name).sort(cat.sort);
      const selected = matching.slice(0, maxHotels);
      if (selected.length === 0) return;

      const perHotelNights = Math.floor(totalNights / selected.length);
      const extra = totalNights % selected.length;
      let currentStart = new Date(dateFrom);
      let categoryOutput = `<h2>${cat.name} – ${cat.label}</h2>`;
      let categoryCost = 0;

      selected.forEach((hotel, i) => {
        const nights = perHotelNights + (i < extra ? 1 : 0);
        const endDate = new Date(currentStart);
        endDate.setDate(currentStart.getDate() + nights);

        const subtotal = hotel.price * nights * persons;
        categoryCost += subtotal;

        const ratingLabel = getRatingLabel(hotel.rating);
        categoryOutput += `
          <div>
            <div class="rating ${ratingLabel.class}">⭐ ${hotel.rating} – ${ratingLabel.text}</div>
            <h3>${hotel.name}</h3>
            <p>📍 ${dest}</p>
            <p>🗓️ ${formatDate(currentStart)} → ${formatDate(endDate)} (${nights} nights)</p>
            <p>💶 ${hotel.price}€/night × ${nights} × ${persons} guest(s) = <strong>${subtotal}€</strong></p>
          </div><hr/>
        `;
        currentStart = endDate;
      });

      categoryOutput += `<h3>💰 Total for ${cat.label}: ${categoryCost}€</h3><br/>`;
      resultsDiv.innerHTML += categoryOutput;
    });

    searchPage.style.display = "none";
    resultsPage.style.display = "block";
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
    if (score >= 7.0) return { text: " [A](https://github.com/Ronnie434/30-days-of-React/tree/22142106cb46f717a1259f84227cc90ed7fe50cc/02_Day_Introduction_to_React%2F02_introduction_to_react.md?copilot_analytics_metadata=eyJldmVudEluZm9fY2xpY2tTb3VyY2UiOiJjaXRhdGlvbkxpbmsiLCJldmVudEluZm9fbWVzc2FnZUlkIjoiNGExYmV2VEFxODRlSmpEOGl6SDM4IiwiZXZlbnRJbmZvX2NsaWNrRGVzdGluYXRpb24iOiJodHRwczpcL1wvZ2l0aHViLmNvbVwvUm9ubmllNDM0XC8zMC1kYXlzLW9mLVJlYWN0XC90cmVlXC8yMjE0MjEwNmNiNDZmNzE3YTEyNTlmODQyMjdjYzkwZWQ3ZmU1MGNjXC8wMl9EYXlfSW50cm9kdWN0aW9uX3RvX1JlYWN0JTJGMDJfaW50cm9kdWN0aW9uX3RvX3JlYWN0Lm1kIiwiZXZlbnRJbmZvX2NvbnZlcnNhdGlvbklkIjoiUWJ5dzJGamdnc2dQcVNMTUtIaTd4In0%3D&citationMarker=9F742443-6C92-4C44-BF58-8F5A7C53B6F1)
