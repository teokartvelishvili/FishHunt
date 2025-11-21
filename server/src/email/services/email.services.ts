import { emailConfig } from '@/email.config';
import { Injectable } from '@nestjs/common';

import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: emailConfig.host, // ✅ `service` არ არის საჭირო
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: {
        user: emailConfig.auth.user,
        pass: emailConfig.auth.pass,
      },
      tls: {
        rejectUnauthorized: false, // ✅ სერტიფიკატის გადამოწმების გამორთვა
      },
    });
  }

  async sendPasswordResetEmail(to: string, resetToken: string) {
    const resetLink = `${process.env.ALLOWED_ORIGINS}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: emailConfig.from,
      to,
      subject: 'Password Reset Request',
      html: `
        <p>თქვენს ანგარიშზე პაროლის აღდგენის მოთხოვნა შევიდა.</p>
        <p>პაროლის აღსადგენად დააჭირეთ ქვემოთ მოცემულ ბმულს:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>თუ ეს თქვენ არ გაგიგზავნიათ, უბრალოდ არ იმოქმედოთ.</p>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendOrderSuccessEmail(orderData: {
    orderId: string;
    customerEmail: string;
    customerName: string;
    totalAmount: number;
    items: any[];
    shippingAddress: any;
    sellerEmails?: string[];
  }) {
    const adminEmail = process.env.ADMIN_EMAIL;

    // Email to Customer
    const customerMailOptions = {
      from: emailConfig.from,
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
            ${orderData.items
              .map(
                (item) => `
              <li>${item.name} - ${item.quantity} ცალი - ${item.price} ₾</li>
            `,
              )
              .join('')}
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
      `,
    };

    // Email to Admin
    const adminMailOptions = {
      from: emailConfig.from,
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
            ${orderData.items
              .map(
                (item) => `
              <li>${item.name} - ${item.quantity} ცალი - ${item.price} ₾</li>
            `,
              )
              .join('')}
          </ul>

          <h3>მიწოდების მისამართი:</h3>
          <p>
            ${orderData.shippingAddress.address}<br>
            ${orderData.shippingAddress.city}, ${orderData.shippingAddress.postalCode}<br>
            ${orderData.shippingAddress.country}
          </p>
        </div>
      `,
    };

    // Email to Sellers (if any)
    const sellerMailPromises =
      orderData.sellerEmails?.map((sellerEmail) => {
        const sellerItems = orderData.items.filter(
          (item) => item.sellerEmail === sellerEmail,
        );
        return this.transporter.sendMail({
          from: emailConfig.from,
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
              ${sellerItems
                .map(
                  (item) => `
                <li>${item.name} - ${item.quantity} ცალი - ${item.price} ₾</li>
              `,
                )
                .join('')}
            </ul>
          </div>
        `,
        });
      }) || [];

    // Send all emails
    await Promise.all([
      this.transporter.sendMail(customerMailOptions),
      this.transporter.sendMail(adminMailOptions),
      ...sellerMailPromises,
    ]);
  }

  async sendOrderFailedEmail(orderData: {
    orderId: string;
    customerEmail: string;
    customerName: string;
    totalAmount: number;
    reason?: string;
  }) {
    const adminEmail = process.env.ADMIN_EMAIL;

    // Email to Customer
    const customerMailOptions = {
      from: emailConfig.from,
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
      `,
    };

    // Email to Admin
    const adminMailOptions = {
      from: emailConfig.from,
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
      `,
    };

    await Promise.all([
      this.transporter.sendMail(customerMailOptions),
      this.transporter.sendMail(adminMailOptions),
    ]);
  }
}
