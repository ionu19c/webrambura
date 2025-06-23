document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("stayForm");
  const resultsDiv = document.getElementById("results");
  const resultsPage = document.getElementById("resultsPage");
  const searchPage = document.getElementById("searchPage");
  const backBtn = document.getElementById("backBtn");

  const hotels = [
    { name: "Budget Inn", category: "💸 Smart Saver", price: 80 },
    { name: "Urban Rest", category: "⚖️ Balanced Choice", price: 110 },
    { name: "Grand Brambura", category: "💎 Premium Escape", price: 160 },
    { name: "Comfort Square", category: "⚖️ Balanced Choice", price: 105 },
    { name: "Royal Retreat", category: "💎 Premium Escape", price: 180 },
    { name: "Saver Stay", category: "💸 Smart Saver", price: 75 }
  ];

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form values
    const dest = document.getElementById("dest").value;
    const dateFrom = new Date(document.getElementById("dateFrom").value);
    const dateTo = new Date(document.getElementById("dateTo").value);
    const persons = parseInt(document.getElementById("persons").value);
    const maxHotels = parseInt(document.getElementById("maxHotels").value || "2");

    // Calculate total number of nights
    const oneDay = 1000 * 60 * 60 * 24;
    const totalNights = Math.round((dateTo - dateFrom) / oneDay);
    if (totalNights < 1) {
      alert("Perioada este invalidă.");
      return;
    }

    // Pick N cheapest hotels
    const selectedHotels = [...hotels]
      .sort((a, b) => a.price - b.price)
      .slice(0, maxHotels);

    // Distribute nights equally
    const nightsPerHotel = Math.floor(totalNights / maxHotels);
    const extras = totalNights % maxHotels;

    // Plan builder
    let currentStart = new Date(dateFrom);
    let totalCost = 0;
    let output = "";

    selectedHotels.forEach((hotel, i) => {
      const nights = nightsPerHotel + (i < extras ? 1 : 0);
      const endDate = new Date(currentStart);
      endDate.setDate(currentStart.getDate() + nights);

      const pricePerNight = hotel.price;
      const subtotal = pricePerNight * nights * persons;
      totalCost += subtotal;

      const format = d =>
        `${d.getDate().toString().padStart(2, "0")}.${(d.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`;

      output += `
        <div>
          <h3>${hotel.category} ${hotel.name}</h3>
          <p>🗓️ ${format(currentStart)} → ${format(endDate)} (${nights} nopți)</p>
          <p>💶 ${pricePerNight}€/noapte × ${persons} pers. = <strong>${subtotal}€</strong></p>
        </div>
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
