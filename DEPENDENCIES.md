# ============================================================
# Sri Rama Printers — Dependency Reference
# ============================================================
# This is a Node.js project. Use npm to install dependencies.
# Run: cd backend && npm install
#      cd frontend && npm install
#
# For APK packaging install Capacitor CLI globally:
#   npm install -g @capacitor/cli
# ============================================================

# --- Runtime: Node.js ---
# node >= 18.x  (LTS recommended)
# npm  >= 9.x

# --- Backend (backend/package.json) ---
express@^4.18.2
mongoose@^7.5.0
cors@^2.8.5
bcryptjs@^2.4.3
jsonwebtoken@^9.0.2
dotenv@^16.3.1

# --- Backend devDependencies ---
nodemon@^3.0.1

# --- Frontend (frontend/package.json) ---
react@^19.2.0
react-dom@^19.2.0
react-router-dom@^7.9.4
axios@^1.12.2
styled-components@^6.1.19
typescript@^4.9.5
react-scripts@5.0.1
web-vitals@^2.1.4

# --- APK packaging (install separately when building APK) ---
# @capacitor/core
# @capacitor/cli
# @capacitor/android
# Android Studio + JDK 17 required for APK build
