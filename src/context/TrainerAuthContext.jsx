import { createContext, useContext, useState, useEffect } from 'react';
import { trainerAPI, adminAPI } from '../utils/api';

const TrainerAuthContext = createContext();

const ADMIN_CREDENTIALS = { email: 'admin@stayfit.com', password: 'admin' };

// Pre-seeded demo trainers for quick testing
const DEMO_TRAINERS = [
  {
    id: 'demo_yoga_01',
    name: 'Priya Sharma',
    email: 'priya@demo.com',
    password: 'demo123',
    phone: '9876543210',
    category: 'yoga',
    status: 'verified',
    bankStatus: 'verified',
    bankRejectReason: null,
    registeredAt: '2025-08-15T10:00:00.000Z',
    rejectionReason: null,
    adminRemarks: null,
    twoFactorEnabled: false,
    documents: { idProof: 'demo_id.pdf', certificates: ['yoga_cert.pdf'] },
    notifications: [
      { id: 1, type: 'success', message: 'Your profile has been verified! You are now live on the platform.', date: '2025-08-20T10:00:00.000Z', read: true }
    ],
    statusHistory: [
      { status: 'pending', date: '2025-08-15T10:00:00.000Z', note: 'Account created' },
      { status: 'verified', date: '2025-08-20T10:00:00.000Z', note: 'Profile verified by administrator' }
    ],
    profile: {
      name: 'Priya Sharma',
      phone: '9876543210',
      category: 'yoga',
      bio: 'Certified yoga instructor with 8+ years of experience in Hatha, Vinyasa, and Ashtanga yoga. Specializing in stress relief and flexibility improvement.',
      specialization: 'Hatha & Vinyasa Yoga',
      experience: 8,
      consultationFee: 1500,
      address: 'Koramangala, Bangalore',
      languages: ['Hindi', 'English', 'Kannada'],
      availability: { monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true, sunday: false },
      bankDetails: { accountHolder: 'Priya Sharma', bankName: 'HDFC Bank', accountNumber: '1234567890', ifsc: 'HDFC0001234' }
    }
  },
  {
    id: 'demo_gym_01',
    name: 'Arjun Patel',
    email: 'arjun@demo.com',
    password: 'demo123',
    phone: '9988776655',
    category: 'gym',
    status: 'verified',
    bankStatus: 'verified',
    bankRejectReason: null,
    registeredAt: '2025-09-01T10:00:00.000Z',
    rejectionReason: null,
    adminRemarks: null,
    twoFactorEnabled: false,
    documents: { idProof: 'demo_id.pdf', certificates: ['fitness_cert.pdf', 'nutrition_cert.pdf'] },
    notifications: [
      { id: 2, type: 'success', message: 'Your profile has been verified! You are now live on the platform.', date: '2025-09-10T10:00:00.000Z', read: true }
    ],
    statusHistory: [
      { status: 'pending', date: '2025-09-01T10:00:00.000Z', note: 'Account created' },
      { status: 'verified', date: '2025-09-10T10:00:00.000Z', note: 'Profile verified by administrator' }
    ],
    profile: {
      name: 'Arjun Patel',
      phone: '9988776655',
      category: 'gym',
      bio: 'ACE-certified personal trainer and strength coach. Expert in muscle building, weight loss, and functional training programs.',
      specialization: 'Strength & Conditioning',
      experience: 6,
      consultationFee: 2000,
      address: 'Andheri West, Mumbai',
      languages: ['Hindi', 'English', 'Gujarati'],
      availability: { monday: true, tuesday: true, wednesday: false, thursday: true, friday: true, saturday: true, sunday: true },
      bankDetails: { accountHolder: 'Arjun Patel', bankName: 'ICICI Bank', accountNumber: '9876543210', ifsc: 'ICIC0005678' }
    }
  },
  {
    id: 'demo_nutrition_01',
    name: 'Dr. Neha Gupta',
    email: 'neha@demo.com',
    password: 'demo123',
    phone: '9112233445',
    category: 'nutrition',
    status: 'verified',
    bankStatus: 'verified',
    bankRejectReason: null,
    registeredAt: '2025-07-20T10:00:00.000Z',
    rejectionReason: null,
    adminRemarks: null,
    twoFactorEnabled: false,
    documents: { idProof: 'demo_id.pdf', certificates: ['nutrition_degree.pdf', 'dietician_cert.pdf'] },
    notifications: [
      { id: 3, type: 'success', message: 'Your profile has been verified! You are now live on the platform.', date: '2025-07-28T10:00:00.000Z', read: true }
    ],
    statusHistory: [
      { status: 'pending', date: '2025-07-20T10:00:00.000Z', note: 'Account created' },
      { status: 'verified', date: '2025-07-28T10:00:00.000Z', note: 'Profile verified by administrator' }
    ],
    profile: {
      name: 'Dr. Neha Gupta',
      phone: '9112233445',
      category: 'nutrition',
      bio: 'Registered dietitian with M.Sc in Clinical Nutrition. 10+ years helping clients with weight management, PCOS diet, diabetes control, and sports nutrition.',
      specialization: 'Clinical Nutrition & Diet Planning',
      experience: 10,
      consultationFee: 1800,
      address: 'Sector 62, Noida',
      languages: ['Hindi', 'English'],
      availability: { monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: false, sunday: false },
      bankDetails: { accountHolder: 'Dr. Neha Gupta', bankName: 'SBI', accountNumber: '5566778899', ifsc: 'SBIN0009012' }
    }
  }
];

