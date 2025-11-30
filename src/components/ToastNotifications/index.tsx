'use client';

import { useEffect } from 'react';
import { Bounce, toast, ToastContainer } from 'react-toastify';

type ToastNotificationsProps = {
  children: React.ReactNode;
};

export default function ToastNotifications({
  children,
}: ToastNotificationsProps) {
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
        theme='light'
        transition={Bounce}
      />
    </>
  );
}
