import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface LoginAlertProps {
  showAlert: boolean;
  alertMessage: string;
}

const LoginAlert: React.FC<LoginAlertProps> = ({ showAlert, alertMessage }) => {
  if (!showAlert) return null;

  return (
    <Alert className="fixed bottom-4 right-4 w-80 animate-in slide-in-from-right rounded shadow-md">
      <AlertTitle>
        {alertMessage.includes("Invalid") ? "Login Failed" :
         alertMessage.includes("Server error") ? "Server Busy" :
         "Input Required"}
      </AlertTitle>
      <AlertDescription>
        {alertMessage}
      </AlertDescription>
    </Alert>
  );
};

export default LoginAlert;
