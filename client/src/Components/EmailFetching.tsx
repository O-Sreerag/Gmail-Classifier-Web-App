import { useState } from 'react';

function EmailFetcher({ onFetch }: { onFetch: (count: number) => void }) {
    const [emailCount, setEmailCount] = useState<number>(5);

    const handleFetch = () => {
        onFetch(emailCount);
    };

    return (
        <div>
            <label htmlFor="email-count" className="block text-sm font-medium text-gray-700">
                Number of Emails
            </label>
            <select
                id="email-count"
                value={emailCount}
                onChange={(e) => setEmailCount(Number(e.target.value))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
            </select>
            <button
                type="button"
                onClick={handleFetch}
                className="mt-2 bg-blue-500 text-white py-2 px-4 rounded"
            >
                Fetch Emails
            </button>
        </div>
    );
}

export default EmailFetcher;
