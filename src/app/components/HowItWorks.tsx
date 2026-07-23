interface Step {
  step: string;
  title: string;
  desc: string;
}

interface HowItWorksProps {
  heading: string;
  steps: Step[];
  primaryColor: string;
  accentColor: string;
}

export default function HowItWorks({
  heading,
  steps,
  primaryColor,
  accentColor,
}: HowItWorksProps) {
  return (
    <section className="py-20 px-4 sm:px-6" style={{ backgroundColor: primaryColor }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: accentColor }}>
            <span className="w-6 h-0.5" style={{ backgroundColor: accentColor }} />
            <span>How We Work</span>
          </div>
          <h2 className="font-serif-display text-4xl sm:text-5xl text-white">
            {heading}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl flex flex-col items-center text-center"
              style={{
                backgroundColor: `${accentColor}15`,
                border: `1px solid ${accentColor}30`,
              }}
            >
              <div
                className="w-12 h-12 rounded-full font-bold text-lg flex items-center justify-center mb-4 shadow-md"
                style={{ backgroundColor: accentColor, color: primaryColor }}
              >
                {s.step}
              </div>
              <h3 className="font-serif-display text-2xl text-white mb-2">{s.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
