import React, { useState } from 'react';
import axios from 'axios';

const ExpenseFilter = ({ setFilteredExpenses }) => {
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  const handleFilter = () => {
    if (endDate && startDate && endDate < startDate) {
      setError('End date cannot be earlier than start date.');
      return;
    }

    setError('');
    let filterUrl = 'http://localhost:5001/api/expenses?';

    if (category) filterUrl += `category=${category}&`;
    

    if (startDate) filterUrl += `startDate=${startDate}&`;
    if (endDate) filterUrl += `endDate=${endDate}`;

    axios.get(filterUrl)
      .then(response => {
        setFilteredExpenses(response.data);
      })
      .catch(error => {
        console.error('There was an error filtering the expenses!', error);
      });
  };

  const handleClear = () => {
    setCategory('');
    setStartDate('');
    setEndDate('');
    setError('');
    // Fetch all expenses without filters
    axios.get('http://localhost:5001/api/expenses')
      .then(response => {
        setFilteredExpenses(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching expenses!', error);
      });
  };

  return (
    <div className="card p-4 mb-4 shadow fade-in">
      <h4 className="mb-3">Filter Expenses</h4>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-3">
        <label className="form-label">Category</label>
        <select 
          className="form-select" 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Food">Food</option>
          <option value="Bills">Bills</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="input-group mb-3">
        <span className="input-group-text">Start Date</span>
        <input 
          type="date" 
          className="form-control" 
          value={startDate} 
          onChange={(e) => setStartDate(e.target.value)} 
          max={new Date().toISOString().split('T')[0]} 
        />
      </div>
      <div className="input-group mb-3">
        <span className="input-group-text">End Date</span>
        <input 
          type="date" 
          className="form-control" 
          value={endDate} 
          onChange={(e) => setEndDate(e.target.value)} 
          max={new Date().toISOString().split('T')[0]} 
        />
      </div>
      <div className="d-flex justify-content-between">
        <button 
          className="btn btn-primary" 
          onClick={handleFilter}
        >
          Apply Filter
        </button>
        <button 
          className="btn btn-secondary" 
          onClick={handleClear}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default ExpenseFilter;