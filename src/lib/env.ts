// Environment configuration
// Create a .env.local file in your project root with:
// NEXT_PUBLIC_BACKEND_URL=your_backend_url_here

export const env = {
  BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000",
} as const;

// Validate required environment variables
export function validateEnv() {
  const requiredVars = ["NEXT_PUBLIC_BACKEND_URL"];
  const missing = requiredVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    console.warn(`Missing environment variables: ${missing.join(", ")}`);
    console.warn(
      "Using default values. Create a .env.local file with proper values."
    );
  }
}
