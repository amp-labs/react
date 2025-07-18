# AmpersandProvider with JWT Token Support

The `AmpersandProvider` now supports both API key and JWT token authentication methods.

## Usage

### API Key Authentication (Existing)

```tsx
import { AmpersandProvider } from './AmpersandContextProvider';

function App() {
  return (
    <AmpersandProvider
      options={{
        apiKey: "your-api-key-here",
        project: "your-project-id"
      }}
    >
      {/* Your app components */}
    </AmpersandProvider>
  );
}
```

### JWT Token Authentication (New)

```tsx
import { AmpersandProvider } from './AmpersandContextProvider';

function App() {
  const getToken = async (consumerRef: string, groupRef: string): Promise<string> => {
    // Your custom token retrieval logic here
    // This could involve calling your auth service, checking localStorage, etc.
    const response = await fetch('/api/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ consumerRef, groupRef }),
    });
    
    const data = await response.json();
    return data.token;
  };

  return (
    <AmpersandProvider
      options={{
        getToken,
        project: "your-project-id"
      }}
    >
      {/* Your app components */}
    </AmpersandProvider>
  );
}
```

## Features

### JWT Token Caching

The JWT token provider automatically caches tokens in both memory and localStorage:

- **Memory Cache**: Fast access for the current session
- **localStorage**: Persistence across browser sessions
- **Automatic Expiration**: Tokens are automatically refreshed when they expire
- **Cache Key**: Tokens are cached using the pattern `{consumerRef}:{groupRef}`

### Authentication Methods

The provider supports two mutually exclusive authentication methods:

1. **API Key**: Traditional API key authentication
2. **JWT Token**: Dynamic token retrieval with caching

You cannot use both methods simultaneously - the provider will throw an error if both `apiKey` and `getToken` are provided.

### Error Handling

- If neither `apiKey` nor `getToken` is provided, the provider will throw an error
- If both are provided, the provider will throw an error
- JWT token retrieval failures are properly handled and logged

## API Service Integration

The `useAPI` hook automatically detects which authentication method is available and configures the API service accordingly:

- **API Key**: Uses `X-Api-Key` header
- **JWT Token**: Uses `Authorization: Bearer {token}` header

The API service will automatically retrieve fresh tokens when needed, handling the caching and refresh logic transparently. 