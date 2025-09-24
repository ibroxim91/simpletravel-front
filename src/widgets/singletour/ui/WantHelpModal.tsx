import { useState } from "react";
import HelpSent from "./HelpSent";

interface Props {
    onClose: () => void;
}

type TSteps = 'form' | 'help_sent'

export default function WantHelpModal({ onClose }: Props) {
    const [steps, setSteps] = useState<TSteps>('form')
    return (
        <div onClick={() => {
            onClose()
        }} className="fixed top-0 left-0 right-0 bottom-0 bg-black/90 flex items-center justify-center h-screen w-screen z-50">
            {steps === 'form' ? ( 
                <div onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()} className="bg-[#fff] p-[30px] rounded-[20px]">
                <div className="flex items-center justify-between">
                    <h1 className="text-[24px] font-semibold">Нужна помощь?</h1>
                    <div className="border border-[#DFDFDF] p-[10px] rounded-full cursor-pointer" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="#121212" />
                        </svg>
                    </div>
                </div>

                <form className="grid grid-cols-1 gap-4">
                    <label className="font-bold text-[16px] mt-[10px]">Имя</label>
                    <input className="border border-[#DFDFDF] p-[10px] rounded-[10px]" type="text" placeholder="Введите имя" />

                    <label className="font-bold text-[16px]">Телефон</label>
                    <input className="border border-[#DFDFDF] p-[10px] rounded-[10px]" type="text" placeholder="Введите телефон" />


                    <div className="flex items-center gap-[16px]">
                        <button type="submit" className="py-[17px] px-[50px] font-bold cursor-pointer rounded-full bg-[#1764FC] text-white" onClick={() => {
                            setSteps('help_sent')
                        }}>Отправить</button>
                        <p className="w-[218px] text-sm text-[#646465]">Я даю согласие на обработку персональных данных</p>
                    </div>
                </form>
            </div>
            ): (
                <HelpSent onClose={onClose} />
            )}
        </div>
    )
}