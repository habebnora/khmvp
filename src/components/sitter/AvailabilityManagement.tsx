import { useState } from 'react';
import { ArrowLeft, ArrowRight, Calendar, Clock, Save, Plus, Trash2, Check, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Calendar as CalendarComponent } from '../ui/calendar';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import type { Language } from '../../App';

const translations = {
  ar: {
    back: 'رجوع',
    availabilityManagement: 'إدارة المواعيد المتاحة',
    selectDays: 'اختاري الأيام',
    selectDaysDesc: 'اختاري الأيام الي حابة تشتغلي فيها',
    selectedDays: 'الأيام المختارة',
    daySchedule: 'مواعيد اليوم',
    availableFrom: 'متاحة من',
    availableTo: 'إلى',
    addTimeSlot: 'إضافة وقت',
    removeTimeSlot: 'حذف',
    saveSchedule: 'حفظ المواعيد',
    bookedDays: 'أيام محجوزة',
    availableDays: 'أيام متاحة',
    unavailableDays: 'أيام غير متاحة',
    morning: 'صباحاً',
    evening: 'مساءً',
    allDay: 'طوال اليوم',
    customTime: 'وقت مخصص',
    noTimeSlotsYet: 'لم يتم تحديد أوقات بعد',
    mondayShort: 'الإثنين',
    tuesdayShort: 'الثلاثاء',
    wednesdayShort: 'الأربعاء',
    thursdayShort: 'الخميس',
    fridayShort: 'الجمعة',
    saturdayShort: 'السبت',
    sundayShort: 'الأحد',
    saved: 'تم الحفظ',
    invalidTime: 'الوقت غير صحيح',
    repeatWeekly: 'تكرار أسبوعياً',
    applyToAllDays: 'تطبيق على كل الأيام',
    clearAll: 'مسح الكل',
    quickPresets: 'إعدادات سريعة',
    morningShift: 'صباحي (8ص - 2م)',
    eveningShift: 'مسائي (2م - 8م)',
    fullDay: 'يوم كامل (8ص - 8م)',
  },
  en: {
    back: 'Back',
    availabilityManagement: 'Availability Management',
    selectDays: 'Select Days',
    selectDaysDesc: 'Select the days you want to work',
    selectedDays: 'Selected Days',
    daySchedule: 'Day Schedule',
    availableFrom: 'Available From',
    availableTo: 'To',
    addTimeSlot: 'Add Time',
    removeTimeSlot: 'Remove',
    saveSchedule: 'Save Schedule',
    bookedDays: 'Booked Days',
    availableDays: 'Available Days',
    unavailableDays: 'Unavailable Days',
    morning: 'AM',
    evening: 'PM',
    allDay: 'All Day',
    customTime: 'Custom Time',
    noTimeSlotsYet: 'No time slots set yet',
    mondayShort: 'Monday',
    tuesdayShort: 'Tuesday',
    wednesdayShort: 'Wednesday',
    thursdayShort: 'Thursday',
    fridayShort: 'Friday',
    saturdayShort: 'Saturday',
    sundayShort: 'Sunday',
    saved: 'Saved',
    invalidTime: 'Invalid Time',
    repeatWeekly: 'Repeat Weekly',
    applyToAllDays: 'Apply to All Days',
    clearAll: 'Clear All',
    quickPresets: 'Quick Presets',
    morningShift: 'Morning (8AM - 2PM)',
    eveningShift: 'Evening (2PM - 8PM)',
    fullDay: 'Full Day (8AM - 8PM)',
  }
};

interface TimeSlot {
  id: string;
  from: string;
  to: string;
}

interface DaySchedule {
  date: Date;
  timeSlots: TimeSlot[];
}

interface AvailabilityManagementProps {
  language: Language;
  onBack?: () => void;
}

