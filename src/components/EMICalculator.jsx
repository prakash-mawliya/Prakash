import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';

const EMICalculator = ({ isOpen, onClose }) => {
  const [loanAmount, setLoanAmount] = useState('');
  const [annualRate, setAnnualRate] = useState('');
  const [loanYears, setLoanYears] = useState('');
  const [showResults, setShowResults] = useState(false);

  const emiData = useMemo(() => {
    const principal = Number(loanAmount) || 0;
    const years = Number(loanYears) || 0;
    const rate = Number(annualRate) || 0;

    const months = years * 12;
    if (!principal || !months) {
      return {
        emi: 0,
        totalInterest: 0,
        totalPayment: 0,
        schedule: [],
      };
    }

    const monthlyRate = rate / 12 / 100;
    const emi =
      monthlyRate === 0
        ? principal / months
        : (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1);

    const totalPayment = emi * months;
    const totalInterest = totalPayment - principal;

    const schedule = [];
    let balance = principal;

    for (let month = 1; month <= months; month++) {
      const interest = monthlyRate === 0 ? 0 : balance * monthlyRate;
      const principalPart = emi - interest;
      balance = Math.max(0, balance - principalPart);

      schedule.push({
        month,
        principal: principalPart,
        interest,
        balance,
      });
    }

    return {
      emi,
      totalInterest,
      totalPayment,
      schedule,
    };
  }, [loanAmount, annualRate, loanYears]);

  const formatINR = (value) =>
    `₹${Number(value).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const handleCalculate = () => {
    if (loanAmount && annualRate && loanYears) {
      setShowResults(true);
    }
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
          style={{ zIndex: 10000 }} // Ensure it's above everything
        >
          <motion.div
            className="calculator-modal"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            style={{ 
              maxWidth: '850px', 
              background: 'var(--card-bg)', 
              color: 'var(--text-main)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div className="modal-header" style={{ background: 'transparent', borderBottom: 'none', padding: '1.5rem 2rem 0' }}>
               <h2 style={{ width: '100%', textAlign: 'center', fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-main)', margin: 0 }}>
                Creative EMI Calculator
               </h2>
               <button className="close-btn" style={{ color: 'var(--text-muted)', position: 'absolute', right: '1.5rem', top: '1.5rem' }} onClick={onClose}>&times;</button>
            </div>

            <div className="calculator-content" style={{ padding: '1.5rem 2rem 2rem' }}>
              <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                
                {/* Inputs */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-main)' }}>Loan Amount (₹)</label>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => { setLoanAmount(e.target.value); setShowResults(false); }}
                    placeholder="e.g., 1000000"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', outline: 'none', fontSize: '1rem', background: 'var(--input-bg)', color: 'var(--text-main)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-main)' }}>Annual Interest Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={annualRate}
                    onChange={(e) => { setAnnualRate(e.target.value); setShowResults(false); }}
                    placeholder="e.g., 8.5"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', outline: 'none', fontSize: '1rem', background: 'var(--input-bg)', color: 'var(--text-main)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-main)' }}>Loan Tenure (Years)</label>
                  <input
                    type="number"
                    value={loanYears}
                    onChange={(e) => { setLoanYears(e.target.value); setShowResults(false); }}
                    placeholder="e.g., 20"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', outline: 'none', fontSize: '1rem', background: 'var(--input-bg)', color: 'var(--text-main)' }}
                  />
                </div>

                {/* Calculate Button */}
                <motion.button 
                  onClick={handleCalculate}
                  whileHover={{ scale: 1.02, backgroundColor: '#1d4ed8' }}
                  whileTap={{ scale: 0.98 }}
                  style={{ width: '100%', padding: '1rem', background: '#2563eb', color: 'white', fontWeight: 'bold', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '1.1rem', marginTop: '0.5rem', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)', transition: 'background-color 0.2s' }}
                >
                  Calculate My EMI
                </motion.button>
              </div>

              {/* Results */}
              <AnimatePresence>
                {showResults && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    style={{ marginTop: '2.5rem' }}
                  >
                    
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                      style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border)', marginBottom: '2rem' }}
                    >
                      <h3 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 1.5rem 0', color: 'var(--text-main)' }}>Your Loan Summary</h3>
                      
                      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)' }}>Monthly EMI</p>
                        <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{formatINR(emiData.emi)}</p>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid var(--border)', paddingTop: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <div style={{ textAlign: 'center' }}>
                          <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)' }}>Total Interest Payable</p>
                          <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{formatINR(emiData.totalInterest)}</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)' }}>Total Payment (Principal + Interest)</p>
                          <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{formatINR(emiData.totalPayment)}</p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                    >
                      <h3 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 1.5rem 0', color: 'var(--text-main)' }}>Monthly Payment Schedule</h3>
                      <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '0.75rem', maxHeight: '400px' }} className="custom-scrollbar">
                        <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', textAlign: 'left' }}>
                          <thead style={{ background: 'var(--input-bg)', position: 'sticky', top: 0 }}>
                            <tr>
                              <th style={{ padding: '1rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>MONTH</th>
                              <th style={{ padding: '1rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>PRINCIPAL</th>
                              <th style={{ padding: '1rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>INTEREST</th>
                              <th style={{ padding: '1rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>BALANCE</th>
                            </tr>
                          </thead>
                          <tbody>
                            {emiData.schedule.map((row, index) => (
                              <tr key={row.month} style={{ borderBottom: '1px solid var(--border)', background: index % 2 === 0 ? 'transparent' : 'var(--input-bg)' }}>
                                <td style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{row.month}</td>
                                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{formatINR(row.principal)}</td>
                                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{formatINR(row.interest)}</td>
                                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{formatINR(row.balance)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>

                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EMICalculator;
