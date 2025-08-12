import React, { useState } from 'react';
import GlassCard from '../components/GlassCard';

const tiers = [
  { name: 'Regular', min: 0, perks: ['Access to view projects', 'Can donate to charity'] },
  { name: 'Bronze', min: 100, perks: ['All Regular perks', 'Basic voting rights', 'Can invest in projects'] },
  { name: 'Silver', min: 1000, perks: ['All Bronze perks', 'Early access to new projects', 'Higher ROI'] },
  { name: 'Gold', min: 5000, perks: ['All Silver perks', 'Exclusive events', 'Premium support'] },
  { name: 'Platinum', min: 20000, perks: ['All Gold perks', 'Personalized investment reports', 'VIP community access'] },
];

const projects = [
  { id: 1, title: 'Smart Campus Navigation App', funding: 560000, target: 1000000 },
  { id: 2, title: 'Sustainable Water Purification', funding: 3240000, target: 6000000 },
];

const charities = [
  { id: 1, title: 'Flood Relief Fund', description: 'Support students affected by recent floods.' },
  { id: 2, title: 'Fire Outbreak Recovery', description: 'Help rebuild after campus fire incidents.' },
];

const InvestmentPortal = () => {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [investedProject, setInvestedProject] = useState<number | null>(null);
  const [donatedCharity, setDonatedCharity] = useState<number | null>(null);

  return (
    <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Investment & Charity Portal</h1>

      {/* Membership Tiers */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-white mb-4">Become a Member</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier, idx) => (
            <GlassCard key={tier.name} className="p-6 flex flex-col items-center">
              <h3 className="text-xl font-bold text-purple-300 mb-2">{tier.name} Tier</h3>
              <p className="text-white mb-2">Min. Purchase: <span className="font-semibold">{tier.min} $CSHARE</span></p>
              <ul className="text-gray-200 mb-4 list-disc list-inside text-sm">
                {tier.perks.map(perk => <li key={perk}>{perk}</li>)}
              </ul>
              {tier.name !== 'Regular' && (
                <button
                  onClick={() => setSelectedTier(tier.name)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                >
                  Buy {tier.name}
                </button>
              )}
              {selectedTier === tier.name && (
                <div className="mt-3 text-green-400 text-sm">Purchased! (Simulated)</div>
              )}
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Invest in Projects */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-white mb-4">Invest in Student Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map(project => (
            <GlassCard key={project.id} className="p-6">
              <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
              <p className="text-gray-300 mb-2">Funding: ₦{project.funding.toLocaleString()} / ₦{project.target.toLocaleString()}</p>
              <button
                onClick={() => setInvestedProject(project.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Invest
              </button>
              {investedProject === project.id && (
                <div className="mt-2 text-green-400 text-sm">Thank you for investing! (Simulated)</div>
              )}
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Charity Donations */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-white mb-4">Charity & Disaster Relief</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {charities.map(charity => (
            <GlassCard key={charity.id} className="p-6">
              <h3 className="text-lg font-bold text-white mb-2">{charity.title}</h3>
              <p className="text-gray-300 mb-4">{charity.description}</p>
              <button
                onClick={() => setDonatedCharity(charity.id)}
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
              >
                Donate
              </button>
              {donatedCharity === charity.id && (
                <div className="mt-2 text-green-400 text-sm">Thank you for your donation! (Simulated)</div>
              )}
            </GlassCard>
          ))}
        </div>
      </section>
    </div>
  );
};

export default InvestmentPortal;