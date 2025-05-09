import React, { useState } from 'react';
import { FaPlus, FaStar } from 'react-icons/fa';

const Sidebar = ({ recentDocuments, handleStar, addFrequentSite }) => {
  const [newSiteName, setNewSiteName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mở modal để tạo thẻ mới
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Đóng modal
  const closeModal = () => {
    setIsModalOpen(false);
    setNewSiteName('');  // Reset tên site khi đóng modal
  };

  // Thêm site mới vào Frequent Sites
  const handleAddSite = () => {
    if (newSiteName.trim()) {
      addFrequentSite(newSiteName);  // Thêm site mới vào danh sách
      closeModal();
    }
  };

  return (
    <div className="w-1/5 bg-white p-6 rounded-tr-xl shadow-md min-h-screen">
      <div className="space-y-4">
        {/* Create Site Button */}
        <button 
          className="w-full py-2 text-left border-gray-300 rounded-lg flex items-center" 
          onClick={openModal}
        >
          <FaPlus className="mr-2 text-gray-600" /> Create Site
        </button>

        {/* Modal to Create New Site */}
        {isModalOpen && (
          <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-xl font-semibold mb-4">Create New Document</h2>
              <input
                type="text"
                placeholder="Enter site name"
                value={newSiteName}
                onChange={(e) => setNewSiteName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-4"
              />
              <div className="flex justify-between">
                <button
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSite}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Add Site
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Following Section */}
        <div>
          <h3 className="font-semibold text-lg text-gray-700">Following</h3>
          <div className="space-y-2 mt-2">
            {recentDocuments
              .filter((doc) => doc.starred)
              .map((doc) => (
                <div key={doc.id} className="flex items-center gap-2">
                  <FaStar className="text-yellow-400" />
                  <p className="text-gray-600">{doc.title}</p>
                </div>
              ))}
          </div>
        </div>

        {/* Recent Documents Section */}
        <div>
          <h3 className="font-semibold text-lg text-gray-700">Recent Documents</h3>
          <div className="space-y-2 mt-2">
            {recentDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center gap-2">
                <FaStar
                  className={`cursor-pointer ${doc.starred ? 'text-yellow-400' : 'text-gray-400'}`}
                  onClick={() => handleStar(doc.id)}
                />
                <p className="text-gray-600">{doc.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;