import React, { useState } from 'react';
import axios from 'axios';
import '../styles/search.css';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function GeneralSearch() {
    const [searchFor, setSearchFor] = useState('books');
    const [searchBy, setSearchBy] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');

    const searchOptions = { // Define search options based on Books schema
        books: ['Search By:', 'Title', 'Author', 'Genre', 'Status'],
    };

    async function handleSearch(e) {
        e.preventDefault();
        if (!searchTerm.trim()) {
            setError('Please enter a search term');
            return;
        }
        setError('');
        try {
            const response = await axios.post('http://localhost:3100/home', {
                searchTerm,
                searchBy,
                type: "generalsearch"
            });
            if (response) 
            {
                setResults(response.data);
            } 
            if (response.data.length == 0)
            {
                setError('No results found');
            }
            else 
            {
                setError('Result found:');
                // navigate('/searchResults'); // Navigate to the results page
            }
        } catch (err) {
            console.log(err);
            setError('Error occurred during search');
        }
    };

    return (
        <div className="search-container">
            <select value={searchFor} onChange={(e) => setSearchFor(e.target.value)}>
                <option value="books">books</option>
                {/* Add more options if needed */}
            </select>
            <select value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
                {searchOptions[searchFor].map((option) => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <button onClick={handleSearch}>Search</button>
            {error && <p className="error">{error}</p>}
            <div className="results">
                {results.map((result) => (
                    <div key={result.Title} className="result">
                        <p>Title: {result.Title}</p>
                        <p>Author: {result.Author}</p>
                        <p>Genre: {result.Genre}</p>
                        <p>Status: {result.Status}</p>
                        <p>Borrowed by: {result.BorrowedBy}</p>
                    </div>))}
            </div>
        </div>
    );
}

export default GeneralSearch;