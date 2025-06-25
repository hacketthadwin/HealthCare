import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/v1';

const token = localStorage.getItem('userToken');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const CommunitySupport = () => {
  const [question, setQuestion] = useState('');
  const [questionsList, setQuestionsList] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`${API_BASE}/community/problems`);
        const initialized = response.data.map(item => ({
          ...item,
          isAnswering: false,
          newAnswerContent: ''
        }));
        setQuestionsList(initialized);
      } catch (error) {
        console.error('Error fetching questions:', error.response?.data || error.message);
      }
    };
    fetchQuestions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = question.trim();
    if (!text) return;

    try {
      const res = await axios.post(`${API_BASE}/community/problem`, { title: text });
      setQuestionsList(prev => [
        { ...res.data, isAnswering: false, newAnswerContent: '', answers: [] },
        ...prev
      ]);
      setQuestion('');
    } catch (err) {
      console.error('Error posting question:', err.response?.data || err.message);
    }
  };

  const toggleAnswerInput = (id) => {
    setQuestionsList(prev => prev.map(q =>
      q._id === id ? { ...q, isAnswering: !q.isAnswering } : q
    ));
  };

  const handleAnswerChange = (id, value) => {
    setQuestionsList(prev => prev.map(q =>
      q._id === id ? { ...q, newAnswerContent: value } : q
    ));
  };

  const submitAnswer = async (id) => {
    const questionObj = questionsList.find(q => q._id === id);
    const content = (questionObj.newAnswerContent || '').trim();
    if (!content) return;

    try {
      const res = await axios.post(`${API_BASE}/community/answer/${id}`, { content });
      const newAnswer = res.data;

      setQuestionsList(prev => prev.map(q => {
        if (q._id === id) {
          return {
            ...q,
            isAnswering: false,
            newAnswerContent: '',
            answers: [...(q.answers || []), newAnswer]
          };
        }
        return q;
      }));
    } catch (err) {
      console.error('Error submitting answer:', err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-custom-gradient py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Community Support</h1>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-start sm:items-center mb-10 gap-4 bg-white/50 backdrop-blur-md rounded-lg p-6 shadow-lg">
          <input
            type="text"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="Type your question here..."
            className="flex-1 p-3 border-none rounded-md text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-neon-green focus:border-neon-green transition-all duration-200 bg-white/50"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-neon-green text-black font-bold rounded-md hover:bg-black hover:text-white focus:ring-2 focus:ring-neon-green focus:ring-offset-2 transition-all duration-300"
          >
            Post
          </button>
        </form>

        <div className="space-y-6">
          {questionsList.map(q => (
            <div
              key={q._id}
              className="p-6 bg-white/50 backdrop-blur-md rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <p className="text-lg font-semibold text-gray-900">{q.title}</p>
                <span className={`text-sm font-medium ${q.answers?.length > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {q.answers?.length > 0 ? 'Answered' : 'Unanswered'}
                </span>
              </div>

              {q.answers?.length > 0 && (
                <div className="mt-4 mb-6 space-y-4">
                  {q.answers.map(ans => (
                    <div
                      key={ans._id}
                      className="p-4 bg-green-100/50 backdrop-blur-sm border border-green-200 rounded-md"
                    >
                      <strong className="block text-gray-700 text-sm font-medium mb-1">
                        Answer {ans.author ? `by ${ans.author.name}` : ''}:
                      </strong>
                      <p className="text-gray-900 whitespace-pre-wrap">{ans.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {q.isAnswering ? (
                <div className="space-y-4">
                  <textarea
                    value={q.newAnswerContent}
                    onChange={e => handleAnswerChange(q._id, e.target.value)}
                    rows={3}
                    placeholder="Type your answer..."
                    className="w-full p-3 border-none rounded-md text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-neon-green focus:border-neon-green transition-all duration-200 resize-none bg-white/50"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => submitAnswer(q._id)}
                      className="px-6 py-2 bg-neon-green text-black font-bold rounded-md hover:bg-black hover:text-white focus:ring-2 focus:ring-neon-green focus:ring-offset-2 transition-all duration-300"
                    >
                      Submit
                    </button>
                    <button
                      onClick={() => toggleAnswerInput(q._id)}
                      className="px-6 py-2 bg-gray-400/50 backdrop-blur-sm text-gray-800 font-medium rounded-md hover:bg-gray-500/50 transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => toggleAnswerInput(q._id)}
                  className="px-6 py-2 bg-blue-100/50 backdrop-blur-sm text-blue-800 font-medium rounded-md hover:bg-blue-200/50 transition-all duration-300"
                >
                  Post an Answer
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunitySupport;