import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FunnelIcon, 
  MagnifyingGlassIcon,
  HeartIcon,
  UserIcon,
  CalendarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import GlassCard from '../components/GlassCard';

const categories = [
  {
    name: 'Handcrafted Fashion',
    description: 'Locally made clothes, shoes, bags, and accessories using traditional African fabrics and designs.',
    image: '/images/fashion.jpg',
  },
  {
    name: 'Ceramics & Pottery',
    description: 'Beautiful ceramics, pottery, and clay works crafted by local artisans.',
    image: '/images/ceramics.jpg',
  },
  {
    name: 'Natural Foods',
    description: 'Organic grains, vegetables, fruits, and snacks grown and processed by Nigerian farmers.',
    image: '/images/food.jpg',
  },
  {
    name: 'Natural Drinks',
    description: 'Palm wine, zobo, kunu, fresh juices, and other healthy beverages made from local ingredients.',
    image: '/images/drinks.jpg',
  },
  {
    name: 'Arts & Crafts',
    description: 'Wood carvings, beadwork, paintings, and other creative works from across Africa.',
    image: '/images/arts.jpg',
  },
  {
    name: 'Home & Decor',
    description: 'Locally made furniture, woven baskets, mats, and home accessories.',
    image: '/images/home.jpg',
  },
  {
    name: 'Beauty & Wellness',
    description: 'Shea butter, black soap, natural oils, and other wellness products from African nature.',
    image: '/images/beauty.jpg',
  },
];

const projects = [
  {
    id: 1,
    title: 'Adire Ankara Dress',
    description: 'Hand-dyed Adire Ankara dress, made by local artisans in Abeokuta.',
    creator: 'Ngozi Okafor',
    department: 'Handcrafted Fashion',
    category: 'Handcrafted Fashion',
    image: '/images/fashion.jpg',
    funding: 15000,
    target: 30000,
    supporters: 12,
    daysLeft: 10,
    tags: ['Dress', 'Adire', 'Fashion']
  },
  {
    id: 2,
    title: 'Ife Terracotta Pot',
    description: 'Traditional terracotta pot for home decor and storage.',
    creator: 'Yusuf Adewale',
    department: 'Ceramics & Pottery',
    category: 'Ceramics & Pottery',
    image: '/images/ceramics.jpg',
    funding: 8000,
    target: 20000,
    supporters: 7,
    daysLeft: 20,
    tags: ['Pottery', 'Ceramics', 'Artisan']
  },
  {
    id: 3,
    title: 'Organic Ofada Rice',
    description: 'Locally grown Ofada rice, unpolished and full of nutrients.',
    creator: 'Aisha Bello',
    department: 'Natural Foods',
    category: 'Natural Foods',
    image: '/images/food.jpg',
    funding: 12000,
    target: 25000,
    supporters: 15,
    daysLeft: 15,
    tags: ['Rice', 'Food', 'Organic']
  },
  {
    id: 4,
    title: 'Fresh Zobo Drink',
    description: 'Refreshing hibiscus (zobo) drink, naturally sweetened and preservative-free.',
    creator: 'Chinedu Eze',
    department: 'Natural Drinks',
    category: 'Natural Drinks',
    image: '/images/drinks.jpg',
    funding: 6000,
    target: 15000,
    supporters: 9,
    daysLeft: 8,
    tags: ['Drink', 'Zobo', 'Natural']
  },
  {
    id: 5,
    title: 'Ebony Wood Carving',
    description: 'Hand-carved ebony wood sculpture representing African heritage.',
    creator: 'Fatoumata Diallo',
    department: 'Arts & Crafts',
    category: 'Arts & Crafts',
    image: '/images/arts.jpg',
    funding: 18000,
    target: 40000,
    supporters: 11,
    daysLeft: 18,
    tags: ['Wood', 'Carving', 'Art']
  },
  {
    id: 6,
    title: 'Woven Raffia Basket',
    description: 'Durable and stylish basket made from locally sourced raffia.',
    creator: 'Bola Ajayi',
    department: 'Home & Decor',
    category: 'Home & Decor',
    image: '/images/home.jpg',
    funding: 9000,
    target: 20000,
    supporters: 6,
    daysLeft: 12,
    tags: ['Basket', 'Home', 'Raffia']
  },
  {
    id: 7,
    title: 'Pure Shea Butter',
    description: 'Raw, unrefined shea butter for skin and hair care.',
    creator: 'Mariam Musa',
    department: 'Beauty & Wellness',
    category: 'Beauty & Wellness',
    image: '/images/beauty.jpg',
    funding: 11000,
    target: 22000,
    supporters: 10,
    daysLeft: 14,
    tags: ['Shea Butter', 'Beauty', 'Natural']
  }
];

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [likedProjects, setLikedProjects] = useState(new Set<number>());

  const toggleLike = (projectId: number) => {
    const newLikedProjects = new Set(likedProjects);
    if (newLikedProjects.has(projectId)) {
      newLikedProjects.delete(projectId);
    } else {
      newLikedProjects.add(projectId);
    }
    setLikedProjects(newLikedProjects);
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            African Local Marketplace
          </h1>
          <p className="text-gray-300 text-lg">
            Discover and support authentic, locally made products from Nigeria and Africa. Everything here is produced from natural resources available to everyone—no government-owned resources like crude oil, just pure creativity and tradition!
          </p>
        </div>

        {/* Search and Filter */}
        <GlassCard className="p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div className="flex items-center space-x-4">
              <FunnelIcon className="w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-800/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="all" className="bg-gray-800">All Categories</option>
                {categories.map(category => (
                  <option key={category.name} value={category.name} className="bg-gray-800">
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </GlassCard>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <GlassCard className="overflow-hidden h-full flex flex-col">
                <div className="relative">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => toggleLike(project.id)}
                    className="absolute top-4 right-4 p-2 bg-black/50 rounded-full backdrop-blur-sm"
                  >
                    {likedProjects.has(project.id) ? (
                      <HeartSolid className="w-5 h-5 text-red-500" />
                    ) : (
                      <HeartIcon className="w-5 h-5 text-white" />
                    )}
                  </button>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-purple-500/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-white">
                      {project.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-white mb-3">
                    {project.title}
                  </h3>
                  
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3 flex-1">
                    {project.description}
                  </p>

                  <div className="flex items-center text-gray-400 text-sm mb-4">
                    <UserIcon className="w-4 h-4 mr-2" />
                    <span>{project.creator}</span>
                    <span className="mx-2">•</span>
                    <span>{project.department}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <span>₦{project.funding.toLocaleString()} raised</span>
                      <span>{Math.round((project.funding / project.target) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((project.funding / project.target) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400 mt-2">
                      <span>Goal: ₦{project.target.toLocaleString()}</span>
                      <span>{project.supporters} supporters</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-gray-400 text-sm">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      <span>{project.daysLeft} days left</span>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center">
                    <CurrencyDollarIcon className="w-5 h-5 mr-2" />
                    Support Product
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No products found matching your criteria.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Marketplace;