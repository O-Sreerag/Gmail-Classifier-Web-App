import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ClassifiedEmail, Email } from '../Interface/interfaces';
import { useClassifiedEmails } from '../Contexts/ClassifiedEmailContext';
import { useApiKey } from '../Contexts/ApiKeyContext';
import EmailList from './EmailList';
import { AiFillDashboard } from "react-icons/ai";
import './Components.css'

const Classification: React.FC = () => {
    const [emailCount, setEmailCount] = useState<number>(5);
    const { classifiedEmails, resetClassifiedEmails, updateClassifiedEmails } = useClassifiedEmails();
    const { apiKey } = useApiKey();
    const [isClassifying, setIsClassifying] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const fetchEmailsInBatches = async (batchSize: number, maxEmails: number) => {
        try {
            const googleToken = localStorage.getItem('google_token');
            if (!googleToken) {
                setError('GoogleToken is missing. Please Login again.');
                return;
            }
            if (!apiKey) {
                setError('API key is missing. Please provide a valid API key.');
                return;
            }
            setIsClassifying(true);
            setError(null);
            resetClassifiedEmails()

            let nextPageToken: string | undefined;
            let totalFetched = 0;

            while (totalFetched < maxEmails) {
                const response = await axios.get('https://www.googleapis.com/gmail/v1/users/me/messages', {
                    headers: { Authorization: `Bearer ${googleToken}` },
                    params: {
                        maxResults: batchSize,
                        pageToken: nextPageToken
                    }
                });

                const messageIds = response.data.messages.map((message: { id: string }) => message.id);
                const fullEmails: Email[] = [];

                for (const messageId of messageIds) {
                    try {
                        const fullMessage = await axios.get(`https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}`, {
                            headers: { Authorization: `Bearer ${googleToken}` }
                        });
                        fullEmails.push(fullMessage.data);
                    } catch (error) {
                        console.error(`Error fetching full message ${messageId}:`, error);
                    }
                }

                const extractedData = extractDataFromEmails(fullEmails);
                await classifyEmails(extractedData);

                totalFetched += fullEmails.length;
                nextPageToken = response.data.nextPageToken;

                console.log("fullEmails")
                console.log(fullEmails)

                if (!nextPageToken || totalFetched >= maxEmails) break;
                await delay(2000); // manual delay to avoid exhaution of resources
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsClassifying(false);
        }
    };

    const delay = (ms: number): Promise<void> => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    };

    function extractHeaderValue(headers: { name: string; value: string }[], headerName: string): string | null {
        const header = headers.find((h) => h.name.toLowerCase() === headerName.toLowerCase());
        return header ? header.value : null;
    }

    const extractDataFromEmails = (emails: Email[]): ClassifiedEmail[] => {
        const extractedData: ClassifiedEmail[] = [];

        emails.forEach((email) => {
            const id = email.id;
            const from = extractHeaderValue(email.payload.headers, "From") || "N/A";
            const to = extractHeaderValue(email.payload.headers, "To") || "N/A";
            const subject = extractHeaderValue(email.payload.headers, "Subject") || "N/A";

            if (email.payload.parts) {
                email.payload.parts.forEach((part) => {
                    if (part.body && part.body.data && part.mimeType === "text/html") {
                        extractedData.push({ id, from, to, subject, content: part.body.data });
                    }
                });
            } else {
                extractedData.push({ id, from, to, subject, content: email.payload.body.data });
            }
        });

        return extractedData;
    };

    const classifyEmails = async (emails: ClassifiedEmail[]) => {
        try {
            setIsClassifying(true);
            const response = await axios.post('http://localhost:5000/classify', {
                emails,
                api_key: apiKey
            });

            console.log("Classified Emails:", response.data.classifiedEmails);
            updateClassifiedEmails(response.data.classifiedEmails);
        } catch (error) {
            console.error('Error classifying emails:', error);
        }
    };

    const [animationClass, setAnimationClass] = useState('');

    useEffect(() => {
        if (isClassifying) {
            setAnimationClass('ellipsis-animation');
        } else {
            setAnimationClass('');
        }
    }, [isClassifying]);


    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Classify Emails</h3>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="w-full sm:w-auto flex items-center">
                    <label htmlFor="email-count" className="text-sm font-medium text-gray-700 mr-2">
                        Number of Emails
                    </label>
                    <select
                        id="email-count"
                        value={emailCount}
                        onChange={(e) => setEmailCount(Number(e.target.value))}
                        className="w-24 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#e8e4fc] focus:border-[#e8e4fc] text-sm"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
                </div>
                <button
                    onClick={() => fetchEmailsInBatches(5, emailCount)}
                    disabled={isClassifying}
                    className="w-full sm:w-auto bg-[#e8e4fc] text-gray-700 py-1 px-2 rounded-md shadow-md hover:bg-[#d6c8f4] focus:outline-none focus:ring-2 focus:ring-[#e8e4fc] focus:ring-offset-2 text-xs"
                >
                    {isClassifying ? 'Classifying...' : 'Fetch and Classify Emails'}
                </button>

            </div>

            {error && (
                <div className="mt-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            <div className='py-2'>
                {
                    isClassifying ? (
                        <div className={`flex gap-1 text-xs items-center }`}>
                            <AiFillDashboard className='text-orange-400' />
                            {
                                emailCount && emailCount>5 ? (
                                    <p className='text-orange-400'>please wait, fetching is done in batches</p>
                                ) : (
                                    <p className='text-orange-400'>please wait few secs</p>
                                )
                            }
                            <p className='text-orange-400'>{classifiedEmails.length}</p>
                            <p className={animationClass}></p>
                        </div>
                    ) : (
                        <div className='flex gap-1 text-xs items-center'>
                            <AiFillDashboard className='text-green-400' />
                            <p className='text-green-400'>{classifiedEmails.length}</p>
                        </div>
                    )
                }
            </div>

            {classifiedEmails.length > 0 && (
                <EmailList
                    emails={classifiedEmails}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    paginate={paginate}
                />
            )}
        </div>
    );
};

export default Classification;