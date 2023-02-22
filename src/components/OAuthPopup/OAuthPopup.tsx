import React, { useEffect, useState, useRef } from 'react';

const DEFAULT_WIDTH = 600; // px
const DEFAULT_HEIGHT = 600; // px
const DEFAULT_INTERVAL = 700; // ms

type IWindowProps = {
  url: string;
  title: string;
};

type IPopupProps = IWindowProps & {
  onClose: () => void;
  onCode: (code: string, params: URLSearchParams) => void;
  children: React.ReactNode;
};

const createPopup = ({
  url, title,
}: IWindowProps) => {
  const left = window.screenX + (window.outerWidth - DEFAULT_WIDTH) / 2;
  const top = window.screenY + (window.outerHeight - DEFAULT_HEIGHT) / 2.5;
  const popup = window.open(
    url,
    title,
    `width=${DEFAULT_WIDTH},height=${DEFAULT_HEIGHT},left=${left},top=${top}`,
  );
  return popup;
};

function OAuthPopup({
  title = '',
  url,
  children,
  onCode,
  onClose,
}: IPopupProps) {
  const [externalWindow, setExternalWindow] = useState<Window | null>();
  const intervalRef = useRef<number>();

  const clearTimer = () => window.clearInterval(intervalRef.current);
  const onContainerClick = () => setExternalWindow(createPopup({ url, title }));

  useEffect(() => {
    if (externalWindow) {
      intervalRef.current = window.setInterval(() => {
        try {
          const currentUrl = externalWindow.location.href;
          const { searchParams } = new URL(currentUrl);
          const code = searchParams.get('code');
          if (!code) return;
          onCode(code, searchParams);
          clearTimer();
          externalWindow.close();
        } catch (error) {
          // eslint-disable-next-line no-console
          // TODO: HANDLE ERROR IN UI
          console.error(error);
        } finally {
          if (!externalWindow || externalWindow.closed) {
            onClose();
            clearTimer();
          }
        }
      }, DEFAULT_INTERVAL);
    }
    return () => {
      if (externalWindow) externalWindow.close();
      if (onClose) onClose();
    };
  }, [externalWindow]);

  return (
    // eslint-disable-next-line
    <div onClick={() => onContainerClick()}>
      { children }
    </div>
  );
}

export default OAuthPopup;
