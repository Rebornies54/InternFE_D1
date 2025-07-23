import { useState, useCallback } from 'react';

export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [modalData, setModalData] = useState(null);
  
  const openModal = useCallback((data = null) => {
    setIsOpen(true);
    setModalData(data);
  }, []);
  
  const closeModal = useCallback(() => {
    setIsOpen(false);
    setModalData(null);
  }, []);
  
  const toggleModal = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);
  
  return {
    isOpen,
    setIsOpen,
    modalData,
    setModalData,
    openModal,
    closeModal,
    toggleModal
  };
}; 