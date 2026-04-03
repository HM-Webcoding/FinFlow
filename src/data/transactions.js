// src/data/transactions.js
// 40 realistic BDT transactions | Jan–Mar 2026 | 8 categories

export const CATEGORIES = {
  SALARY:        { label: "Salary",          color: "#059669", bg: "#d1fae5", icon: "💼", type: "income"  },
  FREELANCE:     { label: "Freelance",        color: "#0284c7", bg: "#e0f2fe", icon: "💻", type: "income"  },
  FOOD:          { label: "Food & Dining",    color: "#ea580c", bg: "#ffedd5", icon: "🍽️",  type: "expense" },
  TRANSPORT:     { label: "Transport",        color: "#2563eb", bg: "#dbeafe", icon: "🚌", type: "expense" },
  SHOPPING:      { label: "Shopping",         color: "#7c3aed", bg: "#ede9fe", icon: "🛍️",  type: "expense" },
  UTILITIES:     { label: "Utilities",        color: "#475569", bg: "#f1f5f9", icon: "⚡", type: "expense" },
  HEALTH:        { label: "Health",           color: "#db2777", bg: "#fce7f3", icon: "🏥", type: "expense" },
  ENTERTAINMENT: { label: "Entertainment",    color: "#d97706", bg: "#fef3c7", icon: "🎬", type: "expense" },
}

let _id = 1
const mkId = () => `txn_${String(_id++).padStart(3, "0")}`

