'use client';

import News1 from '@/assets/news_1.jpg';
import { Link } from '@/shared/config/i18n/navigation';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/card';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const News = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('page') || '1';

  const title =
    'Международный конгресс туроператоров: заключительный день в...';

  const newsData = Array.from({ length: 30 }).map((_, index) => ({
    id: index,
    date: '18.09.2023',
    title,
    desc: 'Государственное регулирование туристского рынка и создание условий...',
    image: News1,
  }));

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const totalPages = Math.ceil(newsData.length / itemsPerPage);

  const currentItems = newsData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const getPaginationRange = () => {
    const delta = 2;
    const range: (number | string)[] = [];
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    range.push(1);
    if (left > 2) range.push('...');
    for (let i = left; i <= right; i++) range.push(i);
    if (right < totalPages - 1) range.push('...');
    if (totalPages > 1) range.push(totalPages);

    return range;
  };

  const handleTabClick = (item: number) => {
    setCurrentPage(item);
    const params = new URLSearchParams(window.location.search);
    params.set('page', String(item));
    router.push(`?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    setCurrentPage(Number(initialTab));
  }, [initialTab]);

  // Card rowlarini hosil qilish
  const rows = [];
  for (let i = 0; i < currentItems.length; i += 3) {
    rows.push(currentItems.slice(i, i + 3));
  }

  return (
    <div className="custom-container flex flex-col gap-8">
      <div className="flex flex-col gap-6">
        {rows.map((row, rowIdx) => (
          <div
            key={`${currentPage}-${rowIdx}`}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
          >
            {row.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.1 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <Link href={`/blogs/${item.id}`} className="w-full">
                  <Card className="!p-0 rounded-3xl cursor-pointer overflow-hidden">
                    <CardHeader className="!p-0 relative">
                      <motion.div
                        className="w-full h-[200px] overflow-hidden rounded-3xl"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Image
                          src={item.image}
                          alt={`${item.id}`}
                          quality={100}
                          className="w-full h-full object-cover rounded-3xl"
                        />
                      </motion.div>

                      <div className="flex flex-col absolute bottom-4 left-4 z-10">
                        <Badge
                          variant="default"
                          className="bg-[#031753] px-4 py-1 rounded-4xl text-sm font-semibold"
                        >
                          {item.date}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <p className="text-2xl font-semibold text-[#031753]">
                        {item.title.length > 50
                          ? item.title.slice(0, 50) + '...'
                          : item.title}
                      </p>
                      <p className="mt-4 text-md text-[#646465]">{item.desc}</p>
                    </CardContent>

                    <CardFooter className="mb-5">
                      <Link href={`/blogs/${item.id}`} className="w-full">
                        <Button className="w-full cursor-pointer bg-[#ECF2FF] font-semibold rounded-full hover:bg-[#ECF2FF] !py-8 text-lg text-[#084FE3]">
                          Узнать больше
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2">
        <motion.div whileHover={{ scale: 1.05 }}>
          <Button
            className="cursor-pointer"
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => handleTabClick(currentPage - 1)}
          >
            <ChevronLeftIcon />
          </Button>
        </motion.div>

        {getPaginationRange().map((page, index) =>
          page === '...' ? (
            <span
              key={index}
              className="px-3 py-2 flex items-center justify-center text-gray-500"
            >
              ...
            </span>
          ) : (
            <motion.div key={index} whileHover={{ scale: 1.05 }}>
              <Button
                onClick={() => handleTabClick(Number(page))}
                className="cursor-pointer"
                variant={currentPage === page ? 'default' : 'outline'}
              >
                {page}
              </Button>
            </motion.div>
          ),
        )}

        <motion.div whileHover={{ scale: 1.05 }}>
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            className="cursor-pointer"
            onClick={() => handleTabClick(currentPage + 1)}
          >
            <ChevronRightIcon />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default News;
