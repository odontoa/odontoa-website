import { cn } from "@/lib/utils";
import odontoaLogo from "@/assets/Full_logo_vertical_color.png"

interface LoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showLogo?: boolean;
}

export const Loading = ({ className, size = "md", showLogo = true }: LoadingProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      {showLogo && (
        <div className="flex items-center gap-3 mb-4">
          <img
            src={odontoaLogo}
            alt="Odontoa"
            className="h-10 w-auto opacity-80"
          />
        </div>
      )}

      <div className="relative">
        <div className={cn(
          "animate-spin rounded-full border-2 border-gray-200",
          sizeClasses[size]
        )}>
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-transparent border-t-blue-600 animate-spin"></div>
        </div>
      </div>

      <p className="text-sm text-gray-500 animate-pulse">Loading...</p>
    </div>
  );
};

export const LoadingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loading size="lg" showLogo={true} />
    </div>
  );
}; 