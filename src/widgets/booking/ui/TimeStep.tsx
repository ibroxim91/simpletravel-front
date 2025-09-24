import React from 'react'
import { CalendarIcon, LocateIcon, Plane } from 'lucide-react'

type Props = {
    onNext?: () => void
}

export default function TimeStep({ onNext }: Props) {
    return (
        <div>
            <div className='bg-[#FFFFFF] p-[20px] rounded-[20px] relative'>
                <h1 className='font-bold text-[20px]'>Дата</h1>
                <hr className='h-[2px] my-[24px] bg-[#EDEEF1]' />

                <form className='grid grid-cols-2 gap-[16px]'>
                    <div>
                        <label className='text-sm font-semibold'>Откуда</label>
                        <div className='flex items-center gap-[16px] mt-[10px] w-full border-2 border-[#EDEEF1] justify-between p-[15px] rounded-[12px]'>
                            <input type="text" placeholder='Ташкент' className='w-full border-none outline-none h-full' />
                            <LocateIcon />
                        </div>
                    </div>

                    <div>
                        <label className='text-sm font-semibold'>Куда</label>
                        <div className='flex items-center gap-[16px] mt-[10px] w-full border-2 border-[#EDEEF1] justify-between p-[15px] rounded-[12px]'>
                            <input type="text" placeholder='Ташкент' className='w-full border-none outline-none h-full' />
                            <Plane />
                        </div>
                    </div>

                    <div>
                        <label className='text-sm font-semibold'>Дата отправления</label>
                        <div className='flex items-center gap-[16px] mt-[10px] w-full border-2 border-[#EDEEF1] justify-between p-[15px] rounded-[12px]'>
                            <input type="text" placeholder='Ташкент' className='w-full border-none outline-none h-full' />
                            <CalendarIcon />
                        </div>
                    </div>

                    <div>
                        <label className='text-sm font-semibold'>Время возвращения</label>
                        <div className='flex items-center gap-[16px] mt-[10px] w-full border-2 border-[#EDEEF1] justify-between p-[15px] rounded-[12px]'>
                            <input type="text" placeholder='Ташкент' className='w-full border-none outline-none h-full' />
                            <CalendarIcon />
                        </div>
                    </div>
                </form>


            </div>
            <button onClick={onNext} className='bg-[#084FE3] text-white p-[12px] w-[200px] left-0 cursor-pointer rounded-full mt-[20px]'>
                Следующий
            </button>
        </div>
    )
}
