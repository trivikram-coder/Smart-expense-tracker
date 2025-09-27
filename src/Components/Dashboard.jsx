import React, { useState, useEffect } from "react";
import PieChart from "./PieChart";
import BarChart from "./BarChart";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
const userId=localStorage.getItem("userId")
  // Sync with localStorage whenever expenses update
  useEffect(() => {
    fetch(`http://localhost:3000/apis/read?userId=${userId}`)
    .then(res=>res.json())
    .then(msg=>setExpenses(msg.data.reverse()))
  
  }, []);

  // Aggregate by category
  const getCategorySummary = (expenses) => {
    const summary = {};
    expenses.forEach((exp) => {
      if (summary[exp.category]) {
        summary[exp.category] += exp.amount;
      } else {
        summary[exp.category] = exp.amount;
      }
    });
    return summary;
  };

  const categorySummary = getCategorySummary(expenses);
  const amounts = Object.values(categorySummary);
  const categories = Object.keys(categorySummary);

  // Handle delete
  const handleDelete = (id) => {
  try {
    fetch(`http://localhost:3000/apis/remove/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body:JSON.stringify({userId})
    })
      .then(res => res.json())
      .then(data => {
        console.log(data.message);
        // Update UI
        setExpenses(prev => prev.filter(exp => exp._id !== id));
        toast.success("Deleted expense")
      });
  } catch (error) {
    console.log(error);
  }
};


  return (
    <div className="bg-gray-100 min-h-screen font-sans p-6">
      <div className="bg-white shadow-xl rounded-lg p-6 md:p-10 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
          Smart Expense Tracker Dashboard
        </h1>

        {/* Expenses Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Recent Expenses
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-md">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {expenses.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-4 text-center text-gray-400"
                      >
                        No expenses yet
                      </td>
                    </tr>
                  ) : (
                    expenses.map((exp, index) => (
                      <tr key={index}>
                        
                        <td className="px-6 py-4 text-sm text-gray-800">
                          ₹{exp.amount}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800">
                          {exp.category}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800">
                          {exp.date}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          <button
                            onClick={() => handleDelete(exp._id)}
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

          {/* Charts */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Category-wise Spending
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 h-48 flex justify-center items-center">
              <PieChart amounts={amounts} categories={categories} />
            </div>

            <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-700">
              Category-wise Summary
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 h-48 flex justify-center items-center">
              <BarChart amounts={amounts} categories={categories} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
