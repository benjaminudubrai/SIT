import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PlusIcon, 
  TrophyIcon,
  ClockIcon,
  UsersIcon,
  DocumentTextIcon,
  PhotoIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';
import GlassCard from '../components/GlassCard';

const InnovationChallenge = () => {
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    teamSize: 1,
    files: []
  });

  const challenges = [
    {
      id: 1,
      title: 'Sustainable Campus Initiative 2025',
      description: 'Create innovative solutions to make UNILAG campus more environmentally sustainable.',
      prize: '₦5,000,000',
      deadline: '2025-09-15',
      participants: 156,
      submissions: 42,
      status: 'active',
      categories: ['Environment', 'Sustainability', 'Innovation']
    },
    {
      id: 2,
      title: 'Digital Health Solutions Challenge',
      description: 'Develop technology solutions to improve healthcare access for Nigerian students.',
      prize: '₦7,500,000',
      deadline: '2025-08-20',
      participants: 203,
      submissions: 67,
      status: 'active',
      categories: ['Healthcare', 'Technology', 'Mobile']
    },
    {
      id: 3,
      title: 'Fintech for Students Competition',
      description: 'Build financial technology solutions specifically designed for university students.',
      prize: '₦4,000,000',
      deadline: '2025-08-28',
      participants: 89,
      submissions: 28,
      status: 'ending_soon',
      categories: ['Fintech', 'Mobile App', 'Blockchain']
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    setShowSubmissionForm(false);
    // Reset form
    setFormData({ title: '', description: '', category: '', teamSize: 1, files: [] });
  };

  return (
    <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Innovation Challenges
            </h1>
            <p className="text-gray-300 text-lg">
              Participate in competitions and showcase your innovative solutions
            </p>
          </div>
          <button
            onClick={() => setShowSubmissionForm(true)}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Submit Project
          </button>
        </div>

        {/* Active Challenges */}
        <div className="space-y-8">
          {challenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <GlassCard className="p-8">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      <TrophyIcon className="w-6 h-6 text-yellow-400 mr-2" />
                      <h2 className="text-2xl font-bold text-white">{challenge.title}</h2>
                      <span className={`ml-4 px-3 py-1 rounded-full text-xs font-medium ${
                        challenge.status === 'active' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-orange-500/20 text-orange-400'
                      }`}>
                        {challenge.status === 'active' ? 'Active' : 'Ending Soon'}
                      </span>
                    </div>

                    <p className="text-gray-300 text-lg mb-6">
                      {challenge.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {challenge.categories.map(category => (
                        <span
                          key={category}
                          className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full"
                        >
                          {category}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-yellow-400">{challenge.prize}</p>
                        <p className="text-gray-400 text-sm">Prize Pool</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-purple-400">{challenge.participants}</p>
                        <p className="text-gray-400 text-sm">Participants</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-blue-400">{challenge.submissions}</p>
                        <p className="text-gray-400 text-sm">Submissions</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-center text-gray-300 mb-1">
                          <ClockIcon className="w-5 h-5 mr-1" />
                          <span className="font-bold">
                            {new Date(challenge.deadline).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm">Deadline</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 lg:mt-0 lg:ml-8 flex flex-col space-y-3">
                    <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
                      Join Challenge
                    </button>
                    <button className="border border-purple-500/40 text-purple-300 px-6 py-3 rounded-lg font-semibold hover:bg-purple-500/20 transition-all duration-300">
                      View Details
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Submission Form Modal */}
        {showSubmissionForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gray-900/95 backdrop-blur-lg border border-purple-500/20 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Submit Your Project</h2>
                <button
                  onClick={() => setShowSubmissionForm(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-300 font-medium mb-2">
                    Project Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    placeholder="Enter your project title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none resize-none"
                    placeholder="Describe your innovation and its impact"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="technology">Technology</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="environment">Environment</option>
                      <option value="education">Education</option>
                      <option value="fintech">Fintech</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      Team Size
                    </label>
                    <div className="flex items-center">
                      <UsersIcon className="w-5 h-5 text-gray-400 mr-2" />
                      <input
                        type="number"
                        name="teamSize"
                        value={formData.teamSize}
                        onChange={handleInputChange}
                        min="1"
                        max="10"
                        className="w-full px-4 py-3 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-2">
                    Project Files
                  </label>
                  <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-6 text-center hover:border-purple-500/50 transition-colors">
                    <div className="flex justify-center space-x-4 mb-4">
                      <DocumentTextIcon className="w-8 h-8 text-gray-400" />
                      <PhotoIcon className="w-8 h-8 text-gray-400" />
                      <VideoCameraIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-300 mb-2">
                      Drop files here or click to browse
                    </p>
                    <p className="text-gray-400 text-sm">
                      PDF, Images, Videos (Max 50MB each)
                    </p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp4,.mov"
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
                  >
                    Submit Project
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSubmissionForm(false)}
                    className="flex-1 border border-gray-500 text-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-800/50 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default InnovationChallenge;