export default function AvailabilityManagement({ language, onBack }: AvailabilityManagementProps) {
  const [selectedDates, setSelectedDates] = useState<Date[] | undefined>(undefined);
  const [schedules, setSchedules] = useState<Record<string, TimeSlot[]>>({});
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const [repeatWeekly, setRepeatWeekly] = useState(false);
  const t = translations[language];

  // Mock booked dates (dates with confirmed bookings)
  const bookedDates = [
    new Date(2024, 10, 25),
    new Date(2024, 10, 26),
    new Date(2024, 11, 5),
  ];

  const getDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const currentDate = selectedDates?.[currentDateIndex];
  const currentDateKey = currentDate ? getDateKey(currentDate) : '';
  const currentTimeSlots = currentDateKey ? schedules[currentDateKey] || [] : [];

  const addTimeSlot = () => {
    if (!currentDateKey) return;
    
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      from: '09:00',
      to: '17:00',
    };

    setSchedules(prev => ({
      ...prev,
      [currentDateKey]: [...(prev[currentDateKey] || []), newSlot]
    }));
  };

  const removeTimeSlot = (slotId: string) => {
    if (!currentDateKey) return;
    
    setSchedules(prev => ({
      ...prev,
      [currentDateKey]: prev[currentDateKey].filter(slot => slot.id !== slotId)
    }));
  };

  const updateTimeSlot = (slotId: string, field: 'from' | 'to', value: string) => {
    if (!currentDateKey) return;
    
    setSchedules(prev => ({
      ...prev,
      [currentDateKey]: prev[currentDateKey].map(slot =>
        slot.id === slotId ? { ...slot, [field]: value } : slot
      )
    }));
  };

  const applyPreset = (preset: 'morning' | 'evening' | 'fullDay') => {
    if (!currentDateKey) return;

    const presets = {
      morning: [{ id: Date.now().toString(), from: '08:00', to: '14:00' }],
      evening: [{ id: Date.now().toString(), from: '14:00', to: '20:00' }],
      fullDay: [{ id: Date.now().toString(), from: '08:00', to: '20:00' }],
    };

    setSchedules(prev => ({
      ...prev,
      [currentDateKey]: presets[preset]
    }));
  };

  const applyToAllDays = () => {
    if (!currentDateKey || !selectedDates) return;

    const currentSlots = schedules[currentDateKey];
    if (!currentSlots || currentSlots.length === 0) return;

    const newSchedules = { ...schedules };
    selectedDates.forEach(date => {
      const dateKey = getDateKey(date);
      newSchedules[dateKey] = currentSlots.map(slot => ({
        ...slot,
        id: Date.now().toString() + Math.random()
      }));
    });

    setSchedules(newSchedules);
  };

  const clearAll = () => {
    setSchedules({});
    setSelectedDates(undefined);
  };

  const saveSchedule = () => {
    // In real app, this would save to backend
    console.log('Saving schedules:', schedules);
    alert(t.saved);
  };

  const getDayName = (date: Date) => {
    const days = [
      t.sundayShort,
      t.mondayShort,
      t.tuesdayShort,
      t.wednesdayShort,
      t.thursdayShort,
      t.fridayShort,
      t.saturdayShort,
    ];
    return days[date.getDay()];
  };

  const formatDate = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return language === 'ar' 
      ? `${day}/${month}/${year}`
      : `${month}/${day}/${year}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button
                onClick={onBack}
                variant="ghost"
                className="p-2"
              >
                {language === 'ar' ? <ArrowRight className="size-5" /> : <ArrowLeft className="size-5" />}
              </Button>
            )}
            <div className="flex-1">
              <h1 className="text-xl">{t.availabilityManagement}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t.selectDaysDesc}</p>
            </div>
            <Button
              onClick={saveSchedule}
              className="bg-[#FB5E7A] hover:bg-[#e5536e]"
            >
              <Save className="size-4" />
              {t.saveSchedule}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar Section */}
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg mb-2">{t.selectDays}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {t.selectDaysDesc}
                </p>
              </div>

              <CalendarComponent
                mode="multiple"
                selected={selectedDates}
                onSelect={setSelectedDates}
                disabled={(date) => {
                  // Disable past dates
                  if (date < new Date(new Date().setHours(0, 0, 0, 0))) return true;
                  // Disable booked dates
                  return bookedDates.some(bookedDate => 
                    getDateKey(bookedDate) === getDateKey(date)
                  );
                }}
                modifiers={{
                  booked: bookedDates
                }}
                modifiersClassNames={{
                  booked: 'bg-gray-300 text-gray-500 line-through'
                }}
                className="rounded-md border mx-auto"
              />

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#FB5E7A] rounded-full" />
                  <span className="text-sm">{t.selectedDays}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-300 rounded-full" />
                  <span className="text-sm">{t.bookedDays}</span>
                </div>
              </div>

              {selectedDates && selectedDates.length > 0 && (
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <Checkbox
                      id="repeat-weekly"
                      checked={repeatWeekly}
                      onCheckedChange={(checked) => setRepeatWeekly(checked as boolean)}
                    />
                    <Label htmlFor="repeat-weekly" className="text-sm cursor-pointer">
                      {t.repeatWeekly}
                    </Label>
                  </div>
                  <Button
                    onClick={clearAll}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <X className="size-4" />
                    {t.clearAll}
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Time Slots Section */}
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg mb-2">{t.daySchedule}</h2>
                {selectedDates && selectedDates.length > 0 ? (
                  <div className="flex gap-2 flex-wrap">
                    {selectedDates.map((date, index) => (
                      <Button
                        key={getDateKey(date)}
                        onClick={() => setCurrentDateIndex(index)}
                        variant={currentDateIndex === index ? "default" : "outline"}
                        size="sm"
                        className={currentDateIndex === index ? "bg-[#FB5E7A] hover:bg-[#e5536e]" : ""}
                      >
                        <div className="text-center">
                          <div className="text-xs">{getDayName(date)}</div>
                          <div className="text-xs">{formatDate(date)}</div>
                        </div>
                        {schedules[getDateKey(date)]?.length > 0 && (
                          <Check className="size-3" />
                        )}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t.selectDaysDesc}
                  </p>
                )}
              </div>

              {currentDate && (
                <div className="space-y-4">
                  {/* Quick Presets */}
                  <div>
                    <Label className="text-sm mb-2 block">{t.quickPresets}</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        onClick={() => applyPreset('morning')}
                        variant="outline"
                        size="sm"
                      >
                        {t.morningShift}
                      </Button>
                      <Button
                        onClick={() => applyPreset('evening')}
                        variant="outline"
                        size="sm"
                      >
                        {t.eveningShift}
                      </Button>
                      <Button
                        onClick={() => applyPreset('fullDay')}
                        variant="outline"
                        size="sm"
                      >
                        {t.fullDay}
                      </Button>
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div className="space-y-3 border-t pt-4">
                    {currentTimeSlots.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Clock className="size-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">{t.noTimeSlotsYet}</p>
                      </div>
                    ) : (
                      currentTimeSlots.map((slot) => (
                        <div key={slot.id} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex-1 grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs">{t.availableFrom}</Label>
                              <Input
                                type="time"
                                value={slot.from}
                                onChange={(e) => updateTimeSlot(slot.id, 'from', e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">{t.availableTo}</Label>
                              <Input
                                type="time"
                                value={slot.to}
                                onChange={(e) => updateTimeSlot(slot.id, 'to', e.target.value)}
                                className="mt-1"
                              />
                            </div>
                          </div>
                          <Button
                            onClick={() => removeTimeSlot(slot.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      ))
                    )}

                    <Button
                      onClick={addTimeSlot}
                      variant="outline"
                      className="w-full"
                    >
                      <Plus className="size-4" />
                      {t.addTimeSlot}
                    </Button>

                    {currentTimeSlots.length > 0 && selectedDates && selectedDates.length > 1 && (
                      <Button
                        onClick={applyToAllDays}
                        variant="outline"
                        className="w-full"
                      >
                        <Check className="size-4" />
                        {t.applyToAllDays}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Summary */}
        {selectedDates && selectedDates.length > 0 && (
          <Card className="mt-6 p-6">
            <h3 className="text-lg mb-4">{t.selectedDays}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedDates.map((date) => {
                const dateKey = getDateKey(date);
                const slots = schedules[dateKey] || [];
                return (
                  <div key={dateKey} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-sm">{getDayName(date)}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">{formatDate(date)}</div>
                      </div>
                      {slots.length > 0 ? (
                        <Badge className="bg-green-500">{slots.length} {t.addTimeSlot}</Badge>
                      ) : (
                        <Badge variant="outline">{t.noTimeSlotsYet}</Badge>
                      )}
                    </div>
                    {slots.length > 0 && (
                      <div className="space-y-1 text-xs">
                        {slots.map(slot => (
                          <div key={slot.id} className="flex items-center gap-2">
                            <Clock className="size-3" />
                            <span>{slot.from} - {slot.to}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}