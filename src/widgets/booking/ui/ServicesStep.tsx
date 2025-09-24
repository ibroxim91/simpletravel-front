import React, { useState } from 'react'
import { ExcursionsOptions, ExcursionsType, ServicesOptions, ServicesType } from '@/widgets/booking/lib/data'
import Switch from '@mui/material/Switch';

type Props = {
    onNext?: () => void
}

export default function ServicesStep({ onNext }: Props) {
    const [selected, setSelected] = useState<ExcursionsType | null>(null)
    const [service, setService] = useState<ServicesType | null>(null)


    return (
        <div>
            <div className='w-full bg-[#FFFFFF] p-[20px] rounded-[20px] relative'>
            <h1 className='text-[20px] font-bold'>Услуги</h1>
            <hr className='h-[2px] my-[24px] bg-[#EDEEF1]' />

            <label className='text-sm font-semibold'>
                Экскурсии
            </label>

            <div className='mt-[8px] grid grid-cols-2 justify-between gap-[16px] my-5'>
                {ExcursionsOptions.map((opt) => {
                    const inputId = `selectComfort-${opt.id}`
                    const isChecked = selected === opt.id
                    return (
                        <div
                            key={opt.id}
                            onClick={() => setSelected(opt.id)}
                            className={`flex w-full justify-between items-center py-[17px] px-[20px] cursor-pointer border-2 rounded-[12px] ${isChecked ? 'border-[#084FE3] bg-[#084FE3]/10' : 'border-[#EDEEF1]/20 bg-[#EDEEF180]/50'}`}
                        >
                            <p className="font-bold">{opt.label}</p>
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
                Дополнительные услуги
            </label>
            <div className='mt-[8px] grid grid-cols-2 gap-[16px]'>
                {ServicesOptions.map((opt) => {
                    const isChecked = service === opt.id
                    return (
                        <div
                            key={opt.id}
                            onClick={() => setService(isChecked ? null : opt.id)}
                            className={`flex w-full justify-between items-center py-[17px] px-[20px] cursor-pointer border-2 rounded-[12px] ${isChecked ? 'border-[#084FE3] bg-[#084FE3]/10' : 'border-[#EDEEF1]/20 bg-[#EDEEF180]/50'}`}
                        >
                            <p className="font-bold">{opt.label}</p>
                            <Switch
                                checked={isChecked}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setService(isChecked ? null : opt.id)
                                }}
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
