let allItems = [];

// fetch("http://localhost:5000/api/proxy?query=kurkure")
//     .then((res) => res.json())
//     .then((data) => {
//         data.forEach((group) => {
//             group.data.forEach((item) => {
//                 allItems.push(item);
//             });
//         });

//         renderItems(allItems);
//     })
//     .catch((err) => console.error("Error:", err));

function renderItems(items) {
    const container = document.getElementById("container");
    container.innerHTML = "";

    items.forEach((item) => {
        const card = document.createElement("div");
        card.classList.add("card");

        const image = item.images?.[0] || "";
        const platform = item.platform?.name || "Unknown";
        const platformIcon = item.platform?.icon || "";
        const price = item.offer_price ?? item.mrp;

        card.innerHTML = `
      <img src="${image}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p><strong>Brand:</strong> ${item.brand}</p>
      <p><strong>Quantity:</strong> ${item.quantity || "N/A"}</p>
      <p><strong>Price:</strong> ₹${price}</p>
      <p>
        <img src="${platformIcon}" alt="${platform}"> ${platform}
      </p>
      <a href="${item.deeplink}" target="_blank">Buy Now</a>
    `;

        container.appendChild(card);
    });
}

// 🔍 Search functionality
document.getElementById("searchBar").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const keyword = e.target.value.toLowerCase().trim();
    if (keyword === "") return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        fetch(`http://localhost:5000/api/proxy?query=${encodeURIComponent(keyword)}&lat=${lat}&lon=${lon}`)
          .then((res) => res.json())
          .then((data) => {
            allItems = []; // Clear old results
            data.forEach((group) => {
              group.data.forEach((item) => {
                allItems.push(item);
              });
            });

            renderItems(allItems);
          })
          .catch((err) => console.error("Error:", err));
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Please allow location access to search nearby results.");
      }
    );
  }
});

