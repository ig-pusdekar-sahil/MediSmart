import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

function Extractor() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [medicineData, setMedicineData] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setMedicineData(null);
        setError(null);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setError('Please select an image file (PNG, JPG, JPEG)');
      }
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setMedicineData(null);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image file');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await axios.post(
        `${API_BASE_URL}/api/analyze-medicine`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setMedicineData(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Error processing image. Please try again.'
      );
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!medicineData) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/generate-pdf`,
        medicineData,
        {
          responseType: 'blob',
        }
      );

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `medicine_report_${new Date().getTime()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Error generating PDF. Please try again.');
      console.error('PDF generation error:', err);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setMedicineData(null);
    setError(null);
  };

  return (
    <div className="App">
      <div className="container">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <header className="header">
          <h1 className="title">
            <span className="icon">💊</span>
            Medicine Information Extractor
          </h1>
          <p className="subtitle">
            Upload an image of a medicine strip, bottle, or package to get detailed chemical profiles and clinical recommendations
          </p>
        </header>

        {error && (
          <div className="error-message global-error shake" style={{ marginBottom: '20px' }}>
            ⚠️ {error}
          </div>
        )}

        <div className="main-content extractor-container">
          {!medicineData ? (
            <div className="upload-section">
              <div className="upload-card-deck">
                <div 
                  className={`upload-area-glass ${isDragging ? 'dragging' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {preview ? (
                    <div className="preview-container-box">
                      <img src={preview} alt="Preview" className="preview-image-framed" />
                      <button className="change-image-btn-pill" onClick={() => {
                        setSelectedFile(null);
                        setPreview(null);
                      }}>
                        🔄 Choose Another Image
                      </button>
                    </div>
                  ) : (
                    <label htmlFor="file-input" className="upload-label-interactive">
                      <div className="upload-icon-bounce">📷</div>
                      <p className="upload-text-large">
                        Click to upload or drag & drop image
                      </p>
                      <p className="upload-hint-pill">
                        Supports PNG, JPG, JPEG up to 10MB
                      </p>
                      <input
                        id="file-input"
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="file-input"
                      />
                    </label>
                  )}
                </div>

                <button
                  className="analyze-btn-gradient"
                  onClick={handleUpload}
                  disabled={!selectedFile || loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Decoding medicine label...
                    </>
                  ) : (
                    '🔍 Start Extraction Analysis'
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="results-section-premium">
              <div className="results-header-bar">
                <h2>Extracted Medicine Information</h2>
                <div className="action-buttons-flex">
                  <button className="download-btn-gradient" onClick={handleDownloadPDF}>
                    📥 Save PDF Report
                  </button>
                  <button className="reset-btn-pill" onClick={handleReset}>
                    🔄 Analyze Another Strip
                  </button>
                </div>
              </div>

              <div className="medicine-info-deck">
                <div className="info-card-hero slide-in">
                  <div className="hero-card-icon">💊</div>
                  <div className="hero-card-content">
                    <span className="hero-card-meta">COMMERCIAL BRAND / STRENGTH</span>
                    <h3 className="medicine-name-hero">
                      {medicineData.medicine_info.medicine_name}
                    </h3>
                  </div>
                </div>

                <div className="info-grid-cards slide-up">
                  <div className="info-card-glass active-ingredients-card">
                    <h3>📋 Active Ingredients</h3>
                    <ul>
                      {medicineData.medicine_info.active_ingredients?.map((ing, idx) => (
                        <li key={idx}>{ing}</li>
                      )) || <li>No active ingredients found</li>}
                    </ul>
                  </div>

                  <div className="info-card-glass uses-card">
                    <h3>🏥 Medical Uses</h3>
                    <ul>
                      {medicineData.medicine_info.uses?.map((use, idx) => (
                        <li key={idx}>{use}</li>
                      )) || <li>No medical uses found</li>}
                    </ul>
                  </div>

                  <div className="info-card-glass side-effects-card">
                    <h3>⚠️ Side Effects</h3>
                    <ul>
                      {medicineData.medicine_info.side_effects?.map((effect, idx) => (
                        <li key={idx}>{effect}</li>
                      )) || <li>No side effects listed</li>}
                    </ul>
                  </div>

                  <div className="info-card-glass age-recommendation-card">
                    <h3>👥 Age Recommendation</h3>
                    <p>{medicineData.medicine_info.age_recommendation}</p>
                  </div>

                  <div className="info-card-glass dosage-card">
                    <h3>💉 Dosage & Frequency</h3>
                    <p>{medicineData.medicine_info.dosage}</p>
                  </div>

                  {medicineData.medicine_info.warnings &&
                    medicineData.medicine_info.warnings.length > 0 && (
                      <div className="info-card-glass warnings-card alerts">
                        <h3>🚨 Warnings & Precautions</h3>
                        <ul>
                          {medicineData.medicine_info.warnings.map((warning, idx) => (
                            <li key={idx}>{warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                  {medicineData.medicine_info.storage && (
                    <div className="info-card-glass storage-card">
                      <h3>📦 Storage Instructions</h3>
                      <p>{medicineData.medicine_info.storage}</p>
                    </div>
                  )}

                  {medicineData.medicine_info.manufacturer && (
                    <div className="info-card-glass manufacturer-card">
                      <h3>🏭 Manufacturer</h3>
                      <p>{medicineData.medicine_info.manufacturer}</p>
                    </div>
                  )}

                  {(medicineData.medicine_info.batch_number || medicineData.medicine_info.expiry_date) && (
                    <div className="info-card-glass dates-card">
                      <h3>📅 Batch & Expiry</h3>
                      {medicineData.medicine_info.batch_number && (
                        <p><strong>Batch:</strong> {medicineData.medicine_info.batch_number}</p>
                      )}
                      {medicineData.medicine_info.expiry_date && (
                        <p><strong>Expiry:</strong> {medicineData.medicine_info.expiry_date}</p>
                      )}
                    </div>
                  )}
                </div>

                {preview && (
                  <div className="preview-section-card slide-up">
                    <h3>Uploaded Reference Image</h3>
                    <div className="result-image-frame">
                      <img src={preview} alt="Medicine" className="result-image-display" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <footer className="footer">
          <p>⚠️ This information is for educational purposes only. Always consult with a healthcare professional before taking any medication.</p>
        </footer>
      </div>
    </div>
  );
}

export default Extractor;

