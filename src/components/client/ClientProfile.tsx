import { useState, useEffect } from 'react';
import { User, Baby, MapPin, Phone, Mail, Edit, Plus, Trash2, LogOut, Languages, Moon, Sun, Shield, Check, ChevronRight, ChevronLeft, Headphones, Briefcase } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import ClientVerification from './ClientVerification';
import { useAuthStore } from '../../stores/useAuthStore';
import { childrenService } from '../../services/children';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import type { Language } from '../../App';

interface ClientProfileProps {
  language: Language;
  onLogout: () => void;
  onLanguageChange: () => void;
  theme: 'light' | 'dark';
  onThemeChange: () => void;
}

interface Child {
  id: string;
  name: string;
  age: number;
  gender?: 'male' | 'female';
  notes?: string;
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
    contactSupport: 'تواصل مع الدعم',
    motherJob: 'وظيفة الأم',
    fatherJob: 'وظيفة الأب',
    defaultAddress: 'العنوان الافتراضي',
    loading: 'جاري التحميل...',
    error: 'حدث خطأ',
    success: 'تم بنجاح'
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
    contactSupport: 'Contact Support',
    motherJob: "Mother's Job",
    fatherJob: "Father's Job",
    defaultAddress: 'Default Address',
    loading: 'Loading...',
    error: 'An error occurred',
    success: 'Success'
  }
};

