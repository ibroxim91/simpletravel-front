import { Facebook, Instagram, Linkedin, LocateIcon, PhoneIcon, XIcon } from 'lucide-react'
import React from 'react'

export default function Contacts() {
    const MAP_EMBED_SRC = 'https://maps.google.com/maps?q=Simple%20Travel%20Company&t=&z=13&ie=UTF8&iwloc=&output=embed'
    
    return (
        <div className='custom-container'>
            <div className='flex items-center gap-5 py-5'>
                <h1 className='text-[#646465] text-sm cursor-pointer'>Главная страница</h1>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.9107 12.7441C11.5853 13.0695 11.5853 13.5972 11.9107 13.9226C12.2362 14.248 12.7638 14.248 13.0893 13.9226L16.4226 10.5893C16.748 10.2638 16.748 9.73619 16.4226 9.41075L13.0893 6.07742C12.7638 5.75198 12.2362 5.75198 11.9107 6.07742C11.5853 6.40286 11.5853 6.9305 11.9107 7.25593L13.8215 9.16668H4.16658C3.70635 9.16668 3.33325 9.53977 3.33325 10C3.33325 10.4602 3.70635 10.8333 4.16658 10.8333H13.8215L11.9107 12.7441Z" fill="#646465" />
                </svg>
                <h1 className='text-[#646465] text-sm cursor-pointer'>Контакты</h1>
            </div>

            <h1 className='font-bold text-[#031753] text-[32px] my-5'>Контакты</h1>

            <div className='grid grid-cols-2 gap-6 justify-between'>
                <div className='h-full'>
                    <div className='p-[20px] bg-[#ffffff] rounded-[16px]'>
                        <h2 className='font-semibold text-[#031753] text-xl mb-4'>Ответим на все вопросы</h2>
                        <div className='mb-4'>
                            <label className='block text-sm text-[#646465] mb-1'>Имя</label>
                            <input
                                type="text"
                                placeholder='Введите Имя'
                                className='w-full p-3 border border-[#EDEEF1] rounded-[10px] focus:outline-none focus:border-[#084FE3]'
                            />
                        </div>
                        <div className='mb-4'>
                            <label className='block text-sm text-[#646465] mb-1'>Номер телефона</label>
                            <input
                                type="text"
                                placeholder='Введите ваш номер телефона'
                                className='w-full p-3 border border-[#EDEEF1] rounded-[10px] focus:outline-none focus:border-[#084FE3]'
                            />
                        </div>
                        <div className='mt-2 flex items-center gap-5'>
                            <button className='bg-[#084FE3] cursor-pointer text-white px-5 py-3 rounded-[12px] hover:bg-[#073ec0] transition'>Отправить</button>
                            <p className='text-[16px] text-[#646465] mt-2 w-[300px] cursor-pointer'>Я даю согласие на обработку персональных данных</p>
                        </div>
                    </div>

                    <div className='bg-[#084FE3] p-[20px] rounded-[16px] text-white mt-[15px]'>
                        <h1 className='font-bold text-[32px] my-5'>Контакты</h1>

                        <div className='flex items-center justify-between my-5'>
                            <div className='flex items-center gap-2'>
                                <LocateIcon />
                                Адрес:
                            </div>

                            <p>Алмазарский р-н, Камарнисо, 13</p>
                        </div>

                        <div className='flex items-center justify-between my-5'>
                            <div className='flex items-center gap-2'>
                                <PhoneIcon />
                                Телефон:
                            </div>
                            <p>5990</p>
                        </div>

                        <div className='flex items-center gap-5 my-5'>
                            <div className='p-[10px] rounded-full border-2 cursor-pointer border-[#FFFFFF29]'>
                                <Linkedin />
                            </div>
                            <div className='p-[10px] rounded-full border-2 cursor-pointer border-[#FFFFFF29]'>
                                <Facebook />
                            </div>
                            <div className='p-[10px] rounded-full border-2 cursor-pointer border-[#FFFFFF29]'>
                                <Instagram />
                            </div>
                            <div className='p-[10px] rounded-full border-2 cursor-pointer border-[#FFFFFF29]'>
                                <XIcon />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='p-[10px] bg-[#ffffff] rounded-[16px]'>
                    <div className='w-full h-[668px] rounded-[12px] overflow-hidden shadow-sm'>
                        <iframe
                            title='Company location map'
                            src={MAP_EMBED_SRC}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
