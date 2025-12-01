'use client';

import { useEffect } from 'react';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useThemeData } from '@/components';

type ToastNotificationsProps = {
  children: React.ReactNode;
};

export default function ToastNotifications({
  children,
}: ToastNotificationsProps) {
  const { theme } = useThemeData();

  useEffect(() => {
    toast.dismiss();
  }, []);

  return (
    <>
      {children}
      <ToastContainer
        position='top-center'
        autoClose={10000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
        transition={Bounce}
        toastClassName='!bg-card-background !text-foreground !border !border-border !rounded-lg !shadow-md font-sans'
      />
    </>
  );
}
