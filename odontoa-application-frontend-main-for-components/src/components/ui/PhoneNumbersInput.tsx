import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { PhoneNumber } from "@/types/Patient";
import { cn } from "@/lib/utils";

interface PhoneNumbersInputProps {
  phoneNumbers: PhoneNumber[];
  onChange: (phoneNumbers: PhoneNumber[]) => void;
  error?: string;
  className?: string;
}

export function PhoneNumbersInput({
  phoneNumbers,
  onChange,
  error,
  className,
}: PhoneNumbersInputProps) {
  const addPhoneNumber = () => {
    const newPhoneNumber: PhoneNumber = {
      phonenumber: "",
    };
    onChange([...phoneNumbers, newPhoneNumber]);
  };

  const removePhoneNumber = (index: number) => {
    if (phoneNumbers.length > 1) {
      const updated = phoneNumbers.filter((_, i) => i !== index);
      onChange(updated);
    }
  };

  const updatePhoneNumber = (index: number, value: string) => {
    const updated = phoneNumbers.map((phone, i) =>
      i === index ? { ...phone, phonenumber: value } : phone
    );
    onChange(updated);
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          Brojevi telefona <span className="text-red-500">*</span>
        </label>
      </div>

      <div className="space-y-2">
        {phoneNumbers.map((phone, index) => (
          <div key={index} className="flex gap-2 items-center">
            <div className="flex-1">
              <Input
                value={phone.phonenumber}
                onChange={(e) => updatePhoneNumber(index, e.target.value)}
                placeholder="+381 60 123 4567"
                className="h-10"
              />
            </div>
            {phoneNumbers.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removePhoneNumber(index)}
                className="h-10 w-10 text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addPhoneNumber}
            className="h-8 px-3"
          >
            <Plus className="h-4 w-4 mr-1" />
            Dodaj broj
          </Button>
        </div>
      </div>

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
