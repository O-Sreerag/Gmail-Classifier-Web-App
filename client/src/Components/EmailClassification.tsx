import { useState } from 'react';
import { Base64 } from 'js-base64'

interface ClassifiedEmailsInterface {
    id: string,
    from: string;
    to: string;
    subject: string,
    content: any
    category: string
}

function ClassifyEmails({ onClassify }: { onClassify: () => Promise<ClassifiedEmailsInterface[]> }) {
    const [classifiedEmails, setClassifiedEmails] = useState<ClassifiedEmailsInterface[] | null>(null);

    const handleClassify = async () => {
        const result = await onClassify();
        setClassifiedEmails(result);
    };

    const decodeBase64 = (encodedContent: string) => {
        console.log(Base64.decode(encodedContent))
        return Base64.decode(encodedContent);
    };

    return (
        <div>
            <button
                type="button"
                onClick={handleClassify}
                className="bg-blue-500 text-white py-2 px-4 rounded"
            >
                Classify Emails
            </button>
            {classifiedEmails && (
                <div className="mt-4 p-4 border border-gray-300 rounded">
                    <h2 className="text-lg font-bold">Classification Results</h2>
                    <ul>
                        {classifiedEmails.map((email, index) => (
                            <li key={index}>
                                <p>
                                    <strong>{email.subject}</strong> - {email.category}
                                </p>
                                <div dangerouslySetInnerHTML={{ __html: decodeBase64(email.content) }} />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default ClassifyEmails;
