import React, { useState } from 'react';
import { X, Copy, Mail, Link, Users } from 'lucide-react';

interface ShareReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: any;
}

export function ShareReportModal({ isOpen, onClose, report }: ShareReportModalProps) {
  const [shareMethod, setShareMethod] = useState<'link' | 'email' | 'team'>('link');
  const [emailList, setEmailList] = useState('');
  const [message, setMessage] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);

  if (!isOpen || !report) return null;

  const shareUrl = `${window.location.origin}/reports/${report.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleEmailShare = () => {
    const emails = emailList.split(',').map(email => email.trim()).filter(Boolean);
    if (emails.length === 0) {
      alert('Please enter at least one email address');
      return;
    }

    // Simulate email sending
    console.log('Sending report to:', emails);
    console.log('Message:', message);
    alert(`Report shared with ${emails.length} recipient(s)!`);
    onClose();
  };

  const handleTeamShare = () => {
    // Simulate team sharing
    console.log('Sharing with team');
    alert('Report shared with your team!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

        <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Share Report: {report.title}
              </h3>

              <div className="mt-6">
                {/* Share Method Selection */}
                <div className="flex space-x-4 mb-6">
                  <button
                    onClick={() => setShareMethod('link')}
                    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                      shareMethod === 'link'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Link className="h-4 w-4 mr-2" />
                    Link
                  </button>
                  <button
                    onClick={() => setShareMethod('email')}
                    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                      shareMethod === 'email'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </button>
                  <button
                    onClick={() => setShareMethod('team')}
                    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                      shareMethod === 'team'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Team
                  </button>
                </div>

                {/* Share Content */}
                {shareMethod === 'link' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Share Link
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="text"
                          value={shareUrl}
                          readOnly
                          className="flex-1 rounded-l-md border-gray-300 bg-gray-50 text-sm"
                        />
                        <button
                          onClick={handleCopyLink}
                          className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 hover:bg-gray-100"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                      {linkCopied && (
                        <p className="mt-1 text-sm text-green-600">Link copied to clipboard!</p>
                      )}
                    </div>
                  </div>
                )}

                {shareMethod === 'email' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email Addresses (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={emailList}
                        onChange={(e) => setEmailList(e.target.value)}
                        placeholder="john@example.com, jane@example.com"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Message (optional)
                      </label>
                      <textarea
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Add a personal message..."
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                )}

                {shareMethod === 'team' && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-md">
                      <p className="text-sm text-blue-700">
                        This report will be shared with all members of your team. They will receive a notification and can access it from their dashboard.
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Message to Team (optional)
                      </label>
                      <textarea
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Add a message for your team..."
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                )}

                <div className="mt-6 sm:flex sm:flex-row-reverse">
                  {shareMethod === 'email' && (
                    <button
                      onClick={handleEmailShare}
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Send Email
                    </button>
                  )}
                  {shareMethod === 'team' && (
                    <button
                      onClick={handleTeamShare}
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Share with Team
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}