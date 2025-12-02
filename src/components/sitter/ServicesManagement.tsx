import { useState } from 'react';
import { ArrowLeft, ArrowRight, DollarSign, Save, Plus, Trash2, Clock, Calendar, CalendarDays } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Checkbox } from '../ui/checkbox';
import type { Language } from '../../App';

const translations = {
  ar: {
    back: 'رجوع',
    servicesManagement: 'إدارة الخدمات والأسعار',
    serviceType: 'نوع الخدمة',
    hourlyUrgent: 'ساعات فردية (مستعجل)',
    weeklyContract: 'دوام أسبوعي',
    monthlyContract: 'دوام شهري',
    pricePerHour: 'السعر بالساعة',
    pricePerWeek: 'السعر الأسبوعي',
    pricePerMonth: 'السعر الشهري',
    description: 'وصف الخدمة',
    minimumHours: 'الحد الأدنى للساعات',
    features: 'مميزات الخدمة',
    addFeature: 'إضافة ميزة',
    feature: 'ميزة',
    saveServices: 'حفظ الخدمات',
    egp: 'جنيه',
    hours: 'ساعات',
    perHour: 'بالساعة',
    perWeek: 'أسبوعياً',
    perMonth: 'شهرياً',
    serviceActive: 'الخدمة متاحة',
    serviceInactive: 'الخدمة غير متاحة',
    enableService: 'تفعيل الخدمة',
    saved: 'تم الحفظ بنجاح',
    hourlyDesc: 'خدمة الساعات الفردية للحالات المستعجلة',
    weeklyDesc: 'عقد أسبوعي بعدد ساعات محدد في الأسبوع',
    monthlyDesc: 'عقد شهري بنظام دوام كامل',
    minimumWeeklyHours: 'الحد الأدنى للساعات الأسبوعية',
    minimumMonthlyHours: 'الحد الأدنى للساعات الشهرية',
  },
  en: {
    back: 'Back',
    servicesManagement: 'Services & Pricing Management',
    serviceType: 'Service Type',
    hourlyUrgent: 'Hourly (Urgent)',
    weeklyContract: 'Weekly Contract',
    monthlyContract: 'Monthly Contract',
    pricePerHour: 'Price Per Hour',
    pricePerWeek: 'Weekly Price',
    pricePerMonth: 'Monthly Price',
    description: 'Service Description',
    minimumHours: 'Minimum Hours',
    features: 'Service Features',
    addFeature: 'Add Feature',
    feature: 'Feature',
    saveServices: 'Save Services',
    egp: 'EGP',
    hours: 'hours',
    perHour: 'per hour',
    perWeek: 'per week',
    perMonth: 'per month',
    serviceActive: 'Service Active',
    serviceInactive: 'Service Inactive',
    enableService: 'Enable Service',
    saved: 'Saved Successfully',
    hourlyDesc: 'Hourly service for urgent cases',
    weeklyDesc: 'Weekly contract with specific hours per week',
    monthlyDesc: 'Monthly contract with full-time schedule',
    minimumWeeklyHours: 'Minimum Weekly Hours',
    minimumMonthlyHours: 'Minimum Monthly Hours',
  }
};

interface ServicePricing {
  enabled: boolean;
  price: number;
  minimumHours: number;
  description: string;
  features: string[];
}

interface ServicesManagementProps {
  language: Language;
  onBack: () => void;
}

