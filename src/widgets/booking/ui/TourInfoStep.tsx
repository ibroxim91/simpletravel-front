import TourImage from '../../../../public/images/tourImage.png';
import Image from 'next/image';
import React, { useState } from 'react'
import { star, gap_star } from '@/shared/constants/icons'
import TourLocationIcon from "../../../../public/images/tour-location-icon.png"
import { Star } from "lucide-react"
import { options, TransportOptions } from '@/widgets/booking/lib/data'
import { ComfortLevel, TransportType } from '@/widgets/booking/lib/data';

type Props = {
    onNext?: () => void
}

export default function TourInfoStep({ onNext }: Props) {
    const [selected, setSelected] = useState<ComfortLevel>('comfort')
    const [transport, setTransport] = useState<TransportType>('avia')


    return (
        <div>
            <div className='w-full bg-[#FFFFFF] p-[20px] rounded-[20px] relative'>
                <h1 className='text-[20px] font-bold'>Турпакет</h1>
                <hr className='h-[2px] my-[24px] bg-[#EDEEF1]' />

                <div className='flex items-center gap-[20px] my-[20px]'>
                    <div className="relative rounded-2xl overflow-hidden w-[180px] h-[150px] cursor-pointer max-md:w-full">
                        <Image src={TourImage.src} alt="tour" className="object-cover" fill />
                    </div>

                    <div>
                        <div className='flex items-center gap-[4px]'>
                            {
                                [star, star, star, star, gap_star].map((item, index) => {
                                    return <div key={index}>{item}</div>;
                                })
                            }
                        </div>

                        <h1 className='text-[20px] font-bold mt-1 text-[#031753]'>Memories Varadero</h1>
                        <div className='flex items-center gap-[5px] mt-1'>
                            <div className='relative w-[20px] h-[20px] cursor-pointer'>
                                <Image src={TourLocationIcon.src} alt="tour" className="object-cover" fill />
                            </div>
                            <p className='text-[#031753] font-normal'>ОАЭ, Шарджа</p>
                        </div>

                        <ul className='flex items-center gap-[20px] mt-2 list-disc list-inside'>
                            <li className='text-sm text-[#646465]'>Открытый бассейн</li>
                            <li className='text-sm text-[#646465]'>Первая линия пляжа</li>
                            <li className='text-sm text-[#646465]'>Анимация</li>
                        </ul>
                    </div>
                </div>

                <label className='text-sm font-semibold'>
                    Выберите категорию
                </label>

                <div className='mt-[8px] grid grid-cols-3 justify-between gap-[16px]'>
                    {options.map((opt) => {
                        const inputId = `selectComfort-${opt.id}`
                        const isChecked = selected === opt.id
                        return (
                            <div
                                key={opt.id}
                                onClick={() => setSelected(opt.id)}
                                className={`flex w-full justify-between items-center py-[17px] px-[20px] cursor-pointer border-2 rounded-[12px] ${isChecked ? 'border-[#084FE3] bg-[#084FE3]/10' : 'border-[#EDEEF1]/20 bg-[#EDEEF180]/50'}`}
                            >
                                <label htmlFor={inputId} className='flex items-center mr-[70px] gap-[10px] cursor-pointer'>
                                    <Star className={isChecked ? 'text-[#084FE3]' : 'text-[#031753]'} />
                                    <p>{opt.label}</p>
                                </label>
                                <input
                                    type="radio"
                                    id={inputId}
                                    name='selectComfort'
                                    checked={isChecked}
                                    onChange={() => setSelected(opt.id)}
                                    className='cursor-pointer'
                                />
                            </div>
                        )
                    })}
                </div>

                <label className='text-sm font-semibold'>
                    Транспорт
                </label>
                <div className='mt-[8px] grid grid-cols-2 gap-[16px]'>
                    {TransportOptions.map((opt) => {
                        const inputId = `selectTransport-${opt.id}`
                        const isChecked = transport === opt.id
                        const Icon = opt.icon
                        return (
                            <div
                                key={opt.id}
                                onClick={() => setTransport(opt.id)}
                                className={`flex w-full justify-between items-center py-[17px] px-[20px] cursor-pointer border-2 rounded-[12px] ${isChecked ? 'border-[#084FE3] bg-[#084FE3]/10' : 'border-[#EDEEF1]/20 bg-[#EDEEF180]/50'}`}
                            >
                                <label htmlFor={inputId} className='flex items-center mr-[20px] gap-[10px] cursor-pointer'>
                                    <Icon className={isChecked ? 'text-[#084FE3]' : 'text-[#031753]'} />
                                    <p>{opt.label}</p>
                                </label>
                                <input
                                    type="radio"
                                    id={inputId}
                                    name='selectTransport'
                                    checked={isChecked}
                                    onChange={() => setTransport(opt.id)}
                                    className='cursor-pointer'
                                />
                            </div>
                        )
                    })}
                </div>
            </div>
            <button onClick={onNext} className='bg-[#084FE3] text-white p-[12px] w-[200px] left-0 cursor-pointer rounded-full mt-[20px]'>
                Следующий
            </button>
        </div>
    )
}
