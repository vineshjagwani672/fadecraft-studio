import {
  animate,
  cubicBezier,
  motion,
  useMotionValue,
  wrap,
} from "framer-motion";
import {
  memo,
  useContext,
  useEffect,
  useRef,
  useState,
  createContext,
  type ReactNode,
} from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

type Variants = "default" | "masonry" | "polaroid";

const GridVariantContext = createContext<Variants | undefined>(undefined);

const rowVariants = {
  initial: { opacity: 0, scale: 0.3 },
  animate: () => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: Math.random() + 1.5,
      duration: 1.4,
      ease: cubicBezier(0.18, 0.71, 0.11, 1),
    },
  }),
};

export function DraggableGalleryGrid({
  className,
  children,
  variant,
}: {
  className?: string;
  children: ReactNode;
  variant?: Variants;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const [isDragging, setIsDragging] = useState(false);
  const handleIsDragging = () => setIsDragging(true);
  const handleIsNotDragging = () => setIsDragging(false);

  useEffect(() => {
    const container = ref.current?.getBoundingClientRect();
    if (!container) return;

    const { width, height } = container;

    const xDrag = x.on("change", (latest) => {
      const wrappedX = wrap(-(width / 2), 0, latest);
      x.set(wrappedX);
    });

    const yDrag = y.on("change", (latest) => {
      const wrappedY = wrap(-(height / 2), 0, latest);
      y.set(wrappedY);
    });

    const handleWheelScroll = (event: WheelEvent) => {
      if (!isDragging) {
        animate(y, y.get() - event.deltaY * 2.7, {
          type: "tween",
          duration: 1.2,
          ease: cubicBezier(0.18, 0.71, 0.11, 1),
        });
      }
    };

    window.addEventListener("wheel", handleWheelScroll);
    return () => {
      xDrag();
      yDrag();
      window.removeEventListener("wheel", handleWheelScroll);
    };
  }, [x, y, isDragging]);

  return (
    <GridVariantContext.Provider value={variant}>
      <div className="h-full min-h-[420px] w-full overflow-hidden rounded-[inherit] md:min-h-[520px]">
        <motion.div className="h-full overflow-hidden rounded-[inherit]">
          <motion.div
            className={cn(
              "grid h-fit w-fit cursor-grab grid-cols-[repeat(2,1fr)] bg-[#0a0a0c] active:cursor-grabbing will-change-transform",
              className,
            )}
            drag
            dragMomentum
            dragTransition={{
              timeConstant: 200,
              power: 0.28,
              restDelta: 0,
              bounceStiffness: 0,
            }}
            onMouseDown={handleIsDragging}
            onMouseUp={handleIsNotDragging}
            onMouseLeave={handleIsNotDragging}
            style={{ x, y }}
            ref={ref}
          >
            {children}
          </motion.div>
        </motion.div>
      </div>
    </GridVariantContext.Provider>
  );
}

export function GalleryGridItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const variant = useContext(GridVariantContext);

  const gridItemStyles = cva(
    "h-full w-full overflow-hidden will-change-transform hover:cursor-pointer",
    {
      variants: {
        variant: {
          default: "rounded-sm",
          masonry: "even:mt-[45%] rounded-sm",
          polaroid:
            "border-10 border-b-28 border-white shadow-xl even:rotate-3 odd:-rotate-2 transition-transform duration-300 ease-out even:mt-[45%] hover:rotate-0",
        },
      },
      defaultVariants: {
        variant: "default",
      },
    },
  );

  return (
    <motion.div
      className={cn(gridItemStyles({ variant, className }))}
      variants={rowVariants}
      initial="initial"
      animate="animate"
    >
      {children}
    </motion.div>
  );
}

export const GalleryGridBody = memo(
  ({
    children,
    className,
  }: {
    children: ReactNode;
    className?: string;
  }) => {
    const variant = useContext(GridVariantContext);

    const gridBodyStyles = cva("grid h-fit w-fit grid-cols-[repeat(6,1fr)]", {
      variants: {
        variant: {
          default: "gap-10 p-6 md:gap-20 md:p-12",
          masonry: "gap-x-10 px-6 md:gap-x-20 md:px-12",
          polaroid: "gap-x-10 px-6 md:gap-x-20 md:px-12",
        },
      },
      defaultVariants: {
        variant: "default",
      },
    });

    return (
      <>
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className={cn(gridBodyStyles({ variant, className }))}
          >
            {children}
          </div>
        ))}
      </>
    );
  },
);

GalleryGridBody.displayName = "GalleryGridBody";
