import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Language, UserType } from '../App';

interface AuthPageProps {
  language: Language;
  userType: UserType;
  onAuthenticate: (authenticated: boolean) => void;
  onBack: () => void;
}

const translations = {
  ar: {
    login: 'تسجيل الدخول',
    signup: 'إنشاء حساب جديد',
    email: 'البريد الإلكتروني',
    phone: 'رقم الهاتف',
    emailOrPhone: 'البريد الإلكتروني أو رقم الهاتف',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    forgotPassword: 'نسيت كلمة المرور؟',
    loginButton: 'دخول',
    signupButton: 'تسجيل',
    noAccount: 'ليس لديك حساب؟',
    haveAccount: 'لديك حساب؟',
    switchToSignup: 'سجل الآن',
    switchToLogin: 'سجل دخولك',
    otpTitle: 'رمز التحقق',
    otpDescription: 'أدخل الرمز المرسل إلى',
    verify: 'تأكيد',
    resendCode: 'إعادة إرسال الرمز',
    back: 'رجوع',
    fullName: 'الاسم الكامل',
    resetPassword: 'إعادة تعيين كلمة المرور',
    resetDescription: 'أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور',
    sendReset: 'إرسال',
    backToLogin: 'العودة لتسجيل الدخول'
  },
  en: {
    login: 'Login',
    signup: 'Create New Account',
    email: 'Email',
    phone: 'Phone Number',
    emailOrPhone: 'Email or Phone Number',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    forgotPassword: 'Forgot Password?',
    loginButton: 'Login',
    signupButton: 'Sign Up',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    switchToSignup: 'Sign up now',
    switchToLogin: 'Login',
    otpTitle: 'Verification Code',
    otpDescription: 'Enter the code sent to',
    verify: 'Verify',
    resendCode: 'Resend Code',
    back: 'Back',
    fullName: 'Full Name',
    resetPassword: 'Reset Password',
    resetDescription: 'Enter your email to reset your password',
    sendReset: 'Send',
    backToLogin: 'Back to Login'
  }
};

export default function AuthPage({ language, userType, onAuthenticate, onBack }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'otp' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const t = translations[language];

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      // Mock login - go to OTP
      setMode('otp');
    } else if (mode === 'signup') {
      // Mock signup - go to OTP
      setMode('otp');
    } else if (mode === 'otp') {
      // Mock OTP verification - authenticate
      onAuthenticate(true);
    } else if (mode === 'forgot') {
      // Mock forgot password - show success and go back to login
      alert(language === 'ar' ? 'تم إرسال رابط إعادة التعيين إلى بريدك' : 'Reset link sent to your email');
      setMode('login');
    }
  };

  if (mode === 'otp') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#FFD1DA] to-[#FB5E7A]">
        <Card className="max-w-md w-full p-8 space-y-6">
          <Button
            variant="ghost"
            onClick={() => setMode('login')}
            className="text-[#FB5E7A]"
          >
            {language === 'ar' ? <ArrowRight className="w-4 h-4 ml-2" /> : <ArrowLeft className="w-4 h-4 mr-2" />}
            {t.back}
          </Button>

          <div className="text-center space-y-2">
            <h2 className="text-[#FB5E7A]">{t.otpTitle}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t.otpDescription} {email || phone}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-2" dir="ltr">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="w-12 h-12 text-center border-[#FB5E7A]"
                />
              ))}
            </div>

            <Button
              type="submit"
              className="w-full bg-[#FB5E7A] hover:bg-[#e5536e]"
            >
              {t.verify}
            </Button>

            <Button
              type="button"
              variant="link"
              className="w-full text-[#FB5E7A]"
              onClick={() => alert(language === 'ar' ? 'تم إرسال الرمز مرة أخرى' : 'Code resent')}
            >
              {t.resendCode}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  if (mode === 'forgot') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#FFD1DA] to-[#FB5E7A]">
        <Card className="max-w-md w-full p-8 space-y-6">
          <Button
            variant="ghost"
            onClick={() => setMode('login')}
            className="text-[#FB5E7A]"
          >
            {language === 'ar' ? <ArrowRight className="w-4 h-4 ml-2" /> : <ArrowLeft className="w-4 h-4 mr-2" />}
            {t.back}
          </Button>

          <div className="text-center space-y-2">
            <h2 className="text-[#FB5E7A]">{t.resetPassword}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t.resetDescription}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">{t.email}</Label>
              <Input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-[#FB5E7A]"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#FB5E7A] hover:bg-[#e5536e]"
            >
              {t.sendReset}
            </Button>

            <Button
              type="button"
              variant="link"
              className="w-full text-[#FB5E7A]"
              onClick={() => setMode('login')}
            >
              {t.backToLogin}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#FFD1DA] to-[#FB5E7A]">
      <Card className="max-w-md w-full p-8 space-y-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-[#FB5E7A]"
        >
          {language === 'ar' ? <ArrowRight className="w-4 h-4 ml-2" /> : <ArrowLeft className="w-4 h-4 mr-2" />}
          {t.back}
        </Button>

        <h2 className="text-center text-[#FB5E7A]">
          {mode === 'login' ? t.login : t.signup}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="fullName">{t.fullName}</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="border-[#FB5E7A]"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">{t.emailOrPhone}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-[#FB5E7A]"
            />
          </div>

          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="phone">{t.phone}</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="border-[#FB5E7A]"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">{t.password}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-[#FB5E7A]"
            />
          </div>

          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t.confirmPassword}</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="border-[#FB5E7A]"
              />
            </div>
          )}

          {mode === 'login' && (
            <Button
              type="button"
              variant="link"
              className="text-[#FB5E7A] p-0 h-auto"
              onClick={() => setMode('forgot')}
            >
              {t.forgotPassword}
            </Button>
          )}

          <Button
            type="submit"
            className="w-full bg-[#FB5E7A] hover:bg-[#e5536e]"
          >
            {mode === 'login' ? t.loginButton : t.signupButton}
          </Button>
        </form>

        <div className="text-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {mode === 'login' ? t.noAccount : t.haveAccount}{' '}
          </span>
          <Button
            variant="link"
            className="text-[#FB5E7A] p-0 h-auto"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
          >
            {mode === 'login' ? t.switchToSignup : t.switchToLogin}
          </Button>
        </div>
      </Card>
    </div>
  );
}