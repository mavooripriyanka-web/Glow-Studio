'use server';

import { locateNearbyClinics } from '@/ai/flows/locate-nearby-clinics';
import { z } from 'zod';

const ClinicSchema = z.object({
  name: z.string(),
  address: z.string(),
  phoneNumber: z.string(),
});

export type Clinic = z.infer<typeof ClinicSchema>;

const LocationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

export async function findClinicsAction(location: {
  latitude: number;
  longitude: number;
}) {
  try {
    const validatedLocation = LocationSchema.parse(location);
    const locationString = JSON.stringify(validatedLocation);

    const result = await locateNearbyClinics({ userLocation: locationString });

    if (result && result.clinicLocations) {
      const parsedClinics = JSON.parse(result.clinicLocations);
      const validatedClinics = z.array(ClinicSchema).parse(parsedClinics);
      return { success: true, data: validatedClinics };
    }
    return { success: false, error: 'Failed to get a valid response.' };
  } catch (error) {
    console.error('Error in findClinicsAction:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid data format.' };
    }
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
