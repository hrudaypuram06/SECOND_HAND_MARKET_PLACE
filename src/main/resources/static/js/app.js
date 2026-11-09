// ===========================
// API Configuration
// ===========================
const API_BASE = '/api';
let searchTimer = null;

// Category icons mapping
const CATEGORY_ICONS = {
    'Electronics': '📱',
    'Books': '📚',
    'Furniture': '🪑',
    'Clothing': '👕',
    'Sports': '⚽',
    'Other': '📦'
};

// Condition colors
const CONDITION_COLORS = {
    'New': '#10b981',
    'Like New': '#3b82f6',
    'Good': '#8b5cf6',
    'Fair': '#f59e0b',
    'Poor': '#ef4444'
};

// ===========================
// Navigation
// ===========================
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    document.getElementById('hero-section').classList.add('hidden');

    // Show target section
    const section = document.getElementById(`section-${sectionName}`);
    if (section) {
        section.classList.remove('hidden');
        section.style.paddingTop = '100px';
    }

    // Activate nav tab
    const tab = document.getElementById(`tab-${sectionName}`);
    if (tab) tab.classList.add('active');

    // Load data for section
    if (sectionName === 'browse') loadListings();
    if (sectionName === 'manage') loadManageListings();
}

// ===========================
// Load & Display Listings (Browse)
// ===========================
async function loadListings(params = {}) {
    const grid = document.getElementById('listings-grid');
    grid.innerHTML = `<div class="loading-state"><div class="spinner"></div><p>Loading listings...</p></div>`;

    try {
        const query = new URLSearchParams(params).toString();
        const url = `${API_BASE}/listings${query ? '?' + query : ''}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch listings');

        const listings = await response.json();
        updateStats(listings);
        renderListings(listings, grid);
    } catch (err) {
        grid.innerHTML = `<div class="empty-state">
            <div class="empty-icon">❌</div>
            <h3>Failed to load listings</h3>
            <p>${err.message}</p>
        </div>`;
    }
}

function renderListings(listings, container) {
    const countEl = document.getElementById('results-count');
    if (countEl) {
        countEl.textContent = listings.length === 0
            ? 'No listings found'
            : `Showing ${listings.length} listing${listings.length !== 1 ? 's' : ''}`;
    }

    if (listings.length === 0) {
        container.innerHTML = `<div class="empty-state">
            <div class="empty-icon">🔍</div>
            <h3>No listings found</h3>
            <p>Try adjusting your filters or search term</p>
        </div>`;
        return;
    }

    container.innerHTML = listings.map(listing => `
        <div class="listing-card ${listing.sold ? 'sold' : ''}"
             onclick="openListingModal(${listing.id})"
             id="listing-card-${listing.id}">
            <div class="card-category-icon">
                ${CATEGORY_ICONS[listing.category] || '📦'}
                ${listing.sold ? '<div class="sold-banner">SOLD</div>' : ''}
            </div>
            <div class="card-body">
                <div class="card-header-row">
                    <div class="card-item-title">${escapeHtml(listing.title)}</div>
                    <div class="card-item-price">₹${formatPrice(listing.price)}</div>
                </div>
                <div class="card-desc">${escapeHtml(listing.description)}</div>
                <div class="card-tags">
                    <span class="tag tag-category">${listing.category}</span>
                    <span class="tag tag-condition" style="color: ${CONDITION_COLORS[listing.condition] || '#94a3b8'}">${listing.condition}</span>
                </div>
                <div class="card-footer">
                    <span class="card-seller">👤 ${escapeHtml(listing.sellerName)}</span>
                    <span class="card-time">${timeAgo(listing.createdAt)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function updateStats(listings) {
    const active = listings.filter(l => !l.sold).length;
    const sold = listings.filter(l => l.sold).length;
    const totalEl = document.getElementById('total-listings');
    const soldEl = document.getElementById('total-sold');
    if (totalEl) animateNumber(totalEl, active);
    if (soldEl) animateNumber(soldEl, sold);
}

// ===========================
// Open Listing Detail Modal
// ===========================
async function openListingModal(id) {
    const overlay = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');

    overlay.classList.remove('hidden');
    content.innerHTML = `<div class="loading-state"><div class="spinner"></div><p>Loading...</p></div>`;

    try {
        const [listingRes, inquiriesRes] = await Promise.all([
            fetch(`${API_BASE}/listings/${id}`),
            fetch(`${API_BASE}/inquiries/listing/${id}`)
        ]);

        const listing = await listingRes.json();
        const inquiries = await inquiriesRes.json();

        content.innerHTML = `
            <div class="modal-category-icon">${CATEGORY_ICONS[listing.category] || '📦'}</div>

            ${listing.sold ? '<div class="sold-alert">🚫 This item has been sold and is no longer available for inquiries.</div>' : ''}

            <div class="modal-title">${escapeHtml(listing.title)}</div>
            <div class="modal-price">₹${formatPrice(listing.price)}</div>

            <div class="modal-tags">
                <span class="tag tag-category">${listing.category}</span>
                <span class="tag tag-condition">${listing.condition}</span>
                ${listing.sold ? '<span class="tag" style="background:rgba(239,68,68,0.2);color:#fca5a5;border:1px solid rgba(239,68,68,0.3)">SOLD</span>' : ''}
            </div>

            <div class="modal-desc">${escapeHtml(listing.description)}</div>

            <div class="modal-seller-info">
                <div class="seller-avatar">${listing.sellerName.charAt(0).toUpperCase()}</div>
                <div>
                    <div class="seller-name">${escapeHtml(listing.sellerName)}</div>
                    <div class="seller-email">📧 ${escapeHtml(listing.sellerEmail)}</div>
                </div>
            </div>

            <div class="modal-actions">
                ${!listing.sold ? `
                    <button class="btn btn-primary" onclick="openInquiryModal(${listing.id}, '${escapeHtml(listing.title)}')">
                        💬 Send Inquiry
                    </button>
                ` : ''}
                <button class="btn btn-outline" onclick="closeModalBtn()">Close</button>
            </div>

            ${inquiries.length > 0 ? `
                <div class="inquiries-section">
                    <div class="inquiries-title">💬 ${inquiries.length} Inquiry${inquiries.length !== 1 ? 's' : ''}</div>
                    ${inquiries.map(inq => `
                        <div class="inquiry-item">
                            <div class="inquiry-buyer">${escapeHtml(inq.buyerName)}</div>
                            <div class="inquiry-email">${escapeHtml(inq.buyerEmail)}</div>
                            <div class="inquiry-msg">${escapeHtml(inq.message)}</div>
                            <div class="inquiry-time">${timeAgo(inq.createdAt)}</div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        `;
    } catch (err) {
        content.innerHTML = `<p style="color: var(--accent-red)">Failed to load listing details.</p>`;
    }
}

function closeModal(event) {
    if (event.target === document.getElementById('modal-overlay')) closeModalBtn();
}

function closeModalBtn() {
    document.getElementById('modal-overlay').classList.add('hidden');
}

// ===========================
// Inquiry Modal
// ===========================
function openInquiryModal(listingId, listingTitle) {
    closeModalBtn();
    const overlay = document.getElementById('inquiry-overlay');
    const content = document.getElementById('inquiry-content');

    overlay.classList.remove('hidden');
    content.innerHTML = `
        <div class="inquiry-title">💬 Send Inquiry</div>
        <div class="inquiry-subtitle">About: <strong>${escapeHtml(listingTitle)}</strong></div>

        <form class="inquiry-form" onsubmit="submitInquiry(event, ${listingId})">
            <div class="form-group">
                <label class="form-label">Your Name *</label>
                <input type="text" id="inq-name" class="form-input" placeholder="Full name" required>
            </div>
            <div class="form-group">
                <label class="form-label">Your Email *</label>
                <input type="email" id="inq-email" class="form-input" placeholder="your@email.com" required>
            </div>
            <div class="form-group">
                <label class="form-label">Your Message *</label>
                <textarea id="inq-message" class="form-textarea" placeholder="Hi, I'm interested in this item. Is it still available? Can we meet at..." required maxlength="1000" rows="4"></textarea>
            </div>
            <div style="display:flex; gap:12px; margin-top:8px">
                <button type="submit" class="btn btn-primary" id="inq-submit-btn">
                    🚀 Send Inquiry
                </button>
                <button type="button" class="btn btn-outline" onclick="closeInquiryModalBtn()">Cancel</button>
            </div>
        </form>
    `;
}

async function submitInquiry(event, listingId) {
    event.preventDefault();
    const btn = document.getElementById('inq-submit-btn');
    btn.disabled = true;
    btn.textContent = 'Sending...';

    const inquiry = {
        listingId: listingId,
        buyerName: document.getElementById('inq-name').value.trim(),
        buyerEmail: document.getElementById('inq-email').value.trim(),
        message: document.getElementById('inq-message').value.trim()
    };

    try {
        const response = await fetch(`${API_BASE}/inquiries`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(inquiry)
        });

        if (response.ok) {
            closeInquiryModalBtn();
            showToast('✅ Inquiry sent successfully! The seller will contact you.', 'success');
        } else {
            const err = await response.json();
            showToast('❌ ' + (err.error || 'Failed to send inquiry'), 'error');
            btn.disabled = false;
            btn.textContent = '🚀 Send Inquiry';
        }
    } catch (err) {
        showToast('❌ Network error. Please try again.', 'error');
        btn.disabled = false;
        btn.textContent = '🚀 Send Inquiry';
    }
}

function closeInquiryModal(event) {
    if (event.target === document.getElementById('inquiry-overlay')) closeInquiryModalBtn();
}

function closeInquiryModalBtn() {
    document.getElementById('inquiry-overlay').classList.add('hidden');
}

// ===========================
// Create Listing
// ===========================
async function createListing(event) {
    event.preventDefault();
    const btn = document.getElementById('submit-btn');
    btn.disabled = true;
    btn.innerHTML = '<div class="spinner" style="width:18px;height:18px;border-width:2px"></div> Posting...';

    const listing = {
        title: document.getElementById('title').value.trim(),
        description: document.getElementById('description').value.trim(),
        category: document.getElementById('category').value,
        condition: document.getElementById('condition').value,
        price: parseFloat(document.getElementById('price').value),
        sellerName: document.getElementById('seller-name').value.trim(),
        sellerEmail: document.getElementById('seller-email').value.trim()
    };

    try {
        const response = await fetch(`${API_BASE}/listings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(listing)
        });

        if (response.ok) {
            resetForm();
            showToast('🎉 Your listing has been posted successfully!', 'success');
            // Switch to browse to see the new listing
            setTimeout(() => showSection('browse'), 1500);
        } else {
            const err = await response.json();
            showToast('❌ ' + (err.error || 'Failed to create listing'), 'error');
        }
    } catch (err) {
        showToast('❌ Network error. Please try again.', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<span>🚀 Post Listing</span>';
    }
}

function resetForm() {
    document.getElementById('listing-form').reset();
    document.getElementById('desc-count').textContent = '0/2000 characters';
}

// ===========================
// Manage Listings
// ===========================
async function loadManageListings() {
    const grid = document.getElementById('manage-grid');
    grid.innerHTML = `<div class="loading-state"><div class="spinner"></div><p>Loading...</p></div>`;

    try {
        const response = await fetch(`${API_BASE}/listings`);
        const listings = await response.json();

        if (listings.length === 0) {
            grid.innerHTML = `<div class="empty-state">
                <div class="empty-icon">📋</div>
                <h3>No listings yet</h3>
                <p>Create your first listing to get started!</p>
                <button class="btn btn-primary" style="margin-top:16px" onclick="showSection('sell')">+ Create Listing</button>
            </div>`;
            return;
        }

        grid.innerHTML = listings.map(listing => `
            <div class="manage-card" id="manage-card-${listing.id}">
                <div class="manage-icon">${CATEGORY_ICONS[listing.category] || '📦'}</div>
                <div class="manage-info">
                    <div class="manage-title">${escapeHtml(listing.title)}</div>
                    <div class="manage-meta">
                        <span class="manage-price">₹${formatPrice(listing.price)}</span>
                        <span>${listing.category}</span>
                        <span>${listing.condition}</span>
                        <span>${timeAgo(listing.createdAt)}</span>
                    </div>
                </div>
                <div class="manage-actions">
                    ${listing.sold
                        ? '<span class="sold-badge">🚫 SOLD</span>'
                        : `<button class="btn btn-success btn-sm" onclick="markAsSold(${listing.id})">✅ Mark Sold</button>`
                    }
                    <button class="btn btn-outline btn-sm" onclick="openListingModal(${listing.id})">👁 View</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteListing(${listing.id})">🗑</button>
                </div>
            </div>
        `).join('');
    } catch (err) {
        grid.innerHTML = `<div class="empty-state"><p>Failed to load listings: ${err.message}</p></div>`;
    }
}

async function markAsSold(id) {
    if (!confirm('Mark this item as SOLD? Buyers will no longer be able to send inquiries.')) return;

    try {
        const response = await fetch(`${API_BASE}/listings/${id}/sold`, { method: 'PUT' });
        if (response.ok) {
            showToast('✅ Item marked as sold!', 'success');
            loadManageListings(); // Refresh
        } else {
            showToast('❌ Failed to update listing', 'error');
        }
    } catch (err) {
        showToast('❌ Network error', 'error');
    }
}

async function deleteListing(id) {
    if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) return;

    try {
        const response = await fetch(`${API_BASE}/listings/${id}`, { method: 'DELETE' });
        if (response.ok) {
            showToast('🗑️ Listing deleted', 'success');
            loadManageListings();
        } else {
            showToast('❌ Failed to delete listing', 'error');
        }
    } catch (err) {
        showToast('❌ Network error', 'error');
    }
}

// ===========================
// Search & Filters
// ===========================
function debouncedSearch() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(applyFilters, 400);
}

function applyFilters() {
    const search = document.getElementById('search-input').value.trim();
    const category = document.getElementById('filter-category').value;
    const condition = document.getElementById('filter-condition').value;
    const minPrice = document.getElementById('filter-min-price').value;
    const maxPrice = document.getElementById('filter-max-price').value;

    const params = {};
    if (search) params.search = search;
    else {
        if (category) params.category = category;
        if (condition) params.condition = condition;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
    }

    loadListings(params);
}

function clearFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('filter-category').value = '';
    document.getElementById('filter-condition').value = '';
    document.getElementById('filter-min-price').value = '';
    document.getElementById('filter-max-price').value = '';
    loadListings();
}

// ===========================
// Toast Notification
// ===========================
let toastTimer = null;

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const msgEl = document.getElementById('toast-message');
    const iconEl = document.getElementById('toast-icon');

    msgEl.textContent = message.replace(/^[^\s]+\s/, '');
    iconEl.textContent = type === 'success' ? '✅' : '❌';

    toast.className = `toast toast-${type}`;
    toast.classList.remove('hidden');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.add('hidden'), 4000);
}

// ===========================
// Utility Functions
// ===========================
function formatPrice(price) {
    return new Intl.NumberFormat('en-IN').format(price);
}

function timeAgo(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function animateNumber(el, target) {
    const start = parseInt(el.textContent) || 0;
    const duration = 600;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(start + (target - start) * eased);
        if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

// ===========================
// Description Character Count
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    // Load initial stats
    fetch(`${API_BASE}/listings`)
        .then(r => r.json())
        .then(listings => updateStats(listings))
        .catch(() => {});

    // Load browse section by default if page loads on browse tab
    const descTextarea = document.getElementById('description');
    if (descTextarea) {
        descTextarea.addEventListener('input', () => {
            document.getElementById('desc-count').textContent =
                `${descTextarea.value.length}/2000 characters`;
        });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            closeModalBtn();
            closeInquiryModalBtn();
        }
    });
});
