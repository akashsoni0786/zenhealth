import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Select,
  Steps,
  Row,
  Col,
  InputNumber,
  Tag,
  Alert,
  Divider,
  Space,
  Checkbox,
  message,
  Progress
} from 'antd';
import {
  User,
  Mail,
  Phone,
  Award,
  Briefcase,
  Clock,
  IndianRupee,
  Camera,
  ChevronLeft,
  ChevronRight,
  Save,
  CheckCircle,
  XCircle,
  Clock3,
  ShieldCheck,
  LogOut,
  MapPin,
  FileText,
  Upload,
  Eye,
  AlertTriangle,
  RotateCcw,
  Landmark,
  CreditCard,
  Hash
} from 'lucide-react';
import { useTrainerAuth } from '../context/TrainerAuthContext';
import { trainerAPI } from '../utils/api';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const CONSULTATION_TYPES = [
  { label: 'Video Call', value: 'video' },
  { label: 'In-Person', value: 'in-person' },
  { label: 'Home Visit', value: 'home-visit' }
];

const CATEGORY_OPTIONS = [
  { value: 'yoga', label: 'Yoga Instructor' },
  { value: 'gym', label: 'Gym / Fitness Trainer' },
  { value: 'nutrition', label: 'Nutritionist / Dietitian' },
  { value: 'doctor', label: 'Doctor / Medical Expert' }
];

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' }
];

