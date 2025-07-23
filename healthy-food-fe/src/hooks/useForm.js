import { useState } from 'react';

export const useForm = (initialState = {}) => {
  const [formData, setFormData] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };
  
  const updateForm = (newData) => {
    setFormData(prev => ({
      ...prev,
      ...newData
    }));
  };
  
  const resetForm = () => {
    setFormData(initialState);
    setErrors({});
    setIsSubmitting(false);
  };
  
  const setFieldError = (field, message) => {
    setErrors(prev => ({
      ...prev,
      [field]: message
    }));
  };
  
  const clearErrors = () => setErrors({});
  
  const withSubmitting = async (asyncFunction) => {
    try {
      setIsSubmitting(true);
      return await asyncFunction();
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    formData,
    setFormData,
    updateField,
    updateForm,
    resetForm,
    isSubmitting,
    setIsSubmitting,
    withSubmitting,
    errors,
    setErrors,
    setFieldError,
    clearErrors
  };
}; 