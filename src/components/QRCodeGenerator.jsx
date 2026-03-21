import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

const QRCodeGenerator = ({ isOpen, onClose }) => {
  const [text, setText] = useState('');
  const [qrSize, setQrSize] = useState(250);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const generateQRCode = () => {
    if (!text.trim()) {
      alert("Please enter text or URL");
      return;
    }
    
    setLoading(true);
    // Using a reliable public API for QR generation
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(text)}&margin=10&color=000000&bgcolor=ffffff`;
    
    // Preload image to show loading state
    const img = new Image();
    img.onload = () => {
      setQrCodeUrl(url);
      setLoading(false);
    };
    img.src = url;
  };

  const downloadQRCode = async () => {
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qrcode-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading QR code:', error);
      alert('Failed to download image. Try right-clicking and "Save Image As".');
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
        >
          <motion.div
            className="calculator-modal"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '450px' }}
          >
            <div className="modal-header">
              <h3>QR Generator</h3>
              <button className="close-btn" onClick={onClose}>&times;</button>
            </div>

            <div className="calculator-content">
              {/* Input Section */}
              <div className="input-group">
                <label className="input-label" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                  Enter Text or URL
                </label>
                <input 
                  type="text" 
                  placeholder="https://example.com" 
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="text-input"
                />
              </div>

              <button 
                className="convert-btn full-width" 
                onClick={generateQRCode}
                disabled={loading || !text}
                style={{ width: '100%', marginBottom: '1.5rem' }}
              >
                {loading ? 'Generating...' : 'Generate QR Code'}
              </button>

              {/* Result Section */}
              {qrCodeUrl && (
                <motion.div 
                  className="qr-result-container"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="qr-image-wrapper">
                    <img src={qrCodeUrl} alt="Generated QR Code" />
                  </div>
                  
                  <button 
                    className="download-btn" 
                    onClick={downloadQRCode}
                  >
                    Download PNG 📥
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QRCodeGenerator;
