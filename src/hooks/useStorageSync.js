import { useState, useEffect } from 'react';

// Custom hook for real-time localStorage synchronization
export const useStorageSync = (key, initialValue = null) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // Listen for storage events from other tabs/windows
    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === key && event.newValue !== null) {
                try {
                    setStoredValue(JSON.parse(event.newValue));
                    console.log(`Storage event received for key "${key}"`);
                } catch (error) {
                    console.error(`Error parsing storage event for key "${key}":`, error);
                }
            }
        };

        // Add storage event listener
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [key]);

    // Function to update localStorage and trigger change
    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
            
            // Trigger custom event for same-tab updates
            window.dispatchEvent(new CustomEvent('localStorageUpdate', {
                detail: { key, value: valueToStore }
            }));
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    };

    return [storedValue, setValue];
};

// Hook for multiple keys
export const useMultiStorageSync = (keys, initialValues = {}) => {
    const [values, setValues] = useState(() => {
        const initial = {};
        keys.forEach(key => {
            try {
                const item = window.localStorage.getItem(key);
                initial[key] = item ? JSON.parse(item) : initialValues[key];
            } catch (error) {
                console.error(`Error reading localStorage key "${key}":`, error);
                initial[key] = initialValues[key];
            }
        });
        return initial;
    });

    // Listen for storage events
    useEffect(() => {
        const handleStorageChange = (event) => {
            if (keys.includes(event.key) && event.newValue !== null) {
                try {
                    const newValue = JSON.parse(event.newValue);
                    setValues(prev => ({
                        ...prev,
                        [event.key]: newValue
                    }));
                    console.log(`Storage event received for key "${event.key}"`);
                } catch (error) {
                    console.error(`Error parsing storage event for key "${event.key}":`, error);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [keys]);

    // Function to update specific key
    const setValue = (key, value) => {
        try {
            const valueToStore = value instanceof Function ? value(values[key]) : value;
            const newValues = { ...values, [key]: valueToStore };
            setValues(newValues);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
            
            // Trigger custom event
            window.dispatchEvent(new CustomEvent('localStorageUpdate', {
                detail: { key, value: valueToStore }
            }));
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    };

    return [values, setValue];
};
