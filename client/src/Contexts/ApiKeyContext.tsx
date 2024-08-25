import React, { createContext, useState, ReactNode, useContext } from 'react';

interface ApiKeyContextProps {
    apiKey: string | null;
    setApiKey: (key: string | null) => void;
}

const ApiKeyContext = createContext<ApiKeyContextProps | undefined>(undefined);

export const ApiKeyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [apiKey, setApiKey] = useState<string | null>(null);

    return (
        <ApiKeyContext.Provider value={{ apiKey, setApiKey }}>
            {children}
        </ApiKeyContext.Provider>
    );
};

export const useApiKey = (): ApiKeyContextProps => {
    const context = useContext(ApiKeyContext);
    if (!context) {
        throw new Error('useApiKey must be used within an ApiKeyProvider');
    }
    return context;
};
