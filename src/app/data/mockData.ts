export const formatPrice = (price: number) =>
  `${price.toLocaleString("fr-FR")} FCFA`;

export const restaurant = {
  name: "Le Palmier",
  emoji: "🌴",
  tagline: "Cuisine Africaine & Internationale",
  address: "Avenue Jean-Paul II, Cotonou, Bénin",
  phone: "+229 97 12 34 56",
  subdomain: "lepalmier",
};

export const categories = ["Tout", "Entrées", "Plats", "Grillades", "Boissons", "Desserts"];

export interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  photo: string;
  badges: ("vegetarian" | "spicy" | "popular")[];
  available: boolean;
}

export const menuItems: MenuItem[] = [
  {
    id: 1, name: "Salade du Chef", category: "Entrées", price: 2500,
    description: "Fraîche salade de saison, vinaigrette au citron et herbes du jardin",
    photo: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=225&fit=crop&auto=format",
    badges: ["vegetarian"], available: true,
  },
  {
    id: 2, name: "Accra de haricots", category: "Entrées", price: 1500,
    description: "Beignets croustillants de haricots noirs, sauce pimentée maison",
    photo: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=225&fit=crop&auto=format",
    badges: ["vegetarian", "spicy"], available: true,
  },
  {
    id: 3, name: "Soupe de poisson", category: "Entrées", price: 3000,
    description: "Bouillon léger, poisson frais du marché, légumes du jour",
    photo: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=225&fit=crop&auto=format",
    badges: ["popular"], available: true,
  },
  {
    id: 4, name: "Riz au Poulet DG", category: "Plats", price: 4500,
    description: "Riz pilé au poulet, sauce tomate, banane plantain frite, légumes sautés",
    photo: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&h=225&fit=crop&auto=format",
    badges: ["popular"], available: true,
  },
  {
    id: 5, name: "Jollof rice aux crevettes", category: "Plats", price: 5000,
    description: "Riz jollof parfumé aux crevettes géantes, sauce épicée du Sénégal",
    photo: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=225&fit=crop&auto=format",
    badges: ["spicy", "popular"], available: true,
  },
  {
    id: 6, name: "Atiéké poisson braisé", category: "Plats", price: 3500,
    description: "Semoule de manioc, poisson braisé au charbon, sauce tomate et oignons",
    photo: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=225&fit=crop&auto=format",
    badges: ["popular"], available: true,
  },
  {
    id: 7, name: "Légumes sautés au tofu", category: "Plats", price: 3000,
    description: "Wok de légumes frais, tofu grillé, sauce gingembre-soja",
    photo: "https://images.unsplash.com/photo-1540189549336-e6545e79c3b5?w=400&h=225&fit=crop&auto=format",
    badges: ["vegetarian"], available: false,
  },
  {
    id: 8, name: "Brochettes de bœuf", category: "Grillades", price: 4500,
    description: "Brochettes marinées aux épices, sauce arachide maison",
    photo: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=225&fit=crop&auto=format",
    badges: ["spicy", "popular"], available: true,
  },
  {
    id: 9, name: "Tilapia grillé entier", category: "Grillades", price: 5500,
    description: "Tilapia frais grillé au charbon, herbes fraîches, citron vert",
    photo: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=225&fit=crop&auto=format",
    badges: ["popular"], available: true,
  },
  {
    id: 10, name: "Côtelettes d'agneau", category: "Grillades", price: 6000,
    description: "Côtelettes marinées au romarin, purée de patate douce",
    photo: "https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=225&fit=crop&auto=format",
    badges: [], available: true,
  },
  {
    id: 11, name: "Bissap frais", category: "Boissons", price: 500,
    description: "Jus d'hibiscus maison, légèrement sucré, servi frais",
    photo: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&h=225&fit=crop&auto=format",
    badges: ["vegetarian", "popular"], available: true,
  },
  {
    id: 12, name: "Jus de gingembre", category: "Boissons", price: 600,
    description: "Gingembre frais pressé, citron vert, menthe du jardin",
    photo: "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=400&h=225&fit=crop&auto=format",
    badges: ["vegetarian"], available: true,
  },
  {
    id: 13, name: "Bière Flag", category: "Boissons", price: 1200,
    description: "Bière béninoise locale, 33cl, bien fraîche",
    photo: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=225&fit=crop&auto=format",
    badges: [], available: true,
  },
  {
    id: 14, name: "Eau minérale", category: "Boissons", price: 300,
    description: "Eau minérale naturelle, 50cl",
    photo: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=225&fit=crop&auto=format",
    badges: ["vegetarian"], available: true,
  },
  {
    id: 15, name: "Tarte au chocolat", category: "Desserts", price: 2000,
    description: "Tarte fondante au chocolat noir 70%, coulis de caramel beurre salé",
    photo: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=225&fit=crop&auto=format",
    badges: ["vegetarian"], available: true,
  },
  {
    id: 16, name: "Salade de fruits tropicaux", category: "Desserts", price: 1500,
    description: "Mangue, ananas, papaye, banane, sirop de vanille bourbon",
    photo: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400&h=225&fit=crop&auto=format",
    badges: ["vegetarian", "popular"], available: true,
  },
];

