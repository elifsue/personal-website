/* ============================================================
   CONTACT SECTION + FOOTER — Organic Modernism
   Large statement text, minimal contact form, warm charcoal footer
   Web3Forms integration: submissions sent to elifsuates1516@gmail.com
   ============================================================ */

import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

const WEB3FORMS_ACCESS_KEY = "4b3fbd67-93eb-493f-a75e-b3af0110029c";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all fields.");
      return;
    }
    setSending(true);
    try {
      const payload = {
        access_key: WEB3FORMS_ACCESS_KEY,
        // Recipient is tied to the access key on Web3Forms dashboard,
        // but we also pass it explicitly for clarity.
        email: "elifsuates1516@gmail.com",
        name: form.name,
        from_email: form.email,
        message: form.message,
        subject: `Portfolio enquiry from ${form.name}`,
        // Honeypot field left empty to reduce spam
        botcheck: "",
      };

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setForm({ name: "", email: "", message: "" });
        toast.success("Message sent! I'll get back to you soon.");
      } else {
        toast.error(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <section
        id="contact"
        className="relative py-24 lg:py-32 overflow-hidden"
        style={{ background: "#F5F0EA" }}
      >
        {/* Decorative blob */}
        <motion.div
          animate={{ scale: [1, 1.08, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-80 h-80 blob-1 opacity-10 pointer-events-none"
          style={{ background: "#C4622D", transform: "translate(30%, -30%)" }}
        />
        <motion.div
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-0 left-0 w-56 h-56 blob-3 opacity-10 pointer-events-none"
          style={{ background: "#4A6741", transform: "translate(-30%, 30%)" }}
        />

        <div className="pl-8 lg:pl-32 pr-8 lg:pr-16">
          {/* Section header */}
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="w-8 h-px" style={{ background: "#C4622D" }} />
              <span
                className="font-mono-dm text-xs tracking-[0.25em] uppercase"
                style={{ color: "#C4622D" }}
              >
                Get In Touch
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display leading-tight"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#1C1917", fontWeight: 300 }}
            >
              Let's build something
              <br />
              <em style={{ color: "#C4622D" }}>remarkable together</em>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Left: Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-base leading-relaxed mb-10" style={{ color: "#6B6560" }}>
                I'm currently open to new opportunities — whether it's a full-time role,
                a freelance project, or a creative collaboration. If you have a project
                in mind or just want to say hello, my inbox is always open.
              </p>

              <div className="flex flex-col gap-6">
                {[
                  {
                    label: "Email",
                    value: "elifsuates1516@gmail.com",
                    href: "mailto:elifsuates1516@gmail.com",
                    icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    ),
                  },
                  {
                    label: "LinkedIn",
                    value: "linkedin.com/in/elifsu-ates",
                    href: "https://www.linkedin.com/in/elifsu-ates/",
                    icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                        <rect x="2" y="9" width="4" height="12"/>
                        <circle cx="4" cy="4" r="2"/>
                      </svg>
                    ),
                  },
                  {
                    label: "Dribbble",
                    value: "dribbble.com/elifsuates",
                    href: "https://dribbble.com",
                    icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94"/>
                        <path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32"/>
                        <path d="M8.56 2.75c4.37 6 6 9.42 8 17.72"/>
                      </svg>
                    ),
                  },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 group w-fit"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                      style={{ background: "#E8DDD0", color: "#C4622D" }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <div className="font-mono-dm text-xs tracking-wider uppercase mb-0.5 transition-colors duration-200 text-[#6B6560] group-hover:text-[#C4622D]">
                        {item.label}
                      </div>
                      <div className="text-sm font-medium transition-colors duration-200 text-[#1C1917] group-hover:text-[#C4622D]">
                        {item.value}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Right: Form */}
            <motion.form
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-5"
            >
              {/* Honeypot — hidden from real users, traps bots */}
              <input type="checkbox" name="botcheck" className="hidden" style={{ display: "none" }} />

              {[
                { id: "name", label: "Your Name", type: "text", placeholder: "Jane Smith" },
                { id: "email", label: "Email Address", type: "email", placeholder: "jane@example.com" },
              ].map((field) => (
                <div key={field.id}>
                  <label
                    htmlFor={field.id}
                    className="block font-mono-dm text-xs tracking-wider uppercase mb-2"
                    style={{ color: "#6B6560" }}
                  >
                    {field.label}
                  </label>
                  <input
                    id={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.id as "name" | "email"]}
                    onChange={(e) => setForm({ ...form, [field.id]: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 focus:ring-2"
                    style={{
                      background: "#FAF7F2",
                      border: "1px solid rgba(196,98,45,0.2)",
                      color: "#1C1917",
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = "#C4622D")}
                    onBlur={e => (e.currentTarget.style.borderColor = "rgba(196,98,45,0.2)")}
                  />
                </div>
              ))}

              <div>
                <label
                  htmlFor="message"
                  className="block font-mono-dm text-xs tracking-wider uppercase mb-2"
                  style={{ color: "#6B6560" }}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="Tell me about your project..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 resize-none"
                  style={{
                    background: "#FAF7F2",
                    border: "1px solid rgba(196,98,45,0.2)",
                    color: "#1C1917",
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = "#C4622D")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(196,98,45,0.2)")}
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="group relative overflow-hidden px-8 py-4 rounded-full font-medium text-sm tracking-wide transition-all duration-300 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: "#C4622D", color: "#FAF7F2" }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {sending ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 2L11 13" /><path d="M22 2L15 22 11 13 2 9l20-7z" />
                      </svg>
                    </>
                  )}
                </span>
                <div
                  className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                  style={{ background: "#1C1917" }}
                />
              </button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-8 pl-8 lg:pl-32 pr-8 lg:pr-16 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ background: "#1C1917", borderTop: "1px solid rgba(250,247,242,0.08)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: "#C4622D" }}
          >
            <span className="font-display text-white font-semibold text-xs">EA</span>
          </div>
          <span className="font-display text-base font-light" style={{ color: "rgba(250,247,242,0.7)" }}>
            Elifsu Ateş
          </span>
        </div>
        <p className="font-mono-dm text-xs tracking-wider" style={{ color: "rgba(250,247,242,0.4)" }}>
          © {new Date().getFullYear()} · Designed & built with care
        </p>
        <div className="flex items-center gap-1 font-mono-dm text-xs" style={{ color: "rgba(250,247,242,0.4)" }}>
          <span>BSc Computer Science</span>
          <span style={{ color: "#C4622D" }}>·</span>
          <span>University of Greenwich</span>
        </div>
      </footer>
    </>
  );
}