export const TrainerAuthProvider = ({ children }) => {
  const [registeredTrainers, setRegisteredTrainers] = useState(() => {
    const saved = localStorage.getItem('stayfit_trainers');
    const existing = saved ? JSON.parse(saved) : [];
    // Seed demo trainers if they don't exist yet
    const existingIds = new Set(existing.map(t => t.id));
    const missingDemos = DEMO_TRAINERS.filter(d => !existingIds.has(d.id));
    if (missingDemos.length > 0) {
      const merged = [...existing, ...missingDemos];
      localStorage.setItem('stayfit_trainers', JSON.stringify(merged));
      return merged;
    }
    return existing;
  });

  const [currentTrainer, setCurrentTrainer] = useState(() => {
    const saved = localStorage.getItem('stayfit_trainer_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [adminLoggedIn, setAdminLoggedIn] = useState(() => {
    return localStorage.getItem('stayfit_admin_session') === 'true';
  });

  const [hiddenTrainers, setHiddenTrainers] = useState(() => {
    const saved = localStorage.getItem('stayfit_hidden_trainers');
    return saved ? JSON.parse(saved) : [];
  });

  // Map of trainerId -> { edited fields } for static trainer overrides
  const [trainerEdits, setTrainerEdits] = useState(() => {
    const saved = localStorage.getItem('stayfit_trainer_edits');
    return saved ? JSON.parse(saved) : {};
  });

  // Ensure demo trainers are seeded (also handles HMR / hot reload)
  useEffect(() => {
    const existingIds = new Set(registeredTrainers.map(t => t.id));
    const missingDemos = DEMO_TRAINERS.filter(d => !existingIds.has(d.id));
    if (missingDemos.length > 0) {
      setRegisteredTrainers(prev => [...prev, ...missingDemos]);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    localStorage.setItem('stayfit_trainers', JSON.stringify(registeredTrainers));
  }, [registeredTrainers]);

  useEffect(() => {
    if (currentTrainer) {
      localStorage.setItem('stayfit_trainer_session', JSON.stringify(currentTrainer));
    } else {
      localStorage.removeItem('stayfit_trainer_session');
    }
  }, [currentTrainer]);

  useEffect(() => {
    localStorage.setItem('stayfit_hidden_trainers', JSON.stringify(hiddenTrainers));
  }, [hiddenTrainers]);

  useEffect(() => {
    localStorage.setItem('stayfit_trainer_edits', JSON.stringify(trainerEdits));
  }, [trainerEdits]);

  // ─── Trainer Registration (API first, localStorage fallback) ───
  const trainerRegister = async (data) => {
    // Try backend API first
    try {
      const res = await trainerAPI.signup({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone || '',
        category: data.category,
        specialization: data.specialization || '',
        experience: data.experience || 0,
        price: data.price || 0,
      });
      const { trainer: apiTrainer, token, refreshToken } = res.data;
      localStorage.setItem('stayfit_trainer_token', token);
      localStorage.setItem('stayfit_trainer_refresh_token', refreshToken);

      // Also add to local registeredTrainers for SearchContext compatibility
      const trainer = {
        id: apiTrainer.id,
        name: apiTrainer.name,
        email: apiTrainer.email,
        phone: apiTrainer.phone || '',
        category: apiTrainer.category,
        status: apiTrainer.status || 'pending',
        bankStatus: 'not_submitted',
        bankRejectReason: null,
        registeredAt: new Date().toISOString(),
        profile: null,
        rejectionReason: null,
        adminRemarks: null,
        statusHistory: [
          { status: 'pending', date: new Date().toISOString(), note: 'Account created' }
        ],
        twoFactorEnabled: false,
        documents: { idProof: null, certificates: [] },
        notifications: [
          { id: Date.now(), type: 'info', message: 'Welcome! Please complete your profile to start the verification process.', date: new Date().toISOString(), read: false }
        ],
        _apiId: apiTrainer.id, // Store API ID for future sync
      };

      setRegisteredTrainers(prev => [...prev, trainer]);
      setCurrentTrainer(trainer);
      return { success: true, trainer };
    } catch (err) {
      // If backend is down, fall back to localStorage
      if (!err.status) {
        console.warn('Backend unavailable, using offline registration');
        return registerLocally(data);
      }
      const errorMsg = err.errors
        ? err.errors.join(', ')
        : err.message || 'Registration failed';
      return { error: errorMsg };
    }
  };

  // Local-only registration (fallback)
  const registerLocally = (data) => {
    const exists = registeredTrainers.find(t => t.email === data.email);
    if (exists) return { error: 'Email already registered' };

    const trainer = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone || '',
      category: data.category,
      status: 'pending',
      bankStatus: 'not_submitted',
      bankRejectReason: null,
      registeredAt: new Date().toISOString(),
      profile: null,
      rejectionReason: null,
      adminRemarks: null,
      statusHistory: [
        { status: 'pending', date: new Date().toISOString(), note: 'Account created' }
      ],
      twoFactorEnabled: false,
      documents: { idProof: null, certificates: [] },
      notifications: [
        { id: Date.now(), type: 'info', message: 'Welcome! Please complete your profile to start the verification process.', date: new Date().toISOString(), read: false }
      ]
    };

    setRegisteredTrainers(prev => [...prev, trainer]);
    setCurrentTrainer(trainer);
    return { success: true, trainer };
  };

  // ─── Trainer Login (API first, localStorage fallback) ───
  const trainerLogin = async (email, password) => {
    // Try backend API first
    try {
      const res = await trainerAPI.login({ email, password });
      const { trainer: apiTrainer, token, refreshToken } = res.data;
      localStorage.setItem('stayfit_trainer_token', token);
      localStorage.setItem('stayfit_trainer_refresh_token', refreshToken);

      // Check if this trainer exists in local registeredTrainers
      let localTrainer = registeredTrainers.find(t => t.email === email);
      if (localTrainer) {
        // Update local data with API data
        localTrainer = { ...localTrainer, name: apiTrainer.name, _apiId: apiTrainer.id };
        setCurrentTrainer(localTrainer);
      } else {
        // Create local entry from API data
        const trainer = {
          id: apiTrainer.id,
          name: apiTrainer.name,
          email: apiTrainer.email,
          phone: apiTrainer.phone || '',
          category: apiTrainer.category,
          status: apiTrainer.status || 'pending',
          bankStatus: 'not_submitted',
          bankRejectReason: null,
          registeredAt: apiTrainer.createdAt || new Date().toISOString(),
          profile: null,
          rejectionReason: null,
          adminRemarks: null,
          statusHistory: [],
          twoFactorEnabled: false,
          documents: { idProof: null, certificates: [] },
          notifications: [],
          _apiId: apiTrainer.id,
        };
        setRegisteredTrainers(prev => [...prev, trainer]);
        setCurrentTrainer(trainer);
      }
      return { success: true, trainer: localTrainer || { name: apiTrainer.name, status: apiTrainer.status, email: apiTrainer.email } };
    } catch (err) {
      // If backend is down, fall back to localStorage
      if (!err.status) {
        console.warn('Backend unavailable, using offline login');
        return loginLocally(email, password);
      }
      return { error: err.message || 'Invalid email or password' };
    }
  };

  // Local-only login (fallback)
  const loginLocally = (email, password) => {
    const trainer = registeredTrainers.find(t => t.email === email && t.password === password);
    if (!trainer) return { error: 'Invalid email or password' };
    setCurrentTrainer(trainer);
    return { success: true, trainer };
  };

  // ─── OTP Login (API first, localStorage fallback) ───
  const sendOtp = async (emailOrPhone) => {
    try {
      const res = await trainerAPI.sendOtp(emailOrPhone);
      return {
        success: true,
        otp: res.data.otp, // Demo: returned from server for testing
        trainerId: res.data.trainerId,
      };
    } catch (err) {
      if (!err.status) {
        // Backend down — fallback to local
        console.warn('Backend unavailable, using offline OTP');
        const trainer = registeredTrainers.find(t => t.email === emailOrPhone || t.phone === emailOrPhone);
        if (!trainer) return { error: 'No account found with this email/phone' };
        return { success: true, otp: '123456', trainerId: trainer.id };
      }
      return { error: err.message || 'Failed to send OTP' };
    }
  };

  const verifyOtp = async (trainerId, otp) => {
    try {
      const res = await trainerAPI.verifyOtp(trainerId, otp);
      const { trainer: apiTrainer, token, refreshToken } = res.data;
      localStorage.setItem('stayfit_trainer_token', token);
      localStorage.setItem('stayfit_trainer_refresh_token', refreshToken);

      // Sync with local registeredTrainers
      let localTrainer = registeredTrainers.find(t => t.email === apiTrainer.email);
      if (localTrainer) {
        localTrainer = { ...localTrainer, name: apiTrainer.name, _apiId: apiTrainer.id };
        setCurrentTrainer(localTrainer);
      } else {
        const trainer = {
          id: apiTrainer.id,
          name: apiTrainer.name,
          email: apiTrainer.email,
          phone: apiTrainer.phone || '',
          category: apiTrainer.category,
          status: apiTrainer.status || 'pending',
          bankStatus: 'not_submitted',
          bankRejectReason: null,
          registeredAt: new Date().toISOString(),
          profile: null,
          rejectionReason: null,
          adminRemarks: null,
          statusHistory: [],
          twoFactorEnabled: false,
          documents: { idProof: null, certificates: [] },
          notifications: [],
          _apiId: apiTrainer.id,
        };
        setRegisteredTrainers(prev => [...prev, trainer]);
        setCurrentTrainer(trainer);
        localTrainer = trainer;
      }
      return { success: true, trainer: localTrainer };
    } catch (err) {
      if (!err.status) {
        // Backend down — fallback to local
        console.warn('Backend unavailable, using offline OTP verify');
        if (otp !== '123456') return { error: 'Invalid OTP' };
        const trainer = registeredTrainers.find(t => t.id === trainerId);
        if (!trainer) return { error: 'Trainer not found' };
        setCurrentTrainer(trainer);
        return { success: true, trainer };
      }
      return { error: err.message || 'Invalid OTP' };
    }
  };

  // ─── Forgot Password ───
  const resetPassword = (email, newPassword) => {
    const idx = registeredTrainers.findIndex(t => t.email === email);
    if (idx === -1) return { error: 'No account found with this email' };
    const updated = [...registeredTrainers];
    updated[idx] = { ...updated[idx], password: newPassword };
    setRegisteredTrainers(updated);
    return { success: true };
  };

  // ─── Trainer Logout ───
  const trainerLogout = () => {
    setCurrentTrainer(null);
    localStorage.removeItem('stayfit_trainer_token');
    localStorage.removeItem('stayfit_trainer_refresh_token');
  };

  // ─── Update Profile ───
  const updateTrainerProfile = (profileData) => {
    if (!currentTrainer) return;

    const updated = registeredTrainers.map(t => {
      if (t.id === currentTrainer.id) {
        const newHistory = [...(t.statusHistory || []), { status: 'pending_review', date: new Date().toISOString(), note: 'Profile submitted for review' }];
        const newNotification = { id: Date.now(), type: 'info', message: 'Your profile has been submitted for admin review.', date: new Date().toISOString(), read: false };
        const hasBankDetails = profileData.bankDetails &&
          profileData.bankDetails.accountHolder &&
          profileData.bankDetails.bankName &&
          profileData.bankDetails.accountNumber;
        return {
          ...t,
          profile: { ...t.profile, ...profileData },
          name: profileData.name || t.name,
          phone: profileData.phone || t.phone,
          category: profileData.category || t.category,
          documents: profileData.documents || t.documents,
          status: 'pending_review',
          bankStatus: hasBankDetails ? 'pending' : (t.bankStatus || 'not_submitted'),
          bankRejectReason: hasBankDetails ? null : t.bankRejectReason,
          rejectionReason: null,
          adminRemarks: null,
          statusHistory: newHistory,
          notifications: [...(t.notifications || []), newNotification]
        };
      }
      return t;
    });

    setRegisteredTrainers(updated);
    setCurrentTrainer(updated.find(t => t.id === currentTrainer.id));
  };

  // ─── Toggle 2FA ───
  const toggle2FA = (enabled) => {
    if (!currentTrainer) return;
    const updated = registeredTrainers.map(t =>
      t.id === currentTrainer.id ? { ...t, twoFactorEnabled: enabled } : t
    );
    setRegisteredTrainers(updated);
    setCurrentTrainer(updated.find(t => t.id === currentTrainer.id));
  };

  // ─── Mark notification read ───
  const markNotificationRead = (notifId) => {
    if (!currentTrainer) return;
    const updated = registeredTrainers.map(t => {
      if (t.id === currentTrainer.id) {
        return { ...t, notifications: (t.notifications || []).map(n => n.id === notifId ? { ...n, read: true } : n) };
      }
      return t;
    });
    setRegisteredTrainers(updated);
    setCurrentTrainer(updated.find(t => t.id === currentTrainer.id));
  };

  // ─── Admin Auth Section ───
  const adminLogin = (email, password) => {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setAdminLoggedIn(true);
      localStorage.setItem('stayfit_admin_session', 'true');
      return { success: true };
    }
    return { error: 'Invalid admin credentials' };
  };

  const adminLogout = () => {
    setAdminLoggedIn(false);
    localStorage.removeItem('stayfit_admin_session');
  };

  // ─── Admin: Verify Trainer ───
  const verifyTrainer = (trainerId) => {
    // Optimistic local update
    const updated = registeredTrainers.map(t => {
      if (t.id === trainerId) {
        const newHistory = [...(t.statusHistory || []), { status: 'verified', date: new Date().toISOString(), note: 'Profile verified by administrator' }];
        const newNotification = { id: Date.now(), type: 'success', message: 'Your profile has been verified! You are now live on the platform.', date: new Date().toISOString(), read: false };
        return { ...t, status: 'verified', rejectionReason: null, adminRemarks: null, statusHistory: newHistory, notifications: [...(t.notifications || []), newNotification] };
      }
      return t;
    });
    setRegisteredTrainers(updated);
    if (currentTrainer?.id === trainerId) setCurrentTrainer(updated.find(t => t.id === trainerId));
    // Sync to backend
    adminAPI.verifyTrainer(trainerId).catch(() => {});
  };

  // ─── Admin: Reject Trainer ───
  const rejectTrainer = (trainerId, reason) => {
    const updated = registeredTrainers.map(t => {
      if (t.id === trainerId) {
        const newHistory = [...(t.statusHistory || []), { status: 'rejected', date: new Date().toISOString(), note: reason }];
        const newNotification = { id: Date.now(), type: 'error', message: `Your profile was rejected: ${reason}`, date: new Date().toISOString(), read: false };
        return { ...t, status: 'rejected', rejectionReason: reason, statusHistory: newHistory, notifications: [...(t.notifications || []), newNotification] };
      }
      return t;
    });
    setRegisteredTrainers(updated);
    if (currentTrainer?.id === trainerId) setCurrentTrainer(updated.find(t => t.id === trainerId));
    adminAPI.rejectTrainer(trainerId, reason).catch(() => {});
  };

  // ─── Admin: Request Resubmission ───
  const requestResubmission = (trainerId, remarks) => {
    const updated = registeredTrainers.map(t => {
      if (t.id === trainerId) {
        const newHistory = [...(t.statusHistory || []), { status: 'resubmit', date: new Date().toISOString(), note: remarks }];
        const newNotification = { id: Date.now(), type: 'warning', message: `Resubmission requested: ${remarks}`, date: new Date().toISOString(), read: false };
        return { ...t, status: 'resubmit', adminRemarks: remarks, statusHistory: newHistory, notifications: [...(t.notifications || []), newNotification] };
      }
      return t;
    });
    setRegisteredTrainers(updated);
    if (currentTrainer?.id === trainerId) setCurrentTrainer(updated.find(t => t.id === trainerId));
    adminAPI.requestResubmission(trainerId, remarks).catch(() => {});
  };

  // ─── Admin: Verify Bank Details ───
  const verifyBankDetails = (trainerId) => {
    const updated = registeredTrainers.map(t => {
      if (t.id === trainerId) {
        const newNotification = { id: Date.now(), type: 'success', message: 'Your bank details have been verified by the admin.', date: new Date().toISOString(), read: false };
        return { ...t, bankStatus: 'verified', bankRejectReason: null, notifications: [...(t.notifications || []), newNotification] };
      }
      return t;
    });
    setRegisteredTrainers(updated);
    if (currentTrainer?.id === trainerId) setCurrentTrainer(updated.find(t => t.id === trainerId));
    adminAPI.verifyBank(trainerId).catch(() => {});
  };

  // ─── Admin: Reject Bank Details ───
  const rejectBankDetails = (trainerId, reason) => {
    const updated = registeredTrainers.map(t => {
      if (t.id === trainerId) {
        const newNotification = { id: Date.now(), type: 'error', message: `Your bank details were rejected: ${reason}`, date: new Date().toISOString(), read: false };
        return { ...t, bankStatus: 'rejected', bankRejectReason: reason, notifications: [...(t.notifications || []), newNotification] };
      }
      return t;
    });
    setRegisteredTrainers(updated);
    if (currentTrainer?.id === trainerId) setCurrentTrainer(updated.find(t => t.id === trainerId));
    adminAPI.rejectBank(trainerId, reason).catch(() => {});
  };

  // ─── Admin: Hide/Restore Static Trainers ───
  const hideTrainer = (trainerId) => {
    setHiddenTrainers(prev => [...prev, trainerId]);
    adminAPI.hideTrainer(trainerId).catch(() => {});
  };

  const restoreTrainer = (trainerId) => {
    setHiddenTrainers(prev => prev.filter(id => id !== trainerId));
    adminAPI.restoreTrainer(trainerId).catch(() => {});
  };

  // ─── Admin: Edit Registered Trainer Profile ───
  const updateRegisteredTrainer = (trainerId, edits) => {
    const updated = registeredTrainers.map(t => {
      if (t.id === trainerId) {
        const updatedProfile = { ...t.profile, ...edits.profile };
        return {
          ...t,
          name: edits.name || t.name,
          category: edits.category || t.category,
          phone: edits.phone || t.phone,
          profile: updatedProfile
        };
      }
      return t;
    });
    setRegisteredTrainers(updated);
    if (currentTrainer?.id === trainerId) setCurrentTrainer(updated.find(t => t.id === trainerId));
  };

  // ─── Admin: Edit/Reset Static Trainer Data ───
  const updateStaticTrainer = (trainerId, edits) => {
    setTrainerEdits(prev => ({ ...prev, [trainerId]: { ...prev[trainerId], ...edits } }));
  };

  const resetStaticTrainer = (trainerId) => {
    setTrainerEdits(prev => {
      const next = { ...prev };
      delete next[trainerId];
      return next;
    });
  };

  return (
    <TrainerAuthContext.Provider value={{
      registeredTrainers,
      currentTrainer,
      adminLoggedIn,
      hiddenTrainers,
      trainerEdits,
      trainerRegister,
      trainerLogin,
      sendOtp,
      verifyOtp,
      resetPassword,
      trainerLogout,
      updateTrainerProfile,
      toggle2FA,
      markNotificationRead,
      adminLogin,
      adminLogout,
      verifyTrainer,
      rejectTrainer,
      requestResubmission,
      verifyBankDetails,
      rejectBankDetails,
      hideTrainer,
      restoreTrainer,
      updateRegisteredTrainer,
      updateStaticTrainer,
      resetStaticTrainer
    }}>
      {children}
    </TrainerAuthContext.Provider>
  );
};

export const useTrainerAuth = () => {
  const context = useContext(TrainerAuthContext);
  if (!context) {
    throw new Error('useTrainerAuth must be used within a TrainerAuthProvider');
  }
  return context;
};

export default TrainerAuthContext;
