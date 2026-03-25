'use client';

import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { findClinicsAction, Clinic } from '@/app/actions';
import { MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Skeleton } from '../ui/skeleton';
import { useLanguage } from '@/context/language-context';

export default function FindLocation() {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mapImage = PlaceHolderImages.find((img) => img.id === 'location-map');
  const { t } = useLanguage();

  const handleFindClinics = () => {
    if (navigator.geolocation) {
      setLoading(true);
      setError(null);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (err) => {
          setError(t('findLocation.locationError', 'Unable to retrieve your location. Please enable location services.'));
          setLoading(false);
        }
      );
    } else {
      setError(t('findLocation.geolocationNotSupported', 'Geolocation is not supported by this browser.'));
    }
  };

  useEffect(() => {
    if (location) {
      findClinicsAction(location)
        .then((result) => {
          if (result.success && result.data) {
            setClinics(result.data);
          } else {
            setError(result.error || t('findLocation.notFoundError', 'Could not find clinics.'));
          }
        })
        .catch(() => {
          setError(t('findLocation.unexpectedError', 'An unexpected error occurred.'));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [location]);

  return (
    <section id="contact" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tighter font-headline mb-4 sm:text-4xl">{t("findLocation.title", "Find a Lune Clinic Near You")}</h2>
            <p className="text-muted-foreground mb-8">
              {t("findLocation.description", "Use your current location to find the nearest clinic and book your next appointment with us.")}
            </p>
            <Button onClick={handleFindClinics} disabled={loading} size="lg">
              {loading ? t("findLocation.searching", "Searching...") : t("findLocation.findNearby", "Find Nearby Clinics")}
            </Button>
            {error && <p className="text-destructive mt-4">{error}</p>}
            <div className="mt-8 space-y-4">
              {loading && (
                <>
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </>
              )}
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
          </div>
          <div>
            {mapImage && (
              <Image
                src={mapImage.imageUrl}
                alt={mapImage.description}
                width={600}
                height={600}
                className="rounded-lg object-cover w-full h-full"
                data-ai-hint={mapImage.imageHint}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
