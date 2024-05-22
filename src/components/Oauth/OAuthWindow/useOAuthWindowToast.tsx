import { useToast } from '@chakra-ui/react';

export const useOAuthWindowToast = () => {
  const toast = useToast();
  function ToastSuccessConnection() {
    toast({
      title: 'Connection successful',
      description: 'You can now use the connection',
      status: 'success',
      duration: 5000,
      isClosable: true,
      position: 'top-right',
    });
  }

  function ToastOauthFailed() {
    toast({
      title: 'OAuth failed',
      description: 'Please try again',
      status: 'error',
      duration: Infinity,
      isClosable: true,
      position: 'top-right',
    });
  }

  function ToastConnectError() {
    toast({
      title: 'Error making connection',
      description: 'No connection ID found in event data',
      status: 'error',
      duration: Infinity,
      isClosable: true,
      position: 'top-right',
    });
  }

  return { ToastSuccessConnection, ToastOauthFailed, ToastConnectError };
};
