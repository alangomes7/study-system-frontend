import { useState, useEffect } from 'react';

export const useNavState = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isOpen,
    setIsOpen,
    isCreateOpen,
    setIsCreateOpen,
    isManageOpen,
    setIsManageOpen,
    isSubscribeOpen,
    setIsSubscribeOpen,
    isClosing,
    setIsClosing,
    mounted,
    isMobile,
  };
};
