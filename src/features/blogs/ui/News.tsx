'use client';

import { Link, useRouter } from '@/shared/config/i18n/navigation';
import formatDate from '@/shared/lib/formatDate';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '@/shared/ui/pagination';
import { Skeleton } from '@/shared/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { News_Api } from '../lib/api';

const News = () => {
  const t = useTranslations();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const searchParams = useSearchParams();
  // const initialTab = searchParams.get('tab') ?? '';

  // const { data: tags } = useQuery({
  //   queryKey: ['get_tabs', initialTab],
  //   queryFn: () =>
  //     News_Api.getTagDetail({
  //       id: Number(initialTab),
  //     }),
  //   select(data) {
  //     return data.data.data;
  //   },
  // });

  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ['all_news', currentPage],
    queryFn: () =>
      News_Api.getAllNews({
        page: currentPage,
        page_size: 9,
      }),
    select(data) {
      return data.data;
    },
  });

  useEffect(() => {
    router.push(`/blogs?page=${currentPage}`);
  }, [currentPage, router]);

  useEffect(() => {
    if (searchParams.get('page')) {
      setCurrentPage(Number(searchParams.get('page')));
    }
  }, [searchParams]);

  return (
    <div className="custom-container flex flex-col gap-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <Card key={idx} className="!p-0 rounded-3xl overflow-hidden">
                <CardHeader className="!p-0">
                  <Skeleton className="w-full h-[200px] rounded-3xl" />
                </CardHeader>
                <CardContent className="space-y-3 mt-4">
                  <Skeleton className="h-6 w-3/4 rounded-md" />
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-4 w-2/3 rounded-md" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-12 w-full rounded-full" />
                </CardFooter>
              </Card>
            ))
          : data?.data.results?.map((item, idx) => (
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
                          width={500}
                          height={500}
                          className="w-full h-full object-cover rounded-3xl"
                        />
                      </motion.div>

                      <div className="flex flex-col absolute bottom-4 left-4 z-10">
                        <Badge
                          variant="default"
                          className="bg-[#031753] px-4 py-1 rounded-4xl text-sm font-semibold"
                        >
                          {formatDate.format(item.created, 'DD.MM.YYYY')}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <p className="text-2xl font-semibold text-[#031753]">
                        {item.short_title}
                      </p>
                      <p className="mt-4 text-md text-[#646465]">
                        {item.short_text}
                      </p>
                    </CardContent>

                    <CardFooter className="mb-5">
                      <Button className="w-full cursor-pointer bg-[#ECF2FF] font-semibold rounded-full hover:bg-[#ECF2FF] !py-8 text-lg text-[#084FE3]">
                        {t('Узнать больше')}
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            ))}
      </div>

      {!isLoading && data && data.data.total_pages > 1 && (
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.1,
            ease: 'easeOut',
          }}
          viewport={{ once: false, amount: 0.1 }}
          className="flex justify-end items-end w-full mt-10"
        >
          <Pagination className="flex justify-end">
            <PaginationContent>
              <Button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 1}
                className="bg-[#ECF2FF] rounded-full w-10 hover:bg-[#ECF2FF] h-10 shadow-sm flex justify-center items-center cursor-pointer"
              >
                <ChevronLeft color="#084FE3" />
              </Button>
              {Array.from({ length: data.data.total_pages }).map((_, i) => {
                const page = i + 1;

                if (
                  page === 1 ||
                  page === data.data.total_pages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                          router.push(`?page=${page}`, { scroll: false });
                        }}
                        href={`?page=${page}`}
                        className={clsx(
                          'rounded-full w-10 h-10 flex items-center justify-center shadow-sm',
                          currentPage === page
                            ? 'bg-[#084FE3] text-white'
                            : 'bg-[#ECF2FF] text-[#084FE3]',
                        )}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }

                if (page === currentPage - 2 || page === currentPage + 2) {
                  return (
                    <PaginationItem key={`ellipsis-${page}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                return null;
              })}

              <Button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === data.data.total_pages}
                className="bg-[#ECF2FF] rounded-full w-10 hover:bg-[#ECF2FF] h-10 shadow-sm flex justify-center items-center cursor-pointer"
              >
                <ChevronRight color="#084FE3" />
              </Button>
            </PaginationContent>
          </Pagination>
        </motion.div>
      )}
    </div>
  );
};

export default News;
