import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { api } from '../services/api';
import { AuthContext } from './AuthContext';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  const [parties, setParties] = useState([]);
  const [items, setItems] = useState([]);
  const [bills, setBills] = useState([]);
  const [summary, setSummary] = useState(null);

  const [loadingParties, setLoadingParties] = useState(true);
  const [loadingItems, setLoadingItems] = useState(true);
  const [loadingBills, setLoadingBills] = useState(true);

  const refreshParties = useCallback(async () => {
    try {
      const data = await api.getParties();
      setParties(data);
    } catch (e) {
      console.error("Failed to fetch parties", e);
    } finally {
      setLoadingParties(false);
    }
  }, []);

  const refreshItems = useCallback(async () => {
    try {
      const data = await api.getItems();
      setItems(data);
    } catch (e) {
      console.error("Failed to fetch items", e);
    } finally {
      setLoadingItems(false);
    }
  }, []);

  const refreshBills = useCallback(async (params = {}) => {
    try {
      const data = await api.getBills(params);
      setBills(data);
    } catch (e) {
      console.error("Failed to fetch bills", e);
    } finally {
      setLoadingBills(false);
    }
  }, []);

  const refreshSummary = useCallback(async () => {
    try {
      const data = await api.getBillSummary();
      setSummary(data);
    } catch (e) {
      console.error("Failed to fetch summary", e);
    }
  }, []);

  const clearData = useCallback(() => {
    setParties([]);
    setItems([]);
    setBills([]);
    setSummary(null);
    setLoadingParties(true);
    setLoadingItems(true);
    setLoadingBills(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      refreshParties();
      refreshItems();
      refreshBills();
      refreshSummary();
    } else {
      clearData();
    }
  }, [isAuthenticated, refreshParties, refreshItems, refreshBills, refreshSummary, clearData]);

  return (
    <DataContext.Provider value={{
      parties, loadingParties, refreshParties,
      items, loadingItems, refreshItems,
      bills, loadingBills, refreshBills,
      summary, refreshSummary,
      clearData
    }}>
      {children}
    </DataContext.Provider>
  );
};
