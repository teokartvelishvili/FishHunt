# FishHunt SEO ოპტიმიზაცია

## რას გავაკეთეთ SEO-სთვის

### 1. **Dynamic Meta Tags** (ყოველი ფორუმის პოსტისთვის)
- ✅ უნიკალური title და description ყოველი პოსტისთვის
- ✅ Open Graph tags სოციალური მედიისთვის (Facebook, Messenger, WhatsApp)
- ✅ Twitter Card tags
- ✅ Keywords based on categories
- ✅ Canonical URLs
- ✅ Author information

### 2. **JSON-LD Structured Data**
ყოველი ფორუმის პოსტი შეიცავს Google-ისთვის სტრუქტურირებულ მონაცემებს:
- 📊 DiscussionForumPosting schema
- 👤 Author information
- 💬 Comment count
- 👍 Like count
- 🏷️ Categories (keywords)
- 🖼️ Images

### 3. **Sitemap.xml**
ავტომატურად გენერირდება:
- Მთავარი გვერდი (priority: 1.0)
- ფორუმის მთავარი გვერდი (priority: 0.9, hourly updates)
- ყველა ფორუმის პოსტი (priority: 0.75, weekly updates)
- ყველა პროდუქტი (priority: 0.8)
- ყველა კატეგორია (priority: 0.7)

### 4. **Robots.txt**
```
User-agent: *
Allow: /
Sitemap: https://fishhunt.ge/sitemap.xml
```

### 5. **Page Titles & Descriptions**

#### ფორუმის მთავარი გვერდი:
```
Title: ფორუმი - FishHunt | თევზაობა, მონადირება, კემპინგი
Description: შემოუერთდით ჩვენს საზოგადოებას - განიხილეთ თევზაობა, მონადირება და კემპინგი
```

#### ფორუმის პოსტი:
```
Title: [პოსტის ტექსტის პირველი 60 სიმბოლო] - FishHunt ფორუმი
Description: [პოსტის ტექსტის პირველი 160 სიმბოლო]
Keywords: [კატეგორიები], თევზაობა, მონადირება, კემპინგი
```

### 6. **Image Optimization**
- ✅ Next.js Image component (ავტომატური ოპტიმიზაცია)
- ✅ Alt attributes ყველა სურათისთვის
- ✅ 1200x630 Open Graph images

## როგორ მუშაობს Google-ში ძებნა

### მაგალითი 1: პირდაპირი ტექსტის ძებნა
```
თუ ვინმე დაწერს: "თევზაობა რიონში"
და ფორუმში ზუსტად ეს წინადადებაა → Google-ი პირდაპირ მაჩვენებს ამ პოსტს
```

### მაგალითი 2: კატეგორიით ძებნა
```
Google: "თევზაობა საქართველოში"
→ მაჩვენებს ყველა პოსტს რომელსაც აქვს category: "fishing"
```

### მაგალითი 3: კომბინირებული ძებნა
```
Google: "მონადირება კემპინგი რჩევები"
→ მაჩვენებს პოსტებს რომლებსაც აქვთ ეს keywords-ები
```

## რას ხედავს Google

### 1. ფორუმის პოსტი Google-ში:
```
[Title] რიონზე თევზაობის რჩევები - FishHunt ფორუმი
[URL] https://fishhunt.ge/forum?postId=12345
[Description] გავიზიარე ჩემი გამოცდილება რიონზე თევზაობის შესახებ...
[Image Preview] 📸
[Comments] 💬 25 | [Likes] 👍 47
[Categories] თევზაობა, კემპინგი
```

### 2. Messenger/WhatsApp/Facebook-ზე გაზიარებისას:
```
┌──────────────────────────┐
│  📸 [პოსტის სურათი]       │
├──────────────────────────┤
│ FishHunt ფორუმი          │
│ [პოსტის სათაური]          │
│ [პოსტის აღწერა...]       │
└──────────────────────────┘
```

## SEO Performance Tips

### ✅ რას აკეთებს სწორად
1. **Semantic HTML** - სწორი heading hierarchy (h1, h2, h3)
2. **Structured Data** - Google-ს ესმის რა არის თქვენი კონტენტი
3. **Mobile-First** - responsive დიზაინი
4. **Fast Loading** - Next.js ოპტიმიზაცია
5. **Unique Content** - ყოველი პოსტი უნიკალურია
6. **User Engagement** - likes, comments, shares

### 📊 Google Rankings Factors
1. **Content Quality** (40%) - უნიკალური, სასარგებლო კონტენტი
2. **User Engagement** (25%) - likes, comments, time on page
3. **Technical SEO** (20%) - sitemap, structured data, mobile-friendly
4. **Backlinks** (15%) - სხვა საიტებიდან ლინკები

## როგორ გავაუმჯობესოთ კიდევ უფრო

### 1. Google Search Console
```bash
1. გადადით: https://search.google.com/search-console
2. დაამატეთ თქვენი საიტი: https://fishhunt.ge
3. Verify ownership
4. Submit sitemap: https://fishhunt.ge/sitemap.xml
```

### 2. Google Analytics
```javascript
// დაამატეთ layout.tsx-ში
<Script src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" />
```

### 3. Schema.org Testing
გადაამოწმეთ თქვენი structured data:
```
https://validator.schema.org/
https://search.google.com/test/rich-results
```

### 4. Social Media Meta Tags Testing
```
Facebook: https://developers.facebook.com/tools/debug/
Twitter: https://cards-dev.twitter.com/validator
LinkedIn: https://www.linkedin.com/post-inspector/
```

## Production Deployment Checklist

### ✅ Before Deploy
- [ ] შეცვალეთ `NEXT_PUBLIC_APP_URL=https://fishhunt.ge` in .env.production
- [ ] შეცვალეთ `NEXT_PUBLIC_API_URL=https://api.fishhunt.ge/v1`
- [ ] დაამატეთ Google Verification code in layout.tsx
- [ ] შექმენით og-image.jpg (1200x630px) in /public folder

### ✅ After Deploy
- [ ] Submit sitemap to Google Search Console
- [ ] Test structured data with Google Rich Results Test
- [ ] Test Open Graph with Facebook Debugger
- [ ] Monitor performance with PageSpeed Insights

## გამოყენება

### როგორ შევამოწმოთ SEO
```bash
# 1. ლოკალურად
npm run build
npm run start

# 2. გახსენით: http://localhost:3000/forum?postId=SOME_POST_ID

# 3. View Page Source (Ctrl+U) და ნახეთ:
- <meta property="og:title" ... />
- <meta property="og:description" ... />
- <meta property="og:image" ... />
- <script type="application/ld+json"> ... </script>
```

### როგორ დავინდექსოთ Google-ში
1. Deploy production-ზე
2. Google Search Console → Sitemaps → Submit
3. URL Inspection → Request Indexing (important pages)
4. დაელოდეთ 1-2 კვირას Google-ის crawling-ს

## კონტაქტი დახმარებისთვის
თუ რაიმე კითხვა გაქვთ SEO-სთან დაკავშირებით, შემიძლია დაგეხმაროთ!
