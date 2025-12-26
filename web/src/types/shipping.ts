export interface ShippingDetails {
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface PaymentResult {
  id: string;
  status: string;
  update_time: string;
  email_address: string;
}
