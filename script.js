// Preloader
window.addEventListener('load', function() {
    window.scrollTo(0, 0);
    
    setTimeout(function() {
        document.getElementById('preloader').style.display = 'none';
    }, 900);
});


  // Navigation Toggle
  document.querySelector('.burger').addEventListener('click', toggleNav);
  document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
          if (window.innerWidth <= 768) {
              document.querySelector('.nav-links').classList.remove('active');
              document.querySelector('.burger').classList.remove('active');
          }
      });
  });
  
  function toggleNav() {
      document.querySelector('.nav-links').classList.toggle('active');
      document.querySelector('.burger').classList.toggle('active');
  }
  
  document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', function(e) {
          e.preventDefault();
          const targetId = this.getAttribute('href');
          const targetSection = document.querySelector(targetId);
          const navHeight = document.querySelector('.navbar').offsetHeight;
          const targetPosition = targetSection.offsetTop - navHeight;
          
          window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
          });
  
          // Close mobile menu if open
          if (window.innerWidth <= 768) {
              document.querySelector('.nav-links').classList.remove('active');
              document.querySelector('.burger').classList.remove('active');
          }
      });
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
  
  
          // Scroll to Top Button
          const scrollBtn = document.querySelector('.scroll-to-top');
  
  window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
          scrollBtn.classList.add('active');
      } else {
          scrollBtn.classList.remove('active');
      }
  });
  
  scrollBtn.addEventListener('click', () => {
      window.scrollTo({
          top: 0,
          behavior: 'smooth'
      });
  });

// Theme Toggle Functionality
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    if (document.body.classList.contains('dark-theme')) {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    } else {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    
    // Save theme preference
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
});

// Load saved theme preference
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
}



    // Deal Modal Functions
    function showDealDetails(deal) {
        const modal = document.getElementById('dealModal');
        const modalContent = document.getElementById('dealModalContent');
        
        // Prevent body scroll when modal is open
        document.body.classList.add('no-scroll');
        
        // Add state to browser history when opening modal
        history.pushState({ modal: 'deal' }, '');
        
        modalContent.innerHTML = `
            <img src="${deal.image1}" alt="${deal.title}">
            <h2>${deal.title}</h2>
            <div class="deal-details">
                <div class="price-info">
                    <strong>Sale Price:</strong> ${deal.salePrice}
                    <span class="old-price">${deal.regularPrice}</span>
                </div>
                <p><strong>Store:</strong> ${deal.store}</p>
                <p><strong>Category:</strong> ${deal.category}</p>
                <p><strong>Discount:</strong> ${deal.discount}</p>
                <p><strong>Savings:</strong> ${deal.savings}</p>
                <a href="${deal.link}" target="_blank" class="card-actions">
                    <button style="background: #ff5733; color: #fff; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                        BUY NOW
                    </button>
                </a>
            </div>
        `;
        
        modal.style.display = 'block';
    }

    function closeModal() {
        const modal = document.getElementById('dealModal');
        modal.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }

    // Close modal when clicking the close button or outside the modal
    document.querySelector('.deal-modal-close').onclick = function() {
        closeModal();
    }

    window.onclick = function(event) {
        const modal = document.getElementById('dealModal');
        if (event.target == modal) {
            closeModal();
        }
    }

    // Handle back button
    window.addEventListener('popstate', function(event) {
        if (document.getElementById('dealModal').style.display === 'block') {
            closeModal();
        }
    });



    
function renderDeals() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const dealsToShow = filteredDeals.slice(start, end);

    let dealsHTML = "";
    dealsToShow.forEach((deal) => {
        const { image1, title, salePrice, regularPrice, discount, link } = deal;
        dealsHTML += `
            <div class="card" onclick="showDealDetails(${JSON.stringify(deal).replace(/"/g, '&quot;')})">
                <div class="discount">${discount}</div>
                <img src="${image1}" alt="${title}">
                <h3>${title}</h3>
                <p class="price">${salePrice} <span class="old-price">${regularPrice}</span></p>
                <p class="rating">★★★★☆</p>
                <div class="card-actions">
                    <a href="${link}" target="_blank" onclick="event.stopPropagation()">BUY NOW</a>
                </div>
            </div>
        `;
    });

    document.getElementById("deals-container").innerHTML = dealsHTML;
}

// Counter Animation for Statistics
function animateCounters() {
    setTimeout(() => {
        const counters = document.querySelectorAll('.stat-number');
        const speed = 200; // Animation speed - lower is faster

        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const increment = target / speed;

            const updateCount = () => {
                const count = +counter.innerText;
                if (count < target) {
                    counter.innerText = Math.ceil(count + increment);
                    setTimeout(updateCount, 1);
                } else {
                    counter.innerText = target + '+';
                }
            };

            updateCount();
        });
    }, 2000); // 2 seconds delay
}

// Trigger animation when the about section is in view
const aboutSection = document.querySelector('.about-section');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

observer.observe(aboutSection);