export interface Product {
  id: string;
  productName: string;
  sku: string;
  category: string;
  brand: string;
  shortDescription: string;
  description: string;
  costPrice: number;
  sellingPrice: number;
  discountPrice: number;
  stock: number;
  weight: number;
  dimensions: { length: number; width: number; height: number };
  variants: { type: string; values: string[] }[];
  tags: string[];
  featured: boolean;
  isActive: boolean;
  images: string[];
  thumbnails: string[];
  createdAt: { seconds: number; nanoseconds: number };
  updatedAt: { seconds: number; nanoseconds: number };
}

export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
  variant?: { type: string; value: string };
}

export interface Order {
  id: string;
  userId: string;
  customer: { firstName: string; lastName: string; email: string; phone: string };
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  couponCode: string | null;
  paymentMethod: 'payhere' | 'bank_transfer' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'failed';
  status: 'processing' | 'pending_cod' | 'pending_payment' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  deliveryType: 'standard' | 'express';
  trackingNumber: string | null;
  createdAt: { seconds: number; nanoseconds: number };
  updatedAt: { seconds: number; nanoseconds: number };
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  phone: string;
  role: 'customer' | 'manager' | 'admin';
  photoURL: string;
  banned: boolean;
  createdAt: { seconds: number; nanoseconds: number };
}

export interface Address {
  id?: string;
  label?: string;
  line1: string;
  line2?: string;
  city: string;
  district: string;
  postalCode?: string;
  country: string;
  isDefault?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  imageURL?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageURL: string;
  displayOrder: number;
  isActive: boolean;
}

export interface Coupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderValue: number;
  maxUses: number;
  usedCount: number;
  expiresAt: { seconds: number; nanoseconds: number };
  isActive: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  displayName: string;
  rating: number;
  text: string;
  isApproved: boolean;
  createdAt: { seconds: number; nanoseconds: number };
}

export const STORE = {
  name: 'HomeNest LK',
  tagline: 'Elevate Your Living Space',
  currency: 'LKR',
  symbol: 'Rs.',
  email: 'hello@homestlk.com',
  phone: '+94 77 000 0000',
  address: 'Colombo, Sri Lanka',
  adminEmail: 'admin@homestlk.com',
  freeShippingThreshold: 5000,
  standardShippingFee: 350,
  expressShippingFee: 650,
} as const;

export const SL_DISTRICTS = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 'Gampaha',
  'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala',
  'Mannar', 'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya',
  'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya',
] as const;

