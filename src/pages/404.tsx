import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, HomeIcon } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');

  const handleReturn = () => {
    if (token) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <Button onClick={handleReturn} className="flex items-center">
        {token ? (
          <>
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Return Back
          </>
        ) : (
          <>
            <HomeIcon className="mr-2 h-4 w-4" />
            Return to Home
          </>
        )}
      </Button>
    </div>
  );
};

export default NotFound;