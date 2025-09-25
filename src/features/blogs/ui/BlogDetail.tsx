import News1 from '@/assets/news_1.jpg';
import News2 from '@/assets/news_2.jpg';
import News3 from '@/assets/news_3.jpg';
import NewsDetail_2 from '@/assets/NewsDetail_1.png';
import NewsDetail_1 from '@/assets/NewsDetail_2.png';
import { Link } from '@/shared/config/i18n/navigation';
import { Badge } from '@/shared/ui/badge';
import { Carousel, CarouselContent, CarouselItem } from '@/shared/ui/carousel';
import EastIcon from '@mui/icons-material/East';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { motion } from 'framer-motion';
import { Calendar1, PinIcon } from 'lucide-react';
import Image from 'next/image';

const data = [
  {
    name: 'Международный конгресс туроператоров: заключительный день в...',
    desc: 'Государственное регулирование туристского рынка и создание условий...',
    date: '18.09.2023',
    img: News1,
    id: 1,
  },
  {
    name: 'Международный конгресс туроператоров: заключительный день в...',
    price: 'от 12 450 000 сум',
    desc: 'Государственное регулирование туристского рынка и создание условий...',
    date: '18.09.2023',
    img: News2,
    id: 2,
  },
  {
    name: 'Международный конгресс туроператоров: заключительный день в...',
    desc: 'Государственное регулирование туристского рынка и создание условий...',
    date: '18.09.2023',
    img: News3,
    id: 3,
  },
];