export default function ClientProfile({ language, onLogout, onLanguageChange, theme, onThemeChange }: ClientProfileProps) {
  const { user } = useAuthStore();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showAddChildDialog, setShowAddChildDialog] = useState(false);
  const [showAddAddressDialog, setShowAddAddressDialog] = useState(false);
  const [showVerification, setShowVerification] = useState(false);

  const [profile, setProfile] = useState({
    name: '',
    email: user?.email || '',
    phone: '',
    motherJob: '',
    fatherJob: '',
    defaultAddress: '',
    memberSince: '',
    isVerified: false,
    verificationStatus: 'not_verified' as 'not_verified' | 'pending' | 'verified',
    avatarUrl: ''
  });

  const [children, setChildren] = useState<Child[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const [newChild, setNewChild] = useState({ name: '', age: 1, gender: 'male' as 'male' | 'female', notes: '' });
  const [newAddress, setNewAddress] = useState({ title: '', address: '' });
  const t = translations[language];

  useEffect(() => {
    if (user?.id) {
      loadProfile();
      loadChildren();
    }
  }, [user?.id]);

  const loadProfile = async () => {
    try {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile({
          name: data.full_name || '',
          email: user.email || '',
          phone: data.phone || '',
          motherJob: data.mother_job || '',
          fatherJob: data.father_job || '',
          defaultAddress: data.default_address || '',
          memberSince: new Date(data.created_at).toLocaleDateString(),
          isVerified: data.is_verified || false,
          verificationStatus: data.is_verified ? 'verified' : 'not_verified',
          avatarUrl: data.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'
        });

        // Set default address if exists
        if (data.default_address) {
          setAddresses([{
            id: 1,
            title: language === 'ar' ? 'العنوان الافتراضي' : 'Default Address',
            address: data.default_address
          }]);
        }
      } else {
        // Profile deleted but user logged in? Sign out
        await supabase.auth.signOut();
        window.location.reload(); // Force reload to clear state
      }
    } catch (error) {
      console.error(error);
      toast.error(t.error);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    // Validation
    if (file.size > 5 * 1024 * 1024) {
      toast.error(language === 'ar' ? 'حجم الصورة يجب أن لا يتعدى 5 ميجابايت' : 'Image size must be less than 5MB');
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error(language === 'ar' ? 'يجب أن تكون الصورة بصيغة JPG, PNG أو WebP' : 'Image must be JPG, PNG or WebP');
      return;
    }

    try {
      setIsUploadingAvatar(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      setProfile(prev => ({ ...prev, avatarUrl: publicUrl }));
      toast.success(t.success);
    } catch (error) {
      console.error(error);
      toast.error(t.error);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // ... (children logic same as before) ...

  const loadChildren = async () => {
    try {
      if (!user?.id) return;
      const data = await childrenService.getChildren(user.id);
      setChildren(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      if (!user?.id) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.name,
          phone: profile.phone,
          mother_job: profile.motherJob,
          father_job: profile.fatherJob,
          default_address: profile.defaultAddress
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success(t.success);
      setIsEditingProfile(false);
      loadProfile();
    } catch (error) {
      console.error(error);
      toast.error(t.error);
    }
  };

  const handleAddChild = async () => {
    try {
      if (!newChild.name || !user?.id) return;

      await childrenService.addChild({
        client_id: user.id,
        name: newChild.name,
        age: newChild.age,
        gender: newChild.gender,
        notes: newChild.notes
      });

      toast.success(t.success);
      setNewChild({ name: '', age: 1, gender: 'male', notes: '' });
      setShowAddChildDialog(false);
      loadChildren();
    } catch (error) {
      console.error(error);
      toast.error(t.error);
    }
  };

  const handleAddAddress = () => {
    if (newAddress.title && newAddress.address) {
      setAddresses([...addresses, { id: Date.now(), ...newAddress }]);
      setNewAddress({ title: '', address: '' });
      setShowAddAddressDialog(false);
    }
  };

  const handleDeleteChild = async (id: string) => {
    try {
      await childrenService.deleteChild(id);
      toast.success(t.success);
      loadChildren();
    } catch (error) {
      console.error(error);
      toast.error(t.error);
    }
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
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-950 pt-6 pb-4 -mx-4 px-4 mb-4 border-b border-gray-100 dark:border-gray-800">
        <h1 className="text-[#FB5E7A] text-2xl font-bold">{t.profile}</h1>
      </div>

      {/* Profile Header */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative group">
            <div
              className={`w-20 h-20 rounded-full bg-[#FFD1DA] flex items-center justify-center overflow-hidden border-2 border-transparent group-hover:border-[#FB5E7A] transition-all cursor-pointer ${isUploadingAvatar ? 'opacity-50' : ''}`}
              onClick={() => document.getElementById('client-avatar-input')?.click()}
            >
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-[#FB5E7A]" />
              )}

              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit className="w-6 h-6 text-white" />
              </div>

              {isUploadingAvatar && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-[#FB5E7A] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <input id="client-avatar-input" type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={isUploadingAvatar} />

            <p className="text-[10px] text-gray-500 text-center mt-2 w-24 mx-auto whitespace-normal leading-tight">
              {language === 'ar' ? 'JPG, PNG - بحد أقصى 5 ميجا' : 'JPG, PNG - Max 5MB'}
            </p>

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
              disabled={true}
              className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
            />
            {isEditingProfile && (
              <p className="text-[10px] text-gray-500 mt-1">
                {language === 'ar' ? '* لا يمكن تغيير الاسم' : '* Name cannot be changed'}
              </p>
            )}
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
                disabled={true}
                className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
              />
            </div>
            {isEditingProfile && (
              <p className="text-[10px] text-gray-500 mt-1 ml-6">
                {language === 'ar' ? '* لا يمكن تغيير البريد الإلكتروني' : '* Email cannot be changed'}
              </p>
            )}
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

          <div className="space-y-2">
            <Label htmlFor="motherJob">{t.motherJob}</Label>
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-gray-400" />
              <Input
                id="motherJob"
                value={profile.motherJob}
                onChange={(e) => setProfile({ ...profile, motherJob: e.target.value })}
                disabled={!isEditingProfile}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fatherJob">{t.fatherJob}</Label>
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-gray-400" />
              <Input
                id="fatherJob"
                value={profile.fatherJob}
                onChange={(e) => setProfile({ ...profile, fatherJob: e.target.value })}
                disabled={!isEditingProfile}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultAddress">{t.defaultAddress}</Label>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <Input
                id="defaultAddress"
                value={profile.defaultAddress}
                onChange={(e) => setProfile({ ...profile, defaultAddress: e.target.value })}
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