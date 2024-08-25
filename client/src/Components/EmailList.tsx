import React, { useState } from 'react';
import { ClassifiedEmail } from '../Interface/interfaces';
import { Base64 } from 'js-base64';

interface EmailListProps {
    emails: ClassifiedEmail[];
    itemsPerPage: number;
    currentPage: number;
    paginate: (pageNumber: number) => void;
}

const getInitials = (name: string) => {
    const nameParts = name.split(' ');
    return nameParts.length > 1
        ? nameParts[0][0] + nameParts[1][0]
        : nameParts[0][0];
};

const decodeBase64 = (encodedContent: string): string => {
    return Base64.decode(encodedContent);
};

const EmailList: React.FC<EmailListProps> = ({ emails, itemsPerPage, currentPage, paginate }) => {
    const [selectedEmail, setSelectedEmail] = useState<ClassifiedEmail | null>(null);

    const indexOfLastEmail = currentPage * itemsPerPage;
    const indexOfFirstEmail = indexOfLastEmail - itemsPerPage;
    const currentEmails = emails.slice(indexOfFirstEmail, indexOfLastEmail);

    const handleViewDetails = (email: ClassifiedEmail) => {
        setSelectedEmail(email);
    };

    const handleBackToList = () => {
        setSelectedEmail(null);
    };

    if (selectedEmail) {
        return (
            <div className="mt-4">
                <button
                    onClick={handleBackToList}
                    className="bg-[#e8e4fc] text-gray-700 py-2 px-4 rounded-md shadow-sm hover:bg-[#d6c8f4] focus:outline-none focus:ring-2 focus:ring-[#e8e4fc] focus:ring-offset-2 text-sm"
                >
                    Back to List
                </button>
                <div className="mt-4">
                    <h4 className="text-base font-semibold">From: {selectedEmail.from}</h4>
                    <h4 className="text-base font-semibold">To: {selectedEmail.to}</h4>
                    <h4 className="text-base font-semibold">Subject: {selectedEmail.subject}</h4>
                    <h4 className="text-base font-semibold">Category: {selectedEmail.category}</h4>
                    <div className="mt-4 border-t pt-4">
                        <div
                            dangerouslySetInnerHTML={{ __html: decodeBase64(selectedEmail.content) }}
                            className="prose"
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 p-4">
            {currentEmails.map((email) => (
                <div
                    key={email.id}
                    className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 hover:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 flex items-center justify-center ring-2 ring-[#9b88c4] bg-[#9b88c4] text-white rounded-full text-sm font-bold">
                                {getInitials(email.from)}
                            </div>
                        </div>
                        <div>
                            <div className="font-medium text-gray-800">{email.from}</div>
                            <div className="text-sm text-gray-500">{email.to}</div>
                        </div>
                    </div>
                    <div className="text-gray-800 font-semibold mb-2">Subject:</div>
                    <div className="text-gray-600 text-sm mb-4">{email.subject}</div>
                    <div className="text-gray-800 font-semibold mb-2">Category: {email.category}</div>
                    <button
                        className="px-4 py-2 bg-[#d6c8f4] text-white rounded-lg text-sm hover:bg-[#b29fdc] transition-colors"
                        onClick={() => handleViewDetails(email)}
                    >
                        View Details
                    </button>
                </div>
            ))}

            {emails.length > itemsPerPage && (
                <div className="mt-4 flex justify-center">
                    {Array.from({ length: Math.ceil(emails.length / itemsPerPage) }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => paginate(i + 1)}
                            className={`mx-1 px-2 py-1 md:px-4 md:py-2 border rounded text-xs ${currentPage === i + 1 ? 'bg-[#e8e4fc] text-gray-700' : 'bg-white text-gray-700 hover:bg-gray-100'} transition-colors`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EmailList;
