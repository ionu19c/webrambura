document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("stayForm");
  const resultsDiv = document.getElementById("results");
  const resultsPage = document.getElementById("resultsPage");
  const searchPage = document.getElementById("searchPage");
  const backBtn = document.getElementById("backBtn");
  const errorBox = document.getElementById("errorMessage");

  const hotels = [
    { name: "Budget Inn", category: "💸 Smart Saver", price: 80 },
    { name: "Saver Stay", category: "💸 Smart Saver", price: 75 },
    { name: "Value Lodge", category: "💸 Smart Saver", price: 85 },
    { name: "Urban Rest", category: "⚖️ Balanced Choice", price: 110 },
    { name: "Comfort Square", category: "⚖️ Balanced Choice", price: 105 },
    { name: "MidTown Hotel", category: "⚖️ Balanced Choice", price: 115 },
    { name: "Grand Brambura", category: "💎 Premium Escape", price: 160 },
    { name: "Royal Retreat", category: "💎 Premium Escape", price: 180 },
    { name: "Luxury Loft", category: "💎 Premium Escape", price: 175 }
  ];

  const categories = [
    { name: "💸 Smart Saver", label: "Smart Saver", sort: (a, b) => a.price - b.price },
    { name: "⚖️ Balanced Choice", label: "Balanced", sort: (a, b) => a.price - b.price },
    { name: "💎 Premium Escape", label: "Premium", sort: (a, b) => b.price - a.price }
  ];

  // Handle form submission
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

        categoryOutput += `
          <div>
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

  // Stepper buttons logic
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

  // Back button
  backBtn.addEventListener("click", function () {
    resultsPage.style.display = "none";
    searchPage.style.display = "block";
  });
});
