import React, { useState } from 'react';

const mockVendors = [
  { id: 1, name: 'Mama Chika', type: 'Elderly/Trusted Vendor', verified: false },
  { id: 2, name: 'John Doe', type: 'Student Vendor', verified: true },
];

const AdminVendors = () => {
  const [vendors, setVendors] = useState(mockVendors);

  const handleVerify = (id: number) => {
    setVendors(vendors.map(v =>
      v.id === id ? { ...v, verified: true } : v
    ));
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-white">Vendor Verification</h2>
      <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-900 text-gray-300">
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">Type</th>
            <th className="py-2 px-4 text-left">Status</th>
            <th className="py-2 px-4"></th>
          </tr>
        </thead>
        <tbody>
          {vendors.map(vendor => (
            <tr key={vendor.id} className="border-b border-gray-700">
              <td className="py-2 px-4">{vendor.name}</td>
              <td className="py-2 px-4">{vendor.type}</td>
              <td className="py-2 px-4">
                {vendor.verified ? (
                  <span className="text-green-400 font-semibold">Verified</span>
                ) : (
                  <span className="text-yellow-400 font-semibold">Pending</span>
                )}
              </td>
              <td className="py-2 px-4">
                {!vendor.verified && (
                  <button
                    onClick={() => handleVerify(vendor.id)}
                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                  >
                    Verify
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminVendors;