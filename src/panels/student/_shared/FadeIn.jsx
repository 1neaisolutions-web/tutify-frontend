/**
 * Lightweight mount-transition wrapper. No animation library is installed in this
 * app — this uses Tailwind's `animate-fade-in-up` keyframe (tailwind.config.js) so every
 * student module gets the same subtle "arrive" motion without adding a dependency.
 */
const FadeIn = ({ children, delayMs = 0, className = '' }) => {
  return (
    <div
      className={`animate-fade-in-up ${className}`}
      style={delayMs ? { animationDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
};

export default FadeIn;
