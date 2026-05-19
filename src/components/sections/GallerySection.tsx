import {
  DraggableGalleryGrid,
  GalleryGridBody,
  GalleryGridItem,
} from "@/components/ui/infinite-drag-scroll";
import { GALLERY_IMAGES } from "@/data/gallery";

export function GallerySection() {
  return (
    <section id="gallery" className="scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Gallery
          </h2>
          <p className="mt-4 text-muted md:text-lg">
            Drag the canvas or scroll with your trackpad — a tactile moodboard
            inspired by premium editorial layouts.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-[2rem] border border-white/10 bg-[#070708] shadow-[0_40px_100px_-50px_rgba(0,0,0,0.9)]">
          <DraggableGalleryGrid variant="masonry">
            <GalleryGridBody>
              {GALLERY_IMAGES.map((image) => (
                <GalleryGridItem
                  key={image.id}
                  className="relative h-44 w-28 md:h-72 md:w-52"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                  />
                </GalleryGridItem>
              ))}
            </GalleryGridBody>
          </DraggableGalleryGrid>
        </div>
      </div>
    </section>
  );
}
