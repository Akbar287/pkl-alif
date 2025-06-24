"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import C1 from "@/assets/1.png";
import C2 from "@/assets/Konsep Banner Magang.png";
import C3 from "@/assets/3.png";
import C4 from "@/assets/4.png";
import C5 from "@/assets/Pengunduran Diri_Pembatalan Magang.png";
import Image, { StaticImageData } from "next/image";

interface CarouselItemData {
  id: number;
  title: string;
  image: StaticImageData;
  alt: string;
}

const Hero = () => {
  const carouselItems: CarouselItemData[] = [
    {
      id: 1,
      title: "Explore New Horizons",
      image: C1,
      alt: "Abstract landscape with new horizons",
    },
    {
      id: 2,
      title: "Unleash Your Potential",
      image: C2,
      alt: "Dynamic abstract art representing potential",
    },
    {
      id: 3,
      title: "Innovate and Create",
      image: C3,
      alt: "Creative abstract design with tech elements",
    },
    {
      id: 4,
      title: "Connect with Experts",
      image: C4,
      alt: "Abstract network connections",
    },
    {
      id: 5,
      title: "Connect with Experts",
      image: C5,
      alt: "Abstract network connections",
    },
  ];

  return (
    <div className=" w-full overflow-hidden pt-20 bg-transparent">
      <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
        <Carousel className="w-full">
          <CarouselContent className="-ml-1">
            {carouselItems.map((item) => (
              <CarouselItem key={item.id} className="pl-1">
                <div className="p-1">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    className="h-full w-full object-cover rounded-xl"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://placehold.co/1200x600/666666/FFFFFF?text=Image+Load+Error`;
                    }}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white rounded-full p-2 shadow-lg" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white rounded-full p-2 shadow-lg" />
        </Carousel>
      </div>
    </div>
  );
};

export default Hero;
