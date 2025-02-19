export async function fetchWithAuth(url: string, config: RequestInit = {}) {
  const { headers, ...rest } = config;

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    ...rest,
    credentials: "include", // ✅ ქუქი ავტომატურად იგზავნება
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Request failed");
  }

  return response;
}
