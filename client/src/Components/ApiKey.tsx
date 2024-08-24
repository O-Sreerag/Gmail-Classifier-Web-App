import { useState } from 'react';

function ApiKeyInput({ onSave }: { onSave: (key: string) => void }) {
    const [apiKey, setApiKey] = useState<string>('');

    const handleSubmit = () => {
        onSave(apiKey);
    };

    return (
        <div>
            <label htmlFor="api-key" className="block text-sm font-medium text-gray-700">
                API Key
            </label>
            <input
                type="text"
                id="api-key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your API key"
            />
            <button
                type="button"
                onClick={handleSubmit}
                className="mt-2 bg-blue-500 text-white py-2 px-4 rounded"
            >
                Save API Key
            </button>
        </div>
    );
}

export default ApiKeyInput;
