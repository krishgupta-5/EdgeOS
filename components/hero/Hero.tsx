import { HeroContent } from './HeroContent';

export default function Hero({ stars }: { stars?: string | null }) {
  return (
    <section className="relative pt-16 pb-8 sm:pt-20 sm:pb-6 md:pt-28 md:pb-4 lg:pt-32 lg:pb-5 min-h-screen xl:pt-40 xl:pb-6 overflow-x-hidden overflow-y-visible">

      {/* ADD THIS */}
      <div className="fixed inset-0 -z-10">
        <img
          src="/bg.jpeg"
          alt="bg"
          className="w-full h-full object-cover opacity-50"
        />
      </div>

      {/* OPTIONAL (recommended for readability) */}

      {/* KEEP YOUR CONTENT SAME */}
      <HeroContent />

    </section>
  );
}