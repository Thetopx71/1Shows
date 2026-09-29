'use client';

import { useState, useEffect } from 'react';
import {
  X,
  Send,
  CheckCircle2,
  Mail,
  User,
  MessageSquare,
  Tag,
  Loader2,
  AlertCircle,
} from 'lucide-react';

export default function ContactFormTrigger({
  defaultTopic = 'General Inquiry',
}: {
  defaultTopic?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState(defaultTopic);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mailtoFallback, setMailtoFallback] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    fetch('/api/contact')
      .then((r) => r.json())
      .then((data) => {
        if (data?.recipient) setRecipientEmail(data.recipient);
      })
      .catch(() => {});
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleOpen = () => {
    setTopic(defaultTopic);
    setIsSubmitted(false);
    setErrorMsg(null);
    setMailtoFallback(null);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          topic,
          message: message.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to send message.');
      }

      if (data?.recipient) {
        setRecipientEmail(data.recipient);
      }

      if (data?.mailtoUrl) {
        setMailtoFallback(data.mailtoUrl);
        if (!data.deliveredViaServer && typeof window !== 'undefined') {
          window.location.href = data.mailtoUrl;
        }
      }

      setIsSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="inline font-semibold text-[#00d8ff] hover:text-[#67e8f9] underline decoration-[#00d8ff]/60 hover:decoration-[#67e8f9] underline-offset-4 transition-colors cursor-pointer focus:outline-none"
      >
        contact form
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-modal-title"
        >
          <div
            className="relative w-full max-w-lg bg-[#12131a]/90 bg-gradient-to-br from-white/[0.16] to-white/[0.04] backdrop-blur-3xl backdrop-saturate-[1.9] border border-white/[0.24] rounded-3xl shadow-[0_24px_70px_rgba(0,0,0,0.65),inset_0_1px_1px_0_rgba(255,255,255,0.35)] overflow-hidden p-6 sm:p-8 text-left animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h3
                  id="contact-modal-title"
                  className="text-xl sm:text-2xl font-extrabold tracking-tight text-white"
                >
                  Contact Administrative Team
                </h3>
                <p className="text-xs sm:text-sm text-white/60 mt-1 flex flex-wrap items-center gap-1.5">
                  {recipientEmail ? (
                    <>
                      <span>Direct inquiry to</span>
                      <span className="text-[#00d8ff] font-semibold">{recipientEmail}</span>
                    </>
                  ) : (
                    <span>Fill out the form below and our team will get back to you promptly.</span>
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-white/[0.08] hover:bg-white/[0.16] border border-white/15 flex items-center justify-center text-white/70 hover:text-white transition active:scale-95 shrink-0 cursor-pointer"
                aria-label="Close contact form"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isSubmitted ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#00d8ff]/15 border border-[#00d8ff]/35 flex items-center justify-center mx-auto text-[#00d8ff]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-lg font-bold text-white">
                    {recipientEmail ? `Message Ready for ${recipientEmail}` : 'Message Sent'}
                  </h4>
                  <p className="text-sm text-white/65 max-w-sm mx-auto leading-relaxed">
                    {recipientEmail ? (
                      <>
                        Your inquiry has been routed to{' '}
                        <span className="text-white font-semibold">{recipientEmail}</span>. Our administrative team will respond as soon as possible.
                      </>
                    ) : (
                      'Thank you for contacting our administrative team. We will respond as soon as possible.'
                    )}
                  </p>
                </div>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
                  {mailtoFallback && (
                    <a
                      href={mailtoFallback}
                      className="ios-btn-glass px-5 py-2.5 text-sm cursor-pointer"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Open in Mail App</span>
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={handleClose}
                    className="ios-btn-primary px-8 py-2.5 text-sm cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-300">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                    Your Name
                  </label>
                  <div className="relative flex items-center">
                    <User className="w-4 h-4 text-white/40 absolute left-3.5 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.14] focus:border-[#00d8ff]/70 text-sm text-white placeholder:text-white/35 focus:outline-none transition"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-white/40 absolute left-3.5 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.14] focus:border-[#00d8ff]/70 text-sm text-white placeholder:text-white/35 focus:outline-none transition"
                    />
                  </div>
                </div>

                {/* Topic */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                    Subject
                  </label>
                  <div className="relative flex items-center">
                    <Tag className="w-4 h-4 text-white/40 absolute left-3.5 pointer-events-none" />
                    <select
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#181a24] border border-white/[0.14] focus:border-[#00d8ff]/70 text-sm text-white focus:outline-none transition cursor-pointer"
                    >
                      <option value="Privacy Policy Inquiry">Privacy Policy Inquiry</option>
                      <option value="Terms of Use Inquiry">Terms of Use Inquiry</option>
                      <option value="Copyright / DMCA">Copyright / DMCA</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Technical Support">Technical Support</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                    Message
                  </label>
                  <div className="relative">
                    <MessageSquare className="w-4 h-4 text-white/40 absolute left-3.5 top-3 pointer-events-none" />
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can our administrative team help you?"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.14] focus:border-[#00d8ff]/70 text-sm text-white placeholder:text-white/35 focus:outline-none transition resize-none"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="ios-btn-glass px-5 py-2.5 text-sm cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="ios-btn-primary px-6 py-2.5 text-sm cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