export type TableStatus = "libre" | "occupee" | "commande_attente" | "paiement" | "appel";

export interface TableData {
  id: number;
  number: number;
  zone: string;
  capacity: number;
  status: TableStatus;
  pendingOrders: number;
  hasCall?: boolean;
}

export const tables: TableData[] = [
  { id: 1, number: 1, zone: "Terrasse", capacity: 2, status: "libre", pendingOrders: 0 },
  { id: 2, number: 2, zone: "Terrasse", capacity: 4, status: "commande_attente", pendingOrders: 2 },
  { id: 3, number: 3, zone: "Terrasse", capacity: 4, status: "occupee", pendingOrders: 0 },
  { id: 4, number: 4, zone: "Terrasse", capacity: 6, status: "appel", pendingOrders: 1, hasCall: true },
  { id: 5, number: 5, zone: "Terrasse", capacity: 2, status: "paiement", pendingOrders: 0 },
  { id: 6, number: 6, zone: "Salle principale", capacity: 4, status: "libre", pendingOrders: 0 },
  { id: 7, number: 7, zone: "Salle principale", capacity: 4, status: "commande_attente", pendingOrders: 3 },
  { id: 8, number: 8, zone: "Salle principale", capacity: 6, status: "occupee", pendingOrders: 0 },
  { id: 9, number: 9, zone: "Salle principale", capacity: 4, status: "libre", pendingOrders: 0 },
  { id: 10, number: 10, zone: "Salle principale", capacity: 2, status: "occupee", pendingOrders: 0 },
  { id: 11, number: 11, zone: "Salle principale", capacity: 4, status: "commande_attente", pendingOrders: 1 },
  { id: 12, number: 12, zone: "Salle principale", capacity: 8, status: "paiement", pendingOrders: 0 },
  { id: 13, number: 13, zone: "VIP", capacity: 6, status: "libre", pendingOrders: 0 },
  { id: 14, number: 14, zone: "VIP", capacity: 8, status: "occupee", pendingOrders: 0 },
  { id: 15, number: 15, zone: "VIP", capacity: 10, status: "commande_attente", pendingOrders: 2 },
];

export type OrderItemStatus = "en_attente" | "en_preparation" | "pret" | "servi";

export interface OrderItem {
  id: number;
  menuItemId: number;
  name: string;
  quantity: number;
  price: number;
  note?: string;
  status: OrderItemStatus;
}

export interface Order {
  id: string;
  tableId: number;
  tableNumber: number;
  clientName?: string;
  items: OrderItem[];
  sentAt: string;
  status: "en_attente" | "en_preparation" | "pret" | "servi";
  isLate?: boolean;
}

