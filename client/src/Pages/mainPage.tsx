import { useState } from 'react';
import ApiKeyInput from '../Components/ApiKey';
import EmailFetcher from '../Components/EmailFetching';
import ClassifyEmails from '../Components/EmailClassification';
import EmailDetails from '../Components/EmailDetails';
import axios from 'axios';

function MainPage() {
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [emails, setEmails] = useState<any[]>([]);
    const [selectedEmail, setSelectedEmail] = useState<any | null>(null);

    const fetchEmails = async (count: number) => {
        try {
            const googleToken = localStorage.getItem('google_token');
            if (!googleToken) throw new Error('No Google access token found');

            const response = await axios.get('https://www.googleapis.com/gmail/v1/users/me/messages', {
                headers: { Authorization: `Bearer ${googleToken}` },
                params: { maxResults: count }
            });

            const fullEmails = [];
            for (const message of response.data.messages) {
                try {
                    const fullMessage = await axios.get(`https://www.googleapis.com/gmail/v1/users/me/messages/${message.id}`, {
                        headers: { Authorization: `Bearer ${googleToken}` }
                    });
                    fullEmails.push(fullMessage.data);
                } catch (error) {
                    console.error(`Error fetching full message ${message.id}:`, error);
                }
            }
            
            setEmails(fullEmails);
            console.log(emails)
        } catch (error) {
            console.error(error);
        }
    };

    const classifyEmails = async () => {
        try {
            const response = await axios.post('http://localhost:5000/classify', {
                emails,
                api_key: apiKey
            });

            console.log("Classified Emails:", response.data.classifiedEmails);
            return response.data.classifiedEmails
        } catch (error) {
            console.error('Error classifying emails:', error);
        }
    };

    return (
        <div className="p-4">
            {!apiKey && <ApiKeyInput onSave={setApiKey} />}
            {apiKey && (
                <>
                    <EmailFetcher onFetch={fetchEmails} />
                    <ClassifyEmails onClassify={classifyEmails} />
                    {emails.length > 0 && (
                        <div className="mt-4">
                            <h2 className="text-lg font-bold">Fetched Emails</h2>
                            <ul>
                                {emails.map((email, index) => (
                                    <li key={index}>
                                        <button onClick={() => setSelectedEmail(email)}>
                                            {email.subject}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {selectedEmail && <EmailDetails email={selectedEmail} />}
                </>
            )}
        </div>
    );
}

export default MainPage;