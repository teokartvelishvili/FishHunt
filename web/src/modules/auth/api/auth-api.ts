import { axios } from "@/lib/axios";
import { User } from "@/types";

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
}

interface SellerRegisterData {
  storeName: string;
  storeLogo?: string;
  ownerFirstName: string;
  ownerLastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  identificationNumber: string;
  accountNumber: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await axios.post<AuthResponse>("/auth/login", credentials, {
      withCredentials: true
    });
    return response.data;
  },

  register: async (data: LoginCredentials & { name: string }) => {
    await axios.post("/auth/register", data, {
      withCredentials: true
    });
    return authApi.login({ 
      email: data.email, 
      password: data.password 
    });
  },

  sellerRegister: async (data: SellerRegisterData) => {
    await axios.post("/auth/sellers-register", data, {
      withCredentials: true
    });
    return authApi.login({ 
      email: data.email, 
      password: data.password 
    });
  },

  getProfile: async () => {
    const response = await axios.get<User>("/auth/profile", {
      withCredentials: true
    });
    return response.data;
  },

  logout: async () => {
    await axios.post("/auth/logout", {}, {
      withCredentials: true
    });
  },
};
