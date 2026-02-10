'use client';

import { useState } from 'react';
import ContactForm from '@/components/forms/ContactForm';
import { Card, CardContent } from '@/components/ui/Card';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  Twitter,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import api from '@/lib/api';

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      const response = await api.post('/contact', data);
      setFormSubmitted(true);
    } catch (error) {
      console.error('Contact form error:', error);
      alert('Failed to send message. Please try again later.');
    }
  };

  const contactInfos = [
    {
      icon: Phone,
      title: "Direct Support",
      detail: "+1 (555) 123-4567",
      subDetail: "Available for urgent tech issues",
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    {
      icon: Mail,
      title: "Digital Inquiries",
      detail: "support@storeapp.com",
      subDetail: "Typical response in 4 hours",
      color: "text-emerald-500",
      bg: "bg-emerald-50"
    },
    {
      icon: MapPin,
      title: "Global Headquarters",
      detail: "123 Commerce Street",
      subDetail: "San Francisco, CA 94107, USA",
      color: "text-purple-500",
      bg: "bg-purple-50"
    }
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden selection:bg-emerald-100 selection:text-emerald-900">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-60 pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 py-12 md:py-24 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">

          {/* Left Column: Content & Info */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="max-w-md">
              <span className="inline-block px-5 py-2 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-8">
                Get in Touch
              </span>
              <h1 className="text-6xl md:text-7xl font-black text-gray-900 tracking-tighter leading-[0.9] mb-8">
                Let's <span className="text-emerald-600">Connect</span>.
              </h1>
              <p className="text-xl text-gray-500 font-medium leading-relaxed mb-12">
                Have a question about a product or need technical assistance? Our team of specialists is ready to provide the insights you need.
              </p>

              <div className="space-y-8">
                {contactInfos.map((item, idx) => (
                  <div key={idx} className="flex items-start group">
                    <div className={`w-14 h-14 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                      <item.icon size={24} strokeWidth={2.5} />
                    </div>
                    <div className="ml-6">
                      <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">{item.title}</h4>
                      <p className="text-lg font-black text-gray-900 mb-0.5">{item.detail}</p>
                      <p className="text-sm font-medium text-gray-500">{item.subDetail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-12 mt-12 border-t border-gray-100">
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Social Ecosystem</h4>
                <div className="flex gap-4">
                  {[Instagram, Facebook, Twitter].map((Icon, i) => (
                    <a key={i} href="#" className="w-12 h-12 rounded-full border-2 border-gray-50 flex items-center justify-center text-gray-400 hover:border-black hover:text-black transition-all duration-300">
                      <Icon size={20} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form Card */}
          <div className="lg:col-span-7">
            <Card className="rounded-[3rem] border-none shadow-[0_50px_100px_-20px_rgba(0,0,0,0.06)] bg-white/80 backdrop-blur-xl border border-white p-2">
              <CardContent className="p-8 md:p-12 lg:p-16">
                {formSubmitted ? (
                  <div className="text-center py-24 animate-in fade-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-100">
                      <CheckCircle2 size={48} strokeWidth={1.5} />
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Message Relayed</h2>
                    <p className="text-lg text-gray-500 font-medium max-w-sm mx-auto mb-10 leading-relaxed">
                      Your inquiry has been successfully transmitted. Our team will review and respond shortly.
                    </p>
                    <button
                      onClick={() => setFormSubmitted(false)}
                      className="flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-emerald-900 transition-all mx-auto"
                    >
                      New Transmission <ArrowRight size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-12">
                      <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-3">Initialize Inquiry</h2>
                      <p className="text-gray-500 font-medium">Please fill out the form below to reach our dedicated specialists.</p>
                    </div>
                    <ContactForm onSubmit={handleSubmit} />
                  </>
                )}
              </CardContent>
            </Card>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
                <div className="flex items-center gap-3 text-emerald-600 mb-4">
                  <Clock size={20} strokeWidth={2.5} />
                  <span className="text-[11px] font-black uppercase tracking-[0.2em]">Operating Status</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-gray-900">Mon - Fri</span>
                    <span className="text-gray-500">09:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-gray-900">Sat</span>
                    <span className="text-gray-500">10:00 - 16:00</span>
                  </div>
                </div>
              </div>
              <div className="p-8 bg-black rounded-[2rem] text-white">
                <div className="mb-6 opacity-60">
                  <CheckCircle2 size={24} />
                </div>
                <p className="text-lg font-black leading-tight mb-2">Priority<br />Escalation</p>
                <p className="text-xs font-medium opacity-60">Standard response time {`<`} 4 hours</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
