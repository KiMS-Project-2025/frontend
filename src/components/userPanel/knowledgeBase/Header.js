import React, { useState } from 'react';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import DropdownMenu from '../dashboard/header/DropdownMenu';
import { API_URL } from '../../../constant';

const Header = ({ title, toggleDropdown, dropdownOpen, documentTitle, onSearchResults }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = async () => {
        if (!searchQuery) return;
        try {
            const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(searchQuery)}`);
            if (!response.ok) throw new Error('Search failed');
            const data = await response.json();

            onSearchResults(data);
        } catch (error) {
            alert('Error searching: ' + error.message);
            onSearchResults([]);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <header className="sticky top-0 flex justify-between items-center mb-5 bg-custom-blue p-3 shadow-md">
            {/* Left: Dashboard title */}
            <div className="text-left">
                <h1 className="text-2xl font-bold text-gray-800">{documentTitle || title || 'Dashboard'}</h1>
            </div>

            {/* Center: Search bar */}
            <div className="w-1/3 flex justify-center">
                <div className="flex items-center w-full bg-gray-100 p-2 rounded-lg">
                    <input
                        type="text"
                        placeholder="Search for documents..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent border-none focus:outline-none text-gray-700"
                        onKeyDown={handleKeyPress}
                    />
                    <button onClick={handleSearch} className="ml-2 bg-blue-600 text-white px-3 py-1 rounded">
                        <FaSearch />
                    </button>
                </div>
            </div>

            {/* Right: User icon and dropdown menu */}
            <nav className="flex items-center relative">
                <button onClick={toggleDropdown} className="focus:outline-none">
                    <FaUserCircle className="text-3xl text-gray-600 hover:text-blue-600" />
                </button>

                {/* Render DropdownMenu */}
                {dropdownOpen && <DropdownMenu />}
            </nav>
        </header>
    );
};

export default Header;