import React from 'react';
import { useForm } from 'react-hook-form';

const RegisterPage = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  return <div>RegisterPage</div>;
};

export default RegisterPage;
