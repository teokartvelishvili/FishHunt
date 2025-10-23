# 🚀 სწრაფი დაწყება - YouTube Integration

## ⚡ 5 წუთში გაშვება

### 1️⃣ Google Cloud Setup (2 წუთი)

```bash
# 1. გადადით: https://console.cloud.google.com/
# 2. შექმენით პროექტი: "FishHunt YouTube"
# 3. Enable API: YouTube Data API v3
# 4. OAuth Consent: External + Test user (თქვენი email)
# 5. Create Credentials: OAuth Client ID (Web Application)
# 6. Redirect URI: http://localhost:4000/v1/youtube/oauth2callback
# 7. დაუნლოდეთ credentials JSON
```

### 2️⃣ YouTube Playlist (1 წუთი)

```bash
# 1. გადადით: https://studio.youtube.com/
# 2. Playlists → NEW PLAYLIST
# 3. Title: "პროდუქტები"
# 4. დააკოპირეთ Playlist ID (PLxxxxxxxxxx...)
```

### 3️⃣ Backend Setup (2 წუთი)

```bash
cd server

# დაამატეთ .env-ში:
cat >> .env << EOF

# YouTube Configuration
YOUTUBE_CLIENT_ID=your-client-id.apps.googleusercontent.com
YOUTUBE_CLIENT_SECRET=GOCSPX-your-secret
YOUTUBE_REDIRECT_URI=http://localhost:4000/v1/youtube/oauth2callback
YOUTUBE_PLAYLIST_ID=PLxxxxxxxxxx
YOUTUBE_REFRESH_TOKEN=
EOF

# Authorization (ბრაუზერში გაიხსნება)
npm run youtube:auth

# დააკოპირეთ Refresh Token და დაამატეთ .env-ში
# შემდეგ restart server
npm run dev
```

### 4️⃣ ტესტირება (30 წამი)

```bash
# 1. გადადით: http://localhost:3000/admin/products
# 2. "ახალი პროდუქტის დამატება"
# 3. აირჩიეთ ვიდეო ფაილი (< 50MB ტესტისთვის)
# 4. შეავსეთ ფორმა და დააჭირეთ "შექმნა"
# 5. ✅ Success! შეამოწმეთ YouTube-ზე
```

---

## 🔑 სწრაფი Checklist

### ყველაფერი მზად არის თუ:
- [ ] YouTube Data API v3 გააქტიურებული
- [ ] OAuth Client ID შექმნილი
- [ ] Playlist შექმნილი YouTube-ზე
- [ ] `.env` შევსებული (5 ცვლადი)
- [ ] `npm run youtube:auth` გაშვებული
- [ ] Refresh Token `.env`-ში დამატებული
- [ ] Server გაშვებული (`npm run dev`)
- [ ] Frontend გაშვებული

---

## 🆘 რა თუ რამე არ მუშაობს?

### API არ არის configured
```bash
# შეამოწმეთ .env
cat server/.env | grep YOUTUBE

# უნდა ჩანდეს 5 ხაზი:
# YOUTUBE_CLIENT_ID=...
# YOUTUBE_CLIENT_SECRET=...
# YOUTUBE_REDIRECT_URI=...
# YOUTUBE_PLAYLIST_ID=...
# YOUTUBE_REFRESH_TOKEN=...
```

### Authorization ვერ მუშაობს
```bash
# 1. შეამოწმეთ Redirect URI Google Console-ში
# 2. უნდა ემთხვეოდეს .env-ის YOUTUBE_REDIRECT_URI-ს
# 3. Restart server .env ცვლილების შემდეგ
```

### Upload ვერ მუშაობს
```bash
# 1. შეამოწმეთ Browser Console (F12)
# 2. შეამოწმეთ Server logs
# 3. ფაილის ზომა < 500MB?
# 4. ფორმატი MP4/AVI/MOV?
```

---

## 📚 სრული დოკუმენტაცია

იხილეთ: [YOUTUBE_INTEGRATION_GUIDE.md](./YOUTUBE_INTEGRATION_GUIDE.md)

---

## 💡 სასარგებლო ბრძანებები

```bash
# Authorization (refresh token-ის მისაღებად)
npm run youtube:auth

# Server გაშვება
cd server && npm run dev

# Frontend გაშვება
cd web && npm run dev

# Logs-ის მონიტორინგი
cd server && npm run dev | grep -i youtube

# API ტესტირება
curl http://localhost:4000/v1/youtube/auth
```

---

## 🎯 რა შემდეგ?

1. ✅ პროდუქტის შექმნა ვიდეოთი
2. 📺 YouTube Studio-ში ვიდეოს შემოწმება
3. 🌐 პროდუქტის გვერდზე ვიდეოს ნახვა
4. 🚀 Production deployment

გისურვებთ წარმატებას! 🎉
