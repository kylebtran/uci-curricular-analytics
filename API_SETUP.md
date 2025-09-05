# API Setup Documentation

This document explains the API infrastructure set up for your UCI Curricular Analytics application, based on your original sidebar component.

## 📁 File Structure

```
src/
├── lib/
│   ├── constants.ts          # Backend URL and API endpoints
│   ├── types.ts             # TypeScript interfaces for API responses
│   ├── api.ts               # Core API functions
│   ├── env.ts               # Environment configuration
│   └── hooks/
│       └── useApi.ts        # React hook for API operations
├── components/
│   ├── ui/
│   │   └── progress-bar.tsx # Progress bar component
│   └── sidebar-with-api.tsx # Example integration
```

## 🔧 Environment Setup

1. Create a `.env.local` file in your project root:

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

2. Update the URL to match your backend server.

## 📡 Available APIs

### 1. **Download Degree Plan (Single)**

```typescript
import { downloadDegreePlan } from "@/lib/api";

await downloadDegreePlan("student123");
```

### 2. **Download Degree Plan (Batch)**

```typescript
import { downloadDegreePlanBatch } from "@/lib/api";

await downloadDegreePlanBatch(["student1", "student2"], { toLocal: true });
```

### 3. **Get Student Attributes**

```typescript
import { getStudentAttributes } from "@/lib/api";

const attributes = await getStudentAttributes("student123");
```

### 4. **Get Logs** (Requires Authentication)

```typescript
import { getLogs } from "@/lib/api";

const logs = await getLogs(); // Requires token in localStorage
```

## 🎣 Using the API Hook

The `useApi` hook provides a convenient way to manage API calls with loading states and error handling:

```typescript
import { useApi } from "@/lib/hooks/useApi";

function MyComponent() {
  const {
    isLoading,
    error,
    batchProgress,
    downloadDegreePlan,
    downloadDegreePlanBatch,
    getStudentAttributes,
    getLogs,
    clearError,
  } = useApi();

  const handleDownload = async () => {
    try {
      await downloadDegreePlan("student123");
    } catch (error) {
      // Error is automatically set in the hook
      console.error("Download failed:", error);
    }
  };

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {batchProgress && <p>Progress: {batchProgress}</p>}
      <button onClick={handleDownload}>Download</button>
    </div>
  );
}
```

## 🔌 WebSocket Integration

The batch download includes WebSocket support for real-time progress updates:

- Automatically connects during batch operations
- Provides progress callbacks: `onProgress(current, total)`
- Handles connection errors gracefully
- Auto-closes when operation completes

## 🎨 Components

### Progress Bar

```typescript
import { ProgressBar } from "@/components/ui/progress-bar";

<ProgressBar progress={0.75} showPercentage={true} />;
```

## 🔒 Authentication

For endpoints requiring authentication (like `/logs`):

1. Store JWT token in localStorage with key `'token'`
2. The API will automatically include it in requests
3. Handle 401 errors by redirecting to login

## 🚀 Integration Example

See `src/components/sidebar-with-api.tsx` for a complete integration example that shows:

- Using the API hook
- Handling loading states
- Displaying progress
- Error handling
- File downloads

## 🛠️ Customization

### Adding New Endpoints

1. Add endpoint to `src/lib/constants.ts`:

```typescript
export const API_ENDPOINTS = {
  // ... existing endpoints
  NEW_ENDPOINT: "/new/endpoint",
} as const;
```

2. Add types to `src/lib/types.ts`:

```typescript
export interface NewResponse {
  // Define your response structure
}
```

3. Add function to `src/lib/api.ts`:

```typescript
export async function callNewEndpoint(): Promise<NewResponse> {
  // Implementation
}
```

4. Add to hook in `src/lib/hooks/useApi.ts`:

```typescript
const handleNewEndpoint = useCallback(async () => {
  // Implementation with loading/error handling
}, []);
```

## 🐛 Error Handling

All API functions include comprehensive error handling:

- HTTP status code errors
- Network errors
- JSON parsing errors
- WebSocket connection errors

Errors include:

- `message`: Human-readable error message
- `status`: HTTP status code (when applicable)
- `details`: Additional error information

## 📝 Notes

- All API calls are properly typed with TypeScript
- WebSocket protocol automatically adjusts based on HTTP/HTTPS
- File downloads handle cleanup automatically
- Progress tracking works for both local and server downloads
- Authentication tokens are managed automatically
