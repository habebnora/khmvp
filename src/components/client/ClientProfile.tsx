import { useState } from 'react';
import { User, Baby, MapPin, Phone, Mail, Edit, Plus, Trash2, LogOut, Languages, Moon, Sun, Shield, Check, AlertCircle, ChevronRight, ChevronLeft, Headphones } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import ClientVerification from './ClientVerification';
import type { Language } from '../../App';

interface ClientProfileProps {
  language: Language;
  onLogout: () => void;
  onLanguageChange: () => void;
  theme: 'light' | 'dark';
  onThemeChange: () => void;
}

interface Child {
  id: number;
  name: string;
  age: number;
  notes: string;
}

interface Address {
  id: number;
  title: string;
  address: string;
}

const translations = {
  ar: {
    profile: 'الملف الشخصي',
    personalInfo: 'المعلومات الشخصية',
    verification: 'توثيق الحساب',
    verificationStatus: 'حالة التوثيق',
    verifyNow: 'وثقي حسابك الآن',
    notVerified: 'غير موثق',
    pending: 'قيد المراجعة',
    verified: 'موثق',
    children: 'الأطفال',
    addresses: 'العناوين',
    fullName: 'الاسم الكامل',
    email: 'البريد الإلكتروني',
    phone: 'رقم الهاتف',
    edit: 'تعديل',
    save: 'حفظ',
    cancel: 'إلغاء',
    addChild: 'إضافة طفل',
    childName: 'اسم الطفل',
    childAge: 'العمر',
    notes: 'ملاحظات',
    years: 'سنوات',
    addAddress: 'إضافة عنوان',
    addressTitle: 'عنوان',
    addressDetails: 'تفاصيل العنوان',
    home: 'المنزل',
    work: 'العمل',
    other: 'آخر',
    logout: 'تسجيل خروج',
    language: 'اللغة',
    arabic: 'العربية',
    english: 'English',
    memberSince: 'عضو منذ',
    delete: 'حذف',
    theme: 'المظهر',
    lightMode: 'الوضع النهاري',
    darkMode: 'الوضع الليلي',
    verificationDesc: 'يرجى رفع صورة البطاقة الشخصية (الوجهين) لتفعيل الحساب بالكامل',
    contactSupport: 'تواصل مع الدعم'
  },
  en: {
    profile: 'Profile',
    personalInfo: 'Personal Information',
    verification: 'Account Verification',
    verificationStatus: 'Verification Status',
    verifyNow: 'Verify Account Now',
    notVerified: 'Not Verified',
    pending: 'Under Review',
    verified: 'Verified',
    children: 'Children',
    addresses: 'Addresses',
    fullName: 'Full Name',
    email: 'Email',
    phone: 'Phone Number',
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',
    addChild: 'Add Child',
    childName: 'Child Name',
    childAge: 'Age',
    notes: 'Notes',
    years: 'years',
    addAddress: 'Add Address',
    addressTitle: 'Title',
    addressDetails: 'Address Details',
    home: 'Home',
    work: 'Work',
    other: 'Other',
    logout: 'Logout',
    language: 'Language',
    arabic: 'العربية',
    english: 'English',
    memberSince: 'Member Since',
    delete: 'Delete',
    theme: 'Theme',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    verificationDesc: 'Please upload your National ID (both sides) to fully activate your account',
    contactSupport: 'Contact Support'
  }
};

