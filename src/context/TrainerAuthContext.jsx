import { createContext, useContext, useState, useEffect } from 'react';

const TrainerAuthContext = createContext();

const ADMIN_CREDENTIALS = { email: 'admin@stayfit.com', password: 'admin' };

export const TrainerAuthProvider = ({ children }) => {
  const [registeredTrainers, setRegisteredTrainers] = useState(() => {
    const saved = localStorage.getItem('stayfit_trainers');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentTrainer, setCurrentTrainer] = useState(() => {
    const saved = localStorage.getItem('stayfit_trainer_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [adminLoggedIn, setAdminLoggedIn] = useState(() => {
    return localStorage.getItem('stayfit_admin_session') === 'true';
  });

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

  // ─── Trainer Registration ───
  const trainerRegister = (data) => {
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

  // ─── Trainer Login ───
  const trainerLogin = (email, password) => {
    const trainer = registeredTrainers.find(t => t.email === email && t.password === password);
    if (!trainer) return { error: 'Invalid email or password' };
    setCurrentTrainer(trainer);
    return { success: true, trainer };
  };

  // ─── OTP Login (simulated) ───
  const sendOtp = (emailOrPhone) => {
    const trainer = registeredTrainers.find(t => t.email === emailOrPhone || t.phone === emailOrPhone);
    if (!trainer) return { error: 'No account found with this email/phone' };
    return { success: true, otp: '123456', trainerId: trainer.id };
  };

  const verifyOtp = (trainerId, otp) => {
    if (otp !== '123456') return { error: 'Invalid OTP' };
    const trainer = registeredTrainers.find(t => t.id === trainerId);
    if (!trainer) return { error: 'Trainer not found' };
    setCurrentTrainer(trainer);
    return { success: true, trainer };
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
  };

  // ─── Update Profile ───
  const updateTrainerProfile = (profileData) => {
    if (!currentTrainer) return;

    const updated = registeredTrainers.map(t => {
      if (t.id === currentTrainer.id) {
        const newHistory = [...(t.statusHistory || []), { status: 'pending_review', date: new Date().toISOString(), note: 'Profile submitted for review' }];
        const newNotification = { id: Date.now(), type: 'info', message: 'Your profile has been submitted for admin review.', date: new Date().toISOString(), read: false };
        return {
          ...t,
          profile: { ...t.profile, ...profileData },
          name: profileData.name || t.name,
          phone: profileData.phone || t.phone,
          category: profileData.category || t.category,
          documents: profileData.documents || t.documents,
          status: 'pending_review',
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
  };

  return (
    <TrainerAuthContext.Provider value={{
      registeredTrainers,
      currentTrainer,
      adminLoggedIn,
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
      requestResubmission
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
