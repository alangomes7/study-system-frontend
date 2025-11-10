import { Bounce, toast, ToastContainer } from 'react-toastify';

type MessagesContainerProps = {
  children: React.ReactNode;
};
export default function Message({ children }: MessagesContainerProps) {
  toast.dismiss();
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
