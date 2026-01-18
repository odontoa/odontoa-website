'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Home2Footer = () => {
  return (
    <footer className="w-full" style={{ background: '#000A2D' }}>
      <div className="mx-auto max-w-[1240px] px-[10px] py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo and Company Info */}
          <div>
            <div className="mb-4">
              <h3 
                className="text-white font-bold text-xl"
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 700,
                  fontSize: '20px'
                }}
              >
                DENTAL
              </h3>
            </div>
            <p 
              className="text-white/70 mb-6"
              style={{
                fontFamily: 'Archivo, sans-serif',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '1.6em'
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            
            {/* Social Media */}
            <div className="flex gap-2">
              <a 
                href="#" 
                className="w-9 h-9 rounded-[1.8px] bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Facebook className="w-4 h-4 text-white" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 rounded-[1.8px] bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Twitter className="w-4 h-4 text-white" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 rounded-[1.8px] bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Instagram className="w-4 h-4 text-white" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 rounded-[1.8px] bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Linkedin className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>

          {/* Helpful Link */}
          <div>
            <h3 
              className="text-white font-bold mb-4"
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 700,
                fontSize: '22px',
                lineHeight: '1.2em'
              }}
            >
              Helpfull Link
            </h3>
            <div className="w-20 h-0.5 bg-[#3267FF] mb-6"></div>
            <ul className="space-y-3">
              {['Privacy Policy', 'Support', 'FAQ', 'Terms & Conditions'].map((link, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-white/70 hover:text-white transition-colors"
                    style={{
                      fontFamily: 'Archivo, sans-serif',
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '1.6em'
                    }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 
              className="text-white font-bold mb-4"
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 700,
                fontSize: '22px',
                lineHeight: '1.2em'
              }}
            >
              Support
            </h3>
            <div className="w-20 h-0.5 bg-[#3267FF] mb-6"></div>
            <ul className="space-y-3">
              {['Privacy Policy', 'Support', 'FAQ', 'Terms & Conditions'].map((link, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-white/70 hover:text-white transition-colors"
                    style={{
                      fontFamily: 'Archivo, sans-serif',
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '1.6em'
                    }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 
              className="text-white font-bold mb-4"
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 700,
                fontSize: '22px',
                lineHeight: '1.2em'
              }}
            >
              Contact Us
            </h3>
            <div className="w-20 h-0.5 bg-[#3267FF] mb-6"></div>
            
            {/* Email Input */}
            <div className="mb-6">
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Your Email Address..."
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-[4px] text-white placeholder:text-white/44 focus:outline-none focus:border-[#3267FF]"
                  style={{
                    fontFamily: 'Archivo, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px'
                  }}
                />
                <Button 
                  className="bg-[#1644EF] text-white hover:bg-[#1644EF]/90 rounded-[5px] px-8 py-3 h-auto"
                  style={{
                    fontFamily: 'Archivo, sans-serif',
                    fontWeight: 600,
                    fontSize: '16px',
                    lineHeight: '1em'
                  }}
                >
                  Sign Up
                </Button>
              </div>
            </div>

            {/* Contact Info */}
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                <span 
                  className="text-white/70"
                  style={{
                    fontFamily: 'Archivo, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '1.6em'
                  }}
                >
                  Jl. Patimura II No. 18, Denpasar
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                <span 
                  className="text-white/70"
                  style={{
                    fontFamily: 'Archivo, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '1.6em'
                  }}
                >
                  +01234 567 890
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div 
          className="pt-8 border-t border-white/9 flex flex-col md:flex-row items-center justify-between"
        >
          <p 
            className="text-white/70 mb-4 md:mb-0"
            style={{
              fontFamily: 'Archivo, sans-serif',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '1.6em'
            }}
          >
            Dental
          </p>
          <p 
            className="text-white/70"
            style={{
              fontFamily: 'Archivo, sans-serif',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '1.6em'
            }}
          >
            Copyright © 2023. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Home2Footer;





