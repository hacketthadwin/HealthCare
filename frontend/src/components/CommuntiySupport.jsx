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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6">Community Support</h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-start sm:items-center mb-8 gap-4">
        <input
          type="text"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Type your question here..."
          className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
          Post
        </button>
      </form>

      <div className="space-y-6">
        {questionsList.map(q => (
          <div key={q._id} className="p-4 border border-gray-200 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <p className="text-lg text-gray-800">{q.title}</p>
              <span className={`text-sm font-medium ${q.answers?.length > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {q.answers?.length > 0 ? 'Answered' : 'Unanswered'}
              </span>
            </div>

            {q.answers?.length > 0 && (
              <div className="mt-4 mb-4 space-y-3">
                {q.answers.map(ans => (
                  <div key={ans._id} className="p-3 bg-green-50 border border-green-200 rounded">
                    <strong className="block text-gray-700 mb-1">
                      Answer {ans.author ? `by ${ans.author.name}` : ''}:
                    </strong>
                    <p className="text-gray-800 whitespace-pre-wrap">{ans.content}</p>
                  </div>
                ))}
              </div>
            )}

            {q.isAnswering ? (
              <div className="space-y-2">
                <textarea
                  value={q.newAnswerContent}
                  onChange={e => handleAnswerChange(q._id, e.target.value)}
                  rows={3}
                  placeholder="Type your answer..."
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <div className="flex gap-2">
                  <button onClick={() => submitAnswer(q._id)} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Submit</button>
                  <button onClick={() => toggleAnswerInput(q._id)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={() => toggleAnswerInput(q._id)} className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-md hover:bg-blue-100">
                Post an Answer
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunitySupport;