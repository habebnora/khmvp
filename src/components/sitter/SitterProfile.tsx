import { useState } from 'react';
import { User, Star, Shield, Award, Edit, Plus, Trash2, LogOut, Phone, Mail, MapPin, Video, Upload, Check, Languages, Moon, Sun, DollarSign, Headphones } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import type { Language } from '../../App';

interface SitterProfileProps {
  language: Language;
  onLogout: () => void;
  onLanguageChange: () => void;
  theme: 'light' | 'dark';
  onThemeChange: () => void;
}

const translations = {
  ar: {
    profile: 'الملف الشخصي',
    personalInfo: 'المعلومات الشخصية',
    verification: 'التوثيق',
    availability: 'الأوقات المتاحة',
    availabilitySettings: 'إعدادات التوفر',
    atHomeOnly: 'متاحة في المنزل فقط',
    outsideOnly: 'متاحة خارج المنزل فقط',
    both: 'متاحة في المنزل وخارج المنزل',
    skills: 'المهارات',
    photos: 'الصور',
    services: 'الخدمات',
    myServices: 'خدماتي',
    fullName: 'الاسم الكامل',
    email: 'البريد الإلكتروني',
    phone: 'رقم الهاتف',
    location: 'الموقع',
    bio: 'نبذة عني',
    experience: 'سنوات الخبرة',
    edit: 'تعديل',
    save: 'حفظ',
    cancel: 'إلغاء',
    verified: 'موثق',
    notVerified: 'غير موثق',
    idCard: 'بطاقة الهوية',
    introVideo: 'فيديو تعريفي',
    certificates: 'الشهادات',
    uploadIdCard: 'رفع بطاقة الهوية',
    uploadVideo: 'رفع فيديو',
    uploadCertificate: 'رفع شهادة',
    addSkill: 'إضافة مهارة',
    skillName: 'اسم المهارة',
    addPhoto: 'إضافة صورة',
    logout: 'تسجيل خروج',
    memberSince: 'عضو منذ',
    rating: 'التقييم',
    reviews: 'تقييم',
    completedJobs: 'جلسة مكتملة',
    egp: 'جنيه',
    delete: 'حذف',
    languages: 'اللغات',
    addLanguage: 'إضافة لغة',
    language: 'اللغة',
    stats: 'الإحصائيات',
    verificationStatus: 'حالة التوثيق',
    pending: 'قيد المراجعة',
    approved: 'موثق',
    rejected: 'مرفوض',
    theme: 'المظهر',
    lightMode: 'الوضع النهاري',
    darkMode: 'الوضع الليلي',
    serviceOutside: 'مرافقة خارج المنزل',
    serviceWeekly: 'جلسات اسبوعية',
    serviceMonthly: 'جلسات شهرية',
    setPrice: 'تحديد سعر الساعة',
    minPriceError: 'سعر الساعة لا يجب أن يقل عن 30 جنيه',
    homeServices: 'خدمات منزلية',
    outsideServices: 'خدمات خارجية',
    contactSupport: 'تواصل مع الدعم'
  },
  en: {
    profile: 'Profile',
    personalInfo: 'Personal Information',
    verification: 'Verification',
    availability: 'Availability',
    availabilitySettings: 'Availability Settings',
    atHomeOnly: 'Available at home only',
    outsideOnly: 'Available outside only',
    both: 'Available at home and outside',
    skills: 'Skills',
    photos: 'Photos',
    services: 'Services',
    myServices: 'My Services',
    fullName: 'Full Name',
    email: 'Email',
    phone: 'Phone Number',
    location: 'Location',
    bio: 'About Me',
    experience: 'Years of Experience',
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',
    verified: 'Verified',
    notVerified: 'Not Verified',
    idCard: 'ID Card',
    introVideo: 'Intro Video',
    certificates: 'Certificates',
    uploadIdCard: 'Upload ID Card',
    uploadVideo: 'Upload Video',
    uploadCertificate: 'Upload Certificate',
    addSkill: 'Add Skill',
    skillName: 'Skill Name',
    addPhoto: 'Add Photo',
    logout: 'Logout',
    memberSince: 'Member Since',
    rating: 'Rating',
    reviews: 'reviews',
    completedJobs: 'completed jobs',
    egp: 'EGP',
    delete: 'Delete',
    languages: 'Languages',
    addLanguage: 'Add Language',
    language: 'Language',
    stats: 'Statistics',
    verificationStatus: 'Verification Status',
    pending: 'Pending Review',
    approved: 'Verified',
    rejected: 'Rejected',
    theme: 'Theme',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    serviceOutside: 'Accompaniment Outside Home',
    serviceWeekly: 'Weekly Sessions',
    serviceMonthly: 'Monthly Sessions',
    setPrice: 'Set Hourly Rate',
    minPriceError: 'Hourly rate must be at least 30 EGP',
    homeServices: 'Home Services',
    outsideServices: 'Outside Services',
    contactSupport: 'Contact Support'
  }
};

