# TODO: Fix MERN + Vite + React Issues

## 1. Add Unique Keys to .map() Calls
- [x] frontend/src/components/mood/MoodTracker.tsx: Add keys to recentEntries.map() and triggers.map()
- [x] frontend/src/components/progress/ProgressDashboard.tsx: Add keys to mockMoodData.map(), periods.map(), streaks.map(), goals.map(), achievements.map()
- [ ] frontend/src/components/premium/PremiumFeatures.tsx: Add keys to moodEmojis.map(), commonTriggers.map(), recentEntries.map(), triggers.map()
- [ ] frontend/src/components/premium/PaymentModal.tsx: Add keys to paymentMethods.map(), supported.map()
- [ ] frontend/src/components/meditation/Meditation.tsx: Add keys to meditationSessions.map(), instructions.map(), instructions.slice().map()
- [ ] frontend/src/components/layout/MentalHealthLayout.tsx: Add keys to navItems.map() (both instances)
- [ ] frontend/src/components/journal/Journal.tsx: Add keys to filteredEntries.map(), tags.map()
- [ ] frontend/src/components/crisis/CrisisSupport.tsx: Add keys to copingStrategies.map(), crisisResources.map()
- [ ] frontend/src/components/theme/ThemeToggle.tsx: Add keys to themeOptions.map()
- [ ] frontend/src/components/ui/chart.tsx: Add keys to payload.map() (multiple instances)
- [ ] frontend/src/components/ui/toaster.tsx: Add keys to toasts.map()

## 2. Move Static Assets
- [ ] Move serenity-tree.png from frontend/src/assets/ to frontend/public/

## 3. Environment Configuration
- [ ] Create frontend/.env with VITE_API_URL=http://localhost:5000

## 4. Update Vite Config (if needed)
- [ ] Check if vite.config.ts needs updates for port or other settings

## 5. Verify and Test
- [ ] Restart dev server and check for console errors
- [ ] Verify images load correctly
- [ ] Confirm no ERR_CONNECTION_REFUSED errors
- [ ] Test app functionality
