export async function fetchWithAuth(url: string, config: RequestInit = {}) {
  const { headers, ...rest } = config;

  if (typeof window === "undefined") {
    throw new Error("fetchWithAuth must be used in client components only");
  }

  const makeRequest = async () => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      ...rest,
      credentials: "include",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
    });
  };

  let response = await makeRequest();

  if (response.status === 401) {
    try {
      const refreshResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (refreshResponse.ok) {
        response = await makeRequest();
      } else {
        window.location.href = "/login";
        throw new Error("Authentication failed");
      }
    } catch (error) {
      console.error("Authentication failed:", error);
      window.location.href = "/login";
      throw new Error("Authentication failed");
    }
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Request failed");
  }

  return response;
}
