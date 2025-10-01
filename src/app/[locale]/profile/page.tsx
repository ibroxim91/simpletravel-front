import ProfileTabs from '@/features/profile/ui/ProfileTabs';
import Welcome from '@/features/profile/ui/welcome';

const Profile = () => {
  return (
    <div className="flex flex-col gap-10 mb-10 overflow-hidden">
      <Welcome />
      <ProfileTabs />
    </div>
  );
};

export default Profile;
