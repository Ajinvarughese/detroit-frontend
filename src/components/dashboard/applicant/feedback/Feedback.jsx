import React, { useState } from 'react';
import { Send, Paperclip, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

const Feedback = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitted(true);
      setTitle('');
      setDescription('');
      setAttachment(null);
      setIsSubmitting(false);

      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 2000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachment(file);
    }
  };

  if (isSubmitted) {
    return (
      <div className="h-screen bg-[#0e151b] flex items-center justify-center p-4">
        <div className="w-full max">
          <div className="bg-slate-800/80 rounded-2xl shadow-xl p-8 text-center border border-slate-700/50 backdrop-blur-sm">
            <div className="mb-6 relative">
              <div className="w-20 h-20 bg-gradient-to-br from-[#4ade80] to-green-400 rounded-full mx-auto flex items-center justify-center mb-4 shadow-lg">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <div className="absolute inset-0 w-20 h-20 bg-[#4ade80]/20 rounded-full mx-auto animate-ping"></div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Thank You!</h2>
            <p className="text-slate-300 mb-8 leading-relaxed">
              Your feedback has been submitted successfully. We appreciate your input and will review it carefully.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="group w-full bg-[#4ade80] text-white py-3 px-6 rounded-xl hover:bg-green-400 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              Submit Another Feedback
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#121c24] flex w-full">
      <div className="flex flex-col w-full h-full p-4">
        <div className="flex-1 flex items-center justify-center py-2 px-2">
          <div className="w-full max-w-2xl h-full">
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-700/50 overflow-auto flex flex-col h-full max-h-screen">
              {/* Header */}
              <div className="bg-slate-800/80 px-6 py-4 border-b border-slate-700/50">
                <div className='flex items-center' >
                  <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full mr-4"></div>
                  <h2 className="text-lg font-semibold text-white mt-auto mb-auto">Submit Feedback</h2>
                </div>
                <p className="text-xs text-slate-400 mt-1 ml-8">
                  Please provide detailed information about your experience or suggestions.
                </p>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-auto p-4 space-y-6">
                {/* Title */}
                <div className="group">
                  <label htmlFor="title" className="block text-xs font-semibold text-slate-300 mb-2">
                    Subject <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Brief description of your feedback"
                    className="w-full px-3 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4ade80]/50 focus:border-[#4ade80] hover:bg-slate-700/70 focus:bg-slate-700"
                    required
                  />
                </div>

                {/* Description */}
                <div className="group">
                  <label htmlFor="description" className="block text-xs font-semibold text-slate-300 mb-2">
                    Details <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide detailed feedback..."
                    rows={4}
                    className="w-full px-3 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-sm text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#4ade80]/50 focus:border-[#4ade80] hover:bg-slate-700/70 focus:bg-slate-700"
                    required
                  />
                  <p className="text-xs text-slate-500 mt-1">• Minimum 10 characters</p>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Attachments <span className="text-slate-400">(Optional)</span>
                  </label>
                  <input
                    type="file"
                    id="file-upload"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex items-center justify-center px-4 py-6 border-2 border-dashed border-slate-600 rounded-xl cursor-pointer hover:border-[#4ade80] hover:bg-slate-700/30 text-center text-xs"
                  >
                    <Paperclip className="w-4 h-4 mr-2 text-slate-400" />
                    {attachment ? attachment.name : 'Click to attach files'}
                  </label>
                  {attachment && (
                    <div className="mt-2 p-4 bg-[#4ade80]/10 border border-[#4ade80]/30 rounded-xl">
                      <p className="text-xs text-[#4ade80]">File: {attachment.name}</p>
                    </div>
                  )}
                </div>

                {/* Terms */}
                <div className="mt-2 bg-slate-700/30 border border-slate-600/50 rounded-xl p-3 text-xs text-slate-400">
                  <AlertCircle className="w-4 h-6 text-[#4ade80] inline-block mr-2" />
                  By submitting, you agree we may use your input to improve our services. We will not share personal info.
                </div>
              </div>

              {/* Footer */}
              <div className=" border-t border-slate-700/50 px-6 py-6 bg-slate-800/40 flex justify-between items-center">
                <p className="text-xs text-slate-500"><span className="text-red-400">*</span> Required</p>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !title.trim() || !description.trim()}
                  className="group flex items-center px-6 py-2 bg-[#4ade80] text-white rounded-lg hover:bg-green-400 disabled:bg-slate-600 disabled:cursor-not-allowed text-sm font-semibold shadow-lg hover:shadow-xl disabled:shadow-none"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-3 h-3 mr-2" /> Submit Feedback
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
