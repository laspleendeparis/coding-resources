const API_BASE = 'https://cors-anywhere.herokuapp.com/https://udemycoupons-cf36f0d13f8c.herokuapp.com';
let currentSource = 'udemy';
let currentPage = 1;
let totalPages = 1;
let searchTerm = '';

document.querySelectorAll('.source-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.source-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentSource = btn.dataset.source;
        currentPage = 1;
        performSearch();
    });
});

document.getElementById('udemy-search').addEventListener('input', (e) => {
    searchTerm = e.target.value.trim();
});

document.getElementById('udemy-search').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        currentPage = 1;
        performSearch();
    }
});

async function performSearch() {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = '<div class="spinner">Searching...<div>';
    document.body.appendChild(loadingOverlay);

    try {
        const apiUrl = buildApiUrl();
        console.log('API URL:', apiUrl);

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        console.log('API Response:', data);

        if (!data.success) throw new Error(data.error || 'API error');

        totalPages = data.totalPages || 1;
        displayResults(data.results);
        updatePagination();
    } catch (error) {
        console.error('Search error:', error);
        alert(`Search failed: ${error.message}`);
    } finally {
        document.body.removeChild(loadingOverlay);
    }
}

function buildApiUrl() {
    let baseUrl = `${API_BASE}/${currentSource}`;
    const params = new URLSearchParams();

    if (currentSource === 'corpion') {
        if (searchTerm) {
            baseUrl += `/search/${encodeURIComponent(searchTerm)}`;
        } else {
            baseUrl += `?page=${currentPage}`;
        }
    } else {
        if (searchTerm) {
            baseUrl += `/search/${encodeURIComponent(searchTerm)}`;
        }
        params.append('page', currentPage);
    }

    return `${baseUrl}${currentSource === 'corpion' ? '' : '?' + params.toString()}`;
}

function updatePagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const prevButton = document.createElement('button');
    prevButton.textContent = '←';
    prevButton.disabled = currentPage <= 1;
    prevButton.onclick = () => {
        currentPage = Math.max(1, currentPage - 1); // Decrement page
        performSearch(); // Trigger API call with updated page
    };
    pagination.appendChild(prevButton);

    const pageInfo = document.createElement('span');
    pageInfo.textContent = `Page ${currentPage}`;
    pagination.appendChild(pageInfo);

    const nextButton = document.createElement('button');
    nextButton.textContent = '→';
    nextButton.onclick = () => {
        currentPage += 1; // Increment page
        performSearch(); // Trigger API call with updated page
    };
    pagination.appendChild(nextButton);

    const pageInput = document.querySelector('.page-input');
    pageInput.value = currentPage;
}

function goToPage() {
    const input = document.querySelector('.page-input');
    const newPage = Math.max(1, parseInt(input.value) || 1); // Update page
    currentPage = newPage;
    performSearch(); // Trigger API call with updated page
}

function displayResults(results) {
    const container = document.getElementById('results');
    container.innerHTML = results.map(result => `
        <div class="course-card">
            <h3>${result.title}</h3>
            <div class="course-meta">
                ${currentSource === 'udemy' ? `
                    <p>📅 ${result.date}</p>
                    <p>📚 ${result.category}</p>
                    <div class="course-stats">
                        <p>👥 ${result.details.students}</p>
                        <p>💵 ${result.details.originalPrice}</p>
                    </div>
                ` : `
                    <div class="corpion-meta">
                        <p>📅 ${result.date}</p>
                        <p>🏷️ ${result.category}</p>
                        <p class="discount-badge">${result.discount}</p>
                    </div>
                `}
            </div>
            <button class="coupon-btn ${currentSource}" 
                    data-source="${currentSource}"
                    data-id="${currentSource === 'udemy' ? result.id : result.detailUrl}"
                    onclick="handleCouponClick(event)">
                Get Coupon
            </button>
        </div>
    `).join('');
}

async function handleCouponClick(event) {
    const button = event.target;
    const source = button.dataset.source;
    let couponId = button.dataset.id;

    if (source === 'corpion') {
        couponId = couponId.replace('https://couponscorpion.com/', '').replace(/\/$/, '');
    }

    button.classList.add('loading');

    try {
        const endpoint = source === 'udemy' 
            ? `/coupon/udemy/${encodeURIComponent(couponId)}` 
            : `/coupon/corpion/${encodeURIComponent(couponId)}`;

        const response = await fetch(API_BASE + endpoint);
        const data = await response.json();

        if (data.success && data.couponUrl) {
            window.open(data.couponUrl, '_blank');
        } else {
            alert(data.error || 'Coupon might be expired');
        }
    } catch (error) {
        console.error('Coupon Error:', error);
        alert('Failed to retrieve coupon');
    } finally {
        button.classList.remove('loading');
    }
}

document.querySelector('.page-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') goToPage();
});

performSearch();
