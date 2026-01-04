import { useState } from 'react';
import { ArrowLeft, ArrowRight, CreditCard, Smartphone, DollarSign, Check, Lock, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Alert, AlertDescription } from '../ui/alert';
import { useTranslation } from '../../hooks/useTranslation';

interface PaymentPageProps {
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

export default function PaymentPage({ bookingData, onBack, onPaymentSuccess }: PaymentPageProps) {
  const { t, language } = useTranslation();
  const paymentT = t.client.paymentPage;

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
    alert(paymentT.verificationCodeSent);
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
              <h1 className="text-xl">{paymentT.payment}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Booking Summary */}
        <Card className="p-6">
          <h2 className="text-lg mb-4">{paymentT.bookingSummary}</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{paymentT.sitter}</span>
              <span>{bookingData.sitterName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{paymentT.service}</span>
              <span>{bookingData.service}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{paymentT.date}</span>
              <span>{bookingData.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{paymentT.duration}</span>
              <span>{bookingData.duration} {paymentT.hours}</span>
            </div>
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400">{paymentT.totalAmount}</span>
                <span>{bookingData.amount} {paymentT.egp}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400">{paymentT.platformFee}</span>
                <span>{platformFee.toFixed(2)} {paymentT.egp}</span>
              </div>
              <div className="flex justify-between text-lg border-t pt-2 mt-2">
                <span>{paymentT.finalAmount}</span>
                <span className="text-[#FB5E7A]">{finalAmount.toFixed(2)} {paymentT.egp}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Secure Payment Badge */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Lock className="size-4" />
          <span>{paymentT.securePayment}</span>
        </div>

        {/* Payment Method Selection */}
        <Card className="p-6">
          <h2 className="text-lg mb-4">{paymentT.selectPaymentMethod}</h2>
          <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
            <div className="space-y-3">
              {/* Credit Card */}
              <div className="flex items-center space-x-2 rtl:space-x-reverse p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                <RadioGroupItem value="card" id="payment-card" />
                <Label htmlFor="payment-card" className="flex-1 cursor-pointer flex items-center gap-3">
                  <CreditCard className="size-5 text-blue-500" />
                  <span>{paymentT.creditCard}</span>
                </Label>
              </div>

              {/* InstaPay */}
              <div className="flex items-center space-x-2 rtl:space-x-reverse p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                <RadioGroupItem value="instapay" id="payment-instapay" />
                <Label htmlFor="payment-instapay" className="flex-1 cursor-pointer flex items-center gap-3">
                  <Smartphone className="size-5 text-purple-500" />
                  <span>{paymentT.instaPay}</span>
                </Label>
              </div>

              {/* Vodafone Cash */}
              <div className="flex items-center space-x-2 rtl:space-x-reverse p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                <RadioGroupItem value="vodafone" id="payment-vodafone" />
                <Label htmlFor="payment-vodafone" className="flex-1 cursor-pointer flex items-center gap-3">
                  <Smartphone className="size-5 text-red-500" />
                  <span>{paymentT.vodafoneCash}</span>
                </Label>
              </div>

              {/* Fawry */}
              <div className="flex items-center space-x-2 rtl:space-x-reverse p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                <RadioGroupItem value="fawry" id="payment-fawry" />
                <Label htmlFor="payment-fawry" className="flex-1 cursor-pointer flex items-center gap-3">
                  <DollarSign className="size-5 text-orange-500" />
                  <span>{paymentT.fawry}</span>
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
                  <Label>{paymentT.cardNumber}</Label>
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
                  <Label>{paymentT.cardName}</Label>
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
                    <Label>{paymentT.expiryDate}</Label>
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
                    <Label>{paymentT.cvv}</Label>
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
                    {paymentMethod === 'instapay' ? paymentT.instaPayInstructions : paymentT.vodafoneCashInstructions}
                  </AlertDescription>
                </Alert>
                <div>
                  <Label>{paymentT.phoneNumber}</Label>
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
                  {paymentT.verifyPhone}
                </Button>
              </div>
            )}

            {showVerification && (
              <div className="space-y-4">
                <Alert className="bg-green-50 dark:bg-green-900/20 border-green-500">
                  <Check className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    {paymentT.verificationCodeSentMsg} {phoneNumber}
                  </AlertDescription>
                </Alert>
                <div>
                  <Label>{paymentT.verificationCode}</Label>
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
                  {isProcessing ? paymentT.processingPayment : paymentT.confirm}
                </Button>
                <Button
                  onClick={sendVerificationCode}
                  variant="ghost"
                  className="w-full"
                >
                  {paymentT.resendCode}
                </Button>
              </div>
            )}

            {paymentMethod === 'fawry' && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {paymentT.fawryInstructions}
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
              <h3 className="text-lg">{paymentT.fawryCode}</h3>
              <div className="text-3xl font-mono tracking-wider bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                {fawryCode}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {paymentT.fawryInstructions}
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
            {isProcessing ? paymentT.processingPayment : `${paymentT.payNow} - ${finalAmount.toFixed(2)} ${paymentT.egp}`}
          </Button>
        )}
      </div>
    </div>
  );
}
