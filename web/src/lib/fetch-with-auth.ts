export async function fetchWithAuth(url: string, config: RequestInit = {}) {
  const { headers, ...rest } = config;

  if (typeof window === "undefined") {
    throw new Error("fetchWithAuth must be used in client components only");
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    ...rest,
    credentials: "include", // ✅ ქუქი ავტომატურად იგზავნება
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
  });

  if (response.status === 401) {
    // თუ ტოკენი ვადაგასულია, გადავამისამართოთ ლოგინზე
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Request failed");
  }

  return response;
}
