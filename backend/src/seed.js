const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/user.model');
const Product = require('./models/product.model');
const ApprovedEmail = require('./models/approvedEmail.model');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB for seeding'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const approvedEmails = [
  {
    email: 'admin@example.com',
    role: 'admin'
  },
  {
    email: 'rider1@example.com',
    role: 'rider'
  },
  {
    email: 'rider2@example.com',
    role: 'rider'
  },
  {
    email: 'customer@example.com',
    role: 'customer'
  }
];

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123', // Ensure this is hashed in your model's pre-save hook
    role: 'admin'
  },
  {
    name: 'Rider One',
    email: 'rider1@example.com',
    password: 'password123',
    role: 'rider'
  },
  {
    name: 'Rider Two',
    email: 'rider2@example.com',
    password: 'password123',
    role: 'rider'
  },
  {
    name: 'Customer User',
    email: 'customer@example.com',
    password: 'password123',
    role: 'customer'
  }
];

const products = [
  {
    name: 'Premium Ceiling Fan',
    description: 'High-quality ceiling fan with energy-efficient motor',
    category: 'fan',
    basePrice: 7999,
    variants: [
      { size: 'small', color: 'white', price: 7999, stock: 15, imageUrl: '/images/fan-small-white.jpg' },
      { size: 'small', color: 'black', price: 8499, stock: 10, imageUrl: '/images/fan-small-black.jpg' },
      { size: 'medium', color: 'white', price: 8999, stock: 20, imageUrl: '/images/fan-medium-white.jpg' },
      { size: 'medium', color: 'black', price: 9499, stock: 15, imageUrl: '/images/fan-medium-black.jpg' },
      { size: 'large', color: 'white', price: 9999, stock: 8, imageUrl: '/images/fan-large-white.jpg' },
      { size: 'large', color: 'black', price: 10499, stock: 5, imageUrl: '/images/fan-large-black.jpg' }
    ],
    features: ['Remote controlled', '3-speed settings', 'Energy efficient', 'Silent operation'],
    rating: 4.5,
    isActive: true
  }
];

const seedData = async () => {
  try {
    await ApprovedEmail.deleteMany({});
    await User.deleteMany({});
    await Product.deleteMany({});

    await ApprovedEmail.insertMany(approvedEmails);
    console.log('Approved emails seeded successfully');

    await User.insertMany(users);
    console.log('Users seeded successfully');

    await Product.insertMany(products);
    console.log('Products seeded successfully');

    mongoose.connection.close();
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();