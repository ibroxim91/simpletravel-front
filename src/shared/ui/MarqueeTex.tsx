import { motion, useAnimation } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface Props {
  children: React.ReactNode;
  speed?: number;
}

export function MarqueeText({ children, speed = 35 }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const controls = useAnimation();
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!ref.current) return;

    const resizeObserver = new ResizeObserver(() => {
      setWidth(Math.random());
    });

    resizeObserver.observe(ref.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const distance = el.scrollWidth - el.clientWidth;

    if (distance <= 0) {
      controls.stop();
      controls.set({ x: 0 });
      return;
    }

    controls.start({
      x: [10, -distance],
      transition: {
        duration: speed,
        repeat: Infinity,
        ease: 'linear',
        repeatType: 'loop',
      },
    });
  }, [children, width, speed, controls]);

  return (
    <div ref={ref} className="overflow-hidden whitespace-nowrap w-full">
      <motion.div animate={controls}>{children}</motion.div>
    </div>
  );
}
