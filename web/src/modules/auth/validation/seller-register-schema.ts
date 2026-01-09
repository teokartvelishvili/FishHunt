import * as z from "zod";

export const sellerRegisterSchema = z.object({
  storeName: z.string().min(1, "მაღაზიის სახელი სავალდებულოა"),
  storeSlug: z
    .string()
    .min(3, "საიტის სახელი უნდა შეიცავდეს მინიმუმ 3 სიმბოლოს")
    .max(50, "საიტის სახელი არ უნდა აღემატებოდეს 50 სიმბოლოს")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "საიტის სახელი უნდა შეიცავდეს მხოლოდ პატარა ლათინურ ასოებს, ციფრებს და ტირეს"
    )
    .optional(),
  storeAddress: z.string().min(1, "მაღაზიის მისამართი სავალდებულოა"),
  storeLocation: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
  // Remove storeLogo since we'll handle it as a file upload
  ownerFirstName: z.string().min(1, "სახელი სავალდებულოა"),
  ownerLastName: z.string().min(1, "გვარი სავალდებულოა"),
  phoneNumber: z
    .string()
    .regex(/^\+995\d{9}$/, "ტელეფონის ნომერი უნდა იყოს +995 ფორმატში"),
  email: z.string().email("არასწორი ელ-ფოსტის ფორმატი"),
  password: z
    .string()
    .min(6, "პაროლი უნდა შეიცავდეს მინიმუმ 6 სიმბოლოს")
    .max(20, "პაროლი არ უნდა აღემატებოდეს 20 სიმბოლოს"),
  identificationNumber: z
    .string()
    .length(11, "პირადი ნომერი უნდა შეიცავდეს 11 ციფრს"),
  accountNumber: z
    .string()
    .regex(/^GE[0-9]{2}[A-Z0-9]{18}$/, "არასწორი IBAN ფორმატი")
    .refine((value) => value.length === 22, "IBAN უნდა შეიცავდეს 22 სიმბოლოს"),
  agreeToPrivacyPolicy: z
    .boolean()
    .refine(
      (val) => val === true,
      "კონფიდენციალურობის პოლიტიკაზე თანხმობა აუცილებელია"
    ),
  agreeToSellerAgreement: z
    .boolean()
    .refine(
      (val) => val === true,
      "გამყიდველის ხელშეკრულებაზე თანხმობა აუცილებელია"
    ),
  agreeToTerms: z
    .boolean()
    .refine(
      (val) => val === true,
      "ზოგადი წესებისა და პირობების თანხმობა აუცილებელია"
    ),
});