export const activeOrders: Order[] = [
  {
    id: "CMD-001", tableId: 2, tableNumber: 2, clientName: "Kouassi",
    items: [
      { id: 1, menuItemId: 4, name: "Riz au Poulet DG", quantity: 2, price: 4500, status: "en_preparation" },
      { id: 2, menuItemId: 11, name: "Bissap frais", quantity: 2, price: 500, note: "bien frais", status: "pret" },
    ],
    sentAt: "19:32", status: "en_preparation", isLate: false,
  },
  {
    id: "CMD-002", tableId: 4, tableNumber: 4, clientName: "Amina",
    items: [
      { id: 3, menuItemId: 9, name: "Tilapia grillé entier", quantity: 1, price: 5500, status: "en_preparation" },
      { id: 4, menuItemId: 8, name: "Brochettes de bœuf", quantity: 2, price: 4500, note: "sans piment", status: "en_attente" },
      { id: 5, menuItemId: 13, name: "Bière Flag", quantity: 2, price: 1200, status: "pret" },
    ],
    sentAt: "19:15", status: "en_preparation", isLate: true,
  },
  {
    id: "CMD-003", tableId: 7, tableNumber: 7,
    items: [
      { id: 6, menuItemId: 5, name: "Jollof rice crevettes", quantity: 3, price: 5000, status: "en_attente" },
      { id: 7, menuItemId: 3, name: "Soupe de poisson", quantity: 1, price: 3000, status: "en_preparation" },
    ],
    sentAt: "19:45", status: "en_attente",
  },
  {
    id: "CMD-004", tableId: 11, tableNumber: 11, clientName: "Rodrigue",
    items: [
      { id: 8, menuItemId: 6, name: "Atiéké poisson braisé", quantity: 2, price: 3500, note: "bien cuit", status: "en_preparation" },
      { id: 9, menuItemId: 12, name: "Jus de gingembre", quantity: 2, price: 600, status: "pret" },
    ],
    sentAt: "19:50", status: "en_preparation",
  },
  {
    id: "CMD-005", tableId: 15, tableNumber: 15,
    items: [
      { id: 10, menuItemId: 1, name: "Salade du Chef", quantity: 2, price: 2500, status: "en_attente" },
      { id: 11, menuItemId: 10, name: "Côtelettes d'agneau", quantity: 2, price: 6000, status: "en_attente" },
      { id: 12, menuItemId: 14, name: "Eau minérale", quantity: 4, price: 300, status: "en_attente" },
    ],
    sentAt: "19:58", status: "en_attente",
  },
];

export const weeklyRevenue = [
  { day: "Lun", revenue: 87500, orders: 18 },
  { day: "Mar", revenue: 112000, orders: 24 },
  { day: "Mer", revenue: 95000, orders: 20 },
  { day: "Jeu", revenue: 134500, orders: 29 },
  { day: "Ven", revenue: 186000, orders: 41 },
  { day: "Sam", revenue: 224000, orders: 52 },
  { day: "Dim", revenue: 156000, orders: 35 },
];

export const hourlyOrders = [
  { hour: "11h", orders: 3 }, { hour: "12h", orders: 12 }, { hour: "13h", orders: 18 },
  { hour: "14h", orders: 8 }, { hour: "15h", orders: 4 }, { hour: "16h", orders: 2 },
  { hour: "17h", orders: 5 }, { hour: "18h", orders: 9 }, { hour: "19h", orders: 22 },
  { hour: "20h", orders: 28 }, { hour: "21h", orders: 24 }, { hour: "22h", orders: 11 },
];

export const topDishes = [
  { name: "Jollof rice crevettes", sold: 147, revenue: 735000 },
  { name: "Riz au Poulet DG", sold: 132, revenue: 594000 },
  { name: "Tilapia grillé entier", sold: 98, revenue: 539000 },
  { name: "Brochettes de bœuf", sold: 87, revenue: 391500 },
  { name: "Atiéké poisson braisé", sold: 76, revenue: 266000 },
];

export interface StaffMember {
  id: number;
  name: string;
  email: string;
  role: "admin" | "serveur" | "cuisine";
  active: boolean;
  lastSeen: string;
  pin?: string;
}

export const staff: StaffMember[] = [
  { id: 1, name: "Djidjoho Mensah", email: "djidjoho@lepalmier.com", role: "admin", active: true, lastSeen: "Aujourd'hui 19:45" },
  { id: 2, name: "Fatoumata Traoré", email: "fatoumata@lepalmier.com", role: "serveur", active: true, lastSeen: "Aujourd'hui 19:58" },
  { id: 3, name: "Kofi Asante", email: "kofi@lepalmier.com", role: "serveur", active: true, lastSeen: "Aujourd'hui 18:30" },
  { id: 4, name: "Bintou Coulibaly", email: "bintou@lepalmier.com", role: "cuisine", active: true, lastSeen: "Aujourd'hui 19:50" },
  { id: 5, name: "Yves Houngbédji", email: "yves@lepalmier.com", role: "cuisine", active: false, lastSeen: "Hier 22:15" },
];

export interface SaasRestaurant {
  id: number;
  name: string;
  subdomain: string;
  owner: string;
  email: string;
  country: string;
  city: string;
  plan: "starter" | "pro" | "enterprise";
  status: "trial" | "active" | "past_due" | "suspended";
  tables: number;
  ordersThisMonth: number;
  registeredAt: string;
  mrr: number;
}

