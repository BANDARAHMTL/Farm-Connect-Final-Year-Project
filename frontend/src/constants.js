// ═════════════════════════════════════════════════════════════
// BOOKING PAGE CONSTANTS
// ═════════════════════════════════════════════════════════════

// Session time slots and their durations
export const SESSION_LABELS = ["6-9am", "9-12am", "12-3pm", "3-6pm", "6-9pm", "9-12pm"];
export const SESSION_DURATIONS = [3, 3, 3, 2, 3, 3];

// Default locations used as fallback
export const FALLBACK_LOCATIONS = ["Polonnaruwa", "Anuradhapura", "Ampara", "Trincomalee", "Kurunegala", "Kandy"];

// Hero slideshow data for booking page
export const HERO_SLIDES = [
  {
    img: "https://as1.ftcdn.net/v2/jpg/09/51/54/28/1000_F_951542872_JKqzGL542DkS0SXaCcwMX7QAOqahG1Jw.jpg",
    sub: "Tractors, harvesters & more",
  },
  {
    img: "https://tse1.mm.bing.net/th/id/OIP.Bc-0XefIbXGwjnEpO0govwHaEO?rs=1&pid=ImgDetMain&o=7&rm=3",
    sub: "Verified operators across Sri Lanka",
  },
  {
    img: "https://mir-s3-cdn-cf.behance.net/project_modules/1400/59d28f69474933.5b83dc2f4ecf6.png",
    sub: "Book online, pay securely",
  },
];

// Default form state for bookings
export const DEFAULT_BOOKING_FORM = {
  farmerName: "",
  farmerId: "",
  address: "",
  area: "",
  payment: "online",
};
