import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

const QRCodeGenerator = ({ isOpen, onClose }) => {
  const [text, setText] = useState('');
  const [size, setSize] = useState(300);
  const [fgColor, setFgColor] = useState('#00ff41'); // Matrix Green default
  const [bgColor, setBgColor] = useState('#0d0d0d'); // Dark background default
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrUrl, setQrUrl] = useState('');

  const generateQR = () => {
    if (!text) return;
    setIsGenerating(true);
    
    // Simulate processing time for effect
    setTimeout(() => {
        const cleanFg = fgColor.replace('#', '');
        const cleanBg = bgColor.replace('#', '');
        const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&color=${cleanFg}&bgcolor=${cleanBg}&margin=10&format=png`;
        setQrUrl(url);
        setIsGenerating(false);
    }, 1500);
  };

  const handleDownload = async () => {
      if (!qrUrl) return;
      try {
        const response = await fetch(qrUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `CyberQR_${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (e) {
          console.error("Download failed", e);
      }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(5, 10, 20, 0.95)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999,
        }}
        onClick={(e) => { if(e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
            initial={{ scale: 0.8, opacity: 0, rotateX: 20 }}
            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotateX: -20 }}
            transition={{ type: 'spring', damping: 20 }}
            style={{
                width: '100%', maxWidth: '800px',
                background: 'linear-gradient(145deg, #1a1a1a, #0a0a0a)',
                border: '1px solid #333',
                borderRadius: '16px',
                boxShadow: '0 0 40px rgba(0, 255, 65, 0.2), inset 0 0 20px rgba(0,0,0,0.8)',
                padding: '2rem',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                fontFamily: '"Courier New", monospace' 
            }}
            onClick={(e) => e.stopPropagation()}
        >
            {/* Header / HUD */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        style={{ width: '24px', height: '24px', border: '2px dashed #00ff41', borderRadius: '50%' }}
                    />
                    <h2 style={{ margin: 0, color: '#00ff41', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '1.5rem', textShadow: '0 0 10px rgba(0,255,65,0.5)' }}>
                        Quantum QR Forge
                    </h2>
                </div>
                <button 
                    onClick={onClose}
                    style={{ background: 'transparent', border: 'none', color: '#ff4d4d', fontSize: '2rem', cursor: 'pointer', opacity: 0.8 }}
                >
                    &times;
                </button>
            </div>

            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                {/* LEFT: Controls */}
                <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    
                    {/* Input Field */}
                    <div style={{ position: 'relative' }}>
                        <label style={{ color: '#888', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px', display: 'block' }}>Data Stream</label>
                        <input 
                            type="text" 
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="ENTER URL / TEXT / COORD"
                            style={{
                                width: '100%', padding: '15px',
                                background: 'rgba(0,0,0,0.3)',
                                border: '1px solid #333', borderLeft: '4px solid #00ff41',
                                color: '#fff', fontSize: '1rem',
                                outline: 'none', 
                                fontFamily: 'monospace'
                            }}
                        />
                    </div>

                    {/* Color Controls */}
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ color: '#888', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '5px', display: 'block' }}>FG Color</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#222', padding: '5px', borderRadius: '4px' }}>
                                <input 
                                    type="color" 
                                    value={fgColor}
                                    onChange={(e) => setFgColor(e.target.value)}
                                    style={{ border: 'none', width: '30px', height: '30px', cursor: 'pointer', background: 'none' }}
                                />
                                <span style={{ color: '#aaa', fontSize: '0.8rem', fontFamily: 'monospace' }}>{fgColor}</span>
                            </div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ color: '#888', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '5px', display: 'block' }}>BG Color</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#222', padding: '5px', borderRadius: '4px' }}>
                                <input 
                                    type="color" 
                                    value={bgColor}
                                    onChange={(e) => setBgColor(e.target.value)}
                                    style={{ border: 'none', width: '30px', height: '30px', cursor: 'pointer', background: 'none' }}
                                />
                                <span style={{ color: '#aaa', fontSize: '0.8rem', fontFamily: 'monospace' }}>{bgColor}</span>
                            </div>
                        </div>
                    </div>

                    {/* Size Slider */}
                    <div>
                         <label style={{ color: '#888', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '5px', display: 'block' }}>Resolution: {size}px</label>
                         <input 
                            type="range" 
                            min="200" max="600" step="10"
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                            style={{ width: '100%', cursor: 'pointer', accentColor: '#00ff41' }}
                         />
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={generateQR}
                        disabled={isGenerating || !text}
                        style={{
                            padding: '15px', width: '100%',
                            background: isGenerating ? '#333' : 'linear-gradient(90deg, #00ff41, #008f11)',
                            color: isGenerating ? '#666' : '#000',
                            fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px',
                            border: 'none', borderRadius: '4px', cursor: isGenerating ? 'not-allowed' : 'pointer',
                            marginTop: '1rem',
                            boxShadow: isGenerating ? 'none' : '0 0 20px rgba(0,255,65,0.4)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {isGenerating ? 'INITIALIZING...' : 'COMPILE QR CODE'}
                    </button>

                </div>

                {/* RIGHT: Preview */}
                <div style={{ 
                    flex: '1 1 300px', 
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.5)', borderRadius: '12px', border: '1px solid #333',
                    minHeight: '350px', position: 'relative'
                }}>
                    {/* Corner Reticles */}
                    <div style={{ position: 'absolute', top: 10, left: 10, width: 20, height: 20, borderTop: '2px solid #00ff41', borderLeft: '2px solid #00ff41' }} />
                    <div style={{ position: 'absolute', top: 10, right: 10, width: 20, height: 20, borderTop: '2px solid #00ff41', borderRight: '2px solid #00ff41' }} />
                    <div style={{ position: 'absolute', bottom: 10, left: 10, width: 20, height: 20, borderBottom: '2px solid #00ff41', borderLeft: '2px solid #00ff41' }} />
                    <div style={{ position: 'absolute', bottom: 10, right: 10, width: 20, height: 20, borderBottom: '2px solid #00ff41', borderRight: '2px solid #00ff41' }} />

                    {/* Scanner line */}
                    {isGenerating && (
                        <motion.div 
                            style={{ 
                                position: 'absolute', top: 0, left: 0, right: 0, height: '2px', 
                                background: '#00ff41', boxShadow: '0 0 10px #00ff41', zIndex: 10 
                            }}
                            animate={{ top: ['10%', '90%', '10%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        />
                    )}

                    {qrUrl && !isGenerating ? (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}
                        >
                             <img 
                                src={qrUrl} 
                                alt="Generated QR" 
                                style={{ maxWidth: '80%', height: 'auto', border: `2px solid ${fgColor}`, borderRadius: '4px', boxShadow: `0 0 20px ${fgColor}40` }}
                            />
                            {/* Download Btn */}
                            <button 
                                onClick={handleDownload}
                                style={{
                                    background: 'transparent', border: '1px solid #00ff41', color: '#00ff41',
                                    padding: '8px 20px', borderRadius: '4px', cursor: 'pointer',
                                    fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '1px',
                                    transition: 'all 0.2s',
                                    display: 'flex', alignItems: 'center', gap: '8px'
                                }}
                                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(0, 255, 65, 0.1)'; }}
                                onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
                            >
                                <span>📥</span> SAVE ARTIFACT
                            </button>
                        </motion.div>
                    ) : (
                        !isGenerating && (
                            <div style={{ textAlign: 'center', color: '#444', fontFamily: 'monospace' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.2 }}>🔮</div>
                                <p>AWAITING INPUT DATA</p>
                            </div>
                        )
                    )}
                    
                    {isGenerating && (
                        <div style={{ color: '#00ff41', fontFamily: 'monospace', marginTop: '20px' }}>
                             PROCESSING DATABLOCKS...
                        </div>
                    )}
                </div>
            </div>
            
            {/* Footer / Status */}
            <div style={{ borderTop: '1px solid #333', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', color: '#666', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                <span>SYS.VERSION.3.0.1</span>
                <span>SECURE CONNECTION: TRUE</span>
            </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QRCodeGenerator;
