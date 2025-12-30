# Google Analytics 4 Data API Setup - დეტალური ინსტრუქცია

## ნაბიჯი 1: Google Analytics 4 Property-ის შექმნა

### 1.1 Google Analytics-ში შესვლა

1. გადადით: https://analytics.google.com/
2. შედით თქვენი Google ანგარიშით

### 1.2 GA4 Property-ის შექმნა

1. დააჭირეთ "Create Property" ღილაკს
2. აირჩიეთ "Web"
3. შეიყვანეთ საიტის დეტალები:
   - **Property name**: `FishHunt`
   - **Website URL**: `https://fishhunt.ge`
   - **Industry category**: `Sports & Recreation`
   - **Business size**: თქვენი არჩევანი
4. დააჭირეთ "Create"

### 1.3 Property ID-ის მიღება

1. მარცხენა მენიუდან: "Admin" (ქვედა მარცხენა კუთხე)
2. "Property" სექციაში დააჭირეთ "Property Settings"
3. დააკოპირეთ **Property ID** (იწყება G-ით, მაგ: G-XXXXXXXXXX)

## ნაბიჯი 2: Google Cloud Console-ში Service Account-ის შექმნა

### 2.1 Google Cloud Console-ში შესვლა

1. გადადით: https://console.cloud.google.com/
2. აირჩიეთ ან შექმენით პროექტი (იგივე რომელიც YouTube API-სთვის გამოიყენეთ)

### 2.2 Google Analytics Data API-ის გააქტიურება

1. მარცხენა მენიუდან: "APIs & Services" → "Library"
2. ძებნის ველში ჩაწერეთ: `Google Analytics Data API`
3. დააჭირეთ "Google Analytics Data API"-ს
4. დააჭირეთ "ENABLE" ღილაკს

### 2.3 Service Account-ის შექმნა

1. მარცხენა მენიუდან: "APIs & Services" → "Credentials"
2. ზემოთ დააჭირეთ "CREATE CREDENTIALS" → "Service account"
3. შეავსეთ დეტალები:
   - **Service account name**: `fishhunt-analytics`
   - **Service account ID**: `fishhunt-analytics@your-project.iam.gserviceaccount.com`
   - **Description**: `Service account for FishHunt GA4 analytics`
4. დააჭირეთ "CREATE AND CONTINUE"

### 2.4 Service Account Key-ის შექმნა

1. "Keys" ტაბში დააჭირეთ "ADD KEY" → "Create new key"
2. აირჩიეთ "JSON" ფორმატი
3. დააჭირეთ "CREATE"
4. JSON ფაილი ავტომატურად ჩამოიტვირთება

## ნაბიჯი 3: GA4 Property-ზე წვდომის მინიჭება

### 3.1 GA4-ში Admin პანელში შესვლა

1. გადადით: https://analytics.google.com/
2. აირჩიეთ თქვენი Property

### 3.2 Service Account-ის დამატება

1. მარცხენა მენიუდან: "Admin"
2. "Property" სექციაში: "Property Access Management"
3. დააჭირეთ "+" ღილაკს (Add users)
4. შეიყვანეთ Service Account email: `fishhunt-analytics@your-project.iam.gserviceaccount.com`
5. მიანიჭეთ "Viewer" როლი
6. დააჭირეთ "Add"

## ნაბიჯი 4: Environment Variables-ის დაყენება

### 4.1 .env.local ფაილის განახლება

დაამატეთ შემდეგი ხაზები `.env.local` ფაილში:

```env
# Google Analytics 4 Data API
GA4_PROPERTY_ID=G-XXXXXXXXXX
GA4_CREDENTIALS={"type":"service_account","project_id":"your-project","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"fishhunt-analytics@your-project.iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/fishhunt-analytics%40your-project.iam.gserviceaccount.com"}
```

**შენიშვნა**: `GA4_CREDENTIALS` უნდა იყოს ერთი ხაზი JSON სტრინგი.

### 4.2 JSON Credentials-ის კონვერტაცია

თუ გაქვთ JSON ფაილი, გამოიყენეთ ეს ბრძანება ერთ ხაზად გადასაყვანად:

```bash
cat credentials.json | jq -c .
```

ან ონლაინ JSON minifier: https://www.webtoolkitonline.com/json-minifier.html

## ნაბიჯი 5: ტესტირება

### 5.1 სერვერის გადატვირთვა

```bash
cd server
npm run start:dev
```

### 5.2 Admin Analytics გვერდის შემოწმება

1. გადადით: `http://localhost:3000/admin/analytics`
2. უნდა იხილოთ რეალური მონაცემები 0-ების მაგივრად

## პრობლემების მოგვარება

### თუ მაინც 0-ები ჩანს:

1. შეამოწმეთ Property ID სწორია
2. შეამოწმეთ Service Account-ს აქვს Viewer წვდომა GA4 Property-ზე
3. შეამოწმეთ Credentials JSON სწორად არის დაკოპირებული
4. შეამოწმეთ სერვერის ლოგები შეცდომებისთვის

### თუ "GA4 Analytics not configured" შეცდომა:

- შეამოწმეთ GA4_PROPERTY_ID და GA4_CREDENTIALS environment variables

## დამატებითი რესურსები

- [GA4 Data API Documentation](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [Service Account Setup Guide](https://cloud.google.com/iam/docs/service-accounts-create)</content>
  <parameter name="filePath">c:\Users\a.beroshvili\Documents\GitHub\FishHunt\GA4_SETUP.md
