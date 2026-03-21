import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const EMICalculator = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(5); // In Years

  const [result, setResult] = useState({
    emi: 0,
    interest: 0,
    total: 0
  });

  useEffect(() => {
    // EMI Formula: [P x R x (1+R)^N]/[(1+R)^N-1]
    const r = rate / 12 / 100; // Monthly Interest Rate
    const n = tenure * 12; // Months

    const emi = amount * r * (Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));
    const totalPayment = emi * n;
    const totalInterest = totalPayment - amount;

    setResult({
      emi: Math.round(emi),
      interest: Math.round(totalInterest),
      total: Math.round(totalPayment)
    });
  }, [amount, rate, tenure]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
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
              <h3>EMI Calculator</h3>
              <button className="close-btn" onClick={onClose}>&times;</button>
            </div>

            <div className="calculator-content">
              {/* Loan Amount */}
              <div className="input-group">
                <div className="label-row">
                  <label>Loan Amount</label>
                  <span className="value-display">₹{amount.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="10000000"
                  step="10000"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="range-slider"
                />
              </div>

              {/* Interest Rate */}
              <div className="input-group">
                <div className="label-row">
                  <label>Interest Rate (p.a)</label>
                  <span className="value-display">{rate}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="range-slider"
                />
              </div>

              {/* Tenure */}
              <div className="input-group">
                <div className="label-row">
                  <label>Loan Tenure</label>
                  <span className="value-display">{tenure} Years</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="range-slider"
                />
              </div>

              {/* Results */}
              <div className="results-container">
                <div className="result-item">
                  <span>Loan Amount</span>
                  <span className="amount">{formatCurrency(amount)}</span>
                </div>
                <div className="result-item highlight">
                  <span>Total Interest</span>
                  <span className="amount returns">{formatCurrency(result.interest)}</span>
                </div>
                <div className="result-item total">
                    <span>Monthly EMI</span>
                    <span className="amount total-val">{formatCurrency(result.emi)}</span>
                </div>
                 <div className="result-item" style={{marginTop: '0.5rem', fontSize: '0.85rem'}}>
                  <span>Total Payable</span>
                  <span className="amount" style={{fontSize: '0.9rem'}}>{formatCurrency(result.total)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EMICalculator;
