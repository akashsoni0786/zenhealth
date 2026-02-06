import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Avatar,
  Tag,
  Divider,
  Steps,
  DatePicker,
  TimePicker,
  Radio,
  Input,
  Form,
  Select,
  Space,
  Alert,
  message,
  Result
} from 'antd';
import {
  ArrowLeft,
  Star,
  Clock,
  Award,
  MapPin,
  Video,
  User,
  Calendar,
  CreditCard,
  CheckCircle,
  Shield,
  Phone,
  Mail,
  MessageSquare,
  Sparkles,
  IndianRupee,
  Home
} from 'lucide-react';
import { TRAINER_DATA, getCategoryColor, getCategoryLabel } from '../data/trainerData';
import './BookConsultationPage.css';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const BookConsultationPage = () => {
  const { trainerId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [currentStep, setCurrentStep] = useState(0);
  const [bookingData, setBookingData] = useState({
    consultationType: 'video',
    date: null,
    timeSlot: null,
    duration: 30,
    name: '',
    email: '',
    phone: '',
    concerns: '',
    paymentMethod: 'card'
  });
  const [isBookingComplete, setIsBookingComplete] = useState(false);
  const [form] = Form.useForm();

  // Get trainer data
  const trainer = useMemo(() => {
    const id = parseInt(trainerId);
    return TRAINER_DATA.find(t => t.id === id);
  }, [trainerId]);

  if (!trainer) {
    return (
      <div className="booking-page">
        <Result
          status="404"
          title="Expert Not Found"
          subTitle="Sorry, the expert you're looking for doesn't exist."
          extra={
            <Button type="primary" onClick={() => navigate('/search')}>
              Browse Experts
            </Button>
          }
        />
      </div>
    );
  }

  // Available time slots
  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
    '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM'
  ];

  // Duration options
  const durationOptions = [
    { value: 30, label: '30 minutes', price: trainer.price },
    { value: 45, label: '45 minutes', price: Math.round(trainer.price * 1.4) },
    { value: 60, label: '60 minutes', price: Math.round(trainer.price * 1.8) }
  ];

  // Calculate total price (home visit has additional travel fee)
  const selectedDuration = durationOptions.find(d => d.value === bookingData.duration);
  const basePrice = selectedDuration?.price || trainer.price;
  const homeVisitFee = bookingData.consultationType === 'home-visit' ? 500 : 0;
  const subtotal = basePrice + homeVisitFee;
  const gstAmount = Math.round(subtotal * 0.18); // 18% GST
  const totalPrice = subtotal + gstAmount;

  // Update booking data
  const updateBooking = (key, value) => {
    setBookingData(prev => ({ ...prev, [key]: value }));
  };

  // Handle next step
  const handleNext = () => {
    if (currentStep === 1) {
      form.validateFields().then(() => {
        setCurrentStep(currentStep + 1);
      }).catch(() => {});
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  // Handle previous step
  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  // Handle booking submission - Navigate to payment page
  const handleSubmitBooking = () => {
    navigate('/payment', {
      state: {
        bookingData: {
          ...bookingData,
          date: bookingData.date?.format('MMM D, YYYY'),
          name: bookingData.name,
          email: bookingData.email,
          phone: bookingData.phone
        },
        trainerData: {
          id: trainer.id,
          name: trainer.name,
          image: trainer.image,
          specialization: trainer.specialization,
          category: trainer.category
        },
        totalPrice,
        basePrice,
        homeVisitFee,
        subtotal,
        gstAmount
      }
    });
  };

  // Disable past dates
  const disabledDate = (current) => {
    return current && current < new Date().setHours(0, 0, 0, 0);
  };

  // Steps content
  const steps = [
    {
      title: 'Schedule',
      icon: <Calendar size={18} />
    },
    {
      title: 'Details',
      icon: <User size={18} />
    },
    {
      title: 'Payment',
      icon: <CreditCard size={18} />
    }
  ];

  // Booking complete screen
  if (isBookingComplete) {
    return (
      <div className="booking-page">
        <div className="booking-container">
          <Result
            status="success"
            icon={<CheckCircle size={80} color="#52c41a" />}
            title="Booking Confirmed!"
            subTitle={
              <div className="booking-success-details">
                <Text>Your consultation with <strong>{trainer.name}</strong> is confirmed.</Text>
                <div className="success-info">
                  <div className="info-item">
                    <Calendar size={16} />
                    <span>{bookingData.date?.format('dddd, MMMM D, YYYY')}</span>
                  </div>
                  <div className="info-item">
                    <Clock size={16} />
                    <span>{bookingData.timeSlot} ({bookingData.duration} mins)</span>
                  </div>
                  <div className="info-item">
                    {bookingData.consultationType === 'video' ? <Video size={16} /> :
                     bookingData.consultationType === 'home-visit' ? <Home size={16} /> : <MapPin size={16} />}
                    <span>
                      {bookingData.consultationType === 'video' ? 'Video Call' :
                       bookingData.consultationType === 'home-visit' ? 'Home Visit' : 'In-Person'}
                    </span>
                  </div>
                </div>
                <Alert
                  message="Confirmation email sent"
                  description={`We've sent the booking details to ${bookingData.email}`}
                  type="info"
                  showIcon
                  style={{ marginTop: 24 }}
                />
              </div>
            }
            extra={[
              <Button type="primary" key="dashboard" onClick={() => navigate('/')}>
                Go to Dashboard
              </Button>,
              <Button key="experts" onClick={() => navigate('/search')}>
                Browse More Experts
              </Button>
            ]}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="booking-container">
        {/* Header */}
        <div className="booking-header">
          <Button
            type="text"
            icon={<ArrowLeft size={20} />}
            onClick={() => navigate(-1)}
            className="back-btn"
          />
          <Title level={3} style={{ margin: 0 }}>Book Consultation</Title>
        </div>

        <Row gutter={[32, 24]}>
          {/* Main Content */}
          <Col xs={24} lg={16}>
            <Card className="booking-main-card">
              {/* Trainer Summary */}
              <div className="trainer-summary">
                <Avatar size={72} src={trainer.image} />
                <div className="trainer-summary-info">
                  <div className="name-row">
                    <Text strong className="trainer-name">{trainer.name}</Text>
                    {trainer.isTopRated && (
                      <Tag color="gold" className="top-rated-tag">
                        <Sparkles size={12} /> Top Rated
                      </Tag>
                    )}
                  </div>
                  <Tag color={getCategoryColor(trainer.category)}>
                    {getCategoryLabel(trainer.category)}
                  </Tag>
                  <div className="trainer-meta">
                    <span><Star size={14} fill="#faad14" color="#faad14" /> {trainer.rating}</span>
                    <span><Clock size={14} /> {trainer.experience} years exp</span>
                  </div>
                </div>
              </div>

              <Divider />

              {/* Steps */}
              <Steps
                current={currentStep}
                items={steps}
                className="booking-steps"
              />

              <Divider />

              {/* Step Content */}
              <div className="step-content">
                {/* Step 1: Schedule */}
                {currentStep === 0 && (
                  <div className="schedule-step">
                    {/* Consultation Type */}
                    <div className="form-section">
                      <Title level={5}>Consultation Type</Title>
                      <Radio.Group
                        value={bookingData.consultationType}
                        onChange={(e) => updateBooking('consultationType', e.target.value)}
                        className="consultation-type-group"
                      >
                        <Radio.Button value="video" className="type-option">
                          <Video size={20} />
                          <span>Video Call</span>
                          <Text type="secondary">Connect from anywhere</Text>
                        </Radio.Button>
                        <Radio.Button value="in-person" className="type-option">
                          <MapPin size={20} />
                          <span>In-Person</span>
                          <Text type="secondary">Visit the clinic</Text>
                        </Radio.Button>
                        <Radio.Button value="home-visit" className="type-option">
                          <Home size={20} />
                          <span>Home Visit</span>
                          <Text type="secondary">Expert visits your home</Text>
                        </Radio.Button>
                      </Radio.Group>
                    </div>

                    {/* Date Selection */}
                    <div className="form-section">
                      <Title level={5}>Select Date</Title>
                      <DatePicker
                        value={bookingData.date}
                        onChange={(date) => updateBooking('date', date)}
                        disabledDate={disabledDate}
                        size="large"
                        style={{ width: '100%' }}
                        placeholder="Choose a date"
                      />
                    </div>

                    {/* Time Slots */}
                    {bookingData.date && (
                      <div className="form-section">
                        <Title level={5}>Available Time Slots</Title>
                        <div className="time-slots-grid">
                          {timeSlots.map(slot => (
                            <div
                              key={slot}
                              className={`time-slot ${bookingData.timeSlot === slot ? 'selected' : ''}`}
                              onClick={() => updateBooking('timeSlot', slot)}
                            >
                              {slot}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Duration */}
                    <div className="form-section">
                      <Title level={5}>Session Duration</Title>
                      <Radio.Group
                        value={bookingData.duration}
                        onChange={(e) => updateBooking('duration', e.target.value)}
                        className="duration-group"
                      >
                        {durationOptions.map(option => (
                          <Radio.Button key={option.value} value={option.value} className="duration-option">
                            <span className="duration-label">{option.label}</span>
                            <span className="duration-price">₹{option.price.toLocaleString()}</span>
                          </Radio.Button>
                        ))}
                      </Radio.Group>
                    </div>
                  </div>
                )}

                {/* Step 2: Details */}
                {currentStep === 1 && (
                  <div className="details-step">
                    <Form form={form} layout="vertical" className="details-form">
                      <Row gutter={16}>
                        <Col xs={24}>
                          <Form.Item
                            name="name"
                            label="Full Name"
                            rules={[{ required: true, message: 'Please enter your name' }]}
                          >
                            <Input
                              size="large"
                              prefix={<User size={18} color="#999" />}
                              placeholder="Enter your full name"
                              value={bookingData.name}
                              onChange={(e) => updateBooking('name', e.target.value)}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item
                            name="email"
                            label="Email Address"
                            rules={[
                              { required: true, message: 'Please enter your email' },
                              { type: 'email', message: 'Please enter a valid email' }
                            ]}
                          >
                            <Input
                              size="large"
                              prefix={<Mail size={18} color="#999" />}
                              placeholder="your@email.com"
                              value={bookingData.email}
                              onChange={(e) => updateBooking('email', e.target.value)}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item
                            name="phone"
                            label="Phone Number"
                            rules={[{ required: true, message: 'Please enter your phone number' }]}
                          >
                            <Input
                              size="large"
                              prefix={<Phone size={18} color="#999" />}
                              placeholder="+91 98765 43210"
                              value={bookingData.phone}
                              onChange={(e) => updateBooking('phone', e.target.value)}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24}>
                          <Form.Item
                            name="concerns"
                            label="Health Concerns / Goals (Optional)"
                          >
                            <TextArea
                              rows={4}
                              placeholder="Tell the expert about your health concerns, goals, or any specific topics you'd like to discuss..."
                              value={bookingData.concerns}
                              onChange={(e) => updateBooking('concerns', e.target.value)}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                )}

                {/* Step 3: Payment */}
                {currentStep === 2 && (
                  <div className="payment-step">
                    {/* Order Summary */}
                    <div className="order-summary">
                      <Title level={5}>Order Summary</Title>
                      <div className="summary-item">
                        <span>Consultation with {trainer.name}</span>
                        <span>₹{basePrice.toLocaleString()}</span>
                      </div>
                      <div className="summary-item">
                        <span>Duration</span>
                        <span>{bookingData.duration} minutes</span>
                      </div>
                      <div className="summary-item">
                        <span>Date & Time</span>
                        <span>{bookingData.date?.format('MMM D')} at {bookingData.timeSlot}</span>
                      </div>
                      <div className="summary-item">
                        <span>Type</span>
                        <span>
                          {bookingData.consultationType === 'video' ? 'Video Call' :
                           bookingData.consultationType === 'home-visit' ? 'Home Visit' : 'In-Person'}
                        </span>
                      </div>
                      {homeVisitFee > 0 && (
                        <div className="summary-item">
                          <span>Home Visit Fee</span>
                          <span>₹{homeVisitFee.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="summary-item">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toLocaleString()}</span>
                      </div>
                      <div className="summary-item">
                        <span>GST (18%)</span>
                        <span>₹{gstAmount.toLocaleString()}</span>
                      </div>
                      <Divider />
                      <div className="summary-item total">
                        <span>Total Amount</span>
                        <span>₹{totalPrice.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="form-section">
                      <Title level={5}>Payment Method</Title>
                      <Radio.Group
                        value={bookingData.paymentMethod}
                        onChange={(e) => updateBooking('paymentMethod', e.target.value)}
                        className="payment-methods"
                      >
                        <Radio value="card" className="payment-option">
                          <CreditCard size={20} />
                          <span>Credit / Debit Card</span>
                        </Radio>
                        <Radio value="upi" className="payment-option">
                          <IndianRupee size={20} />
                          <span>UPI Payment</span>
                        </Radio>
                        <Radio value="netbanking" className="payment-option">
                          <Shield size={20} />
                          <span>Net Banking</span>
                        </Radio>
                      </Radio.Group>
                    </div>

                    {/* Security Note */}
                    <Alert
                      message="Secure Payment"
                      description="Your payment information is encrypted and secure. We never store your card details."
                      type="info"
                      showIcon
                      icon={<Shield size={20} />}
                      className="security-alert"
                    />
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="step-navigation">
                {currentStep > 0 && (
                  <Button size="large" onClick={handlePrev}>
                    Previous
                  </Button>
                )}
                {currentStep < 2 ? (
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleNext}
                    disabled={
                      (currentStep === 0 && (!bookingData.date || !bookingData.timeSlot))
                    }
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleSubmitBooking}
                    className="pay-btn"
                  >
                    Pay ₹{totalPrice.toLocaleString()}
                  </Button>
                )}
              </div>
            </Card>
          </Col>

          {/* Sidebar */}
          <Col xs={24} lg={8}>
            {/* Expert Card */}
            <Card className="expert-sidebar-card">
              <div className="expert-header">
                <Avatar size={80} src={trainer.image} />
                {trainer.isTopRated && (
                  <div className="featured-badge">
                    <Award size={14} />
                  </div>
                )}
              </div>
              <Title level={4} className="expert-name">{trainer.name}</Title>
              <Text type="secondary">{trainer.specialization}</Text>

              <div className="expert-stats">
                <div className="stat">
                  <Star size={16} fill="#faad14" color="#faad14" />
                  <span>{trainer.rating} ({trainer.reviewCount} reviews)</span>
                </div>
                <div className="stat">
                  <Clock size={16} />
                  <span>{trainer.experience} years experience</span>
                </div>
              </div>

              <Divider />

              <div className="certifications">
                <Text strong>Certifications</Text>
                <div className="cert-tags">
                  {trainer.certifications.map((cert, index) => (
                    <Tag key={index} color="green">{cert}</Tag>
                  ))}
                </div>
              </div>

              <Paragraph type="secondary" className="bio">
                {trainer.bio}
              </Paragraph>
            </Card>

            {/* Trust Badges */}
            <Card className="trust-card">
              <div className="trust-item">
                <Shield size={20} color="#52c41a" />
                <div>
                  <Text strong>Verified Expert</Text>
                  <Text type="secondary">Background checked & certified</Text>
                </div>
              </div>
              <div className="trust-item">
                <CheckCircle size={20} color="#52c41a" />
                <div>
                  <Text strong>Money-Back Guarantee</Text>
                  <Text type="secondary">100% refund if not satisfied</Text>
                </div>
              </div>
              <div className="trust-item">
                <MessageSquare size={20} color="#52c41a" />
                <div>
                  <Text strong>24/7 Support</Text>
                  <Text type="secondary">We're here to help</Text>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default BookConsultationPage;
