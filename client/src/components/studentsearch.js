import React, { useState } from 'react';
import axios from 'axios';
import '../styles/search.css';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function StudentSearch(props) {
    const [searchFor, setSearchFor] = useState('books');
    const [searchBy, setSearchBy] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');
    const studentId = props.username;

    const searchOptions = { // Define search options based on Books schema
        books: ['Search By:', 'Title', 'Author', 'Genre', 'Status'],
    };

    const handleBorrow = async (bookTitle) => {
        try {
            const book = results.find(b => b.Title === bookTitle && b.Status === 'A');
            if (book) {
                const response = await axios.post('http://localhost:3100/home', {
                    title: bookTitle,
                    username: studentId,
                    genre: book.Genre,
                    author: book.Author,
                    type: "borrow"
                });
    
                if (response.data.success) {
                    alert('Book borrowed successfully');
                    setResults(results.map(b => b.Title === bookTitle ? { ...b, Status: 'B', BorrowedBy: studentId } : b));
                } else {
                    alert('Failed to borrow the book: ' + response.data.message);
                }
            } else {
                alert('Book not available or not found');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred while borrowing the book');
        }
    };
    
    const handleReturn = async (bookTitle) => {
        try {
            const book = results.find(b => b.Title === bookTitle && b.Status === 'B');
            if (book) {
                const response = await axios.post('http://localhost:3100/home', {
                    title: bookTitle,
                    username: studentId, // Replace with the actual logged-in student's username
                    genre: book.Genre,
                    author: book.Author,
                    type: "return"
                });

                if (response.data.success) {
                    alert('Book returned successfully');
                    setResults(results.map(b => b.Title === bookTitle ? { ...b, Status: 'A', BorrowedBy: 'None' } : b));
                } else {
                    alert('Failed to return the book: ' + response.data.message);
                }
            } else {
                alert('Book not borrowed or not found');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred while returning the book');
        }
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
                type: "studentsearch"
            });
            if (response) 
            {
                setResults(response.data);
            } 
            if (response.data.length === 0)
            {
                setError('No results found');
            }
            else 
            {
                setError('Result found:');
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
                        {result.Status === 'A' && (
                        <button onClick={() => handleBorrow(result.Title)}>Borrow</button>
                        )}
                        {result.BorrowedBy === studentId && (
                            <button onClick={() => handleReturn(result.Title)}>Return</button>
                        )}
                        <p>Borrowed by: {result.BorrowedBy}</p>
                    </div>))}
            </div>
        </div>
    );
}

export default StudentSearch;