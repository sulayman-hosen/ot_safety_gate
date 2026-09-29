# ORBIT · OT Pre-Surgical Safety Gate 🛡️

> **An EHR-Integrated Digital Safety Gate for Operating Theaters**  
> Compliant with the **WHO Surgical Safety Checklist (Time-Out)**, **SMART on FHIR R4**, and **USCDI v3 Standards**.  
> Built with **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS v4**, **Node.js 22+**, **Express 5**, and **MongoDB / Mongoose**.

---

## 📑 সূচিপত্র (Table of Contents)
1. [প্রজেক্ট পরিচিতি ও উদ্দেশ্য (Project Overview) 🇧🇩](#-প্রজেক্ট-পরিচিতি-ও-উদ্দেশ্য-project-overview)
2. [প্রজেক্টটি যেভাবে কাজ করে (How The Project Works) 🇧🇩](#-প্রজেক্টটি-যেভাবে-কাজ-করে-how-the-project-works)
   - [ধাপ ১: SMART on FHIR লঞ্চ ও পেশেন্ট কনটেক্সট বাইন্ডিং](#ধাপ-১-smart-on-fhir-লঞ্চ-ও-পেশেন্ট-কনটেক্সট-বাইন্ডিং)
   - [ধাপ ২: ৪টি স্বয়ংক্রিয় ক্লিনিক্যাল প্রমাণ যাচাই (Automated Checks)](#ধাপ-২-৪টি-স্বয়ংক্রিয়-ক্লিনিক্যাল-প্রমাণ-যাচাই-automated-checks)
   - [ধাপ ৩: মাল্টি-রোল ক্লিনিক্যাল টিম রিভিউ (Role Perspectives)](#ধাপ-৩-মাল্টি-রোল-ক্লিনিক্যাল-টিম-রিভিউ-role-perspectives)
   - [ধাপ ৪: সেফটি গেট লক ও ক্লিয়ারেন্স সিদ্ধান্ত](#ধাপ-৪-সেফটি-গেট-লক-ও-ক্লিয়ারেন্স-সিদ্ধান্ত)
   - [ধাপ ৫: জরুরি ক্লিনিক্যাল ওভাররাইড প্রটোকল (Emergency Override)](#ধাপ-৫-জরুরি-ক্লিনিক্যাল-ওভাররাইড-প্রটোকল-emergency-override)
   - [ধাপ ৬: অফিসিয়াল ক্লিয়ারেন্স সার্টিফিকেট ও এক্সপোর্ট](#ধাপ-৬-অফিসিয়াল-ক্লিয়ারেন্স-সার্টিফিকেট-ও-এক্সপোর্ট)
3. [সিস্টেম আর্কিটেকচার (System Architecture)](#-সিস্টেম-আর্কিটেকচার-system-architecture)
4. [ইন্সটলেশন ও রান করার নিয়ম (Setup & Run Guide) 🇧🇩](#-ইন্সটলেশন-ও-রান-করার-নিয়ম-setup--run-guide)
5. [English Technical Specification & Architecture](#-english-technical-specification--architecture)
6. [Interactive Clinical Demo Scenarios](#-interactive-clinical-demo-scenarios)
7. [Health IT & Clinical Coding Standards](#-health-it--clinical-coding-standards)
8. [Troubleshooting & FAQ](#-troubleshooting--faq)

---

## 🩺 প্রজেক্ট পরিচিতি ও উদ্দেশ্য (Project Overview)

হাসপাতালের অপারেশন থিয়েটারে (OT) প্রতি বছর হাজার হাজার সার্জিক্যাল ভুল বা কমপ্লিকেশন ঘটে, যার মধ্যে রয়েছে:
- ভুল রোগীর অপারেশন বা ভুল অঙ্গে ইনসিশন দেওয়া (Wrong-patient / Wrong-site surgery)
- রোগীর অ্যালার্জি হিস্টোরি না দেখে ভুল অ্যান্টিবায়োটিক প্রয়োগ করে তীব্র অ্যানাফিল্যাক্টিক শক
- রক্ত জমাট বাঁধার ক্ষমতা (PT/INR বা Platelets) মারাত্মক অস্বাভাবিক থাকা অবস্থায় সার্জারি শুরু করে অতিরিক্ত রক্তক্ষরণ
- রোগীর বৈধ অপারেশনের সম্মতিপত্র (Informed Surgical Consent) অনুপস্থিত থাকা

ঐতিহ্যগতভাবে ওটি টিম কাগজের চেকলিস্ট দেখে মৌখিকভাবে এই বিষয়গুলো মেলায়। কিন্তু এতে সময় নষ্ট হয়, কাগজ হারিয়ে যায় এবং ইএইচআর (EHR - Electronic Health Record) সিস্টেমের সর্বশেষ ল্যাব বা অ্যালার্জি ডেটার সাথে তাৎক্ষণিক কোনো সংযোগ থাকে না।

**ORBIT (Operating Theater Pre-Surgical Safety Gate)** একটি ডিজিটাল সেফটি গেট সিস্টেম যা সরাসরি হাসপাতালের EHR-এর ভেতরে SMART on FHIR প্রটোকলের মাধ্যমে কাজ করে। এটি সার্জনের ইনসিশন শুরুর আগে স্বয়ংক্রিয়ভাবে রোগীর লাইভ রেকর্ড থেকে ডেটা টেনে ৪টি গুরুত্বপূর্ণ নিরাপত্তা ধাপ যাচাই করে এবং পুরো সার্জিক্যাল টিমকে একটি অভিন্ন, ডিজিটালি ভেরিফায়েড সেফটি গেটের আওতায় নিয়ে আসে।

---

## ⚙️ প্রজেক্টটি যেভাবে কাজ করে (How The Project Works)

ORBIT প্রজেক্টের সম্পূর্ণ কার্যপদ্ধতি ৬টি মূল ধাপে বিভক্ত:

```
[ EHR Launch (Epic/Cerner) ]
            │
            ▼
[ SMART on FHIR OAuth2 + PKCE Authentication ]
            │
            ▼
[ Patient & Encounter Context Locked ]
            │
            ▼
[ 4 Automated Clinical Evidence Checks ]
 ├── Check 01: Procedure & Diagnosis Match (CPT + SNOMED CT)
 ├── Check 02: Surgical Consent Verification (DocumentReference + Signature)
 ├── Check 03: Coagulation & Lab Safety Panel (LOINC: PT/INR & Platelets)
 └── Check 04: Antibiotic & Drug Allergy Cross-Check (RxNorm Reconciliation)
            │
            ▼
[ Multi-Disciplinary Team Review (Surgeon / Anesthesia / Nurse) ]
            │
            ├───────────────┬────────────────────────┐
            ▼               ▼                        ▼
      [ ALL PASS ]     [ MISMATCH/FAIL ]    [ CRITICAL TRAUMA ]
            │               │                        │
            ▼               ▼                        ▼
     [ GATE: READY ] [ GATE: BLOCKED ]    [ EMERGENCY OVERRIDE ]
   (Incision Cleared) (Incision Locked)  (Attending MD Privilege)
            │                                        │
            └────────────────┬───────────────────────┘
                             ▼
              [ Official Clearance Certificate ]
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
[ Export HL7 CDA XML / FHIR JSON ]    [ Printable PDF Letterhead ]
```

### ধাপ ১: SMART on FHIR লঞ্চ ও পেশেন্ট কনটেক্সট বাইন্ডিং
1. সার্জন বা ওটি নার্স যখন হাসপাতালের EHR (যেমন Epic, Cerner, বা ওপেন-সোর্স OpenMRS)-এ একটি ওটি শিডিউল খোলেন, তখন সেখানে থাকা **ORBIT Safety Gate** অ্যাপে ক্লিক করেন।
2. অ্যাপটি **SMART on FHIR Discovery** প্রটোকল অনুযায়ী OAuth2 + S256 PKCE অথরাইজেশন শুরু করে।
3. EHR সিস্টেম ওটি নার্স/সার্জনের আইডেন্টিটি ভেরিফাই করে একটি পেশেন্ট-স্কোপড অ্যাক্সেস টোকেন (`patient/*.read`, `launch`) প্রদান করে।
4. ব্রাউজার ও সার্ভার সেশনটি নির্দিষ্ট রোগীর (`Patient ID`) এবং নির্দিষ্ট সার্জিক্যাল এনকাউন্টারের (`Encounter ID`) সাথে এনক্রিপ্টেড আকারে লক হয়ে যায়। ভুল রোগীর ডেটা দেখার কোনো সুযোগ থাকে না।

### ধাপ ২: ৪টি স্বয়ংক্রিয় ক্লিনিক্যাল প্রমাণ যাচাই (Automated Checks)
সার্ভার ব্যাকএন্ড স্বয়ংক্রিয়ভাবে FHIR R4 রেস্টফুল এপিআই দিয়ে রোগীর রেকর্ড থেকে প্রমাণ সংগ্রহ করে এবং অ্যালগরিদমের মাধ্যমে যাচাই করে:

1. **Check 01: সার্জিক্যাল প্রসিডিউর ও ডায়াগনোসিস ম্যাচিং (Procedure & Diagnosis)**
   - শিডিউল করা সার্জারি অর্ডার (`ServiceRequest`) এর সাথে লিঙ্ক করা ডায়াগনোসিস কোড মেলানো হয়।
   - প্রসিডিউর কোডিং: **CPT 44970** (Laparoscopic Appendectomy)
   - ডায়াগনোসিস কোডিং: **SNOMED CT 74400008** (Acute Appendicitis)
   - কোড দুটি ক্লিনিক্যালি সামঞ্জস্যপূর্ণ কি না তা সিস্টেম নিজে থেকে ম্যাচ করে।

2. **Check 02: সার্জিক্যাল কনসেন্ট ও অঙ্গের সাইট ভেরিফিকেশন (Surgical Consent)**
   - রোগীর বৈধ সম্মতিপত্র (`Consent` ও `DocumentReference`) আছে কি না দেখা হয়।
   - রোগীর নিজের অথবা আইনানুগ অভিভাবকের ডিজিটাল/হস্তাক্ষরিত স্বাক্ষর (`Provenance`) নিশ্চিত করা হয়।
   - কনসেন্ট পেপারে উল্লেখিত অপারেশনের নাম, তারিখ ও বডি সাইট (বাম/ডান/নির্দিষ্ট অঙ্গ) ওটি শিডিউলের সাথে নিখুঁতভাবে মেলে কি না পরীক্ষা করা হয়।

3. **Check 03: রক্ত জমাট বাঁধার টেস্ট ও ল্যাব প্যানেল (Coagulation & Hematology Panel)**
   - ল্যাবরেটরি রেজাল্ট (`Observation`) থেকে LOINC কোডের মাধ্যমে সর্বশেষ টেস্ট যাচাই করা হয়:
     - **LOINC 6301-6 (INR / Prothrombin Time)**: সাধারণ সার্জারির জন্য INR ≤ ১.৫ হতে হয়। যদি INR ১.৫ এর বেশি হয় (যেমন: ওয়ারফারিন বা ব্লাড থিনার ওষুধের কারণে), তবে সার্জারি চলাকালীন অভ্যন্তরীণ রক্তক্ষরণের ঝুঁকি তৈরি হয় এবং গেট সতর্কবার্তা দেয়।
     - **LOINC 777-3 (Platelets count)**: সাধারণ কাটাকাটির জন্য প্লাটিলেট কাউন্ট কমপক্ষে ৫০,০০০/µL বা তার বেশি থাকতে হয়। এর নিচে নামলে সিস্টেম লাল সতর্কবার্তা দিয়ে ওটি টিমকে জানায়।
   - রক্তের টেস্টটি সাম্প্রতিক (সাধারণত ৪৮ থেকে ৭২ ঘণ্টার ভেতরে) কি না তাও টাইমেক্সপায়ারি চেকের মাধ্যমে যাচাই করা হয়।

4. **Check 04: ওটি অ্যান্টিবায়োটিক ও ড্রাগ অ্যালার্জি ক্রস-চেক (Antibiotic Prophylaxis & Drug Allergy)**
   - সার্জারির আগে রোগীকে যে প্রি-অপারেটিভ অ্যান্টিবায়োটিক দেওয়ার অর্ডার (`MedicationRequest`) রয়েছে (যেমন: Cefazolin, Cefuroxime) তা দেখা হয়।
   - একই সাথে রোগীর হিস্টোরিতে থাকা ড্রাগ অ্যালার্জি (`AllergyIntolerance`) রিকনসাইল করা হয়।
   - যদি রোগীর পেনিসিলিন বা বিটা-ল্যাক্টাম অ্যালার্জিতে সিভিয়ার অ্যানাফিল্যাক্সিস বা শ্বাসকষ্টের রেকর্ড থাকে, তবে সেফালোস্পোরিন গ্রুপের অ্যান্টিবায়োটিক দিলে মারাত্মক রিঅ্যাকশন হতে পারে। সিস্টেম তাৎক্ষণিক ক্রস-অ্যালার্জি সতর্কতা তৈরি করে গেট বন্ধ করে দেয়।

### ধাপ ৩: মাল্টি-রোল ক্লিনিক্যাল টিম রিভিউ (Role Perspectives)
ওটিতে একার সিদ্ধান্তে কোনো অপারেশন শুরু হয় না। হেডার বারে থাকা **Clinical Role Switcher** দিয়ে টিমের ৩ জন সদস্য তাদের নিজস্ব দায়িত্ব অনুযায়ী প্রমাণ পর্যবেক্ষণ করেন:
- 👨‍⚕️ **Lead Surgeon (প্রধান সার্জন)**: রোগীর নাম, সঠিক অঙ্গ, সাইট মার্কিং এবং সার্জিক্যাল প্রসিডিউর অনুমোদন করেন।
- 🩺 **Attending Anesthesiologist (অ্যানেস্থেসিওলজিস্ট)**: এয়ারওয়ে অ্যাসেসমেন্ট, অ্যানাস্থেশিয়া ওষুধ ও মারাত্মক ড্রাগ অ্যালার্জি ক্রস-চেক করেন।
- 👩‍⚕️ **Circulating Nurse (ওটি নার্স)**: স্টেরিলিটি ইন্ডিকেটর, কনসেন্ট পেপারের অরিজিনাল কপি ও রক্ত পরীক্ষার সর্বশেষ রেজাল্ট নিশ্চিত করেন।

ডানদিকের **Team Review** ড্রয়ারে বিশ্ব স্বাস্থ্য সংস্থার (WHO) ৪টি নীতিগত কনফার্মেশন চেকবক্স রয়েছে:
1. *Identity, procedure & site*: রোগীর পরিচয়, পরিকল্পিত পদ্ধতি ও স্থান নিশ্চিতকরণ।
2. *Original consent reviewed*: আসল সই করা সম্মতিপত্র পর্যালোচনা।
3. *Antibiotic plan reviewed*: অ্যান্টিবায়োটিক প্রফিল্যাক্সিস ও অ্যালার্জি নিশ্চিতকরণ।
4. *Coagulation status checked*: রক্তক্ষরণ সংক্রান্ত ল্যাব টেস্ট পর্যালোচনা।

### ধাপ ৪: সেফটি গেট লক ও ক্লিয়ারেন্স সিদ্ধান্ত
- **READY (সবুজ গেট)**: যদি ৪টি ক্লিনিক্যাল চেকের প্রমাণ মিলে যায় এবং ওটি টিম চারটি কনফার্মেশন সম্পন্ন করে, তখন সিস্টেম ওটিকে **CLEARANCE GRANTED** ঘোষণা করে। ইনসিশন শুরু করার জন্য ওটি সেফ।
- **ACTION REQUIRED / BLOCKED (লাল গেট)**: যদি কোনো প্রমাণ মিসিং থাকে (যেমন: কনসেন্ট পেপার নেই, বা প্লাটিলেট মারাত্মক কম), তবে গেট স্বয়ংক্রিয়ভাবে ব্লক থাকে।

### ধাপ ৫: জরুরি ক্লিনিক্যাল ওভাররাইড প্রটোকল (Emergency Override)
বাস্তব জীবনে সড়ক দুর্ঘটনা, অভ্যন্তরীণ অঙ্গ ফেটে যাওয়া (Ruptured Organ), বা অতিরিক্ত রক্তক্ষরণের (Hemorrhagic Shock) মতো ইমার্জেন্সি রোগী আসতে পারে, যেখানে ল্যাব টেস্টের রিপোর্ট আসার অপেক্ষা করলে রোগী মারা যাবে।
- সেক্ষেত্রে এটেন্ডিং ফিজিশিয়ান বা সার্জন **Emergency Override Protocol** ব্যবহার করতে পারেন।
- সার্জনকে সুনির্দিষ্ট ক্লিনিক্যাল কারণ ড্রপডাউন থেকে নির্বাচন করতে হয় অথবা অতিরিক্ত নোট লিখতে হয়।
- এটি HIPAA Security Rule § 164.312(b) অনুযায়ী অডিট ট্রেইলে স্থায়ীভাবে লেখকের নাম, পদবী ও টাইমস্ট্যাম্পসহ সেভ হয়ে যায়।
- ওভাররাইড অ্যাক্টিভ হলে ওটি গেট আনলক হয় এবং সার্টিফিকেটে স্পষ্টভাবে **"EMERGENCY CLEARED (OVERRIDE ACTIVE)"** ওয়াটারমার্কযুক্ত ডকুমেন্ট প্রস্তুত হয়।

### ধাপ ৬: অফিসিয়াল ক্লিয়ারেন্স সার্টিফিকেট ও এক্সপোর্ট
- **Clearance Certificate Modal**: সম্পূর্ণ ওটি সাইন-অফ রেকর্ড, রোগী ও ডাক্তারের তথ্য এবং ল্যাব ব্রেকডাউনসহ একটি অফিশিয়াল প্রি-অপারেটিভ ক্লিয়ারেন্স সার্টিফিকেট প্রদর্শন করে, যা ব্রাউজার থেকে সরাসরি ১-ক্লিকে প্রিন্ট বা PDF হিসেবে সেভ করা যায়।
- **Clinical Exports**:
  - **HL7 CDA R2 XML**: আন্তর্জাতিক ক্লিনিক্যাল ডকুমেন্ট আর্কিটেকচার অনুযায়ী তৈরি ফরম্যাট।
  - **FHIR JSON Bundle**: ফায়ার কম্পোজিশন বান্ডেল যা হাসপাতালের কেন্দ্রীয় EHR-এ আর্কাইভ করা যায়।
  - **Printable HTML Summary**: ওটি ফাইলে যুক্ত করার উপযোগী ক্লিনিক্যাল সামারি।

---

## 🏗️ সিস্টেম আর্কিটেকচার (System Architecture)

```
[ Frontend: Next.js 15 Client (Port 3000) ]
  ├── App Router (layout.jsx, page.jsx)
  ├── Typography: Roboto (Headings) + Inter (Body/Text, line-height: 1.4rem)
  ├── Styling: Tailwind CSS v4 + Vanilla CSS Design Tokens (Dark / Light)
  ├── State: React 19 Context (AppContext.jsx) + Workflow Hook (useSurgicalSafetyWorkflow)
  ├── Components:
  │    ├── layout/ (WorkspaceHeader, AppSidebar)
  │    ├── dashboard/ (PatientContextCard, SafetyGateBanner, DemoWelcomePanel)
  │    ├── evidence/ (Procedure, Consent, Labs, Allergy Evidence Cards)
  │    ├── review/ (TeamReviewPanel, EmergencyOverrideModal, ClearanceCertificateModal)
  │    └── knowledge/ (KeyTermsDialog - 11 Health IT Standards)
  └── Proxied API Requests (/api/* -> localhost:5000)
            │
            ▼ (HTTP / JSON / Same-Site Cookies)
            │
[ Backend: Node.js 22+ & Express 5 Server (Port 5000) ]
  ├── Security Middleware (CORS, CSRF, Origin Checks, AES-256-GCM Encryption)
  ├── SMART on FHIR OAuth2 & PKCE Authorization Engine (smartAuthorizationService.js)
  ├── Clinical Evaluation Engine (evidenceService.js & clinicalPolicy.js)
  │    ├── CPT & SNOMED CT Ontologies
  │    ├── LOINC Threshold Evaluator
  │    └── RxNorm Allergy & Drug Reconciliation
  ├── Document Generators (fhirDocumentService.js, cdaDocumentService.js)
  └── Persistence Adapters:
       ├── Production: MongoDB + Mongoose (Encrypted sessions & immutable records)
       └── Zero-Setup Demo: High-Performance In-Memory Repository
```

---

## 🚀 ইন্সটলেশন ও রান করার নিয়ম (Setup & Run Guide)

### ১. প্রয়োজনীয় সফটওয়্যার (Prerequisites)
- **Node.js 22 বা নতুন সংস্করণ** ([Node.js অফিশিয়াল সাইট থেকে ডাউনলোড করুন](https://nodejs.org/))
- **npm** (Node.js ইনস্টল করলে স্বয়ংক্রিয়ভাবে পাওয়া যায়)
- (ঐচ্ছিক) MongoDB লোকাল অথবা MongoDB Atlas কানেকশন স্ট্রিং (প্রোডাকশন মোডের জন্য)।

### ২. দ্রুত টেস্ট রান (Zero-Setup Instant Demo)
কোনো ডেটাবেজ কনফিগারেশন ছাড়াই সরাসরি সিন্থেটিক ডেটা দিয়ে প্রজেক্টটি টেস্ট করার জন্য টার্মিনালে রান করুন:

```bash
# প্রোজেক্টের রুট ফোল্ডারে টার্মিনাল খুলুন:
npm ci
npm run demo
```

টার্মিনালে সার্ভার রান হলে আপনার ব্রাউজারে প্রবেশ করুন:  
👉 **http://localhost:3000**

> [!NOTE]  
> ঠিক `http://localhost:3000` অ্যাড্রেসটি ব্যবহার করুন। নিরাপত্তা ও অরিজিন ট্রাস্ট চেকের কারণে লোকালহোস্টের পোর্ট ঠিক থাকা জরুরি।

### ৩. ফুল ডেভলপমেন্ট রান (MongoDB সহ)
যদি আপনি মোঙ্গোডিবিতে এনক্রিপ্টেড সেশন ও রেকর্ড স্থায়ীভাবে সংরক্ষণ করতে চান:

```bash
# ১. পরিবেশ ভেরিয়েবল ফাইল তৈরি করুন:
# Windows PowerShell:
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env.local

# Linux / macOS:
cp server/.env.example server/.env
cp client/.env.example client/.env.local

# ২. এনক্রিপশন কি (AES-256 Key) তৈরি করুন:
npm run key
```

টার্মিনালে যে Base64 কি দেখাবে, সেটি কপি করে `server/.env` ফাইলের `SESSION_ENCRYPTION_KEY` ভেরিয়েবলে পেস্ট করুন। আপনার লোকাল মোঙ্গোডিবি ইউআরআই `MONGODB_URI=mongodb://localhost:27017/ot_safety_gate` দিয়ে সেভ করুন।

তারপর রান করুন:
```bash
npm run dev
```

---

## 💻 English Technical Specification & Architecture

### Typography & Developer-Friendly Design System
- **Headings (`h1`–`h6`)**: Standardized to **Roboto** (`var(--font-roboto)`), a clean, geometric sans-serif engineered for rapid legibility in high-stress surgical monitors.
- **Body, Paragraphs & Spans (`p`, `span`, `label`, `input`)**: Standardized to **Inter** (`var(--font-inter)`), paired with a comfortable `line-height: 1.4rem` and natural `letter-spacing: normal`.
- **Monospace (`code`, `kbd`, `.font-mono`)**: Preserved for clinical code badges (CPT, LOINC, SNOMED CT, RxNorm) to guarantee character alignment.
- **Dark Mode Architecture**: Designed with tailored zinc neutrals (`#09090b` surface, `#121215` card, `#18181b` subtle borders). Contrast tested to prevent glare in low-light operating theaters.

### Security & Privacy Protections
- **Zero Bearer Token Exposure**: Access tokens and sensitive patient metadata are held exclusively in server-side encrypted memory or AES-256-GCM encrypted MongoDB collections. No bearer tokens are ever written to browser `localStorage` or `sessionStorage`.
- **Strict Frame Origin Validation**: Client layout checks trusted EHR framing parents before rendering inside an EHR `<iframe>`.
- **Cryptographic Audit Trail**: Every clinical override, checklist confirmation, and document export is stamped with the practitioner's identity and timestamp in accordance with HIPAA Security Rule § 164.312(b).

---

## 🧪 Interactive Clinical Demo Scenarios

The platform includes **5 one-click realistic clinical presets** to simulate safety outcomes:

| Scenario Preset | Clinical Condition | Expected Gate Status | Educational Focus |
|---|---|---|---|
| **Complete evidence** | Laparoscopic appendectomy with normal labs, signed consent, and penicillin allergy reconciled | 🟢 **Ready for review** | Ideal surgical pathway; all 4 checks pass. |
| **Antibiotic allergy** | Patient scheduled for cefazolin with documented history of penicillin anaphylaxis | 🔴 **Action required** | Beta-lactam cross-reactivity warning; prevents lethal drug reaction. |
| **Consent mismatch** | Scheduled for laparoscopic appendectomy, but consent document cites left inguinal hernia repair | 🔴 **Action required** | Prevents wrong-procedure / wrong-site surgical errors. |
| **Outdated INR** | Prothrombin Time/INR sample collected > 72 hours ago | 🔴 **Action required** | Enforces active coagulation validity before major incision. |
| **Abnormal platelets** | Severe thrombocytopenia (Platelets: 28,000 /µL) | 🔴 **Action required** | Coagulopathy alert; requires transfusion standby before incision. |

---

## 📚 Health IT & Clinical Coding Standards

Click the **Key Terms Guide (11)** button in the application header at any time to explore interactive clinical standard definitions:

- **EHR (Electronic Health Record)**: Central repository of patient medical charts (Epic, Cerner).
- **FHIR R4 (Fast Healthcare Interoperability Resources)**: HL7 RESTful JSON specification for exchanging healthcare records.
- **SMART on FHIR**: OAuth2 + OpenID Connect profile for launching patient-context apps inside EHRs.
- **CPT (Current Procedural Terminology)**: Standard 5-digit code identifying medical and surgical procedures.
- **SNOMED CT**: Comprehensive clinical healthcare terminology for diagnoses and findings.
- **LOINC (Logical Observation Identifiers Names and Codes)**: Standard for identifying medical laboratory observations.
- **RxNorm**: Standardized nomenclature for clinical drugs and active medication ingredients.
- **HL7 CDA R2**: XML-based standard for clinical documents and discharge summaries.
- **USCDI v3**: United States Core Data for Interoperability standard dataset.
- **HIPAA**: Health Insurance Portability and Accountability Act protecting patient health data.

---

## 🛠️ Troubleshooting & FAQ

| Problem | Cause | Solution |
|---|---|---|
| `Port 3000 or 5000 in use` | Another process is using the port. | Terminate the existing node process or update `CLIENT_PORT` and `PORT` in `.env` files. |
| `Dark mode button looks white` | Browser cache or missing hover styling. | Hard refresh the browser (`Ctrl + Shift + R` or `Cmd + Shift + R`). Fixed in `WorkspaceHeader.jsx`. |
| `Hydration error in Next.js` | Browser extensions injecting attributes into `<body>`. | Already prevented via `suppressHydrationWarning` on `<html>` and `<body>`. |
| `Encryption key error on startup` | Missing or invalid key in `server/.env`. | Run `npm run key` and paste the generated string into `SESSION_ENCRYPTION_KEY`. |
| `SMART launch rejected` | Incorrect redirect URI in EHR sandbox. | Register `http://localhost:3000/launch` and `http://localhost:3000/api/smart/callback`. |

---

## 👥 Contributors & Academic Reference
Developed for surgical quality assurance, clinical informatics demonstration, and patient safety enhancement.  
Inspired by the **World Health Organization (WHO) Guidelines for Safe Surgery**.
