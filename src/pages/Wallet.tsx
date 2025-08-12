import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  WalletIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CreditCardIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import GlassCard from '../components/GlassCard';

const Wallet = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [buyAmount, setBuyAmount] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');

  const walletStats = {
    cshareBalance: 1250.50,
    nairaValue: 87535.00,
    totalInvested: 75000.00,
    totalReturns: 12535.00,
    portfolioGrowth: 16.7
  };

  const recentTransactions = [
    {
      id: 1,
      type: 'buy',
      amount: 500,
      project: 'Smart Campus Security System',
      date: '2024-01-15',
      status: 'completed',
      hash: '0x1a2b3c4d...'
    },
    {
      id: 2,
      type: 'sell',
      amount: 200,
      project: 'Telemedicine Platform',
      date: '2024-01-14',
      status: 'completed',
      hash: '0x2b3c4d5e...'
    },
    {
      id: 3,
      type: 'buy',
      amount: 750,
      project: 'Blockchain Student Credentials',
      date: '2024-01-13',
      status: 'pending',
      hash: '0x3c4d5e6f...'
    },
    {
      id: 4,
      type: 'reward',
      amount: 100,
      project: 'Platform Referral Bonus',
      date: '2024-01-12',
      status: 'completed',
      hash: '0x4d5e6f7g...'
    }
  ];

  const handleConnectWallet = () => {
    setIsConnected(true);
  };

  const handleBuyTokens = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle token purchase
    console.log('Buying tokens:', buyAmount);
    setShowBuyModal(false);
    setBuyAmount('');
  };

  const handleSellTokens = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle token selling logic here
    console.log('Selling tokens:', sellAmount);
    setShowSellModal(false);
    setSellAmount('');
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle withdraw logic here
    console.log('Withdrawing:', withdrawAmount, bankName, accountNumber, accountName);
    setShowWithdrawModal(false);
    setWithdrawAmount('');
    setBankName('');
    setAccountNumber('');
    setAccountName('');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-400" />;
      case 'failed':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'buy':
        return <ArrowDownIcon className="w-5 h-5 text-green-400" />;
      case 'sell':
        return <ArrowUpIcon className="w-5 h-5 text-red-400" />;
      case 'reward':
        return <BanknotesIcon className="w-5 h-5 text-blue-400" />;
      default:
        return <ArrowUpIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Polygon Wallet
          </h1>
          <p className="text-gray-300 text-lg">
            Manage your $CSHARE tokens and support student innovations
          </p>
        </div>

        {!isConnected ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <GlassCard className="p-12 text-center max-w-md mx-auto">
              <WalletIcon className="w-16 h-16 text-purple-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">
                Connect Your Polygon Wallet
              </h2>
              <p className="text-gray-300 mb-8">
                Connect your MetaMask or compatible wallet to start supporting student innovations with $CSHARE tokens.
              </p>
              <button
                onClick={handleConnectWallet}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 mb-4"
              >
                Connect MetaMask
              </button>
              <p className="text-gray-400 text-sm">
                Make sure you're on the Polygon network
              </p>
            </GlassCard>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-400 font-medium">$CSHARE Balance</h3>
                  <WalletIcon className="w-6 h-6 text-purple-400" />
                </div>
                <p className="text-3xl font-bold text-white mb-2">
                  {walletStats.cshareBalance.toLocaleString()}
                </p>
                <p className="text-gray-400 text-sm">
                  ≈ ₦{walletStats.nairaValue.toLocaleString()}
                </p>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-400 font-medium">Total Invested</h3>
                  <ArrowDownIcon className="w-6 h-6 text-green-400" />
                </div>
                <p className="text-3xl font-bold text-white mb-2">
                  ₦{walletStats.totalInvested.toLocaleString()}
                </p>
                <p className="text-gray-400 text-sm">
                  Across {recentTransactions.filter(t => t.type === 'buy').length} projects
                </p>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-400 font-medium">Total Returns</h3>
                  <ArrowUpIcon className="w-6 h-6 text-blue-400" />
                </div>
                <p className="text-3xl font-bold text-white mb-2">
                  ₦{walletStats.totalReturns.toLocaleString()}
                </p>
                <p className="text-green-400 text-sm flex items-center">
                  <ArrowUpIcon className="w-4 h-4 mr-1" />
                  +{walletStats.portfolioGrowth}%
                </p>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-400 font-medium">Network</h3>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <p className="text-xl font-bold text-white mb-2">
                  Polygon
                </p>
                <p className="text-gray-400 text-sm">
                  Connected
                </p>
              </GlassCard>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowBuyModal(true)}
                className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center"
              >
                <ArrowDownIcon className="w-5 h-5 mr-2" />
                Buy $CSHARE
              </button>
              <button
                onClick={() => setShowSellModal(true)}
                className="flex-1 border border-purple-500/40 text-purple-300 py-4 px-6 rounded-lg font-semibold hover:bg-purple-500/20 transition-all duration-300 flex items-center justify-center"
              >
                <ArrowUpIcon className="w-5 h-5 mr-2" />
                Sell Tokens
              </button>
              <button
                onClick={() => setShowWithdrawModal(true)}
                className="flex-1 border border-blue-500/40 text-blue-300 py-4 px-6 rounded-lg font-semibold hover:bg-blue-500/20 transition-all duration-300 flex items-center justify-center"
              >
                <CreditCardIcon className="w-5 h-5 mr-2" />
                Withdraw
              </button>
            </div>

            {/* Transaction History */}
            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Transaction History</h2>
              <div className="space-y-4">
                {recentTransactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border border-purple-500/20 rounded-lg hover:border-purple-500/40 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gray-800/50 rounded-lg">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {transaction.type === 'buy' ? 'Bought' : 
                           transaction.type === 'sell' ? 'Sold' : 'Reward'} {transaction.amount} $CSHARE
                        </p>
                        <p className="text-gray-400 text-sm">{transaction.project}</p>
                        <p className="text-gray-500 text-xs">
                          {new Date(transaction.date).toLocaleDateString()} • {transaction.hash}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.type === 'buy' || transaction.type === 'reward' 
                            ? 'text-green-400' 
                            : 'text-red-400'
                        }`}>
                          {transaction.type === 'buy' || transaction.type === 'reward' ? '+' : '-'}
                          {transaction.amount} $CSHARE
                        </p>
                        <p className="text-gray-400 text-sm">
                          ≈ ₦{(transaction.amount * 70).toLocaleString()}
                        </p>
                      </div>
                      {getStatusIcon(transaction.status)}
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <button className="text-purple-400 hover:text-purple-300 font-medium">
                  View All Transactions →
                </button>
              </div>
            </GlassCard>
          </div>
        )}

        {/* Buy Tokens Modal */}
        {showBuyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gray-900/95 backdrop-blur-lg border border-purple-500/20 rounded-2xl p-8 max-w-md w-full"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Buy $CSHARE Tokens</h2>
                <button
                  onClick={() => setShowBuyModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleBuyTokens} className="space-y-6">
                <div>
                  <label className="block text-gray-300 font-medium mb-2">
                    Amount (Naira)
                  </label>
                  <input
                    type="number"
                    value={buyAmount}
                    onChange={(e) => setBuyAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    placeholder="Enter amount in Naira"
                    required
                  />
                  {buyAmount && (
                    <p className="text-gray-400 text-sm mt-2">
                      You will receive ≈ {Math.floor(Number(buyAmount) / 70)} $CSHARE tokens
                    </p>
                  )}
                </div>

                <div className="bg-gray-800/30 p-4 rounded-lg">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Exchange Rate</span>
                    <span className="text-white">1 $CSHARE = ₦70</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Network Fee</span>
                    <span className="text-white">~₦50</span>
                  </div>
                  <hr className="border-purple-500/20 my-2" />
                  <div className="flex justify-between font-medium">
                    <span className="text-gray-300">Total</span>
                    <span className="text-white">
                      ₦{buyAmount ? (Number(buyAmount) + 50).toLocaleString() : '0'}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
                  >
                    Confirm Purchase
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBuyModal(false)}
                    className="flex-1 border border-gray-500 text-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-800/50 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Sell Tokens Modal */}
        {showSellModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gray-900/95 backdrop-blur-lg border border-purple-500/20 rounded-2xl p-8 max-w-md w-full"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Sell $CSHARE Tokens</h2>
                <button
                  onClick={() => setShowSellModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleSellTokens} className="space-y-6">
                <div>
                  <label className="block text-gray-300 font-medium mb-2">
                    Amount ($CSHARE)
                  </label>
                  <input
                    type="number"
                    value={sellAmount}
                    onChange={(e) => setSellAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    placeholder="Enter amount to sell"
                    required
                  />
                  {sellAmount && (
                    <p className="text-gray-400 text-sm mt-2">
                      You will receive ≈ ₦{Math.floor(Number(sellAmount) * 70)}
                    </p>
                  )}
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
                  >
                    Confirm Sell
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSellModal(false)}
                    className="flex-1 border border-gray-500 text-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-800/50 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Withdraw Modal */}
        {showWithdrawModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gray-900/95 backdrop-blur-lg border border-blue-500/20 rounded-2xl p-8 max-w-md w-full"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Withdraw Funds</h2>
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleWithdraw} className="space-y-6">
                <div>
                  <label className="block text-gray-300 font-medium mb-2">
                    Amount (Naira)
                  </label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter amount to withdraw"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-medium mb-2">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter your bank name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-medium mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter your account number"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-medium mb-2">
                    Account Name
                  </label>
                  <input
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter your account name"
                    required
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-teal-600 transition-all duration-300"
                  >
                    Confirm Withdraw
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowWithdrawModal(false)}
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

export default Wallet;