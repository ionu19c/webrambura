document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("stayForm");
  const resultsDiv = document.getElementById("results");
  const resultsPage = document.getElementById("resultsPage");
  const searchPage = document.getElementById("searchPage");
  const backBtn = document.getElementById("backBtn");

  const hotels = [
    { name: "Budget Inn", category: "💸 Smart Saver", price: 80 },
    { name: "Saver Stay", category: "💸 Smart Saver", price: 75 },
    { name: "Urban Rest", category: "⚖️ Balanced Choice", price: 110 },
    { name: "Comfort Square", category: "⚖️ Balanced Choice", price: 105 },
    { name: "Grand Brambura", category: "💎 Premium Escape", price: 160 },
    { name: "Royal Retreat", category: "💎 Premium Escape", price: 180 }
  ];

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const dest = document.getElementById("dest").value;
    const dateFrom = new Date(document.getElementById("dateFrom").value);
    const dateTo = new Date(document.getElementById("dateTo").value);
    const persons = parseInt(document.getElementById("persons").value);

    const oneDay = 1000 * 60 * 60 * 24;
    const totalNights = Math.round((dateTo - dateFrom) / oneDay);

    if (totalNights < 1 || isNaN(persons)) {
      alert("Date invalide sau perioadă prea scurtă.");
      return;
    }

    // Selectăm câte un hotel din fiecare categorie (cel mai ieftin)
    const categories = ["💸 Smart Saver", "⚖️ Balanced Choice", "💎 Premium Escape"];
    const selectedHotels = categories.map(cat =>
      hotels
        .filter(h => h.category === cat)
        .sort((a, b) => a.price - b.price)[0]
    ).filter(Boolean); // exclude undefined dacă o categorie lipsește

    const hotelCount = selectedHotels.length;
    const baseNights = Math.floor(totalNights / hotelCount);
    const remainder = totalNights % hotelCount;

    let currentStart = new Date(dateFrom);
    let totalCost = 0;
    let output = "";

    const format = d => `${d.getDate().toString().padStart(2, "0")}.${(d.getMonth() + 1).toString().padStart(2, "0")}`;

    selectedHotels.forEach((hotel, i) => {
      const stayNights = baseNights + (i < remainder ? 1 : 0);
      const endDate = new Date(currentStart);
      endDate.setDate(currentStart.getDate() + stayNights);

      const subtotal = hotel.price * stayNights * persons;
      totalCost += subtotal;

      output += `
        <div>
          <h3>${hotel.category}</h3>
          <p><strong>${hotel.name}</strong> in ${dest}</p>
          <p>🗓️ ${format(currentStart)} → ${format(endDate)} (${stayNights} nopți)</p>
          <p>💶 ${hotel.price}€/noapte × ${stayNights} nopți × ${persons} pers. = <strong>${subtotal}€</strong></p>
        </div>
        <hr/>
      `;

      currentStart = endDate;
    });

    output += `<h3>💰 Total estimativ: ${totalCost}€</h3>`;

    resultsDiv.innerHTML = output;
    searchPage.style.display = "none";
    resultsPage.style.display = "block";
  });

  backBtn.addEventListener("click", function () {
    resultsPage.style.display = "none";
    searchPage.style.display = "block";
  });
});
