const fs = require('fs');

const file = 'src/lib/all-services.ts';
let text = fs.readFileSync(file, 'utf-8');

const hook_header = `import { useLanguage } from "@/context/language-context";

export interface Service {
    name: string;
    price: string;
    duration?: string | null;
    treatment: string; // slug
    description?: string;
    sessions?: string;
    priceNote?: string | null;
    note?: string;
    subtitle?: string;
}

export interface ServiceCategory {
    title: string;
    treatmentSlug: string;
    description?: string;
    services: Service[];
}

export function useAllServices() {
    const { t } = useLanguage();

`;

// Remove original interface declarations
text = text.replace(/export interface Service \{[\s\S]*?\}\n/g, '');
text = text.replace(/export interface ServiceCategory \{[\s\S]*?\}\n/g, '');

// Convert exports to consts
text = text.replace(/export const (\w+) =/g, 'const $1 =');

// function to rewrite matched fields
function replaceField(match, field, val) {
    // Generate safe key from value
    const safeKey = 'services.' + val.replace(/[^a-zA-Z0-9]/g, '').slice(0, 30);
    return `${field}: t("${safeKey}", "${val}")`;
}

// Replace fields: name, duration, sessions, note, priceNote, subtitle, title
text = text.replace(/(name|duration|sessions|note|priceNote|subtitle|title):\s*"([^"]+)"/g, replaceField);

const hook_footer = `
    return {
        faceAndNeckServices,
        upperBodyServices,
        lowerBodyServices,
        menServices,
        comboPackages,
        fullBodyPackages,
        fullBodySessionPackages,
        micropeelingServices,
        jellyMaskServices,
        micropeelingPackages,
        facialTreatments,
        hydraFacialTreatments,
        hydraFacialPerks,
        perfectDermaPeel,
        boosters,
        biorepeelTreatments,
        biorepeelPackage,
        cavitationServices,
        radioFrequencyServices,
        vacuumTherapyServices,
        laserLypolysisServices,
        emsServices,
        saunaBlanketServices,
        lipBlushServices,
        laserSkinRejuvenationServices,
        allServicesByCategory,
        allServices
    };
}
`;

fs.writeFileSync(file, hook_header + text.trim() + hook_footer, 'utf-8');
console.log('Conversion successful!');
