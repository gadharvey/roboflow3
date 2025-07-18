import { useState } from "react";

export function useLocalStorage(key, initialValue = "") {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? item : initialValue;
    } catch (error) {
      console.error("Error getting localStorage key", error);
      return initialValue;
    }
  });

  const setStorage = (value) => {
    try {
      localStorage.setItem(key, value);
      setStoredValue(value);
    } catch (error) {
      console.error("Error setting localStorage key", error);
    }
  };

  const getStorage = () => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error("Error getting localStorage key", error);
      return null;
    }
  };

  return { storedValue, setStorage, getStorage };
}
