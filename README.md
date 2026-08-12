# Texin — Textile Professional Network

Bangladesh-এর টেক্সটাইল সেক্টরের জন্য LinkedIn-স্টাইল নেটওয়ার্কিং অ্যাপ। এখন **Firebase**
(Auth + Firestore) দিয়ে চলে — সব ডেটা real, সব ইউজারের জন্য shared।

---

## ধাপ ১: Firebase Project বানান (৫ মিনিট)

1. https://console.firebase.google.com এ যান, **Add project** চাপুন, নাম দিন (যেমন `texin-app`)।
2. প্রজেক্ট খুললে বাম পাশে **Build > Authentication** → **Get started** → **Email/Password** enable করুন।
3. বাম পাশে **Build > Firestore Database** → **Create database** → production mode → কাছের region সিলেক্ট করুন।
4. Firestore-এর **Rules** ট্যাবে গিয়ে নিচের rules বসিয়ে **Publish** করুন (logged-in user রা পড়তে/লিখতে পারবে):
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```
5. **Project settings** (⚙️ আইকন) → **General** ট্যাব → নিচে "Your apps" → **</> (Web)** আইকনে ক্লিক করে একটা web app add করুন। এখানে যে config object দেখাবে, সেখান থেকে ৬টা value কপি করুন।

## ধাপ ২: Config বসান

`.env.example` ফাইলটা কপি করে `.env` নামে save করুন, তারপর ধাপ ১-এর ৬টা value বসান:

```bash
cp .env.example .env
```

তারপর `.env` ফাইল খুলে value গুলো বসিয়ে দিন।

## ধাপ ৩: লোকালি চালিয়ে টেস্ট করুন (ঐচ্ছিক)

```bash
npm install
npm run dev
```

ব্রাউজারে খুলে সাইন আপ / লগ ইন টেস্ট করুন।

---

## APK বানানো — GitHub Actions দিয়ে (কোনো ইনস্টল ছাড়াই, recommended)

এই প্রজেক্টে `.github/workflows/build-android.yml` নামে একটা workflow যোগ করা আছে,
যেটা GitHub-এ push করলে automatic APK বানিয়ে দেবে।

1. GitHub-এ একটা নতুন **private** repo বানান, এই পুরো ফোল্ডারটা push করুন:
   ```bash
   git init
   git add .
   git commit -m "Texin app with Firebase"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
2. Repo-র **Settings > Secrets and variables > Actions** এ গিয়ে নিচের ৬টা secret যোগ করুন
   (নাম আর value ঠিক `.env` ফাইলের মতোই):
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
3. Repo-র **Actions** ট্যাবে যান — "Build Android APK" workflow automatic রান হবে (২-৩ মিনিট লাগবে)।
4. রান শেষ হলে সেই run-এ ঢুকে নিচে **Artifacts** সেকশনে `texin-debug-apk` নামে zip পাবেন —
   ডাউনলোড করে unzip করলে `app-debug.apk` পাবেন। এটাই আপনার ফোনে ইনস্টল করার APK।
   (ফোনে "Unknown apps install" পারমিশন দিতে হতে পারে।)

এই debug APK দিয়ে টেস্ট করা যাবে। Play Store-এ দেওয়ার জন্য পরে signed **release** build লাগবে
(keystore বানিয়ে `assembleRelease` চালাতে হবে — দরকার হলে সেটাও করে দিতে পারি)।

---

## APK বানানো — নিজের কম্পিউটারে (বিকল্প)

Android Studio ইনস্টল থাকলে:

```bash
npm install
npm run build
npx cap sync android
npx cap open android
```

Android Studio খুললে **Build > Build Bundle(s) / APK(s) > Build APK(s)** চাপুন।
APK পাবেন `android/app/build/outputs/apk/debug/app-debug.apk` এ।

---

## গঠন (Structure)

- `src/firebase.ts` — Firebase config
- `src/context/AuthContext.tsx` — Auth + Firestore data (users/posts/factories/jobs) real-time sync
- `src/App.tsx` — Login/SignUp gate + main app
- `android/` — Capacitor দিয়ে জেনারেট করা native Android project
- `.github/workflows/build-android.yml` — cloud-এ APK auto-build
