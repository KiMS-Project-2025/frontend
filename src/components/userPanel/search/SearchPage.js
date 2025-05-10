import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilePdf, FaEllipsisV } from 'react-icons/fa';
import { API_URL } from '../../../constant';
import FileMenu from '../knowledgeBase/FileMenu';

const CATEGORY_OPTIONS = [
  { id: '1', name: 'IT' },
  { id: '2', name: 'BA' },
  { id: '3', name: 'EE' },
  { id: '4', name: 'EN' },
];

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortOrder, setSortOrder] = useState('Newest First');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);

  const handleSearch = async () => {
    if (!searchQuery) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setSearchResults(Array.isArray(data) ? data : [data]);
    } catch (error) {
      setSearchResults([]);
      alert('Error searching: ' + error.message);
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleMenu = (e, id) => {
    const rect = e.target.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom,
      left: rect.left,
    });
    setActiveMenu(activeMenu === id ? null : id);
  };

  // File actions handlers
  const handleEditName = async (id) => {
    const newName = prompt('Enter new name:');
    if (newName) {
      try {
        const formData = new URLSearchParams();
        formData.append('id', id);
        formData.append('title', newName);

        const response = await fetch(`${API_URL}/file`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString(),
        });
        if (!response.ok) throw new Error('Failed to update name');
        setSearchResults((prev) =>
          prev.map((doc) => doc.id === id ? { ...doc, title: newName } : doc)
        );
      } catch (error) {
        alert('Error updating name: ' + error.message);
      }
    }
  };

  const handleEditDescription = async (id) => {
    const newDescription = prompt('Enter new description:');
    if (newDescription) {
      try {
        const formData = new URLSearchParams();
        formData.append('id', id);
        formData.append('description', newDescription);

        const response = await fetch(`${API_URL}/file`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString(),
        });
        if (!response.ok) throw new Error('Failed to update description');
        setSearchResults((prev) =>
          prev.map((doc) => doc.id === id ? { ...doc, description: newDescription } : doc)
        );
      } catch (error) {
        alert('Error updating description: ' + error.message);
      }
    }
  };

  const handleDeleteFile = async (id) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    try {
      const formData = new URLSearchParams();
      formData.append('id', id);

      const response = await fetch(`${API_URL}/file`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });
      if (!response.ok) throw new Error('Failed to delete file');
      setSearchResults((prev) => prev.filter((doc) => doc.id !== id));
    } catch (error) {
      alert('Error deleting file: ' + error.message);
    }
  };

  const handleDownloadFile = async (id) => {
    try {
      const response = await fetch(`${API_URL}/file?id=${id}&download=1`);
      if (!response.ok) throw new Error('Failed to download file');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      alert('Error downloading file: ' + error.message);
    }
  };

  const getNameById = (id) => {
    const category = CATEGORY_OPTIONS.find(item => item.id === id);
    return category ? category.name : null;
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-custom-blue shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full">
            <div className="text-left">
              <h1 className="text-2xl font-semibold text-gray-800">Search Page</h1>
            </div>

            {/* Search Bar */}
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search files..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All Categories">All Categories</option>
                {CATEGORY_OPTIONS.map(option => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
              </select>

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Newest First">Newest First</option>
                <option value="Oldest First">Oldest First</option>
                <option value="Name A-Z">Name A-Z</option>
                <option value="Name Z-A">Name Z-A</option>
              </select>

              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Searching...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((doc) => (
              <div key={doc.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                {/* Header with PDF icon and title */}
                <div className="p-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <FaFilePdf className="text-red-500 text-lg" />
                    <div>
                      <h3 className="ml-2 font-medium text-gray-800">{doc.title || "Untitled Document"}</h3>
                      {doc.documentName && doc.fileName && (
                        <div className="ml-2 text-xs text-gray-400">
                          {doc.documentName} &gt; {doc.fileName}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Category tag */}
                    {doc.category && (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold text-white w-fit ${
                          doc.category === 'IT' ? 'bg-blue-500' :
                          doc.category === 'BA' ? 'bg-green-500' :
                          doc.category === 'EE' ? 'bg-yellow-500 text-gray-800' :
                          doc.category === 'EN' ? 'bg-indigo-500' :
                          'bg-gray-400'
                        }`}
                      >
                        {doc.category}
                      </span>
                    )}
                    <button
                      onClick={(e) => toggleMenu(e, doc.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <FaEllipsisV />
                    </button>
                  </div>
                </div>

                {/* Document info */}
                <div className="p-4">
                  <p className="text-sm text-gray-700 font-medium mb-1">
                    {doc.description || "No description available"}
                  </p>
                  <div className="text-xs text-gray-400">
                    Modified at: {new Date(doc.modified_at).toLocaleString()}
                  </div>
                </div>

                {/* File Menu */}
                <FileMenu
                  docId={doc.id}
                  isMenuVisible={activeMenu === doc.id}
                  menuPosition={menuPosition}
                  onEdit={handleEditName}
                  onEditDescription={handleEditDescription}
                  onDelete={handleDeleteFile}
                  onDownload={handleDownloadFile}
                />
              </div>
            ))}
            {searchResults.length === 0 && !loading && (
              <div className="col-span-full text-center py-8 text-gray-500">
                No results found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage; 