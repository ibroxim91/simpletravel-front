'use client';

import BannerCircle from '@/assets/divCircle.png';
import Kuba from '@/assets/Kuba.jpg';
import OAE from '@/assets/OAE.jpg';
import Shore from '@/assets/shore.png';
import ShoreCrop from '@/assets/ShoreCrop.png';
import ShriLanka from '@/assets/ShriLanka.jpg';
import Tailand from '@/assets/Tailand.jpg';
import Turk from '@/assets/Turk.jpg';
import { Link } from '@/shared/config/i18n/navigation';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { motion } from 'framer-motion';
import Image from 'next/image';

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.2, ease: 'easeOut' as const },
  }),
};

const Populardestinations = () => {
  return (
    <div className="custom-container mt-10 max-lg:hidden">
      <div className="flex justify-between items-center">
        <p className="text-2xl font-semibold">Популярные направления</p>
        <Link href={'#'} className="cursor-pointer text-blue-600 font-semibold">
          Больше акций
        </Link>
      </div>
      <motion.div
        className="flex mt-4 gap-5 h-[700px] font-medium"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
      >
        <motion.div
          variants={fadeUp}
          custom={0}
          className="w-[30%] rounded-3xl h-[700px] relative group overflow-hidden"
        >
          <Link href={'#'}>
            <Image
              src={Turk}
              alt="turk"
              className="rounded-3xl h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/15 group-hover:bg-black/50 transition-colors duration-500 rounded-3xl" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <RemoveRedEyeOutlinedIcon
                className="text-white"
                sx={{ width: '60px', height: '60px' }}
              />
            </div>
            <div className="absolute bottom-10 left-4 transition-all duration-500 group-hover:translate-y-[-4px] group-hover:scale-105">
              <p className="text-white text-2xl font-semibold">Турция</p>
              <p className="text-white text-sm">От $700 / 2 чел</p>
            </div>
          </Link>
        </motion.div>
        <div className="grid grid-rows-2 w-full gap-4">
          <div className="w-full flex h-full rounded-3xl gap-4">
            <motion.div
              variants={fadeUp}
              custom={1}
              className="w-[30%] rounded-3xl relative group overflow-hidden"
            >
              <Link href={'#'}>
                <Image
                  src={OAE}
                  alt="oae"
                  className="rounded-3xl h-full object-cover w-full transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/15 group-hover:bg-black/50 transition-colors duration-500 rounded-3xl" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <RemoveRedEyeOutlinedIcon
                    className="text-white"
                    sx={{ width: '60px', height: '60px' }}
                  />
                </div>
                <div className="absolute bottom-10 left-4">
                  <p className="text-white text-2xl font-semibold">ОАЭ</p>
                  <p className="text-white text-sm">От $1000 / 1 чел</p>
                </div>
              </Link>
            </motion.div>
            <motion.div
              variants={fadeUp}
              custom={2}
              className="w-[70%] rounded-3xl relative group overflow-hidden"
            >
              <Link href={'#'}>
                <Image
                  src={Tailand}
                  alt="Tailand"
                  className="rounded-3xl h-full object-cover w-full transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/15 group-hover:bg-black/50 transition-colors duration-500 rounded-3xl" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <RemoveRedEyeOutlinedIcon
                    className="text-white"
                    sx={{ width: '60px', height: '60px' }}
                  />
                </div>
                <div className="absolute bottom-10 left-4">
                  <p className="text-white text-2xl font-semibold">Таиланд</p>
                  <p className="text-white text-sm">От $800 / 1 чел</p>
                </div>
              </Link>
            </motion.div>
          </div>

          <div className="w-full flex h-full rounded-3xl gap-4">
            <motion.div
              variants={fadeUp}
              custom={3}
              className="w-[70%] rounded-3xl relative group overflow-hidden"
            >
              <Link href={'#'}>
                <Image
                  src={ShriLanka}
                  alt="ShriLanka"
                  className="rounded-3xl h-full object-cover w-full transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/15 group-hover:bg-black/50 transition-colors duration-500 rounded-3xl" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <RemoveRedEyeOutlinedIcon
                    className="text-white"
                    sx={{ width: '60px', height: '60px' }}
                  />
                </div>
                <div className="absolute bottom-10 left-4">
                  <p className="text-white text-2xl font-semibold">Шри-Ланка</p>
                  <p className="text-white text-sm">От $1050 / 2 чел</p>
                </div>
              </Link>
            </motion.div>
            <motion.div
              variants={fadeUp}
              custom={4}
              className="w-[30%] rounded-3xl relative group overflow-hidden"
            >
              <Link href={'#'}>
                <Image
                  src={Kuba}
                  alt="Kuba"
                  className="rounded-3xl h-full object-cover w-full transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/15 group-hover:bg-black/50 transition-colors duration-500 rounded-3xl" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <RemoveRedEyeOutlinedIcon
                    className="text-white"
                    sx={{ width: '60px', height: '60px' }}
                  />
                </div>
                <div className="absolute bottom-10 left-4">
                  <p className="text-white text-2xl font-semibold">Куба</p>
                  <p className="text-white text-sm">От $1200 / 2 чел</p>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
      <div className="w-full h-[400px] mt-20 relative flex rounded-4xl font-medium">
        <div className="h-[400px] w-full overflow-hidden relative rounded-4xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-[70%] h-[400px] z-10 absolute left-0 bottom-0 max-xl:w-[60%]"
          >
            <Image src={BannerCircle} alt="circle" className="w-full h-full" />
            <div className="absolute top-0 justify-center h-full left-10 flex flex-col gap-4">
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-3xl text-[#031753] font-semibold w-96"
              >
                Солнце, пляж, отпуск - всё включено
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl text-[#031753] w-[80%]"
              >
                Подбор туров у воды по сниженным ценам. Количество мест
                ограничено.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={'#'}
                    className="bg-[#ECF2FF] w-fit py-4 px-10 rounded-4xl flex gap-4 shadow-md"
                  >
                    <p className="text-blue-600 font-semibold">Забронировать</p>
                    <ArrowRightAltIcon className="text-blue-600" />
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            className="w-[40%] h-[500px] rounded-4xl max-xl:w-[50%] overflow-hidden absolute right-0 bottom-0"
          >
            <Image
              src={Shore}
              alt="Shore"
              className="w-full h-full object-cover right-0 absolute top-12"
            />
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          className="w-[40%] h-[500px] max-xl:w-[50%] absolute right-0 bottom-0 z-10"
        >
          <Image
            src={ShoreCrop}
            alt="ShoreCrop"
            className="w-full h-full object-cover right-0 absolute top-12"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Populardestinations;
