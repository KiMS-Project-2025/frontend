// src/components/knowledgeBase/PageLayout.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom'; 
import fileData from '../../../data/fileData'; // Import fileData (dữ liệu tài liệu)
import Header from './Header';
import Body from './Body';  // Import Body component
import documents from '../../../data/documentData';

const PageLayout = () => {
  const { documentId } = useParams();

  // Tìm tài liệu theo ID từ fileData
  const document = documents.find((doc) => doc.id === parseInt(documentId));

  // State để quản lý tìm kiếm và danh sách tài liệu đã lọc
  const [filteredDocuments, setFilteredDocuments] = useState(fileData);
  const [fileName] = useState('');  // Lưu tên file PDF

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev); // Đảo ngược trạng thái dropdown
  };

  return (
    <div className="bg-gray-50 min-h-screen">
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
      />

    </div>
  );
};

export default PageLayout;