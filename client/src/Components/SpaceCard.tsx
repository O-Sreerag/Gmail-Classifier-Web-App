import React from 'react';
import ApiKeyInput from './ApiKey';
import { useOAuth } from '../Contexts/OAuthContext';
import Classification from './Classification';
import { TbLogout } from "react-icons/tb";

const SpaceCard: React.FC = () => {
    const { user, logout } = useOAuth();

    return (
        <div className="w-full max-w-lg md:max-w-1xl lg:max-w-2xl rounded-lg mx-auto">
            <ApiKeyInput />

            <div className="mt-1 bg-white p-1 rounded-md shadow-lg">
                <div className='relative h-auto flex flex-col'>
                    <div className="relative w-full h-20 bg-gray-200 rounded-lg overflow-hidden">
                        <img
                            src="./blue-3.png"
                            alt="Cover"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>
                    <div className='relative mt-[-25px] mx-auto w-full'>
                        <div className='flex items-center justify-between'>
                            <div className="flex items-center">
                                <div className="relative">
                                    <img
                                        src={user?.picture || './blue-3.png'}
                                        alt="Profile"
                                        className="ml-[5px] w-12 h-12 border-white border-4 rounded-full"
                                    />
                                </div>
                                <div className="ml-2 text-left">
                                    <h2 className="text-sm font-semibold text-gray-700">{user?.name || 'User'}</h2>
                                    <p className="text-xs text-gray-600">{user?.email || 'No Email'}</p>
                                </div>
                            </div>
                            <div className='cursor-pointer p-2' onClick={logout}>
                                <TbLogout className='text-red-600 w-5 h-5' />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 p-3">
                    <Classification />

                    <hr />
                    <div className="mt-2 text-gray-400 text-xs">
                        <span>Build With Gemini AI</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpaceCard;