import React from 'react';
import { FaStar } from 'react-icons/fa';
import letterColors from '../../../../data/colorData';
import { useNavigate } from 'react-router-dom';

const FrequentSites = ({ documents, handleStar, onCardClick }) => {
  const getBorderColor = (initial) => {
    return letterColors[initial] || 'border-gray-500'; 
  };

  const navigate = useNavigate();
  const handleCardClick = (docId) => {
    if (onCardClick) {
      onCardClick(docId);  // Gọi hàm onCardClick để thực hiện điều hướng
    } else {
      navigate(`/page-layout/${docId}`);  
    }
  };

  return (
    <div className="w-3/4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Frequent Sites</h2>
      <div className="grid grid-cols-3 gap-6">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className={`p-6 rounded-lg shadow-md ${getBorderColor(doc.title[0])} border-l-4 hover:shadow-lg transition duration-300 ease-in-out`}
            onClick={() => handleCardClick(doc.id)}  // Gọi hàm điều hướng khi nhấn vào thẻ
            style={{ cursor: 'pointer' }}  // Thêm con trỏ tay khi hover
          >
            {/* Header of the card */}
            <div className="flex justify-between items-center">
              <div className="font-semibold text-xl text-gray-800">{doc.title}</div>
              <FaStar
                className={`cursor-pointer ${doc.starred ? 'text-yellow-400' : 'text-gray-400'}`}
                onClick={(e) => {
                  e.stopPropagation(); // Ngăn không cho sự kiện click lan truyền
                  handleStar(doc.id);
                }}
              />
            </div>

            {/* Document description */}
            <p className="text-gray-600 mt-2">{doc.shortDescription}</p>

            {/* Viewed info */}
            <div className="mt-4 text-xs space-y-1">
              {doc.views.map((view, index) => (
                <div key={index} className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded-full bg-gray-300" />
                  <p className="text-gray-500">{view}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FrequentSites;