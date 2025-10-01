interface Props {
  onClose: () => void;
}

export default function HelpSent({ onClose }: Props) {
  return (
    <div className="grid grid-cols-1 gap-[16px] bg-white p-[30px] rounded-[20px] text-center">
      ✅<h1 className="text-[24px] font-semibold">Заявка успешно отправлено</h1>
      <p className="text-sm text-[#646465] w-[400px]">
        Эксперт свяжется с вами в ближайшее время по номеру +998 93 222 29 22,
        позвонив на него
      </p>
      <button
        type="submit"
        className="py-[17px] px-[50px] font-bold cursor-pointer rounded-full bg-[#1764FC] text-white"
        onClick={onClose}
      >
        Отправить
      </button>
    </div>
  );
}
