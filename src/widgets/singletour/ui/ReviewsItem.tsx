import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Star } from 'lucide-react';

export default function Reviews({
  data,
}: {
  data: {
    user: {
      id: number;
      username: string;
    };
    text: string;
    rating: number;
  };
}) {
  return (
    <div className="bg-[#FFFFFF] rounded-[15.84px] h-[106px] max-[465px]:flex-col p-2 max-lg:h-full flex items-center gap-[10px] shrink-0">
      <div className="aspect-square w-[20%] max-lg:w-[50%] cursor-pointer relative">
        <Avatar className="w-full h-full rounded-lg">
          <AvatarFallback className="w-full h-full rounded-lg">
            {data.user.username.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="bg-white flex absolute bottom-1 left-1/2 -translate-x-1/2 font-semibold z-10 px-3 gap-2 items-center rounded-2xl py-1">
          <Star color="#DAB72A" fill="#DAB72A" width={14} height={14} />
          <p className="text-[14px] text-[#232325]">{data.rating}</p>
        </div>
      </div>
      <div>
        <h1 className="font-bold text-[#232325] text-[18px] max-[465px]:text-center">
          {data.user.username}
        </h1>
        <p className="text-[14px] text-[#232325]">{data.text}</p>
      </div>
    </div>
  );
}
