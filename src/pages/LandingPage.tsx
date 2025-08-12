import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  AcademicCapIcon, 
  CurrencyDollarIcon, 
  GlobeAltIcon,
  UsersIcon,
  ChartBarIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Send, 
  Linkedin, 
  Youtube,
  MessageCircle,
  Github
} from 'lucide-react';
import GlassCard from '../components/GlassCard';

export type UserRole = 'student' | 'investor' | 'voter' | 'partner';

const LandingPage = () => {
  const features = [
    {
      icon: AcademicCapIcon,
      title: 'Student Innovation',
      description: 'Empowering UNILAG students to showcase groundbreaking ideas and receive community support.'
    },
    {
      icon: CurrencyDollarIcon,
      title: '$CSHARE Tokens',
      description: 'Vote and fund projects using blockchain-based tokens with transparent allocation.'
    },
    {
      icon: GlobeAltIcon,
      title: 'Global Platform',
      description: 'Connecting innovators worldwide while starting with University of Lagos as our pilot.'
    },
    {
      icon: UsersIcon,
      title: 'Community Driven',
      description: 'Democratic funding where community votes determine which projects receive support.'
    },
    {
      icon: ChartBarIcon,
      title: 'Performance Analytics',
      description: 'Track project progress and impact with comprehensive analytics and reporting.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure Escrow',
      description: 'Polygon-based smart contracts ensure secure fund management and dispute resolution.'
    }
  ];

  return (
    <div className="pt-0">
      {/* Top Navigation */}
      <nav className="w-full flex justify-between items-center px-6 py-4 bg-transparent absolute top-0 left-0 z-10">
        <Link to="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-600">
          SIT
        </Link>
        <div className="flex gap-4">
          <Link to="/dashboard" className="text-gray-200 hover:text-blue-400 font-medium transition">Dashboard</Link>
          <Link to="/marketplace" className="text-gray-200 hover:text-blue-400 font-medium transition">Marketplace</Link>
          <Link to="/login" className="text-gray-200 hover:text-blue-400 font-medium transition">Login</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl sm:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-blue-400 to-purple-500 mb-6 drop-shadow-lg">
              Student Innovation Trust
            </h1>
            <p className="text-xl sm:text-2xl text-gray-200 mb-10 leading-relaxed">
              Unlocking the potential of innovators across African universities with community-driven funding and blockchain transparency.
            </p>
            <Link
              to="/register"
              className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-10 py-4 rounded-xl font-semibold text-lg shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-950/80 to-blue-950/80">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Revolutionizing Student Innovation
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our platform combines cutting-edge blockchain technology with community-driven funding 
              to support breakthrough student innovations at UNILAG and beyond.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <GlassCard className="p-8 h-full bg-gradient-to-br from-purple-800/60 to-blue-800/60">
                  <feature.icon className="w-12 h-12 text-purple-300 mb-6" />
                  <h3 className="text-xl font-semibold text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-200 leading-relaxed">
                    {feature.description}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Phases Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-900/60 to-purple-900/60">
        <div className="max-w-5xl mx-auto">
          <GlassCard className="p-10 bg-gradient-to-br from-purple-900/80 to-blue-900/80">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-white mb-6 text-center">
                Our Vision: Three Strategic Phases
              </h2>
              <p className="text-lg text-gray-200 mb-8 text-center">
                Our vision unfolds in three strategic phases, each building on the success of the last.
              </p>
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-semibold text-purple-300 mb-2">Phase 1: Launch the Platform & Show <span className="text-base text-gray-400">(Seed Round - $1M)</span></h3>
                  <p className="text-gray-200">
                    Launch the SIT Launchpad (web and mobile app) and produce Season 1 of <span className="font-semibold text-white">"Launchpad: The Show"</span> with the University of Lagos as our pioneer partner. Our <span className="font-semibold text-white">"Ground Zero"</span> marketing campaign will dominate the UNILAG campus to drive auditions, vendor onboarding, and achieve our first 150,000 users.
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-blue-300 mb-2">Phase 2: Build the Infrastructure <span className="text-base text-gray-400">(Series A Round - $12M)</span></h3>
                  <p className="text-gray-200">
                    Leverage the success of Season 1 to raise capital for the construction of the first flagship <span className="font-semibold text-white">CommuteShare Innovation Hub</span> on the UNILAG campus. This permanent facility will house future seasons of the show and provide a physical center for the Launchpad's activities.
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-purple-300 mb-2">Phase 3: Deploy Mobility <span className="text-base text-gray-400">(Series B Round / Partnership)</span></h3>
                  <p className="text-gray-200">
                    Launch <span className="font-semibold text-white">CommuteShare Mobility</span>, an on-campus EV ride-sharing and logistics service. We will partner with a leading EV manufacturer and existing shuttle drivers, providing the physical delivery network for the Marketplace and a sustainable transport solution for the campus.
                  </p>
                </div>
              </div>
            </motion.div>
          </GlassCard>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-950/80 to-blue-950/80">
        <div className="max-w-7xl mx-auto">
          <GlassCard className="p-12 bg-gradient-to-br from-purple-900/80 to-blue-900/80">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-purple-300 mb-2">50K+</div>
                <div className="text-gray-200">UNILAG Students</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-300 mb-2">₦200M+</div>
                <div className="text-gray-200">Funding Target</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-300 mb-2">100+</div>
                <div className="text-gray-200">Innovation Projects</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-300 mb-2">24/7</div>
                <div className="text-gray-200">Platform Access</div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Social Media Links */}
      <footer className="w-full py-12 flex flex-col items-center gap-6 bg-gradient-to-t from-purple-950/40 to-transparent">
        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold text-white mb-2">Connect With Us</h3>
          <p className="text-gray-300 text-sm">Follow our journey and stay updated</p>
        </div>
        
        <div className="flex gap-4 flex-wrap justify-center">
          {/* Instagram */}
          <motion.a 
            href="https://instagram.com/studentinnovationtrust" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="Instagram"
            className="group p-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Instagram className="w-6 h-6 text-white" />
          </motion.a>

          {/* X (Twitter) */}
          <motion.a 
            href="https://x.com/sit_unilag" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="X (Twitter)"
            className="group p-3 rounded-full bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Twitter className="w-6 h-6 text-white" />
          </motion.a>

          {/* LinkedIn */}
          <motion.a 
            href="https://linkedin.com/company/student-innovation-trust" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="LinkedIn"
            className="group p-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Linkedin className="w-6 h-6 text-white" />
          </motion.a>

          {/* YouTube */}
          <motion.a 
            href="https://youtube.com/@studentinnovationtrust" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="YouTube"
            className="group p-3 rounded-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Youtube className="w-6 h-6 text-white" />
          </motion.a>

          {/* Telegram */}
          <motion.a 
            href="https://t.me/sit_community" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="Telegram"
            className="group p-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send className="w-6 h-6 text-white" />
          </motion.a>

          {/* WhatsApp Community */}
          <motion.a 
            href="https://chat.whatsapp.com/sit-community" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="WhatsApp Community"
            className="group p-3 rounded-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </motion.a>

          {/* GitHub */}
          <motion.a 
            href="https://github.com/student-innovation-trust" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="GitHub"
            className="group p-3 rounded-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Github className="w-6 h-6 text-white" />
          </motion.a>

          {/* Facebook */}
          <motion.a 
            href="https://facebook.com/studentinnovationtrust" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="Facebook"
            className="group p-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Facebook className="w-6 h-6 text-white" />
          </motion.a>
        </div>

        <div className="text-center">
          <p className="text-gray-400 text-sm mb-2">© 2025 Student Innovation Trust. All rights reserved.</p>
          <p className="text-gray-500 text-xs">Empowering African student innovators through blockchain technology</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