// Seed data for demonstration
export const SEED_CATEGORIES: Category[] = [
  { id: 'kitchen', name: 'Kitchen', icon: '🍳', imageURL: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80', displayOrder: 1, isActive: true },
  { id: 'bedroom', name: 'Bedroom', icon: '🛏️', imageURL: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&q=80', displayOrder: 2, isActive: true },
  { id: 'bathroom', name: 'Bathroom', icon: '🚿', imageURL: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80', displayOrder: 3, isActive: true },
  { id: 'living-room', name: 'Living Room', icon: '🛋️', imageURL: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80', displayOrder: 4, isActive: true },
  { id: 'storage', name: 'Storage', icon: '📦', imageURL: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', displayOrder: 5, isActive: true },
  { id: 'cleaning', name: 'Cleaning', icon: '🧹', imageURL: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&q=80', displayOrder: 6, isActive: true },
];

export const SEED_PRODUCTS: Product[] = [
  {
    id: 'p1', productName: 'Premium Rice Cooker', sku: 'HN-KIT-001', category: 'Kitchen', brand: 'HomeNest',
    shortDescription: 'Smart rice cooker with 10 cooking functions for perfect meals every time.',
    description: 'Prepare perfect rice, steam vegetables, and cook soups with this versatile smart rice cooker featuring 10 preset cooking functions, a non-stick inner pot, and a keep-warm mode that maintains temperature for up to 12 hours. Its sleek design complements any modern kitchen countertop.',
    costPrice: 3500, sellingPrice: 5500, discountPrice: 4990, stock: 24, weight: 3200,
    dimensions: { length: 30, width: 25, height: 28 },
    variants: [{ type: 'Color', values: ['White', 'Black'] }],
    tags: ['kitchen', 'cooking', 'rice', 'electric'], featured: true, isActive: true,
    images: ['https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=800&q=80', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80'],
    thumbnails: ['https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=400&q=80', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80'],
    createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 }, updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 },
  },
  {
    id: 'p2', productName: 'Egyptian Cotton Bedsheet Set', sku: 'HN-BED-001', category: 'Bedroom', brand: 'HomeNest',
    shortDescription: 'Luxurious 1000-thread-count Egyptian cotton sheets for restful sleep.',
    description: 'Drift into dreamland on these premium Egyptian cotton bedsheets. With a 1000 thread count, they offer unparalleled softness that improves with every wash. The set includes a fitted sheet, flat sheet, and two pillowcases, all in a sophisticated ivory hue that complements any bedroom decor.',
    costPrice: 2000, sellingPrice: 3200, discountPrice: 0, stock: 45, weight: 1800,
    dimensions: { length: 200, width: 180, height: 2 },
    variants: [{ type: 'Size', values: ['Single', 'Double', 'King'] }, { type: 'Color', values: ['Ivory', 'White', 'Grey'] }],
    tags: ['bedroom', 'bedding', 'cotton', 'luxury'], featured: true, isActive: true,
    images: ['https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&q=80', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80'],
    thumbnails: ['https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400&q=80', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&q=80'],
    createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 }, updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 },
  },
  {
    id: 'p3', productName: 'Premium Towel Set (6-Pack)', sku: 'HN-BTH-001', category: 'Bathroom', brand: 'HomeNest',
    shortDescription: 'Ultra-absorbent, quick-dry microfiber towels in spa-quality softness.',
    description: 'Transform your bathroom into a spa with these premium microfiber towels. Each set includes two bath towels, two hand towels, and two washcloths. The advanced microfiber technology ensures rapid absorption and quick drying, while the double-stitched edges guarantee long-lasting durability.',
    costPrice: 1100, sellingPrice: 1850, discountPrice: 1590, stock: 60, weight: 1200,
    dimensions: { length: 70, width: 140, height: 2 },
    variants: [{ type: 'Color', values: ['White', 'Navy', 'Sage'] }],
    tags: ['bathroom', 'towels', 'microfiber', 'spa'], featured: true, isActive: true,
    images: ['https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80'],
    thumbnails: ['https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&q=80', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80'],
    createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 }, updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 },
  },
  {
    id: 'p4', productName: 'Sofa Throw Blanket', sku: 'HN-LIV-001', category: 'Living Room', brand: 'HomeNest',
    shortDescription: 'Cozy knit throw blanket perfect for snuggling on the sofa.',
    description: 'Wrap yourself in warmth with this beautifully crafted knit throw blanket. Made from a premium cotton-acrylic blend, it provides the perfect balance of warmth and breathability. The chunky knit pattern adds a touch of Scandinavian elegance to your living space while being incredibly soft to the touch.',
    costPrice: 1300, sellingPrice: 2100, discountPrice: 0, stock: 35, weight: 900,
    dimensions: { length: 150, width: 130, height: 3 },
    variants: [{ type: 'Color', values: ['Cream', 'Charcoal', 'Forest Green'] }],
    tags: ['living', 'blanket', 'cozy', 'knit'], featured: true, isActive: true,
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80'],
    thumbnails: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80'],
    createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 }, updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 },
  },
  {
    id: 'p5', productName: 'Bamboo Storage Basket', sku: 'HN-STG-001', category: 'Storage', brand: 'HomeNest',
    shortDescription: 'Handwoven bamboo basket for stylish and eco-friendly organization.',
    description: 'Organize your home sustainably with this handwoven bamboo storage basket. Each basket is crafted by skilled artisans using sustainably harvested bamboo, ensuring both environmental responsibility and exceptional quality. Perfect for storing blankets, toys, laundry, or household essentials while adding a natural aesthetic to any room.',
    costPrice: 550, sellingPrice: 950, discountPrice: 0, stock: 80, weight: 450,
    dimensions: { length: 40, width: 30, height: 25 },
    variants: [{ type: 'Size', values: ['Small', 'Medium', 'Large'] }],
    tags: ['storage', 'bamboo', 'eco', 'organization'], featured: false, isActive: true,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80'],
    thumbnails: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&q=80'],
    createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 }, updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 },
  },
  {
    id: 'p6', productName: 'Ceramic Dinner Set (24-Piece)', sku: 'HN-KIT-002', category: 'Kitchen', brand: 'HomeNest',
    shortDescription: 'Elegant stoneware dinner set for 6, microwave and dishwasher safe.',
    description: 'Elevate your dining experience with this stunning 24-piece ceramic dinner set. Each piece is crafted from high-quality stoneware that is chip-resistant and safe for microwave, oven, and dishwasher use. The set includes dinner plates, side plates, bowls, and mugs for six people, all in a modern matte finish.',
    costPrice: 5200, sellingPrice: 7800, discountPrice: 6990, stock: 12, weight: 8500,
    dimensions: { length: 45, width: 35, height: 25 },
    variants: [{ type: 'Color', values: ['Matte White', 'Sage Green', 'Midnight Blue'] }],
    tags: ['kitchen', 'dinnerware', 'ceramic', 'dining'], featured: true, isActive: true,
    images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80', 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=800&q=80'],
    thumbnails: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80', 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=400&q=80'],
    createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 }, updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 },
  },
  {
    id: 'p7', productName: 'LED Desk Lamp', sku: 'HN-LIV-002', category: 'Living Room', brand: 'HomeNest',
    shortDescription: 'Adjustable LED desk lamp with 5 brightness levels and USB charging port.',
    description: 'Work smarter with this sleek LED desk lamp featuring five adjustable brightness levels and three color temperature modes. The built-in USB charging port keeps your devices powered while the flexible gooseneck design allows you to direct light exactly where you need it. Its minimalist design fits perfectly in home offices, study areas, and bedside tables.',
    costPrice: 2800, sellingPrice: 4400, discountPrice: 0, stock: 30, weight: 750,
    dimensions: { length: 15, width: 15, height: 45 },
    variants: [{ type: 'Color', values: ['Matte Black', 'Silver', 'Rose Gold'] }],
    tags: ['living', 'lamp', 'LED', 'office'], featured: false, isActive: true,
    images: ['https://images.unsplash.com/photo-1540932239986-72819e7a191a?w=800&q=80', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80'],
    thumbnails: ['https://images.unsplash.com/photo-1540932239986-72819e7a191a?w=400&q=80', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80'],
    createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 }, updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 },
  },
  {
    id: 'p8', productName: 'Wooden Plant Stand', sku: 'HN-LIV-003', category: 'Living Room', brand: 'HomeNest',
    shortDescription: 'Mid-century inspired wooden plant stand for indoor greenery display.',
    description: 'Showcase your favorite indoor plants on this beautifully crafted mid-century inspired plant stand. Made from solid acacia wood with a natural finish, it features a sturdy A-frame design that supports pots up to 25cm in diameter. The elevated design keeps plants at the perfect viewing height while protecting your floors from water damage.',
    costPrice: 700, sellingPrice: 1200, discountPrice: 990, stock: 50, weight: 1200,
    dimensions: { length: 25, width: 25, height: 50 },
    variants: [{ type: 'Finish', values: ['Natural', 'Walnut', 'Black'] }],
    tags: ['living', 'plant', 'wood', 'decor'], featured: false, isActive: true,
    images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80'],
    thumbnails: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80'],
    createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 }, updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 },
  },
  {
    id: 'p9', productName: 'Professional Knife Set (7-Piece)', sku: 'HN-KIT-003', category: 'Kitchen', brand: 'HomeNest',
    shortDescription: 'High-carbon stainless steel knife set with wooden block storage.',
    description: 'Slice, dice, and chop like a professional chef with this premium 7-piece knife set. Each blade is forged from high-carbon stainless steel for exceptional sharpness and durability. The set includes a chef knife, bread knife, santoku, utility knife, paring knife, kitchen shears, and an elegant acacia wood storage block that keeps your blades organized and safely stored.',
    costPrice: 4200, sellingPrice: 6500, discountPrice: 5990, stock: 18, weight: 3200,
    dimensions: { length: 35, width: 12, height: 25 },
    variants: [],
    tags: ['kitchen', 'knives', 'cooking', 'professional'], featured: true, isActive: true,
    images: ['https://images.unsplash.com/photo-1551884831-bbf3cdc6469e?w=800&q=80', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80'],
    thumbnails: ['https://images.unsplash.com/photo-1551884831-bbf3cdc6469e?w=400&q=80', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80'],
    createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 }, updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 },
  },
  {
    id: 'p10', productName: 'Blackout Curtains (Pair)', sku: 'HN-BED-002', category: 'Bedroom', brand: 'HomeNest',
    shortDescription: 'Thermal insulated blackout curtains that block 99% of light.',
    description: 'Transform any room into a peaceful sanctuary with these premium blackout curtains. The triple-weave technology blocks 99% of incoming light while providing thermal insulation that keeps rooms cool in summer and warm in winter. Available in a range of sophisticated colors, these curtains feature a rod pocket and back tabs for versatile hanging options.',
    costPrice: 5500, sellingPrice: 8900, discountPrice: 7490, stock: 22, weight: 2200,
    dimensions: { length: 228, width: 137, height: 1 },
    variants: [{ type: 'Size', values: ['137x228cm', '168x228cm'] }, { type: 'Color', values: ['Charcoal', 'Navy', 'Beige'] }],
    tags: ['bedroom', 'curtains', 'blackout', 'thermal'], featured: true, isActive: true,
    images: ['https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&q=80', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80'],
    thumbnails: ['https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400&q=80', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&q=80'],
    createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 }, updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 },
  },
  {
    id: 'p11', productName: 'Essential Oil Diffuser', sku: 'HN-LIV-004', category: 'Living Room', brand: 'HomeNest',
    shortDescription: 'Ultrasonic essential oil diffuser with ambient LED lighting.',
    description: 'Create a calming atmosphere with this elegant ultrasonic essential oil diffuser. The 300ml water tank provides up to 10 hours of continuous mist, while the ambient LED lighting offers 7 color options to suit your mood. The whisper-quiet operation makes it perfect for bedrooms, living rooms, and office spaces. Auto shut-off ensures safety when water runs low.',
    costPrice: 2200, sellingPrice: 3600, discountPrice: 0, stock: 40, weight: 500,
    dimensions: { length: 16, width: 16, height: 22 },
    variants: [{ type: 'Color', values: ['White Wood Grain', 'Dark Wood Grain'] }],
    tags: ['living', 'diffuser', 'aromatherapy', 'wellness'], featured: false, isActive: true,
    images: ['https://images.unsplash.com/photo-1585771724684-38269d7f7eaf?w=800&q=80', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80'],
    thumbnails: ['https://images.unsplash.com/photo-1585771724684-38269d7f7eaf?w=400&q=80', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80'],
    createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 }, updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 },
  },
  {
    id: 'p12', productName: 'Laundry Organizer Hamper', sku: 'HN-STG-002', category: 'Storage', brand: 'HomeNest',
    shortDescription: 'Collapsible fabric laundry hamper with divided sections and lid.',
    description: 'Keep your laundry organized with this stylish and practical divided laundry hamper. Featuring two separate compartments for lights and darks, a removable mesh lid, and sturdy cotton rope handles for easy transport. The collapsible design allows for convenient storage when not in use, while the durable fabric construction ensures long-lasting performance.',
    costPrice: 850, sellingPrice: 1450, discountPrice: 0, stock: 65, weight: 600,
    dimensions: { length: 50, width: 35, height: 60 },
    variants: [{ type: 'Color', values: ['Grey', 'Beige', 'Black'] }],
    tags: ['storage', 'laundry', 'organizer', 'hamper'], featured: false, isActive: true,
    images: ['https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&q=80', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
    thumbnails: ['https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&q=80', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80'],
    createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 }, updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 },
  },
];

