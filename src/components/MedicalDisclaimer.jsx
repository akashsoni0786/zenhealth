import React from 'react';
import { Alert, Typography } from 'antd';
import { ShieldAlert } from 'lucide-react';

const { Text } = Typography;

const MedicalDisclaimer = ({ style = {} }) => {
  return (
    <Alert
      className="medical-disclaimer"
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldAlert size={16} />
          <Text strong>Medical Disclaimer</Text>
        </div>
      }
      description={
        <Text style={{ fontSize: '12px' }}>
          This application is for educational and informational purposes only and does not constitute medical advice, diagnosis, or treatment. 
          Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. 
          Never disregard professional medical advice or delay in seeking it because of something you have read in this app.
        </Text>
      }
      type="warning"
      showIcon={false}
      style={{ borderRadius: '12px', ...style }}
    />
  );
};

export default MedicalDisclaimer;
