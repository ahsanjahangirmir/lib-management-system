import React, { useState } from 'react';
import axios from 'axios';

const BookManagementForm = () => {
  const [bookOperation, setBookOperation] = useState('add'); // 'add' or 'remove'
  const [bookTitle, setBookTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');

  const handleOperationChange = (event) => {
    setBookOperation(event.target.value);
  };

  const handleTitleChange = (event) => {
    setBookTitle(event.target.value);
  };

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value);
  };

  const handleGenreChange = (event) => {
    setGenre(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      let res;
      if (bookOperation === 'add') {
        const bookData = {
          type: "add-book",
          Title: bookTitle,
          Author: author,
          Genre: genre,
          Status: 'A',
          BorrowedBy: 'None' 
        };
        res = await axios.post('http://localhost:3100/home', bookData);
      } else if (bookOperation === 'remove') {
        res = await axios.post('http://localhost:3100/home', { type: "delete-book", Title: bookTitle });
      }
  
      if (res.data === "book-added") {
        alert("Book added successfully.");
      } else if (res.data === "book-deleted") {
        alert("Book removed successfully.");
      } else {
        alert("Operation could not be completed.");
      }
    } catch (error) {
      alert('Operation failed: ' + error.message);
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Book Inventory Management</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Operation:
            <select value={bookOperation} onChange={handleOperationChange}>
              <option value="add">Add Book</option>
              <option value="remove">Remove Book</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Book Title:
            <input type="text" value={bookTitle} onChange={handleTitleChange} required />
          </label>
        </div>
        {bookOperation === 'add' && (
          <>
            <div>
              <label>
                Author:
                <input type="text" value={author} onChange={handleAuthorChange} required />
              </label>
            </div>
            <div>
              <label>
                Genre:
                <input type="text" value={genre} onChange={handleGenreChange} required />
              </label>
            </div>
          </>
        )}
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default BookManagementForm;
