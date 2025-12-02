import { useState } from 'react';
import { ArrowLeft, ArrowRight, CreditCard, Smartphone, DollarSign, Check, Lock, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Alert, AlertDescription } from '../ui/alert';
import type { Language } from '../../App';

const translations = {
  ar: {
    back: 'رجوع',
    payment: 'الدفع',
    selectPaymentMethod: 'اختاري طريقة الدفع',
    creditCard: 'بطاقة بنكية',
    instaPay: 'إنستا باي',
    vodafoneCash: 'فودافون كاش',
    fawry: 'فوري',
    bookingSummary: 'ملخص الحجز',
    sitter: 'الخالة',
    service: 'الخدمة',
    date: 'التاريخ',
    duration: 'المدة',
    hours: 'ساعات',
    days: 'أيام',
    totalAmount: 'المبلغ الإجمالي',
    platformFee: 'رسوم المنصة',
    finalAmount: 'المبلغ النهائي',
    egp: 'جنيه',
    cardNumber: 'رقم البطاقة',
    cardName: 'الاسم على البطاقة',
    expiryDate: 'تاريخ الانتهاء',
    cvv: 'CVV',
    phoneNumber: 'رقم الهاتف',
    fawryCode: 'كود الدفع فوري',
    fawryInstructions: 'استخدمي هذا الكود في أقرب نقطة فوري لإتمام الدفع',
    payNow: 'ادفعي الآن',
    processingPayment: 'جاري معالجة الدفع...',
    paymentSuccessful: 'تم الدفع بنجاح',
    paymentFailed: 'فشل الدفع',
    securePayment: 'عملية دفع آمنة ومشفرة',
    instaPayInstructions: 'ادخلي رقم الهاتف المسجل في إنستا باي',
    vodafoneCashInstructions: 'ادخلي رقم فودافون كاش',
    verifyPhone: 'إرسال كود التحقق',
    verificationCode: 'كود التحقق',
    confirm: 'تأكيد',
    resendCode: 'إعادة إرسال الكود',
  },
  en: {
    back: 'Back',
    payment: 'Payment',
    selectPaymentMethod: 'Select Payment Method',
    creditCard: 'Credit/Debit Card',
    instaPay: 'InstaPay',
    vodafoneCash: 'Vodafone Cash',
    fawry: 'Fawry',
    bookingSummary: 'Booking Summary',
    sitter: 'Sitter',
    service: 'Service',
    date: 'Date',
    duration: 'Duration',
    hours: 'hours',
    days: 'days',
    totalAmount: 'Total Amount',
    platformFee: 'Platform Fee',
    finalAmount: 'Final Amount',
    egp: 'EGP',
    cardNumber: 'Card Number',
    cardName: 'Name on Card',
    expiryDate: 'Expiry Date',
    cvv: 'CVV',
    phoneNumber: 'Phone Number',
    fawryCode: 'Fawry Payment Code',
    fawryInstructions: 'Use this code at any Fawry location to complete payment',
    payNow: 'Pay Now',
    processingPayment: 'Processing payment...',
    paymentSuccessful: 'Payment Successful',
    paymentFailed: 'Payment Failed',
    securePayment: 'Secure and encrypted payment',
    instaPayInstructions: 'Enter your InstaPay registered phone number',
    vodafoneCashInstructions: 'Enter your Vodafone Cash number',
    verifyPhone: 'Send Verification Code',
    verificationCode: 'Verification Code',
    confirm: 'Confirm',
    resendCode: 'Resend Code',
  }
};

interface PaymentPageProps {
  language: Language;
  bookingData: {
    sitterName: string;
    service: string;
    date: string;
    duration: number;
    amount: number;
  };
  onBack: () => void;
  onPaymentSuccess: () => void;
}

