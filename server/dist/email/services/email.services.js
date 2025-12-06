"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EmailService", {
    enumerable: true,
    get: function() {
        return EmailService;
    }
});
const _emailconfig = require("../../email.config");
const _common = require("@nestjs/common");
const _nodemailer = /*#__PURE__*/ _interop_require_wildcard(require("nodemailer"));
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let EmailService = class EmailService {
    async sendPasswordResetEmail(to, resetToken) {
        const resetLink = `${process.env.ALLOWED_ORIGINS}/reset-password?token=${resetToken}`;
        const mailOptions = {
            from: _emailconfig.emailConfig.from,
            to,
            subject: 'Password Reset Request',
            html: `
        <p>თქვენს ანგარიშზე პაროლის აღდგენის მოთხოვნა შევიდა.</p>
        <p>პაროლის აღსადგენად დააჭირეთ ქვემოთ მოცემულ ბმულს:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>თუ ეს თქვენ არ გაგიგზავნიათ, უბრალოდ არ იმოქმედოთ.</p>
      `
        };
        await this.transporter.sendMail(mailOptions);
    }
    async sendOrderSuccessEmail(orderData) {
        const adminEmail = process.env.ADMIN_EMAIL;
        // Email to Customer
        const customerMailOptions = {
            from: _emailconfig.emailConfig.from,
            to: orderData.customerEmail,
            subject: `შეკვეთა #${orderData.orderId} წარმატებით დასრულდა`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2b5534;">მადლობა შეძენისთვის, ${orderData.customerName}!</h2>
          <p>თქვენი შეკვეთა წარმატებით შესრულდა.</p>
          
          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>შეკვეთის დეტალები:</h3>
            <p><strong>შეკვეთის ნომერი:</strong> ${orderData.orderId}</p>
            <p><strong>საერთო თანხა:</strong> ${orderData.totalAmount} ₾</p>
          </div>

          <h3>პროდუქტები:</h3>
          <ul>
            ${orderData.items.map((item)=>`
              <li>${item.name} - ${item.quantity} ცალი - ${item.price} ₾</li>
            `).join('')}
          </ul>

          <h3>მიწოდების მისამართი:</h3>
          <p>
            ${orderData.shippingAddress.address}<br>
            ${orderData.shippingAddress.city}, ${orderData.shippingAddress.postalCode}<br>
            ${orderData.shippingAddress.country}
          </p>

          <p style="margin-top: 30px;">
            <a href="${process.env.ALLOWED_ORIGINS}/orders/${orderData.orderId}" 
               style="background: #2b5534; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
              შეკვეთის ნახვა
            </a>
          </p>
        </div>
      `
        };
        // Email to Admin
        const adminMailOptions = {
            from: _emailconfig.emailConfig.from,
            to: adminEmail,
            subject: `ახალი შეკვეთა #${orderData.orderId}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2b5534;">ახალი შეკვეთა მიღებულია!</h2>
          
          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>შეკვეთის დეტალები:</h3>
            <p><strong>შეკვეთის ნომერი:</strong> ${orderData.orderId}</p>
            <p><strong>მყიდველი:</strong> ${orderData.customerName} (${orderData.customerEmail})</p>
            <p><strong>საერთო თანხა:</strong> ${orderData.totalAmount} ₾</p>
          </div>

          <h3>პროდუქტები:</h3>
          <ul>
            ${orderData.items.map((item)=>`
              <li>${item.name} - ${item.quantity} ცალი - ${item.price} ₾</li>
            `).join('')}
          </ul>

          <h3>მიწოდების მისამართი:</h3>
          <p>
            ${orderData.shippingAddress.address}<br>
            ${orderData.shippingAddress.city}, ${orderData.shippingAddress.postalCode}<br>
            ${orderData.shippingAddress.country}
          </p>
        </div>
      `
        };
        // Email to Sellers (if any)
        const sellerMailPromises = orderData.sellerEmails?.map((sellerEmail)=>{
            const sellerItems = orderData.items.filter((item)=>item.sellerEmail === sellerEmail);
            return this.transporter.sendMail({
                from: _emailconfig.emailConfig.from,
                to: sellerEmail,
                subject: `ახალი შეკვეთა თქვენი პროდუქტებისთვის #${orderData.orderId}`,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2b5534;">ახალი შეკვეთა!</h2>
            <p>თქვენი პროდუქტები შეიძინეს.</p>
            
            <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>შეკვეთის ნომერი:</strong> ${orderData.orderId}</p>
            </div>

            <h3>თქვენი პროდუქტები:</h3>
            <ul>
              ${sellerItems.map((item)=>`
                <li>${item.name} - ${item.quantity} ცალი - ${item.price} ₾</li>
              `).join('')}
            </ul>
          </div>
        `
            });
        }) || [];
        // Send all emails
        await Promise.all([
            this.transporter.sendMail(customerMailOptions),
            this.transporter.sendMail(adminMailOptions),
            ...sellerMailPromises
        ]);
    }
    async sendOrderFailedEmail(orderData) {
        const adminEmail = process.env.ADMIN_EMAIL;
        // Email to Customer
        const customerMailOptions = {
            from: _emailconfig.emailConfig.from,
            to: orderData.customerEmail,
            subject: `შეკვეთა #${orderData.orderId} ვერ შესრულდა`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #c62828;">გადახდა ვერ შესრულდა</h2>
          <p>უკაცრავად, ${orderData.customerName}, თქვენი შეკვეთის გადახდა ვერ შესრულდა.</p>
          
          <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #c62828;">
            <p><strong>შეკვეთის ნომერი:</strong> ${orderData.orderId}</p>
            <p><strong>თანხა:</strong> ${orderData.totalAmount} ₾</p>
            ${orderData.reason ? `<p><strong>მიზეზი:</strong> ${orderData.reason}</p>` : ''}
          </div>

          <p>გთხოვთ სცადოთ ხელახლა ან დაგვიკავშირდით მხარდაჭერის სამსახურთან.</p>

          <p style="margin-top: 30px;">
            <a href="${process.env.ALLOWED_ORIGINS}/orders/${orderData.orderId}" 
               style="background: #c62828; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
              ხელახლა ცდა
            </a>
          </p>
        </div>
      `
        };
        // Email to Admin
        const adminMailOptions = {
            from: _emailconfig.emailConfig.from,
            to: adminEmail,
            subject: `გადახდა ვერ შესრულდა - შეკვეთა #${orderData.orderId}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #c62828;">გადახდა ვერ შესრულდა</h2>
          
          <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>შეკვეთის ნომერი:</strong> ${orderData.orderId}</p>
            <p><strong>მყიდველი:</strong> ${orderData.customerName} (${orderData.customerEmail})</p>
            <p><strong>თანხა:</strong> ${orderData.totalAmount} ₾</p>
            ${orderData.reason ? `<p><strong>მიზეზი:</strong> ${orderData.reason}</p>` : ''}
          </div>
        </div>
      `
        };
        await Promise.all([
            this.transporter.sendMail(customerMailOptions),
            this.transporter.sendMail(adminMailOptions)
        ]);
    }
    constructor(){
        this.transporter = _nodemailer.createTransport({
            host: _emailconfig.emailConfig.host,
            port: _emailconfig.emailConfig.port,
            secure: _emailconfig.emailConfig.secure,
            auth: {
                user: _emailconfig.emailConfig.auth.user,
                pass: _emailconfig.emailConfig.auth.pass
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    }
};
EmailService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [])
], EmailService);

//# sourceMappingURL=email.services.js.map