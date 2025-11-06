import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";

const ChatBot = () => {
  const userId = localStorage.getItem("userId");
  const [userInput, setUserInput] = useState({ message: "" });
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  // ✅ Fetch existing messages from backend
  useEffect(() => {
    if (!userId) return;
    fetch(`https://smart-expense-tracker-server-1.onrender.com/msgs/read?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        const formatted = (data.data || []).map((msg) => ({
          sender: msg.sender === "client" ? "user" : "bot",
          text: msg.message,
          date: msg.date,
        }));
        setMessages(formatted);
      })
      .catch((err) => console.error("Error fetching messages:", err));
  }, [userId]);

  // ✅ Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Handle typing
  const handleChange = (e) => setUserInput({ message: e.target.value });

  // ✅ Send a message
  const sendMessage = async () => {
    if (userInput.message.trim() === "") return;

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userInput.message, date: new Date().toISOString() },
    ]);

    try {
      const response = await fetch("https://smart-expense-tracker-server-1.onrender.com/apis/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          message: userInput.message,
        }),
      });

      if (response.ok) {
        const res = await response.json();
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: res.message, date: new Date().toISOString() },
        ]);
      } else {
        throw new Error("Failed to send message");
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Error sending message.", date: new Date().toISOString() },
      ]);
    }

    setUserInput({ message: "" });
  };

  // ✅ Press Enter to send
  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  // ✅ Group messages by date (for WhatsApp-style headers)
  const groupMessagesByDate = (messages) => {
    return messages.reduce((groups, msg) => {
      const date = new Date(msg.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
      return groups;
    }, {});
  };
const deleteMsg=async()=>{
  try {
    const delMsg=await fetch(`https://smart-expense-tracker-server-1.onrender.com/msgs/delete?userId=${userId}`,{
      method:"DELETE"
    })
    if(delMsg.status===200){
      setMessages([])
    }
  } catch (error) {
    console.log("Something went wrong")
  }
}
  const grouped = groupMessagesByDate(messages);

  return (
    <div className="chatbot-container min-h-screen flex items-center justify-center bg-gray-100 p-2 sm:p-4">
      <div className="flex flex-col w-full max-w-md sm:max-w-lg h-[80vh] bg-white rounded-2xl shadow-lg overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-200 text-center bg-green-500 text-white">
          <h1 className="text-lg sm:text-xl font-bold">Smart Expense Tracker ChatBot</h1>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-3 sm:p-4 overflow-y-auto flex flex-col space-y-3 bg-gray-50 w-full">
          {Object.keys(grouped).map((date) => (
            <div key={date}>
              {/* 🗓️ Date Header */}
              <div className="text-center my-2">
                <span className="bg-gray-300 text-gray-800 text-xs px-3 py-1 rounded-full">
                  {date === new Date().toLocaleDateString("en-IN")
                    ? "Today"
                    : date === new Date(Date.now() - 86400000).toLocaleDateString("en-IN")
                    ? "Yesterday"
                    : date}
                </span>
              </div>

              {/* 💬 Messages */}
              {grouped[date].map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] sm:max-w-[70%] px-4 py-2 rounded-2xl text-sm break-words ${
                      msg.sender === "user"
                        ? "bg-green-500 text-white rounded-tr-sm m-4"
                        : "bg-gray-200 text-gray-800 rounded-tl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 sm:p-4 border-t border-gray-200 bg-white flex gap-2 items-center">
          <input
            type="text"
            value={userInput.message}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            placeholder="Type your expense..."
            className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-400 text-sm sm:text-base"
          />

          {/* Clear Button */}
          <button
            className="bg-red-500 text-white px-3 sm:px-5 py-2 rounded-full font-semibold hover:bg-red-600 transition cursor-pointer text-sm"
            onClick={() => {
              setMessages([]);
              deleteMsg();
            }}
          >
            Clear
          </button>

          {/* Send Button */}
          <button
            onClick={sendMessage}
            className="bg-green-500 text-white px-3 sm:px-5 py-2 rounded-full font-semibold hover:bg-green-600 transition cursor-pointer text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
