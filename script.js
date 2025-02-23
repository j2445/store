/* script.js */

// Preloader runtime set to 3 seconds
window.addEventListener("load", function () {
    setTimeout(function () {
      const preloader = document.getElementById("preloader");
      preloader.classList.add("fade-out");
      setTimeout(function () {
        preloader.style.display = "none";
        document.getElementById("content-wrapper").style.display = "block";
        document.body.classList.remove("loading");
      }, 800);
    }, 1000);
  });
  
  // Google Sheets Deals Setup
  const sheetURL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQHnHu0HrvLs3a7TrYvc90IDAZC72BO4ciXOSG6HkfkIhCtHhNRNtRGbzJM0Vue-W04VWGcLjo4IKgN/pub?output=csv";
  let currentPage = 1;
  const itemsPerPage = 100;
  let allDeals = [];
  let filteredDeals = [];
  let categories = [];
  
  async function fetchDeals() {
    try {
      const response = await fetch(sheetURL);
      const data = await response.text();
      const rows = data.split("\n").slice(1);
      allDeals = rows
        .map((row) => {
          const cols = row.replace(/\r/g, "").split(",");
          if (cols.length < 10) return null;
          let [id, category, store, title, salePrice, regularPrice, savings, discount, image1, link] =
            cols.map((col) => col.trim());
          if (category && !categories.includes(category)) {
            categories.push(category);
          }
          return { id, category, store, title, salePrice, regularPrice, savings, discount, image1, link };
        })
        .filter((deal) => deal !== null);
  
      populateCategoryFilter();
      filteredDeals = [...allDeals];
      renderDeals();
      renderPagination();
    } catch (error) {
      console.error("Error fetching the deals:", error);
    }
  }
  
  fetchDeals();
  
  // Populate category dropdown
  function populateCategoryFilter() {
    const categoryFilter = document.getElementById("categoryFilter");
    categories.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      categoryFilter.appendChild(option);
    });
  }
  
  // Render deals in the grid
  function renderDeals() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const dealsToShow = filteredDeals.slice(start, end);
    let dealsHTML = "";
    dealsToShow.forEach((deal) => {
      const { image1, title, salePrice, regularPrice, discount, link } = deal;
      dealsHTML += `
        <div class="card">
          <div class="discount">${discount}</div>
          <img src="${image1}" alt="${title}">
          <h3>${title}</h3>
          <p class="price">${salePrice} <span class="old-price">${regularPrice}</span></p>
          <p class="rating">★★★★☆</p>
          <div class="card-actions">
            <a href="${link}" target="_blank">BUY NOW</a>
          </div>
        </div>
      `;
    });
    document.getElementById("deals-container").innerHTML = dealsHTML;
    window.scrollTo(0, 0);
  }
  
  // Render pagination buttons
  function renderPagination() {
    const pageCount = Math.ceil(filteredDeals.length / itemsPerPage);
    let paginationHTML = "";
    if (currentPage > 1) {
      paginationHTML += `<button onclick="changePage(${currentPage - 1})">Previous</button>`;
    }
    for (let i = 1; i <= pageCount; i++) {
      paginationHTML += `<button onclick="changePage(${i})" ${i === currentPage ? "disabled" : ""}>${i}</button>`;
    }
    if (currentPage < pageCount) {
      paginationHTML += `<button onclick="changePage(${currentPage + 1})">Next</button>`;
    }
    document.getElementById("pagination").innerHTML = paginationHTML;
  }
  
  // Pagination handler
  function changePage(page) {
    currentPage = page;
    renderDeals();
    renderPagination();
  }
  
  // Filter deals by search
  function searchDeals() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    const selectedCategory = document.getElementById("categoryFilter").value;
    filteredDeals = allDeals.filter((deal) => {
      const matchesSearch = deal.title.toLowerCase().includes(searchTerm);
      const matchesCategory = !selectedCategory || deal.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    currentPage = 1;
    renderDeals();
    renderPagination();
  }
  
  // Filter deals by category
  function filterCategory() {
    searchDeals();
  }
// Fetch and display top deals
function fetchTopDeals() {
  const topDeals = allDeals.slice(0, 10); // Assuming top 10 deals
  renderTopDeals(topDeals);
}

function renderTopDeals(deals) {
  let topDealsHTML = "";
  deals.forEach((deal) => {
    const { image1, title, salePrice, regularPrice, discount, link } = deal;
    topDealsHTML += `
      <div class="card">
        <div class="discount">${discount}</div>
        <img src="${image1}" alt="${title}">
        <h3>${title}</h3>
        <p class="price">${salePrice} <span class="old-price">${regularPrice}</span></p>
        <p class="rating">★★★★☆</p>
        <div class="card-actions">
          <a href="${link}" target="_blank">BUY NOW</a>
        </div>
      </div>
    `;
  });
  document.getElementById("top-deals-container").innerHTML = topDealsHTML;
}

function autoScrollDeals() {
  const container = document.getElementById('top-deals-container');
  let currentIndex = 0;
  const deals = container.children;
  const totalDeals = deals.length;
  function showNextDeal() {
    // Hide current deal
    deals[currentIndex].style.display = 'none';
    // Move to the next deal
    currentIndex = (currentIndex + 1) % totalDeals;
    // Show next deal
    deals[currentIndex].style.display = 'block';
  }
  // Initially hide all deals except the first one
  for (let i = 1; i < totalDeals; i++) {
    deals[i].style.display = 'none';
  }
  // Set interval to show next deal every 3 seconds
  setInterval(showNextDeal, 3000);
}
// Call autoScrollDeals after the deals are populated
fetchDeals().then(() => {
  fetchTopDeals();
  autoScrollDeals();
});
  