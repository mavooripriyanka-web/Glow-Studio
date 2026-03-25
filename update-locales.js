const fs = require('fs');
const path = require('path');

const frenchDict = {
    "Full Face": "Visage complet",
    "45 min": "45 min",
    "Cheeks": "Joues",
    "30 min": "30 min",
    "Upper Lip": "Lèvre supérieure",
    "15 min": "15 min",
    "Chin": "Menton",
    "Jawline": "Mâchoire",
    "Forehead": "Front",
    "Neck": "Cou",
    "Underarms": "Aisselles",
    "Half Arms": "Demi-bras",
    "Full Arms": "Bras complets",
    "60 min": "60 min",
    "Stomach": "Ventre",
    "Half Back": "Demi-dos",
    "Full Back": "Dos complet",
    "(not included in full body package)": "(non inclus dans le forfait corps complet)",
    "Full Bikini": "Bikini intégral",
    "Butt Cheeks": "Fesses",
    "Belly Line": "Ligne du ventre",
    "Half Legs": "Demi-jambes",
    "Full Legs": "Jambes complètes",
    "Beard Contour": "Contour de la barbe",
    "Men's Upper Body": "Haut du corps (Hommes)",
    "90 min": "90 min",
    "Full Bikini & Underarms": "Bikini intégral et Aisselles",
    "Full Legs & Underarms": "Jambes complètes et Aisselles",
    "Full Legs & Full Bikini": "Jambes complètes et Bikini intégral",
    "Full Legs, Full Bikini, Full Face & Underarms": "Jambes compl., Bikini int., Visage compl. et Aisselles",
    "Lower Legs & Underarms": "Demi-jambes et Aisselles",
    "Lower Legs & Full Arms": "Demi-jambes et Bras complets",
    "Lower Legs, Full Bikini & Underarms": "Demi-jambes, Bikini int. et Aisselles",
    "Full Face & Underarms": "Visage complet et Aisselles",
    "Full Arms & Underarms": "Bras complets et Aisselles",
    "Full Body Women (Per session)": "Corps complet Femmes (Par séance)",
    "120 min": "120 min",
    "(Excludes Stomach & Back)": "(Exclut Ventre & Dos)",
    "Full Body Women (4 Sessions)": "Corps complet Femmes (4 Séances)",
    "4 Sessions": "4 Séances",
    "Full Body Women (6 Sessions)": "Corps complet Femmes (6 Séances)",
    "6 Sessions": "6 Séances",
    "Full Body Women (8 Sessions)": "Corps complet Femmes (8 Séances)",
    "8 Sessions": "8 Séances",
    "Micropeeling (Face)": "Micropeeling (Visage)",
    "75 min": "75 min",
    "Micropeeling (Face & Neck)": "Micropeeling (Visage & Cou)",
    "Micropeeling (Face, Neck & Décolleté)": "Micropeeling (Visage, Cou & Décolleté)",
    "Micropeeling Full Back": "Micropeeling Dos complet",
    "Micropeeling on a Medium body part": "Micropeeling sur une zone moyenne du corps",
    "Micropeeling on a Large body part": "Micropeeling sur une grande zone du corps",
    "Micropeeling with Jelly Mask (Face)": "Micropeeling avec Masque en Gelée (Visage)",
    "1hr 15 min": "1h 15 min",
    "Jelly Mask (Face)": "Masque en Gelée (Visage)",
    "Jelly Mask (Face & Neck)": "Masque en Gelée (Visage & Cou)",
    "Jelly Mask (Face, Neck & Décolleté)": "Masque en Gelée (Visage, Cou & Décolleté)",
    "Micropeeling Face - 3 Sessions": "Micropeeling Visage - 3 Séances",
    "3 Sessions": "3 Séances",
    "Micropeeling Face - 5 Sessions": "Micropeeling Visage - 5 Séances",
    "5 Sessions": "5 Séances",
    "Classic Glow Facial": "Soin du Visage Éclat Classique",
    "Deep Clean Facial with LED": "Soin du Visage Nettoyage Profond avec LED",
    "Hydrating Jelly Facial": "Soin du Visage Hydratant en Gelée",
    "Back Glow Facial": "Soin du Dos Éclat",
    "HydraFacial® Signature": "HydraFacial® Signature",
    "HydraFacial® Deluxe": "HydraFacial® Deluxe",
    "HydraFacial® Platinum": "HydraFacial® Platinum",
    "HydraFacial® Perk Eye": "HydraFacial® Perk Yeux",
    "HydraFacial® Perk Lip": "HydraFacial® Perk Lèvres",
    "The Perfect Derma™ Peel": "Le Peeling Perfect Derma™",
    "Perfect Derma™ Plus Booster": "Booster Perfect Derma™ Plus",
    "Perfect Derma™ Clear Booster": "Booster Perfect Derma™ Clear",
    "Perfect Derma™ Plus Plus Booster": "Booster Perfect Derma™ Plus Plus",
    "BioRePeel Blue (Face)": "BioRePeel Bleu (Visage)",
    "BioRePeel Gold (Body)": "BioRePeel Or (Corps)",
    "Per ml": "Par ml",
    "BioRePeel Rose": "BioRePeel Rose",
    "Intimate & Sensitive Areas Treatment": "Soin des zones intimes et sensibles",
    "Single area treatment": "Traitement d'une seule zone",
    "BioRePeel Blue (Face) - 3 Sessions": "BioRePeel Bleu (Visage) - 3 Séances",
    "Cavitation - Small Area (Arms, Chin, Love Handles)": "Cavitation - Petite zone (Bras, Menton, Poignées d'amour)",
    "Cavitation - Medium Area (Abdomen, Thighs, Buttocks)": "Cavitation - Moyenne zone (Abdomen, Cuisses, Fesses)",
    "40 min": "40 min",
    "Cavitation - Large Area (Full Stomach & Sides, Full Back, Full Legs)": "Cavitation - Grande zone (Ventre et Côtés, Dos, Jambes complètes)",
    "Radio Frequency - Face (Jawline, Cheeks, Under Eyes)": "Radiofréquence - Visage (Mâchoire, Joues, Sous les yeux)",
    "Radio Frequency - Small Body Area (Arms, Neck, Love Handles)": "Radiofréquence - Petite zone (Bras, Cou, Poignées d'amour)",
    "Radio Frequency - Medium Body Area (Abdomen, Thighs, Buttocks)": "Radiofréquence - Moyenne zone (Abdomen, Cuisses, Fesses)",
    "Radio Frequency - Large Area (Full Stomach & Sides, Full Legs)": "Radiofréquence - Grande zone (Ventre et Côtés, Jambes complètes)",
    "Vacuum Therapy - Small Area (Arms, Chin, Neck, Love Handles)": "Vacuum Thérapie - Petite zone (Bras, Menton, Cou, Poignées d'amour)",
    "Vacuum Therapy - Medium Area (Buttocks, Thighs, Abdomen)": "Vacuum Thérapie - Moyenne zone (Fesses, Cuisses, Abdomen)",
    "Vacuum Therapy - Large Area (Full Legs, Full Stomach & Back)": "Vacuum Thérapie - Grande zone (Jambes complètes, Ventre et Dos)",
    "Laser Lipolysis - Small Area (Arms, Double Chin, Knees)": "Lipolyse Laser - Petite zone (Bras, Double Menton, Genoux)",
    "Laser Lipolysis - Medium Area (Abdomen, Buttocks, Thighs)": "Lipolyse Laser - Moyenne zone (Abdomen, Fesses, Cuisses)",
    "Laser Lipolysis - Large Area (Full Legs, Full Back, Full Stomach & Sides)": "Lipolyse Laser - Grande zone (Jambes complètes, Dos, Ventre et Côtés)",
    "EMS - Upper Body (1 session)": "EMS - Haut du corps (1 séance)",
    "1 session": "1 séance",
    "EMS - Upper Body (5 sessions)": "EMS - Haut du corps (5 séances)",
    "5 sessions": "5 séances",
    "EMS - Upper Body (10 Sessions)": "EMS - Haut du corps (10 séances)",
    "10 Sessions": "10 séances",
    "EMS - Lower Body (1 Session)": "EMS - Bas du corps (1 séance)",
    "1 Session": "1 séance",
    "EMS - Lower Body (5 Sessions)": "EMS - Bas du corps (5 séances)",
    "5 Sessions": "5 séances",
    "EMS - Lower Body (10 Sessions)": "EMS - Bas du corps (10 séances)",
    "EMS - Core & Abs Sculpting (1 Session)": "EMS - Sculpting Abdos (1 séance)",
    "20 min": "20 min",
    "EMS - Core & Abs Sculpting (5 Sessions)": "EMS - Sculpting Abdos (5 séances)",
    "Sauna Blanket - Single Session": "Couverture Sauna - Séance Unique",
    "Sauna Blanket - Extended Session": "Couverture Sauna - Séance Prolongée",
    "Lip Blush": "Lip Blush",
    "3 Hours": "3 Heures",
    "Lip Blush - Annual Colour Refresh (Existing Clients)": "Lèvres - Retouche Annuelle (Clientèle Existante)",
    "Lip Blush - Dark Lips Neutralisation (Existing Clients)": "Lèvres - Neutralisation Lèvres Foncées (Clientèle Existante)",
    "Lips Neutralisation": "Neutralisation des Lèvres",
    "Melanin-Rich Lips Neutralisation": "Neutralisation des Lèvres Riches en Mélanine",
    "Laser Facial Skin Tightening": "Raffermissement Cutané au Laser (Visage)",
    "Face & Neck Skin Tightening": "Raffermissement Cutané Visage & Cou",
    "Dark Spot Removal (Face)": "Élimination des Taches Brunes (Visage)",
    "Dark Spot Removal (Body)": "Élimination des Taches Brunes (Corps)",
    "Localized Dark Spot Removal": "Élimination Localisée des Taches Brunes",
    "Per spot": "Par tache",
    "Redness Removal (Rosacea)": "Atténuation des Rougeurs (Rosacée)",
    "Laser Hair Removal": "Épilation Laser",
    "Micropeeling": "Micropeeling",
    "Facials": "Soins du Visage",
    "Chemical Peel": "Peeling Chimique",
    "Body Sculpting": "Remodelage Corporel",
    "Laser Skin Care": "Soins de la Peau au Laser"
};

const allServicesFile = fs.readFileSync(path.join(__dirname, 'src/lib/all-services.ts'), 'utf8');
const enFile = path.join(__dirname, 'src/lib/locales/en.json');
const frFile = path.join(__dirname, 'src/lib/locales/fr.json');

const enJson = JSON.parse(fs.readFileSync(enFile, 'utf8'));
const frJson = JSON.parse(fs.readFileSync(frFile, 'utf8'));

if (!enJson.services) enJson.services = {};
if (!frJson.services) frJson.services = {};

// Regex to capture t("services.Key", "English Value")
const regex = /t\(\s*"services\.([^"]+)"\s*,\s*"([^"]+)"\s*\)/g;
let match;
while ((match = regex.exec(allServicesFile)) !== null) {
    const key = match[1];
    const englishVal = match[2];

    enJson.services[key] = englishVal;
    frJson.services[key] = frenchDict[englishVal] || englishVal; // Fallback to English if translation is missing
}

fs.writeFileSync(enFile, JSON.stringify(enJson, null, 2));
fs.writeFileSync(frFile, JSON.stringify(frJson, null, 2));

console.log("Successfully updated locale files.");
