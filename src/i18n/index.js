import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  ar: {
    translation: {
      // Navigation
      "nav.products": "المنتجات",
      "nav.engineers": "المهندسين",
      "nav.shops": "المحلات",
      "nav.calculator": "الحاسبة الشمسية",
      "nav.brand": "قافزة الشمسية",
      "nav.shopAds": "إعلانات المحلات",

      // Homepage
      "home.hero.title": "قافزة الشمسية",
      "home.hero.subtitle": "منصة شاملة للطاقة الشمسية في اليمن",
      "home.hero.description":
        "اكتشف المنتجات، تواصل مع المهندسين، وابحث عن المحلات المعتمدة",
      "home.hero.calculator": "احسب احتياجاتك الشمسية",
      "home.services.title": "خدماتنا",
      "home.categories.solar.title": "المنتجات الشمسية",
      "home.categories.solar.subtitle": "اكتشف أفضل المنتجات الشمسية",
      "home.categories.solar.description":
        "ألواح شمسية، بطاريات، محولات، وأكثر من ذلك",
      "home.categories.engineers.title": "المهندسين المعتمدين",
      "home.categories.engineers.subtitle": "تواصل مع مهندسين محترفين",
      "home.categories.engineers.description":
        "مهندسون معتمدون لتركيب وصيانة الأنظمة الشمسية",
      "home.categories.shops.title": "المحلات المعتمدة",
      "home.categories.shops.subtitle": "تسوق من محلات موثوقة",
      "home.categories.shops.description": "محلات معتمدة لبيع المنتجات الشمسية",
      "home.explore": "استكشف الآن",
      "home.why.title": "لماذا قافزة الشمسية؟",
      "home.why.products.title": "منتجات معتمدة",
      "home.why.products.description":
        "جميع المنتجات معتمدة ومختبرة لضمان الجودة والأمان",
      "home.why.engineers.title": "مهندسون محترفون",
      "home.why.engineers.description":
        "فريق من المهندسين المعتمدين ذوي الخبرة في مجال الطاقة الشمسية",
      "home.why.service.title": "خدمة عملاء متميزة",
      "home.why.service.description":
        "دعم فني متواصل وخدمة عملاء على مدار الساعة",

      // Products
      "products.title": "المنتجات الشمسية",
      "products.filters.title": "الفلاتر",
      "products.filters.search": "البحث",
      "products.filters.category": "الفئة",
      "products.filters.brand": "العلامة التجارية",
      "products.filters.price": "نطاق السعر (ريال يمني)",
      "products.filters.all": "الكل",
      "products.categories.solar": "ألواح شمسية",
      "products.categories.batteries": "بطاريات",
      "products.categories.inverters": "محولات",
      "products.categories.accessories": "ملحقات",
      "products.viewDetails": "عرض التفاصيل",
      "products.noResults": "لم يتم العثور على منتجات تطابق معايير البحث",

      // Engineers
      "engineers.title": "المهندسين المعتمدين",
      "engineers.filters.location": "الموقع",
      "engineers.filters.experience": "الخبرة",
      "engineers.filters.rating": "التقييم",
      "engineers.experience.1-3": "1-3 سنوات",
      "engineers.experience.3-5": "3-5 سنوات",
      "engineers.experience.5-10": "5-10 سنوات",
      "engineers.experience.10+": "10+ سنوات",
      "engineers.rating.4.5+": "4.5+",
      "engineers.rating.4.0+": "4.0+",
      "engineers.rating.3.5+": "3.5+",
      "engineers.rating.3.0+": "3.0+",
      "engineers.projects": "مشروع",
      "engineers.viewProfile": "عرض الملف الشخصي",
      "engineers.noResults": "لم يتم العثور على مهندسين يطابقون معايير البحث",

      // Shops
      "shops.title": "المحلات المعتمدة",
      "shops.filters.services": "الخدمات",
      "shops.services.sales": "بيع المنتجات",
      "shops.services.installation": "تركيب الأنظمة",
      "shops.services.maintenance": "الصيانة",
      "shops.services.consultation": "الاستشارات",
      "shops.services.design": "التصميم",
      "shops.established": "تأسس في",
      "shops.workingHours": "ساعات العمل",
      "shops.viewDetails": "عرض التفاصيل",
      "shops.noResults": "لم يتم العثور على محلات تطابق معايير البحث",

      // Common
      "common.back": "العودة",
      "common.contact": "تواصل",
      "common.requestQuote": "طلب عرض سعر",
      "common.requestConsultation": "طلب استشارة",
      "common.phone": "الهاتف",
      "common.email": "البريد الإلكتروني",
      "common.location": "الموقع",
      "common.address": "العنوان",
      "common.workingHours": "ساعات العمل",
      "common.established": "سنة التأسيس",
      "common.teamSize": "حجم الفريق",
      "common.projectsCompleted": "المشاريع المنجزة",
      "common.responseTime": "وقت الاستجابة",
      "common.warranty": "الضمان والخدمة",
      "common.paymentOptions": "طرق الدفع المقبولة",
      "common.specifications": "المواصفات الفنية",
      "common.features": "المميزات",
      "common.seller": "معلومات البائع",
      "common.specialties": "التخصصات",
      "common.services": "الخدمات المقدمة",
      "common.certifications": "الشهادات والاعتمادات",
      "common.recentProjects": "المشاريع الحديثة",
      "common.contactInfo": "معلومات التواصل",
      "common.servicesOffered": "الخدمات المقدمة",
      "common.availableProducts": "المنتجات المتوفرة",
      "common.approvedBrands": "العلامات التجارية المعتمدة",
      "common.shopStats": "إحصائيات المحل",
      "common.additionalInfo": "معلومات إضافية",

      // Locations
      "locations.sanaa": "صنعاء",
      "locations.aden": "عدن",
      "locations.taiz": "تعز",
      "locations.hodeidah": "الحديدة",
      "locations.ibb": "إب",
      "locations.hadramout": "حضرموت",

      // Payment methods
      "payment.cash": "نقداً",
      "payment.checks": "شيكات",
      "payment.installment": "تقسيط",
      "payment.bankTransfer": "تحويل بنكي",

      // Solar Calculator
      "calculator.title": "الحاسبة الشمسية",
      "calculator.appliance": "الجهاز",
      "calculator.quantity": "الكمية",
      "calculator.watt": "الواط (و)",
      "calculator.hoursPerDay": "الساعات/اليوم",
      "calculator.calculate": "احسب",
      "calculator.results": "النتائج",
      "calculator.totalDailyEnergy": "إجمالي الطاقة اليومية",
      "calculator.peakLoad": "الحد الأقصى للحمل",
      "calculator.solarPanels": "الألواح الشمسية",
      "calculator.batterySize": "حجم البطارية",
      "calculator.inverterSize": "حجم المحول",
      "calculator.appliances.light": "إضاءة (LED)",
      "calculator.appliances.fan": "مروحة",
      "calculator.appliances.refrigerator": "ثلاجة",
      "calculator.appliances.iron": "مكواة",
      "calculator.appliances.other": "أخرى",
      "calculator.batteryDetails": "(12V, 50% DoD)",
      "calculator.total": "إجمالي",
    },
  },
  en: {
    translation: {
      // Navigation
      "nav.products": "Products",
      "nav.engineers": "Engineers",
      "nav.shops": "Shops",
      "nav.calculator": "Solar Calculator",
      "nav.brand": "Qafzh Solar",
      "nav.shopAds": "Shop Ads",

      // Homepage
      "home.hero.title": "Qafzh Solar",
      "home.hero.subtitle": "Comprehensive Solar Energy Platform in Yemen",
      "home.hero.description":
        "Discover products, connect with engineers, and find verified shops",
      "home.hero.calculator": "Calculate Your Solar Needs",
      "home.services.title": "Our Services",
      "home.categories.solar.title": "Solar Products",
      "home.categories.solar.subtitle": "Discover the Best Solar Products",
      "home.categories.solar.description":
        "Solar panels, batteries, inverters, and more",
      "home.categories.engineers.title": "Certified Engineers",
      "home.categories.engineers.subtitle":
        "Connect with Professional Engineers",
      "home.categories.engineers.description":
        "Certified engineers for solar system installation and maintenance",
      "home.categories.shops.title": "Verified Shops",
      "home.categories.shops.subtitle": "Shop from Trusted Stores",
      "home.categories.shops.description":
        "Verified shops for solar product sales",
      "home.explore": "Explore Now",
      "home.why.title": "Why Qafzh Solar?",
      "home.why.products.title": "Certified Products",
      "home.why.products.description":
        "All products are certified and tested for quality and safety",
      "home.why.engineers.title": "Professional Engineers",
      "home.why.engineers.description":
        "Team of certified engineers with experience in solar energy",
      "home.why.service.title": "Excellent Customer Service",
      "home.why.service.description":
        "Continuous technical support and 24/7 customer service",

      // Products
      "products.title": "Solar Products",
      "products.filters.title": "Filters",
      "products.filters.search": "Search",
      "products.filters.category": "Category",
      "products.filters.brand": "Brand",
      "products.filters.price": "Price Range (Yemeni Rial)",
      "products.filters.all": "All",
      "products.categories.solar": "Solar Panels",
      "products.categories.batteries": "Batteries",
      "products.categories.inverters": "Inverters",
      "products.categories.accessories": "Accessories",
      "products.viewDetails": "View Details",
      "products.noResults": "No products found matching search criteria",

      // Engineers
      "engineers.title": "Certified Engineers",
      "engineers.filters.location": "Location",
      "engineers.filters.experience": "Experience",
      "engineers.filters.rating": "Rating",
      "engineers.experience.1-3": "1-3 years",
      "engineers.experience.3-5": "3-5 years",
      "engineers.experience.5-10": "5-10 years",
      "engineers.experience.10+": "10+ years",
      "engineers.rating.4.5+": "4.5+",
      "engineers.rating.4.0+": "4.0+",
      "engineers.rating.3.5+": "3.5+",
      "engineers.rating.3.0+": "3.0+",
      "engineers.projects": "projects",
      "engineers.viewProfile": "View Profile",
      "engineers.noResults": "No engineers found matching search criteria",

      // Shops
      "shops.title": "Verified Shops",
      "shops.filters.services": "Services",
      "shops.services.sales": "Product Sales",
      "shops.services.installation": "System Installation",
      "shops.services.maintenance": "Maintenance",
      "shops.services.consultation": "Consultation",
      "shops.services.design": "Design",
      "shops.established": "Established in",
      "shops.workingHours": "Working Hours",
      "shops.viewDetails": "View Details",
      "shops.noResults": "No shops found matching search criteria",

      // Common
      "common.back": "Back",
      "common.contact": "Contact",
      "common.requestQuote": "Request Quote",
      "common.requestConsultation": "Request Consultation",
      "common.phone": "Phone",
      "common.email": "Email",
      "common.location": "Location",
      "common.address": "Address",
      "common.workingHours": "Working Hours",
      "common.established": "Established",
      "common.teamSize": "Team Size",
      "common.projectsCompleted": "Projects Completed",
      "common.responseTime": "Response Time",
      "common.warranty": "Warranty & Service",
      "common.paymentOptions": "Payment Methods",
      "common.specifications": "Technical Specifications",
      "common.features": "Features",
      "common.seller": "Seller Information",
      "common.specialties": "Specialties",
      "common.services": "Services Offered",
      "common.certifications": "Certifications",
      "common.recentProjects": "Recent Projects",
      "common.contactInfo": "Contact Information",
      "common.servicesOffered": "Services Offered",
      "common.availableProducts": "Available Products",
      "common.approvedBrands": "Approved Brands",
      "common.shopStats": "Shop Statistics",
      "common.additionalInfo": "Additional Information",

      // Locations
      "locations.sanaa": "Sanaa",
      "locations.aden": "Aden",
      "locations.taiz": "Taiz",
      "locations.hodeidah": "Hodeidah",
      "locations.ibb": "Ibb",
      "locations.hadramout": "Hadramout",

      // Payment methods
      "payment.cash": "Cash",
      "payment.checks": "Checks",
      "payment.installment": "Installment",
      "payment.bankTransfer": "Bank Transfer",

      // Solar Calculator
      "calculator.title": "Solar Calculator",
      "calculator.appliance": "Appliance",
      "calculator.quantity": "Quantity",
      "calculator.watt": "Watt (W)",
      "calculator.hoursPerDay": "Hours/Day",
      "calculator.calculate": "Calculate",
      "calculator.results": "Results",
      "calculator.totalDailyEnergy": "Total Daily Energy",
      "calculator.peakLoad": "Peak Load",
      "calculator.solarPanels": "Solar Panels",
      "calculator.batterySize": "Battery Size",
      "calculator.inverterSize": "Inverter Size",
      "calculator.appliances.light": "Light (LED)",
      "calculator.appliances.fan": "Fan",
      "calculator.appliances.refrigerator": "Refrigerator",
      "calculator.appliances.iron": "Iron",
      "calculator.appliances.other": "Other",
      "calculator.batteryDetails": "(12V, 50% DoD)",
      "calculator.total": "Total",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "ar", // default language
  fallbackLng: "ar",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
