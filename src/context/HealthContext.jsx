import React, { createContext, useState, useContext, useEffect } from 'react';
import { runAIAnalysis } from '../utils/healthLogic';

const HealthContext = createContext();

export const HealthProvider = ({ children }) => {
  const [userAnswers, setUserAnswers] = useState(() => {
    const saved = localStorage.getItem('userAnswers');
    return saved ? JSON.parse(saved) : null;
  });

  const [planLevel, setPlanLevel] = useState(() => {
    return localStorage.getItem('planLevel') || 'basic';
  });

  const [healthData, setHealthData] = useState(null);

  useEffect(() => {
    if (userAnswers) {
      const analysis = runAIAnalysis(userAnswers, planLevel);
      setHealthData(analysis);
      localStorage.setItem('userAnswers', JSON.stringify(userAnswers));
      localStorage.setItem('planLevel', planLevel);
    }
  }, [userAnswers, planLevel]);

  const saveAnswers = (answers) => {
    setUserAnswers(answers);
  };

  const upgradePlan = (level) => {
    setPlanLevel(level);
  };

  const clearData = () => {
    setUserAnswers(null);
    setHealthData(null);
    setPlanLevel('basic');
    localStorage.removeItem('userAnswers');
    localStorage.removeItem('planLevel');
  };

  return (
    <HealthContext.Provider value={{ userAnswers, healthData, planLevel, isPremium: planLevel !== 'basic', saveAnswers, upgradePlan, clearData }}>
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => useContext(HealthContext);
