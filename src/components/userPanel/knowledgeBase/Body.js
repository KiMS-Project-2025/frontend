import React from 'react';
import Filters from './Filters';  // Import Filters component
import FileList from './FileList';  // Import FileList component
import AddFileButton from './AddFileButton';  // Import AddFileButton component

const Body = ({ filteredDocuments, setFilteredDocuments }) => {

    return (
        <div>
            {/* Body */}
            <div className="flex justify-between p-6">
                {/* Left: Add File Button */}
                <AddFileButton setFilteredDocuments={setFilteredDocuments} />

                {/* Right: Filters */}
                <Filters />
            </div>

            {/* File List */}
            <div className="px-6">
                <FileList 
                    filteredDocuments={filteredDocuments} 
                    setFilteredDocuments={setFilteredDocuments} 
                />
            </div>

        </div>
    );
};

export default Body;