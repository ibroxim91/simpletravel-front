import AuthEditPassword from '@/features/auth/ui/auth-edit-password';

const EditPassword = () => {
  return (
    <div className="h-full">
      <AuthEditPassword />
      <div className="absolute max-lg:bottom-20 lg:bottom-5 w-full flex justify-center">
        <p>2025 © Все права защищены.</p>
      </div>
    </div>
  );
};

export default EditPassword;
