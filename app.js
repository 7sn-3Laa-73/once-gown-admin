/**
 * Once Gown Admin - Application Controller
 * Handles Admin Authentication, Real-Time Firestore Syncing, Multi-field Search,
 * Status Updates, Deletion, Bilingual Copywriting (i18n), and Comprehensive Modal Details.
 */

document.addEventListener('DOMContentLoaded', () => {

  // Admin Credentials Default Fallback
  const ADMIN_EMAIL = 'admin@oncegown.com';
  const ADMIN_PASS = 'OnceGownAdmin2026!';

  // App State
  let allDresses = [];
  let currentFilter = 'all';
  let searchQuery = '';

  // DOM Elements
  const elLoginWrapper = document.getElementById('loginWrapper');
  const elDashboardWrapper = document.getElementById('dashboardWrapper');
  const elLoginForm = document.getElementById('adminLoginForm');
  const elEmailInput = document.getElementById('adminEmail');
  const elPassInput = document.getElementById('adminPassword');
  const elLoginError = document.getElementById('loginError');
  const elBtnLogout = document.getElementById('btnLogout');
  const elAdminLangSwitchBtn = document.getElementById('adminLangSwitchBtn');

  // Stats Counters
  const elStatTotal = document.getElementById('statTotal');
  const elStatPending = document.getElementById('statPending');
  const elStatApproved = document.getElementById('statApproved');
  const elStatRejected = document.getElementById('statRejected');

  // Dress Grid & Filter Elements
  const elDressesGrid = document.getElementById('dressesGrid');
  const elSearchInput = document.getElementById('searchInput');
  const elModalOverlay = document.getElementById('modalOverlay');
  const elModalContent = document.getElementById('modalContent');
  const elBtnCloseModal = document.getElementById('btnCloseModal');

  // Setup Language Switcher
  setupLanguageSwitcher();

  // Check Local Auth Session
  if (localStorage.getItem('once_gown_admin_session') === 'true') {
    showDashboard();
  }

  // -------------------------------------------------------------
  // 1. Language Switcher Setup
  // -------------------------------------------------------------

  function setupLanguageSwitcher() {
    if (elAdminLangSwitchBtn) {
      elAdminLangSwitchBtn.addEventListener('click', (e) => {
        const option = e.target.closest('[data-lang]');
        const targetLang = option ? option.getAttribute('data-lang') : (adminI18n.lang === 'en' ? 'ar' : 'en');
        adminI18n.setLanguage(targetLang);
      });
    }

    adminI18n.setLanguage(adminI18n.lang);

    window.addEventListener('adminLanguageChanged', () => {
      renderDressesGrid();
    });
  }

  // -------------------------------------------------------------
  // 2. Admin Authentication Handler
  // -------------------------------------------------------------

  if (elLoginForm) {
    elLoginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = (elEmailInput.value || '').trim();
      const pass = (elPassInput.value || '').trim();
      elLoginError.classList.add('hidden');

      if (email === ADMIN_EMAIL && pass === ADMIN_PASS) {
        localStorage.setItem('once_gown_admin_session', 'true');
        showDashboard();
        return;
      }

      // Try Firebase Auth
      if (typeof auth !== 'undefined' && auth) {
        try {
          await auth.signInWithEmailAndPassword(email, pass);
          localStorage.setItem('once_gown_admin_session', 'true');
          showDashboard();
          return;
        } catch (err) {
          console.warn('Firebase auth attempt note:', err.message);
        }
      }

      elLoginError.classList.remove('hidden');
      elLoginError.textContent = adminI18n.t('admin.invalidLogin');
    });
  }

  if (elBtnLogout) {
    elBtnLogout.addEventListener('click', () => {
      localStorage.removeItem('once_gown_admin_session');
      if (typeof auth !== 'undefined' && auth) {
        auth.signOut();
      }
      window.location.reload();
    });
  }

  function showDashboard() {
    if (elLoginWrapper) elLoginWrapper.classList.add('hidden');
    if (elDashboardWrapper) elDashboardWrapper.classList.remove('hidden');
    startFirestoreListener();
  }

  // -------------------------------------------------------------
  // 3. Real-Time Firestore Synchronization
  // -------------------------------------------------------------

  function startFirestoreListener() {
    if (typeof db === 'undefined' || !db) {
      console.warn('Firestore instance not available yet.');
      return;
    }

    db.collection('dresses').onSnapshot((snapshot) => {
      allDresses = [];
      snapshot.forEach(doc => {
        allDresses.push({
          id: doc.id,
          ...doc.data()
        });
      });

      console.log(`✨ [Once Gown Admin] Synced ${allDresses.length} dresses from Firestore.`);
      updateStats();
      renderDressesGrid();
    }, (error) => {
      console.error('❌ Error listening to Firestore collection:', error);
    });
  }

  // -------------------------------------------------------------
  // 4. Stats & Filter Calculation
  // -------------------------------------------------------------

  function updateStats() {
    const total = allDresses.length;
    const pending = allDresses.filter(d => (d.status || 'pending_review') === 'pending_review').length;
    const approved = allDresses.filter(d => d.status === 'approved').length;
    const rejected = allDresses.filter(d => d.status === 'rejected').length;

    if (elStatTotal) elStatTotal.textContent = total;
    if (elStatPending) elStatPending.textContent = pending;
    if (elStatApproved) elStatApproved.textContent = approved;
    if (elStatRejected) elStatRejected.textContent = rejected;
  }

  // Setup Filter Chips & Search
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilter = chip.dataset.filter;
      renderDressesGrid();
    });
  });

  if (elSearchInput) {
    elSearchInput.addEventListener('input', (e) => {
      searchQuery = (e.target.value || '').trim().toLowerCase();
      renderDressesGrid();
    });
  }

  // -------------------------------------------------------------
  // 5. Render Submissions Grid Cards
  // -------------------------------------------------------------

  function renderDressesGrid() {
    let filtered = [...allDresses];

    // Filter by Status
    if (currentFilter !== 'all') {
      filtered = filtered.filter(d => (d.status || 'pending_review') === currentFilter);
    }

    // Comprehensive Multi-Field Search Query
    if (searchQuery) {
      filtered = filtered.filter(d => {
        const ownerName = (d.ownerName || '').toLowerCase();
        const phone = (d.phone || '').toLowerCase();
        const gov = (d.governorate || '').toLowerCase();
        const city = (d.city || '').toLowerCase();
        const brand = (d.brand || '').toLowerCase();
        const color = (d.color || '').toLowerCase();
        const size = (d.size || '').toLowerCase();
        const tailor = (d.tailorName || '').toLowerCase();
        const notes = (d.notes || '').toLowerCase();

        return ownerName.includes(searchQuery) ||
               phone.includes(searchQuery) ||
               gov.includes(searchQuery) ||
               city.includes(searchQuery) ||
               brand.includes(searchQuery) ||
               color.includes(searchQuery) ||
               size.includes(searchQuery) ||
               tailor.includes(searchQuery) ||
               notes.includes(searchQuery);
      });
    }

    if (!elDressesGrid) return;
    elDressesGrid.innerHTML = '';

    if (filtered.length === 0) {
      elDressesGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px; color: var(--text-secondary); background: var(--surface-card); border-radius: var(--radius-luxury); border: 1px solid var(--border-color);">
          ${adminI18n.t('toolbar.noResults')}
        </div>
      `;
      return;
    }

    filtered.forEach(dress => {
      const coverImage = (dress.images && dress.images.length > 0) ? dress.images[0] : 'assets/logo.jpg';
      const formattedPhone = (dress.phone || '').replace(/\D/g, '');
      const waNumber = formattedPhone.startsWith('0') ? '20' + formattedPhone.substring(1) : formattedPhone;

      const status = dress.status || 'pending_review';
      let statusText = adminI18n.t('status.pending');
      let badgeClass = 'badge-pending';

      if (status === 'approved') {
        statusText = adminI18n.t('status.approved');
        badgeClass = 'badge-approved';
      } else if (status === 'rejected') {
        statusText = adminI18n.t('status.rejected');
        badgeClass = 'badge-rejected';
      }

      const listingTypeStr = dress.listingType || (adminI18n.lang === 'ar' ? 'للإيجار والبيع' : 'Rent & Sale');

      const card = document.createElement('div');
      card.className = 'dress-card';
      card.innerHTML = `
        <div class="dress-cover-frame">
          <img src="${coverImage}" class="dress-cover-img" alt="صورة الفستان" />
          <span class="status-badge ${badgeClass}">${statusText}</span>
          <span class="listing-type-badge">${listingTypeStr}</span>
        </div>

        <div class="dress-body">
          <div class="dress-title">${dress.brand ? dress.brand : (adminI18n.lang === 'ar' ? 'فستان فاخر' : 'Luxury Gown')} ${dress.color ? `• ${dress.color}` : ''}</div>
          
          <div class="owner-meta">
            <span>${adminI18n.t('card.owner')} <strong>${dress.ownerName || '-'}</strong></span>
            <a href="https://wa.me/${waNumber}?text=${encodeURIComponent(adminI18n.lang === 'ar' ? 'مرحباً، أهلاً بكِ في Once Gown. بخصوص طلب إدراج فستانكِ...' : 'Hello! Regarding your Once Gown submission...')}" target="_blank" class="whatsapp-link">
              📱 ${adminI18n.t('card.whatsapp')}
            </a>
          </div>

          <div class="owner-meta" style="font-size: 0.8rem;">
            <span>${adminI18n.t('card.governorate')} ${dress.governorate || '-'}</span>
            <span>${adminI18n.t('card.size')} ${dress.size || '-'}</span>
          </div>

          <div class="price-tag">
            ${dress.rentPrice ? `${dress.rentPrice.toLocaleString()} ${adminI18n.t('modal.currency')} (${adminI18n.lang === 'ar' ? 'إيجار' : 'Rent'})` : ''} 
            ${dress.sellPrice ? `${dress.sellPrice.toLocaleString()} ${adminI18n.t('modal.currency')} (${adminI18n.lang === 'ar' ? 'بيع' : 'Sale'})` : (!dress.rentPrice ? (adminI18n.lang === 'ar' ? 'السعر غير محدد' : 'Price not set') : '')}
          </div>

          <div class="dress-footer-actions">
            <button type="button" class="btn-sm btn-view btn-details" data-id="${dress.id}">${adminI18n.t('card.detailsBtn')}</button>
            <button type="button" class="btn-sm btn-approve btn-change-status" data-id="${dress.id}" data-status="approved">${adminI18n.t('card.approveBtn')}</button>
            <button type="button" class="btn-sm btn-reject btn-change-status" data-id="${dress.id}" data-status="rejected">${adminI18n.t('card.rejectBtn')}</button>
          </div>
        </div>
      `;

      elDressesGrid.appendChild(card);
    });

    // Attach Action Event Listeners
    elDressesGrid.querySelectorAll('.btn-change-status').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        updateDressStatus(btn.dataset.id, btn.dataset.status);
      });
    });

    elDressesGrid.querySelectorAll('.btn-details').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openDressModal(btn.dataset.id);
      });
    });
  }

  // -------------------------------------------------------------
  // 6. Detailed Inspection Modal Renderer
  // -------------------------------------------------------------

  // -------------------------------------------------------------
  // 6. Detailed Inspection Modal & Rejection Prompt System
  // -------------------------------------------------------------

  let pendingRejectionId = null;

  const elRejectionModalOverlay = document.getElementById('rejectionModalOverlay');
  const elRejectionReasonInput = document.getElementById('rejectionReasonInput');
  const elBtnConfirmRejectionSubmit = document.getElementById('btnConfirmRejectionSubmit');
  const elBtnCloseRejectionModal = document.getElementById('btnCloseRejectionModal');

  async function updateDressStatus(id, newStatus, customReason = null) {
    if (typeof db === 'undefined' || !db) return;

    if (newStatus === 'rejected' && customReason === null) {
      // Open rejection reason prompt modal
      pendingRejectionId = id;
      if (elRejectionReasonInput) elRejectionReasonInput.value = '';
      if (elRejectionModalOverlay) elRejectionModalOverlay.classList.add('active');
      return;
    }

    try {
      const updateData = {
        status: newStatus,
        reviewedAt: new Date().toISOString(),
        approvedBy: 'Admin'
      };

      if (newStatus === 'rejected') {
        updateData.rejectionReason = (customReason || '').trim();
      } else if (newStatus === 'approved') {
        updateData.rejectionReason = '';
      }

      await db.collection('dresses').doc(id).update(updateData);
      console.log(`✨ Updated dress ${id} status to ${newStatus}`);
    } catch (err) {
      alert((adminI18n.lang === 'ar' ? 'حدث خطأ أثناء تحديث الحالة: ' : 'Error updating status: ') + err.message);
    }
  }

  if (elBtnConfirmRejectionSubmit) {
    elBtnConfirmRejectionSubmit.addEventListener('click', async () => {
      if (!pendingRejectionId) return;
      const reasonText = elRejectionReasonInput ? elRejectionReasonInput.value : '';
      const idToUpdate = pendingRejectionId;
      pendingRejectionId = null;
      if (elRejectionModalOverlay) elRejectionModalOverlay.classList.remove('active');
      await updateDressStatus(idToUpdate, 'rejected', reasonText);
      if (elModalOverlay) elModalOverlay.classList.remove('active');
    });
  }

  if (elBtnCloseRejectionModal) {
    elBtnCloseRejectionModal.addEventListener('click', () => {
      pendingRejectionId = null;
      if (elRejectionModalOverlay) elRejectionModalOverlay.classList.remove('active');
    });
  }

  if (elRejectionModalOverlay) {
    elRejectionModalOverlay.addEventListener('click', (e) => {
      if (e.target === elRejectionModalOverlay) {
        pendingRejectionId = null;
        elRejectionModalOverlay.classList.remove('active');
      }
    });
  }

  function openDressModal(id) {
    const dress = allDresses.find(d => d.id === id);
    if (!dress || !elModalContent) return;

    const images = dress.images || [];
    const formattedPhone = (dress.phone || '').replace(/\D/g, '');
    const waNumber = formattedPhone.startsWith('0') ? '20' + formattedPhone.substring(1) : formattedPhone;

    const isAr = adminI18n.lang === 'ar';

    elModalContent.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 14px;">
        <h2 style="font-size: 1.35rem; font-weight: 700; color: var(--rose-deep);" class="brand-title">
          ${adminI18n.t('modal.title')} ${dress.brand ? `- ${dress.brand}` : ''}
        </h2>
      </div>

      <!-- Image Scroller Gallery -->
      ${images.length > 0 ? `
        <div class="gallery-scroller">
          ${images.map((img, idx) => `
            <img src="${img}" class="gallery-thumb" alt="صورة ${idx + 1}" onclick="window.open('${img}', '_blank')" />
          `).join('')}
        </div>
      ` : ''}

      <!-- Rejection Reason Notice if Rejected -->
      ${(dress.status === 'rejected' && dress.rejectionReason) ? `
        <div style="background: var(--status-rejected-bg); border: 1px solid rgba(231,76,60,0.4); padding: 14px 18px; border-radius: 12px; margin-bottom: 18px; color: var(--status-rejected); font-size: 0.9rem;">
          <strong>❌ ${adminI18n.t('modal.rejectionReasonLabel')}</strong> ${dress.rejectionReason}
        </div>
      ` : ''}

      <!-- 1. Owner & Contact Section -->
      <div class="modal-section-card">
        <div class="modal-section-title">👤 ${adminI18n.t('modal.ownerSection')}</div>
        <div class="modal-info-grid">
          <div><strong>${adminI18n.t('modal.ownerName')}</strong> ${dress.ownerName || '-'}</div>
          <div>
            <strong>${adminI18n.t('modal.phone')}</strong> 
            <a href="https://wa.me/${waNumber}?text=${encodeURIComponent(isAr ? 'مرحباً، بخصوص طلب فستانكِ عبر Once Gown...' : 'Hello! Regarding your Once Gown submission...')}" target="_blank" style="color: #25D366; text-decoration: underline; font-weight: 600;">
              ${dress.phone} 📱
            </a>
          </div>
          <div><strong>${adminI18n.t('modal.secondPhone')}</strong> ${dress.secondPhone || adminI18n.t('modal.none')}</div>
          <div><strong>${adminI18n.t('modal.location')}</strong> ${dress.governorate || ''} ${dress.city ? `• ${dress.city}` : ''} ${dress.address ? `(${dress.address})` : ''}</div>
        </div>
      </div>

      <!-- 2. Specifications & Sizing Section -->
      <div class="modal-section-card">
        <div class="modal-section-title">👗 ${adminI18n.t('modal.specsSection')}</div>
        <div class="modal-info-grid">
          <div><strong>${adminI18n.t('card.listingType')}</strong> ${dress.listingType || '-'}</div>
          <div><strong>${adminI18n.t('card.brand')}</strong> ${dress.brand || adminI18n.t('modal.none')}</div>
          <div><strong>${adminI18n.t('card.color')}</strong> ${dress.color || '-'}</div>
          <div><strong>${adminI18n.t('card.size')}</strong> ${dress.size || '-'}</div>
          <div><strong>${adminI18n.t('modal.readyOrTailored')}</strong> ${dress.readyOrTailored || '-'}</div>
          <div><strong>${adminI18n.t('modal.tailorName')}</strong> ${dress.tailorName || adminI18n.t('modal.none')}</div>
          <div><strong>${adminI18n.t('modal.weightRange')}</strong> ${dress.weightRange || '-'}</div>
          <div><strong>${adminI18n.t('modal.heightRange')}</strong> ${dress.heightRange || '-'}</div>
        </div>
      </div>

      <!-- 3. Condition & Alterations Section -->
      <div class="modal-section-card">
        <div class="modal-section-title">✨ ${adminI18n.t('modal.conditionSection')}</div>
        <div class="modal-info-grid">
          <div><strong>${adminI18n.t('modal.condition')}</strong> ${dress.condition || '-'}</div>
          <div>
            <strong>${adminI18n.t('modal.defects')}</strong> 
            ${dress.hasDefects ? `<span style="color: var(--status-rejected); font-weight:600;">${isAr ? 'يوجد ملاحظات:' : 'Notes present:'} ${dress.defectDetails || ''}</span>` : `<span style="color: var(--status-approved);">${isAr ? 'بحالة ممتازة' : 'Flawless condition'}</span>`}
          </div>
          <div>
            <strong>${adminI18n.t('modal.alterations')}</strong> 
            ${dress.alterationsAllowed ? `${adminI18n.t('modal.yes')} ${dress.alterationDetails ? `(${dress.alterationDetails})` : ''}` : adminI18n.t('modal.no')}
          </div>
        </div>
      </div>

      <!-- 4. Financials Section -->
      <div class="modal-section-card" style="background: rgba(245, 230, 202, 0.25); border-color: rgba(197, 155, 39, 0.4);">
        <div class="modal-section-title" style="color: var(--gold-dark);">💎 ${adminI18n.t('modal.financialSection')}</div>
        <div class="modal-info-grid">
          <div><strong>${adminI18n.t('modal.rentPrice')}</strong> ${dress.rentPrice ? `${dress.rentPrice.toLocaleString()} ${adminI18n.t('modal.currency')}` : (isAr ? 'غير متاح للإيجار' : 'Not for rent')}</div>
          <div><strong>${adminI18n.t('modal.sellPrice')}</strong> ${dress.sellPrice ? `${dress.sellPrice.toLocaleString()} ${adminI18n.t('modal.currency')}` : (isAr ? 'غير متاح للبيع' : 'Not for sale')}</div>
        </div>
      </div>

      <!-- 5. Additional Notes -->
      <div class="modal-section-card">
        <div class="modal-section-title">📝 ${adminI18n.t('modal.notesSection')}</div>
        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 6px;">
          ${dress.notes ? dress.notes : adminI18n.t('modal.noNotes')}
        </p>
      </div>

      <!-- Footer Modal Decision Actions -->
      <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 24px; flex-wrap: wrap;">
        <button type="button" class="btn-sm btn-approve" style="padding: 10px 20px; font-size: 0.88rem;" onclick="updateDressStatusDirect('${dress.id}', 'approved')">${adminI18n.t('card.approveBtn')} ✨</button>
        <button type="button" class="btn-sm btn-reject" style="padding: 10px 20px; font-size: 0.88rem;" onclick="updateDressStatusDirect('${dress.id}', 'rejected')">${adminI18n.t('card.rejectBtn')} ❌</button>
        <button type="button" class="btn-sm" style="padding: 10px 20px; font-size: 0.88rem; background: var(--status-rejected); color:#FFF;" onclick="deleteDressDirect('${dress.id}')">${adminI18n.t('card.deleteBtn')} 🗑️</button>
      </div>
    `;

    if (elModalOverlay) elModalOverlay.classList.add('active');
  }

  window.updateDressStatusDirect = async function(id, newStatus) {
    await updateDressStatus(id, newStatus);
    if (newStatus !== 'rejected' && elModalOverlay) {
      elModalOverlay.classList.remove('active');
    }
  };

  window.deleteDressDirect = async function(id) {
    const confirmMsg = adminI18n.lang === 'ar' ? 'هل أنتِ متأكدة من حذف هذا الفستان نهائياً من قاعدة البيانات؟' : 'Are you sure you want to delete this dress submission permanently?';
    if (confirm(confirmMsg)) {
      if (typeof db !== 'undefined' && db) {
        await db.collection('dresses').doc(id).delete();
        if (elModalOverlay) elModalOverlay.classList.remove('active');
      }
    }
  };

  if (elBtnCloseModal) {
    elBtnCloseModal.addEventListener('click', () => {
      if (elModalOverlay) elModalOverlay.classList.remove('active');
    });
  }

  if (elModalOverlay) {
    elModalOverlay.addEventListener('click', (e) => {
      if (e.target === elModalOverlay) {
        elModalOverlay.classList.remove('active');
      }
    });
  }
});
