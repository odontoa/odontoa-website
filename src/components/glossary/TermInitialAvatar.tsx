import { Badge } from '@/components/ui/badge';

interface TermInitialAvatarProps {
  term: string;
}

export default function TermInitialAvatar({ term }: TermInitialAvatarProps) {
  const firstLetter = term.charAt(0).toUpperCase();

  return (
    <Badge
      variant="outline"
      className="h-12 w-12 rounded-full flex items-center justify-center text-lg font-semibold bg-primary/10 text-primary border-primary/20 shrink-0"
    >
      {firstLetter}
    </Badge>
  );
}