export default function PaymentPage({ language, bookingData, onBack, onPaymentSuccess }: PaymentPageProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'instapay' | 'vodafone' | 'fawry'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [fawryCode, setFawryCode] = useState('');
  
  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  
  // Phone number for mobile wallets
  const [phoneNumber, setPhoneNumber] = useState('');

  const t = translations[language];

  const platformFee = bookingData.amount * 0.1; // 10% platform fee
  const finalAmount = bookingData.amount + platformFee;

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return v;
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (paymentMethod === 'instapay' || paymentMethod === 'vodafone') {
      setShowVerification(true);
      setIsProcessing(false);
    } else if (paymentMethod === 'fawry') {
      // Generate Fawry code
      const code = 'FW' + Math.random().toString(36).substring(2, 10).toUpperCase();
      setFawryCode(code);
      setIsProcessing(false);
    } else {
      // Card payment
      setIsProcessing(false);
      onPaymentSuccess();
    }
  };

  const handleVerification = async () => {
    setIsProcessing(true);
    
    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsProcessing(false);
    onPaymentSuccess();
  };

  const sendVerificationCode = async () => {
    setIsProcessing(true);
    
    // Simulate sending code
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setShowVerification(true);
    setIsProcessing(false);
    alert(language === 'ar' ? 'تم إرسال كود التحقق' : 'Verification code sent');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={onBack}
              variant="ghost"
              className="p-2"
            >
              {language === 'ar' ? <ArrowRight className="size-5" /> : <ArrowLeft className="size-5" />}
            </Button>
            <div className="flex-1">
              <h1 className="text-xl">{t.payment}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Booking Summary */}
        <Card className="p-6">
          <h2 className="text-lg mb-4">{t.bookingSummary}</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t.sitter}</span>
              <span>{bookingData.sitterName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t.service}</span>
              <span>{bookingData.service}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t.date}</span>
              <span>{bookingData.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t.duration}</span>
              <span>{bookingData.duration} {t.hours}</span>
            </div>
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400">{t.totalAmount}</span>
                <span>{bookingData.amount} {t.egp}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400">{t.platformFee}</span>
                <span>{platformFee.toFixed(2)} {t.egp}</span>
              </div>
              <div className="flex justify-between text-lg border-t pt-2 mt-2">
                <span>{t.finalAmount}</span>
                <span className="text-[#FB5E7A]">{finalAmount.toFixed(2)} {t.egp}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Secure Payment Badge */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Lock className="size-4" />
          <span>{t.securePayment}</span>
        </div>

        {/* Payment Method Selection */}
        <Card className="p-6">
          <h2 className="text-lg mb-4">{t.selectPaymentMethod}</h2>
          <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
            <div className="space-y-3">
              {/* Credit Card */}
              <div className="flex items-center space-x-2 rtl:space-x-reverse p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                <RadioGroupItem value="card" id="payment-card" />
                <Label htmlFor="payment-card" className="flex-1 cursor-pointer flex items-center gap-3">
                  <CreditCard className="size-5 text-blue-500" />
                  <span>{t.creditCard}</span>
                </Label>
              </div>

              {/* InstaPay */}
              <div className="flex items-center space-x-2 rtl:space-x-reverse p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                <RadioGroupItem value="instapay" id="payment-instapay" />
                <Label htmlFor="payment-instapay" className="flex-1 cursor-pointer flex items-center gap-3">
                  <Smartphone className="size-5 text-purple-500" />
                  <span>{t.instaPay}</span>
                </Label>
              </div>

              {/* Vodafone Cash */}
              <div className="flex items-center space-x-2 rtl:space-x-reverse p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                <RadioGroupItem value="vodafone" id="payment-vodafone" />
                <Label htmlFor="payment-vodafone" className="flex-1 cursor-pointer flex items-center gap-3">
                  <Smartphone className="size-5 text-red-500" />
                  <span>{t.vodafoneCash}</span>
                </Label>
              </div>

              {/* Fawry */}
              <div className="flex items-center space-x-2 rtl:space-x-reverse p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                <RadioGroupItem value="fawry" id="payment-fawry" />
                <Label htmlFor="payment-fawry" className="flex-1 cursor-pointer flex items-center gap-3">
                  <DollarSign className="size-5 text-orange-500" />
                  <span>{t.fawry}</span>
                </Label>
              </div>
            </div>
          </RadioGroup>
        </Card>

        {/* Payment Details */}
        {!fawryCode && (
          <Card className="p-6">
            {paymentMethod === 'card' && !showVerification && (
              <div className="space-y-4">
                <div>
                  <Label>{t.cardNumber}</Label>
                  <Input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>{t.cardName}</Label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t.expiryDate}</Label>
                    <Input
                      type="text"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                      maxLength={5}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>{t.cvv}</Label>
                    <Input
                      type="text"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                      maxLength={3}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            )}

            {(paymentMethod === 'instapay' || paymentMethod === 'vodafone') && !showVerification && (
              <div className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {paymentMethod === 'instapay' ? t.instaPayInstructions : t.vodafoneCashInstructions}
                  </AlertDescription>
                </Alert>
                <div>
                  <Label>{t.phoneNumber}</Label>
                  <Input
                    type="tel"
                    placeholder="01xxxxxxxxx"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <Button
                  onClick={sendVerificationCode}
                  disabled={!phoneNumber || isProcessing}
                  variant="outline"
                  className="w-full"
                >
                  {t.verifyPhone}
                </Button>
              </div>
            )}

            {showVerification && (
              <div className="space-y-4">
                <Alert className="bg-green-50 dark:bg-green-900/20 border-green-500">
                  <Check className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    {language === 'ar' ? 'تم إرسال كود التحقق إلى ' : 'Verification code sent to '}{phoneNumber}
                  </AlertDescription>
                </Alert>
                <div>
                  <Label>{t.verificationCode}</Label>
                  <Input
                    type="text"
                    placeholder="123456"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={6}
                    className="mt-2"
                  />
                </div>
                <Button
                  onClick={handleVerification}
                  disabled={!verificationCode || isProcessing}
                  className="w-full bg-[#FB5E7A] hover:bg-[#e5536e]"
                >
                  {isProcessing ? t.processingPayment : t.confirm}
                </Button>
                <Button
                  onClick={sendVerificationCode}
                  variant="ghost"
                  className="w-full"
                >
                  {t.resendCode}
                </Button>
              </div>
            )}

            {paymentMethod === 'fawry' && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {t.fawryInstructions}
                </AlertDescription>
              </Alert>
            )}
          </Card>
        )}

        {/* Fawry Code Display */}
        {fawryCode && (
          <Card className="p-6 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto">
                <DollarSign className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-lg">{t.fawryCode}</h3>
              <div className="text-3xl font-mono tracking-wider bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                {fawryCode}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t.fawryInstructions}
              </p>
            </div>
          </Card>
        )}

        {/* Pay Button */}
        {!showVerification && !fawryCode && (
          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-[#FB5E7A] hover:bg-[#e5536e]"
            size="lg"
          >
            {isProcessing ? t.processingPayment : `${t.payNow} - ${finalAmount.toFixed(2)} ${t.egp}`}
          </Button>
        )}
      </div>
    </div>
  );
}
