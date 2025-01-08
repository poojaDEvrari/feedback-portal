import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FeedbackForm() {
  const [feedback, setFeedback] = useState({
    category: '',
    priority: '',
    comments: '',
    userId: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setFeedback((prev) => ({ ...prev, userId: storedUserId }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedback({ ...feedback, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!feedback.category || !feedback.priority || !feedback.comments) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        'http://localhost:5000/api/feedback/submit', 
        feedback, 
        { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
      );
      setSuccess("Feedback submitted successfully!");
      setFeedback({ category: '', priority: '', comments: '', userId: feedback.userId });
      setTimeout(() => setSuccess(''), 3000); // Clear success message
    } catch (error) {
      const backendMessage = error.response?.data?.message || "Something went wrong. Please try again.";
      setError(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 min-h-screen flex items-center justify-center dark:bg-gray-900">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg space-y-6">
        <h2 className="text-3xl font-semibold text-center text-gray-800 dark:text-white">Submit Your Feedback</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-lg font-medium text-gray-700 dark:text-gray-300">Category</label>
            <select
              name="category"
              value={feedback.category}
              onChange={handleChange}
              className="w-full p-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white border rounded-md"
              required
            >
              <option value="">Select Category</option>
              <option value="Product">Product</option>
              <option value="Service">Service</option>
              <option value="Support">Support</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-lg font-medium text-gray-700 dark:text-gray-300">Priority</label>
            <select
              name="priority"
              value={feedback.priority}
              onChange={handleChange}
              className="w-full p-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white border rounded-md"
              required
            >
              <option value="">Select Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-lg font-medium text-gray-700 dark:text-gray-300">Comments</label>
            <textarea
              name="comments"
              value={feedback.comments}
              onChange={handleChange}
              className="w-full p-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white border rounded-md"
              rows="4"
              required
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-md transition-all duration-300 hover:bg-indigo-500"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default FeedbackForm;
