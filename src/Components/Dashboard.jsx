import React, { useState, useEffect } from "react";
import PieChart from "./PieChart";
import BarChart from "./BarChart";
import { toast } from "react-toastify";

const Dashboard = () => {
  const userId = localStorage.getItem("userId") || "guest";
  const storedBudget = localStorage.getItem(`budget${userId}`);
const savedBudget =
  storedBudget && storedBudget !== "undefined"
    ? JSON.parse(storedBudget)
    : 0;

  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(savedBudget);

  // Fetch all expenses
  useEffect(() => {
    fetch(`https://smart-expense-tracker-server-1.onrender.com/apis/read?userId=${userId}`)
      .then((res) => res.json())
      .then((msg) => setExpenses(msg.data))
      .catch((err) => console.log(err));
  }, [userId]);

  // Save budget to localStorage
  useEffect(() => {
    localStorage.setItem(`budget${userId}`, JSON.stringify(budget));
  }, [budget]);

  // Aggregate by category
  const getCategorySummary = (expenses) => {
    const summary = {};
    expenses.forEach((exp) => {
      summary[exp.category] = (summary[exp.category] || 0) + exp.amount;
    });
    return summary;
  };

  const categorySummary = getCategorySummary(expenses);
  const amounts = Object.values(categorySummary);
  const categories = Object.keys(categorySummary);

  // Delete expense
  const handleDelete = async () => {
    try {
      await fetch(`https://smart-expense-tracker-server-1.onrender.com/apis/remove/${deleteId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      setExpenses((prev) => prev.filter((exp) => exp._id !== deleteId));
      toast.success("Expense deleted");
    } catch (error) {
      console.error(error);
      toast.error("Error deleting expense");
    } finally {
      setShowModal(false);
      setDeleteId(null);
    }
  };

  // Budget Limit Check
  function checkLimit() {
    const totalAmount = amounts.reduce((sum, e) => sum + e, 0);
    if (totalAmount > budget) {
      
      return null; // stop further logic
    }
    return totalAmount;
  }

  const totalExpense = checkLimit();
  const remaining =
    totalExpense === null
      ? "Exceeded"
      : Math.max(budget - totalExpense, 0); // prevent negative display

  return (
    <div className="bg-gray-100 min-h-screen font-sans p-4 md:p-6">
  <div className="bg-white shadow-xl rounded-lg p-4 sm:p-6 md:p-10 max-w-7xl mx-auto dashboard-container">

        <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
          Smart Expense Tracker Dashboard
        </h1>

        {/* 💰 Total and Budget Summary Section */}
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 dashboard-cards">

          {/* Total Expenses Card */}
          <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white p-6 rounded-2xl shadow-lg hover:scale-[1.02] transition-transform duration-300">
            <p className="text-lg font-medium">Total Expenses</p>
            <p className="text-4xl font-bold mt-2">
              ₹{totalExpense === null ? "Exceeded" : totalExpense}
            </p>
          </div>

          {/* Budget Card */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-2xl shadow-lg hover:scale-[1.02] transition-transform duration-300">
            <div className="flex justify-between items-center mb-3">
              <p className="text-lg font-medium">Your Budget</p>
              <input
                type="number"
                
                onChange={(e) => setBudget(Number(e.target.value))}
                className="bg-white text-gray-800 rounded-md px-3 py-1 text-sm outline-none w-30"
                placeholder="Enter ₹"
              />
            </div>

            <p className="text-4xl font-bold">₹{budget || 0}</p>

            <div className="mt-4">
              <p className="text-lg font-medium">Remaining Amount</p>
              <p
                className={`text-4xl font-bold mt-2 ${
                  remaining === "Exceeded" ? "text-red-400" : ""
                }`}
              >

                {remaining === "Exceeded" ? remaining : `₹${remaining}`}
              </p>
            </div>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Recent Expenses
            </h2>
           <div className="overflow-x-auto table-container">
  <table className="min-w-full bg-white border border-gray-200 rounded-md text-sm md:text-base dashboard-table">

                <thead>
                  <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-6">Name</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">Amount</th>
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
                          {exp.item &&
                            exp.item.replace(/\b\w/g, (char) =>
                              char.toUpperCase()
                            )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800">
                          {exp.category}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800">
                          ₹{exp.amount}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800">
                          {new Date(exp.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          <button
                            onClick={() => {
                              setDeleteId(exp._id);
                              setShowModal(true);
                            }}
                            className="text-red-600 hover:text-red-900 cursor-pointer"
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
            <div className="bg-gray-50 rounded-lg p-4 h-60 flex justify-center items-center">
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

      {/* Delete Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96">
            <div className="border-b px-6 py-3 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Confirm Delete
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="p-6 text-gray-700">
              Are you sure you want to delete this expense?
            </div>
            <div className="border-t px-6 py-3 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