export const INITIAL_TRANSACTIONS = [
  // ── January 2026 ──────────────────────────
  { id: mkId(), date: "2026-01-02", description: "Monthly Salary",               category: "SALARY",        type: "income",  amount: 65000, note: "January payroll — Zorvyn FinTech"   },
  { id: mkId(), date: "2026-01-05", description: "Grocery — Meena Bazaar",       category: "FOOD",          type: "expense", amount: 2340,  note: "Weekly groceries + vegetables"      },
  { id: mkId(), date: "2026-01-07", description: "Uber Rides",                   category: "TRANSPORT",     type: "expense", amount: 870,   note: "Office commute (3 days)"            },
  { id: mkId(), date: "2026-01-09", description: "Electricity Bill — BPDB",      category: "UTILITIES",     type: "expense", amount: 1800,  note: "December usage bill"                },
  { id: mkId(), date: "2026-01-11", description: "Restaurant — Kacchi Bhai",     category: "FOOD",          type: "expense", amount: 1250,  note: "Team lunch"                         },
  { id: mkId(), date: "2026-01-14", description: "Freelance — Logo Design",      category: "FREELANCE",     type: "income",  amount: 12000, note: "Branding project for startup"       },
  { id: mkId(), date: "2026-01-15", description: "Daraz Shopping",               category: "SHOPPING",      type: "expense", amount: 3800,  note: "Winter jacket + accessories"        },
  { id: mkId(), date: "2026-01-17", description: "Doctor Visit — Square Hosp.",  category: "HEALTH",        type: "expense", amount: 1500,  note: "Routine annual checkup"             },
  { id: mkId(), date: "2026-01-19", description: "Netflix + Spotify",            category: "ENTERTAINMENT", type: "expense", amount: 950,   note: "Monthly streaming subscriptions"    },
  { id: mkId(), date: "2026-01-21", description: "CNG Rickshaw",                 category: "TRANSPORT",     type: "expense", amount: 540,   note: "Local errands"                      },
  { id: mkId(), date: "2026-01-24", description: "Pharmacy — Popular",           category: "HEALTH",        type: "expense", amount: 680,   note: "Prescribed medicines"               },
  { id: mkId(), date: "2026-01-26", description: "Internet — Grameenphone",      category: "UTILITIES",     type: "expense", amount: 999,   note: "Monthly broadband (100 Mbps)"       },
  { id: mkId(), date: "2026-01-28", description: "Coffee Shop — North End",      category: "FOOD",          type: "expense", amount: 460,   note: "Work from café (2 sessions)"        },

  // ── February 2026 ─────────────────────────
  { id: mkId(), date: "2026-02-02", description: "Monthly Salary",               category: "SALARY",        type: "income",  amount: 65000, note: "February payroll — Zorvyn FinTech"  },
  { id: mkId(), date: "2026-02-04", description: "Grocery — Shwapno",            category: "FOOD",          type: "expense", amount: 2680,  note: "Monthly groceries"                  },
  { id: mkId(), date: "2026-02-06", description: "Pathao Bike",                  category: "TRANSPORT",     type: "expense", amount: 720,   note: "Office + personal errands"          },
  { id: mkId(), date: "2026-02-09", description: "Freelance — React Dashboard",  category: "FREELANCE",     type: "income",  amount: 18000, note: "3-week web dev project"             },
  { id: mkId(), date: "2026-02-11", description: "Valentine's Dinner",           category: "FOOD",          type: "expense", amount: 3200,  note: "La Bella Vista restaurant"          },
  { id: mkId(), date: "2026-02-13", description: "Gift Shopping",                category: "SHOPPING",      type: "expense", amount: 4500,  note: "Valentine's Day gifts"              },
  { id: mkId(), date: "2026-02-15", description: "Gas Bill — Titas",             category: "UTILITIES",     type: "expense", amount: 1200,  note: "Monthly cooking gas"                },
  { id: mkId(), date: "2026-02-17", description: "Gym Membership",               category: "HEALTH",        type: "expense", amount: 2000,  note: "Monthly gym fee — Fitness First"    },
  { id: mkId(), date: "2026-02-19", description: "Movie — Star Cineplex",        category: "ENTERTAINMENT", type: "expense", amount: 1800,  note: "Tickets + popcorn (2 pax)"          },
  { id: mkId(), date: "2026-02-21", description: "Rickshaw + Metro Rail",        category: "TRANSPORT",     type: "expense", amount: 460,   note: "Mixed local commute"                },
  { id: mkId(), date: "2026-02-24", description: "Water Bill — DWASA",           category: "UTILITIES",     type: "expense", amount: 650,   note: "February water supply"              },
  { id: mkId(), date: "2026-02-26", description: "Kacchi Ali Restaurant",        category: "FOOD",          type: "expense", amount: 980,   note: "Dinner with family"                 },
  { id: mkId(), date: "2026-02-28", description: "Shoe Shopping — Bata",         category: "SHOPPING",      type: "expense", amount: 3200,  note: "Formal shoes for office"            },

  // ── March 2026 ────────────────────────────
  { id: mkId(), date: "2026-03-02", description: "Monthly Salary",               category: "SALARY",        type: "income",  amount: 65000, note: "March payroll — Zorvyn FinTech"     },
  { id: mkId(), date: "2026-03-04", description: "Grocery — Agora",              category: "FOOD",          type: "expense", amount: 2900,  note: "Monthly groceries + fruits"         },
  { id: mkId(), date: "2026-03-06", description: "Freelance — UI Kit Design",    category: "FREELANCE",     type: "income",  amount: 22000, note: "Design system for SaaS product"     },
  { id: mkId(), date: "2026-03-09", description: "Electricity + Internet Bundle",category: "UTILITIES",     type: "expense", amount: 2750,  note: "Combined bill — Feb usage"          },
  { id: mkId(), date: "2026-03-12", description: "New Sneakers — Adidas Store",  category: "SHOPPING",      type: "expense", amount: 5200,  note: "Running shoes + sports socks"       },
  { id: mkId(), date: "2026-03-14", description: "Uber + Pathao",                category: "TRANSPORT",     type: "expense", amount: 1100,  note: "Office + weekend rides"             },
  { id: mkId(), date: "2026-03-17", description: "Restaurant — Nando's Dhaka",   category: "FOOD",          type: "expense", amount: 1850,  note: "Team celebration lunch"             },
  { id: mkId(), date: "2026-03-20", description: "Annual Health Checkup",        category: "HEALTH",        type: "expense", amount: 3500,  note: "Full blood panel + consultation"    },
  { id: mkId(), date: "2026-03-22", description: "Concert Tickets",              category: "ENTERTAINMENT", type: "expense", amount: 2400,  note: "Live music — Dhaka University"      },
  { id: mkId(), date: "2026-03-25", description: "Freelance — Mobile App UI",    category: "FREELANCE",     type: "income",  amount: 15000, note: "Figma design handoff"               },
  { id: mkId(), date: "2026-03-27", description: "Book Store — Nilkhet",         category: "SHOPPING",      type: "expense", amount: 1450,  note: "Programming books + stationery"     },
  { id: mkId(), date: "2026-03-29", description: "Pharmacy + Lab Tests",         category: "HEALTH",        type: "expense", amount: 820,   note: "Follow-up meds + vitamin D test"    },
]
