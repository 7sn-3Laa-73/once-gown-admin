/**
 * Once Gown Admin - Luxury Bilingual Copywriting System
 * English & Arabic Dictionaries for Admin Dashboard
 */

const adminTranslations = {
  en: {
    // Brand & Header
    "admin.title": "Once Gown Admin",
    "admin.subtitle": "Haute Couture Review & Management Panel",
    "admin.loginTitle": "Once Gown Admin",
    "admin.loginSubtitle": "Sign in to access the curation dashboard",
    "admin.emailLabel": "Admin Email",
    "admin.passwordLabel": "Password",
    "admin.loginBtn": "Sign In ✨",
    "admin.logoutBtn": "Sign Out",
    "admin.invalidLogin": "Invalid login credentials. Please use designated admin email.",

    // Stat Metrics
    "stat.total": "Total Gowns",
    "stat.pending": "Pending Review",
    "stat.approved": "Approved & Featured",
    "stat.rejected": "Rejected",

    // Search & Filter Toolbar
    "toolbar.searchPlaceholder": "Search by owner name, WhatsApp, governorate, brand, color, or size...",
    "filter.all": "All Submissions",
    "filter.pending": "Pending ⏳",
    "filter.approved": "Approved ✨",
    "filter.rejected": "Rejected ❌",
    "toolbar.noResults": "No gown submissions found matching the selected filter.",

    // Dress Cards & Actions
    "card.owner": "Owner:",
    "card.whatsapp": "WhatsApp",
    "card.governorate": "Governorate:",
    "card.color": "Color:",
    "card.size": "Size:",
    "card.brand": "Brand:",
    "card.listingType": "Listing Type:",
    "card.currentStatus": "Current Status:",
    "card.detailsBtn": "Full Details",
    "card.approveBtn": "Approve",
    "card.rejectBtn": "Reject",
    "card.deleteBtn": "Delete",
    "status.pending": "Pending Review ⏳",
    "status.approved": "Approved ✨",
    "status.rejected": "Rejected ❌",

    // Detail Modal & Rejection Prompt
    "modal.title": "Gown Submission Inspection",
    "modal.rejectPromptTitle": "Specify Rejection Reason",
    "modal.rejectPromptDesc": "Please state the reason for rejecting this gown submission so the owner can view it on their tracking link:",
    "modal.rejectPlaceholder": "e.g. Photography is low resolution, sizing details incomplete, Hemline condition notes needed...",
    "modal.confirmRejectBtn": "Confirm Rejection ❌",
    "modal.rejectionReasonLabel": "Rejection Reason Provided:",
    "modal.ownerSection": "Client Identity & Contact",
    "modal.ownerName": "Full Name:",
    "modal.phone": "WhatsApp Number:",
    "modal.secondPhone": "Alternative Phone:",
    "modal.location": "Pickup Location:",
    "modal.specsSection": "Specifications & Sizing",
    "modal.readyOrTailored": "Couture Type:",
    "modal.tailorName": "Atelier / Designer:",
    "modal.weightRange": "Recommended Weight:",
    "modal.heightRange": "Recommended Height:",
    "modal.conditionSection": "Condition & Alterations",
    "modal.condition": "Garment Condition:",
    "modal.defects": "Minor Flaws / Notes:",
    "modal.alterations": "Custom Fitting Allowed:",
    "modal.financialSection": "Valuation & Pricing",
    "modal.rentPrice": "Rental Fee:",
    "modal.sellPrice": "Sale Price:",
    "modal.notesSection": "Owner Notes & Special Care",
    "modal.noNotes": "No additional notes provided.",
    "modal.none": "None",
    "modal.yes": "Yes",
    "modal.no": "No",
    "modal.currency": "EGP"
  },

  ar: {
    // Brand & Header
    "admin.title": "Once Gown Admin",
    "admin.subtitle": "لوحة مراجعة الفساتين وإدارتها الفاخرة",
    "admin.loginTitle": "Once Gown Admin",
    "admin.loginSubtitle": "تسجيل الدخول إلى لوحة التحكم والإدارة",
    "admin.emailLabel": "البريد الإلكتروني للإدمن",
    "admin.passwordLabel": "كلمة المرور",
    "admin.loginBtn": "تسجيل الدخول ✨",
    "admin.logoutBtn": "تسجيل الخروج",
    "admin.invalidLogin": "بيانات الدخول غير صحيحة. يرجى استخدام بريد الإدمن المعين.",

    // Stat Metrics
    "stat.total": "إجمالي الفساتين",
    "stat.pending": "قيد المراجعة",
    "stat.approved": "مقبولة ومرفوعة",
    "stat.rejected": "مرفوضة",

    // Search & Filter Toolbar
    "toolbar.searchPlaceholder": "ابحث باسم المالكة، الواتساب، المحافظة، الماركة، اللون، أو المقاس...",
    "filter.all": "الكل",
    "filter.pending": "قيد المراجعة ⏳",
    "filter.approved": "المقبولة ✨",
    "filter.rejected": "المرفوضة ❌",
    "toolbar.noResults": "لا توجد فساتين مطابقة للفلتر المحدد حتى الآن.",

    // Dress Cards & Actions
    "card.owner": "المالكة:",
    "card.whatsapp": "واتساب",
    "card.governorate": "المحافظة:",
    "card.color": "اللون:",
    "card.size": "المقاس:",
    "card.brand": "الماركة:",
    "card.listingType": "نوع العرض:",
    "card.currentStatus": "الحالة الحالية:",
    "card.detailsBtn": "التفاصيل الكاملة",
    "card.approveBtn": "قبول",
    "card.rejectBtn": "رفض",
    "card.deleteBtn": "حذف",
    "status.pending": "قيد المراجعة ⏳",
    "status.approved": "مقبول ✨",
    "status.rejected": "مرفوض ❌",

    // Detail Modal & Rejection Prompt
    "modal.title": "معاينة تفاصيل الفستان",
    "modal.rejectPromptTitle": "توضيح سبب عدم القبول",
    "modal.rejectPromptDesc": "اكتبي سبب عدم قبول هذا الطلب ليظهر لصاحبة الفستان عند متابعة الرابط الخاص بها:",
    "modal.rejectPlaceholder": "مثال: الصور غير واضحة، يرجى إعادة الرفع بصور أكثر إضاءة، أو المقاس غير محدد بدقة...",
    "modal.confirmRejectBtn": "تأكيد عدم القبول ❌",
    "modal.rejectionReasonLabel": "سبب عدم القبول الموضح:",
    "modal.ownerSection": "بيانات المالكة والتواصل",
    "modal.ownerName": "الاسم بالكامل:",
    "modal.phone": "رقم الواتساب:",
    "modal.secondPhone": "رقم إضافي:",
    "modal.location": "عنوان المعاينة والشحن:",
    "modal.specsSection": "مواصفات الفستان والقياسات",
    "modal.readyOrTailored": "نوع التفصيل:",
    "modal.tailorName": "الأتيليه / المصمم:",
    "modal.weightRange": "الوزن المناسب:",
    "modal.heightRange": "الطول المناسب:",
    "modal.conditionSection": "حالة الفستان والتعديلات",
    "modal.condition": "حالة الفستان:",
    "modal.defects": "ملاحظات أو عيوب:",
    "modal.alterations": "السماح بتعديل بسيط:",
    "modal.financialSection": "تفاصيل الأسعار والماليات",
    "modal.rentPrice": "سعر الإيجار:",
    "modal.sellPrice": "سعر البيع:",
    "modal.notesSection": "ملاحظات إضافية من المالكة",
    "modal.noNotes": "لا توجد ملاحظات إضافية.",
    "modal.none": "لا يوجد",
    "modal.yes": "نعم",
    "modal.no": "لا",
    "modal.currency": "ج.م"
  }
};

class AdminI18nService {
  constructor() {
    this.currentLang = localStorage.getItem('once_gown_admin_lang') || 'ar';
  }

  get lang() {
    return this.currentLang;
  }

  t(key) {
    const dict = adminTranslations[this.currentLang] || adminTranslations.ar;
    return dict[key] || adminTranslations.ar[key] || key;
  }

  setLanguage(lang) {
    if (!adminTranslations[lang]) return;
    this.currentLang = lang;
    localStorage.setItem('once_gown_admin_lang', lang);

    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    this.applyToDOM();
    window.dispatchEvent(new CustomEvent('adminLanguageChanged', { detail: { lang } }));
  }

  applyToDOM() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = this.t(key);
      if (translation) {
        el.textContent = translation;
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const translation = this.t(key);
      if (translation) {
        el.placeholder = translation;
      }
    });

    document.querySelectorAll('.lang-option').forEach(el => {
      if (el.getAttribute('data-lang') === this.currentLang) {
        el.classList.add('active-lang');
      } else {
        el.classList.remove('active-lang');
      }
    });
  }
}

window.adminI18n = new AdminI18nService();
