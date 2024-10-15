import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import { useFunnelContext } from './FunnelContext';
import diamondImage from '../misc/diamond.jpg';
import { FaUpload, FaCamera, FaTimes } from 'react-icons/fa';

const LandingPage: React.FC = () => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { uploadedImages, setUploadedImages } = useFunnelContext();

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const resizedImage = await resizeImage(file);
          newImages.push(resizedImage);
        } catch (error) {
          console.error('Error processing image:', error);
        }
      }
      setSelectedImages(prevImages => [...prevImages, ...newImages]);
      setUploadedImages([...uploadedImages, ...newImages]);
    }
  };

  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          const maxWidth = 800;
          const maxHeight = 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  const handleContinueClick = () => {
    if (selectedImages.length > 0) {
      navigate('/funnel');
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index));
    setUploadedImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  return (
    <div className="landing-page" dir="rtl">
      <div className="diamond-container">
        <img src={diamondImage} alt="Diamond" className="diamond-image" />
      </div>
      <header>
        <div className="logo">Gold & Gem</div>
        <nav>
          <a href="#features">תכונות</a>
          <a href="#about">אודות</a>
        </nav>
      </header>
      <main>
        <div className="hero">
          <h1>בתכלס, היא כבר בחרה את התכשיט שהיא רוצה. תן לנו למצוא אותו בשבילך.</h1>
          <p>Gold & Gem כאן כדי לחסוך לך זמן וכאב ראש. שתף איתנו תמונות של התכשיט שהיא בחרה, ותן לאפליקציה מבוססת ה AI שלנו למצוא לך אותו ברבע מהזמן שלוקח לך להגיע לבורסה ברמת גן.</p>
          <div className="cta-buttons">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              style={{ display: 'none' }}
              multiple
            />
            <button className="icon-btn upload-btn" onClick={handleUploadClick} aria-label="העלאת תמונות">
              <FaUpload />
            </button>
            
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageChange}
              ref={cameraInputRef}
              style={{ display: 'none' }}
              multiple
            />
            <button className="icon-btn camera-btn" onClick={handleCameraClick} aria-label="צילום תמונה">
              <FaCamera />
            </button>
          </div>
        </div>
        {selectedImages.length > 0 && (
          <div className="image-preview">
            {selectedImages.map((image, index) => (
              <div key={index} className="image-preview-item">
                <img src={image} alt={`Preview ${index + 1}`} />
                <button className="remove-image" onClick={() => handleRemoveImage(index)}>
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
      {selectedImages.length > 0 && (
        <button className="continue-button" onClick={handleContinueClick}>
          קדימה לעבודה!
        </button>
      )}
    </div>
  );
};

export default LandingPage;