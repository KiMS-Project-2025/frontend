import React, { useState, useEffect } from 'react';
import Filters from './Filters';  // Import Filters component
import FileList from './FileList';  // Import FileList component
import AddFileButton from './AddFileButton';  // Import AddFileButton component

const Body = ({ filteredDocuments, setFilteredDocuments, documentId }) => {
    const [allDocuments, setAllDocuments] = useState(filteredDocuments);
    const [originalDocuments, setOriginalDocuments] = useState([]);

    useEffect(() => {
        setOriginalDocuments(filteredDocuments);
        setAllDocuments(filteredDocuments);
        setFilteredDocuments(filteredDocuments); 
    }, [filteredDocuments]);

    const handleSearch = (category, sortOrder) => {
        const isAllCategories = category === 'All Categories';
    
        // Filter documents by category (if needed)
        const filtered = allDocuments.filter(doc => 
            isAllCategories || doc.cid === category
        );
    
        // Sort the filtered results
        const sorted = filtered.sort((a, b) => {
            const dateA = new Date(a.modified_at);
            const dateB = new Date(b.modified_at);
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });
    
        setFilteredDocuments(sorted);
    };

    return (
        <div>
            {/* Body */}
            <div className="flex justify-between p-6">
                {/* Left: Add File Button */}
                <AddFileButton
                    setFilteredDocuments={setFilteredDocuments}
                    documentId={documentId}
                />

                {/* Right: Filters */}
                <Filters handleSearch={handleSearch} />
            </div>

            {/* File List */}
            <div className="px-6">
                <FileList
                    filteredDocuments={filteredDocuments}
                    setFilteredDocuments={setFilteredDocuments}
                    documentId={documentId}
                />
            </div>

        </div>
    );
};

export default Body;