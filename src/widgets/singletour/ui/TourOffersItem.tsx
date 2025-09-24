import TourInfoItem from "../../../../public/images/tourItem1.png"
import Image from "next/image";

export default function TourOffersItem() {
    return (
        <div className="w-[264px] h-[360px] relative cursor-pointer rounded-2xl flex-shrink-0">
            <Image src={TourInfoItem.src} alt="tour offers" fill className="object-cover rounded-2xl" />

            <div className="absolute bottom-[10px] left-[10px] text-white hidden">
                <h1 className="font-bold text-[28px]">Турция</h1>
                <p className="font-semibold text-sm mt-[5px]">От $700 / 2 чел</p>
            </div>
        </div>
    )
}