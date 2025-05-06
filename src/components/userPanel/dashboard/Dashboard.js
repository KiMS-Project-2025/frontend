
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './header/Header';
import Sidebar from './sidebar/Sidebar';
import FrequentSites from './frequent-sites/FrequentSites';
import documents from '../../../data/documentData';

const Dashboard = () => {
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setRecentDocuments(documents);
  }, []);

  // Toggle the "starred" state of the document
  const handleStar = (docId) => {
    setRecentDocuments((prevDocs) =>
      prevDocs.map((doc) =>
        doc.id === docId ? { ...doc, starred: !doc.starred } : doc
      )
    );
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleCardClick = (docId) => {
    navigate(`/page-layout/${docId}`);  // Điều hướng đến trang PageLayout với documentId
  };

  // Function to handle adding a new site
  const addFrequentSite = (siteName) => {
    const newSite = {
      id: recentDocuments.length + 1,
      title: siteName,
      shortDescription: `New site: ${siteName}`,
      views: [],
      starred: false,
    };
    setRecentDocuments([...recentDocuments, newSite]);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Component */}
      <Header toggleDropdown={toggleDropdown} dropdownOpen={dropdownOpen} />

      <div className="flex gap-6">
        {/* Sidebar Component: Truyền các props vào Sidebar */}
        <Sidebar
          recentDocuments={recentDocuments}
          handleStar={handleStar}
          addFrequentSite={addFrequentSite}
        />

        {/* Frequent Sites Component: Truyền các props vào FrequentSites */}
        <FrequentSites 
        documents={recentDocuments} 
        handleStar={handleStar}
        onCardClick={(handleCardClick)}
        />
      </div>
    </div>
  );
};

export default Dashboard;