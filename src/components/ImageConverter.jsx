import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState } from 'react';

const ImageConverter = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [format, setFormat] = useState('image/jpeg');
  const [isConverting, setIsConverting] = useState(false);
  const canvasRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }
    
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    // Auto-select target format based on input
    if (file.type === 'image/webp') {
      setFormat('image/jpeg');
    } else if (file.type === 'image/jpeg' || file.type === 'image/png') {
      setFormat('image/webp');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const convertImage = () => {
    if (!selectedFile || !canvasRef.current) return;

    setIsConverting(true);
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      // Convert
      const convertedDataUrl = canvas.toDataURL(format, 0.9);
      
      // Download
      const link = document.createElement('a');
      link.download = `converted-image.${format.split('/')[1]}`;
      link.href = convertedDataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsConverting(false);
    };
    img.src = previewUrl;
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
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
            style={{ maxWidth: '600px' }}
          >
            <div className="modal-header">
              <h3>Image Converter</h3>
              <button className="close-btn" onClick={onClose}>&times;</button>
            </div>

            <div className="calculator-content">
              {!selectedFile ? (
                <div 
                  className="upload-zone"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                >
                  <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🖼️</span>
                  <p>Drag & Drop an image here or</p>
                  <label className="upload-btn-label">
                    Browse File
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      hidden 
                    />
                  </label>
                  <p className="hint-text">Supports JPG, PNG, WebP</p>
                </div>
              ) : (
                <div className="preview-container">
                  <div className="image-preview">
                    <img src={previewUrl} alt="Preview" />
                    <button className="remove-btn" onClick={clearSelection}>&times;</button>
                  </div>
                  
                  <div className="controls-row">
                    <div className="format-selector">
                      <label>Convert to:</label>
                      <select 
                        value={format} 
                        onChange={(e) => setFormat(e.target.value)}
                        className="custom-select"
                      >
                        <option value="image/jpeg">JPG / JPEG</option>
                        <option value="image/png">PNG</option>
                        <option value="image/webp">WebP</option>
                      </select>
                    </div>
                    
                    <button 
                      className="convert-btn" 
                      onClick={convertImage}
                      disabled={isConverting}
                    >
                      {isConverting ? 'Processing...' : 'Download Converted'}
                    </button>
                  </div>
                </div>
              )}
              
              {/* Hidden Canvas for processing */}
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageConverter;
