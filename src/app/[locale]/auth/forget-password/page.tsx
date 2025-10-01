import AuthForgetPassword from '@/features/auth/ui/auth-forget-password';

const ForgetPassword = () => {
  return (
    <div className="h-full">
      <AuthForgetPassword />
      <div className="absolute max-lg:bottom-20 lg:bottom-5 w-full flex justify-center">
        <p>2025 © Все права защищены.</p>
      </div>
    </div>
  );
};

export default ForgetPassword;
