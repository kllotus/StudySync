# [🎓 StudySync](#🎓-studysync)
**Real-time collaborative study matches with dynamic institutional branding.**

StudySync is a [React Native](https://reactnative.dev/) application that connects students based on their exact course codes. It features a **smart branding engine** that automatically skins the UI to match your university's colors based on your `.edu` email address.

---

## [📖 Description](#📖-description)
In high-pressure academic environments, finding a study partner for a niche course is often left to chance. StudySync provides a dedicated space for students to:

- Find peers enrolled in the same courses  
- Join virtual rooms with synchronized Pomodoro timers  
- Coordinate via university-specific chats  

It acts as a **central hub for academic accountability**, ensuring students never have to study alone.

---

## [📑 Table of Contents](#📑-table-of-contents)
- [🏗️ Project Documentation](#🏗️-project-documentation)  
- [🚀 Usage](#🚀-usage)  
- [✨ Features](#✨-features)  
- [🛠️ Technologies Used](#🛠️-technologies-used)  
- [💻 Installation](#💻-installation)  

---

## [🏗️ Project Documentation](#🏗️-project-documentation)
Technical backend requirements and database structures are detailed in:

- [Backend & Database Setup](./docs/BACKEND.md) – Includes SQL scripts and Supabase RLS policies.

---

## [🚀 Usage](#🚀-usage)
Start the app with Expo:
```bash
npx expo start

Open the Expo Go
 app on your iOS or Android device.

Scan the QR code displayed in your terminal to launch the app.

Sign up with a .edu email to enable institutional branding and join study rooms.

✨ Features

Institutional Auto-Theme: Automatically skins the app for supported universities (e.g., UNL, UMich, UCLA) based on your email domain.

8-Step Onboarding: Seamless registration capturing your major, courses, and study preferences.

Integrated Study Calendar: Track upcoming sessions and deadlines directly in-app.

Live Pomodoro Timer: Shared 25/5 minute focus timer to sync study intervals with your partner.

Persistent Auth: Session automatically restores using AsyncStorage, so you don’t have to log in every time.

🛠️ Technologies Used

Frontend: React Native
 (Expo)

Backend: Supabase
 (Auth & PostgreSQL)

Storage: @react-native-async-storage

State Management: React Hooks (useState, useEffect, useRef)

💻 Installation

Follow these steps to set up the project locally:

Clone the repository

git clone https://github.com/username/project-name.git
cd project-name

Install core dependencies

npm install

Install mobile-specific modules

npx expo install @supabase/supabase-js @react-native-async-storage/async-storage

Configure environment variables
Create a .env file in the root directory:

EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here