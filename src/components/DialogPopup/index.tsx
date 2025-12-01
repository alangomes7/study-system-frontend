import { type ToastContentProps } from 'react-toastify';
import { ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react';
import DialogPopupButton from './DialogPopupButton';

export default function DialogPopup({
  closeToast,
  data,
}: ToastContentProps<string>) {
  return (
    <div className='flex flex-col gap-3'>
      {/* Message Content */}
      <p className='text-sm font-medium text-foreground leading-snug'>{data}</p>

      {/* Actions Container */}
      <div className='flex items-center justify-end gap-2'>
        <DialogPopupButton
          onClick={() => closeToast(true)}
          icon={<ThumbsUpIcon size={18} />}
          color='green'
          aria-label='Confirmar ação e fechar'
          title='Confirmar ação e fechar'
        />
        <DialogPopupButton
          onClick={() => closeToast(false)}
          icon={<ThumbsDownIcon size={18} />}
          color='red'
          aria-label='Cancelar ação e fechar'
          title='Cancelar ação e fechar'
        />
      </div>
    </div>
  );
}
