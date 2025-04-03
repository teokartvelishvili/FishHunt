export async function fetchWithAuth(url: string, config: RequestInit = {}) {
  const { headers, ...rest } = config;

  if (typeof window === "undefined") {
    throw new Error("fetchWithAuth must be used in client components only");
  }

  // Add debug logging
  console.debug("fetchWithAuth URL:", url, "config:", {...config, headers: {...headers}});

  const makeRequest = async () => {
    const token = localStorage.getItem("accessToken");
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      ...rest,
      credentials: "include",
      headers: {
        ...headers,
        "Content-Type": "application/json",
        // Add token from localStorage if available (iOS fallback)
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
      },
    });
  };

  let response = await makeRequest();
  console.debug("fetchWithAuth response status:", response.status);

  if (response.status === 401) {
    // ✅ გავარკვიოთ, არსებობს თუ არა refresh token (მაგ: localStorage-ში ან cookie-ში)
    const hasRefreshToken = document.cookie.includes("refreshToken") || 
                           localStorage.getItem("refreshToken"); // Check localStorage too for iOS

    if (!hasRefreshToken) {
      console.debug("No refresh token found");
      return response; // ❌ თუ refresh token არ არსებობს, უბრალოდ ვაბრუნებთ 401 response-ს
    }

    try {
      console.debug("Attempting token refresh");
      const refreshResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
        {
          method: "POST",
          credentials: "include",
          // Include refresh token from localStorage if available (for iOS)
          headers: {
            "Content-Type": "application/json",
            ...(localStorage.getItem("refreshToken") ? 
              {"X-Refresh-Token": localStorage.getItem("refreshToken")!} : {})
          }
        }
      );

      if (refreshResponse.ok) {
        const tokenData = await refreshResponse.json();
        // If refresh returns new tokens, save them to localStorage (for iOS)
        if (tokenData.tokens?.accessToken) {
          localStorage.setItem("accessToken", tokenData.tokens.accessToken);
        }
        if (tokenData.tokens?.refreshToken) {
          localStorage.setItem("refreshToken", tokenData.tokens.refreshToken);
        }
        
        console.debug("Token refresh successful");
        response = await makeRequest(); // 🔄 ტოკენი განახლდა? თავიდან ვუშვებთ request-ს
      } else {
        console.debug("Token refresh failed");
        return response; // ❌ თუ refresh ვერ მოხერხდა, ისევ ვაბრუნებთ 401-ს
      }
    } catch (error) {
      console.error("Authentication refresh failed:", error);
      return response; // ❌ არ გადავამისამართოთ login-ზე
    }
  }

  if (!response.ok) {
    try {
      const error = await response.json();
      throw new Error(error.message || "Request failed");
    } catch {
      throw new Error("Request failed");
    }
  }

  return response;
}