export default function ClientProfile({ language, onLogout, onLanguageChange, theme, onThemeChange }: ClientProfileProps) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showAddChildDialog, setShowAddChildDialog] = useState(false);
  const [showAddAddressDialog, setShowAddAddressDialog] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  
  const [profile, setProfile] = useState({
    name: language === 'ar' ? 'أمل محمود' : 'Amal Mahmoud',
    email: 'amal@example.com',
    phone: '+20 100 123 4567',
    memberSince: '2024-01',
    isVerified: false, // Mock verification status
    verificationStatus: 'not_verified' as 'not_verified' | 'pending' | 'verified'
  });

  const [children, setChildren] = useState<Child[]>([
    {
      id: 1,
      name: language === 'ar' ? 'محمد' : 'Mohamed',
      age: 5,
      notes: language === 'ar' ? 'يحب الألعاب التعليمية' : 'Loves educational games'
    },
    {
      id: 2,
      name: language === 'ar' ? 'سارة' : 'Sara',
      age: 3,
      notes: language === 'ar' ? 'تحب القصص' : 'Loves stories'
    }
  ]);

  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 1,
      title: language === 'ar' ? 'المنزل' : 'Home',
      address: language === 'ar' ? 'المنيا الجديدة، شارع الجامعة، مبنى 5' : 'New Minya, University Street, Building 5'
    }
  ]);

  const [newChild, setNewChild] = useState({ name: '', age: 1, notes: '' });
  const [newAddress, setNewAddress] = useState({ title: '', address: '' });
  const t = translations[language];

  const handleSaveProfile = () => {
    setIsEditingProfile(false);
    alert(language === 'ar' ? 'تم حفظ التغييرات' : 'Changes saved');
  };

  const handleAddChild = () => {
    if (newChild.name) {
      setChildren([...children, { id: Date.now(), ...newChild }]);
      setNewChild({ name: '', age: 1, notes: '' });
      setShowAddChildDialog(false);
    }
  };

  const handleAddAddress = () => {
    if (newAddress.title && newAddress.address) {
      setAddresses([...addresses, { id: Date.now(), ...newAddress }]);
      setNewAddress({ title: '', address: '' });
      setShowAddAddressDialog(false);
    }
  };

  const handleDeleteChild = (id: number) => {
    setChildren(children.filter(child => child.id !== id));
  };

  const handleDeleteAddress = (id: number) => {
    setAddresses(addresses.filter(address => address.id !== id));
  };

  if (showVerification) {
    return (
      <ClientVerification 
        language={language} 
        onBack={() => setShowVerification(false)} 
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pb-8">
      <h1 className="text-[#FB5E7A] mb-6">{t.profile}</h1>

      {/* Profile Header */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 rounded-full bg-[#FFD1DA] flex items-center justify-center relative">
            <User className="w-10 h-10 text-[#FB5E7A]" />
            {profile.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <div>
            <h2 className="text-[#FB5E7A] flex items-center gap-2">
              {profile.name}
              {profile.isVerified && (
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-xs px-2 py-0.5">
                  <Shield className="w-3 h-3 mr-1" />
                  {t.verified}
                </Badge>
              )}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t.memberSince} {profile.memberSince}
            </p>
          </div>
        </div>
      </Card>

      {/* Verification Section */}
      <Card className="p-6 mb-6 border-l-4 border-l-[#FB5E7A]">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#FB5E7A]" />
              {t.verification}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {profile.isVerified 
                ? (language === 'ar' ? 'حسابك موثق بالكامل' : 'Your account is fully verified')
                : t.verificationDesc}
            </p>
          </div>
          <div>
            {profile.isVerified ? (
              <Badge className="bg-green-100 text-green-700 text-sm py-1 px-3">
                {t.verified}
              </Badge>
            ) : profile.verificationStatus === 'pending' ? (
               <Badge className="bg-yellow-100 text-yellow-700 text-sm py-1 px-3">
                {t.pending}
              </Badge>
            ) : (
              <Badge className="bg-gray-100 text-gray-700 text-sm py-1 px-3">
                {t.notVerified}
              </Badge>
            )}
          </div>
        </div>

        {!profile.isVerified && profile.verificationStatus !== 'pending' && (
          <Button 
            onClick={() => setShowVerification(true)}
            className="w-full mt-2 bg-[#FB5E7A] hover:bg-[#e5536e]"
          >
            {t.verifyNow}
            {language === 'ar' ? <ChevronLeft className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 ml-2" />}
          </Button>
        )}
      </Card>

      {/* Personal Information */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3>{t.personalInfo}</h3>
          {!isEditingProfile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditingProfile(true)}
              className="text-[#FB5E7A]"
            >
              <Edit className="w-4 h-4 mr-2" />
              {t.edit}
            </Button>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t.fullName}</Label>
            <Input
              id="name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              disabled={!isEditingProfile}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t.email}</Label>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                disabled={!isEditingProfile}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t.phone}</Label>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <Input
                id="phone"
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                disabled={!isEditingProfile}
              />
            </div>
          </div>

          {isEditingProfile && (
            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleSaveProfile}
                className="flex-1 bg-[#FB5E7A] hover:bg-[#e5536e]"
              >
                {t.save}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditingProfile(false)}
                className="flex-1"
              >
                {t.cancel}
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Children */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3>{t.children}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAddChildDialog(true)}
            className="text-[#FB5E7A]"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t.addChild}
          </Button>
        </div>

        <div className="space-y-3">
          {children.map((child) => (
            <div key={child.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Baby className="w-5 h-5 text-[#FB5E7A] mt-1" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span>{child.name}</span>
                  <Badge variant="outline">{child.age} {t.years}</Badge>
                </div>
                {child.notes && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">{child.notes}</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteChild(child.id)}
                className="text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Addresses */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3>{t.addresses}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAddAddressDialog(true)}
            className="text-[#FB5E7A]"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t.addAddress}
          </Button>
        </div>

        <div className="space-y-3">
          {addresses.map((address) => (
            <div key={address.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <MapPin className="w-5 h-5 text-[#FB5E7A] mt-1" />
              <div className="flex-1">
                <h4 className="mb-1">{address.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{address.address}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteAddress(address.id)}
                className="text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Language Settings */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Languages className="w-5 h-5 text-[#FB5E7A]" />
            <div>
              <h3 className="mb-1">{t.language}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {language === 'ar' ? t.arabic : t.english}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={onLanguageChange}
            className="border-[#FB5E7A] text-[#FB5E7A]"
          >
            {language === 'ar' ? '🇬🇧 EN' : '🇪🇬 AR'}
          </Button>
        </div>
      </Card>

      {/* Theme Settings */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {theme === 'light' ? <Moon className="w-5 h-5 text-[#FB5E7A]" /> : <Sun className="w-5 h-5 text-[#FB5E7A]" />}
            <div>
              <h3 className="mb-1">{t.theme}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {theme === 'light' ? t.lightMode : t.darkMode}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={onThemeChange}
            className="border-[#FB5E7A] text-[#FB5E7A]"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </Button>
        </div>
      </Card>

      {/* Contact Support */}
      <Button
        variant="outline"
        className="w-full mb-4 border-[#FB5E7A] text-[#FB5E7A] hover:bg-[#FB5E7A]/10"
        onClick={() => alert(language === 'ar' ? 'سيتم فتح محادثة مع الدعم الفني' : 'Support chat will open')}
      >
        <Headphones className="w-4 h-4 mr-2" />
        {t.contactSupport}
      </Button>

      {/* Logout Button */}
      <Button
        variant="outline"
        onClick={onLogout}
        className="w-full border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
      >
        <LogOut className="w-4 h-4 mr-2" />
        {t.logout}
      </Button>

      {/* Add Child Dialog */}
      <Dialog open={showAddChildDialog} onOpenChange={setShowAddChildDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.addChild}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="childName">{t.childName}</Label>
              <Input
                id="childName"
                value={newChild.name}
                onChange={(e) => setNewChild({ ...newChild, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="childAge">{t.childAge}</Label>
              <Input
                id="childAge"
                type="number"
                min="0"
                max="18"
                value={newChild.age}
                onChange={(e) => setNewChild({ ...newChild, age: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="childNotes">{t.notes}</Label>
              <Input
                id="childNotes"
                value={newChild.notes}
                onChange={(e) => setNewChild({ ...newChild, notes: e.target.value })}
              />
            </div>
            <Button
              onClick={handleAddChild}
              className="w-full bg-[#FB5E7A] hover:bg-[#e5536e]"
            >
              {t.addChild}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Address Dialog */}
      <Dialog open={showAddAddressDialog} onOpenChange={setShowAddAddressDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.addAddress}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="addressTitle">{t.addressTitle}</Label>
              <Input
                id="addressTitle"
                value={newAddress.title}
                onChange={(e) => setNewAddress({ ...newAddress, title: e.target.value })}
                placeholder={t.home}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addressDetails">{t.addressDetails}</Label>
              <Input
                id="addressDetails"
                value={newAddress.address}
                onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
              />
            </div>
            <Button
              onClick={handleAddAddress}
              className="w-full bg-[#FB5E7A] hover:bg-[#e5536e]"
            >
              {t.addAddress}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}