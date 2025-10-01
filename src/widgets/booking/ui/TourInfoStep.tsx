import TourImage from '@/assets/Paris.jpg';
import { Input } from '@/shared/ui/input';
import { options, TransportOptions } from '@/widgets/booking/lib/data';
import StarIcon from '@mui/icons-material/Star';
import WhereToVoteIcon from '@mui/icons-material/WhereToVote';
import Rating from '@mui/material/Rating';
import clsx from 'clsx';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import formStore from '../lib/hook';

type Props = {
  onNext: () => void;
  onPrev: () => void;
};

export default function TourInfoStep({ onNext, onPrev }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [transport, setTransport] = useState<number | null>(null);
  const {
    additional,
    setAdditional,
    transport: storeTranpsort,
    setTransport: setStoreTransport,
  } = formStore();

  useEffect(() => {
    if (additional) {
      setSelected(additional);
    }
    if (storeTranpsort) {
      setTransport(storeTranpsort);
    }
  }, [additional, storeTranpsort]);

  return (
    <div>
      <div className="w-full bg-[#FFFFFF] p-[20px] rounded-[20px] relative">
        <h1 className="text-[20px] font-bold">Турпакет</h1>
        <hr className="h-[2px] my-[24px] bg-[#EDEEF1]" />

        <div className="flex items-center gap-[20px] my-[20px] max-lg:flex-col max-lg:items-start">
          <div className="relative rounded-2xl aspect-square w-48 cursor-pointer max-lg:w-full">
            <Image
              src={TourImage.src}
              alt="tour"
              className="object-cover rounded-2xl"
              fill
              quality={100}
            />
          </div>

          <div>
            <div className="flex items-center gap-4 max-lg:items-start">
              <Rating
                name="read-only"
                size="medium"
                value={4}
                readOnly
                sx={{ color: '#F08125' }}
              />
            </div>

            <h1 className="text-2xl font-semibold mt-1 text-[#031753]">
              Memories Varadero
            </h1>
            <div className="flex items-center gap-1 mt-1">
              <WhereToVoteIcon
                sx={{ width: '24px', height: '24px', color: '#084FE3' }}
              />
              <p className="text-[#031753] font-normal">ОАЭ, Шарджа</p>
            </div>

            <ul className="flex items-center gap-[20px] mt-2 list-disc list-inside max-lg:flex-col max-lg:items-start">
              <li className="text-md text-[#646465]">Открытый бассейн</li>
              <li className="text-md text-[#646465]">Первая линия пляжа</li>
              <li className="text-md text-[#646465]">Анимация</li>
            </ul>
          </div>
        </div>

        <label className="text-xl font-semibold">Выберите категорию</label>

        <div className="mt-[8px] grid grid-cols-2 justify-between gap-[16px] max-md:grid-cols-1">
          {options.map((opt) => {
            const inputId = `selectComfort-${opt.id}`;
            const isChecked = selected === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => setSelected(opt.id)}
                className={`flex w-full justify-between items-center py-[17px] px-[20px] cursor-pointer border rounded-xl bg-[#EDEEF180] border-[#EDEEF1]`}
              >
                <label
                  htmlFor={inputId}
                  className="flex items-center mr-[70px] gap-[10px] cursor-pointer"
                >
                  <StarIcon
                    sx={{
                      color: isChecked ? '#084FE3' : '#212122',
                      width: '30px',
                      height: '30px',
                    }}
                  />
                  <p
                    className={clsx(
                      isChecked ? 'text-[#084FE3]' : 'text-[#212122]',
                    )}
                  >
                    {opt.label}
                  </p>
                </label>
                <Input
                  type="radio"
                  id={inputId}
                  name="selectComfort"
                  checked={isChecked}
                  onChange={() => setSelected(opt.id)}
                  className="w-6 h-6 accent-[#084FE3]"
                />
              </div>
            );
          })}
        </div>

        <p className="text-xl font-semibold mt-5">Транспорт</p>
        <div className="mt-[8px] grid grid-cols-2 justify-between gap-[16px] max-md:grid-cols-1">
          {TransportOptions.map((opt) => {
            const inputId = `selectTransport-${opt.id}`;
            const isChecked = transport === opt.id;
            const Icon = opt.icon;
            return (
              <div
                key={opt.id}
                onClick={() => setTransport(opt.id)}
                className={`flex w-full justify-between items-center py-[17px] px-[20px] cursor-pointer border rounded-xl bg-[#EDEEF180] border-[#EDEEF1]`}
              >
                <label
                  htmlFor={inputId}
                  className="flex items-center mr-[20px] gap-[10px] cursor-pointer"
                >
                  <Icon
                    sx={{
                      color: isChecked ? '#084FE3' : '#212122',
                      width: '30px',
                      height: '30px',
                    }}
                  />
                  <p
                    className={clsx(
                      isChecked ? 'text-[#084FE3]' : 'text-[#212122]',
                    )}
                  >
                    {opt.label}
                  </p>
                </label>
                <Input
                  type="radio"
                  id={inputId}
                  name="selectTransport"
                  checked={isChecked}
                  onChange={() => setTransport(opt.id)}
                  className="w-6 h-6 accent-[#084FE3]"
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex justify-between max-lg:flex-col">
        <button
          onClick={onPrev}
          className="bg-gray-200 border shadow-sm border-[#D3D3D3] text-gray-800 hover:bg-gray-300 py-4 font-medium px-20 left-0 cursor-pointer rounded-full mt-[20px]"
        >
          Назад
        </button>
        <button
          onClick={() => {
            onNext();
            setAdditional(selected);
            setStoreTransport(transport);
          }}
          className="bg-[#084FE3] text-white py-4 font-medium px-20 left-0 cursor-pointer rounded-full mt-[20px]"
        >
          Следующий
        </button>
      </div>
    </div>
  );
}
