import { motion } from "framer-motion";

export function CTASection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Ready to connect?
        </motion.h2>
        <motion.p
          className="text-gray-600 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Join investors, entrepreneurs, and service providers building the future of African investment.
        </motion.p>
        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <a
            href="/choose-role"
            className="inline-flex items-center px-8 py-4 rounded-xl font-semibold bg-amber-500 text-gray-900 hover:bg-amber-400 transition shadow-lg"
          >
            Get Started
          </a>
          <a
            href="#how-it-works"
            className="inline-flex items-center px-8 py-4 rounded-xl font-semibold border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-100 transition"
          >
            Learn More
          </a>
        </motion.div>
      </div>
    </section>
  );
}
