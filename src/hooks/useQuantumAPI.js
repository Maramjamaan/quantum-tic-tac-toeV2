// importing necessary modules
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
  // porpose : send a quantum move to the backend
  const makeQuantumMove = async (square1, square2) => {
    // 1- load and reset error state
    setLoading(true);
    setError(null);
    
    try {
      //2- send POST request to the API
      const response = await fetch(`${API_URL}/game/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ square1, square2 })
      });
      //3- check if response is ok
      if (!response.ok) {
        throw new Error('API request failed');
      }
      //4- parse the JSON response
      const result = await response.json();
      //5- update loading state and return result
      setLoading(false);
      return result;
      //6- catch and handle errors
    } catch (err) {
      Logger.error('API Error:', err);
      setError(err.message);
      setLoading(false);
      return null;
    }
  };

// API Function to collapse a quantum move
// purpose: send a collapse option to the backend
// different from makeQuantumMove in endpoint and payload
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

    // API Function to reset the game
    // purpose: start a new game session
    
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
  // API Function to get the current game state
  // purpose: fetch the current state of the game from the backend
  //reads the game board, player turns, and other relevant info only
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
  // API Function to check for a winner
  // purpose: determine if there is a winner or draw in the current game 
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