export default function SitterProfile({ language, onLogout, onLanguageChange, theme, onThemeChange }: SitterProfileProps) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showAddSkillDialog, setShowAddSkillDialog] = useState(false);
  const t = translations[language];

  const [profile, setProfile] = useState({
    name: language === 'ar' ? 'فاطمة أحمد' : 'Fatima Ahmed',
    email: 'fatima@example.com',
    phone: '+20 100 123 4567',
    location: language === 'ar' ? 'المنيا الجديدة' : 'New Minya',
    bio: language === 'ar'
      ? 'خالة أطفال محترفة مع خبرة تزيد عن 5 سنوات في رعاية الأطفال من مختلف الأعمار.'
      : 'Professional babysitter with over 5 years of experience caring for children of all ages.',
    experience: 5,
    rating: 4.8,
    reviews: 124,
    completedJobs: 156,
    memberSince: '2023-01',
    isVerified: true
  });

  const [skills, setSkills] = useState([
    language === 'ar' ? 'رعاية أطفال' : 'Childcare',
    language === 'ar' ? 'تعليم' : 'Education',
    language === 'ar' ? 'إسعافات أولية' : 'First Aid',
    language === 'ar' ? 'طبخ صحي' : 'Healthy Cooking'
  ]);

  const [languages, setLanguages] = useState(['العربية', 'English']);
  const [newSkill, setNewSkill] = useState('');
  const [availabilityType, setAvailabilityType] = useState<'home' | 'outside' | 'both'>('both');

  // Service Prices
  const [servicePrices, setServicePrices] = useState({
    outside: 50,
    weekly: 40,
    monthly: 35
  });

  const handlePriceChange = (service: 'outside' | 'weekly' | 'monthly', value: string) => {
    const numValue = parseInt(value) || 0;
    setServicePrices(prev => ({ ...prev, [service]: numValue }));
  };

  const handleSaveProfile = () => {
    setIsEditingProfile(false);
    alert(language === 'ar' ? 'تم حفظ التغييرات' : 'Changes saved');
  };

  const handleSaveServices = () => {
    // Validate prices
    if (
      ((availabilityType === 'outside' || availabilityType === 'both') && servicePrices.outside < 30) ||
      ((availabilityType === 'home' || availabilityType === 'both') && (servicePrices.weekly < 30 || servicePrices.monthly < 30))
    ) {
      alert(t.minPriceError);
      return;
    }
    alert(language === 'ar' ? 'تم حفظ أسعار الخدمات' : 'Service prices saved');
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill]);
      setNewSkill('');
      setShowAddSkillDialog(false);
    }
  };

  const handleDeleteSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-8">
      <h1 className="text-[#FB5E7A] mb-6">{t.profile}</h1>

      {/* Profile Header */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-[#FFD1DA] flex items-center justify-center overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
            {profile.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-[#FB5E7A] mb-1">{profile.name}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {t.memberSince} {profile.memberSince}
            </p>
            <div className="flex items-center gap-2">
              {profile.isVerified && (
                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  <Shield className="w-3 h-3 mr-1" />
                  {t.verified}
                </Badge>
              )}
              <Badge variant="outline">
                <Award className="w-3 h-3 mr-1" />
                {language === 'ar' ? 'إسعافات أولية' : 'First Aid'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-[#FB5E7A] mb-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{profile.rating}</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {profile.reviews} {t.reviews}
            </p>
          </div>
          <div className="text-center">
            <div className="text-[#FB5E7A] mb-1">{profile.completedJobs}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t.completedJobs}</p>
          </div>
        </div>
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

          <div className="space-y-2">
            <Label htmlFor="location">{t.location}</Label>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <Input
                id="location"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                disabled={!isEditingProfile}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">{t.bio}</Label>
            <Textarea
              id="bio"
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              disabled={!isEditingProfile}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">{t.experience}</Label>
            <Input
              id="experience"
              type="number"
              value={profile.experience}
              onChange={(e) => setProfile({ ...profile, experience: parseInt(e.target.value) || 0 })}
              disabled={!isEditingProfile}
            />
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

      {/* Availability Settings */}
      <Card className="p-6 mb-6">
        <h3 className="mb-4">{t.availabilitySettings}</h3>
        <div className="space-y-3">
          <div
            onClick={() => setAvailabilityType('home')}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              availabilityType === 'home' ? 'border-[#FB5E7A] bg-[#FFD1DA]/20' : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <h4 className="mb-1">{t.atHomeOnly}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {language === 'ar' ? 'سأكون متاحة للعمل في منزل العميل فقط' : 'I will be available to work at client\'s home only'}
            </p>
          </div>
          <div
            onClick={() => setAvailabilityType('outside')}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              availabilityType === 'outside' ? 'border-[#FB5E7A] bg-[#FFD1DA]/20' : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <h4 className="mb-1">{t.outsideOnly}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {language === 'ar' ? 'سأكون متاحة للعمل خارج المنزل فقط' : 'I will be available to work outside only'}
            </p>
          </div>
          <div
            onClick={() => setAvailabilityType('both')}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              availabilityType === 'both' ? 'border-[#FB5E7A] bg-[#FFD1DA]/20' : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <h4 className="mb-1">{t.both}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {language === 'ar' ? 'سأكون متاحة للعمل في المنزل وخارج المنزل' : 'I will be available to work at home and outside'}
            </p>
          </div>
        </div>
      </Card>

      {/* My Services */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3>{t.myServices}</h3>
          <Button onClick={handleSaveServices} size="sm" className="bg-[#FB5E7A] hover:bg-[#e5536e]">
            {t.save}
          </Button>
        </div>

        <div className="space-y-6">
          {/* Outside Services */}
          {(availabilityType === 'outside' || availabilityType === 'both') && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 border-b pb-2">
                {t.outsideServices}
              </h4>
              <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{t.serviceOutside}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {language === 'ar' ? 'مرافقة الطفل في النادي، التمارين، أو المناسبات الخارجية' : 'Accompanying the child to the club, practice, or events'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <Label className="whitespace-nowrap">{t.setPrice} ({t.egp}):</Label>
                    <Input 
                      type="number" 
                      min="30"
                      value={servicePrices.outside}
                      onChange={(e) => handlePriceChange('outside', e.target.value)}
                      className="w-32"
                    />
                  </div>
                  {servicePrices.outside < 30 && (
                    <p className="text-xs text-red-500">{t.minPriceError}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Home Services */}
          {(availabilityType === 'home' || availabilityType === 'both') && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 border-b pb-2">
                {t.homeServices}
              </h4>
              
              {/* Weekly Sessions */}
              <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{t.serviceWeekly}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {language === 'ar' ? 'جلسات رعاية منتظمة أسبوعياً في منزل العميل' : 'Regular weekly care sessions at the client\'s home'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <Label className="whitespace-nowrap">{t.setPrice} ({t.egp}):</Label>
                    <Input 
                      type="number" 
                      min="30"
                      value={servicePrices.weekly}
                      onChange={(e) => handlePriceChange('weekly', e.target.value)}
                      className="w-32"
                    />
                  </div>
                  {servicePrices.weekly < 30 && (
                    <p className="text-xs text-red-500">{t.minPriceError}</p>
                  )}
                </div>
              </div>

              {/* Monthly Sessions */}
              <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{t.serviceMonthly}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {language === 'ar' ? 'باقات شهرية لرعاية ومتابعة الطفل' : 'Monthly packages for child care and monitoring'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <Label className="whitespace-nowrap">{t.setPrice} ({t.egp}):</Label>
                    <Input 
                      type="number" 
                      min="30"
                      value={servicePrices.monthly}
                      onChange={(e) => handlePriceChange('monthly', e.target.value)}
                      className="w-32"
                    />
                  </div>
                  {servicePrices.monthly < 30 && (
                    <p className="text-xs text-red-500">{t.minPriceError}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Skills */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3>{t.skills}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAddSkillDialog(true)}
            className="text-[#FB5E7A]"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t.addSkill}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <Badge key={index} className="bg-[#FFD1DA] text-[#FB5E7A] pr-1">
              {skill}
              <button
                onClick={() => handleDeleteSkill(index)}
                className="ml-2 hover:text-red-500"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      </Card>

      {/* Languages */}
      <Card className="p-6 mb-6">
        <h3 className="mb-4">{t.languages}</h3>
        <div className="flex flex-wrap gap-2">
          {languages.map((lang, index) => (
            <Badge key={index} variant="outline">{lang}</Badge>
          ))}
        </div>
      </Card>

      {/* Verification */}
      <Card className="p-6 mb-6">
        <h3 className="mb-4">{t.verification}</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-blue-600" />
              <div>
                <h4 className="text-sm">{t.idCard}</h4>
                <p className="text-xs text-gray-500">{t.approved}</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-700">
              <Check className="w-3 h-3 mr-1" />
              {t.verified}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <Video className="w-5 h-5 text-purple-600" />
              <div>
                <h4 className="text-sm">{t.introVideo}</h4>
                <p className="text-xs text-gray-500">{t.approved}</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-700">
              <Check className="w-3 h-3 mr-1" />
              {t.verified}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-yellow-600" />
              <div>
                <h4 className="text-sm">{t.certificates}</h4>
                <p className="text-xs text-gray-500">{language === 'ar' ? '2 شهادات' : '2 certificates'}</p>
              </div>
            </div>
            <Button size="sm" variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              {t.uploadCertificate}
            </Button>
          </div>
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
                {language === 'ar' ? 'العربية' : 'English'}
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
            {theme === 'light' ? t.darkMode : t.lightMode}
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

      {/* Add Skill Dialog */}
      <Dialog open={showAddSkillDialog} onOpenChange={setShowAddSkillDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.addSkill}</DialogTitle>
            <DialogDescription className="sr-only">
              {language === 'ar' ? 'أضف مهارة جديدة لملفك الشخصي' : 'Add a new skill to your profile'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="skillName">{t.skillName}</Label>
              <Input
                id="skillName"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
              />
            </div>
            <Button
              onClick={handleAddSkill}
              className="w-full bg-[#FB5E7A] hover:bg-[#e5536e]"
            >
              {t.addSkill}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}