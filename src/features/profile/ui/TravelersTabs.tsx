import clsx from 'clsx';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import CreatePatrners from './CreatePatrners';
import EditPartners from './EditPartners';
import GetPartners from './GetPartners';

function TravelersTabs() {
  const [add, setAdded] = useState(false);
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState<number | undefined>(undefined);

  return (
    <div
      className={clsx(
        'w-full relative rounded-3xl px-6 flex flex-col justify-between',
        add ? 'bg-none lg:px-6 max-lg:px-0' : 'bg-white h-full py-4',
      )}
    >
      <AnimatePresence mode="wait">
        {add ? (
          <CreatePatrners setAdded={setAdded} />
        ) : edit ? (
          <EditPartners setAdded={setEdit} id={id} />
        ) : (
          <GetPartners setAdded={setAdded} setEdit={setEdit} setId={setId} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default TravelersTabs;
