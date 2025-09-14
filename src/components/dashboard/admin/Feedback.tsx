import React, { useEffect, useState } from 'react';
import { User, Calendar, FileText, AlertCircle, RefreshCw } from 'lucide-react';
import API from '../../hooks/API';
import axios from 'axios';
import AdminSidebar from './AdminSidebar';

interface User {
  id: number;
  fullName: string;
  email: string;
}

interface Feedback {
  id: number;
  title: string;
  description: string;
  documentUrl?: string;
  user: User;
  createdAt?: string;
}

const useApi = API();

function App() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get<Feedback[]>(useApi.url + '/feedback');
        setFeedbacks(res.data);  
        
        setTimeout(() => {
          setFeedbacks(res.data);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch feedbacks');
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-700">Loading feedbacks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminSidebar />
      <div className="ml-64 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-gray-800 text-center mb-2">
            User Feedbacks
          </h1>
          <p className="text-gray-600 text-center">
            {feedbacks.length} feedback{feedbacks.length !== 1 ? 's' : ''} received
          </p>
        </div>
      </div>

      {/* Feedback Grid */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedbacks.map(feedback => (
            <div
              key={feedback.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden"
            >
              {/* Card Content */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                  {feedback.title}
                </h2>
                
                <p className="text-gray-600 mb-4 line-clamp-4 leading-relaxed">
                  {feedback.description}
                </p>

                {/* User Info */}
                <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{feedback.user.fullName}</p>
                    <p className="text-sm text-gray-500">{feedback.user.email}</p>
                  </div>
                </div>

                {/* Date */}
                {feedback.createdAt && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(feedback.createdAt)}</span>
                  </div>
                )}

                {/* Document Link */}
                {feedback.documentUrl && (
                  <div className="pt-4 border-t border-gray-100">
                    <a
                      href={feedback.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                    >
                      <FileText className="w-4 h-4" />
                      View Document
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {feedbacks.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No feedbacks found</h3>
            <p className="text-gray-500">Check back later for new feedback submissions</p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}

export default App;