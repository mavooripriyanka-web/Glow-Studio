import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface InfoCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel: string;
    actionHref: string;
}

export function InfoCard({ icon: Icon, title, description, actionLabel, actionHref }: InfoCardProps) {
    return (
        <div className="bg-white rounded-3xl p-8 shadow-sm flex flex-col items-start h-full">
            <div className="flex items-center gap-3 mb-4">
                <div className="h-6 w-6 rounded-full border border-primary flex items-center justify-center">
                    <Icon className="h-3 w-3 text-primary" />
                </div>
                <h3 className="font-semibold text-primary">{title}</h3>
            </div>

            <p className="text-stone-500 text-sm mb-6 flex-1">
                {description}
            </p>

            <Link href={actionHref} className="text-primary/70 font-medium text-sm hover:text-primary transition-colors">
                {actionLabel}
            </Link>
        </div>
    );
}
