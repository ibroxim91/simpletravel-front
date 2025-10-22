import MyFavourite from '@/features/saved/ui/MyFavourite';
const SavedClient = () => {
  return (
    <>
      <div className="flex flex-col gap-10 mb-10 overflow-hidden">
        <MyFavourite />
      </div>
    </>
  );
};

export default SavedClient;
