const fs = require('fs');
const path = require('path');

const frenchDict = {
    'Name*': 'Nom*',
    'Your Name': 'Votre Nom',
    'Email*': 'E-mail*',
    'Your Email Address': 'Votre Adresse E-mail',
    'Mobile Number*': 'Numéro de Mobile*',
    'Your Mobile Number': 'Votre Numéro de Mobile',
    'Booking Date*': 'Date de Réservation*',
    'Treatments*': 'Traitements*',
    'Select Treatment': 'Sélectionner un Traitement',
    'Select': 'Sélectionner',
    'Comments': 'Commentaires',
    'Processing...': 'Traitement...',
    'Book Appointment': 'Prendre Rendez-vous',
    "Submit": "Soumettre",
    "Cancel": "Annuler",
    "Close": "Fermer",
    "Sending...": "Envoi...",
    "I'm not a robot": "Je ne suis pas un robot"
};

const enFile = path.join(__dirname, 'src/lib/locales/en.json');
const frFile = path.join(__dirname, 'src/lib/locales/fr.json');

const enJson = JSON.parse(fs.readFileSync(enFile, 'utf8'));
const frJson = JSON.parse(fs.readFileSync(frFile, 'utf8'));

// Regex to capture t("namespace.key", "defaultText")
const regex = /t\(\s*[\"']([^\"']+)[\"']\s*,\s*[\"']([^\"']+)[\"']\s*\)/g;

function scanDirectory(dir) {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            scanDirectory(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            let match;
            while ((match = regex.exec(content)) !== null) {
                const fullKey = match[1];
                const parts = fullKey.split('.');
                const namespace = parts[0];
                const key = parts.slice(1).join('.');
                const defaultText = match[2];

                if (!namespace || !key) continue;

                if (!enJson[namespace]) enJson[namespace] = {};
                if (!frJson[namespace]) frJson[namespace] = {};

                enJson[namespace][key] = defaultText;

                // Only write to French dict if missing or we have a translation in dictionary
                if (!frJson[namespace][key] || frJson[namespace][key] === defaultText) {
                    frJson[namespace][key] = frenchDict[defaultText] || defaultText;
                }
            }
        }
    });
}

scanDirectory(path.join(__dirname, 'src'));

fs.writeFileSync(enFile, JSON.stringify(enJson, null, 2));
fs.writeFileSync(frFile, JSON.stringify(frJson, null, 2));
console.log('Successfully updated locales based on components scan.');
