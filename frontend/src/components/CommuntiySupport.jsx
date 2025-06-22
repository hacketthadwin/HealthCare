// src/components/CommunitySupport.jsx
import React, { useState } from 'react';

const CommunitySupport = () => {
  const [question, setQuestion] = useState('');
  const [questionsList, setQuestionsList] = useState([]);

  // Post a new question
  const handleSubmit = (e) => {
    e.preventDefault();
    const text = question.trim();
    if (!text) return;
    setQuestionsList(prev => [
      ...prev,
      {
        id: Date.now(),
        text,
        answered: false,
        answer: '',
        isAnswering: false
      }
    ]);
    setQuestion('');
  };

  // Toggle the “Answer this” input visibility
  const toggleAnswerInput = (id) => {
    setQuestionsList(prev =>
      prev.map(q =>
        q.id === id ? { ...q, isAnswering: !q.isAnswering } : q
      )
    );
  };

  // Track the answer text as user types
  const handleAnswerChange = (id, value) => {
    setQuestionsList(prev =>
      prev.map(q =>
        q.id === id ? { ...q, answer: value } : q
      )
    );
  };

  // Submit the answer
  const submitAnswer = (id) => {
    setQuestionsList(prev =>
      prev.map(q => {
        if (q.id === id && q.answer.trim()) {
          return {
            ...q,
            answered: true,
            isAnswering: false
          };
        }
        return q;
      })
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6">Community Support</h1>
      <p className="text-center text-gray-600 mb-4">
        Have questions or need help? Post your question and our community will assist you.
      </p>

      {/* Ask a Question Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-start sm:items-center mb-8 gap-4"
      >
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your question here..."
          className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Post
        </button>
      </form>

      {/* Questions List */}
      <div className="space-y-6">
        {questionsList.length === 0 ? (
          <p className="text-center text-gray-500">No questions yet. Be the first to post!</p>
        ) : (
          questionsList.map(q => (
            <div key={q.id} className="p-4 border border-gray-200 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <p className="text-lg text-gray-800">{q.text}</p>
                <span className={`text-sm font-medium ${q.answered ? 'text-green-600' : 'text-red-600'}`}>
                  {q.answered ? 'Answered' : 'Unanswered'}
                </span>
              </div>

              {/* If answered, show the answer */}
              {q.answered && (
                <div className="mb-2 p-3 bg-green-50 border border-green-200 rounded">
                  <strong className="block text-gray-700 mb-1">Answer:</strong>
                  <p className="text-gray-800">{q.answer}</p>
                </div>
              )}

              {/* Answer input toggle */}
              {!q.answered && (
                <>
                  {q.isAnswering ? (
                    <div className="space-y-2">
                      <textarea
                        value={q.answer}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        rows={3}
                        placeholder="Type your answer..."
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => submitAnswer(q.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                        >
                          Submit Answer
                        </button>
                        <button
                          onClick={() => toggleAnswerInput(q.id)}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => toggleAnswerInput(q.id)}
                      className="px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-md hover:bg-green-100 transition"
                    >
                      Answer this
                    </button>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommunitySupport;
