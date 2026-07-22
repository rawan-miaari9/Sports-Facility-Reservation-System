import React, { useState } from 'react';
import { 
  Activity, 
  ChevronLeft, 
  User, 
  Mail, 
  Phone, 
  Calendar as CalendarIcon, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';
import { User as UserType } from '../types';

interface AuthPageProps {
  onBackToLanding: () => void;
  onLoginSuccess: (user: UserType) => void;
  allUsers: UserType[];
  onRegisterUser: (newUser: UserType) => void;
}

export default function AuthPage({ 
  onBackToLanding, 
  onLoginSuccess, 
  allUsers,
  onRegisterUser 
}: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('alex.rivera@athletichub.com');
  const [loginRole, setLoginRole] = useState<'Athlete' | 'Admin'>('Athlete');

  // Register Form States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regDob, setRegDob] = useState('');
  const [regRole, setRegRole] = useState<'Athlete' | 'Admin'>('Athlete');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Auto fill credentials for easy testing!
  const handleSetTestUser = (email: string, role: 'Athlete' | 'Admin') => {
    setLoginEmail(email);
    setLoginRole(role);
    setErrorMessage('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!loginEmail.trim()) {
      setErrorMessage('Please enter an email address.');
      return;
    }

    // Find user in mock users matching email
    const foundUser = allUsers.find(
      u => u.email.toLowerCase() === loginEmail.trim().toLowerCase()
    );

    if (foundUser) {
      // Switch user role temporarily or permanently for state
      const updatedUser = { ...foundUser, role: loginRole };
      onLoginSuccess(updatedUser);
    } else {
      // If user doesn't exist, create an on-the-fly user for demo purposes so it never fails!
      const fallbackUser: UserType = {
        id: `usr-${Date.now()}`,
        name: loginEmail.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
        email: loginEmail,
        phone: '+1 (555) 011-2222',
        dateOfBirth: '1996-01-01',
        memberSince: 'Jul 2026',
        bookingsCount: 0,
        status: 'Available',
        role: loginRole
      };
      onRegisterUser(fallbackUser);
      onLoginSuccess(fallbackUser);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regName.trim() || !regEmail.trim()) {
      setErrorMessage('Name and Email are required fields.');
      return;
    }

    // Check if user already exists
    const exists = allUsers.some(u => u.email.toLowerCase() === regEmail.trim().toLowerCase());
    if (exists) {
      setErrorMessage('A user with this email already exists.');
      return;
    }

    const newUser: UserType = {
      id: `usr-${Date.now()}`,
      name: regName.trim(),
      email: regEmail.trim().toLowerCase(),
      phone: regPhone.trim() || '+1 (555) 000-0000',
      dateOfBirth: regDob || '1998-01-01',
      memberSince: 'Jul 2026',
      bookingsCount: 0,
      status: 'Available',
      role: regRole
    };

    onRegisterUser(newUser);
    setSuccessMessage('Registration successful! Auto-logging in...');
    
    setTimeout(() => {
      onLoginSuccess(newUser);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background font-sans flex grid-cols-1 lg:grid lg:grid-cols-12 overflow-hidden">
      {/* Back Button floating */}
      <button 
        onClick={onBackToLanding}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-white/95 border border-outline-variant hover:bg-surface-container rounded-xl text-xs font-bold text-primary transition-all cursor-pointer shadow-sm"
        id="auth-btn-back"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Home
      </button>

      {/* Left panel: Auth Form */}
      <div className="lg:col-span-5 flex flex-col justify-center px-8 sm:px-12 md:px-16 py-12 bg-white min-h-screen relative overflow-y-auto">
        <div className="max-w-md w-full mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-primary text-white p-2.5 rounded-xl shadow-md flex items-center justify-center">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <span className="font-display font-black text-xl tracking-wider text-primary uppercase">
                Athletic<span className="text-primary-container">Hub</span>
              </span>
              <span className="block text-[9px] font-mono tracking-widest text-outline uppercase font-bold">
                Elite Performance Facility
              </span>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="font-display font-black text-2xl text-on-surface">
              {isLogin ? 'Access Portal' : 'Register Profile'}
            </h2>
            <p className="text-on-surface-variant text-xs mt-1">
              {isLogin 
                ? 'Sign in with your athlete credentials or select a testing role.' 
                : 'Create your elite membership to lock in championship slots.'
              }
            </p>
          </div>

          {/* Form Toggle Tabs */}
          <div className="grid grid-cols-2 bg-surface-container-low p-1.5 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => { setIsLogin(true); setErrorMessage(''); }}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                isLogin ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsLogin(false); setErrorMessage(''); }}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                !isLogin ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Alert messages */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-error-container text-error rounded-xl text-xs flex items-center gap-2 border border-error/20 font-medium">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-secondary-container text-on-secondary-container rounded-xl text-xs flex items-center gap-2 border border-secondary/20 font-medium animate-pulse">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              {successMessage}
            </div>
          )}

          {/* LOGIN FORM */}
          {isLogin ? (
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4.5 w-4.5 text-outline" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="alex.rivera@athletichub.com"
                    className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-sm focus:outline-none focus:border-primary font-medium"
                    id="auth-input-login-email"
                  />
                </div>
              </div>

              {/* Select testing role */}
              <div className="flex flex-col gap-2 mt-2">
                <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">
                  Select Role View For Testing
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setLoginRole('Athlete')}
                    className={`p-3 rounded-xl border text-left flex flex-col gap-1 cursor-pointer transition-all ${
                      loginRole === 'Athlete' 
                        ? 'border-primary bg-primary/5 text-primary' 
                        : 'border-outline-variant hover:border-outline bg-transparent'
                    }`}
                  >
                    <span className="font-bold text-xs">Athlete View</span>
                    <span className="text-[10px] text-on-surface-variant font-medium">Book & manage slots</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLoginRole('Admin')}
                    className={`p-3 rounded-xl border text-left flex flex-col gap-1 cursor-pointer transition-all ${
                      loginRole === 'Admin' 
                        ? 'border-primary bg-primary/5 text-primary' 
                        : 'border-outline-variant hover:border-outline bg-transparent'
                    }`}
                  >
                    <span className="font-bold text-xs">Admin View</span>
                    <span className="text-[10px] text-on-surface-variant font-medium">Control grids & users</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-container text-white py-3.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all mt-4 cursor-pointer flex items-center justify-center gap-2"
                id="auth-submit-login"
              >
                Access Athletic Dashboard
                <ArrowRight className="h-4 w-4" />
              </button>

              {/* Interactive Demo Presets */}
              <div className="mt-8 border-t border-outline-variant pt-6">
                <span className="block text-[10px] font-mono uppercase tracking-wider text-outline font-bold mb-3">
                  Quick Demo Accounts
                </span>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => handleSetTestUser('alex.rivera@athletichub.com', 'Athlete')}
                    className="w-full text-left p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container border border-outline-variant/60 text-xs flex justify-between items-center cursor-pointer transition-colors"
                  >
                    <div>
                      <span className="font-bold text-primary block">Alex Rivera</span>
                      <span className="text-[10px] text-outline font-mono">alex.rivera@athletichub.com</span>
                    </div>
                    <span className="bg-primary-container text-white px-2 py-0.5 rounded text-[9px] font-mono font-bold">Athlete Preset</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSetTestUser('sofia.chen@athletichub.com', 'Admin')}
                    className="w-full text-left p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container border border-outline-variant/60 text-xs flex justify-between items-center cursor-pointer transition-colors"
                  >
                    <div>
                      <span className="font-bold text-primary block">Sofia Chen</span>
                      <span className="text-[10px] text-outline font-mono">sofia.chen@athletichub.com</span>
                    </div>
                    <span className="bg-secondary text-white px-2 py-0.5 rounded text-[9px] font-mono font-bold">Admin Preset</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4.5 w-4.5 text-outline" />
                  <input
                    type="text"
                    required
                    placeholder="Alex Rivera"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-sm focus:outline-none focus:border-primary font-medium"
                    id="auth-input-reg-name"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4.5 w-4.5 text-outline" />
                  <input
                    type="email"
                    required
                    placeholder="alex.rivera@gmail.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-sm focus:outline-none focus:border-primary font-medium"
                    id="auth-input-reg-email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4.5 w-4.5 text-outline" />
                    <input
                      type="tel"
                      placeholder="+1 (555) 012-3456"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-sm focus:outline-none focus:border-primary font-medium"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">
                    Birthdate
                  </label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-3 h-4.5 w-4.5 text-outline" />
                    <input
                      type="date"
                      value={regDob}
                      onChange={(e) => setRegDob(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-sm focus:outline-none focus:border-primary font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Role select */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-outline font-bold">
                  Sign Up As
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRegRole('Athlete')}
                    className={`py-2 px-4 rounded-xl border text-xs font-bold text-center cursor-pointer transition-all ${
                      regRole === 'Athlete' 
                        ? 'border-primary bg-primary/5 text-primary' 
                        : 'border-outline-variant hover:border-outline text-on-surface-variant'
                    }`}
                  >
                    Athlete Member
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegRole('Admin')}
                    className={`py-2 px-4 rounded-xl border text-xs font-bold text-center cursor-pointer transition-all ${
                      regRole === 'Admin' 
                        ? 'border-primary bg-primary/5 text-primary' 
                        : 'border-outline-variant hover:border-outline text-on-surface-variant'
                    }`}
                  >
                    Facility Staff
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-container text-white py-3 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all mt-4 cursor-pointer flex items-center justify-center gap-2"
                id="auth-submit-register"
              >
                Register & Lock-In Membership
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Right panel: Cover Image & Testimonial */}
      <div className="hidden lg:col-span-7 lg:block relative min-h-screen">
        <div className="absolute inset-0 bg-[#001f44]/80 z-10 mix-blend-multiply" />
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZguiv3hvRgVfOASmXtQjPgoZW1iohpP84dlm5BS_DWJlSbJ60J_vmV5hpFMllGrkliM0xGAT2n0c9m6W2LR7Rn3UjgM0J3Ankb1BDxf2JTgolKKID89D9kFV36Gvg_zvBLDw9vz9xcpAQzLy3fA8MItBmpM1sdRZdM1RHytNpcCehfuQc9IKD6jKHqOvN_dnNsCkxAWfDMEYzQoYiuQpzsMnxxBfYKBE4nAgRmOUcYinAbWWqhzCuqAibnlPR6Ih3j3BsC8FXg8E"
          alt="Visual asset showing basketball court inside premium athletic hub facility"
          className="w-full h-full object-cover absolute inset-0"
          referrerPolicy="no-referrer"
        />

        {/* Content overlaid */}
        <div className="absolute inset-0 z-20 flex flex-col justify-between p-16 text-white">
          <div className="flex items-center gap-2 font-display font-bold text-lg tracking-wider">
            <Activity className="h-5 w-5 text-secondary-container" />
            <span>ATHLETICHUB ACADEMY</span>
          </div>

          <div className="max-w-xl flex flex-col gap-6">
            <span className="text-secondary-container text-xs font-mono tracking-widest font-bold uppercase">
              // ATHLETE FEEDBACK
            </span>
            <blockquote className="font-display font-medium text-3xl leading-snug">
              "AthleticHub completely revolutionized our varsity squad's court scheduling. From premium hardwood basketball arenas to swimming lanes, we track and reserve slots without overlapping chaos."
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center font-display font-extrabold text-sm text-secondary-container border border-white/20">
                MV
              </div>
              <div>
                <span className="block font-bold text-sm">Marcus Vance</span>
                <span className="block text-xs text-white/60 font-mono">Facility Operations Director</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-white/40 font-mono">
            <span>CHAMPIONSHIP ARENA MANAGEMENT PLATFORM</span>
            <span>SYSTEM ID: AH-2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
