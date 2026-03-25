'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { AuthGuardModal } from '@/components/ui/auth-guard-modal';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Checkbox } from '../ui/checkbox';
import { AuthHelper } from '@/lib/auth-helper';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConsentForm } from './consent-form';
import { useLanguage } from '@/context/language-context';

const treatments = [
  'Laser Hair Removal',
  'Laser Skin Care',
  'Micropeeling With DP4',
  'Chemical Peel',
  'Body Sculpting',
  'Facials',
  'Lip Blush',
];

const getFormSchema = (t: any) => z.object({
  name: z.string().min(2, {
    message: t("forms.nameError", 'Name must be at least 2 characters.'),
  }),
  email: z.string().email({
    message: t("forms.emailError", 'Please enter a valid email address.'),
  }),
  mobile: z.string().min(10, {
    message: t("forms.mobileError", 'Mobile number must be at least 10 digits.'),
  }),
  bookingDate: z.date({
    required_error: t("forms.dateError", 'A booking date is required.'),
  }),
  treatment: z.string({
    required_error: t("forms.treatmentError", 'Please select a treatment.'),
  }),
  preferredTreatment: z.string().optional(),
  comments: z.string().optional(),
  recaptcha: z.boolean().default(false).refine(val => val, { message: t("forms.recaptchaError", 'Please confirm you are not a robot.') }),
});

type AppointmentFormData = z.infer<ReturnType<typeof getFormSchema>>;

