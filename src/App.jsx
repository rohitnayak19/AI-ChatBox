import axios from "axios";
import React, { useState } from "react";

const App = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateAnswer = async () => {
    if (!question.trim()) {
      setError("Please enter a question");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAcv3b8SdTMECkx70MHdlxRVnXS9MiVVuo`,
        {
          contents: [{ parts: [{ text: question }] }],
        }
      );

      const answerText =
        response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No answer found";

      // Update chat history
      setChatHistory((prev) => [...prev, { question, answer: answerText }]);

      // Clear current question and answer
      setQuestion("");
      setAnswer(answerText);
    } catch (err) {
      console.error("Error Fetching Answer:", err);
      setError("Failed to fetch the answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-semibold text-center mb-4 text-gray-800">
          AI Chatbox
        </h1>

        {/* Chat History */}
        <div className="space-y-4 mb-4 max-h-96 overflow-y-auto border border-gray-200 p-4 rounded-lg bg-gray-50">
          {chatHistory.map((chat, index) => (
            <div key={index} className="space-y-2">
              {/* User question bubble */}
              <div className="flex justify-end">
                <div className="bg-blue-500 text-white p-3 rounded-lg max-w-xs w-fit shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                  <p className="text-sm">{chat.question}</p>
                </div>
              </div>

              {/* AI response bubble */}
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-800 p-3 rounded-lg max-w-xs w-fit shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                  <p className="text-sm">{chat.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input and Submit Button */}
        <div className="flex items-center gap-3">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            type="text"
            placeholder="Type your question here..."
            className="flex-grow px-4 py-2 bg-gray-100 rounded-full outline-none shadow-md focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={generateAnswer}
            className={`${
              loading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-sky-500 hover:bg-sky-600"
            } p-2 rounded-full text-white font-bold shadow-md transition duration-75`}
            disabled={loading}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Error message */}
        {error && (
          <p className="text-red-500 mt-3 text-center bg-red-100 p-2 rounded-md">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default App;
