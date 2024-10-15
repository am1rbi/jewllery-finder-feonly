import React from 'react';
import { useLocation } from 'react-router-dom';
import { FunnelData } from './FunnelContext';

const SuccessPage: React.FC = () => {
  const location = useLocation();
  const funnelData = location.state?.funnelData as FunnelData;

  const formatBudget = (value: number) => {
    return `₪${value.toLocaleString('he-IL')}`;
  };

  const getDueDateText = (dueDate: string, specificDate: string) => {
    switch (dueDate) {
      case 'now':
        return 'מיידי';
      case 'week':
        return 'תוך שבוע';
      case 'month':
        return 'תוך חודש';
      case 'specific':
        return `בתאריך ${specificDate}`;
      default:
        return 'לא צוין';
    }
  };

  if (!funnelData) {
    return <div>No data available. Please go through the funnel process.</div>;
  }

  return (
    <div className="funnel-page">
      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress" style={{ width: '100%' }}></div>
        </div>
      </div>

      <div className="funnel-content success-content">
        <div className="success-icon">✅</div>
        <h1>תודה רבה!</h1>
        <p>קיבלנו את כל המידע הדרוש ונתחיל לחפש את התכשיט המושלם עבורך.</p>
        <p>נחזור אליך בהקדם עם תוצאות החיפוש.</p>

        <div className="summary">
          <h2>סיכום הפרטים שמסרת:</h2>
          <p><strong>שם מלא:</strong> {`${funnelData.firstName} ${funnelData.lastName}`}</p>
          <p><strong>מספר טלפון:</strong> {funnelData.phoneNumber}</p>
          <p><strong>טווח תקציב:</strong> {formatBudget(funnelData.lowerBound)} - {formatBudget(funnelData.upperBound)}</p>
          <p><strong>מועד רצוי:</strong> {getDueDateText(funnelData.dueDate, funnelData.specificDate)}</p>
          {funnelData.uploadedImages.length > 0 && (
            <div>
              <p><strong>תמונות שהועלו:</strong></p>
              <div className="uploaded-images-grid">
                {funnelData.uploadedImages.map((image, index) => (
                  <img key={index} src={image} alt={`תכשיט שהועלה ${index + 1}`} className="uploaded-image" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;