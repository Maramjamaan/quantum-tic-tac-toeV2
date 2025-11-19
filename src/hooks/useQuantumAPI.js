import { useState } from 'react';
import config from '../config';
import Logger from '../utils/logger';

// Hook definition
export const useQuantumAPI = () => {
  // State for loading and error handling
  const [loading, setLoading] = useState(false);
  //important for debugging API issues
  const [error, setError] = useState(null);
  
  //get the API URL from config
  const API_URL = config.apiUrl;

  // API Function to make a quantum move
  const makeQuantumMove = async (square1, square2) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/game/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ square1, square2 })
      });
      
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      const result = await response.json();
      setLoading(false);
      return result;
    } catch (err) {
      Logger.error('API Error:', err);
      setError(err.message);
      setLoading(false);
      return null;
    }
  };
// API Function to collapse a quantum move
  const collapseMove = async (collapseOption) => {
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/game/collapse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collapse_option: collapseOption })
      });
      
      if (!response.ok) {
        throw new Error('Collapse request failed');
      }
      
      const result = await response.json();
      setLoading(false);
      return result;
    } catch (err) {
      Logger.error('Collapse Error:', err);
      setError(err.message);
      setLoading(false);
      return null;
    }
  };

  const resetGame = async () => {
    try {
      const response = await fetch(`${API_URL}/game/new`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Reset failed');
      }
      
      return await response.json();
    } catch (err) {
      Logger.error('Reset Error:', err);
      setError(err.message);
      return null;
    }
  };

  const getGameState = async () => {
    try {
      const response = await fetch(`${API_URL}/game/state`);
      if (!response.ok) {
        throw new Error('Failed to get game state');
      }
      return await response.json();
    } catch (err) {
      Logger.error('Get State Error:', err);
      setError(err.message);
      return null;
    }
  };

  const checkWinner = async () => {
    try {
      const response = await fetch(`${API_URL}/game/winner`);
      
      if (!response.ok) {
        throw new Error('Failed to check winner');
      }
      
      return await response.json();
    } catch (err) {
      Logger.error('Check Winner Error:', err);
      setError(err.message);
      return null;
    }
  };

  return { 
    makeQuantumMove, 
    collapseMove, 
    resetGame, 
    getGameState,
    checkWinner,
    loading, 
    error 
  };
};