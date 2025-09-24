import { CalendarIcon, UserIcon, BriefcaseBusiness, Settings, CreditCard, Calendar, TicketsPlane, CarTaxiFront } from 'lucide-react'

export type TStep = {
    id: StepId,
    name: string,
    icon: typeof CalendarIcon | typeof UserIcon | typeof BriefcaseBusiness | typeof Settings | typeof CreditCard
}

export type StepId = 'time' | 'participants' | 'package' | 'services' | 'payment'

const steps: TStep[] = [
    {
        id: 'time',
        name: "Дата",
        icon: CalendarIcon
    },
    {
        id: 'participants',
        name: "Участники",
        icon: UserIcon
    },
    {
        id: 'package',
        name: "Турпакет",
        icon: BriefcaseBusiness
    },
    {
        id: 'services',
        name: "Услуги",
        icon: Settings
    },
    {
        id: 'payment',
        name: "Оплата",
        icon: CreditCard
    }
]


export type ComfortLevel = 'comfort' | 'standard' | 'premium'
export type TransportType = "avia" | "transfer"
export type ExcursionsType = "50$" | "30$" | "40$"
export type ServicesType = "Insurance" | "Visa-support"

const options: { id: ComfortLevel, label: string }[] = [
    { id: 'comfort', label: 'Комфорт' },
    { id: 'standard', label: 'Стандарт' },
    { id: 'premium', label: 'Премиум' },
]

const TransportOptions: { id: TransportType, label: string, icon: typeof Calendar }[] = [
    { id: 'avia', label: 'Авиа-билет', icon: TicketsPlane },
    { id: 'transfer', label: 'Трансфер', icon: CarTaxiFront },
]



const ExcursionsOptions: { id: ExcursionsType, label: string }[] = [
    { id: '50$', label: 'Городская экскурсия (+50$)' },
    { id: '30$', label: 'Поездка на пляж (+30$)' },
    { id: '40$', label: 'Ночной тур (+40$)' },
]

const ServicesOptions: { id: ServicesType, label: string }[] = [
    { id: "Insurance", label: "Страховка" },
    { id: "Visa-support", label: "Визовая поддержка" }
]


export {
    steps,
    options,
    TransportOptions,
    ExcursionsOptions,
    ServicesOptions
}