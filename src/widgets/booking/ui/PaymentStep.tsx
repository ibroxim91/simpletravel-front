import React, { useState } from 'react'
import UzumPayment from "../../../../public/images/uzum-payment.png"
import PaymePayment from "../../../../public/images/payme-payment.png"
import { FileText } from 'lucide-react';

import Image from 'next/image'
import PaidModal from './PaidModal';

type Props = {
    onNext?: () => void
}

export default function PaymentStep({ onNext }: Props) {
    const [isPaid, setIsPaid] = useState<boolean>(false)
    return (
        <div className='w-full'>
            <div className='w-full bg-[#FFFFFF] p-[20px] rounded-[20px] relative'>
                <h1>Оплата</h1>
                <hr className='h-[2px] my-[24px] bg-[#EDEEF1] ' />
                <div className='flex my-5 justify-between flex-col items-start gap-2 bg-[#EDEEF180] p-[20px] rounded-[20px] border-2 border-[#EDEEF180]'>
                    <h1 className='text-[20px] font-bold'>+22 450 000 сум</h1>
                    <p className='text-[16px] font-normal'>Общая сумма</p>
                </div>

                <label className='text-sm font-semibold'>Способ оплаты</label>
                <div className='grid grid-cols-2 gap-[20px] my-5'>
                    <label htmlFor="payment-payme" className='cursor-pointer flex items-center gap-[10px] justify-between bg-[#EDEEF180] p-[20px] rounded-[20px] border-2 border-[#EDEEF180]'>
                        <div className='flex items-center gap-[20px]'>
                            <div className='w-[40px] h-[40px] relative rounded-[10px] overflow-hidden'>
                                <Image src={UzumPayment.src} alt="uzum-payment" className="object-cover" fill />
                            </div>
                            <h1>Uzum bank</h1>
                        </div>
                        <input type="radio" id="payment-payme" name='payment' className='w-[20px] h-[20px] border-2 border-[#EDEEF180] cursor-pointer' />
                    </label>

                    <label htmlFor="payment-uzum" className='cursor-pointer flex items-center gap-[10px] justify-between bg-[#EDEEF180] p-[20px] rounded-[20px] border-2 border-[#EDEEF180]'>
                        <div className='flex items-center gap-[20px]'>
                            <div className='w-[40px] h-[40px] relative rounded-[10px] overflow-hidden'>
                                <Image src={PaymePayment.src} alt="payme-payment" className="object-cover" fill />
                            </div>
                            <h1>Payme</h1>
                        </div>
                        <input type="radio" id="payment-uzum" name='payment' className='w-[20px] h-[20px] border-2 border-[#EDEEF180] cursor-pointer' />
                    </label>
                </div>
            </div>

            <button onClick={() => setIsPaid(true)} className='bg-[#084FE3] text-white p-[12px] w-[200px] left-0 cursor-pointer rounded-full mt-5'>
                Перейти к оплате
            </button>

            <div className='w-full bg-[#FFFFFF] p-[20px] rounded-[20px] mt-5'>
                <div className='flex items-center justify-between'>
                    <h1 className='text-[20px] font-bold'>Детали оплаты</h1>
                    <button className='flex items-center gap-[10px] cursor-pointer px-[15px] py-[10px] border-2 rounded-full border-[#EDEEF180]'>
                        <FileText />
                        <p>Скачать PDF</p>
                    </button>
                </div>

                <h1 className='my-[10px] font-bold'>Дата</h1>
                <div className='flex items-center justify-between w-full my-2 bg-[#EDEEF1] px-[8px] py-[5px] rounded-[8px] text-[#646465]'>
                    <p>Откуда</p>
                    <p className='!text-black'>Ташкент</p>
                </div>

                <div className='flex items-center justify-between w-full my-2 px-[8px] py-[5px] rounded-[8px] text-[#646465]'>
                    <p>Куда</p>
                    <p className='!text-black'>Ташкент</p>
                </div>

                <div className='flex items-center justify-between w-full my-2 bg-[#EDEEF1] px-[8px] py-[5px] rounded-[8px] text-[#646465]'>
                    <p>Откуда</p>
                    <p className='!text-black'>Ташкент</p>
                </div>

                <div className='flex items-center justify-between w-full my-2 px-[8px] py-[5px] rounded-[8px] text-[#646465]'>
                    <p>Куда</p>
                    <p className='!text-black'>Ташкент</p>
                </div>

                <h1 className='my-[10px] font-bold'>Дата</h1>
                <div className='flex items-center justify-between w-full my-2 bg-[#EDEEF1] px-[8px] py-[5px] rounded-[8px] text-[#646465]'>
                    <p>Откуда</p>
                    <p className='!text-black'>Ташкент</p>
                </div>
            </div>

            {
                isPaid && <PaidModal onClose={() => setIsPaid(false)} />
            }
        </div>
    )
}