export const saasRestaurants: SaasRestaurant[] = [
  { id: 1, name: "Le Palmier", subdomain: "lepalmier", owner: "Djidjoho Mensah", email: "djidjoho@lepalmier.com", country: "Bénin", city: "Cotonou", plan: "pro", status: "active", tables: 15, ordersThisMonth: 847, registeredAt: "12 Jan 2025", mrr: 15000 },
  { id: 2, name: "Chez Maman Benz", subdomain: "mamanbenz", owner: "Adjoua Konan", email: "adjoua@mamanbenz.com", country: "Côte d'Ivoire", city: "Abidjan", plan: "starter", status: "active", tables: 8, ordersThisMonth: 412, registeredAt: "03 Fév 2025", mrr: 7500 },
  { id: 3, name: "Restaurant du Fleuve", subdomain: "dufleuve", owner: "Moussa Diallo", email: "moussa@dufleuve.sn", country: "Sénégal", city: "Dakar", plan: "pro", status: "active", tables: 20, ordersThisMonth: 1203, registeredAt: "28 Jan 2025", mrr: 15000 },
  { id: 4, name: "La Terrasse Dorée", subdomain: "terrassedoree", owner: "Aminata Bah", email: "aminata@terrasse.gn", country: "Guinée", city: "Conakry", plan: "starter", status: "past_due", tables: 6, ordersThisMonth: 89, registeredAt: "15 Mar 2025", mrr: 0 },
  { id: 5, name: "Saveurs du Mali", subdomain: "saveursmali", owner: "Oumar Keïta", email: "oumar@saveursmali.com", country: "Mali", city: "Bamako", plan: "enterprise", status: "trial", tables: 35, ordersThisMonth: 234, registeredAt: "01 Avr 2025", mrr: 0 },
  { id: 6, name: "Brasserie Lomé", subdomain: "brasserielome", owner: "Kossivi Adzaho", email: "kossivi@brasserielome.tg", country: "Togo", city: "Lomé", plan: "starter", status: "suspended", tables: 10, ordersThisMonth: 0, registeredAt: "20 Déc 2024", mrr: 0 },
];

export interface Registration {
  id: number;
  restaurantName: string;
  ownerName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  subdomain: string;
  subdomainAvailable: boolean;
  plan: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
}

export const registrations: Registration[] = [
  { id: 1, restaurantName: "Le Baobab Bleu", ownerName: "Issouf Compaoré", email: "issouf@baobabbleu.bf", phone: "+226 70 11 22 33", country: "Burkina Faso", city: "Ouagadougou", subdomain: "baobabbleu", subdomainAvailable: true, plan: "Pro", submittedAt: "14 Juin 2025 · 09:14", status: "pending" },
  { id: 2, restaurantName: "Resto Tropical", ownerName: "Nafissatou Dieng", email: "nafissatou@tropical.sn", phone: "+221 77 00 11 22", country: "Sénégal", city: "Saint-Louis", subdomain: "restotropical", subdomainAvailable: true, plan: "Starter", submittedAt: "13 Juin 2025 · 16:42", status: "pending" },
  { id: 3, restaurantName: "Maquis du Port", ownerName: "Jean-Claude Ahivi", email: "jcahivi@maquisdport.bj", phone: "+229 95 88 77 66", country: "Bénin", city: "Cotonou", subdomain: "maquisdport", subdomainAvailable: false, plan: "Starter", submittedAt: "12 Juin 2025 · 11:05", status: "pending" },
];

export const saasPlan = [
  {
    id: "starter", name: "Starter", price: 7500, currency: "FCFA/mois",
    active: true,
    features: ["Jusqu'à 10 tables", "Menu illimité", "QR codes inclus", "Support email", "1 compte staff"],
    limits: { tables: 10, staff: 1, orders: 500 },
  },
  {
    id: "pro", name: "Pro", price: 15000, currency: "FCFA/mois",
    active: true,
    features: ["Jusqu'à 25 tables", "Menu illimité", "QR codes inclus", "Support prioritaire", "5 comptes staff", "Statistiques avancées"],
    limits: { tables: 25, staff: 5, orders: 2000 },
  },
  {
    id: "enterprise", name: "Enterprise", price: 35000, currency: "FCFA/mois",
    active: true,
    features: ["Tables illimitées", "Menu illimité", "QR codes inclus", "Support dédié 24/7", "Staff illimité", "API access", "Branding personnalisé"],
    limits: { tables: 9999, staff: 9999, orders: 9999 },
  },
];

export const mrrMonthly = [
  { month: "Jan", mrr: 45000 }, { month: "Fév", mrr: 67500 },
  { month: "Mar", mrr: 90000 }, { month: "Avr", mrr: 112500 },
  { month: "Mai", mrr: 135000 }, { month: "Juin", mrr: 157500 },
];
