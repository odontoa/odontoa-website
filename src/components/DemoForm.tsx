'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";

interface DemoFormProps {
  className?: string;
  title?: string;
  description?: string;
  buttonText?: string;
}

export const DemoForm: React.FC<DemoFormProps> = ({ 
  className = "",
  title = "Zakažite demo",
  description = "Kontaktirajte nas za besplatan demo Odontoa sistema",
  buttonText = "Zakaži demo"
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch('/api/demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitMessage({ type: 'success', text: data.message });
        setFormData({
          name: '',
          email: '',
          phone: ''
        });
      } else {
        setSubmitMessage({ type: 'error', text: data.error || 'Greška pri slanju zahteva' });
      }
    } catch (error) {
      setSubmitMessage({ type: 'error', text: 'Greška pri slanju zahteva. Pokušajte ponovo.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Ime i prezime"
          className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900"
          required
        />
        <Input
          name="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          placeholder="Email adresa"
          className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900"
          required
        />
        <Input
          name="phone"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          placeholder="Broj telefona"
          className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900"
          required
        />
        
        <Button 
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-3 transition-colors duration-200 w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Slanje...
            </>
          ) : (
            <>
              {buttonText}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>

        {submitMessage && (
          <div className={`p-3 rounded-lg text-sm ${
            submitMessage.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {submitMessage.text}
          </div>
        )}

        <p className="text-xs text-gray-500 mt-2 text-center leading-relaxed">
          Vaši podaci su zaštićeni u skladu sa GDPR regulativom.{" "}
          <a href="/politika-privatnosti" className="text-blue-600 hover:underline">
            Politika privatnosti
          </a>
        </p>
      </form>
    </div>
  );
};
