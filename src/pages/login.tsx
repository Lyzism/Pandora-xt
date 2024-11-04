import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import '../index.css'

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const navigate = useNavigate()

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  const handleLogin = () => {
    // Dummy credentials
    const dummyUsername = "user123"
    const dummyPassword = "password123"

    if (!username || !password) {
      setAlertMessage("Please enter username or password. Please try again.");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 10000);
      return;
    }

    // Check credentials
    if (username === dummyUsername && password === dummyPassword) {
      navigate('/dashboard')
    } else {
      setAlertMessage("Invalid username or password. Please try again.");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 10000);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white-100 relative">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
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
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleLogin}>Log in</Button>
        </CardFooter>
      </Card>
      {showAlert && (
        <Alert className="fixed bottom-4 right-4 w-80 animate-in slide-in-from-right rounded shadow-md">
          <AlertTitle>{alertMessage.includes("Invalid") ? "Login Failed" : "Input Required"}</AlertTitle>
          <AlertDescription>
            {alertMessage}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default Login