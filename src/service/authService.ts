// src/services/authService.ts

export const loginApi = async (username: string, password: string) => {
    const response = await fetch('http://localhost:3001/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
  
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Invalid username or password. Please try again.");
      } else {
        throw new Error("Server error. Please try again later.");
      }
    }
  
    return await response.json();
  };
  