const TrainerProfileSetup = () => {
  const navigate = useNavigate();
  const { currentTrainer, updateTrainerProfile, trainerLogout } = useTrainerAuth();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [certifications, setCertifications] = useState([]);
  const [certInput, setCertInput] = useState('');
  const [documentUrls, setDocumentUrls] = useState({ idProof: '', certificates: [] });
  const [certDocInput, setCertDocInput] = useState('');
  const [idProofUploaded, setIdProofUploaded] = useState(false);

  useEffect(() => {
    if (!currentTrainer) {
      navigate('/trainer-login');
    }
  }, [currentTrainer, navigate]);

  useEffect(() => {
    if (currentTrainer?.profile) {
      const p = currentTrainer.profile;
      const bank = p.bankDetails || {};
      form.setFieldsValue({
        name: p.name || currentTrainer.name || '',
        email: currentTrainer.email || '',
        phone: p.phone || currentTrainer.phone || '',
        gender: p.gender || '',
        age: p.age || undefined,
        photoUrl: p.photoUrl || '',
        category: p.category || currentTrainer.category || '',
        specialization: p.specialization || '',
        qualification: p.qualification || '',
        experience: p.experience || undefined,
        location: p.location || '',
        serviceArea: p.serviceArea || '',
        consultationFee: p.consultationFee || undefined,
        workingHours: p.workingHours || '',
        consultationTypes: p.consultationTypes || [],
        bio: p.bio || '',
        accountHolder: bank.accountHolder || '',
        bankName: bank.bankName || '',
        accountNumber: bank.accountNumber || '',
        confirmAccountNumber: bank.accountNumber || '',
        ifscCode: bank.ifscCode || '',
        upiId: bank.upiId || ''
      });
      if (p.certifications) setCertifications(p.certifications);
      if (currentTrainer.documents) {
        setDocumentUrls({
          idProof: currentTrainer.documents.idProof || '',
          certificates: currentTrainer.documents.certificates || []
        });
        if (currentTrainer.documents.idProof) setIdProofUploaded(true);
      }
    } else if (currentTrainer) {
      form.setFieldsValue({
        name: currentTrainer.name || '',
        email: currentTrainer.email || '',
        phone: currentTrainer.phone || '',
        category: currentTrainer.category || ''
      });
    }
  }, [currentTrainer, form]);

  const profileCompletion = useMemo(() => {
    if (!currentTrainer) return 0;
    const values = form.getFieldsValue();
    const fields = [
      values.name,
      values.phone,
      values.gender,
      values.age,
      values.category,
      values.specialization,
      values.qualification,
      values.experience,
      values.location,
      values.consultationFee,
      values.bio
    ];
    const filled = fields.filter(v => v !== undefined && v !== null && v !== '').length;
    return Math.round((filled / fields.length) * 100);
  }, [currentTrainer, form, currentStep]);

  if (!currentTrainer) return null;

  const handleAddCertification = () => {
    const trimmed = certInput.trim();
    if (trimmed && !certifications.includes(trimmed)) {
      setCertifications(prev => [...prev, trimmed]);
      setCertInput('');
    }
  };

  const handleRemoveCertification = (cert) => {
    setCertifications(prev => prev.filter(c => c !== cert));
  };

  const handleIdProofUpload = () => {
    const url = form.getFieldValue('idProofUrl');
    if (url && url.trim()) {
      setDocumentUrls(prev => ({ ...prev, idProof: url.trim() }));
      setIdProofUploaded(true);
      message.success('ID proof uploaded successfully');
      // Sync to backend
      trainerAPI.uploadDocument({ docType: 'idProof', name: 'ID Proof', url: url.trim() }).catch(() => {});
    } else {
      message.error('Please enter a valid URL for the ID proof');
    }
  };

  const handleAddCertDoc = () => {
    const trimmed = certDocInput.trim();
    if (trimmed) {
      setDocumentUrls(prev => ({
        ...prev,
        certificates: [...prev.certificates, trimmed]
      }));
      setCertDocInput('');
      message.success('Certificate document added');
      // Sync to backend
      trainerAPI.uploadDocument({ docType: 'certificate', name: 'Certificate', url: trimmed }).catch(() => {});
    }
  };

  const handleRemoveCertDoc = (index) => {
    setDocumentUrls(prev => ({
      ...prev,
      certificates: prev.certificates.filter((_, i) => i !== index)
    }));
  };

  const handleViewDoc = (url) => {
    window.open(url, '_blank');
  };

  const handleNext = async () => {
    try {
      const fieldsForStep = getFieldsForStep(currentStep);
      if (fieldsForStep.length > 0) {
        await form.validateFields(fieldsForStep);
      }
      setCurrentStep(prev => Math.min(prev + 1, 6));
    } catch {
      message.error('Please fill in all required fields before proceeding');
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const getFieldsForStep = (step) => {
    switch (step) {
      case 0: return ['name', 'phone', 'gender', 'age'];
      case 1: return ['category', 'specialization', 'qualification', 'experience'];
      case 2: return [];
      case 3: return ['location', 'consultationFee'];
      case 4: return ['bio'];
      case 5: return ['accountHolder', 'bankName', 'accountNumber', 'confirmAccountNumber', 'ifscCode'];
      default: return [];
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const bankDetails = {
        accountHolder: values.accountHolder,
        bankName: values.bankName,
        accountNumber: values.accountNumber,
        ifscCode: values.ifscCode,
        upiId: values.upiId || ''
      };
      const { confirmAccountNumber, accountHolder, bankName, accountNumber, ifscCode, upiId, ...rest } = values;
      const profileData = {
        ...rest,
        certifications,
        bankDetails,
        documents: {
          idProof: documentUrls.idProof,
          certificates: documentUrls.certificates
        }
      };
      updateTrainerProfile(profileData);
      // Sync bank details to backend
      trainerAPI.submitBankDetails({
        accountHolderName: bankDetails.accountHolder,
        accountNumber: bankDetails.accountNumber,
        ifscCode: bankDetails.ifscCode,
        bankName: bankDetails.bankName,
        upiId: bankDetails.upiId
      }).catch(() => {});
      // Sync profile to backend
      trainerAPI.updateProfile({
        name: rest.name,
        phone: rest.phone,
        category: rest.category,
        specialization: rest.specialization,
        qualification: rest.qualification,
        experience: rest.experience,
        location: rest.location,
        price: rest.consultationFee,
        bio: rest.bio,
        certifications
      }).catch(() => {});
      message.success('Profile submitted for review successfully!');
    } catch {
      message.error('Please complete all required fields before submitting');
    }
  };

  const handleLogout = () => {
    trainerLogout();
    navigate('/trainer-login');
  };

  const getStatusConfig = () => {
    switch (currentTrainer.status) {
      case 'pending':
        return {
          type: 'info',
          icon: <Clock3 size={18} />,
          message: 'Profile Pending',
          description: 'Please complete your profile and submit it for review.'
        };
      case 'pending_review':
        return {
          type: 'warning',
          icon: <Clock3 size={18} />,
          message: 'Under Review',
          description: 'Your profile has been submitted and is currently under admin review. This may take 24-48 hours.'
        };
      case 'verified':
        return {
          type: 'success',
          icon: <ShieldCheck size={18} />,
          message: 'Profile Verified',
          description: 'Congratulations! Your profile has been verified. You are now live on the platform.'
        };
      case 'rejected':
        return {
          type: 'error',
          icon: <XCircle size={18} />,
          message: 'Profile Rejected',
          description: `Your profile was rejected. Reason: ${currentTrainer.rejectionReason || 'Not specified'}. Please update and resubmit.`
        };
      case 'resubmit':
        return {
          type: 'warning',
          icon: <RotateCcw size={18} />,
          message: 'Resubmission Requested',
          description: `Admin has requested changes: ${currentTrainer.adminRemarks || 'Not specified'}. Please update and resubmit.`
        };
      default:
        return {
          type: 'info',
          icon: <AlertTriangle size={18} />,
          message: 'Unknown Status',
          description: 'Please contact support if you see this message.'
        };
    }
  };

  const statusConfig = getStatusConfig();

  const renderStep0 = () => (
    <div>
      <Title level={4} style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
        <User size={20} /> Personal Information
      </Title>
      <Row gutter={[16, 0]}>
        <Col xs={24} sm={12}>
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter your full name' }]}
          >
            <Input prefix={<User size={16} color="#999" />} placeholder="Enter your full name" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item name="email" label="Email Address">
            <Input prefix={<Mail size={16} color="#999" />} disabled />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[{ required: true, message: 'Please enter your phone number' }]}
          >
            <Input prefix={<Phone size={16} color="#999" />} placeholder="Enter phone number" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: 'Please select your gender' }]}
          >
            <Select placeholder="Select gender" options={GENDER_OPTIONS} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name="age"
            label="Age"
            rules={[{ required: true, message: 'Please enter your age' }]}
          >
            <InputNumber min={18} max={80} placeholder="Age" style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item name="photoUrl" label="Profile Photo URL">
            <Input prefix={<Camera size={16} color="#999" />} placeholder="Enter photo URL" />
          </Form.Item>
        </Col>
      </Row>
      {form.getFieldValue('photoUrl') && (
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Photo Preview:</Text>
          <img
            src={form.getFieldValue('photoUrl')}
            alt="Profile Preview"
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid #1890ff'
            }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
      )}
    </div>
  );

  const renderStep1 = () => (
    <div>
      <Title level={4} style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Briefcase size={20} /> Professional Details
      </Title>
      <Row gutter={[16, 0]}>
        <Col xs={24} sm={12}>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            <Select placeholder="Select your category" options={CATEGORY_OPTIONS} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name="specialization"
            label="Specialization"
            rules={[{ required: true, message: 'Please enter your specialization' }]}
          >
            <Input prefix={<Award size={16} color="#999" />} placeholder="e.g., Weight Loss, Muscle Building" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name="qualification"
            label="Qualification / Degree"
            rules={[{ required: true, message: 'Please enter your qualification' }]}
          >
            <Input prefix={<FileText size={16} color="#999" />} placeholder="e.g., B.Sc in Nutrition" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name="experience"
            label="Experience (Years)"
            rules={[{ required: true, message: 'Please enter your experience' }]}
          >
            <InputNumber min={0} max={50} placeholder="Years" style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
      <Divider orientation="left">Certifications</Divider>
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Input
            value={certInput}
            onChange={(e) => setCertInput(e.target.value)}
            placeholder="Type a certification and add"
            style={{ width: 300 }}
            onPressEnter={handleAddCertification}
          />
          <Button type="primary" onClick={handleAddCertification}>
            Add
          </Button>
        </Space>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {certifications.map((cert, index) => (
          <Tag
            key={index}
            closable
            onClose={() => handleRemoveCertification(cert)}
            color="blue"
            style={{ padding: '4px 12px', fontSize: 13 }}
          >
            <Award size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
            {cert}
          </Tag>
        ))}
        {certifications.length === 0 && (
          <Text type="secondary">No certifications added yet</Text>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div>
      <Title level={4} style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
        <FileText size={20} /> Documents & Verification
      </Title>
      <Alert
        message="Simulated Document Upload"
        description="This is a simulated upload process. In production, files would be uploaded to a secure server. For now, please provide URLs to your documents."
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Card size="small" title="ID Proof" style={{ marginBottom: 16 }}>
        <Space style={{ width: '100%' }} direction="vertical">
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <Form.Item name="idProofUrl" style={{ flex: 1, marginBottom: 0 }}>
              <Input placeholder="Enter URL to your ID proof document" />
            </Form.Item>
            <Button
              type="primary"
              icon={<Upload size={14} />}
              onClick={handleIdProofUpload}
            >
              Upload
            </Button>
          </div>
          {idProofUploaded && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#52c41a' }}>
              <CheckCircle size={16} />
              <Text type="success">ID Proof uploaded successfully</Text>
              {documentUrls.idProof && (
                <Button
                  type="link"
                  size="small"
                  icon={<Eye size={14} />}
                  onClick={() => handleViewDoc(documentUrls.idProof)}
                >
                  View
                </Button>
              )}
            </div>
          )}
          {!idProofUploaded && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#faad14' }}>
              <AlertTriangle size={16} />
              <Text type="warning">ID Proof not yet uploaded</Text>
            </div>
          )}
        </Space>
      </Card>

      <Card size="small" title="Certificates">
        <Space style={{ width: '100%' }} direction="vertical">
          <div style={{ display: 'flex', gap: 8 }}>
            <Input
              value={certDocInput}
              onChange={(e) => setCertDocInput(e.target.value)}
              placeholder="Enter URL to certificate document"
              style={{ flex: 1 }}
              onPressEnter={handleAddCertDoc}
            />
            <Button
              type="primary"
              icon={<Upload size={14} />}
              onClick={handleAddCertDoc}
            >
              Add
            </Button>
          </div>
          {documentUrls.certificates.length > 0 ? (
            documentUrls.certificates.map((url, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  background: '#f6ffed',
                  borderRadius: 6,
                  border: '1px solid #b7eb8f'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, overflow: 'hidden' }}>
                  <CheckCircle size={14} color="#52c41a" />
                  <Text ellipsis style={{ maxWidth: 400 }}>{url}</Text>
                </div>
                <Space>
                  <Button
                    type="link"
                    size="small"
                    icon={<Eye size={14} />}
                    onClick={() => handleViewDoc(url)}
                  >
                    View
                  </Button>
                  <Button
                    type="link"
                    danger
                    size="small"
                    icon={<XCircle size={14} />}
                    onClick={() => handleRemoveCertDoc(index)}
                  >
                    Remove
                  </Button>
                </Space>
              </div>
            ))
          ) : (
            <Text type="secondary">No certificate documents added yet</Text>
          )}
        </Space>
      </Card>
    </div>
  );

  const renderStep3 = () => (
    <div>
      <Title level={4} style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
        <MapPin size={20} /> Service Details
      </Title>
      <Row gutter={[16, 0]}>
        <Col xs={24} sm={12}>
          <Form.Item
            name="location"
            label="Location / City"
            rules={[{ required: true, message: 'Please enter your location' }]}
          >
            <Input prefix={<MapPin size={16} color="#999" />} placeholder="e.g., Mumbai, Maharashtra" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item name="serviceArea" label="Service Area">
            <Input prefix={<MapPin size={16} color="#999" />} placeholder="e.g., Within 10 km radius" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name="consultationFee"
            label="Consultation Fee"
            rules={[{ required: true, message: 'Please enter your consultation fee' }]}
          >
            <InputNumber
              min={0}
              max={50000}
              prefix={<IndianRupee size={14} />}
              placeholder="Fee in INR"
              style={{ width: '100%' }}
              formatter={(value) => `${value}`}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item name="workingHours" label="Working Hours">
            <Input prefix={<Clock size={16} color="#999" />} placeholder="e.g., 9:00 AM - 6:00 PM" />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item name="consultationTypes" label="Consultation Types">
            <Checkbox.Group options={CONSULTATION_TYPES} />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );

  const renderStep4 = () => (
    <div>
      <Title level={4} style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
        <FileText size={20} /> Bio & Description
      </Title>
      <Alert
        message="Writing Tips"
        description={
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li>Describe your approach to training and your philosophy</li>
            <li>Mention any notable achievements or success stories</li>
            <li>Highlight what makes you unique as a trainer</li>
            <li>Keep it professional but personable</li>
          </ul>
        }
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />
      <Form.Item
        name="bio"
        label="Professional Bio"
        rules={[{ required: true, message: 'Please write a short bio' }]}
      >
        <TextArea
          rows={6}
          maxLength={800}
          showCount
          placeholder="Write about yourself, your experience, and what you offer to clients..."
          style={{ resize: 'none' }}
        />
      </Form.Item>
    </div>
  );

  const renderStep5 = () => (
    <div>
      <Title level={4} style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Landmark size={20} /> Bank Details
      </Title>
      <Alert
        message="Bank Details Required"
        description="Please provide your bank details for receiving consultation payments. These details will be verified by the admin before your account goes live."
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />
      {currentTrainer.bankStatus === 'rejected' && currentTrainer.bankRejectReason && (
        <Alert
          message="Bank Details Rejected"
          description={`Reason: ${currentTrainer.bankRejectReason}. Please update your bank details and resubmit.`}
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}
      {currentTrainer.bankStatus === 'verified' && (
        <Alert
          message="Bank Details Verified"
          description="Your bank details have been verified by the admin."
          type="success"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}
      <Row gutter={[16, 0]}>
        <Col xs={24} sm={12}>
          <Form.Item
            name="accountHolder"
            label="Account Holder Name"
            rules={[{ required: true, message: 'Please enter account holder name' }]}
          >
            <Input prefix={<User size={16} color="#999" />} placeholder="Name as per bank account" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name="bankName"
            label="Bank Name"
            rules={[{ required: true, message: 'Please enter bank name' }]}
          >
            <Input prefix={<Landmark size={16} color="#999" />} placeholder="e.g., State Bank of India" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name="accountNumber"
            label="Account Number"
            rules={[{ required: true, message: 'Please enter account number' }]}
          >
            <Input prefix={<CreditCard size={16} color="#999" />} placeholder="Enter account number" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name="confirmAccountNumber"
            label="Confirm Account Number"
            dependencies={['accountNumber']}
            rules={[
              { required: true, message: 'Please confirm account number' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('accountNumber') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Account numbers do not match'));
                },
              })
            ]}
          >
            <Input prefix={<CreditCard size={16} color="#999" />} placeholder="Re-enter account number" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name="ifscCode"
            label="IFSC Code"
            rules={[
              { required: true, message: 'Please enter IFSC code' },
              { pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/, message: 'Please enter a valid IFSC code (e.g., SBIN0001234)' }
            ]}
          >
            <Input prefix={<Hash size={16} color="#999" />} placeholder="e.g., SBIN0001234" style={{ textTransform: 'uppercase' }} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name="upiId"
            label="UPI ID (Optional)"
          >
            <Input prefix={<IndianRupee size={16} color="#999" />} placeholder="e.g., name@upi" />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );

  const renderStep6 = () => {
    const values = form.getFieldsValue();
    const getCategoryLabel = (val) => CATEGORY_OPTIONS.find(c => c.value === val)?.label || val;
    const getGenderLabel = (val) => GENDER_OPTIONS.find(g => g.value === val)?.label || val;

    return (
      <div>
        <Title level={4} style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckCircle size={20} /> Review & Submit
        </Title>

        <Card
          size="small"
          title={<span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><User size={16} /> Personal Information</span>}
          style={{ marginBottom: 16 }}
        >
          <Row gutter={[16, 8]}>
            <Col span={12}><Text type="secondary">Name:</Text> <Text strong>{values.name || '-'}</Text></Col>
            <Col span={12}><Text type="secondary">Email:</Text> <Text strong>{values.email || currentTrainer.email || '-'}</Text></Col>
            <Col span={12}><Text type="secondary">Phone:</Text> <Text strong>{values.phone || '-'}</Text></Col>
            <Col span={12}><Text type="secondary">Gender:</Text> <Text strong>{getGenderLabel(values.gender) || '-'}</Text></Col>
            <Col span={12}><Text type="secondary">Age:</Text> <Text strong>{values.age || '-'}</Text></Col>
            {values.photoUrl && (
              <Col span={12}>
                <Text type="secondary">Photo:</Text>{' '}
                <img src={values.photoUrl} alt="Profile" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', verticalAlign: 'middle', marginLeft: 8 }} />
              </Col>
            )}
          </Row>
        </Card>

        <Card
          size="small"
          title={<span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Briefcase size={16} /> Professional Details</span>}
          style={{ marginBottom: 16 }}
        >
          <Row gutter={[16, 8]}>
            <Col span={12}><Text type="secondary">Category:</Text> <Text strong>{getCategoryLabel(values.category) || '-'}</Text></Col>
            <Col span={12}><Text type="secondary">Specialization:</Text> <Text strong>{values.specialization || '-'}</Text></Col>
            <Col span={12}><Text type="secondary">Qualification:</Text> <Text strong>{values.qualification || '-'}</Text></Col>
            <Col span={12}><Text type="secondary">Experience:</Text> <Text strong>{values.experience ? `${values.experience} years` : '-'}</Text></Col>
            <Col span={24}>
              <Text type="secondary">Certifications:</Text>{' '}
              {certifications.length > 0
                ? certifications.map((cert, i) => <Tag key={i} color="blue" style={{ marginTop: 4 }}>{cert}</Tag>)
                : <Text type="secondary">None added</Text>
              }
            </Col>
          </Row>
        </Card>

        <Card
          size="small"
          title={<span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FileText size={16} /> Documents</span>}
          style={{ marginBottom: 16 }}
        >
          <Row gutter={[16, 8]}>
            <Col span={24}>
              <Text type="secondary">ID Proof:</Text>{' '}
              {documentUrls.idProof
                ? <Tag color="green" icon={<CheckCircle size={12} />}>Uploaded</Tag>
                : <Tag color="orange" icon={<AlertTriangle size={12} />}>Not Uploaded</Tag>
              }
            </Col>
            <Col span={24}>
              <Text type="secondary">Certificates:</Text>{' '}
              {documentUrls.certificates.length > 0
                ? <Tag color="green">{documentUrls.certificates.length} document(s) uploaded</Tag>
                : <Tag color="orange">None uploaded</Tag>
              }
            </Col>
          </Row>
        </Card>

        <Card
          size="small"
          title={<span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><MapPin size={16} /> Service Details</span>}
          style={{ marginBottom: 16 }}
        >
          <Row gutter={[16, 8]}>
            <Col span={12}><Text type="secondary">Location:</Text> <Text strong>{values.location || '-'}</Text></Col>
            <Col span={12}><Text type="secondary">Service Area:</Text> <Text strong>{values.serviceArea || '-'}</Text></Col>
            <Col span={12}><Text type="secondary">Consultation Fee:</Text> <Text strong>{values.consultationFee ? `INR ${values.consultationFee}` : '-'}</Text></Col>
            <Col span={12}><Text type="secondary">Working Hours:</Text> <Text strong>{values.workingHours || '-'}</Text></Col>
            <Col span={24}>
              <Text type="secondary">Consultation Types:</Text>{' '}
              {values.consultationTypes?.length > 0
                ? values.consultationTypes.map(t => {
                    const ct = CONSULTATION_TYPES.find(c => c.value === t);
                    return <Tag key={t} color="purple" style={{ marginTop: 4 }}>{ct?.label || t}</Tag>;
                  })
                : <Text type="secondary">None selected</Text>
              }
            </Col>
          </Row>
        </Card>

        {values.bio && (
          <Card
            size="small"
            title={<span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FileText size={16} /> Bio</span>}
            style={{ marginBottom: 16 }}
          >
            <Paragraph style={{ marginBottom: 0 }}>{values.bio}</Paragraph>
          </Card>
        )}

        <Card
          size="small"
          title={<span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Landmark size={16} /> Bank Details</span>}
          style={{ marginBottom: 16 }}
        >
          <Row gutter={[16, 8]}>
            <Col span={12}><Text type="secondary">Account Holder:</Text> <Text strong>{values.accountHolder || '-'}</Text></Col>
            <Col span={12}><Text type="secondary">Bank Name:</Text> <Text strong>{values.bankName || '-'}</Text></Col>
            <Col span={12}><Text type="secondary">Account Number:</Text> <Text strong>{values.accountNumber ? `****${values.accountNumber.slice(-4)}` : '-'}</Text></Col>
            <Col span={12}><Text type="secondary">IFSC Code:</Text> <Text strong>{values.ifscCode || '-'}</Text></Col>
            {values.upiId && (
              <Col span={12}><Text type="secondary">UPI ID:</Text> <Text strong>{values.upiId}</Text></Col>
            )}
            <Col span={24}>
              <Text type="secondary">Verification:</Text>{' '}
              <Tag color={currentTrainer.bankStatus === 'verified' ? 'green' : currentTrainer.bankStatus === 'rejected' ? 'red' : 'orange'}>
                {currentTrainer.bankStatus === 'verified' ? 'Verified' : currentTrainer.bankStatus === 'rejected' ? 'Rejected' : 'Pending Admin Verification'}
              </Tag>
            </Col>
          </Row>
        </Card>
      </div>
    );
  };

  const stepItems = [
    { title: 'Personal' },
    { title: 'Professional' },
    { title: 'Documents' },
    { title: 'Service' },
    { title: 'Bio' },
    { title: 'Bank' },
    { title: 'Review' }
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return renderStep0();
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      case 6: return renderStep6();
      default: return null;
    }
  };

  const statusHistory = currentTrainer.statusHistory || [];

  return (
    <div style={{ maxWidth: 850, margin: '0 auto', padding: '24px 16px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24
      }}>
        <div>
          <Title level={3} style={{ marginBottom: 4 }}>Trainer Profile Setup</Title>
          <Text type="secondary">Complete your profile to get verified and start accepting consultations</Text>
        </div>
        <Space>
          {currentTrainer.status === 'verified' && (
            <Button
              type="primary"
              icon={<ShieldCheck size={16} />}
              onClick={() => navigate('/trainer-dashboard')}
            >
              Go to Dashboard
            </Button>
          )}
          <Button
            danger
            icon={<LogOut size={16} />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Space>
      </div>

      {/* Status Banner */}
      <Alert
        message={
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {statusConfig.icon}
            {statusConfig.message}
          </span>
        }
        description={statusConfig.description}
        type={statusConfig.type}
        showIcon={false}
        style={{ marginBottom: 24 }}
      />

      {/* Profile Completion Progress */}
      <Card size="small" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Text strong>Profile Completion:</Text>
          <Progress
            percent={profileCompletion}
            style={{ flex: 1, marginBottom: 0 }}
            strokeColor={profileCompletion === 100 ? '#52c41a' : '#1890ff'}
            status={profileCompletion === 100 ? 'success' : 'active'}
          />
        </div>
      </Card>

      {/* Steps */}
      <Steps
        current={currentStep}
        items={stepItems}
        size="small"
        style={{ marginBottom: 32 }}
        onChange={(step) => setCurrentStep(step)}
      />

      {/* Form Content */}
      <Card style={{ marginBottom: 24 }}>
        <Form
          form={form}
          layout="vertical"
          requiredMark="optional"
          initialValues={{
            email: currentTrainer?.email || '',
            consultationTypes: []
          }}
        >
          {renderStepContent()}
        </Form>

        <Divider />

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={currentStep === 0}
            onClick={handlePrev}
            icon={<ChevronLeft size={16} />}
          >
            Previous
          </Button>
          <Space>
            {currentStep < 6 && (
              <Button
                type="primary"
                onClick={handleNext}
              >
                Next <ChevronRight size={16} style={{ marginLeft: 4 }} />
              </Button>
            )}
            {currentStep === 6 && (
              <Button
                type="primary"
                icon={<Save size={16} />}
                onClick={handleSubmit}
                style={{ background: '#52c41a', borderColor: '#52c41a' }}
              >
                Submit Profile for Review
              </Button>
            )}
          </Space>
        </div>
      </Card>

      {/* Status History Timeline */}
      {statusHistory.length > 0 && (
        <Card title="Status History" size="small">
          {statusHistory.map((entry, index) => {
            let color = '#1890ff';
            let icon = <Clock3 size={16} />;
            if (entry.status === 'verified') { color = '#52c41a'; icon = <ShieldCheck size={16} />; }
            else if (entry.status === 'rejected') { color = '#ff4d4f'; icon = <XCircle size={16} />; }
            else if (entry.status === 'resubmit') { color = '#faad14'; icon = <RotateCcw size={16} />; }
            else if (entry.status === 'pending_review') { color = '#fa8c16'; icon = <Clock3 size={16} />; }

            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  padding: '12px 0',
                  borderBottom: index < statusHistory.length - 1 ? '1px solid #f0f0f0' : 'none',
                  position: 'relative'
                }}
              >
                {index < statusHistory.length - 1 && (
                  <div style={{
                    position: 'absolute',
                    left: 11,
                    top: 36,
                    bottom: 0,
                    width: 2,
                    background: '#f0f0f0'
                  }} />
                )}
                <div style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: `${color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: color,
                  zIndex: 1
                }}>
                  {icon}
                </div>
                <div>
                  <Text strong style={{ color, textTransform: 'capitalize' }}>
                    {entry.status.replace('_', ' ')}
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {new Date(entry.date).toLocaleString()}
                  </Text>
                  {entry.note && (
                    <>
                      <br />
                      <Text style={{ fontSize: 13 }}>{entry.note}</Text>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
};

export default TrainerProfileSetup;
