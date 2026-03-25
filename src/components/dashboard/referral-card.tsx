import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function ReferralCard() {
    return (
        <div className="rounded-3xl p-8 shadow-md mt-6 bg-gradient-to-br from-[#1c1917] to-[#44403c] relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                    <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-yellow-200" />
                    </div>
                    <span className="text-xs font-bold tracking-widest text-yellow-200 uppercase">Exclusive</span>
                </div>

                <h3 className="text-2xl font-serif text-white mb-2">VIP Referral</h3>
                <p className="text-stone-300 text-sm mb-6 leading-relaxed">
                    Invite your friends to experience Lune. They get <span className="text-white font-medium">15% off</span> their first visit, and you earn <span className="text-white font-medium">20% off</span> your next session.
                </p>

                <Button className="w-full bg-white text-stone-900 hover:bg-stone-100 font-medium py-6 rounded-xl transition-all shadow-lg shadow-black/20">
                    Get Your Unique Code
                </Button>
            </div>
        </div>
    );
}
