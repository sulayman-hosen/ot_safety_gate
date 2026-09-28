export const TRANSLATIONS = {
  en: {
    // Navigation & App Header
    orbitSubtitle: 'OPERATING THEATER',
    clinicalWorkspace: 'CLINICAL WORKSPACE',
    safetyOverview: 'Safety overview',
    clinicalEvidence: 'Clinical evidence',
    teamReview: 'Team review',
    sessionActivity: 'Session activity',
    keyTermsGuide: 'Key Terms Guide',
    keyTermsSubtitle: 'EHR, FHIR, SMART, LOINC & standards',
    onePatientTitle: 'One patient. One context.',
    onePatientDesc: 'Evidence stays bound to the patient selected by the EHR.',
    connectionGuide: 'Connection guide',
    operatingTheater: 'Operating theater',
    preSurgicalChecklist: 'Pre-surgical checklist',
    syntheticDemo: 'Synthetic demo',
    ehrConnected: 'EHR connected',
    awaitingLaunch: 'Awaiting launch',
    themeToggle: 'Toggle dark/light mode',
    languageToggle: 'Change language',

    // Demo Welcome Panel
    workflowSubtitle: 'A CONNECTED PRE-OPERATIVE WORKFLOW',
    gateBadge: 'OT PRE-SURGICAL SAFETY GATE',
    welcomeHeroTitle: 'Every check.',
    welcomeHeroHighlight: 'One clear record.',
    welcomeHeroLead: 'Bring the planned procedure, consent, allergy history and laboratory evidence into one focused team review.',
    openDemo: 'Open interactive demo',
    connectEhr: 'Connect an EHR',
    learnStandards: 'Key Terms & Standards',
    securityFooter: 'SMART authorization · Patient-scoped evidence · Structured notes',
    timeoutBadge: 'A CLEARER TIMEOUT',
    beforeIncision: 'Before the first incision.',
    fourChecksSummary: 'Four evidence checks.\nOne deliberate team review.',
    workflowNote: 'Designed around the clinical workflow',
    demoDisclaimer: 'The demo uses synthetic patients and example rules. Clinical deployment requires local policy and EHR validation.',

    // Features in welcome
    feat1Title: 'Context from the EHR',
    feat1Desc: 'Launch into a single patient and encounter using SMART authorization with PKCE.',
    feat2Title: 'Evidence you can inspect',
    feat2Desc: 'See missing results, outdated labs, consent mismatches and antibiotic allergy flags.',
    feat3Title: 'A reviewable record',
    feat3Desc: 'Save the checklist, then export FHIR JSON, a CDA narrative or a printable summary.',

    // Four core checklist checks
    check1Title: 'Procedure & diagnosis',
    check2Title: 'Signed consent evidence',
    check3Title: 'Antibiotics & allergies',
    check4Title: 'Coagulation & platelets',

    // Dashboard main actions & labels
    safetyWorkspace: 'OPERATING THEATER / SAFETY WORKSPACE',
    safetyGateTitle: 'Pre-surgical safety gate',
    safetyGateSubtitle: 'Review the evidence. Confirm with the team. Record the checklist.',
    refreshEvidence: 'Refresh evidence',
    testScenario: 'Test scenario',
    checksMatched: 'checks matched',
    lastRetrieved: 'last retrieved',
    justNow: 'Just now',
    mAgo: 'm ago',
    sourceEvidence: 'Source evidence',
    closeDialog: 'Close dialog',
    incompleteIssues: 'Incomplete or unsupported evidence',
    checksCount: '04 CHECKS',
    patientScoped: 'Patient-scoped records',
    refreshRequired: 'Refresh required',
    endSession: 'End session',
    sessionEnds: 'Session ends',

    // Patient Context Card
    currentPatient: 'CURRENT PATIENT',
    dob: 'Date of birth',
    recordedSex: 'Recorded sex',
    patientId: 'Patient ID',
    encounter: 'Encounter',
    notSupplied: 'Not supplied',
    unknown: 'Unknown',
    ehrBound: 'EHR context bound',

    // Safety Gate Banner
    bannerGoodTitle: 'Ready for team review',
    bannerGoodLead: 'Automated evidence checks are complete. Team confirmation is still required.',
    bannerReviewLead: 'Resolve missing or flagged evidence with the clinical team. A draft can be saved.',
    bannerExpiredLead: 'Refresh evidence before reviewing',

    // Procedure Card
    scheduledOrder: 'Scheduled surgical order',
    selectOrder: 'Select the surgical order',
    procedureCode: 'Procedure code',
    scheduledFor: 'Scheduled for',
    diagnosedCondition: 'Diagnosed condition',
    diagnosisTerminology: 'Diagnosis terminology',
    notDocumented: 'Not documented',
    inspectEvidence: 'Inspect source evidence',

    // Consent Card
    consentRecords: 'Consent records',
    sourceDocuments: 'Source documents',
    patientSignature: 'Patient signature evidence',
    linkedFound: 'Linked evidence found',
    needsVerification: 'Needs verification',
    retrieved: 'retrieved',

    // Allergy Card
    plannedMedication: 'Planned medication',
    recordedAllergyStatus: 'RECORDED ALLERGY STATUS',
    noRecordsReturned: 'Unknown — no records returned',

    // Lab Results Table
    loincDesc: 'Latest results by LOINC code · units normalized using UCUM',
    colLabTest: 'Lab test',
    colResult: 'Result',
    colRange: 'Example range',
    colEvidence: 'Evidence',
    policyNotice: 'Example policy: results within 24 hours. These thresholds are not universal clearance criteria.',
    viewEvidence: 'View evidence',

    // Team Review Panel
    teamReviewDesc: 'Confirm the evidence with the clinical team before recording the checklist.',
    teamNote: 'Team note',
    optional: 'optional',
    notePlaceholder: 'Add relevant observations or handover details…',
    recordChecklist: 'Record reviewed checklist',
    saveDraft: 'Save draft summary',
    timeoutReminder: 'A checklist record does not replace the surgical timeout or authorize an incision.',
    confirmIdentityTitle: 'Identity, procedure & site',
    confirmIdentityDesc: 'I confirmed the patient, planned procedure and operative site with the team.',
    confirmConsentTitle: 'Original consent reviewed',
    confirmConsentDesc: 'I inspected the source consent, its signature evidence and procedure match.',
    confirmAllergiesTitle: 'Antibiotic plan reviewed',
    confirmAllergiesDesc: 'I reconciled allergies and reviewed the prophylaxis plan with the team.',
    confirmLabsTitle: 'Laboratory evidence reviewed',
    confirmLabsDesc: 'I reviewed current results and the applicable institutional thresholds.',

    // Clinical Document Exports
    clinicalSummary: 'Clinical summary',
    exportReady: 'record saved. Your exports are ready.',
    exportPrompt: 'Save a draft or reviewed checklist to prepare its document exports.',
    noRecordYet: 'No record saved yet',
    exportNotice: 'Downloads remain available during this session. No automatic EHR writeback.',
    fhirDoc: 'FHIR document',
    fhirDetail: 'R4 Composition + Bundle · JSON',
    cdaNarrative: 'CDA narrative',
    cdaDetail: 'Core CDA R2 · XML',
    printableSummary: 'Printable summary',
    printDetail: 'Open · Print or save as PDF',

    // Session Activity
    recentActivity: 'Session activity',

    // Key Terms Modal
    keyTermsModalTitle: 'Key Healthcare & IT Standards',
    keyTermsSearchPlaceholder: 'Search EHR, FHIR, SMART, LOINC, CPT, HIPAA...',
    allCategories: 'All Categories',
    whyOtMatters: 'Why it matters in Surgery / OT:',
    copyTerm: 'Copy definition',
    copied: 'Copied!'
  },

  bn: {
    // Navigation & App Header
    orbitSubtitle: 'অপারেশন থিয়েটার',
    clinicalWorkspace: 'ক্লিনিক্যাল ওয়ার্কস্পেস',
    safetyOverview: 'নিরাপত্তা ওভারভিউ',
    clinicalEvidence: 'ক্লিনিক্যাল প্রমাণ',
    teamReview: 'টিম পর্যালোচনা',
    sessionActivity: 'সেশন ক্রিয়াকলাপ',
    keyTermsGuide: 'মূল পরিভাষা নির্দেশিকা',
    keyTermsSubtitle: 'EHR, FHIR, SMART, LOINC ও স্ট্যান্ডার্ড',
    onePatientTitle: 'এক রোগী। এক প্রেক্ষাপট।',
    onePatientDesc: 'ইএইচআর দ্বারা নির্ধারিত নির্দিষ্ট রোগীর সাথেই সমস্ত ক্লিনিক্যাল প্রমাণ কঠোরভাবে আবদ্ধ থাকে।',
    connectionGuide: 'সংযোগ নির্দেশিকা',
    operatingTheater: 'অপারেশন থিয়েটার',
    preSurgicalChecklist: 'অস্ত্রোপচার-পূর্ব চেকলিস্ট',
    syntheticDemo: 'সিন্থেটিক ডেমো',
    ehrConnected: 'ইএইচআর সংযুক্ত',
    awaitingLaunch: 'লঞ্চের অপেক্ষায়',
    themeToggle: 'ডার্ক/লাইট মোড পরিবর্তন',
    languageToggle: 'ভাষা পরিবর্তন (বাংলা/English)',

    // Demo Welcome Panel
    workflowSubtitle: 'একটি সংযুক্ত প্রি-অপারেটিভ ওয়ার্কফ্লো',
    gateBadge: 'ওটি অস্ত্রোপচার-পূর্ব নিরাপত্তা গেট',
    welcomeHeroTitle: 'প্রতিটি নির্ভুল যাচাই।',
    welcomeHeroHighlight: 'একটি সুস্পষ্ট রেকর্ড।',
    welcomeHeroLead: 'নির্ধারিত অপারেশন, রোগীর সম্মতিপত্র, ওষুধের অ্যালার্জি ও ল্যাব টেস্টের ফলাফলকে একটি সমন্বিত টিম পর্যালোচনার অধীনে নিয়ে আসুন।',
    openDemo: 'ইন্টারেক্টিভ ডেমো খুলুন',
    connectEhr: 'ইএইচআর সংযুক্ত করুন',
    learnStandards: 'মূল পরিভাষা ও স্ট্যান্ডার্ড',
    securityFooter: 'স্মার্ট অথেন্টিকেশন · রোগী-ভিত্তিক প্রমাণ · কাঠামোগত নোট',
    timeoutBadge: 'একটি স্পষ্ট টাইমআউট',
    beforeIncision: 'প্রথম চেরা দেওয়ার পূর্বেই নিশ্চিতকরণ।',
    fourChecksSummary: '৪টি প্রমাণভিত্তিক যাচাই।\n১টি সুনির্দিষ্ট টিম পর্যালোচনা।',
    workflowNote: 'ক্লিনিক্যাল ওয়ার্কফ্লোর ওপর ভিত্তি করে নকশাকৃত',
    demoDisclaimer: 'এই ডেমোটিতে সিন্থেটিক রোগী ও উদাহরণ নীতিমালা ব্যবহৃত। প্রকৃত ক্লিনিক্যাল ব্যবহারের জন্য হাসপাতালের স্থানীয় অনুমোদন প্রয়োজন।',

    // Features in welcome
    feat1Title: 'ইএইচআর থেকে তাৎক্ষণিক প্রেক্ষাপট',
    feat1Desc: 'PKCE সহ SMART অথেন্টিকেশন ব্যবহার করে তাৎক্ষণিক নির্দিষ্ট রোগী ও এনকাউন্টারে প্রবেশ করুন।',
    feat2Title: 'যাচাইযোগ্য ক্লিনিক্যাল প্রমাণ',
    feat2Desc: 'অনুপস্থিত টেস্টের ফলাফল, মেয়াদোত্তীর্ণ ল্যাব, অমিল সম্মতিপত্র এবং অ্যান্টিবায়োটিক অ্যালার্জি সরাসরি শনাক্ত করুন।',
    feat3Title: 'একটি সম্পূর্ণ পর্যালোচিত রেকর্ড',
    feat3Desc: 'চেকলিস্ট সংরক্ষণ করে FHIR JSON, CDA বিবরণী কিংবা প্রিন্টযোগ্য সামারি ডাউনলোড করুন।',

    // Four core checklist checks
    check1Title: 'অস্ত্রোপচার ও রোগ নির্ণয়',
    check2Title: 'স্বাক্ষরিত সম্মতির প্রমাণ',
    check3Title: 'অ্যান্টিবায়োটিক ও অ্যালার্জি',
    check4Title: 'রক্ত জমাট ও প্লেটলেট',

    // Dashboard main actions & labels
    safetyWorkspace: 'অপারেশন থিয়েটার / নিরাপত্তা ওয়ার্কস্পেস',
    safetyGateTitle: 'অস্ত্রোপচার-পূর্ব নিরাপত্তা গেট',
    safetyGateSubtitle: 'প্রমাণ পরীক্ষা করুন। দলের সাথে নিশ্চিত হোন। চেকলিস্ট রেকর্ড করুন।',
    refreshEvidence: 'প্রমাণ রিফ্রেশ করুন',
    testScenario: 'টেস্ট পরিস্থিতি',
    checksMatched: 'টি পরীক্ষা মিলেছে',
    lastRetrieved: 'সর্বশেষ সংগৃহীত',
    justNow: 'এইমাত্র',
    mAgo: ' মিনিট আগে',
    sourceEvidence: 'মূল প্রমাণ',
    closeDialog: 'ডায়ালগ বন্ধ করুন',
    incompleteIssues: 'অসম্পূর্ণ বা অমিল প্রমাণসমূহ',
    checksCount: '০৪টি যাচাই',
    patientScoped: 'রোগী-ভিত্তিক রেকর্ড',
    refreshRequired: 'রিফ্রেশ আবশ্যক',
    endSession: 'সেশন শেষ করুন',
    sessionEnds: 'সেশনের মেয়াদ শেষ',

    // Patient Context Card
    currentPatient: 'বর্তমান রোগী',
    dob: 'জন্মতারিখ',
    recordedSex: 'রেকর্ডকৃত লিঙ্গ',
    patientId: 'রোগীর আইডি',
    encounter: 'এনকাউন্টার',
    notSupplied: 'সরবরাহ করা হয়নি',
    unknown: 'অজানা',
    ehrBound: 'ইএইচআর প্রেক্ষাপটে আবদ্ধ',

    // Safety Gate Banner
    bannerGoodTitle: 'টিম পর্যালোচনার জন্য প্রস্তুত',
    bannerGoodLead: 'স্বয়ংক্রিয় প্রমাণ যাচাই সম্পন্ন হয়েছে। সার্জিক্যাল দলের মৌখিক নিশ্চিতকরণ প্রয়োজন।',
    bannerReviewLead: 'অনুপস্থিত বা সতর্ককৃত প্রমাণ দলের সাথে সমাধান করুন। একটি খসড়া সারসংক্ষেপ সংরক্ষণ করা যাবে।',
    bannerExpiredLead: 'পর্যালোচনার পূর্বে প্রমাণ রিফ্রেশ করুন',

    // Procedure Card
    scheduledOrder: 'নির্ধারিত অস্ত্রোপচারের অর্ডার',
    selectOrder: 'অস্ত্রোপচারের অর্ডার নির্বাচন করুন',
    procedureCode: 'অস্ত্রোপচার কোড (CPT)',
    scheduledFor: 'নির্ধারিত সময়',
    diagnosedCondition: 'শনাক্তকৃত রোগ',
    diagnosisTerminology: 'রোগ নির্ণয় পরিভাষা (SNOMED CT)',
    notDocumented: 'নথিভুক্ত নেই',
    inspectEvidence: 'মূল প্রমাণ পরীক্ষা করুন',

    // Consent Card
    consentRecords: 'সম্মতিপত্র রেকর্ড',
    sourceDocuments: 'মূল নথি',
    patientSignature: 'রোগীর স্বাক্ষর প্রমাণ',
    linkedFound: 'সংযুক্ত প্রমাণ পাওয়া গেছে',
    needsVerification: 'যাচাইকরণ প্রয়োজন',
    retrieved: 'টি সংগৃহীত',

    // Allergy Card
    plannedMedication: 'নির্ধারিত ঔষধ',
    recordedAllergyStatus: 'রেকর্ডকৃত অ্যালার্জি তথ্য',
    noRecordsReturned: 'অজানা — কোনো রেকর্ড পাওয়া যায়নি',

    // Lab Results Table
    loincDesc: 'LOINC কোড দ্বারা সংগৃহীত সর্বশেষ ফলাফল · UCUM এককে প্রমিত',
    colLabTest: 'ল্যাব পরীক্ষা',
    colResult: 'ফলাফল',
    colRange: 'নিরাপদ মাত্রা',
    colEvidence: 'প্রমাণ',
    policyNotice: 'উদাহরণ নীতিমালা: ২৪ ঘণ্টার ভেতরের ফলাফল। এই সীমাগুলো সার্বজনীন ছাড়পত্র নয়।',
    viewEvidence: 'প্রমাণ দেখুন',

    // Team Review Panel
    teamReviewDesc: 'চেকলিস্ট রেকর্ড করার পূর্বে সার্জিক্যাল দলের সাথে প্রতিটি প্রমাণ যাচাই ও নিশ্চিত করুন।',
    teamNote: 'টিম মন্তব্য / নোট',
    optional: 'ঐচ্ছিক',
    notePlaceholder: 'প্রাসঙ্গিক পর্যবেক্ষণ বা দায়িত্ব হস্তান্তর সংক্রান্ত তথ্য লিখুন…',
    recordChecklist: 'পর্যালোচিত চেকলিস্ট রেকর্ড করুন',
    saveDraft: 'খসড়া সারসংক্ষেপ সংরক্ষণ করুন',
    timeoutReminder: 'চেকলিস্ট রেকর্ড সার্জিক্যাল টাইমআউটের বিকল্প নয় বা চেরা দেওয়ার আনুষ্ঠানিক অনুমোদন নয়।',
    confirmIdentityTitle: 'রোগীর পরিচয়, অস্ত্রোপচার ও সঠিক অঙ্গ',
    confirmIdentityDesc: 'আমি দলের সাথে রোগীর পরিচয়, পরিকল্পিত প্রক্রিয়া এবং অপারেশনের সুনির্দিষ্ট অঙ্গ নিশ্চিত করেছি।',
    confirmConsentTitle: 'মূল সম্মতিপত্র ও স্বাক্ষর পর্যালোচনা',
    confirmConsentDesc: 'আমি মূল সম্মতিপত্র, স্বাক্ষরের প্রমাণ এবং অপারেশনের সঠিক মিল পরীক্ষা করেছি।',
    confirmAllergiesTitle: 'প্রফিল্যাক্টিক অ্যান্টিবায়োটিক পরিকল্পনা',
    confirmAllergiesDesc: 'আমি অ্যালার্জির ইতিহাস মিলিয়ে দেখেছি এবং দলের সাথে অ্যান্টিবায়োটিক প্রয়োগ নিশ্চিত করেছি।',
    confirmLabsTitle: 'রক্ত জমাট ও প্লেটলেটের ল্যাব ফলাফল',
    confirmLabsDesc: 'আমি সাম্প্রতিক পরীক্ষার ফলাফল এবং হাসপাতালের নির্ধারিত নিরাপদ মানদণ্ড পর্যালোচনা করেছি।',

    // Clinical Document Exports
    clinicalSummary: 'ক্লিনিক্যাল সারসংক্ষেপ',
    exportReady: 'রেকর্ড সংরক্ষিত হয়েছে। আপনার ফাইল প্রস্তুত।',
    exportPrompt: 'ডকুমেন্ট এক্সপোর্টের জন্য একটি খসড়া বা পর্যালোচিত চেকলিস্ট সংরক্ষণ করুন।',
    noRecordYet: 'এখনও কোনো রেকর্ড সংরক্ষিত হয়নি',
    exportNotice: 'এই সেশন চলাকালীন ফাইলগুলো ডাউনলোড করা যাবে। স্বয়ংক্রিয় EHR রাইটব্যাক নেই।',
    fhirDoc: 'FHIR নথি',
    fhirDetail: 'R4 Composition + Bundle · JSON',
    cdaNarrative: 'CDA বিবরণী',
    cdaDetail: 'Core CDA R2 · XML',
    printableSummary: 'প্রিন্টযোগ্য সারসংক্ষেপ',
    printDetail: 'খুলুন · প্রিন্ট বা PDF হিসেবে সংরক্ষণ করুন',

    // Session Activity
    recentActivity: 'সেশন ক্রিয়াকলাপ',

    // Key Terms Modal
    keyTermsModalTitle: 'মূল স্বাস্থ্যসেবা ও আইটি স্ট্যান্ডার্ড',
    keyTermsSearchPlaceholder: 'EHR, FHIR, SMART, LOINC, CPT, HIPAA খুঁজুন...',
    allCategories: 'সকল ক্যাটাগরি',
    whyOtMatters: 'অস্ত্রোপচার ও ওটি-তে এর গুরুত্ব:',
    copyTerm: 'সংজ্ঞা কপি করুন',
    copied: 'কপি করা হয়েছে!'
  }
};
