import { useState } from 'react';

function ClassifyEmails({ onClassify }: { onClassify: () => Promise<string> }) {
    const [classificationResult, setClassificationResult] = useState<string | null>(null);

    const handleClassify = async () => {
        const result = await onClassify();
        setClassificationResult(result);
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
            {classificationResult && (
                <div className="mt-4 p-4 border border-gray-300 rounded">
                    <h2 className="text-lg font-bold">Classification Result</h2>
                    <p>{classificationResult}</p>
                </div>
            )}
        </div>
    );
}

export default ClassifyEmails;
