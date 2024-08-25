// src/Contexts/ClassifiedEmailContext.tsx
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { ClassifiedEmail } from '../Interface/interfaces';

// Update the context type to include the new function
interface ClassifiedEmailContextType {
    classifiedEmails: ClassifiedEmail[];
    setClassifiedEmails: React.Dispatch<React.SetStateAction<ClassifiedEmail[]>>;
    updateClassifiedEmails: (newEmails: ClassifiedEmail[]) => void;
    resetClassifiedEmails: () => void;  // New function added here
}

const ClassifiedEmailContext = createContext<ClassifiedEmailContextType | undefined>(undefined);

export const ClassifiedEmailProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [classifiedEmails, setClassifiedEmails] = useState<ClassifiedEmail[]>([]);

    // Create the updateClassifiedEmails function
    const updateClassifiedEmails = useCallback((newEmails: ClassifiedEmail[]) => {
        setClassifiedEmails(prevEmails => [...prevEmails, ...newEmails]);
    }, []);

    // Create the resetClassifiedEmails function
    const resetClassifiedEmails = useCallback(() => {
        setClassifiedEmails([]);
    }, []);

    return (
        <ClassifiedEmailContext.Provider value={{ classifiedEmails, setClassifiedEmails, updateClassifiedEmails, resetClassifiedEmails }}>
            {children}
        </ClassifiedEmailContext.Provider>
    );
};

export const useClassifiedEmails = (): ClassifiedEmailContextType => {
    const context = useContext(ClassifiedEmailContext);
    if (!context) {
        throw new Error('useClassifiedEmails must be used within a ClassifiedEmailProvider');
    }
    return context;
};
