# প্রজেক্ট চালানোর নিয়ম

এই ZIP-এর মূল folder `ot-surgical-safety-platform`। এর মধ্যে frontend-এর সব কাজ **client** এবং backend-এর সব কাজ **server** folder-এ রাখা হয়েছে।

## ব্যবহার করা প্রযুক্তি

| অংশ | প্রযুক্তি |
|---|---|
| Frontend | Next.js, JavaScript/JSX, Tailwind CSS |
| Backend | Node.js, Express.js, JavaScript |
| Database | MongoDB ও Mongoose |
| Heading font | Roboto — সব h1 থেকে h6 |
| Paragraph/body font | Inter — সব p tag ও সাধারণ লেখা |

TypeScript বা Python source নেই। JSX হলো React-এর JavaScript syntax। JSON configuration এবং clinical export-এর XML/HTML হলো প্রয়োজনীয় file format। Font ফাইল local রাখা আছে।

## দ্রুত demo দেখুন

1. Node.js 22 বা পরের version install করুন।
2. ZIP extract করে `ot-surgical-safety-platform` folder VS Code-এ খুলুন।
3. ওই folder-এর terminal-এ চালান:

```bash
npm ci
npm run demo
```

Browser-এ **http://localhost:3000** খুলে **Open interactive demo** চাপুন। একই command থেকে client ও server দুটোই চলবে। Demo-তে MongoDB বা EHR account লাগে না; restart দিলে temporary data মুছে যাবে।

**Complete evidence** scenario-তে চারটি checkbox tick করে **Record reviewed checklist** চাপুন। তারপর FHIR document, CDA narrative বা printable summary download করুন। Allergy/consent/lab সমস্যা থাকলে reviewed checklist বন্ধ থাকবে, কিন্তু draft save করা যাবে।

## MongoDB ব্যবহার করুন

`server/.env.example` copy করে `server/.env` বানান। `client/.env.example` copy করে `client/.env.local` বানান। Terminal-এ:

```bash
npm run key
```

এতে পাওয়া base64 key `server/.env`-এর `SESSION_ENCRYPTION_KEY`-এ বসান। `MONGODB_URI`-তে local MongoDB অথবা নিজের Atlas connection string বসান। Local MongoDB service চালু থাকতে হবে। `STORAGE_MODE=mongo` রাখুন। তারপর:

```bash
npm run dev
```

এবার Mongoose দিয়ে MongoDB-তে encrypted session, checklist record ও audit সংরক্ষণ হবে। EHR secret এবং database URI শুধু `server/.env`-এ রাখবেন।

## কোন file-এ কোন কাজ

| কাজ | File / folder |
|---|---|
| Main UI | `client/src/components/dashboard/SurgicalSafetyDashboard.jsx` |
| Sidebar / header | `client/src/components/layout/` |
| Consent, allergy, procedure, lab UI | `client/src/components/evidence/` |
| Review checkbox / export buttons | `client/src/components/review/` |
| Font setup | `client/src/app/layout.jsx` |
| Tailwind theme ও font mapping | `client/src/app/globals.css` |
| Frontend API call | `client/src/services/apiClient.js` |
| Express app ও server start | `server/src/app.js`, `server/src/server.js` |
| API endpoint list | `server/src/routes/` |
| API-এর request handling | `server/src/controllers/` |
| Mongoose models | `server/src/models/` |
| Database read/write | `server/src/repositories/` |
| Clinical rules | `server/src/config/clinicalPolicy.js` |
| SMART login logic | `server/src/services/smart/smartAuthorizationService.js` |
| FHIR data fetch | `server/src/services/fhir/fhirClientService.js` |
| Clinical check | `server/src/services/clinical/safetyEvaluationService.js` |
| Document তৈরি | `server/src/services/documents/clinicalDocumentService.js` |
| Tests | `server/tests/` |

Frontend page convention-এর জন্য `page.jsx`/`layout.jsx` নাম রাখা হয়েছে। অন্য feature file-এর নাম তার কাজ অনুযায়ী দেওয়া হয়েছে।

## Build ও test

```bash
npm test
npm run test:integration
npm run build
npm start
```

Production start-এর আগে MongoDB ও env configuration লাগবে। আলাদা terminal চাইলে `npm run dev --workspace server` এবং `npm run dev --workspace client` ব্যবহার করুন।

Real EHR launch করতে client registration ও EHR data access লাগবে। বিস্তারিত `server/docs/SMART_SETUP.md`-এ আছে। এই project-এর clinical policy synthetic উদাহরণ; real patient care-এর আগে hospital policy, security ও EHR integration যাচাই করতে হবে। Test-এর সীমাবদ্ধতা `server/docs/VALIDATION.md`-এ লেখা আছে।
