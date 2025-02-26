// Preloader
window.addEventListener('load', function() {
    setTimeout(function() {
        document.getElementById('preloader').style.display = 'none';
    }, 2000);
});

// Navigation Toggle
document.querySelector('.burger').addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('active');
});

// Constants and Global Variables
const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQHnHu0HrvLs3a7TrYvc90IDAZC72BO4ciXOSG6HkfkIhCtHhNRNtRGbzJM0Vue-W04VWGcLjo4IKgN/pub?output=csv";
let currentPage = 1;
const itemsPerPage = 100;
let allDeals = [];
let filteredDeals = [];
let categories = [];

// Fetch and Process Deals Data
async function fetchDeals() {
    try {
        const response = await fetch(sheetURL);
        const data = await response.text();
        const rows = data.split("\n").slice(1);

        // Process each row of deal data
        allDeals = rows
            .map((row) => {
                const cols = row.replace(/\r/g, "").split(",");
                if (cols.length < 10) return null;

                let [id, category, store, title, salePrice, regularPrice, savings, discount, image1, link] = cols.map((col) => col.trim());

                // Build categories list
                if (category && !categories.includes(category)) {
                    categories.push(category);
                }

                return { id, category, store, title, salePrice, regularPrice, savings, discount, image1, link };
            })
            .filter((deal) => deal !== null);

        // Initialize the page
        populateCategoryFilter();
        filteredDeals = [...allDeals];
        renderDeals();
        renderPagination();
    } catch (error) {
        console.error("Error fetching the deals:", error);
    }
}

// Populate Category Filter Dropdown
function populateCategoryFilter() {
    const categoryFilter = document.getElementById("categoryFilter");
    categories.forEach((cat) => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);
    });
}

// Render Deals Grid
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

// Render Pagination Controls
function renderPagination() {
    const pageCount = Math.ceil(filteredDeals.length / itemsPerPage);
    let paginationHTML = "";

    // Previous button
    if (currentPage > 1) {
        paginationHTML += `<button onclick="changePage(${currentPage - 1})">Previous</button>`;
    }

    // Page numbers
    for (let i = 1; i <= pageCount; i++) {
        paginationHTML += `<button onclick="changePage(${i})" ${i === currentPage ? "disabled" : ""}>${i}</button>`;
    }

    // Next button
    if (currentPage < pageCount) {
        paginationHTML += `<button onclick="changePage(${currentPage + 1})">Next</button>`;
    }

    document.getElementById("pagination").innerHTML = paginationHTML;
}

// Handle Page Changes
function changePage(page) {
    currentPage = page;
    renderDeals();
    renderPagination();
}

// Search Functionality
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

// Category Filter Handler
function filterCategory() {
    searchDeals();
}

// Privacy Policy Modal Functions
function openPrivacyPolicy() {
    document.getElementById('privacyModal').style.display = 'flex';
}

function closePrivacyPolicy() {
    document.getElementById('privacyModal').style.display = 'none';
}

// Subscribe
function submitEmail() {
    var email = document.getElementById("emailInput").value.trim();

    // Basic email validation
    if (!email || !email.includes("@") || !email.includes(".")) {
        alert("Please enter a valid email address.");
        return;
    }

    fetch("https://script.google.com/macros/s/AKfycbyzRikSTgCjfAEn9O3dpNe3oUEdNCeCzbqEvXhAqOIaHkCsuSYKcl3Ky8sdrqrHPoos/exec", {
        method: "POST",
        body: JSON.stringify({ email: email }),
        headers: { "Content-Type": "application/json" }
    })
    .then(response => response.text())
    .then(data => {
        if (data.includes("Success")) {
            alert("Subscribed Successfully!");
            document.getElementById("emailInput").value = ""; // Clear input field
        } else {
            alert("Error: " + data);
        }
    })
    .catch(error => {
        alert("Request failed! Check console for details.");
        console.error(error);
    });
}

// Initialize the application
fetchDeals();
