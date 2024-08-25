import { useState } from 'react';
import { GoCheck, GoPlus, GoX } from "react-icons/go";
import { MdDashboard } from "react-icons/md";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { GoPaperclip } from "react-icons/go";
import { MdEdit } from "react-icons/md";
import { useApiKey } from '../Contexts/ApiKeyContext';

function ApiKeyInput() {
    const { apiKey, setApiKey } = useApiKey();
    const [ tempApiKey, setTempApiKey] = useState<string | null>(apiKey);
    const [ isEditing, setIsEditing] = useState(false);

    const handleAddClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        setApiKey(tempApiKey);
        setTempApiKey('');
        setIsEditing(false);
    };

    const handleCancelClick = () => {
        setTempApiKey('');
        setIsEditing(false);
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCopyClick = () => {
        // You can add more logic here if needed
    };

    return (
        <div className="flex justify-between items-center p-2 py-3 rounded-lg mb-1 bg-[#e4e0f8] shadow-lg">
            <div className="flex items-center gap-1 w-full">
                <div className=''>
                    <MdDashboard className='text-3xl text-gray-500' />
                </div>
                <div className='w-[80%]'>
                    {isEditing ? (
                        <input
                            type="text"
                            value={ tempApiKey ? tempApiKey : ""}
                            onChange={(e) => setTempApiKey(e.target.value)}
                            placeholder={apiKey ? apiKey : "enter api key"}
                            className="text-sm font-thin p-1 rounded border border-gray-300 focus:outline-none"
                        />
                    ) : (
                        <div>
                            <h2 className="text-sm font-medium">API Key</h2>
                            {
                                apiKey ? (
                                    <div className='border rounded-sm border-gray-400 bg-white pl-1 break-words max-h-8 overflow-y-scroll'>
                                        <p className="text-xs text-gray-500">{apiKey}</p>
                                    </div>
                                ) : (
                                    <div className='border-1 border-gray-600'>
                                        <p className="text-xs text-gray-500">Add API Key (GEMINI)</p>
                                    </div>
                                )
                            }
                        </div>
                    )}
                </div>
            </div>
            <div className='flex-shrink-0'>
                {isEditing ? (
                    <div className='flex gap-1'>
                        <button
                            className="w-8 h-8 focus:outline-none bg-white rounded-full flex items-center justify-center shadow-md"
                            onClick={handleSaveClick}
                        >
                            <GoCheck />
                        </button>
                        <button
                            className="w-8 h-8 focus:outline-none bg-red-500 rounded-full flex items-center justify-center shadow-md"
                            onClick={handleCancelClick}
                        >
                            <GoX className='text-white' />
                        </button>
                    </div>
                ) : apiKey ? (
                    <div className='flex gap-1'>
                        <button
                            className="w-8 h-8 focus:outline-none bg-white rounded-full flex items-center justify-center shadow-md"
                            onClick={handleEditClick}
                        >
                            <MdEdit />
                        </button>
                        <CopyToClipboard text={apiKey} onCopy={handleCopyClick}>
                            <button className="w-8 h-8 focus:outline-none bg-white rounded-full flex items-center justify-center shadow-md">
                                <GoPaperclip />
                            </button>
                        </CopyToClipboard>
                    </div>
                ) : (
                    <button
                        className="w-8 h-8 focus:outline-none bg-white rounded-full flex items-center justify-center shadow-md"
                        onClick={handleAddClick}
                    >
                        <GoPlus />
                    </button>
                )}
            </div>
        </div>
    );
}

export default ApiKeyInput;

