import { PrismaClient } from '@prisma/client';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting seeding...');

  // 1. Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.subcategory.deleteMany();
  await prisma.category.deleteMany();
  await prisma.adminUser.deleteMany();
  await prisma.storeSetting.deleteMany();

  // 2. Create Admin User
  await prisma.adminUser.create({
    data: {
      name: 'Admin',
      email: 'admin@elect.com',
      passwordHash: 'admin123', // In a real app, hash this!
    }
  });

  // 3. Create Store Settings
  await prisma.storeSetting.create({
    data: {
      storeName: 'Delight Tech',
      contactEmail: 'info@delighttech.co.ke',
      contactPhone: '+254 700 000 000',
      deliveryFee: 500,
      paymentConfig: { methods: ['M-Pesa', 'Card', 'Bank Transfer'] },
    }
  });

  // 4. Categories and Subcategories
  const categories = [
    {
      name: 'Phones',
      slug: 'phones',
      subcategories: [
        { name: 'iPhone', slug: 'iphone' },
        { name: 'Samsung', slug: 'samsung' },
        { name: 'Huawei', slug: 'huawei' },
        { name: 'Tecno', slug: 'tecno' },
        { name: 'Infinix', slug: 'infinix' },
        { name: 'Xiaomi', slug: 'xiaomi' },
      ]
    },
    {
      name: 'Laptops',
      slug: 'laptops',
      subcategories: [
        { name: 'Apple MacBook', slug: 'apple-macbook' },
        { name: 'HP', slug: 'hp' },
        { name: 'Dell', slug: 'dell' },
        { name: 'Lenovo', slug: 'lenovo' },
        { name: 'Asus', slug: 'asus' },
        { name: 'Acer', slug: 'acer' },
      ]
    },
    {
      name: 'Accessories',
      slug: 'accessories',
      subcategories: [
        { name: 'Chargers and Cables', slug: 'chargers-cables' },
        { name: 'Cases and Screen Protectors', slug: 'cases-screen-protectors' },
        { name: 'Earphones and Headphones', slug: 'earphones-headphones' },
        { name: 'Power Banks', slug: 'power-banks' },
        { name: 'Keyboards and Mice', slug: 'keyboards-mice' },
        { name: 'USB Hubs and Adapters', slug: 'usb-hubs-adapters' },
      ]
    }
  ];

  const createdCategories = [];
  for (const cat of categories) {
    const category = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        subcategories: {
          create: cat.subcategories
        }
      },
      include: { subcategories: true }
    });
    createdCategories.push(category);
  }

  // 5. Sample Products
  const sampleProducts = [
    {
      name: 'iPhone 14 Pro',
      slug: 'iphone-14-pro',
      brand: 'Apple',
      description: 'The ultimate iPhone with Always-On display and 48MP camera.',
      specifications: { display: '6.1-inch OLED', processor: 'A16 Bionic', storage: '256GB' },
      price: 155000,
      stockQuantity: 10,
      imageUrls: ['https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?auto=format&fit=crop&q=80&w=1000'],
      categoryName: 'Phones',
      subcategoryName: 'iPhone'
    },
    {
      name: 'MacBook Air M2',
      slug: 'macbook-air-m2',
      brand: 'Apple',
      description: 'Strikingly thin design. Supercharged by M2.',
      specifications: { display: '13.6-inch Liquid Retina', chip: 'Apple M2', ram: '8GB', ssd: '256GB' },
      price: 185000,
      stockQuantity: 5,
      imageUrls: ['https://images.unsplash.com/photo-1611186871348-b1ec696e52c9?auto=format&fit=crop&q=80&w=1000'],
      categoryName: 'Laptops',
      subcategoryName: 'Apple MacBook'
    },
    {
      name: 'Samsung Galaxy S23 Ultra',
      slug: 'samsung-galaxy-s23-ultra',
      brand: 'Samsung',
      description: 'Capture the epic with our most advanced camera system yet.',
      specifications: { display: '6.8-inch Dynamic AMOLED', processor: 'Snapdragon 8 Gen 2', storage: '512GB' },
      price: 145000,
      stockQuantity: 8,
      imageUrls: ['https://images.unsplash.com/photo-1678911820864-e2c567c655d7?auto=format&fit=crop&q=80&w=1000'],
      categoryName: 'Phones',
      subcategoryName: 'Samsung'
    },
    {
        name: 'HP EliteBook 840 G9',
        slug: 'hp-elitebook-840-g9',
        brand: 'HP',
        description: 'Elite performance for high-end business workflows.',
        specifications: { display: '14-inch FHD', processor: 'Intel Core i7-12th Gen', ram: '16GB', ssd: '512GB' },
        price: 135000,
        stockQuantity: 12,
        imageUrls: ['https://images.unsplash.com/photo-1589156191108-c762ff4b96ab?auto=format&fit=crop&q=80&w=1000'],
        categoryName: 'Laptops',
        subcategoryName: 'HP'
    },
    {
        name: 'iPhone 20W USB-C Power Adapter',
        slug: 'iphone-20w-adapter',
        brand: 'Apple',
        description: 'Fast, efficient charging at home, in the office, or on the go.',
        specifications: { power: '20W', interface: 'USB-C' },
        price: 4500,
        stockQuantity: 50,
        imageUrls: ['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=1000'],
        categoryName: 'Accessories',
        subcategoryName: 'Chargers and Cables'
    }
  ];

  for (const prod of sampleProducts) {
    const category = createdCategories.find(c => c.name === prod.categoryName);
    const subcategory = category.subcategories.find(s => s.name === prod.subcategoryName);

    await prisma.product.create({
      data: {
        name: prod.name,
        slug: prod.slug,
        brand: prod.brand,
        description: prod.description,
        specifications: prod.specifications,
        price: prod.price,
        stockQuantity: prod.stockQuantity,
        imageUrls: prod.imageUrls,
        categoryId: category.id,
        subcategoryId: subcategory.id
      }
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
