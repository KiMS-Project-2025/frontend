// src/components/knowledgeBase/PageLayout.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import Header from './Header';
import Body from './Body';  // Import Body component
import { API_URL } from '../../../constant';

const PageLayout = () => { 
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [files, setFiles] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [fileName] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState('');


  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setError('');
        if (!id) {
          setError('No document ID provided');
          return;
        }
        const response = await fetch(`${API_URL}/document?id=${id}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        if (!data || !data.id) {
          setError('Document not found');
          setDocument(null);
          setFilteredDocuments([]);
        } else {
          setDocument(data);
          setFiles(data.files || []);
          setFilteredDocuments(data.files || []);
        }
      } catch (error) {
        setError('Error fetching document');
        setDocument(null);
        setFilteredDocuments([]);
      }
    };

    if (id) fetchDocument();
  }, [id]);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  if (error) return <div>{error}</div>;
  if (!document) return <div>Document not found</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-6">
      {/* Header */}
      <div>
        <Header 
            title={document ? document.title : fileName || 'Document Not Found'} 
            toggleDropdown={toggleDropdown} 
            dropdownOpen={dropdownOpen} 
        />
      </div>

      {/* Body */}
      <Body 
        filteredDocuments={filteredDocuments} 
        setFilteredDocuments={setFilteredDocuments}
        documentId={id}
      />
    </div>
  );
};

export default PageLayout;