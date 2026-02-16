'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function TestEmailPage() {
  const [testType, setTestType] = useState<'contact' | 'demo'>('contact');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const testContactForm = async () => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          phone: '+381 60 123 4567',
          clinic: 'Test Clinic',
          subject: 'Test Contact Form',
          message: 'This is a test message from the contact form.'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
      } else {
        setMessage({ type: 'error', text: data.error || 'Greška pri testiranju' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Greška pri testiranju' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const testDemoForm = async () => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          phone: '+381 60 123 4567'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
      } else {
        setMessage({ type: 'error', text: data.error || 'Greška pri testiranju' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Greška pri testiranju' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Email Test Page</h1>
        
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Test Email Functionality</h2>
            
            <div className="flex gap-4 mb-6">
              <Button
                onClick={() => setTestType('contact')}
                variant={testType === 'contact' ? 'default' : 'outline'}
              >
                Contact Form
              </Button>
              <Button
                onClick={() => setTestType('demo')}
                variant={testType === 'demo' ? 'default' : 'outline'}
              >
                Demo Form
              </Button>
            </div>

            {testType === 'contact' ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Test the contact form email functionality. This will send an email to info@odontoa.info and ognjen.drinic31@gmail.com
                </p>
                <Button 
                  onClick={testContactForm}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? 'Testing...' : 'Test Contact Form Email'}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Test the demo form email functionality. This will send an email to info@odontoa.info and ognjen.drinic31@gmail.com
                </p>
                <Button 
                  onClick={testDemoForm}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? 'Testing...' : 'Test Demo Form Email'}
                </Button>
              </div>
            )}

            {message && (
              <div className={`p-3 rounded-lg text-sm ${
                message.type === 'success' 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {message.text}
              </div>
            )}
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Setup Instructions</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Create a SendGrid account at sendgrid.com</li>
              <li>Get your API key from Settings → API Keys</li>
              <li>Verify your domain in SendGrid</li>
              <li>Create a .env.local file with SENDGRID_API_KEY</li>
              <li>Test the email functionality using the buttons above</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