const BlogDetail = () => {
  return (
    <div className="custom-container mt-5">
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<EastIcon fontSize="small" className="text-[#646465]" />}
        sx={{ '& .MuiBreadcrumbs-separator': { mx: 2 } }}
      >
        <Link href="/" className="font-medium text-[#646465]">
          Главная страница
        </Link>
        <Link href="/blogs?tab=1" className="text-[#646465] font-medium">
          Блоги
        </Link>
        <p className="text-[#646465] font-medium">Cтраница подробностей</p>
      </Breadcrumbs>
      <div className="custom-container mt-10 max-w-5xl">
        <motion.p
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.1 }}
          exit={{ transition: { duration: 0.1 } }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-semibold text-2xl"
        >
          «Северсталь» поделилась опытом корпоративного волонтерства на
          региональном образовательном форуме
        </motion.p>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.1 }}
          exit={{ transition: { duration: 0.1 } }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Image
            src={NewsDetail_1}
            alt="image_1"
            quality={100}
            width={744}
            height={460}
            className="w-full mt-5 rounded-3xl"
          />
          <div className="mt-4 gap-10 flex items-center max-lg:flex-col max-lg:items-start max-lg:gap-2">
            <div className="flex items-center gap-2 text-[#212122] max-md:text-[12px]">
              <Calendar1
                width={24}
                height={24}
                color="#084FE3"
                strokeWidth={2}
              />
              <p>18.09.2023</p>
            </div>
            <div className="flex items-center gap-2 text-[#212122] max-md:text-[12px]">
              <PinIcon
                className="rotate-45"
                width={24}
                height={24}
                fill="#084FE3"
                color="#084FE3"
              />
              <p className="max-lg:hidden">Темы:</p>
              <p>#Акции</p>
              <p>#Люди</p>
              <p>#Социальная ответственность</p>
            </div>
          </div>
        </motion.div>
        <div className="mt-10 max-md:mt-5">
          <motion.p
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            exit={{ transition: { duration: 0.1 } }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[#212122] text-lg"
          >
            «Северсталь» стала организатором образовательной площадки
            «Корпоративное волонтерство» регионального форума волонтеров «Точка
            роста». Эксперты компании поделились лучшими наработками из своей
            практики. Участниками трёхдневного форума стали более 150 активных
            волонтеров из 23 субъектов Вологодской области. Это те люди, которые
            планируют развивать добровольчество в муниципальных округах региона.
            Образовательная программа мероприятия включала несколько площадок:
            культурное, социальное, медиа, экологическое волонтерство и другие.
            В рамках работы направления «корпоративное волонтерство» эксперты
            «Северстали» поделились историей развития волонтерского движения в
            своей компании, представили успешно реализованные проекты
            «Северстали» и «Свезы», а также провели тренинг «Волонтерская акция:
            от идеи до реализации». Полученные знания участники применили уже на
            форуме – команды активистов разработали проекты волонтерских акций,
            которые планируют реализовать в своих районах.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            exit={{ transition: { duration: 0.1 } }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Image
              src={NewsDetail_2}
              alt="image_2"
              quality={100}
              width={744}
              height={460}
              className="w-full mt-5 rounded-3xl"
            />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            exit={{ transition: { duration: 0.1 } }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[#212122] text-lg mt-5"
          >
            «Для «Северстали» важно, чтобы каждый сотрудник имел возможность
            проявить себя не только на рабочем месте, но и вне его. Мы идем
            навстречу людям, их запросу на участие в волонтерских акциях. Потому
            что неравнодушные и активные люди, как правило, так же активны и при
            выполнении трудовых операций. Нам такие сотрудники очень нужны. Их
            рвение точно нужно поощрять, – комментирует начальник управления по
            социальной политике и нематериальной мотивации «Северстали»
            Екатерина Сыроватская. – В 2022 году компания «Северсталь» вступила
            в Национальный Совет по корпоративному волонтерству (НСКВ) и
            возглавила региональное представительство НСКВ в Вологодской
            области. Тем самым мы взяли на себя ответственную миссию – не только
            развивать корпоративное волонтерство в своей компании, но и помогать
            продвигать эту повестку другим компаниям региона. Такую важную
            работу мы реализуем силами наших внутренних экспертов и при
            поддержке управления по молодежной политике Правительства области».
            Справка: Волонтерское движение «Северстали» насчитывает более 1100
            сотрудников из 10 городов присутствия компании. Ежегодно активисты
            реализуют более 100 волонтерских акций корпоративного, городского,
            регионального и федерального масштаба. Например, в мае этого года в
            компании проходила волонтерская акция «Чистая промвесна». В общей
            сложности к ней присоединилось более 1800 корпоративных волонтеров
            из 10 городов России. Вместе активисты воплотили в жизнь более 40
            добрых дел: чистили берега, высаживали деревья, проводили
            субботники.
          </motion.p>
        </div>
      </div>
      <div className="custom-container mt-10 font-medium">
        <div className="flex justify-between items-center">
          <p className="text-3xl text-[#031753] font-semibold">Новости</p>
          <Link
            href={'/blogs'}
            className="cursor-pointer font-semibold text-blue-600 max-lg:hidden"
          >
            Больше новостей
          </Link>
        </div>

        <Carousel className="w-full mt-4">
          <CarouselContent>
            {data.map((e, idx) => (
              <CarouselItem className="flex flex-col w-auto basis-1/3 max-lg:basis-1/2 max-md:basis-[80%] shrink-0">
                <div className="bg-white rounded-3xl">
                  <Link key={idx} href={`/blogs/${e.id}`} className="w-full">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, amount: 0.05 }}
                      transition={{ duration: 0.6, delay: idx * 0.15 }}
                      className="w-full aspect-square h-[250px] relative group overflow-hidden rounded-3xl shadow-lg"
                    >
                      <Image
                        src={e.img}
                        alt={e.name}
                        fill
                        className="rounded-3xl object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="flex flex-col absolute bottom-2 left-2 z-20">
                        <Badge
                          variant="default"
                          className="bg-[#031753] px-4 py-1 rounded-4xl text-sm font-semibold"
                        >
                          {e.date}
                        </Badge>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, amount: 0.05 }}
                      transition={{ duration: 0.6, delay: idx * 0.2 }}
                      className="mt-2 flex flex-col gap-2 px-4"
                    >
                      <p className="text-xl font-semibold text-[#031753] w-full">
                        {e.name.length > 50
                          ? e.name.slice(0, 50) + '...'
                          : e.name}
                      </p>
                      <p className="text-md text-[#646465]">{e.desc}</p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, amount: 0.05 }}
                      transition={{ duration: 0.5, delay: idx * 0.25 }}
                      className="flex px-8 mb-5"
                    >
                      <Link
                        href={`/blogs/${e.id}`}
                        className="bg-[#ECF2FF] font-semibold mt-4 w-full py-3 rounded-4xl text-center text-blue-600 hover:bg-blue-100 transition-colors"
                      >
                        Узнать больше
                      </Link>
                    </motion.div>
                  </Link>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

export default BlogDetail;
