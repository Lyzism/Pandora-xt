// src/pages/Login.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import LoginAlert from "@/components/login/LoginAlert";
import PasswordInput from "@/components/login/PasswordInput";
import { loginApi } from "@/service/authService";
import { handleEnterKey } from "@/utils/keyboardHandlers";

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setAlertMessage("Please enter username or password. Please try again.");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 10000);
      return;
    }

    try {
      const data = await loginApi(username, password);
      const token = data.token;
      sessionStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = (error as Error).message || "Server error. Please try again later.";
      setAlertMessage(errorMessage);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 10000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white-100 relative">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onKeyDown={(e) => handleEnterKey(e, handleLogin)}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <PasswordInput password={password} setPassword={setPassword} />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleLogin}>Log in</Button>
        </CardFooter>
      </Card>
      <LoginAlert showAlert={showAlert} alertMessage={alertMessage} />
    </div>
  );
};

export default Login;
