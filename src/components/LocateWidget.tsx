'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { findClinicsAction, Clinic } from '@/app/actions';
import { MapPin, Phone } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { usePathname } from 'next/navigation';

export function LocateWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const pathname = usePathname();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFindClinics = () => {
    if (navigator.geolocation) {
      setLoading(true);
      setError(null);
      setClinics([]);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (err) => {
          setError('Unable to retrieve your location. Please enable location services.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    if (location) {
      findClinicsAction(location)
        .then((result) => {
          if (result.success && result.data) {
            setClinics(result.data);
          } else {
            setError(result.error || 'Could not find clinics.');
          }
        })
        .catch(() => {
          setError('An unexpected error occurred.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [location]);

  // Reset state when dialog is closed
  useEffect(() => {
    if (!isOpen) {
      setLocation(null);
      setClinics([]);
      setLoading(false);
      setError(null);
    }
  }, [isOpen]);

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard')) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="fixed bottom-24 right-6 z-50">
          <Button variant="outline" className="h-auto w-auto py-3 px-6 rounded-full bg-card hover:bg-stone-100 border-stone-300 shadow-lg text-primary text-lg flex items-center gap-3 transition-transform hover:scale-105">
            Locate Glow Studio
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0">
        <div className='p-6'>
          <DialogHeader>
            <DialogTitle className='text-center text-2xl font-bold font-headline text-primary mb-4'>Find a Glow Studio Clinic Near You</DialogTitle>
          </DialogHeader>
          <div className='text-center'>
            <p className="text-muted-foreground mb-6">
              Use your current location to find the nearest clinic and book your next appointment with us.
            </p>
            <Button onClick={handleFindClinics} disabled={loading} size="lg">
              {loading ? 'Searching...' : 'Find Nearby Clinics'}
            </Button>
            {error && <p className="text-destructive mt-4">{error}</p>}
          </div>
        </div>
        <div className="mt-4 bg-stone-50 p-6 border-t h-96 overflow-y-auto">
          {loading && (
            <div className="space-y-4">
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
            </div>
          )}
          {clinics.length > 0 &&
            <div className='space-y-4'>
              {clinics.map((clinic) => (
                <Card key={clinic.name}>
                  <CardHeader>
                    <CardTitle className="text-lg font-headline">{clinic.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-4">
                      <MapPin className="w-5 h-5 mt-1 text-primary" />
                      <p>{clinic.address}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <Phone className="w-5 h-5 text-primary" />
                      <p>{clinic.phoneNumber}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          }
        </div>
      </DialogContent>
    </Dialog>
  );
}
