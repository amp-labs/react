import { useToast } from '@chakra-ui/react';

export function ToastSuccessConnection() {
  const toast = useToast();
  toast({
    title: 'Connection successful',
    description: 'You can now use the connection',
    status: 'success',
    duration: 5000,
    isClosable: true,
    position: 'top-right',
  });
}

export function ToastOauthFailed() {
  const toast = useToast();
  toast({
    title: 'OAuth failed',
    description: 'Please try again',
    status: 'error',
    duration: Infinity,
    isClosable: true,
    position: 'top-right',
  });
}

export function ToastConnectError() {
  const toast = useToast();
  toast({
    title: 'Error making connection',
    description: 'No connection ID found in event data',
    status: 'error',
    duration: Infinity,
    isClosable: true,
    position: 'top-right',
  });
}
