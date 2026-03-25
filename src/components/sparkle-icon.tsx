import { cn } from "@/lib/utils";

export function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-6 h-6 text-primary", className)}
    >
      <path
        d="M8 0L9.472 6.528L16 8L9.472 9.472L8 16L6.528 9.472L0 8L6.528 6.528L8 0Z"
        fill="currentColor"
      />
    </svg>
  );
}