export default function ServicesManagement({ language, onBack }: ServicesManagementProps) {
  const [hourlyService, setHourlyService] = useState<ServicePricing>({
    enabled: true,
    price: 50,
    minimumHours: 3,
    description: '',
    features: ['رعاية أطفال', 'متاحة في أي وقت', 'استجابة سريعة']
  });

  const [weeklyService, setWeeklyService] = useState<ServicePricing>({
    enabled: true,
    price: 1200,
    minimumHours: 20,
    description: '',
    features: ['20 ساعة أسبوعياً', 'جدول ثابت', 'أولوية في الحجز']
  });

  const [monthlyService, setMonthlyService] = useState<ServicePricing>({
    enabled: false,
    price: 4000,
    minimumHours: 160,
    description: '',
    features: ['دوام كامل', 'جدول مرن', 'خصم 20%']
  });

  const t = translations[language];

  const [newHourlyFeature, setNewHourlyFeature] = useState('');
  const [newWeeklyFeature, setNewWeeklyFeature] = useState('');
  const [newMonthlyFeature, setNewMonthlyFeature] = useState('');

  const addFeature = (serviceType: 'hourly' | 'weekly' | 'monthly') => {
    if (serviceType === 'hourly' && newHourlyFeature.trim()) {
      setHourlyService(prev => ({
        ...prev,
        features: [...prev.features, newHourlyFeature.trim()]
      }));
      setNewHourlyFeature('');
    } else if (serviceType === 'weekly' && newWeeklyFeature.trim()) {
      setWeeklyService(prev => ({
        ...prev,
        features: [...prev.features, newWeeklyFeature.trim()]
      }));
      setNewWeeklyFeature('');
    } else if (serviceType === 'monthly' && newMonthlyFeature.trim()) {
      setMonthlyService(prev => ({
        ...prev,
        features: [...prev.features, newMonthlyFeature.trim()]
      }));
      setNewMonthlyFeature('');
    }
  };

  const removeFeature = (serviceType: 'hourly' | 'weekly' | 'monthly', index: number) => {
    if (serviceType === 'hourly') {
      setHourlyService(prev => ({
        ...prev,
        features: prev.features.filter((_, i) => i !== index)
      }));
    } else if (serviceType === 'weekly') {
      setWeeklyService(prev => ({
        ...prev,
        features: prev.features.filter((_, i) => i !== index)
      }));
    } else if (serviceType === 'monthly') {
      setMonthlyService(prev => ({
        ...prev,
        features: prev.features.filter((_, i) => i !== index)
      }));
    }
  };

  const saveServices = () => {
    // In real app, this would save to backend
    console.log('Saving services:', {
      hourly: hourlyService,
      weekly: weeklyService,
      monthly: monthlyService
    });
    alert(t.saved);
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
              <h1 className="text-xl">{t.servicesManagement}</h1>
            </div>
            <Button
              onClick={saveServices}
              className="bg-[#FB5E7A] hover:bg-[#e5536e]"
            >
              <Save className="size-4" />
              {t.saveServices}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Hourly Service */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#FB5E7A]/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-[#FB5E7A]" />
                </div>
                <div>
                  <h2 className="text-lg">{t.hourlyUrgent}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t.hourlyDesc}</p>
                </div>
              </div>
              <Checkbox
                id="hourly-enabled"
                checked={hourlyService.enabled}
                onCheckedChange={(checked) => setHourlyService(prev => ({ ...prev, enabled: checked as boolean }))}
              />
            </div>

            {hourlyService.enabled && (
              <div className="space-y-4 border-t pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>{t.pricePerHour}</Label>
                    <div className="relative mt-2">
                      <Input
                        type="number"
                        value={hourlyService.price}
                        onChange={(e) => setHourlyService(prev => ({ ...prev, price: Number(e.target.value) }))}
                        className="pr-16"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                        {t.egp}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label>{t.minimumHours}</Label>
                    <div className="relative mt-2">
                      <Input
                        type="number"
                        value={hourlyService.minimumHours}
                        onChange={(e) => setHourlyService(prev => ({ ...prev, minimumHours: Number(e.target.value) }))}
                        className="pr-16"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                        {t.hours}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>{t.description}</Label>
                  <Textarea
                    value={hourlyService.description}
                    onChange={(e) => setHourlyService(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-2"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>{t.features}</Label>
                  <div className="space-y-2 mt-2">
                    {hourlyService.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <span className="flex-1 text-sm">{feature}</span>
                        <Button
                          onClick={() => removeFeature('hourly', index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        value={newHourlyFeature}
                        onChange={(e) => setNewHourlyFeature(e.target.value)}
                        placeholder={t.feature}
                        onKeyPress={(e) => e.key === 'Enter' && addFeature('hourly')}
                      />
                      <Button onClick={() => addFeature('hourly')} variant="outline">
                        <Plus className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Weekly Service */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-lg">{t.weeklyContract}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t.weeklyDesc}</p>
                </div>
              </div>
              <Checkbox
                id="weekly-enabled"
                checked={weeklyService.enabled}
                onCheckedChange={(checked) => setWeeklyService(prev => ({ ...prev, enabled: checked as boolean }))}
              />
            </div>

            {weeklyService.enabled && (
              <div className="space-y-4 border-t pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>{t.pricePerWeek}</Label>
                    <div className="relative mt-2">
                      <Input
                        type="number"
                        value={weeklyService.price}
                        onChange={(e) => setWeeklyService(prev => ({ ...prev, price: Number(e.target.value) }))}
                        className="pr-16"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                        {t.egp}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label>{t.minimumWeeklyHours}</Label>
                    <div className="relative mt-2">
                      <Input
                        type="number"
                        value={weeklyService.minimumHours}
                        onChange={(e) => setWeeklyService(prev => ({ ...prev, minimumHours: Number(e.target.value) }))}
                        className="pr-16"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                        {t.hours}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>{t.description}</Label>
                  <Textarea
                    value={weeklyService.description}
                    onChange={(e) => setWeeklyService(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-2"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>{t.features}</Label>
                  <div className="space-y-2 mt-2">
                    {weeklyService.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <span className="flex-1 text-sm">{feature}</span>
                        <Button
                          onClick={() => removeFeature('weekly', index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        value={newWeeklyFeature}
                        onChange={(e) => setNewWeeklyFeature(e.target.value)}
                        placeholder={t.feature}
                        onKeyPress={(e) => e.key === 'Enter' && addFeature('weekly')}
                      />
                      <Button onClick={() => addFeature('weekly')} variant="outline">
                        <Plus className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Monthly Service */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CalendarDays className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h2 className="text-lg">{t.monthlyContract}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t.monthlyDesc}</p>
                </div>
              </div>
              <Checkbox
                id="monthly-enabled"
                checked={monthlyService.enabled}
                onCheckedChange={(checked) => setMonthlyService(prev => ({ ...prev, enabled: checked as boolean }))}
              />
            </div>

            {monthlyService.enabled && (
              <div className="space-y-4 border-t pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>{t.pricePerMonth}</Label>
                    <div className="relative mt-2">
                      <Input
                        type="number"
                        value={monthlyService.price}
                        onChange={(e) => setMonthlyService(prev => ({ ...prev, price: Number(e.target.value) }))}
                        className="pr-16"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                        {t.egp}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label>{t.minimumMonthlyHours}</Label>
                    <div className="relative mt-2">
                      <Input
                        type="number"
                        value={monthlyService.minimumHours}
                        onChange={(e) => setMonthlyService(prev => ({ ...prev, minimumHours: Number(e.target.value) }))}
                        className="pr-16"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                        {t.hours}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>{t.description}</Label>
                  <Textarea
                    value={monthlyService.description}
                    onChange={(e) => setMonthlyService(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-2"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>{t.features}</Label>
                  <div className="space-y-2 mt-2">
                    {monthlyService.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <span className="flex-1 text-sm">{feature}</span>
                        <Button
                          onClick={() => removeFeature('monthly', index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        value={newMonthlyFeature}
                        onChange={(e) => setNewMonthlyFeature(e.target.value)}
                        placeholder={t.feature}
                        onKeyPress={(e) => e.key === 'Enter' && addFeature('monthly')}
                      />
                      <Button onClick={() => addFeature('monthly')} variant="outline">
                        <Plus className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