export const SEED_REVIEWS: Review[] = [
  { id: 'r1', productId: 'p1', userId: 'u1', displayName: 'Amal Perera', rating: 5, text: 'Absolutely love this rice cooker! Perfect rice every time. The keep-warm function is a game changer for our busy household.', isApproved: true, createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } },
  { id: 'r2', productId: 'p2', userId: 'u2', displayName: 'Nishadi Fernando', rating: 5, text: 'These sheets are like sleeping on a cloud. The quality is exceptional and they get softer with every wash. Worth every rupee!', isApproved: true, createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } },
  { id: 'r3', productId: 'p6', userId: 'u3', displayName: 'Kasun Jayawardena', rating: 4, text: 'Beautiful dinner set. The matte finish is elegant and they are very durable. Only wish there were more color options.', isApproved: true, createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } },
  { id: 'r4', productId: 'p4', userId: 'u4', displayName: 'Dilini Wickramasinghe', rating: 5, text: 'The coziest throw blanket I have ever owned. The knit pattern is gorgeous and it is incredibly warm without being heavy.', isApproved: true, createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } },
  { id: 'r5', productId: 'p9', userId: 'u5', displayName: 'Ravindu Senanayake', rating: 5, text: 'Professional quality knives at an amazing price. Sharp out of the box and the wooden block looks great on my counter.', isApproved: true, createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } },
  { id: 'r6', productId: 'p10', userId: 'u6', displayName: 'Sanduni Rajapaksa', rating: 4, text: 'These curtains really do block almost all light. My bedroom is finally dark enough for a good sleep. Great quality fabric too.', isApproved: true, createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } },
];
