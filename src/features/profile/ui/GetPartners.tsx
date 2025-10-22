'use client';
import Badge from '@/assets/Badge.png';
import { useRouter } from '@/shared/config/i18n/navigation';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '@/shared/ui/pagination';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { User_Api } from '../lib/api';

const GetPartners = ({
  setAdded,
  setEdit,
  setId,
}: {
  setAdded: Dispatch<SetStateAction<boolean>>;
  setEdit: Dispatch<SetStateAction<boolean>>;
  setId: Dispatch<SetStateAction<number | undefined>>;
}) => {
  const t = useTranslations();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const searchParams = useSearchParams();
  useEffect(() => {
    router.push(`/profile?tabs=travelers&page=${currentPage}`);
  }, [currentPage, router]);

  useEffect(() => {
    if (searchParams.get('page')) {
      setCurrentPage(Number(searchParams.get('page')));
    }
  }, [searchParams]);
  const { data: allParticipant, isLoading } = useQuery({
    queryKey: ['participant_all', currentPage],
    queryFn: () =>
      User_Api.getAllParticipant({
        page: currentPage,
        page_size: 8,
      }),
    select: (data) => data.data,
  });

  const { mutate: deleteParticipant } = useMutation({
    mutationFn: ({ id }: { id: string | number }) => {
      return User_Api.deleteParticipant({ id });
    },
    onSuccess() {
      queryClient.refetchQueries({ queryKey: ['participant_all'] });
      toast.success(t("Hamroh muvaffaqiyatli o'chirildi"));
      setAdded(false);
    },
    onError() {
      toast.error(t('Xatolik yuz berdi'));
    },
  });

  return (
    <>
      <motion.div
        key="list"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <div className="flex w-full justify-between">
            <p className="text-xl font-semibold text-[#212122]">
              {t('Мои попутчики')}
            </p>
            <Button
              variant={'outline'}
              onClick={() => setAdded(true)}
              className="!px-6 !py-5 rounded-full border border-[#DFDFDF] cursor-pointer"
            >
              <AddIcon sx={{ width: 24, height: 24, color: '#031753' }} />
              <p className="text-[#031753] text-md max-lg:hidden">
                {t('Добавить попутчика')}
              </p>
            </Button>
          </div>

          <hr className="h-[2px] bg-[#EDEEF1] mt-5" />

          {allParticipant && allParticipant.data.results.length === 0 ? (
            <div className="w-full h-[400px] flex flex-col gap-2 justify-center items-center">
              <Image src={Badge} alt="badge" width={100} height={100} />
              <p className="text-2xl font-semibold text-[#212122] mt-2">
                {t('Пока нет попутчиков')}
              </p>
              <p className="w-[40%] text-center text-[#646465] max-lg:w-full">
                {t('Добавьте своего первого попутчика')}
              </p>
            </div>
          ) : (
            <div className="mt-5">
              {allParticipant &&
                allParticipant.data.results.map((e, index) => (
                  <div
                    key={index}
                    className="w-full bg-[#EDEEF140] p-2 border border-[#EDEEF1] rounded-2xl mt-4 flex justify-between items-center max-lg:flex-col max-lg:items-start gap-4"
                  >
                    <div className="flex gap-2 items-center">
                      <Avatar className="w-14 h-14 rounded-lg">
                        <AvatarFallback className="w-14 h-14 rounded-lg">
                          {e.first_name.slice(0, 1)}
                          {e.last_name.slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-lg text-[#050B08] font-semibold">
                          {e.first_name} {e.last_name}
                        </p>
                        <p className="text-md text-[#646465] font-medium">
                          {e.gender === 'male'
                            ? t('Мужчина')
                            : e.gender === 'female'
                              ? t('Женщина')
                              : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => deleteParticipant({ id: e.id })}
                        className="!px-2.5 !py-5 rounded-full border bg-[#E03137] hover:bg-[#E03137] cursor-pointer"
                      >
                        <DeleteIcon
                          sx={{ width: 24, height: 24, color: '#FFF' }}
                        />
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEdit(true);
                          setId(e.id);
                        }}
                        className="!px-6 !py-5 rounded-full border border-[#DFDFDF] cursor-pointer"
                      >
                        <EditIcon
                          sx={{ width: 24, height: 24, color: '#031753' }}
                        />
                        <p className="text-[#031753] text-md">
                          {t('Изменение')}
                        </p>
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </motion.div>
      {!isLoading && allParticipant && allParticipant.data.total_pages > 1 && (
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
              {Array.from({ length: allParticipant.data.total_pages }).map(
                (_, i) => {
                  const page = i + 1;

                  if (
                    page === 1 ||
                    page === allParticipant.data.total_pages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                            router.push(`?tabs=travelers&page=${page}`, {
                              scroll: false,
                            });
                          }}
                          href={`?tabs=travelers&page=${page}`}
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
                },
              )}

              <Button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === allParticipant.data.total_pages}
                className="bg-[#ECF2FF] rounded-full w-10 hover:bg-[#ECF2FF] h-10 shadow-sm flex justify-center items-center cursor-pointer"
              >
                <ChevronRight color="#084FE3" />
              </Button>
            </PaginationContent>
          </Pagination>
        </motion.div>
      )}
    </>
  );
};

export default GetPartners;
