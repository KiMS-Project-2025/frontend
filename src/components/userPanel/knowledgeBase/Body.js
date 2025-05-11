import React, { useState, useEffect } from 'react';
import Filters from './Filters';  // Import Filters component
import FileList from './FileList';  // Import FileList component
import AddFileButton from './AddFileButton';  // Import AddFileButton component

const Body = ({ filteredDocuments, setFilteredDocuments, documentId, document }) => {
    // Keep track of the original documents from the API
    const [originalDocuments, setOriginalDocuments] = useState([]);
    // Keep track of the current filtered documents
    const [currentFiltered, setCurrentFiltered] = useState([]);

    // Initialize with the documents from props
    useEffect(() => {
        setOriginalDocuments(document.files);
        setCurrentFiltered(filteredDocuments);
    }, [filteredDocuments, document.files]);

    const handleSearch = (category, sortOrder) => {
        console.log('Searching with:', { category, sortOrder });

        // Always start with the original documents for filtering
        let filtered = [...originalDocuments];

        // Apply category filter if not 'all'
        if (category !== 'all') {
            filtered = filtered.filter(doc => doc.cid === category);
        }

        // Sort the filtered results
        const sorted = filtered.sort((a, b) => {
            const dateA = new Date(a.modified_at);
            const dateB = new Date(b.modified_at);
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

        // Update both the current filtered list and the parent's filtered documents
        setCurrentFiltered(sorted);
        // setFilteredDocuments(sorted);
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
                    filteredDocuments={currentFiltered}
                    setFilteredDocuments={setFilteredDocuments}
                    documentId={documentId}
                />
            </div>

        </div>
    );
};

export default Body;