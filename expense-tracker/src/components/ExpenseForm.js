import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function ExpenseForm() {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      // If an ID exists, fetch the existing expense
      fetchExpense();
    } else {
      // If no ID exists, clear the fields (for adding a new expense)
      setDescription('');
      setAmount('');
      setCategory('');
      setDate('');
    }
  }, [id]);

  useEffect(() => {
    // Set today's date for the max date attribute
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').setAttribute('max', today);
  }, []);

  const fetchExpense = async () => {
    const response = await axios.get(`http://localhost:5001/api/expenses/${id}`);
    setDescription(response.data.description);
    setAmount(response.data.amount);
    setCategory(response.data.category);
    setDate(new Date(response.data.date).toISOString().split('T')[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error message
    setError('');

    // Validate each field
    if (!description.trim()) {
      setError('Description cannot be empty or only spaces.');
      return;
    }

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount greater than zero.');
      return;
    }

    if (!category) {
      setError('Please select a category.');
      return;
    }

    if (!date) {
      setError('Please select a date.');
      return;
    }

    const expense = {
      description: description.trim(),
      amount: parseFloat(amount),
      category,
      date,
    };

    try {
      if (id) {
        await axios.put(`http://localhost:5001/api/expenses/${id}`, expense);
      } else {
        await axios.post('http://localhost:5001/api/expenses', expense);
      }
      navigate('/');
    } catch (error) {
      console.error('There was an error saving the expense!', error);
      setError('There was an error saving your expense. Please try again.');
    }
  };

  return (
    <div className="card p-4 mb-4 shadow fade-in FormCSS">
      <h4 className="mb-3">{id ? 'Edit Expense' : 'Add Expense'}</h4>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <input 
            type="text" 
            className="form-control" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Enter expense description" 
            required 
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Amount</label>
          <input 
            type="number" 
            className="form-control" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            placeholder="Enter amount" 
            min="0.01" 
            step="0.01" 
            required 
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Category</label>
          <select 
            className="form-select" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            required
          >
            <option value="">Select a category</option>
            <option value="Food">Food</option>
            <option value="Bills">Bills</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Date</label>
          <input 
            type="date" 
            className="form-control" 
            id="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="btn btn-primary">{id ? 'Update Expense' : 'Add Expense'}</button>
      </form>
    </div>
  );
}

export default ExpenseForm;
