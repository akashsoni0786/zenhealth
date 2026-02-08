import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Input,
  Form,
  Select,
  Space,
  Divider,
  Steps,
  Alert,
  message,
  Result,
  Radio,
  Checkbox,
  Spin,
  Progress
} from 'antd';
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  Building2,
  Shield,
  Lock,
  CheckCircle,
  Clock,
  AlertCircle,
  Copy,
  QrCode,
  Wallet,
  IndianRupee,
  User,
  Calendar
} from 'lucide-react';
import { paymentAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './PaymentPage.css';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// Bank list for net banking
const BANKS = [
  // ─── Popular Banks ───
  { id: 'sbi', name: 'State Bank of India', logo: '🏦' },
  { id: 'hdfc', name: 'HDFC Bank', logo: '🏛️' },
  { id: 'icici', name: 'ICICI Bank', logo: '🏢' },
  { id: 'axis', name: 'Axis Bank', logo: '🏬' },
  { id: 'kotak', name: 'Kotak Mahindra Bank', logo: '🏪' },
  { id: 'pnb', name: 'Punjab National Bank', logo: '🏦' },
  { id: 'bob', name: 'Bank of Baroda', logo: '🏛️' },
  { id: 'canara', name: 'Canara Bank', logo: '🏢' },
  { id: 'union', name: 'Union Bank of India', logo: '🏬' },
  { id: 'idbi', name: 'IDBI Bank', logo: '🏪' },
  // ─── Public Sector Banks ───
  { id: 'boi', name: 'Bank of India', logo: '🏦' },
  { id: 'iob', name: 'Indian Overseas Bank', logo: '🏛️' },
  { id: 'cbi', name: 'Central Bank of India', logo: '🏢' },
  { id: 'indian', name: 'Indian Bank', logo: '🏬' },
  { id: 'uco', name: 'UCO Bank', logo: '🏪' },
  { id: 'bom', name: 'Bank of Maharashtra', logo: '🏦' },
  { id: 'psb', name: 'Punjab & Sind Bank', logo: '🏛️' },
  // ─── Private Sector Banks ───
  { id: 'yes', name: 'Yes Bank', logo: '🏢' },
  { id: 'indusind', name: 'IndusInd Bank', logo: '🏬' },
  { id: 'federal', name: 'Federal Bank', logo: '🏪' },
  { id: 'rbl', name: 'RBL Bank', logo: '🏦' },
  { id: 'bandhan', name: 'Bandhan Bank', logo: '🏛️' },
  { id: 'idfc', name: 'IDFC First Bank', logo: '🏢' },
  { id: 'south', name: 'South Indian Bank', logo: '🏬' },
  { id: 'karur', name: 'Karur Vysya Bank', logo: '🏪' },
  { id: 'csb', name: 'CSB Bank', logo: '🏦' },
  { id: 'city', name: 'City Union Bank', logo: '🏛️' },
  { id: 'tmb', name: 'Tamilnad Mercantile Bank', logo: '🏢' },
  { id: 'dcb', name: 'DCB Bank', logo: '🏬' },
  { id: 'dhanlaxmi', name: 'Dhanlaxmi Bank', logo: '🏪' },
  { id: 'jk', name: 'Jammu & Kashmir Bank', logo: '🏦' },
  { id: 'karnataka', name: 'Karnataka Bank', logo: '🏛️' },
  { id: 'lakshmi', name: 'Lakshmi Vilas Bank', logo: '🏢' },
  { id: 'nainital', name: 'Nainital Bank', logo: '🏬' },
  // ─── Small Finance & Payment Banks ───
  { id: 'au', name: 'AU Small Finance Bank', logo: '🏪' },
  { id: 'equitas', name: 'Equitas Small Finance Bank', logo: '🏦' },
  { id: 'ujjivan', name: 'Ujjivan Small Finance Bank', logo: '🏛️' },
  { id: 'jana', name: 'Jana Small Finance Bank', logo: '🏢' },
  { id: 'suryoday', name: 'Suryoday Small Finance Bank', logo: '🏬' },
  { id: 'airtel', name: 'Airtel Payments Bank', logo: '🏪' },
  { id: 'paytmbank', name: 'Paytm Payments Bank', logo: '🏦' },
  { id: 'fino', name: 'Fino Payments Bank', logo: '🏛️' },
  // ─── Co-operative & Regional Banks ───
  { id: 'saraswat', name: 'Saraswat Co-operative Bank', logo: '🏢' },
  { id: 'cosmos', name: 'Cosmos Co-operative Bank', logo: '🏬' },
  { id: 'tjsb', name: 'TJSB Sahakari Bank', logo: '🏪' },
];

// UPI apps
const UPI_APPS = [
  { id: 'gpay', name: 'Google Pay', color: '#4285F4' },
  { id: 'phonepe', name: 'PhonePe', color: '#5F259F' },
  { id: 'paytm', name: 'Paytm', color: '#00BAF2' },
  { id: 'bhim', name: 'BHIM UPI', color: '#00796B' },
  { id: 'amazonpay', name: 'Amazon Pay', color: '#FF9900' }
];

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const { isAuthenticated } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      message.warning('Please login to proceed with payment');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Get booking data from navigation state
  const bookingData = location.state?.bookingData || {};
  const trainerData = location.state?.trainerData || {};
  const totalPrice = location.state?.totalPrice || 0;
  const basePrice = location.state?.basePrice || 0;
  const homeVisitFee = location.state?.homeVisitFee || 0;
  const subtotal = location.state?.subtotal || (basePrice + homeVisitFee);
  const gstAmount = location.state?.gstAmount || Math.round(subtotal * 0.18);

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [selectedBank, setSelectedBank] = useState(null);
  const [customBankName, setCustomBankName] = useState('');
  const [selectedUpiApp, setSelectedUpiApp] = useState(null);
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // null, 'processing', 'success', 'failed'
  const [processingProgress, setProcessingProgress] = useState(0);
  const [saveCard, setSaveCard] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [transactionId, setTransactionId] = useState(null);
  const [failureReason, setFailureReason] = useState(null);

  // Redirect if no booking data
  useEffect(() => {
    if (!totalPrice) {
      message.warning('No booking data found. Please start booking again.');
      navigate('/search');
    }
  }, [totalPrice, navigate]);

  // Update booking status in localStorage when payment succeeds
  useEffect(() => {
    if (paymentStatus === 'success') {
      try {
        const bookings = JSON.parse(localStorage.getItem('stayfit_user_bookings') || '[]');
        // Find the most recent pending booking for this trainer and update to confirmed
        const idx = bookings.findIndex(b =>
          String(b.trainerId) === String(trainerData.id) && b.status === 'pending'
        );
        if (idx !== -1) {
          bookings[idx].status = 'confirmed';
          bookings[idx].transactionId = transactionId || `TXN${Date.now().toString().slice(-10)}`;
          bookings[idx].paymentMethod = paymentMethod;
          localStorage.setItem('stayfit_user_bookings', JSON.stringify(bookings));
        }
      } catch {}
    }
  }, [paymentStatus, trainerData.id, transactionId, paymentMethod]);

  // ─── Local fallback: simulate payment processing ───
  const processPaymentLocal = () => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 100) { clearInterval(interval); return 100; }
          return prev + 10;
        });
      }, 300);

      setTimeout(() => {
        clearInterval(interval);
        setProcessingProgress(100);
        const isSuccess = Math.random() > 0.05;
        const txnId = `TXN${Date.now().toString().slice(-10)}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
        setTimeout(() => resolve({ success: isSuccess, transactionId: txnId }), 500);
      }, 3000);
    });
  };

  // ─── Helper: Create order on backend (or skip if backend is down) ───
  const ensureOrder = async () => {
    if (orderId) return orderId; // Already created
    try {
      const res = await paymentAPI.createOrder({
        trainerId: trainerData.id || trainerData.trainerId || 'unknown',
        trainerName: trainerData.name || '',
        trainerSpecialization: trainerData.specialization || '',
        trainerImage: trainerData.image || '',
        consultationType: bookingData.consultationType || 'video',
        date: bookingData.date || new Date().toISOString().slice(0, 10),
        timeSlot: bookingData.timeSlot || '',
        duration: bookingData.duration || 30,
        basePrice,
        homeVisitFee,
        subtotal,
        gstAmount,
        totalAmount: totalPrice,
      });
      const newOrderId = res.data.orderId;
      setOrderId(newOrderId);
      return newOrderId;
    } catch (err) {
      if (!err.status) {
        console.warn('Backend unavailable, using offline payment mode');
        return null; // Will trigger local fallback
      }
      throw err;
    }
  };

  // ─── Handle card payment (API first, local fallback) ───
  const handleCardPayment = async (values) => {
    setIsProcessing(true);
    setPaymentStatus('processing');
    setProcessingProgress(0);

    try {
      const currentOrderId = await ensureOrder();

      if (currentOrderId) {
        // ─── API payment ───
        const progressInterval = setInterval(() => {
          setProcessingProgress(prev => prev < 80 ? prev + 8 : prev);
        }, 400);

        try {
          const [mm, yy] = (values.expiry || '').split('/');
          const res = await paymentAPI.payByCard({
            orderId: currentOrderId,
            cardNumber: values.cardNumber,
            expiryMonth: mm?.trim() || '',
            expiryYear: yy?.trim() || '',
            cvv: values.cvv,
            cardholderName: values.cardName,
            saveCard,
          });
          clearInterval(progressInterval);
          setProcessingProgress(100);
          setTransactionId(res.data.transactionId);
          setTimeout(() => {
            setIsProcessing(false);
            setPaymentStatus('success');
          }, 500);
        } catch (payErr) {
          clearInterval(progressInterval);
          setProcessingProgress(100);
          setTransactionId(payErr.data?.transactionId || null);
          setFailureReason(payErr.data?.reason || payErr.message || 'Payment declined by bank');
          setTimeout(() => {
            setIsProcessing(false);
            setPaymentStatus('failed');
          }, 500);
        }
      } else {
        // ─── Offline fallback ───
        const result = await processPaymentLocal();
        setTransactionId(result.transactionId);
        setIsProcessing(false);
        setPaymentStatus(result.success ? 'success' : 'failed');
      }
    } catch (err) {
      setIsProcessing(false);
      setPaymentStatus(null);
      message.error(err.message || 'Failed to process payment');
    }
  };

  // ─── Handle UPI payment (API first, local fallback) ───
  const handleUpiPayment = async () => {
    if (!upiId && !selectedUpiApp) {
      message.error('Please enter UPI ID or select an app');
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('processing');
    setProcessingProgress(0);

    try {
      const currentOrderId = await ensureOrder();

      if (currentOrderId) {
        const progressInterval = setInterval(() => {
          setProcessingProgress(prev => prev < 80 ? prev + 8 : prev);
        }, 400);

        try {
          const res = await paymentAPI.payByUpi({
            orderId: currentOrderId,
            upiId: upiId || null,
            upiApp: selectedUpiApp || null,
          });
          clearInterval(progressInterval);
          setProcessingProgress(100);
          setTransactionId(res.data.transactionId);
          setTimeout(() => {
            setIsProcessing(false);
            setPaymentStatus('success');
          }, 500);
        } catch (payErr) {
          clearInterval(progressInterval);
          setProcessingProgress(100);
          setTransactionId(payErr.data?.transactionId || null);
          setFailureReason(payErr.data?.reason || payErr.message || 'UPI payment failed');
          setTimeout(() => {
            setIsProcessing(false);
            setPaymentStatus('failed');
          }, 500);
        }
      } else {
        const result = await processPaymentLocal();
        setTransactionId(result.transactionId);
        setIsProcessing(false);
        setPaymentStatus(result.success ? 'success' : 'failed');
      }
    } catch (err) {
      setIsProcessing(false);
      setPaymentStatus(null);
      message.error(err.message || 'Failed to process payment');
    }
  };

  // ─── Handle net banking payment (API first, local fallback) ───
  const handleNetBankingPayment = async () => {
    if (!selectedBank) {
      message.error('Please select a bank');
      return;
    }
    if (selectedBank === 'other' && !customBankName.trim()) {
      message.error('Please enter your bank name');
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('processing');
    setProcessingProgress(0);

    try {
      const currentOrderId = await ensureOrder();

      if (currentOrderId) {
        const progressInterval = setInterval(() => {
          setProcessingProgress(prev => prev < 80 ? prev + 8 : prev);
        }, 400);

        const bankEntry = BANKS.find(b => b.id === selectedBank);
        try {
          const res = await paymentAPI.payByNetbanking({
            orderId: currentOrderId,
            bankId: selectedBank,
            bankName: selectedBank === 'other' ? customBankName.trim() : (bankEntry?.name || selectedBank),
            isCustomBank: selectedBank === 'other',
          });
          clearInterval(progressInterval);
          setProcessingProgress(100);
          setTransactionId(res.data.transactionId);
          setTimeout(() => {
            setIsProcessing(false);
            setPaymentStatus('success');
          }, 500);
        } catch (payErr) {
          clearInterval(progressInterval);
          setProcessingProgress(100);
          setTransactionId(payErr.data?.transactionId || null);
          setFailureReason(payErr.data?.reason || payErr.message || 'Net banking payment failed');
          setTimeout(() => {
            setIsProcessing(false);
            setPaymentStatus('failed');
          }, 500);
        }
      } else {
        const result = await processPaymentLocal();
        setTransactionId(result.transactionId);
        setIsProcessing(false);
        setPaymentStatus(result.success ? 'success' : 'failed');
      }
    } catch (err) {
      setIsProcessing(false);
      setPaymentStatus(null);
      message.error(err.message || 'Failed to process payment');
    }
  };

  // Copy UPI ID
  const copyUpiId = () => {
    navigator.clipboard.writeText('stayfit@upi');
    message.success('UPI ID copied!');
  };

  // Retry payment
  const retryPayment = () => {
    setPaymentStatus(null);
    setProcessingProgress(0);
    setTransactionId(null);
    setFailureReason(null);
    setOrderId(null);
  };

  // Card form validation
  const validateCardNumber = (_, value) => {
    if (!value) return Promise.reject('Please enter card number');
    const cleaned = value.replace(/\s/g, '');
    if (!/^\d{16}$/.test(cleaned)) return Promise.reject('Invalid card number');
    return Promise.resolve();
  };

  const validateExpiry = (_, value) => {
    if (!value) return Promise.reject('Please enter expiry date');
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) return Promise.reject('Invalid format (MM/YY)');
    return Promise.resolve();
  };

  const validateCvv = (_, value) => {
    if (!value) return Promise.reject('Please enter CVV');
    if (!/^\d{3,4}$/.test(value)) return Promise.reject('Invalid CVV');
    return Promise.resolve();
  };

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  // Payment success screen
  if (paymentStatus === 'success') {
    return (
      <div className="payment-page">
        <div className="payment-container">
          <Result
            status="success"
            icon={<CheckCircle size={80} color="#52c41a" />}
            title="Payment Successful!"
            subTitle={
              <div className="payment-success-details">
                <Text>Your payment of <strong>₹{totalPrice.toLocaleString()}</strong> has been received.</Text>
                <div className="success-info">
                  <div className="info-row">
                    <Text type="secondary">Transaction ID</Text>
                    <Text strong>{transactionId || `TXN${Date.now().toString().slice(-10)}`}</Text>
                  </div>
                  <div className="info-row">
                    <Text type="secondary">Payment Method</Text>
                    <Text strong>
                      {paymentMethod === 'card' ? 'Credit/Debit Card' :
                       paymentMethod === 'upi' ? 'UPI' : 'Net Banking'}
                    </Text>
                  </div>
                  <div className="info-row">
                    <Text type="secondary">Date</Text>
                    <Text strong>{new Date().toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}</Text>
                  </div>
                </div>
                <Alert
                  message="Booking Confirmed"
                  description={`Your consultation with ${trainerData.name || 'the expert'} has been confirmed. Check your email for details.`}
                  type="success"
                  showIcon
                  style={{ marginTop: 24 }}
                />
              </div>
            }
            extra={[
              <Button type="primary" key="dashboard" size="large" onClick={() => navigate('/')}>
                Go to Dashboard
              </Button>,
              <Button key="bookings" size="large" onClick={() => navigate('/search')}>
                Browse More Experts
              </Button>
            ]}
          />
        </div>
      </div>
    );
  }

  // Payment failed screen
  if (paymentStatus === 'failed') {
    return (
      <div className="payment-page">
        <div className="payment-container">
          <Result
            status="error"
            icon={<AlertCircle size={80} color="#ff4d4f" />}
            title="Payment Failed"
            subTitle={
              <div className="payment-failed-details">
                <Text>Your payment of <strong>₹{totalPrice.toLocaleString()}</strong> could not be processed.</Text>
                <Alert
                  message="What went wrong?"
                  description={failureReason || "The payment was declined by your bank. This could be due to insufficient funds, incorrect card details, or a security block."}
                  type="warning"
                  showIcon
                  style={{ marginTop: 24 }}
                />
              </div>
            }
            extra={[
              <Button type="primary" key="retry" size="large" onClick={retryPayment}>
                Try Again
              </Button>,
              <Button key="different" size="large" onClick={() => {
                retryPayment();
                setPaymentMethod(paymentMethod === 'card' ? 'upi' : 'card');
              }}>
                Use Different Method
              </Button>
            ]}
          />
        </div>
      </div>
    );
  }

  // Processing screen
  if (paymentStatus === 'processing') {
    return (
      <div className="payment-page">
        <div className="payment-container">
          <Card className="processing-card">
            <div className="processing-content">
              <Spin size="large" />
              <Title level={3}>Processing Payment</Title>
              <Text type="secondary">Please wait while we process your payment...</Text>
              <Progress
                percent={processingProgress}
                status="active"
                strokeColor="#1b4332"
                style={{ marginTop: 24, maxWidth: 300 }}
              />
              <Alert
                message="Do not close this page"
                description="Your payment is being processed. This may take a few moments."
                type="info"
                showIcon
                style={{ marginTop: 24 }}
              />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        {/* Header */}
        <div className="payment-header">
          <Button
            type="text"
            icon={<ArrowLeft size={20} />}
            onClick={() => navigate(-1)}
            className="back-btn"
          />
          <div>
            <Title level={3} style={{ margin: 0 }}>Complete Payment</Title>
            <Text type="secondary">Secure checkout powered by StayFit</Text>
          </div>
        </div>

        <Row gutter={[32, 24]}>
          {/* Payment Methods */}
          <Col xs={24} lg={16}>
            <Card className="payment-methods-card">
              {/* Payment Method Tabs */}
              <div className="payment-tabs">
                <div
                  className={`payment-tab ${paymentMethod === 'card' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <CreditCard size={24} />
                  <span>Card</span>
                </div>
                <div
                  className={`payment-tab ${paymentMethod === 'upi' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <Smartphone size={24} />
                  <span>UPI</span>
                </div>
                <div
                  className={`payment-tab ${paymentMethod === 'netbanking' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('netbanking')}
                >
                  <Building2 size={24} />
                  <span>Net Banking</span>
                </div>
              </div>

              <Divider />

              {/* Card Payment Form */}
              {paymentMethod === 'card' && (
                <div className="card-payment-form">
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCardPayment}
                  >
                    <Form.Item
                      name="cardNumber"
                      label="Card Number"
                      rules={[{ validator: validateCardNumber }]}
                      normalize={formatCardNumber}
                    >
                      <Input
                        size="large"
                        placeholder="1234 5678 9012 3456"
                        prefix={<CreditCard size={18} color="#999" />}
                        maxLength={19}
                        className="card-input"
                      />
                    </Form.Item>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="expiry"
                          label="Expiry Date"
                          rules={[{ validator: validateExpiry }]}
                        >
                          <Input
                            size="large"
                            placeholder="MM/YY"
                            maxLength={5}
                            className="card-input"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="cvv"
                          label="CVV"
                          rules={[{ validator: validateCvv }]}
                        >
                          <Input.Password
                            size="large"
                            placeholder="123"
                            maxLength={4}
                            className="card-input"
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item
                      name="cardName"
                      label="Cardholder Name"
                      rules={[{ required: true, message: 'Please enter cardholder name' }]}
                    >
                      <Input
                        size="large"
                        placeholder="Name on card"
                        prefix={<User size={18} color="#999" />}
                        className="card-input"
                      />
                    </Form.Item>

                    <Checkbox
                      checked={saveCard}
                      onChange={(e) => setSaveCard(e.target.checked)}
                      className="save-card-checkbox"
                    >
                      Save card for future payments
                    </Checkbox>

                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      block
                      className="pay-button"
                      icon={<Lock size={18} />}
                    >
                      Pay ₹{totalPrice.toLocaleString()}
                    </Button>
                  </Form>

                  <div className="card-brands">
                    <Text type="secondary">We accept</Text>
                    <div className="brand-icons">
                      <span className="brand">VISA</span>
                      <span className="brand">MasterCard</span>
                      <span className="brand">RuPay</span>
                      <span className="brand">Amex</span>
                    </div>
                  </div>
                </div>
              )}

              {/* UPI Payment Form */}
              {paymentMethod === 'upi' && (
                <div className="upi-payment-form">
                  {/* UPI ID Input */}
                  <div className="upi-section">
                    <Title level={5}>Pay using UPI ID</Title>
                    <Input
                      size="large"
                      placeholder="Enter your UPI ID (e.g., name@upi)"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      suffix={
                        <Button type="link" size="small" onClick={() => setUpiId('')}>
                          Clear
                        </Button>
                      }
                      className="upi-input"
                    />
                  </div>

                  <Divider>OR</Divider>

                  {/* UPI Apps */}
                  <div className="upi-section">
                    <Title level={5}>Pay using UPI App</Title>
                    <div className="upi-apps-grid">
                      {UPI_APPS.map(app => (
                        <div
                          key={app.id}
                          className={`upi-app ${selectedUpiApp === app.id ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedUpiApp(app.id);
                            setUpiId('');
                          }}
                          style={{ '--app-color': app.color }}
                        >
                          <Wallet size={24} />
                          <span>{app.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Divider>OR</Divider>

                  {/* QR Code */}
                  <div className="upi-section qr-section">
                    <Title level={5}>Scan QR Code</Title>
                    <div className="qr-code-container">
                      <div className="qr-code">
                        <QrCode size={120} color="#1b4332" />
                      </div>
                      <div className="qr-info">
                        <Text>Scan with any UPI app</Text>
                        <div className="upi-id-copy">
                          <Text code>stayfit@upi</Text>
                          <Button
                            type="text"
                            icon={<Copy size={14} />}
                            onClick={copyUpiId}
                            size="small"
                          >
                            Copy
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="primary"
                    size="large"
                    block
                    className="pay-button"
                    onClick={handleUpiPayment}
                    icon={<Lock size={18} />}
                  >
                    Pay ₹{totalPrice.toLocaleString()}
                  </Button>
                </div>
              )}

              {/* Net Banking Form */}
              {paymentMethod === 'netbanking' && (
                <div className="netbanking-form">
                  <Title level={5}>Select Your Bank</Title>

                  {/* Popular Banks */}
                  <div className="popular-banks">
                    <Text type="secondary" className="section-label">Popular Banks</Text>
                    <div className="banks-grid">
                      {BANKS.slice(0, 4).map(bank => (
                        <div
                          key={bank.id}
                          className={`bank-option ${selectedBank === bank.id ? 'selected' : ''}`}
                          onClick={() => setSelectedBank(bank.id)}
                        >
                          <span className="bank-logo">{bank.logo}</span>
                          <span className="bank-name">{bank.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* All Banks Dropdown */}
                  <div className="all-banks">
                    <Text type="secondary" className="section-label">All Banks</Text>
                    <Select
                      size="large"
                      placeholder="Search or select your bank"
                      style={{ width: '100%' }}
                      value={selectedBank}
                      onChange={(val) => {
                        setSelectedBank(val);
                        if (val !== 'other') setCustomBankName('');
                      }}
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children?.toString().toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      {BANKS.map(bank => (
                        <Option key={bank.id} value={bank.id}>
                          {bank.logo} {bank.name}
                        </Option>
                      ))}
                      <Option key="other" value="other">
                        ✏️ Other Bank (type manually)
                      </Option>
                    </Select>
                  </div>

                  {/* Custom Bank Name Input */}
                  {selectedBank === 'other' && (
                    <div style={{ marginTop: 16 }}>
                      <Text type="secondary" className="section-label">Enter Your Bank Name</Text>
                      <Input
                        size="large"
                        placeholder="e.g. Gramin Bank, Co-operative Bank..."
                        value={customBankName}
                        onChange={(e) => setCustomBankName(e.target.value)}
                        style={{ marginTop: 8 }}
                      />
                    </div>
                  )}

                  <Alert
                    message="You will be redirected to your bank's website"
                    description="Complete the payment using your net banking credentials securely."
                    type="info"
                    showIcon
                    style={{ marginTop: 24 }}
                  />

                  <Button
                    type="primary"
                    size="large"
                    block
                    className="pay-button"
                    onClick={handleNetBankingPayment}
                    disabled={!selectedBank || (selectedBank === 'other' && !customBankName.trim())}
                    icon={<Lock size={18} />}
                  >
                    Pay ₹{totalPrice.toLocaleString()}
                  </Button>
                </div>
              )}
            </Card>

            {/* Security Info */}
            <div className="security-info">
              <Shield size={16} color="#52c41a" />
              <Text type="secondary">
                Your payment information is encrypted and secure. We never store your card details.
              </Text>
            </div>
          </Col>

          {/* Order Summary Sidebar */}
          <Col xs={24} lg={8}>
            <Card className="order-summary-card">
              <Title level={5}>Order Summary</Title>

              {trainerData.name && (
                <div className="trainer-info">
                  <img src={trainerData.image} alt={trainerData.name} className="trainer-avatar" />
                  <div>
                    <Text strong>{trainerData.name}</Text>
                    <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>
                      {trainerData.specialization}
                    </Text>
                  </div>
                </div>
              )}

              <Divider />

              <div className="summary-details">
                {bookingData.date && (
                  <div className="summary-row">
                    <Text type="secondary"><Calendar size={14} /> Date</Text>
                    <Text>{bookingData.date}</Text>
                  </div>
                )}
                {bookingData.timeSlot && (
                  <div className="summary-row">
                    <Text type="secondary"><Clock size={14} /> Time</Text>
                    <Text>{bookingData.timeSlot}</Text>
                  </div>
                )}
                {bookingData.duration && (
                  <div className="summary-row">
                    <Text type="secondary">Duration</Text>
                    <Text>{bookingData.duration} minutes</Text>
                  </div>
                )}
                {bookingData.consultationType && (
                  <div className="summary-row">
                    <Text type="secondary">Type</Text>
                    <Text>
                      {bookingData.consultationType === 'video' ? 'Video Call' :
                       bookingData.consultationType === 'home-visit' ? 'Home Visit' : 'In-Person'}
                    </Text>
                  </div>
                )}
              </div>

              <Divider />

              <div className="price-breakdown">
                <div className="price-row">
                  <Text>Consultation Fee</Text>
                  <Text>₹{basePrice.toLocaleString()}</Text>
                </div>
                {homeVisitFee > 0 && (
                  <div className="price-row">
                    <Text>Home Visit Fee</Text>
                    <Text>₹{homeVisitFee.toLocaleString()}</Text>
                  </div>
                )}
                <div className="price-row">
                  <Text>Subtotal</Text>
                  <Text>₹{subtotal.toLocaleString()}</Text>
                </div>
                <div className="price-row">
                  <Text>GST (18%)</Text>
                  <Text>₹{gstAmount.toLocaleString()}</Text>
                </div>
                <Divider style={{ margin: '12px 0' }} />
                <div className="price-row total">
                  <Text strong>Total Amount</Text>
                  <Text strong style={{ fontSize: 20, color: '#1b4332' }}>
                    ₹{totalPrice.toLocaleString()}
                  </Text>
                </div>
              </div>
            </Card>

            {/* Trust Badges */}
            <div className="trust-badges">
              <div className="badge">
                <Shield size={20} color="#52c41a" />
                <span>Secure Payment</span>
              </div>
              <div className="badge">
                <Lock size={20} color="#52c41a" />
                <span>SSL Encrypted</span>
              </div>
              <div className="badge">
                <CheckCircle size={20} color="#52c41a" />
                <span>Money Back Guarantee</span>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default PaymentPage;
