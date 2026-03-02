import { Badge } from "./ui/badge";

export const getDifferenceBadge = (difference: number | undefined) => {
  if (difference) {
    if (difference > 0)
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          +{difference}
        </Badge>
      );
    if (difference < 0)
      return (
        <Badge variant="secondary" className="bg-red-100 text-red-800">
          {difference}
        </Badge>
      );
  }
  return (
    <Badge variant="secondary" className="bg-gray-100 text-gray-800">
      0
    </Badge>
  );
};
