import { ArrowDown, ArrowDownIcon, CalendarIcon, DeleteIcon, LocateIcon, Plane, Plus, TrashIcon, UserIcon } from 'lucide-react'
import TestPassport from "../../../../public/images/test-passport.png"
import React from 'react'
import Image from 'next/image'

type Props = {
    onNext?: () => void
}

export default function ParticipantsStep({ onNext }: Props) {
    return (
        <div>
            <div className='bg-[#FFFFFF] p-[20px] rounded-[20px] relative'>
                <div className='flex items-center justify-between'>
                    <h1 className='font-bold text-[20px]'>Участник 1</h1>
                    <div className='flex items-center gap-[10px] w-max justify-between border-2 border-[#EDEEF1] p-[15px] rounded-[12px]'>
                        <input type="text" placeholder='Сохранённые попутчики' className='h-full w-full border-none outline-none' />
                        <ArrowDown />
                    </div>
                </div>

                <hr className='h-[2px] my-[24px] bg-[#EDEEF1]' />

                <div>
                    <label className='text-sm font-semibold'>Пол</label>

                    <div className='flex items-center gap-[10px] my-[10px]'>
                        <input type="radio" id="radioMan" name='gender' className='cursor-pointer text-[#084FE3]' />
                        <label htmlFor="radioMan" className='text-sm font-semibold cursor-pointer'>Man</label>
                        <input type="radio" id="radioWoemn" name='gender' className='cursor-pointer text-[#084FE3]' />
                        <label htmlFor="radioWoemn" className='text-sm font-semibold cursor-pointer'>Women</label>
                    </div>
                </div>

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

                <div className='w-full'>
                    <label className='font-bold text-sm'>Фото/скан пасспорта</label>
                    <div className='bg-[#D3D3D3]/50 mt-[10px] w-full h-[120px] border-dashed border-2 rounded-[12px] flex items-center justify-center flex-col gap-[10px]'>
                        <h1 className='font-bold'>Drop or select file</h1>
                        <p className='text-[12px] text-[#718096]'>Drop files here or click to <label htmlFor="file" className='text-[#084FE3] font-normal cursor-pointer'>browse</label> through your machine.</p>
                    </div>

                    <input type="file" name='file' id='file' className='hidden' />
                </div>

                <div className='w-full flex items-center justify-between my-[20px] p-[10px] border-2 border-[#EDEEF1] rounded-[12px]'>
                    <div className='flex items-center gap-[16px]'>
                        <div className='relative w-[50px] h-[50px] cursor-pointer'>
                            <Image src={TestPassport} alt='test passport' fill className='object-contain' />
                        </div>

                        <div className=''>
                            <h1 className='font-bold text-[16px]'>Creative_uzbeks_file.png</h1>
                            <p className='text-[12px] text-[#718096]'>200 KB</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-[16px]'>
                        <button className='cursor-pointer p-[10px] rounded-full bg-red-500 text-white'>
                            <TrashIcon />
                        </button>
                        <button className='flex items-center gap-[10px] cursor-pointer bg-[#084FE3] text-white px-[20px] py-[10px] rounded-full'>
                            <UserIcon />
                            <p>Посмотреть </p>
                        </button>
                    </div>
                </div>

            </div>
            <div className='flex items-center gap-[16px] mt-[20px]'>
                <button className='flex items-center gap-[10px] bg-[#DFDFDF]/50 px-[50px] py-[12px] rounded-full cursor-pointer'>
                    <Plus />
                    Новый участник
                </button>
                <button onClick={onNext} className='bg-[#084FE3] text-white p-[12px] w-[200px] cursor-pointer rounded-full'>
                    Следующий
                </button>
            </div>
        </div>
    )
}
