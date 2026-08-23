import { motion } from "framer-motion";

const META_LOGO = `${import.meta.env.BASE_URL}images/meta-logo.svg`;

export default function TestimonialsSection() {
  return (
    <section
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{ background: "#1C1917" }}
    >
      <motion.div
        animate={{ scale: [1, 1.15, 1], rotate: [0, 15, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-72 h-72 blob-1 opacity-5 pointer-events-none"
        style={{ background: "#C4622D", transform: "translate(30%, -30%)" }}
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute bottom-0 left-0 w-48 h-48 blob-2 opacity-5 pointer-events-none"
        style={{ background: "#4A6741", transform: "translate(-30%, 30%)" }}
      />

      <div className="px-8 lg:px-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-12"
        >
          <div className="w-8 h-px" style={{ background: "#C4622D" }} />
          <span
            className="font-mono-dm text-xs tracking-[0.25em] uppercase"
            style={{ color: "#C4622D" }}
          >
            Kind Words
          </span>
        </motion.div>

        <div className="max-w-5xl">
          <div
            className="font-display text-8xl leading-none mb-6 select-none"
            style={{ color: "rgba(196,98,45,0.3)", fontWeight: 300 }}
          >
            &ldquo;
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p
              className="font-display text-xl lg:text-2xl leading-relaxed mb-6 font-light"
              style={{ color: "rgba(250,247,242,0.9)" }}
            >
              I worked with Elifsu on redesigning Character Pad, my Android app with over 1.6M installs on Google Play. She analyzed hundreds of user reviews, categorized every pain point by severity, and translated real user frustrations into clear actionable design decisions.
            </p>
            <p
              className="font-display text-xl lg:text-2xl leading-relaxed mb-10 font-light"
              style={{ color: "rgba(250,247,242,0.9)" }}
            >
              She didn't just make things look better; she solved problems users had been voicing for years. Her process was structured, communication was clear, and she delivered on time. I'm looking forward to implementing her design changes and bringing these improvements to the users. If I ever have another project, I would not hesitate to work with her again.
            </p>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "#C4622D" }}
                >
                  <span className="font-display text-white text-sm font-semibold">
                    HF
                  </span>
                </div>
                <div>
                  <div
                    className="font-medium text-sm"
                    style={{ color: "rgba(250,247,242,0.9)" }}
                  >
                    Hussein El Feky
                  </div>
                  <div className="flex items-center gap-2.5 mt-0.5">
                    <span
                      className="font-mono-dm text-xs tracking-wide"
                      style={{ color: "rgba(250,247,242,0.4)" }}
                    >
                      Character Pad App Owner (Senior Software Engineer, Meta)
                    </span>
                  </div>
                </div>
              </div>
              <img
                src={META_LOGO}
                alt="Meta"
                className="h-8 w-auto opacity-70"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
