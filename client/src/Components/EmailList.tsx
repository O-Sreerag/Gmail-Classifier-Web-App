import React, { useState } from 'react';
import { Attachment, ClassifiedEmail } from '../Interface/interfaces';
import { Base64 } from 'js-base64';
import axios from 'axios';
import { useOAuth } from '../Contexts/OAuthContext';

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
    const { token } = useOAuth()

    const indexOfLastEmail = currentPage * itemsPerPage;
    const indexOfFirstEmail = indexOfLastEmail - itemsPerPage;
    const currentEmails = emails.slice(indexOfFirstEmail, indexOfLastEmail);

    const handleViewDetails = (email: ClassifiedEmail) => {
        setSelectedEmail(email);
    };

    const handleBackToList = () => {
        setSelectedEmail(null);
    };

    // const downloadAttachment = (attachment: { filename: string; mimeType: string; data: string, id: string }) => {
    //     try {
    //         const byteCharacters = atob(attachment.data);
    //         const byteNumbers = new Array(byteCharacters.length);
    //         for (let i = 0; i < byteCharacters.length; i++) {
    //             byteNumbers[i] = byteCharacters.charCodeAt(i);
    //         }
    //         const byteArray = new Uint8Array(byteNumbers);

    //         const blob = new Blob([byteArray], { type: attachment.mimeType });
    //         const url = URL.createObjectURL(blob);

    //         const link = document.createElement('a');
    //         link.href = url;
    //         link.download = attachment.filename;
    //         document.body.appendChild(link);
    //         link.click();
    //         document.body.removeChild(link);
    //         URL.revokeObjectURL(url);
    //     } catch (error) {
    //         console.error('Failed to download attachment:', error);
    //     }
    // };

    const decodeBase64 = (base64: string) => {
        let base64String = base64.replace(/-/g, '+').replace(/_/g, '/');
        const padding = base64String.length % 4;
        if (padding > 0) {
            base64String += '='.repeat(4 - padding);
        }
        return atob(base64String);
    };

    const downloadFile = (filename: any, mimeType: any, base64Data: any) => {
        try {
            // Decode Base64 string to binary data
            const binaryString = decodeBase64(base64Data);
            const byteNumbers = new Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                byteNumbers[i] = binaryString.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            // Create a Blob object
            const blob = new Blob([byteArray], { type: mimeType });
            const url = URL.createObjectURL(blob);

            // Create a link element and trigger the download
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up the URL object
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    const fetchAttachments = async (attachment: Attachment, messageId: string) => {
        try {
            const response = await axios.get(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}/attachments/${attachment.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(response.data)
            downloadFile(attachment.filename, attachment.mimeType, response.data?.data)
        } catch (error) {
            console.error('Error fetching attachment:', error);
            throw error;
        }
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
                    {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                        <div className="mt-4">
                            <h5 className="text-lg font-semibold">Attachments:</h5>
                            <ul className="list-disc ml-4">
                                {selectedEmail.attachments.map((attachment) => (
                                    <li key={attachment.filename} className="mt-2">
                                        <button
                                            onClick={() => fetchAttachments(attachment, selectedEmail.id)}
                                            className="text-blue-600 hover:underline"
                                        >
                                            {attachment.filename}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
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
