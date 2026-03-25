'use client';

import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

export interface Service {
  name: string;
  price: string;
  duration?: string | null;
  treatment: string;
}

interface AppointmentContextType {
  services: Service[];
  addService: (service: Service) => void;
  removeService: (serviceName: string) => void;
  clearCurrentServices: () => void;
  isServiceAdded: (serviceName: string) => boolean;
  totalPrice: number;
  totalDurationInMinutes: number;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

// Helper to parse price string like "$40–$55" or "$250"
const parsePrice = (priceStr: string): number => {
  if (!priceStr) return 0;
  const cleaned = priceStr.replace('CA', '').replace('$', '');
  if (cleaned.includes('–')) {
    // It's a range, take the average
    const [min, max] = cleaned.split('–').map(Number);
    return (min + max) / 2;
  }
  return parseFloat(cleaned) || 0;
};

// Helper to parse duration string like "30 min" or "1 hr 30 min"
const parseDuration = (durationStr?: string | null): number => {
  if (!durationStr) return 0;
  let totalMinutes = 0;
  const hourMatch = durationStr.match(/(\d+)\s*hr/i);
  const hoursMatch = durationStr.match(/(\d+)\s*Hours/i);
  const minMatch = durationStr.match(/(\d+)\s*min/i);
  if (hourMatch) {
    totalMinutes += parseInt(hourMatch[1], 10) * 60;
  }
  if (hoursMatch) {
    totalMinutes += parseInt(hoursMatch[1], 10) * 60;
  }
  if (minMatch) {
    totalMinutes += parseInt(minMatch[1], 10);
  }
  return totalMinutes;
};


export function AppointmentProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>([]);

  // Defined early to avoid ReferenceErrors
  const clearCurrentServices = useCallback(() => {
    setServices([]);
  }, []);

  const addService = useCallback((service: Service) => {
    setServices((prev) => {
      // Avoid adding duplicates
      if (prev.some(s => s.name === service.name)) {
        return prev;
      }
      return [...prev, service];
    });
  }, []);

  const removeService = useCallback((serviceName: string) => {
    setServices((prev) => prev.filter((s) => s.name !== serviceName));
  }, []);

  const isServiceAdded = useCallback((serviceName: string) => {
    return services.some(s => s.name === serviceName);
  }, [services]);

  const totalPrice = services.reduce((total, service) => total + parsePrice(service.price), 0);
  const totalDurationInMinutes = services.reduce((total, service) => total + parseDuration(service.duration), 0);

  return (
    <AppointmentContext.Provider value={{ services, addService, removeService, clearCurrentServices, isServiceAdded, totalPrice, totalDurationInMinutes }}>
      {children}
    </AppointmentContext.Provider>
  );
}

export function useAppointment() {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointment must be used within an AppointmentProvider');
  }
  return context;
}
