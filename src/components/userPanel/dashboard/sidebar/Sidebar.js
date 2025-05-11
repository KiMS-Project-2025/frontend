import React, { useState } from 'react';
import { FaPlus, FaStar } from 'react-icons/fa';
import CreateDocumentModal from '../CreateDocumentModal';

const Sidebar = ({ recentDocuments, handleStar, addFrequentSite }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Lấy danh sách tiêu đề duy nhất
  const uniqueTitles = [...new Set(recentDocuments.map(doc => doc.title))];

  const isTitleStarred = (title) =>
    recentDocuments.some(doc => doc.title === title && doc.starred);

  return (
    <div className="w-1/5 bg-white p-6 rounded-tr-xl shadow-md min-h-screen">
      <div className="space-y-4">
        {/* Tạo tài liệu */}
        <button
          className="w-full py-2 text-left border-gray-300 rounded-lg flex items-center hover:bg-blue-50 transition"
          onClick={openModal}
        >
          <FaPlus className="mr-2 text-gray-600" /> Create Site
        </button>

        <CreateDocumentModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onCreate={addFrequentSite}
        />

        {/* Favorites */}
        <div>
          <h3 className="font-semibold text-lg text-gray-700">Favorites</h3>
          <div className="space-y-2 mt-2">
            {recentDocuments
              .filter(doc => doc.starred)
              .map(doc => (
                <div key={doc.id} className="flex items-center gap-2">
                  <FaStar
                    className="cursor-pointer text-yellow-400"
                    onClick={() => handleStar(doc.id)}
                  />
                  <p className="text-gray-600">{doc.title}</p>
                </div>
              ))}
          </div>
        </div>

        {/* Recent Titles */}
        <div>
          <h3 className="font-semibold text-lg text-gray-700 mt-6">Recent Titles</h3>
          <div className="space-y-2 mt-2">
            {uniqueTitles.length > 0 ? (
              uniqueTitles.map((title, idx) => (
                <div key={idx} className="flex items-center gap-2 text-gray-600">
                  <FaStar className={isTitleStarred(title) ? 'text-yellow-400' : 'text-gray-400'} />
                  <span>{title}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">No titles found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;