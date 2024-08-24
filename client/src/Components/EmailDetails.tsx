import { useState } from 'react';

function EmailDetails({ email }: { email: any }) {
    return (
        <div className="mt-4 p-4 border border-gray-300 rounded">
            <h2 className="text-lg font-bold">Email Details</h2>
            <p><strong>Subject:</strong> {email.subject}</p>
            <p><strong>From:</strong> {email.from}</p>
            <p><strong>Body:</strong> {email.body}</p>
            {email.attachments && (
                <div>
                    <h3 className="font-semibold">Attachments:</h3>
                    <ul>
                        {email.attachments.map((attachment: any, index: number) => (
                            <li key={index}>
                                <a href={attachment.url} download>{attachment.name}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default EmailDetails;