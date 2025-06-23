document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("stayForm");
  const resultsDiv = document.getElementById("results");
  const resultsPage = document.getElementById("resultsPage");
  const searchPage = document.getElementById("searchPage");
  const backBtn = document.getElementById("backBtn");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form values
    const dest = document.getElementById("dest").value;
    const dateFrom = document.getElementById("dateFrom").value;
    const dateTo = document.getElementById("dateTo").value;
    const persons = document.getElementById("persons").value;
    const maxHotels = parseInt(document.getElementById("maxHotels").value || "3");

    // Dummy hotels per category
    const hotels = {
      "💸 Smart Saver": ["Budget Inn", "Saver Stay", "Happy Nights"],
      "⚖️ Balanced Choice": ["MidTown Hotel", "Urban Rest", "Comfort Square"],
      "💎 Premium Escape": ["Grand Brambura", "Royal Retreat", "Luxury Loft"]
    };

    resultsDiv.innerHTML = "";
    let count = 0;

    for (const [category, hotelList] of Object.entries(hotels)) {
      if (count >= maxHotels) break;

      const section = document.createElement("div");
      section.innerHTML = `<h3>${category}</h3>`;
      let list = "<ul>";

      for (let h of hotelList) {
        if (count >= maxHotels) break;
        list += `<li><strong>${h}</strong> in ${dest} from ${dateFrom} to ${dateTo} for ${persons} person(s)</li>`;
        count++;
      }

      list += "</ul>";
      section.innerHTML += list;
      resultsDiv.appendChild(section);
    }

    searchPage.style.display = "none";
    resultsPage.style.display = "block";
  });

  backBtn.addEventListener("click", function () {
    resultsPage.style.display = "none";
    searchPage.style.display = "block";
  });
});
