import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const SIPCalculator = ({ isOpen, onClose }) => {
  const [investment, setInvestment] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  
  const [result, setResult] = useState({
    invested: 0,
    returns: 0,
    total: 0
  });

  useEffect(() => {
    const monthlyRate = rate / 12 / 100;
    const months = years * 12;
    const totalInvested = investment * months;
    
    // SIP Formula: P × ({[1 + i]^n - 1} / i) × (1 + i)
    const futureValue = investment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const estReturns = futureValue - totalInvested;

    setResult({
      invested: Math.round(totalInvested),
      returns: Math.round(estReturns),
      total: Math.round(futureValue)
    });
  }, [investment, rate, years]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className="calculator-modal"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>SIP Calculator</h3>
              <button className="close-btn" onClick={onClose}>&times;</button>
            </div>

            <div className="calculator-content">
              {/* Inputs */}
              <div className="input-group">
                <div className="label-row">
                  <label>Monthly Investment</label>
                  <span className="value-display">₹{investment.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="500" 
                  max="100000" 
                  step="500" 
                  value={investment}
                  onChange={(e) => setInvestment(Number(e.target.value))}
                  className="range-slider"
                />
              </div>

              <div className="input-group">
                <div className="label-row">
                  <label>Expected Return Rate (p.a)</label>
                  <span className="value-display">{rate}%</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="30" 
                  step="0.5" 
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="range-slider"
                />
              </div>

              <div className="input-group">
                <div className="label-row">
                  <label>Time Period</label>
                  <span className="value-display">{years} Years</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="40" 
                  step="1" 
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="range-slider"
                />
              </div>

              {/* Results */}
              <div className="results-container">
                <div className="result-item">
                  <span>Invested Amount</span>
                  <span className="amount">{formatCurrency(result.invested)}</span>
                </div>
                <div className="result-item highlight">
                  <span>Est. Returns</span>
                  <span className="amount returns">+{formatCurrency(result.returns)}</span>
                </div>
                <div className="result-item total">
                  <span>Total Value</span>
                  <span className="amount total-val">{formatCurrency(result.total)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SIPCalculator;
