import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import ExpenseFilter from './ExpenseFilter';
import ExpensePieChart from './ExpensePieChart';

function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/expenses');
      const sortedExpenses = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
      setExpenses(sortedExpenses);
      setFilteredExpenses(sortedExpenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this expense?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5001/api/expenses/${id}`);
          setFilteredExpenses(filteredExpenses.filter((expense) => expense._id !== id));
          Swal.fire('Deleted!', 'Your expense has been deleted.', 'success');
          fetchExpenses();
        } catch (error) {
          console.error('Error deleting expense:', error);
          Swal.fire('Error!', 'There was an issue deleting the expense.', 'error');
        }
      }
    });
    
  };

  const calculateTotal = () => {
    return filteredExpenses.reduce((total, expense) => total + expense.amount, 0).toFixed(2);
  };

  const getCategoryImage = (category) => {
    switch (category) {
      case 'Food':
        return '/images/Food.jpeg';
      case 'Bills':
        return '/images/Bills.webp';
      case 'Entertainment':
        return '/images/Entertainment.jpg';
      case 'Other':
        return '/images/Others.jpg';
      default:
        return '/images/default.jpg';
    }
  };

  // Handle search input change
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = expenses
      .filter(
        (expense) =>
          expense.description.toLowerCase().includes(query) ||
          expense.amount.toString().includes(query) ||
          expense.category.toLowerCase().includes(query)
      )
      .sort((a, b) => new Date(a.date) - new Date(b.date)); // Ensure sorted by date

    setFilteredExpenses(filtered);
  };

  return (
    <div className="expense-list">
      <h2 className="mb-4 text-primary">Your Expenses</h2>

      {/* Search Input */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by description, amount, or category..."
        value={searchQuery}
        onChange={handleSearch}
      />

      <ExpenseFilter
        setFilteredExpenses={setFilteredExpenses}
        setCategoryFilter={setCategoryFilter}
      />

      <h4 className="mt-4 text-success">Total Expense: ${calculateTotal()}</h4>

      {!categoryFilter && filteredExpenses.length > 0 && (
        <ExpensePieChart expenses={filteredExpenses} />
      )}

      <div className="FilteredList">
        {filteredExpenses.length === 0 ? (
          <div className="alert alert-info">No expenses found. Start by adding one!</div>
        ) : (
          filteredExpenses.map((expense) => (
            <div className="card mb-3 shadow-sm" key={expense._id}>
              <div className="row g-0">
                <div className="col-md-4">
                  <img
                    src={getCategoryImage(expense.category)}
                    alt={expense.category}
                    className="img-fluid rounded-start"
                  />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title text-dark">{expense.description}</h5>
                    <p className="card-text">
                      <strong>Amount:</strong> ${expense.amount}
                    </p>
                    <p className="card-text">
                      <strong>Category:</strong> {expense.category}
                    </p>
                    <p className="card-text">
                      <strong>Date:</strong> {new Date(expense.date).toLocaleDateString()}
                    </p>
                    <Link to={`/edit/${expense._id}`} className="btn btn-outline-primary me-2">
                      Edit
                    </Link>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => handleDelete(expense._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ExpenseList;
