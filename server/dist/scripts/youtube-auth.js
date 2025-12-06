#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _dotenv = require("dotenv");
const _googleapis = require("googleapis");
const _open = /*#__PURE__*/ _interop_require_default(require("open"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
// .env ფაილის ჩატვირთვა
(0, _dotenv.config)();
const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;
const REDIRECT_URI = process.env.YOUTUBE_REDIRECT_URI || 'http://localhost:3001/api/youtube/oauth2callback';
if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error('❌ Error: YOUTUBE_CLIENT_ID და YOUTUBE_CLIENT_SECRET არ არის კონფიგურირებული .env ფაილში');
    process.exit(1);
}
const oauth2Client = new _googleapis.google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
const scopes = [
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube',
    'https://www.googleapis.com/auth/youtube.force-ssl'
];
const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
});
console.log('\n🔐 YouTube API Authorization\n');
console.log('1. ბრაუზერში გაიხსნება ავტორიზაციის გვერდი');
console.log('2. აირჩიეთ თქვენი Google ანგარიში (რომლითაც YouTube არხი გაქვთ)');
console.log('3. მიეცით უფლებები აპლიკაციას');
console.log('4. Redirect-ის შემდეგ დააკოპირეთ Refresh Token და დაამატეთ .env ფაილში');
console.log('\n📋 Authorization URL:');
console.log(authUrl);
console.log('\n');
// ავტომატურად ბრაუზერის გახსნა
(0, _open.default)(authUrl).catch(()=>{
    console.log('⚠️  ბრაუზერის ავტომატურად გახსნა ვერ მოხერხდა.');
    console.log('გთხოვთ მანუალურად გახსენით ზემოთ მოცემული URL');
});
console.log('✅ როდესაც დაასრულებთ ავტორიზაციას, დააკოპირეთ Refresh Token და დაამატეთ .env ფაილში:');
console.log('YOUTUBE_REFRESH_TOKEN=your_refresh_token_here');
console.log('\n');

//# sourceMappingURL=youtube-auth.js.map