import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const CarouselContext = React.createContext(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

const Carousel = React.forwardRef((
  {
    orientation = "horizontal",
    opts,
    setApi,
    plugins,
    className,
    children,
    ...props
  },
  ref
) => {
  const [carouselRef, api] = useEmblaCarousel({
    ...opts,
    axis: orientation === "horizontal" ? "x" : "y",
  }, plugins)
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)

  const onSelect = React.useCallback((api) => {
    if (!api) {
      return
    }

    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
  }, [])

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = React.useCallback(() => {
    api?.scrollNext()
  }, [api])

  const handleKeyDown = React.useCallback((event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault()
      scrollPrev()
    } else if (event.key === "ArrowRight") {
      event.preventDefault()
      scrollNext()
    }
  }, [scrollPrev, scrollNext])

  React.useEffect(() => {
    if (!api || !setApi) {
      return
    }

    setApi(api)
  }, [api, setApi])

  React.useEffect(() => {
    if (!api) {
      return
    }

    onSelect(api)
    api.on("reInit", onSelect)
    api.on("select", onSelect)

    return () => {
      api?.off("select", onSelect)
    };
  }, [api, onSelect])

  return (
    (<CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        orientation:
          orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}>
      <div
        ref={ref}
        onKeyDownCapture={handleKeyDown}
        className={cn("relative", className)}
        role="region"
        aria-roledescription="carousel"
        {...props}>
        {children}
      </div>
    </CarouselContext.Provider>)
  );
})
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel()

  return (
    (<div ref={carouselRef} className="overflow-hidden h-[calc(100%+30px]">
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props} />
    </div>)
  );
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef(({ className, ...props }, ref) => {
  const { orientation } = useCarousel()

  return (
    (<div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props} />)
  );
})
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    (<Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn("absolute  h-8 w-8 rounded-full", orientation === "horizontal"
        ? "-left-12 top-1/2 -translate-y-1/2"
        : "-top-12 left-1/2 -translate-x-1/2 rotate-90", className)}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}>
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>)
  );
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    (<Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn("absolute h-8 w-8 rounded-full", orientation === "horizontal"
        ? "-right-12 top-1/2 -translate-y-1/2"
        : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90", className)}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}>
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>)
  );
})
CarouselNext.displayName = "CarouselNext"

const CarouselDots = React.forwardRef(({ className }, ref) => {
  const { api: embla } = useCarousel()
  const containerRef = React.useRef(null)
  const dotRefs = React.useRef([])
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [scrollSnaps, setScrollSnaps] = React.useState([])

  // Init scrollSnaps and listen for index change
  React.useEffect(() => {
    if (!embla) return

    const update = () => setSelectedIndex(embla.selectedScrollSnap())
    const reInit = () => {
      setScrollSnaps(embla.scrollSnapList())
      update()
    }

    reInit()
    embla.on("select", update)
    embla.on("reInit", reInit)

    return () => {
      embla.off("select", update)
      embla.off("reInit", reInit)
    }
  }, [embla])

  // Scroll to active dot **only if not visible**
  React.useEffect(() => {
    const container = containerRef.current
    const activeDot = dotRefs.current[selectedIndex]

    if (!container || !activeDot) return

    const containerRect = container.getBoundingClientRect()
    const dotRect = activeDot.getBoundingClientRect()

    const isOutOfView =
      dotRect.left < containerRect.left || dotRect.right > containerRect.right

    if (isOutOfView) {
      const scrollLeft =
        activeDot.offsetLeft -
        container.offsetWidth / 2 +
        activeDot.offsetWidth / 2

      container.scrollTo({ left: scrollLeft, behavior: "smooth" })
    }
  }, [selectedIndex])

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex items-center gap-3 overflow-x-auto no-scrollbar px-2",
        className
      )}
    >
      {scrollSnaps.map((_, index) => (
        <button
          key={index}
          ref={(el) => (dotRefs.current[index] = el)}
          className={cn(
            "w-[10px] h-[10px] flex-shrink-0 rounded-full relative transition-all",
            index === selectedIndex
              ? "after:content-[''] after:absolute after:inset-0 after:rounded-full after:ring-4 after:ring-black"
              : "bg-gray-400 opacity-40"
          )}
          onClick={() => embla?.scrollTo(index)}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  )
})
CarouselDots.displayName = "CarouselDots"

export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, CarouselDots };
