import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AlertMessageProps {
  showAlert: boolean;
  alertMessage: string;
}

const AlertMessage: React.FC<AlertMessageProps> = ({ showAlert, alertMessage }) => {
  if (!showAlert) return null;

  const getAlertTitle = () => {
    if (alertMessage.includes("File uploaded successfully")) {
      return "Upload Successful";
    } else if (alertMessage.includes("Failed to upload file")) {
      return "Upload Failed";
    } else if (alertMessage.includes("Please log in")) {
      return "Login Required";
    } else if (alertMessage.includes("An error occurred")) {
      return "Error";
    } else if (alertMessage.includes("Invalid")) {
      return "Login Failed";
    } else if (alertMessage.includes("Server error")) {
      return "Server Busy";
    }
    return "Notification";
  };

  return (
    <Alert className="fixed bottom-4 right-4 w-80 animate-in slide-in-from-right rounded shadow-md">
      <AlertTitle>{getAlertTitle()}</AlertTitle>
      <AlertDescription>{alertMessage}</AlertDescription>
    </Alert>
  );
};

export default AlertMessage;
