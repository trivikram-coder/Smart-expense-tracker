import React, { useEffect, useState } from 'react';
import PieChart from './PieChart';
import BarChart from './BarChart';

const Dashboard = () => {
  // Use an array to store multiple expenses
  const [expenses, setExpenses] = useState(()=>{
    const items=localStorage.getItem("expenses")
    return items?JSON.parse(items):[]
  });
  
  // Controlled form state
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: '',
    date: ''
  });
 
  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  //Aggregate the categories
  const getCategorySummary=(expenses)=>{
    const summary={};
    expenses.forEach(exp=>{
      if(summary[exp.category]){
        summary[exp.category]+=exp.amount;
      }else{
        summary[exp.category]=exp.amount;
      }
    })
    return summary
  }
   const categorySummary=getCategorySummary(expenses);
  const amounts=Object.values(categorySummary)
  const categories=Object.keys(categorySummary)
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.amount || !formData.category || !formData.date) {
      alert('Please fill all fields');
      return;
    }
    const newExpenses={...formData,amount:Number(formData.amount)}
    const updated=[...expenses,newExpenses]
    setExpenses(updated); // Add new expense
    localStorage.setItem("expenses",JSON.stringify(updated))
    setFormData({ name: '', amount: '', category: '', date: '' }); // Reset form
    
  };

  // Handle delete
  const handleDelete = (index) => {
    const updatedExpenses=expenses.filter((_, i) => i !== index)
    setExpenses(updatedExpenses);
    localStorage.setItem("expenses",JSON.stringify(updatedExpenses))

  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans p-6">
      <div className="bg-white shadow-xl rounded-lg p-6 md:p-10 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">Smart Expense Tracker</h1>

        {/* Expense Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-8">
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-600">Name</label>
            <input 
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-600">Amount</label>
            <input 
              type="number"
              id="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Amount"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-600">Category</label>
            <select 
              id="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled>-- Select --</option>
              <option value="Food">Food</option>
              <option value="Utilities">Utilities</option>
              <option value="Entertainment">Entertainment</option>
            </select>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-600">Date</label>
            <input 
              type="date"
              id="date"
              value={formData.date}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button 
            type="submit"
            className="w-full md:w-auto bg-blue-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-700 transition"
          >
            Add
          </button>
        </form>

        {/* Expenses Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Recent Expenses</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-md">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {expenses.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-400">
                        No expenses yet
                      </td>
                    </tr>
                  ) : (
                    expenses.map((exp, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{exp.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{exp.amount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{exp.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{exp.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleDelete(index)}
                            className="text-red-600 hover:text-red-900"
                          >
                            ❌
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Placeholder Charts */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Category-wise Spending</h2>
            <div className="bg-gray-50 rounded-lg p-4 h-48 flex justify-center items-center text-gray-400">
              <PieChart
  amounts={amounts} 
  categories={categories}
/>
            </div>

            <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-700">Category-wise Summary</h2>
            <div className="bg-gray-50 rounded-lg p-4 h-48 flex justify-center items-center text-gray-400">
             <BarChart amounts={amounts}
              categories={categories}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
