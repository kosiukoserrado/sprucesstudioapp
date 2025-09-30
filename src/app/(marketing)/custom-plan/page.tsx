import Image from 'next/image';
import { CustomPlanForm } from '@/components/custom-plan-form';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function CustomPlanPage() {
  const pageImage = PlaceHolderImages.find(p => p.id === 'custom-plan-bg');

  return (
    <div className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-4">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">Generate Your Custom Cleaning Plan</h1>
            <p className="text-muted-foreground md:text-xl">
              Answer a few simple questions, and our AI will create a personalized cleaning plan and instant quote just for you. No surprises, just a perfectly clean home.
            </p>
            <div className="aspect-video overflow-hidden rounded-xl">
              {pageImage && (
                <Image
                  src={pageImage.imageUrl}
                  alt={pageImage.description}
                  width={1200}
                  height={600}
                  className="object-cover w-full h-full"
                  data-ai-hint={pageImage.imageHint}
                />
              )}
            </div>
          </div>
          <div className="flex items-center">
            <CustomPlanForm />
          </div>
        </div>
      </div>
    </div>
  );
}