export default function AppointmentForm() {
  const formImage = PlaceHolderImages.find(
    (img) => img.id === 'appointment-booking'
  );

  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { t } = useLanguage();
  const formSchema = getFormSchema(t);

  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [pendingData, setPendingData] = useState<AppointmentFormData | null>(null);
  const [consentData, setConsentData] = useState<{ isValid: boolean; data: any }>({ isValid: false, data: null });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInteraction = (e: React.SyntheticEvent) => {
    if (isUserLoading || !user) {
      e.preventDefault();
      e.stopPropagation();
      const target = e.target as HTMLElement;
      if (target && typeof target.blur === 'function') {
        target.blur();
      }
      if (!isUserLoading) {
        setShowAuthDialog(true);
      }
    }
  };
  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      mobile: '',
      treatment: undefined,
      preferredTreatment: '',
      comments: '',
      recaptcha: false,
    },
  });

  async function onSubmit(values: AppointmentFormData) {
    // Basic validation for user
    if (!user) {
      setShowAuthDialog(true);
      return;
    }

    // Store form values and open consent modal
    setPendingData(values);
    setShowConsentModal(true);
  }

  async function handleFinalBooking() {
    if (!pendingData || !user || !consentData.isValid) return;

    setIsSubmitting(true);

    try {
      const result = await AuthHelper.addAppointment(pendingData.email, {
        treatment: pendingData.treatment,
        date: format(pendingData.bookingDate, 'yyyy-MM-dd'),
        time: '09:00', // Default time as form doesn't have time picker yet
        mobile: pendingData.mobile,
        preferredTreatment: pendingData.preferredTreatment,
        comments: pendingData.comments,
        // Add consent data
        medicalHistory: consentData.data.medicalHistory,
        consentSigned: consentData.data.consentSigned,
        consentSignature: consentData.data.consentSignature,
        consentDate: consentData.data.consentDate
      });

      if (result.success) {
        toast({
          title: t("appointmentForm.toastRequestedTitle", 'Appointment Requested!'),
          description: t("appointmentForm.toastRequestedDesc", "We've received your request and will contact you shortly to confirm."),
        });
        form.reset();
        setShowConsentModal(false);
        setConsentData({ isValid: false, data: null });
        setPendingData(null);
      } else {
        toast({
          title: t("appointmentForm.toastFailedTitle", 'Booking Failed'),
          description: result.message || t("forms.errorOccurred", "Something went wrong. Please try again."),
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: t("forms.errorTitle", 'Error'),
        description: t("forms.unexpectedError", "An unexpected error occurred."),
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  console.log('AppointmentForm Auth State:', { user: !!user, isUserLoading });

  return (
    <section id="appointment" className="relative z-30 w-full pt-12 md:pt-24 lg:pt-32 pb-6 md:pb-12 lg:pb-16 bg-[#FBF8F3]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 p-8 rounded-lg border border-border bg-card max-w-6xl mx-auto">
          <div className="space-y-6">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold tracking-tighter font-headline text-foreground mb-2">{t("contactForm.title", "Book Your Appointment Today")}</h2>
              <p className="text-muted-foreground">{t("contactForm.description", "Embrace a journey where purity meets luxury, and beauty is redefined. Book your appointment with Lune Advanced Skincare today!")}</p>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 relative"
                onFocusCapture={handleInteraction}
                onClickCapture={handleInteraction}
              >
                {(isUserLoading || !user) && (
                  <div
                    className="absolute inset-0 z-50 cursor-not-allowed"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (!isUserLoading) {
                        setShowAuthDialog(true);
                      }
                    }}
                  />
                )}
                <fieldset disabled={isUserLoading || !user} className="block space-y-4 transition-opacity disabled:opacity-50">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("forms.name", "Name*")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("forms.yourName", "Your Name")} {...field} className="bg-white rounded-lg" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("forms.email", "Email*")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("forms.yourEmail", "Your Email Address")}
                            {...field}
                            className="bg-white rounded-lg"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormItem>
                    <FormLabel>{t("forms.mobile", "Mobile Number*")}</FormLabel>
                    <div className="flex gap-2">
                      <div className="w-16">
                        <Input value="+1" readOnly className="bg-white rounded-lg" />
                      </div>
                      <div className="flex-1">
                        <FormField
                          control={form.control}
                          name="mobile"
                          render={({ field }) => (
                            <FormControl>
                              <Input
                                placeholder={t("forms.yourMobile", "Your Mobile Number")}
                                {...field}
                                className="bg-white rounded-lg"
                              />
                            </FormControl>
                          )}
                        />
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>

                  <FormField
                    control={form.control}
                    name="bookingDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>{t("forms.bookingDate", "Booking Date*")}</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={cn(
                                  'w-full pl-3 text-left font-normal bg-white rounded-lg',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value ? (
                                  format(field.value, 'yyyy-MM-dd')
                                ) : (
                                  <span>YYYY-MM-DD</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date() || date < new Date('1900-01-01')
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="treatment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("forms.treatments", "Treatments*")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white rounded-lg">
                              <SelectValue placeholder={t("forms.selectTreatment", "Select")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {treatments.map((treatment) => (
                              <SelectItem key={treatment} value={treatment}>
                                {t(`services.${treatment.replace(/[^a-zA-Z0-9]/g, '')}`, treatment)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="preferredTreatment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("appointmentForm.preferredTreatment", "Specify your preferred treatment")}</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="bg-white rounded-lg" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="comments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("forms.comments", "Comments")}</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="bg-white rounded-lg" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="recaptcha"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex items-center space-x-4 rounded-md border p-4 bg-white">
                            <Checkbox
                              id="recaptcha"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                            <div className="flex items-center space-x-2">
                              <label htmlFor="recaptcha" className="text-sm font-medium leading-none">
                                {t("forms.notRobot", "I'm not a robot")}
                              </label>
                              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></svg>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">{t("forms.submit", "Submit")}</Button>
                </fieldset>
              </form>
            </Form>
          </div>
          <div className="hidden md:block">
            {formImage && (
              <Image
                src={formImage.imageUrl}
                alt={formImage.description}
                width={600}
                height={750}
                className="rounded-lg object-cover w-full h-full"
                data-ai-hint={formImage.imageHint}
              />
            )}
          </div>
        </div>
      </div>

      <AuthGuardModal
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onConfirm={() => {
          setShowAuthDialog(false);
          router.push('/signup');
        }}
      />

      <Dialog open={showConsentModal} onOpenChange={setShowConsentModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("appointmentForm.completeBooking", "Complete Your Booking")}</DialogTitle>
          </DialogHeader>

          <ConsentForm
            onConsentChange={useCallback((isValid: boolean, data: any) => {
              setConsentData({ isValid, data });
            }, [])}
          />

          <DialogFooter className="mt-6 flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowConsentModal(false)}>
              {t("forms.cancel", "Cancel")}
            </Button>
            <Button
              onClick={handleFinalBooking}
              disabled={!consentData.isValid || isSubmitting}
              className="bg-[#2a3c5f]"
            >
              {isSubmitting ? t("appointmentForm.bookings", "Bookings...") : t("appointmentForm.confirmBooking", "Confirm Booking")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section >
  );
}
