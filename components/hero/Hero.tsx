import { HeroContent } from './HeroContent';

export default function Hero({ stars }: { stars?: string | null }) {
    return (<section className="relative pt-16 pb-8 sm:pt-20 sm:pb-6 md:pt-28 md:pb-4 lg:pt-32 lg:pb-5 min-h-screen xl:pt-40 xl:pb-6 overflow-x-hidden overflow-y-visible">
            <HeroContent />
        </section>);
}