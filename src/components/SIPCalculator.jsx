import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Area, AreaChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const SIPCalculator = ({ isOpen, onClose }) => {
  const [investment, setInvestment] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [showResults, setShowResults] = useState(false);

  const openedAtRef = useRef(0);

  useEffect(() => {
    if (isOpen) {
      openedAtRef.current = Date.now();
    }
  }, [isOpen]);

  const handleOverlayClose = () => {
    // 500ms debounce to prevent mobile "ghost clicks" from instantly closing the modal
    if (Date.now() - openedAtRef.current < 500) return;
    onClose();
  };

  const sipData = useMemo(() => {
    const P = Number(investment) || 0;
    const nYears = Number(years) || 0;
    const r = Number(rate) || 0;
    const months = nYears * 12;

    if (!P || !months || !r) {
      return { totalInvested: 0, estReturns: 0, futureValue: 0, schedule: [] };
    }

    const monthlyRate = r / 12 / 100;
    const futureValue = P * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const totalInvested = P * months;
    const estReturns = futureValue - totalInvested;

    const schedule = [];
    for (let yr = 1; yr <= nYears; yr++) {
      const mMonths = yr * 12;
      const yearlyFV = P * ((Math.pow(1 + monthlyRate, mMonths) - 1) / monthlyRate) * (1 + monthlyRate);
      const yrInvested = P * mMonths;
      
      schedule.push({
        year: yr,
        invested: yrInvested,
        returns: yrInvested > 0 ? (yearlyFV - yrInvested) : 0,
        balance: yearlyFV
      });
    }

    return { totalInvested, estReturns, futureValue, schedule };
  }, [investment, rate, years]);

  const formatINR = (value) => 
    `₹${Number(value).toLocaleString('en-IN', {
      maximumFractionDigits: 0,
    })}`;

  const handleCalculate = () => {
    if (investment && rate && years) {
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
          onClick={handleOverlayClose}
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
                Creative SIP Calculator
               </h2>
               <button className="close-btn" style={{ color: 'var(--text-muted)', position: 'absolute', right: '1.5rem', top: '1.5rem' }} onClick={onClose}>&times;</button>
            </div>

            <div className="calculator-content" style={{ padding: '1.5rem 2rem 2rem' }}>
              <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                
                {/* Inputs */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-main)' }}>Monthly Investment Amount (₹)</label>
                  <input
                    type="number"
                    value={investment}
                    onChange={(e) => { setInvestment(e.target.value); setShowResults(false); }}
                    placeholder="e.g., 5000"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', outline: 'none', fontSize: '1rem', background: 'var(--input-bg)', color: 'var(--text-main)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-main)' }}>Expected Return Rate (p.a %)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={rate}
                    onChange={(e) => { setRate(e.target.value); setShowResults(false); }}
                    placeholder="e.g., 12"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', outline: 'none', fontSize: '1rem', background: 'var(--input-bg)', color: 'var(--text-main)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-main)' }}>Time Period (Years)</label>
                  <input
                    type="number"
                    value={years}
                    onChange={(e) => { setYears(e.target.value); setShowResults(false); }}
                    placeholder="e.g., 10"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', outline: 'none', fontSize: '1rem', background: 'var(--input-bg)', color: 'var(--text-main)' }}
                  />
                </div>

                {/* Calculate Button */}
                <motion.button 
                  onClick={handleCalculate}
                  whileHover={{ scale: 1.02, backgroundColor: '#047857' }}
                  whileTap={{ scale: 0.98 }}
                  style={{ width: '100%', padding: '1rem', background: '#059669', color: 'white', fontWeight: 'bold', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '1.1rem', marginTop: '0.5rem', boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.2)', transition: 'background-color 0.2s' }}
                >
                  Calculate My SIP
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
                      <h3 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 1.5rem 0', color: 'var(--text-main)' }}>Wealth Projection Summary</h3>
                      
                      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)' }}>Total Expected Value</p>
                        <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{formatINR(sipData.futureValue)}</p>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid var(--border)', paddingTop: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <div style={{ textAlign: 'center' }}>
                          <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)' }}>Total Amount Invested</p>
                          <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{formatINR(sipData.totalInvested)}</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)' }}>Est. Wealth Returns</p>
                          <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{formatINR(sipData.estReturns)}</p>
                        </div>
                      </div>

                      {/* PIE CHART */}
                      <div style={{ height: '250px', width: '100%', marginTop: '1.5rem' }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Invested', value: sipData.totalInvested },
                                { name: 'Returns', value: sipData.estReturns },
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                              stroke="none"
                            >
                              <Cell fill="#3b82f6" />
                              <Cell fill="#10b981" />
                            </Pie>
                            <Tooltip formatter={(value) => formatINR(value)} />
                            <Legend verticalAlign="bottom" height={36}/>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                    >
                      <h3 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 1.5rem 0', color: 'var(--text-main)' }}>Year-by-Year Growth Schedule</h3>
                      
                      {/* AREA CHART */}
                      <div style={{ height: '300px', width: '100%', marginBottom: '2rem', background: 'var(--input-bg)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={sipData.schedule}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2}/>
                              </linearGradient>
                              <linearGradient id="colorReturns" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0.2}/>
                              </linearGradient>
                            </defs>
                             <XAxis dataKey="year" tickFormatter={(tick) => `Y${tick}`} stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis 
                               tickFormatter={(tick) => tick >= 100000 ? `₹${(tick/100000).toFixed(1)}L` : `₹${(tick/1000).toFixed(0)}k`} 
                               width={60} 
                               stroke="var(--text-muted)" 
                               fontSize={12} 
                               tickLine={false} 
                               axisLine={false} 
                            />
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                            <Tooltip 
                              formatter={(value) => formatINR(value)}
                              labelFormatter={(label) => `Year ${label}`}
                              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Area type="monotone" dataKey="invested" name="Invested" stackId="1" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorInvested)" />
                            <Area type="monotone" dataKey="returns" name="Returns" stackId="1" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorReturns)" />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>

                      <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '0.75rem', maxHeight: '400px' }} className="custom-scrollbar">
                        <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', textAlign: 'left' }}>
                          <thead style={{ background: 'var(--input-bg)', position: 'sticky', top: 0 }}>
                            <tr>
                              <th style={{ padding: '1rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>YEAR</th>
                              <th style={{ padding: '1rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>INVESTED AMOUNT</th>
                              <th style={{ padding: '1rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>WEALTH GAINED</th>
                              <th style={{ padding: '1rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>TOTAL FUTURE VALUE</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sipData.schedule.map((row, index) => (
                              <tr key={row.year} style={{ borderBottom: '1px solid var(--border)', background: index % 2 === 0 ? 'transparent' : 'var(--input-bg)' }}>
                                <td style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{row.year}</td>
                                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{formatINR(row.invested)}</td>
                                <td style={{ padding: '1rem', color: '#059669', fontWeight: '500' }}>+{formatINR(row.returns)}</td>
                                <td style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>{formatINR(row.balance)}</td>
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

export default SIPCalculator;
