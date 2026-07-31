/**
 * Once Gown Admin - Application Controller
 * Handles Admin Auth, Real-Time Firestore Syncing, Status Modifiers,
 * Search, Filters, and Detail Modal view.
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

  // Check Local Auth Session
  if (localStorage.getItem('once_gown_admin_session') === 'true') {
    showDashboard();
  }

  // -------------------------------------------------------------
  // 1. Admin Authentication Handler
  // -------------------------------------------------------------

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
    elLoginError.textContent = 'بيانات الدخول غير صحيحة. يرجى استخدام بريد الإدمن المعين.';
  });

  elBtnLogout.addEventListener('click', () => {
    localStorage.removeItem('once_gown_admin_session');
    if (typeof auth !== 'undefined' && auth) {
      auth.signOut();
    }
    window.location.reload();
  });

  function showDashboard() {
    elLoginWrapper.classList.add('hidden');
    elDashboardWrapper.classList.remove('hidden');
    startFirestoreListener();
  }

  // -------------------------------------------------------------
  // 2. Real-Time Firestore Synchronization
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

      console.log(`✨ [Admin] Synced ${allDresses.length} dresses from Firestore.`);
      updateStats();
      renderDressesGrid();
    }, (error) => {
      console.error('❌ Error listening to Firestore collection:', error);
    });
  }

  // -------------------------------------------------------------
  // 3. Stats & Filter Calculation
  // -------------------------------------------------------------

  function updateStats() {
    const total = allDresses.length;
    const pending = allDresses.filter(d => (d.status || 'pending_review') === 'pending_review').length;
    const approved = allDresses.filter(d => d.status === 'approved').length;
    const rejected = allDresses.filter(d => d.status === 'rejected').length;

    elStatTotal.textContent = total;
    elStatPending.textContent = pending;
    elStatApproved.textContent = approved;
    elStatRejected.textContent = rejected;
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

  elSearchInput.addEventListener('input', (e) => {
    searchQuery = (e.target.value || '').trim().toLowerCase();
    renderDressesGrid();
  });

  // -------------------------------------------------------------
  // 4. Render Submissions Cards
  // -------------------------------------------------------------

  function renderDressesGrid() {
    let filtered = [...allDresses];

    // Status Filter
    if (currentFilter !== 'all') {
      filtered = filtered.filter(d => (d.status || 'pending_review') === currentFilter);
    }

    // Search Query
    if (searchQuery) {
      filtered = filtered.filter(d => {
        const name = (d.ownerName || '').toLowerCase();
        const phone = (d.phone || '').toLowerCase();
        const gov = (d.governorate || '').toLowerCase();
        const category = (d.dressCategory || '').toLowerCase();
        return name.includes(searchQuery) || phone.includes(searchQuery) || gov.includes(searchQuery) || category.includes(searchQuery);
      });
    }

    elDressesGrid.innerHTML = '';

    if (filtered.length === 0) {
      elDressesGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px; color: var(--text-secondary);">
          لا توجد فساتين مطابقة للفلتر المحدد حتى الآن.
        </div>
      `;
      return;
    }

    filtered.forEach(dress => {
      const coverImage = (dress.images && dress.images.length > 0) ? dress.images[0] : 'assets/logo.jpg';
      const formattedPhone = (dress.phone || '').replace(/\D/g, '');
      const waNumber = formattedPhone.startsWith('0') ? '20' + formattedPhone.substring(1) : formattedPhone;

      const status = dress.status || 'pending_review';
      let statusText = 'قيد المراجعة';
      let badgeClass = 'badge-pending';

      if (status === 'approved') {
        statusText = 'مقبول ✨';
        badgeClass = 'badge-approved';
      } else if (status === 'rejected') {
        statusText = 'مرفوض ❌';
        badgeClass = 'badge-rejected';
      }

      const card = document.createElement('div');
      card.className = 'dress-card';
      card.innerHTML = `
        <div class="dress-cover-frame">
          <img src="${coverImage}" class="dress-cover-img" alt="صورة الفستان" />
          <span class="status-badge ${badgeClass}">${statusText}</span>
        </div>

        <div class="dress-body">
          <div class="dress-title">${dress.dressCategory || 'فستان بدون تصنيف'} ${dress.brand ? `- ${dress.brand}` : ''}</div>
          
          <div class="owner-meta">
            <span>المالكة: <strong>${dress.ownerName || 'غير محدد'}</strong></span>
            <a href="https://wa.me/${waNumber}" target="_blank" class="whatsapp-link">
              📱 واتساب
            </a>
          </div>

          <div class="owner-meta" style="font-size: 0.8rem;">
            <span>المحافظة: ${dress.governorate || '-'}</span>
            <span>اللون: ${dress.color || '-'}</span>
          </div>

          <div class="price-tag">
            ${dress.rentPrice ? `${dress.rentPrice} ج.م (إيجار)` : (dress.sellPrice ? `${dress.sellPrice} ج.م (بيع)` : 'السعر غير محدد')}
          </div>

          <div class="dress-footer-actions">
            <button type="button" class="btn-sm btn-view btn-details" data-id="${dress.id}">التفاصيل الكاملة</button>
            <button type="button" class="btn-sm btn-approve btn-change-status" data-id="${dress.id}" data-status="approved">قبول</button>
            <button type="button" class="btn-sm btn-reject btn-change-status" data-id="${dress.id}" data-status="rejected">رفض</button>
          </div>
        </div>
      `;

      elDressesGrid.appendChild(card);
    });

    // Attach Event Listeners to Buttons
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
  // 5. Update Firestore Dress Status & Modal
  // -------------------------------------------------------------

  async function updateDressStatus(id, newStatus) {
    if (typeof db === 'undefined' || !db) return;

    try {
      await db.collection('dresses').doc(id).update({
        status: newStatus,
        reviewedAt: new Date().toISOString(),
        approvedBy: 'Admin'
      });
      console.log(`✨ Updated dress ${id} status to ${newStatus}`);
    } catch (err) {
      alert('حدث خطأ أثناء تحديث الحالة: ' + err.message);
    }
  }

  function openDressModal(id) {
    const dress = allDresses.find(d => d.id === id);
    if (!dress) return;

    const images = dress.images || [];
    const formattedPhone = (dress.phone || '').replace(/\D/g, '');
    const waNumber = formattedPhone.startsWith('0') ? '20' + formattedPhone.substring(1) : formattedPhone;

    elModalContent.innerHTML = `
      <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 16px; color: var(--gold-dark);">
        تفاصيل الفستان - ${dress.dressCategory || ''}
      </h2>

      <!-- Gallery Scroller -->
      <div class="gallery-scroller">
        ${images.map(img => `<img src="${img}" class="gallery-thumb" alt="معاينة" />`).join('')}
      </div>

      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; font-size: 0.9rem; margin-bottom: 20px;">
        <div><strong>المالكة:</strong> ${dress.ownerName || '-'}</div>
        <div><strong>رقم الواتساب:</strong> <a href="https://wa.me/${waNumber}" target="_blank" style="color: #25D366; text-decoration: underline;">${dress.phone}</a></div>
        <div><strong>الهاتف الإضافي:</strong> ${dress.secondPhone || 'لا يوجد'}</div>
        <div><strong>العنوان:</strong> ${dress.governorate || ''}، ${dress.city || ''}، ${dress.address || ''}</div>
        <div><strong>الماركة:</strong> ${dress.brand || 'غير محدد'}</div>
        <div><strong>اللون:</strong> ${dress.color || '-'}</div>
        <div><strong>المقاس:</strong> ${dress.size || '-'}</div>
        <div><strong>الخامة:</strong> ${dress.fabric || 'غير محدد'}</div>
        <div><strong>سعر الإيجار:</strong> ${dress.rentPrice ? dress.rentPrice + ' ج.م' : 'غير محدد'}</div>
        <div><strong>سعر البيع:</strong> ${dress.sellPrice ? dress.sellPrice + ' ج.م' : 'غير محدد'}</div>
        <div><strong>قيمة التأمين:</strong> ${dress.deposit ? dress.deposit + ' ج.م' : 'غير محدد'}</div>
        <div><strong>الملحقات:</strong> ${(dress.accessories && dress.accessories.length) ? dress.accessories.join('، ') : 'بدون ملحقات'}</div>
      </div>

      <div style="background: var(--surface-input); padding: 16px; border-radius: 12px; font-size: 0.9rem; margin-bottom: 24px;">
        <strong>ملاحظات المالكة:</strong> ${dress.notes || 'لا يوجد ملاحظات إضافية'}
      </div>

      <div style="display: flex; gap: 12px; justify-content: flex-end;">
        <button type="button" class="btn-sm btn-approve" onclick="updateDressStatusDirect('${dress.id}', 'approved')">قبول الفستان ✨</button>
        <button type="button" class="btn-sm btn-reject" onclick="updateDressStatusDirect('${dress.id}', 'rejected')">رفض الفستان ❌</button>
        <button type="button" class="btn-sm" style="background: var(--status-rejected); color:#FFF;" onclick="deleteDressDirect('${dress.id}')">حذف نهائياً 🗑️</button>
      </div>
    `;

    elModalOverlay.classList.add('active');
  }

  window.updateDressStatusDirect = async function(id, newStatus) {
    await updateDressStatus(id, newStatus);
    elModalOverlay.classList.remove('active');
  };

  window.deleteDressDirect = async function(id) {
    if (confirm('هل أنت متأكد من حذف هذا الفستان نهائياً من قاعدة البيانات؟')) {
      await db.collection('dresses').doc(id).delete();
      elModalOverlay.classList.remove('active');
    }
  };

  elBtnCloseModal.addEventListener('click', () => {
    elModalOverlay.classList.remove('active');
  });

  elModalOverlay.addEventListener('click', (e) => {
    if (e.target === elModalOverlay) {
      elModalOverlay.classList.remove('active');
    }
  });
});
