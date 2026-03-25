import { useLanguage } from "@/context/language-context";

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
    // Data from src/app/treatments/laser-hair-removal/page.tsx
    const faceAndNeckServices = [
        { name: t("services.FullFace", "Full Face"), duration: t("services.45min", "45 min"), price: "$120", imageId: "laser-full-face" },
        { name: t("services.Cheeks", "Cheeks"), duration: t("services.30min", "30 min"), price: "$70", imageId: "laser-cheeks" },
        { name: t("services.UpperLip", "Upper Lip"), duration: t("services.15min", "15 min"), price: "$40", imageId: "laser-upper-lip" },
        { name: t("services.Chin", "Chin"), duration: t("services.15min", "15 min"), price: "$50", imageId: "laser-chin" },
        { name: t("services.Jawline", "Jawline"), duration: t("services.15min", "15 min"), price: "$60", imageId: "laser-jawline" },
        { name: t("services.Forehead", "Forehead"), duration: t("services.30min", "30 min"), price: "$70", imageId: "laser-forehead" },
        { name: t("services.Neck", "Neck"), duration: t("services.30min", "30 min"), price: "$70", imageId: "laser-neck" },
    ].map(s => ({ ...s, treatment: 'laser-hair-removal' }));

    const upperBodyServices = [
        { name: t("services.Underarms", "Underarms"), duration: t("services.30min", "30 min"), price: "$70", imageId: "laser-underarms" },
        { name: t("services.HalfArms", "Half Arms"), duration: t("services.30min", "30 min"), price: "$100", imageId: "laser-half-arms" },
        { name: t("services.FullArms", "Full Arms"), duration: t("services.60min", "60 min"), price: "$160", imageId: "laser-full-arms" },
        { name: t("services.Stomach", "Stomach"), duration: t("services.30min", "30 min"), price: "$150", imageId: "laser-stomach" },
        { name: t("services.HalfBack", "Half Back"), duration: t("services.30min", "30 min"), price: "$130", imageId: "laser-half-back" },
        { name: t("services.FullBack", "Full Back"), duration: t("services.60min", "60 min"), price: "$250", note: t("services.notincludedinfullbodypackage", "(not included in full body package)"), imageId: "laser-full-back" },
    ].map(s => ({ ...s, treatment: 'laser-hair-removal' }));

    const lowerBodyServices = [
        { name: t("services.FullBikini", "Full Bikini"), duration: t("services.45min", "45 min"), price: "$130", imageId: "laser-full-bikini" },
        { name: t("services.ButtCheeks", "Butt Cheeks"), duration: t("services.30min", "30 min"), price: "$120", imageId: "laser-butt-cheeks" },
        { name: t("services.BellyLine", "Belly Line"), duration: t("services.30min", "30 min"), price: "$70", imageId: "laser-belly-line" },
        { name: t("services.HalfLegs", "Half Legs"), duration: t("services.30min", "30 min"), price: "$120", imageId: "laser-half-legs" },
        { name: t("services.FullLegs", "Full Legs"), duration: t("services.60min", "60 min"), price: "$220", imageId: "laser-full-legs" },
    ].map(s => ({ ...s, treatment: 'laser-hair-removal' }));

    const menServices = [
        { name: t("services.BeardContour", "Beard Contour"), duration: t("services.30min", "30 min"), price: "$100", imageId: "laser-beard-contour" },
        { name: t("services.MensUpperBody", "Men's Upper Body"), duration: t("services.90min", "90 min"), price: "$360", imageId: "laser-men-upper-body" },
    ].map(s => ({ ...s, treatment: 'laser-hair-removal' }));

    const comboPackages = [
        { name: t("services.FullBikiniUnderarms", "Full Bikini & Underarms"), duration: t("services.60min", "60 min"), price: "$160", imageId: "combo-bikini-underarms" },
        { name: t("services.FullLegsUnderarms", "Full Legs & Underarms"), duration: t("services.90min", "90 min"), price: "$250", imageId: "combo-legs-underarms" },
        { name: t("services.FullLegsFullBikini", "Full Legs & Full Bikini"), duration: t("services.60min", "60 min"), price: "$310", imageId: "combo-legs-bikini" },
        { name: t("services.FullLegsFullBikiniFullFaceUnde", "Full Legs, Full Bikini, Full Face & Underarms"), duration: t("services.90min", "90 min"), price: "$420", imageId: "combo-full-body-women" },
        { name: t("services.LowerLegsUnderarms", "Lower Legs & Underarms"), duration: t("services.60min", "60 min"), price: "$160", imageId: "combo-legs-underarms" },
        { name: t("services.LowerLegsFullArms", "Lower Legs & Full Arms"), duration: t("services.60min", "60 min"), price: "$220", imageId: "combo-legs-arms" },
        { name: t("services.LowerLegsFullBikiniUnderarms", "Lower Legs, Full Bikini & Underarms"), duration: t("services.60min", "60 min"), price: "$250", imageId: "combo-legs-bikini" },
        { name: t("services.FullFaceUnderarms", "Full Face & Underarms"), duration: t("services.60min", "60 min"), price: "$160", imageId: "combo-face-underarms" },
        { name: t("services.FullArmsUnderarms", "Full Arms & Underarms"), duration: t("services.60min", "60 min"), price: "$200", imageId: "combo-arms-underarms" },
    ].map(s => ({ ...s, treatment: 'laser-hair-removal' }));

    const fullBodyPackages = [
        { name: t("services.FullBodyWomenPersession", "Full Body Women (Per session)"), duration: t("services.120min", "120 min"), price: "$500", note: t("services.ExcludesStomachBack", "(Excludes Stomach & Back)"), imageId: "combo-full-body-women" },
    ].map(s => ({ ...s, treatment: 'laser-hair-removal' }));

    const fullBodySessionPackages = [
        { name: t("services.FullBodyWomen4Sessions", "Full Body Women (4 Sessions)"), price: "$1800", sessions: t("services.4Sessions", "4 Sessions"), imageId: "combo-full-body-women" },
        { name: t("services.FullBodyWomen6Sessions", "Full Body Women (6 Sessions)"), price: "$2600", sessions: t("services.6Sessions", "6 Sessions"), imageId: "combo-full-body-women" },
        { name: t("services.FullBodyWomen8Sessions", "Full Body Women (8 Sessions)"), price: "$3400", sessions: t("services.8Sessions", "8 Sessions"), imageId: "combo-full-body-women" },
    ].map(s => ({ ...s, treatment: 'laser-hair-removal', duration: null }));

    // Data from src/app/treatments/micropeeling/page.tsx
    const micropeelingServices = [
        { name: t("services.MicropeelingFace", "Micropeeling (Face)"), duration: t("services.75min", "75 min"), price: "$200", imageId: "microneedling-face" },
        { name: t("services.MicropeelingFaceNeck", "Micropeeling (Face & Neck)"), duration: t("services.90min", "90 min"), price: "$220", imageId: "microneedling-face-neck" },
        { name: t("services.MicropeelingFaceNeckDcollet", "Micropeeling (Face, Neck & Décolleté)"), duration: t("services.90min", "90 min"), price: "$250", imageId: "microneedling-decollete" },
        { name: t("services.MicropeelingFullBack", "Micropeeling Full Back"), duration: t("services.90min", "90 min"), price: "$270", imageId: "microneedling-back" },
        { name: t("services.MicropeelingonaMediumbodypart", "Micropeeling on a Medium body part"), duration: null, price: "$200", imageId: "microneedling-body-medium" },
        { name: t("services.MicropeelingonaLargebodypart", "Micropeeling on a Large body part"), duration: null, price: "$250", imageId: "microneedling-body-large" },
    ].map(s => ({ ...s, treatment: 'micropeeling' }));

    const jellyMaskServices = [
        { name: t("services.MicropeelingwithJellyMaskFace", "Micropeeling with Jelly Mask (Face)"), duration: t("services.1hr15min", "1hr 15 min"), price: "$215", imageId: "jelly-mask-face" },
        { name: t("services.JellyMaskFace", "Jelly Mask (Face)"), duration: null, price: "$15", imageId: "jelly-mask-face" },
        { name: t("services.JellyMaskFaceNeck", "Jelly Mask (Face & Neck)"), duration: null, price: "$20", imageId: "jelly-mask-face-neck" },
        { name: t("services.JellyMaskFaceNeckDcollet", "Jelly Mask (Face, Neck & Décolleté)"), duration: null, price: "$60", imageId: "jelly-mask-decollete" },
    ].map(s => ({ ...s, treatment: 'micropeeling' }));

    const micropeelingPackages = [
        { name: t("services.MicropeelingFace3Sessions", "Micropeeling Face - 3 Sessions"), sessions: t("services.3Sessions", "3 Sessions"), price: "$500", imageId: "microneedling-package" },
        { name: t("services.MicropeelingFace5Sessions", "Micropeeling Face - 5 Sessions"), sessions: t("services.5Sessions", "5 Sessions"), price: "$750", imageId: "microneedling-package" },
    ].map(s => ({ ...s, treatment: 'micropeeling', duration: null }));


    // Data from src/app/treatments/facials/page.tsx
    const facialTreatments = [
        { name: t("services.ClassicGlowFacial", "Classic Glow Facial"), duration: t("services.60min", "60 min"), price: "$100", imageId: "facial-classic-glow" },
        { name: t("services.DeepCleanFacialwithLED", "Deep Clean Facial with LED"), duration: t("services.60min", "60 min"), price: "$120", imageId: "facial-deep-clean-led" },
        { name: t("services.HydratingJellyFacial", "Hydrating Jelly Facial"), duration: t("services.60min", "60 min"), price: "$140", imageId: "facial-hydrating-jelly" },
        { name: t("services.BackGlowFacial", "Back Glow Facial"), duration: t("services.90min", "90 min"), price: "$170", imageId: "facial-back-glow" },
    ].map(s => ({ ...s, treatment: 'facials' }));

    const hydraFacialTreatments = [
        { name: t("services.HydraFacialSignature", "HydraFacial® Signature"), duration: t("services.60min", "60 min"), price: "$200", imageId: "hydrafacial-signature" },
        { name: t("services.HydraFacialDeluxe", "HydraFacial® Deluxe"), duration: t("services.75min", "75 min"), price: "$225", imageId: "hydrafacial-deluxe" },
        { name: t("services.HydraFacialPlatinum", "HydraFacial® Platinum"), duration: t("services.90min", "90 min"), price: "$325", imageId: "hydrafacial-platinum" },
    ].map(s => ({ ...s, treatment: 'facials' }));

    const hydraFacialPerks = [
        { name: t("services.HydraFacialPerkEye", "HydraFacial® Perk Eye"), duration: t("services.30min", "30 min"), price: "$60", imageId: "hydrafacial-perk-eye" },
        { name: t("services.HydraFacialPerkLip", "HydraFacial® Perk Lip"), duration: t("services.30min", "30 min"), price: "$60", imageId: "hydrafacial-perk-lip" },
    ].map(s => ({ ...s, treatment: 'facials' }));

    // Data from src/app/treatments/chemical-peel/page.tsx
    const perfectDermaPeel = {
        name: t("services.ThePerfectDermaPeel", "The Perfect Derma™ Peel"),
        duration: t("services.60min", "60 min"),
        price: "$250",
        treatment: 'chemical-peel',
        imageId: "peel-perfect-derma"
    };

    const boosters = [
        { name: t("services.PerfectDermaPlusBooster", "Perfect Derma™ Plus Booster"), duration: t("services.60min", "60 min"), price: "$65", imageId: "peel-booster-plus" },
        { name: t("services.PerfectDermaClearBooster", "Perfect Derma™ Clear Booster"), duration: t("services.60min", "60 min"), price: "$50", imageId: "peel-booster-clear" },
        { name: t("services.PerfectDermaPlusPlusBooster", "Perfect Derma™ Plus Plus Booster"), duration: t("services.60min", "60 min"), price: "$65", imageId: "peel-booster-plus-plus" }
    ].map(s => ({ ...s, treatment: 'chemical-peel' }));

    const biorepeelTreatments = [
        { name: t("services.BioRePeelBlueFace", "BioRePeel Blue (Face)"), duration: t("services.60min", "60 min"), price: "$250", priceNote: null, imageId: "biorepeel-blue" },
        { name: t("services.BioRePeelGoldBody", "BioRePeel Gold (Body)"), duration: null, price: "$65", priceNote: t("services.Perml", "Per ml"), imageId: "biorepeel-gold" },
        { name: t("services.BioRePeelRose", "BioRePeel Rose"), subtitle: t("services.IntimateSensitiveAreasTreatmen", "Intimate & Sensitive Areas Treatment"), duration: t("services.60min", "60 min"), price: "$200", priceNote: t("services.Singleareatreatment", "Single area treatment"), imageId: "biorepeel-rose" }
    ].map(s => ({ ...s, treatment: 'chemical-peel' }));

    const biorepeelPackage = {
        name: t("services.BioRePeelBlueFace3Sessions", "BioRePeel Blue (Face) - 3 Sessions"),
        duration: null,
        price: "$600",
        treatment: 'chemical-peel',
        imageId: "biorepeel-package"
    };

    // Data from src/app/treatments/body-sculpting/page.tsx
    const cavitationServices = [
        { name: t("services.CavitationSmallAreaArmsChinLov", "Cavitation - Small Area (Arms, Chin, Love Handles)"), duration: t("services.30min", "30 min"), price: "$40–$55", imageId: "cavitation-small" },
        { name: t("services.CavitationMediumAreaAbdomenThi", "Cavitation - Medium Area (Abdomen, Thighs, Buttocks)"), duration: t("services.40min", "40 min"), price: "$80–$100", imageId: "cavitation-medium" },
        { name: t("services.CavitationLargeAreaFullStomach", "Cavitation - Large Area (Full Stomach & Sides, Full Back, Full Legs)"), duration: t("services.45min", "45 min"), price: "$120–$150", imageId: "cavitation-large" },
    ].map(s => ({ ...s, treatment: 'body-sculpting' }));

    const radioFrequencyServices = [
        { name: t("services.RadioFrequencyFaceJawlineCheek", "Radio Frequency - Face (Jawline, Cheeks, Under Eyes)"), duration: t("services.30min", "30 min"), price: "$100–$120", imageId: "rf-face" },
        { name: t("services.RadioFrequencySmallBodyAreaArm", "Radio Frequency - Small Body Area (Arms, Neck, Love Handles)"), duration: t("services.30min", "30 min"), price: "$50–$65", imageId: "rf-small" },
        { name: t("services.RadioFrequencyMediumBodyAreaAb", "Radio Frequency - Medium Body Area (Abdomen, Thighs, Buttocks)"), duration: t("services.45min", "45 min"), price: "$70–$85", imageId: "rf-medium" },
        { name: t("services.RadioFrequencyLargeAreaFullSto", "Radio Frequency - Large Area (Full Stomach & Sides, Full Legs)"), duration: t("services.60min", "60 min"), price: "$100–$120", imageId: "rf-large" },
    ].map(s => ({ ...s, treatment: 'body-sculpting' }));

    const vacuumTherapyServices = [
        { name: t("services.VacuumTherapySmallAreaArmsChin", "Vacuum Therapy - Small Area (Arms, Chin, Neck, Love Handles)"), duration: t("services.30min", "30 min"), price: "$80–$100", imageId: "vacuum-small" },
        { name: t("services.VacuumTherapyMediumAreaButtock", "Vacuum Therapy - Medium Area (Buttocks, Thighs, Abdomen)"), duration: t("services.40min", "40 min"), price: "$100-$150", imageId: "vacuum-medium" },
        { name: t("services.VacuumTherapyLargeAreaFullLegs", "Vacuum Therapy - Large Area (Full Legs, Full Stomach & Back)"), duration: t("services.45min", "45 min"), price: "$150–$200", imageId: "vacuum-large" },
    ].map(s => ({ ...s, treatment: 'body-sculpting' }));

    const laserLypolysisServices = [
        { name: t("services.LaserLipolysisSmallAreaArmsDou", "Laser Lipolysis - Small Area (Arms, Double Chin, Knees)"), duration: t("services.30min", "30 min"), price: "$100–$150", imageId: "laser-lypolysis-small" },
        { name: t("services.LaserLipolysisMediumAreaAbdome", "Laser Lipolysis - Medium Area (Abdomen, Buttocks, Thighs)"), duration: t("services.30min", "30 min"), price: "$150–$200", imageId: "laser-lypolysis-medium" },
        { name: t("services.LaserLipolysisLargeAreaFullLeg", "Laser Lipolysis - Large Area (Full Legs, Full Back, Full Stomach & Sides)"), duration: t("services.40min", "40 min"), price: "$200–$250", imageId: "laser-lypolysis-large" },
    ].map(s => ({ ...s, treatment: 'body-sculpting' }));

    const emsServices = [
        { name: t("services.EMSUpperBody1session", "EMS - Upper Body (1 session)"), duration: t("services.15min", "15 min"), sessions: t("services.1session", "1 session"), price: "$40", imageId: "ems-upper" },
        { name: t("services.EMSUpperBody5sessions", "EMS - Upper Body (5 sessions)"), duration: t("services.15min", "15 min"), sessions: t("services.5sessions", "5 sessions"), price: "$180", imageId: "ems-upper" },
        { name: t("services.EMSUpperBody10Sessions", "EMS - Upper Body (10 Sessions)"), duration: t("services.15min", "15 min"), sessions: t("services.10Sessions", "10 Sessions"), price: "$350", imageId: "ems-upper" },
        { name: t("services.EMSLowerBody1Session", "EMS - Lower Body (1 Session)"), duration: t("services.15min", "15 min"), sessions: t("services.1Session", "1 Session"), price: "$50", imageId: "ems-lower" },
        { name: t("services.EMSLowerBody5Sessions", "EMS - Lower Body (5 Sessions)"), duration: t("services.15min", "15 min"), sessions: t("services.5Sessions", "5 Sessions"), price: "$190", imageId: "ems-lower" },
        { name: t("services.EMSLowerBody10Sessions", "EMS - Lower Body (10 Sessions)"), duration: t("services.15min", "15 min"), sessions: t("services.10Sessions", "10 Sessions"), price: "$360", imageId: "ems-lower" },
        { name: t("services.EMSCoreAbsSculpting1Session", "EMS - Core & Abs Sculpting (1 Session)"), duration: t("services.20min", "20 min"), sessions: t("services.1Session", "1 Session"), price: "$70", imageId: "ems-core" },
        { name: t("services.EMSCoreAbsSculpting5Sessions", "EMS - Core & Abs Sculpting (5 Sessions)"), duration: t("services.20min", "20 min"), sessions: t("services.5Sessions", "5 Sessions"), price: "$250", imageId: "ems-core" },
    ].map(s => ({ ...s, treatment: 'body-sculpting' }));

    const saunaBlanketServices = [
        { name: t("services.SaunaBlanketSingleSession", "Sauna Blanket - Single Session"), duration: t("services.30min", "30 min"), price: "$40", imageId: "sauna-blanket" },
        { name: t("services.SaunaBlanketExtendedSession", "Sauna Blanket - Extended Session"), duration: t("services.45min", "45 min"), price: "$50", imageId: "sauna-blanket" },
    ].map(s => ({ ...s, treatment: 'body-sculpting' }));

    // Data from src/app/treatments/lip-blush/page.tsx
    const lipBlushServices = [
        { name: t("services.LipBlush", "Lip Blush"), duration: t("services.3Hours", "3 Hours"), price: "$250", imageId: "lip-blush-main" },
        { name: t("services.LipBlushAnnualColourRefreshExi", "Lip Blush - Annual Colour Refresh (Existing Clients)"), duration: t("services.3Hours", "3 Hours"), price: "$250", imageId: "lip-blush-refresh" },
        { name: t("services.LipBlushDarkLipsNeutralisation", "Lip Blush - Dark Lips Neutralisation (Existing Clients)"), duration: t("services.3Hours", "3 Hours"), price: "$280", imageId: "lip-blush-dark-neutralisation" },
        { name: t("services.LipsNeutralisation", "Lips Neutralisation"), duration: t("services.3Hours", "3 Hours"), price: "$320", imageId: "lip-blush-neutralisation" },
        { name: t("services.MelaninRichLipsNeutralisation", "Melanin-Rich Lips Neutralisation"), duration: t("services.3Hours", "3 Hours"), price: "$350", imageId: "lip-blush-melanin-rich" },
    ].map(s => ({ ...s, treatment: 'lip-blush' }));

    // Data from src/app/treatments/laser-skin-care/page.tsx
    const laserSkinRejuvenationServices = [
        { name: t("services.LaserFacialSkinTightening", "Laser Facial Skin Tightening"), duration: t("services.60min", "60 min"), price: "$150", imageId: "laser-facial-skin-tightening" },
        { name: t("services.FaceNeckSkinTightening", "Face & Neck Skin Tightening"), duration: t("services.120min", "120 min"), price: "$200", imageId: "face-neck-skin-tightening" },
        { name: t("services.DarkSpotRemovalFace", "Dark Spot Removal (Face)"), duration: t("services.60min", "60 min"), price: "$150", imageId: "dark-spot-removal-face" },
        { name: t("services.DarkSpotRemovalBody", "Dark Spot Removal (Body)"), duration: t("services.60min", "60 min"), price: "$160", imageId: "dark-spot-removal-body" },
        { name: t("services.LocalizedDarkSpotRemoval", "Localized Dark Spot Removal"), duration: t("services.30min", "30 min"), price: "$75", note: t("services.Perspot", "Per spot"), imageId: "localized-dark-spot-removal" },
        { name: t("services.RednessRemovalRosacea", "Redness Removal (Rosacea)"), duration: t("services.60min", "60 min"), price: "$150", imageId: "redness-removal-rosacea" },
    ].map(s => ({ ...s, treatment: 'laser-skin-care' }));

    const allServicesByCategory: ServiceCategory[] = [
        {
            title: t("services.LaserHairRemoval", "Laser Hair Removal"),
            treatmentSlug: "laser-hair-removal",
            services: [
                ...faceAndNeckServices,
                ...upperBodyServices,
                ...lowerBodyServices,
                ...menServices,
                ...comboPackages,
                ...fullBodyPackages,
                ...fullBodySessionPackages,
            ]
        },
        {
            title: t("services.Micropeeling", "Micropeeling"),
            treatmentSlug: "micropeeling",
            services: [
                ...micropeelingServices,
                ...jellyMaskServices,
                ...micropeelingPackages,
            ]
        },
        {
            title: t("services.Facials", "Facials"),
            treatmentSlug: "facials",
            services: [
                ...facialTreatments,
                ...hydraFacialTreatments,
                ...hydraFacialPerks,
            ]
        },
        {
            title: t("services.ChemicalPeel", "Chemical Peel"),
            treatmentSlug: "chemical-peel",
            services: [
                perfectDermaPeel,
                ...boosters,
                ...biorepeelTreatments,
                biorepeelPackage,
            ]
        },
        {
            title: t("services.BodySculpting", "Body Sculpting"),
            treatmentSlug: "body-sculpting",
            services: [
                ...cavitationServices,
                ...radioFrequencyServices,
                ...vacuumTherapyServices,
                ...laserLypolysisServices,
                ...emsServices,
                ...saunaBlanketServices
            ]
        },
        {
            title: t("services.LipBlush", "Lip Blush"),
            treatmentSlug: "lip-blush",
            services: lipBlushServices,
        },
        {
            title: t("services.LaserSkinCare", "Laser Skin Care"),
            treatmentSlug: "laser-skin-care",
            services: laserSkinRejuvenationServices,
        },
    ];

    // also create a flat array for simpler lookups if needed.
    const allServices: Service[] = allServicesByCategory.flatMap(category => category.services);
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
