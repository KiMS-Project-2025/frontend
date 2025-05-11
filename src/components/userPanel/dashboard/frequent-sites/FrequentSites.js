import React, { useState } from 'react';
import { FaStar, FaEllipsisV } from 'react-icons/fa';
import letterColors from '../../../../data/colorData';
import { useNavigate } from 'react-router-dom';
import DocMenu from './docMenu';
import useClickOutside from '../../../../hooks/useClickOutside';

const FrequentSites = ({ documents = [], setRecentDocuments, handleStar, onCardClick }) => {

  const [docMenuVisible, setDocMenuVisible] = useState(false);
  const [docMenuPosition, setDocMenuPosition] = useState({ top: 0, left: 0 });
  const [selectedDoc, setSelectedDoc] = useState(null);

  const menuRef = useClickOutside(() => {
    setDocMenuVisible(false);
  });

  const getBorderColor = (initial) => {
    return letterColors[initial] || 'border-gray-500';
  };

  const navigate = useNavigate();
  const handleCardClick = (docId) => {
    if (onCardClick) {
      onCardClick(docId);
    } else {
      navigate(`/page-layout/${docId}`);
    }
  };

  const openDocMenu = (e, doc) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setDocMenuPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX
    });
    setSelectedDoc(doc);
    setDocMenuVisible(true);
  };

  if (!documents || documents.length === 0) {
    return (
      <div className="w-3/4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Frequent Sites</h2>
        <p className="text-gray-500">No sites available</p>
      </div>
    );
  }

  return (
    <div className="w-3/4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Frequent Sites</h2>
      <div className="grid grid-cols-3 gap-6">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className={`p-6 rounded-lg shadow-md ${getBorderColor(doc.title?.[0])} border-l-4 hover:shadow-lg transition duration-300 ease-in-out`}
            onClick={() => handleCardClick(doc.id)}
            style={{ cursor: 'pointer' }}
          >
            <div className="flex justify-between items-center">
              <div
                className="font-semibold text-xl text-gray-800 truncate max-w-[180px]"
                title={doc.title || 'Untitled'}
              >
                {doc.title || 'Untitled'}
              </div>
              <div className="flex items-center">
                <FaStar
                  className={`cursor-pointer ${doc.starred ? 'text-yellow-400' : 'text-gray-400'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStar(doc.id);
                  }}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openDocMenu(e, doc);
                  }}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <FaEllipsisV />
                </button>
              </div>
            </div>

            <p className="text-gray-600 mt-2">
              <p>Modified at: {doc.modified_at ? new Date(doc.modified_at).toLocaleString() : 'No date'}</p>
            </p>

            <div className="mt-4 text-xs space-y-1">
              {(doc.views || []).map((view, index) => (
                <div key={index} className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded-full bg-gray-300" />
                  <p className="text-gray-500">{view}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {docMenuVisible && selectedDoc && (
        <div ref={menuRef}>
          <DocMenu
            docId={selectedDoc.id}
            docTitle={selectedDoc.title}
            menuPosition={docMenuPosition}
            isMenuVisible={docMenuVisible}
            onEditSuccess={(id, newTitle) => {
              setRecentDocuments((prevDocs) =>
                prevDocs.map((doc) =>
                  doc.id === id ? { ...doc, title: newTitle } : doc
                )
              );
              setDocMenuVisible(false);
            }}
            onDeleteSuccess={() => {
              setDocMenuVisible(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default FrequentSites;