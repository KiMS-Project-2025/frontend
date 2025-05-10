import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './header/Header';
import Sidebar from './sidebar/Sidebar';
import FrequentSites from './frequent-sites/FrequentSites';
import { API_URL } from '../../../constant';

const Dashboard = () => {
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch(`${API_URL}/home`);
        const data = await response.json();
        console.log('API Response:', data); // Debug log

        if (!data || !Array.isArray(data)) {
          console.error('Invalid data format:', data);
          return;
        }

        const starredMap = getStarredFromStorage();

        setRecentDocuments(data.map(doc => ({
          ...doc,
          starred: !!starredMap[doc.id],
          shortDescription: doc.title,
          uploadDate: new Date(doc.modified_at).toLocaleDateString()
        })));
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };

    fetchDocuments();
  }, []);

  // Toggle the "starred" state of the document
  const handleStar = (docId) => {
    setRecentDocuments((prevDocs) => {
      const updatedDocs = prevDocs.map((doc) =>
        doc.id === docId ? { ...doc, starred: !doc.starred } : doc
      );

      const starredMap = {};
      updatedDocs.forEach(doc => {
        if (doc.starred) starredMap[doc.id] = true;
      });

      saveStarredToStorage(starredMap);

      return updatedDocs;
    });
  };

  const getStarredFromStorage = () => {
    const stored = localStorage.getItem('starredDocs');
    return stored ? JSON.parse(stored) : {};
  };

  const saveStarredToStorage = (starredMap) => {
    localStorage.setItem('starredDocs', JSON.stringify(starredMap));
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleCardClick = (docId) => {
    navigate(`/page-layout/${docId}`);
  };

  // Function to handle adding a new site
  const addFrequentSite = async (siteName) => {
    try {
      const response = await fetch(`${API_URL}/document`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ title: siteName }).toString(),
      });
      const newDoc = await response.json();
      setRecentDocuments(prev => [
        ...prev,
        {
          ...newDoc,
          starred: false,
          shortDescription: newDoc.title,
          uploadDate: new Date(newDoc.modified_at).toLocaleDateString(),
        },
      ]);
    } catch (error) {
      console.error('Error creating new document:', error);
    }
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
          onCardClick={handleCardClick}
        />
      </div>
    </div>
  );
};

export default Dashboard;