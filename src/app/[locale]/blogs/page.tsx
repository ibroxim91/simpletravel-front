import BlogHeader from '@/features/blogs/ui/Headers';
import News from '@/features/blogs/ui/News';

const Blogs = () => {
  return (
    <div className="flex flex-col gap-10 mb-10 overflow-hidden">
      <BlogHeader />
      <News />
    </div>
  );
};

export default Blogs;
