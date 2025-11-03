import React, { useState, useRef, useEffect } from 'react';

const ChatBot = () => {
  const msg = JSON.parse(localStorage.getItem("message")) || [];
  const [userInput, setUserInput] = useState({ message: '' });
  const [messages, setMessages] = useState(msg);
  const chatEndRef = useRef(null);

  // ✅ Save chats to localStorage
  useEffect(() => {
    localStorage.setItem("message", JSON.stringify(messages));
  }, [messages]);

  // ✅ Auto scroll on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleChange = (e) => setUserInput({ message: e.target.value });

  const sendMessage = async () => {
    if (userInput.message.trim() === '') return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: userInput.message, date: new Date().toISOString() }
    ]);

    const userId = localStorage.getItem("userId");

    try {
      const response = await fetch('https://smart-expense-tracker-server-1.onrender.com/apis/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          message: userInput.message
        }),
      });

      if (response.ok) {
        const res = await response.json();
        setMessages((prev) => [
          ...prev,
          { sender: 'bot', text: res.message, date: new Date().toISOString() }
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: '⚠️ Error sending message.', date: new Date().toISOString() }
      ]);
    }

    setUserInput({ message: '' });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  // ✅ Group messages by date (for WhatsApp-style headers)
  const groupMessagesByDate = (messages) => {
    return messages.reduce((groups, msg) => {
      const date = new Date(msg.date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
      return groups;
    }, {});
  };

  const grouped = groupMessagesByDate(messages);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="flex flex-col w-full max-w-md h-[80vh] bg-white rounded-2xl shadow-lg overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-200 text-center">
          <h1 className="text-xl font-bold text-gray-800">Expense Tracker ChatBot</h1>
          <div className='flex justify-end'></div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-4 overflow-y-auto flex flex-col space-y-3 bg-gray-50">
          {Object.keys(grouped).map((date) => (
            <div key={date}>
              {/* 🗓️ Date Header like WhatsApp */}
              <div className="text-center my-2">
                <span className="bg-gray-300 text-gray-800 text-xs px-3 py-1 rounded-full">
                  {date === new Date().toLocaleDateString('en-IN')
                    ? 'Today'
                    : date === new Date(Date.now() - 86400000).toLocaleDateString('en-IN')
                    ? 'Yesterday'
                    : date}
                </span>
              </div>

              {/* 💬 Messages */}
              {grouped[date].map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm break-words ${
                      msg.sender === 'user'
                        ? 'bg-green-500 text-white rounded-tr-sm'
                        : 'bg-gray-200 text-gray-800 rounded-tl-sm'
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

        {/* Input */}
        <div className="p-4 border-t border-gray-200 bg-white flex gap-2">
          <input
            type="text"
            value={userInput.message}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            placeholder="Type your expense..."
            className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-400 "
          />
          <button
            className='bg-red-500 text-white px-5 py-2 rounded-full font-semibold hover:bg-red-600 transition cursor-pointer'
            onClick={() => {
              setMessages([]);
              localStorage.removeItem("message"); // ✅ also clear saved chats
            }}
          >
            Clear chat
          </button>
          <button
            onClick={sendMessage}
            className="bg-green-500 text-white px-5 py-2 rounded-full font-semibold hover:bg-green-600 transition cursor-pointer"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
