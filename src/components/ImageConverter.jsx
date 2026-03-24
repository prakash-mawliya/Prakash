import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const ImageConverter = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [format, setFormat] = useState('image/jpeg');
  const [isConverting, setIsConverting] = useState(false);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const openedAtRef = useRef(0);

  useEffect(() => {
    if (isOpen) {
      openedAtRef.current = Date.now();
    }
  }, [isOpen]);

  const handleOverlayClose = () => {
    // 500ms debounce to prevent mobile "ghost clicks"
    if (Date.now() - openedAtRef.current < 500) return;
    onClose();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file within supported formats.');
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

  const clearSelection = (e) => {
    if(e) e.stopPropagation();
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
          onClick={handleOverlayClose}
          style={{ zIndex: 10000 }} // Make sure it sits on top
        >
          <motion.div
            className="calculator-modal"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            style={{ 
              maxWidth: '650px', 
              background: 'var(--card-bg)', 
              color: 'var(--text-main)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div className="modal-header" style={{ background: 'transparent', borderBottom: 'none', padding: '1.5rem 2rem 0' }}>
               <h2 style={{ width: '100%', textAlign: 'center', fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-main)', margin: 0 }}>
                Aesthetic Image Converter
               </h2>
               <button className="close-btn" style={{ color: 'var(--text-muted)', position: 'absolute', right: '1.5rem', top: '1.5rem' }} onClick={onClose}>&times;</button>
            </div>

            <div className="calculator-content" style={{ padding: '1.5rem 2rem 2rem' }}>
              <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {!selectedFile ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="upload-zone"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: '2px dashed var(--border)',
                      borderRadius: '1rem',
                      padding: '4rem 2rem',
                      textAlign: 'center',
                      background: 'var(--input-bg)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--primary)';
                      e.currentTarget.style.background = 'var(--card-bg)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.background = 'var(--input-bg)';
                    }}
                  >
                    <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '0.5rem' }}>🖼️</span>
                    <p style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: '500' }}>Drag & Drop an image here</p>
                    <p style={{ margin: 0, color: 'var(--text-muted)' }}>or click to browse</p>
                    
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                    />
                    <p style={{ margin: '1rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)', background: 'var(--card-bg)', padding: '0.25rem 0.75rem', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                      Supports JPG, PNG, WebP
                    </p>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="preview-container" 
                    style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                  >
                    <div style={{ 
                      position: 'relative', 
                      borderRadius: '1rem', 
                      overflow: 'hidden', 
                      border: '1px solid var(--border)', 
                      background: 'var(--input-bg)', 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      maxHeight: '350px',
                      padding: '1rem'
                    }}>
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} 
                      />
                      <motion.button 
                        onClick={clearSelection}
                        whileHover={{ scale: 1.1, backgroundColor: '#ef4444' }}
                        whileTap={{ scale: 0.9 }}
                        style={{ 
                          position: 'absolute', 
                          top: '1rem', 
                          right: '1rem', 
                          background: 'rgba(15, 23, 42, 0.6)', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '50%', 
                          width: '2.2rem', 
                          height: '2.2rem', 
                          cursor: 'pointer', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontSize: '1.2rem',
                          backdropFilter: 'blur(4px)'
                        }}
                      >
                        &times;
                      </motion.button>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                      <div style={{ flex: '1', minWidth: '150px' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-main)' }}>Convert to Format:</label>
                        <select
                          value={format}
                          onChange={(e) => setFormat(e.target.value)}
                          style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border)', outline: 'none', fontSize: '1.05rem', background: 'var(--input-bg)', color: 'var(--text-main)', cursor: 'pointer', appearance: 'auto' }}
                        >
                          <option value="image/jpeg">JPG / JPEG</option>
                          <option value="image/png">PNG</option>
                          <option value="image/webp">WebP</option>
                        </select>
                      </div>

                      <motion.button
                        onClick={convertImage}
                        disabled={isConverting}
                        whileHover={!isConverting ? { scale: 1.02, backgroundColor: '#4f46e5' } : {}}
                        whileTap={!isConverting ? { scale: 0.98 } : {}}
                        style={{ 
                          flex: '2', 
                          minWidth: '200px', 
                          padding: '0.75rem 1.5rem', 
                          background: isConverting ? '#94a3b8' : '#6366f1', 
                          color: 'white', 
                          fontWeight: 'bold', 
                          borderRadius: '0.5rem', 
                          border: 'none', 
                          cursor: isConverting ? 'not-allowed' : 'pointer', 
                          fontSize: '1.1rem', 
                          boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.2)', 
                          transition: 'all 0.2s',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: '3.1rem' // matching select input height
                        }}
                      >
                        {isConverting ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ width: '16px', height: '16px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%' }} />
                            Processing...
                          </span>
                        ) : 'Download Image'}
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Hidden Canvas for processing */}
                <canvas ref={canvasRef} style={{ display: 'none' }} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageConverter;
