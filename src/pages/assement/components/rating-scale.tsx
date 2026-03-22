import { CheckCircle2 } from "lucide-react";

interface RatingScaleProps {
  value?: number;
  onChange?: (value: number) => void; // Made optional
  disabled?: boolean;                 // Added disabled prop
}

export function RatingScale({ value, onChange, disabled = false }: RatingScaleProps) {
  const scale = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="flex flex-col space-y-3 mt-4 animate-in fade-in duration-300">
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {scale.map((num) => {
          const isSelected = value === num;
          return (
            <button
              key={num}
              disabled={disabled}
              onClick={() => {
                if (!disabled && onChange) onChange(num);
              }}
              className={`
                relative w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm sm:text-base font-bold transition-all duration-200 select-none shadow-sm
                ${isSelected 
                  ? 'bg-primary text-primary-foreground border-2 border-primary scale-110 shadow-md ring-4 ring-primary/20' 
                  : 'bg-card text-muted-foreground border-2 border-border/60'
                }
                ${!disabled && !isSelected ? 'hover:border-primary/50 hover:bg-primary/5 hover:text-primary hover:shadow-md' : ''}
                ${disabled ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}
              `}
            >
              {num}
              {isSelected && (
                  <div className="absolute -top-1 -right-1 bg-background rounded-full">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Visual Context Labels */}
      <div className="flex items-center justify-between max-w-[400px] text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
          <span>Needs Improvement</span>
          <span>Exceptional</span>
      </div>
    </div>
  );
}