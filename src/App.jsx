import { useState, useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { 
  Menu, 
  X, 
  ChevronDown, 
  Search, 
  Bell, 
  ArrowRight, 
  Zap, 
  Lock, 
  MessageCircle,
  Calendar,
  HelpCircle,
  ChevronRight,
  TrendingUp,
  ShoppingBag,
  Settings,
  DollarSign,
  Sparkles,
  Mic,
  Link
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ButtonWithIcon from '@/components/ui/button-with-icon'

// Navigation items from print
const navItems = [
  { label: 'Produtos', hasDropdown: true },
  { label: 'Soluções', hasDropdown: true },
  { label: 'Recursos', hasDropdown: true },
  { label: 'Blog', hasDropdown: false },
  { label: 'Preços', hasDropdown: false },
]

// Easing curve from design specs
const easeTransition = [0.22, 0.61, 0.36, 1]

// ─── Entrance Animation Variants ─────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } }
}
const fadeUpSlow = {
  hidden: { opacity: 0, y: 36 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
}
const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.12, delayChildren: 0.05 } }
}
const staggerFast = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08, delayChildren: 0.0 } }
}
const vp = { once: true, amount: 0.15, margin: '-40px' }


// ─── Custom Footer Components & Hooks ────────────────────────────────────────

// Custom hook to trigger animations when elements intersect viewport
function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        if (options.triggerOnce) {
          observer.unobserve(entry.target);
        }
      } else if (!options.triggerOnce) {
        setIsIntersecting(false);
      }
    }, { threshold: 0.1, ...options });

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options]);

  return [ref, isIntersecting];
}

// Animates text word-by-word (used across all sections & footer)
function AnimatedText({ text, className, as: Component = "p", delay = 0, children }) {
  const [ref, isVisible] = useIntersectionObserver({ triggerOnce: true });
  const textContent = text || children;

  if (typeof textContent !== "string") {
    return (
      <Component 
        ref={ref} 
        className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        } ${className || ""}`}
      >
        {children}
      </Component>
    );
  }

  const words = textContent.split(" ");

  return (
    <Component ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em] align-top">
          <span 
            className={`inline-block transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: `${delay + i * 40}ms` }}
          >
            {word}
          </span>
        </span>
      ))}
    </Component>
  );
}


// Animates cards, badges and notifications smoothly when scrolled into view
function AnimatedElement({ children, className = "", delay = 0, yOffset = 24 }) {
  const [ref, isVisible] = useIntersectionObserver({ triggerOnce: true });
  return (
    <div 
      ref={ref}
      className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${className}`}
      style={{ 
        transitionDelay: `${delay}ms`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) scale(1)' : `translateY(${yOffset}px) scale(0.96)`,
      }}
    >
      {children}
    </div>
  );
}

// Animates an array of links staggeredly
function AnimatedList({ items, className }) {
  const [ref, isVisible] = useIntersectionObserver({ triggerOnce: true });
  
  return (
    <ul ref={ref} className={className}>
      {items.map((item, i) => (
        <li key={i} className="overflow-hidden py-1">
          <a 
            href={item.href || "#"} 
            className={`inline-block text-[#a1a1aa] hover:text-white transition-all duration-700 ease-out will-change-transform text-[1.05rem] ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: `${i * 50}ms` }}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

// Custom Social Icon Components
const InstagramIcon = () => (
  <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const XIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

// Animates the massive title letter-by-letter
function MassiveText({ text }) {
  const [ref, isVisible] = useIntersectionObserver({ triggerOnce: true });
  const letters = text.split("");
  
  return (
    <div ref={ref} className="w-full flex justify-center overflow-hidden -ml-[1vw] pb-[10vw] -mb-[8vw] md:pb-[6vw] md:-mb-[4vw]">
      <h1 className="text-[32vw] sm:text-[30vw] md:text-[28vw] lg:text-[27.5vw] leading-[0.85] tracking-[-0.04em] font-medium select-none whitespace-nowrap">
        {letters.map((char, i) => (
          <span key={i} className="inline-block overflow-hidden">
            <span 
              className={`inline-block transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform bg-gradient-to-b from-[#3F6DF7] via-[#3F6DF7]/25 to-transparent bg-clip-text text-transparent ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-32 opacity-0"
              }`}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              {char}
            </span>
          </span>
        ))}
      </h1>
    </div>
  );
}

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('Hoje')
  const [chatStep, setChatStep] = useState(0)
  const [openFaqIndex, setOpenFaqIndex] = useState(null)
  
  const [liveBalance, setLiveBalance] = useState(8100)
  const [isNotificationActive, setIsNotificationActive] = useState(true)
  const [saleNotification, setSaleNotification] = useState({ amount: 197 })
  const [sparklineDraw, setSparklineDraw] = useState(1)
  const [copied, setCopied] = useState(false)

  // Simulation states for solutions cards
  const [checkoutTab, setCheckoutTab] = useState("card")
  const [withdrawStep, setWithdrawStep] = useState(0) // 0 = idle, 1 = loading, 2 = success
  const [withdrawBalance, setWithdrawBalance] = useState(14850.20)

  useEffect(() => {
    const timer = setInterval(() => {
      setChatStep((prev) => {
        if (prev >= 4) return 0;
        return prev + 1;
      });
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // Step 1: Hide notification and smoothly erase sparkline path
      setIsNotificationActive(false);
      setSparklineDraw(0);
      
      // Step 2: After erasure and slide-out complete, update value and draw it back
      setTimeout(() => {
        const amounts = [97, 197, 297, 147, 380, 497];
        const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];
        
        setSaleNotification({ amount: randomAmount });
        setLiveBalance(prev => prev + randomAmount);
        
        // Draw the path back and trigger notification drop down
        setSparklineDraw(1);
        setIsNotificationActive(true);
      }, 700); 
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Loop for Column 2: Checkout Tab Selection Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setCheckoutTab(prev => prev === "card" ? "pix" : "card");
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  // Loop for Column 3: Payout Simulation
  useEffect(() => {
    let timer1, timer2, timer3;
    let balanceInterval;
    
    const runSimulation = () => {
      // Start loading spinner
      setWithdrawStep(1);
      
      // Complete payout after 1.4s
      timer1 = setTimeout(() => {
        setWithdrawStep(2);
        // Count balance down to 0 smoothly
        let current = 14850.20;
        const steps = 25;
        const decrement = current / steps;
        let stepCount = 0;
        
        balanceInterval = setInterval(() => {
          current = Math.max(0, current - decrement);
          setWithdrawBalance(current);
          stepCount++;
          if (stepCount >= steps) {
            clearInterval(balanceInterval);
          }
        }, 30);
        
      }, 1400);
      
      // Reset back to idle after 5s of success state
      timer2 = setTimeout(() => {
        setWithdrawStep(0);
        setWithdrawBalance(14850.20);
      }, 6400);
    };
    
    // Start initial simulation loop after 2 seconds
    timer3 = setTimeout(() => {
      runSimulation();
      // Run the entire payout simulation loop every 8.5 seconds
      const masterInterval = setInterval(runSimulation, 8500);
      return () => {
        clearInterval(masterInterval);
      };
    }, 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      if (balanceInterval) clearInterval(balanceInterval);
    };
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      {/* Mobile Block Screen (Displays dash mobile.png on mobile viewports < 768px) */}
      <div className="fixed inset-0 z-[9999] bg-[#09090B] flex items-center justify-center md:hidden p-6 overflow-hidden">
        <img 
          src="/dash mobile.png" 
          alt="Asset Mobile Dashboard" 
          className="w-full max-w-[380px] max-h-[90vh] object-contain drop-shadow-2xl pointer-events-none select-none" 
        />
      </div>

      <div className="min-h-screen w-full bg-hatching hidden md:flex flex-col items-center justify-start selection:bg-[#3F6DF7]/30 selection:text-white relative">
      
      {/* Row 1: Header Wrapper (Left/Right margins show hatching, horizontal line crosses full-width) */}
      <div className="w-full flex items-stretch shrink-0 z-50">
        {/* Left hatched margin with rounded bottom-right junction */}
        <div className="flex-1 bg-hatching rounded-br-[12px] border-b border-r border-[#24242A]" />
        
        {/* Centered Header with rounded bottom corners */}
        <header className="w-full max-w-[1280px] bg-[#09090B] border-l border-r border-b border-[#24242A] rounded-b-[12px] px-6 md:px-[52px] py-10 flex items-center justify-between relative z-50">
          {/* Logo (Asset Pay) */}
          <div className="flex items-center select-none">
            <img src="/logo asset.png" alt="Asset Pay" className="h-7 w-auto object-contain" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-[30px]">
            {navItems.map((item) => (
              <div key={item.label} className="relative group cursor-pointer">
                <button className="text-[#F5F5F7] hover:text-[#3F6DF7] text-[15px] font-medium flex items-center gap-1.5 transition-colors duration-250 ease-premium">
                  {item.label}
                  {item.hasDropdown && (
                    <ChevronDown className="w-3.5 h-3.5 stroke-[2px] transition-transform duration-250 group-hover:rotate-180" />
                  )}
                </button>
              </div>
            ))}
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden lg:block">
            <button className="h-[42px] px-6 bg-[#3F6DF7] text-[#F5F5F7] hover:bg-[#5C84FF] active:scale-95 text-[14px] font-semibold rounded-full flex items-center gap-2 transition-all duration-250 ease-premium cursor-pointer border-none outline-none btn-shine">
              <span>Acessar Plataforma</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5px]" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-[#F5F5F7] focus:outline-none z-50 cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>

          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: easeTransition }}
              className="absolute top-full left-0 w-full bg-[#111114] border-b border-[#24242A] py-8 px-6 flex flex-col gap-6 lg:hidden"
            >
              {navItems.map((item) => (
                <a 
                  key={item.label} 
                  href="#" 
                  className="text-[#F5F5F7] hover:text-[#3F6DF7] text-[20px] font-medium flex items-center justify-between"
                >
                  {item.label}
                  {item.hasDropdown && <ChevronDown className="w-4 h-4" />}
                </a>
              ))}
              <button className="h-[52px] w-full bg-[#3F6DF7] text-[#F5F5F7] text-[16px] font-semibold rounded-full flex items-center justify-center gap-2 mt-4 btn-shine">
                <span>Acessar Plataforma</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* Intersection background SVGs to render the perfect 4-pointed star-shaped gaps in grey */}
          <svg width="24" height="24" viewBox="-12 -12 24 24" className="absolute left-[-12px] bottom-[-12px] pointer-events-none z-50 hidden lg:block">
            <path d="M 0 -12 A 13.5 13.5 0 0 1 -12 0 A 13.5 13.5 0 0 1 0 12 A 13.5 13.5 0 0 1 12 0 A 13.5 13.5 0 0 1 0 -12 Z" fill="#24242A" />
          </svg>
          <svg width="24" height="24" viewBox="-12 -12 24 24" className="absolute right-[-12px] bottom-[-12px] pointer-events-none z-50 hidden lg:block">
            <path d="M 0 -12 A 13.5 13.5 0 0 1 -12 0 A 13.5 13.5 0 0 1 0 12 A 13.5 13.5 0 0 1 0 -12 Z" fill="#24242A" />
          </svg>
        </header>

        {/* Right hatched margin with rounded bottom-left junction */}
        <div className="flex-1 bg-hatching rounded-bl-[12px] border-b border-l border-[#24242A]" />
      </div>

      {/* Row 2: Main Content Wrapper (Left/Right margins show solid dark, main container has rounded top corners) */}
      <div className="w-full flex items-stretch flex-1 z-10">
        {/* Left solid dark margin with rounded top-right junction */}
        <div className="flex-1 bg-[#09090B] rounded-tr-[12px] border-b border-r border-[#24242A]" />

        {/* Centered Canvas Content (Max width 1280px) */}
        <div className="w-full max-w-[1280px] bg-[#09090B] border-l border-r border-b border-[#24242A] rounded-t-[12px] text-[#F5F5F7] font-sans relative overflow-hidden flex flex-col z-10">
          
          {/* Background is clean dark slate, light glows are positioned exclusively behind mockups */}
          
          {/* Main Content Area (Shrinked bottom padding to bring bottom border closer) */}
          <main className="flex-1 w-full px-6 md:px-[52px] pt-10 md:pt-20 pb-0 md:pb-0 relative z-10 flex flex-col lg:flex-row gap-12 lg:gap-6 items-start">
          {/* Left Column (Hero & Copy) */}
          <div className="w-full lg:w-1/2 flex flex-col items-start text-left select-none relative z-10 pt-[56px] lg:pl-8">
            
            {/* Trust Badge (Height 36px, Pill, Border radius 999px) */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: easeTransition }}
              className="h-[36px] px-3.5 bg-[#111114] border border-[#24242A] rounded-full flex items-center gap-2 mb-[20px] shadow-[0_0_0_1px_rgba(255,255,255,.04)] hover:border-[#3F6DF7]/50 transition-colors cursor-default"
            >
              {/* Overlapping Brand Avatars */}
              <div className="flex -space-x-1.5 items-center mr-0.5">
                {/* Amazon */}
                <div className="w-5 h-5 rounded-full bg-[#FFFFFF] flex items-center justify-center shrink-0 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.2)] overflow-hidden p-0.5">
                  <img 
                    src="https://img.icons8.com/color/48/amazon.png" 
                    alt="Amazon" 
                    className="w-full h-full object-contain"
                  />
                </div>
                {/* Shopify */}
                <div className="w-5 h-5 rounded-full bg-[#FFFFFF] flex items-center justify-center shrink-0 z-20 shadow-[0_1px_3px_rgba(0,0,0,0.2)] overflow-hidden p-0.5">
                  <img 
                    src="https://img.icons8.com/color/48/shopify.png" 
                    alt="Shopify" 
                    className="w-full h-full object-contain"
                  />
                </div>
                {/* Stripe */}
                <div className="w-5 h-5 rounded-full bg-[#635BFF] flex items-center justify-center shrink-0 z-10 shadow-[0_1px_3px_rgba(0,0,0,0.2)] overflow-hidden p-0.5">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/4/4b/Stripe_Logo%2C_revised_2016.svg" 
                    alt="Stripe" 
                    className="w-4 h-auto object-contain brightness-0 invert" 
                  />
                </div>
              </div>
              <p className="text-[11.5px] font-medium text-[#F5F5F7] tracking-tight">
                <span className="text-[#3F6DF7] font-semibold">+500</span> empresas já confiam na Asset
              </p>
            </motion.div>

            {/* Hero Typography (48px, Line Height 90%, Letter Spacing -0.04em) */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeTransition, delay: 0.1 }}
              className="font-hero text-left w-full select-text"
            >
              <span className="text-[#F5F5F7] block">Gateway de Pagamento</span>
              <span className="text-shine block mt-1 pb-1.5">
                completo para lojas virtuais.
              </span>
            </motion.h1>

            {/* Subtitle Description (18px, Weight 400, Line Height 150%, Margin Top 43px) */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeTransition, delay: 0.2 }}
              className="font-subtitle mt-[43px] text-left max-w-[480px] select-text"
            >
              Performance, estabilidade e aprovação em um só lugar.
              <br />
              Antifraude inteligente e alta conversão.
            </motion.p>

            {/* CTA Button Row (Margin Top 46px) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeTransition, delay: 0.3 }}
              className="mt-[46px] flex flex-col sm:flex-row items-stretch sm:items-center gap-6 w-full sm:w-auto"
            >
              <ButtonWithIcon className="!h-[48px] w-full sm:w-auto text-[14px] btn-shine">
                Criar conta grátis
              </ButtonWithIcon>
              
              <a 
                href="#" 
                className="text-[14px] font-semibold text-[#3F6DF7] hover:text-[#5C84FF] transition-all duration-250 ease-premium hover:translate-x-1 flex items-center justify-center sm:justify-start gap-1 py-2"
              >
                Nosso manifesto
              </a>
            </motion.div>

            {/* Features Row (Margin Top 58px) */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: easeTransition, delay: 0.4 }}
              className="mt-[58px] grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-[520px]"
            >
              {/* Feature 1: Rápido */}
              <AnimatedElement delay={100} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#1A1A1F] flex items-center justify-center shrink-0">
                  <Zap className="w-4.5 h-4.5 text-[#3F6DF7] stroke-[2px]" />
                </div>
                <div className="flex flex-col leading-[1.35] text-left">
                  <span className="text-[#F5F5F7] font-bold text-[13.5px]">Rápido</span>
                  <span className="text-[#F5F5F7] text-[11px]">Integre em minutos, não dias.</span>
                </div>
              </AnimatedElement>

              {/* Feature 2: Seguro */}
              <AnimatedElement delay={250} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#1A1A1F] flex items-center justify-center shrink-0">
                  <Lock className="w-4.5 h-4.5 text-[#3F6DF7] stroke-[2px]" />
                </div>
                <div className="flex flex-col leading-[1.35] text-left">
                  <span className="text-[#F5F5F7] font-bold text-[13.5px]">Seguro</span>
                  <span className="text-[#F5F5F7] text-[11px]">Criptografia de ponta</span>
                </div>
              </AnimatedElement>
            </motion.div>

          </div>

              {/* Right Column (Interactive Mockups Layout - Perfectly Vertical & Super Minimalist) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeTransition, delay: 0.35 }}
            className="w-full lg:w-1/2 flex items-center justify-center relative min-h-[550px] md:min-h-[650px] lg:min-h-[700px] select-none lg:-translate-y-12"
          >
            
            {/* Vibrant atmospheric glows behind mockups (Top-right and Bottom-right matching print positions in blue) */}
            <div className="absolute top-[-20%] right-[-50%] w-[450px] h-[400px] bg-[#3F6DF7] opacity-[0.52] blur-[110px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-15%] right-[20%] w-[580px] h-[500px] bg-[#2E58F2] opacity-[0.55] blur-[120px] rounded-full pointer-events-none" />

            <div className="absolute lg:top-[0px] lg:right-[-52px] lg:h-[85%] lg:w-[calc(91%+52px)] top-[4%] bottom-0 right-[0px] w-[88%] h-[96%] bg-[#09090B] rounded-[20px] lg:rounded-l-[20px] lg:rounded-r-none border border-[#24242A] shadow-[0_25px_60px_rgba(0,0,0,0.6),_0_0_0_1px_rgba(255,255,255,.04)] overflow-hidden flex flex-col z-0">
              
              {/* Header Bar (Full width, dividing line) */}
              <div className="h-[44px] bg-[#111114] border-b border-[#24242A] flex items-center justify-between px-4 shrink-0 select-none">
                {/* Left side header (Sidebar section) */}
                <div className="w-[22%] flex items-center justify-between pr-4 border-r border-[#24242A] h-full">
                  {/* Logo Symbol */}
                  <svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 4L28 16H20L16 12L12 16H4L16 4Z" fill="#F5F5F7" />
                    <path d="M16 14L28 26H20L16 22L12 26H4L16 14Z" fill="#3F6DF7" />
                  </svg>
                  {/* Hamburger menu */}
                  <Menu className="w-3.5 h-3.5 text-[#F5F5F7]" />
                </div>
                
                {/* Right side header (Main panel section) */}
                <div className="flex-1 flex items-center pl-4">
                  <div className="flex items-center gap-1.5 font-semibold text-[#F5F5F7] text-[11px]">
                    {/* Three vertical bars icon */}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[#F5F5F7]">
                      <line x1="18" y1="20" x2="18" y2="10" />
                      <line x1="12" y1="20" x2="12" y2="4" />
                      <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                    <span>Dashboard</span>
                  </div>
                </div>
              </div>

              {/* Content Body (Split vertically below header) */}
              <div className="flex-1 flex overflow-hidden">
                {/* Sidebar below header */}
                <div className="w-[22%] border-r border-[#24242A] bg-[#111114] p-3 flex flex-col gap-4 shrink-0">
                  {/* Search Bar with ⌘F */}
                  <div className="flex items-center gap-2 bg-[#09090B] border border-[#24242A] rounded-[28px] px-2.5 py-1.5 w-full text-[9px] select-none">
                    <Search className="w-3 h-3 text-[#F5F5F7] shrink-0" />
                    <span className="text-[#F5F5F7] truncate">Pesquisar</span>
                    <span className="ml-auto text-[7px] bg-[#111114] border border-[#24242A] px-1 py-0.5 rounded text-[#F5F5F7] shrink-0">⌘F</span>
                  </div>
                </div>

                {/* Main Panel */}
                <div className="flex-1 p-4 flex flex-col gap-3 overflow-hidden bg-[#09090B] text-[10px] text-[#F5F5F7] select-none">
                  {/* Balance Display */}
                  <div className="flex flex-col shrink-0">
                    <span className="text-[#F5F5F7] text-[9px]">Total em vendas</span>
                    <span className="font-bold text-[#F5F5F7] text-[16px] tracking-tight mt-0.5">R$ 8.283,35</span>
                  </div>

                  {/* Filters Row */}
                  <div className="flex items-center gap-1.5 shrink-0 text-[7px] md:text-[8px]">
                    <span className="bg-[#3F6DF7] text-white px-3 py-1 rounded-full font-medium shadow-sm border border-[#3F6DF7]">Hoje</span>
                    <span className="text-[#F5F5F7] hover:text-[#F5F5F7] px-3 py-1 transition-colors cursor-pointer font-medium">Ontem</span>
                    <span className="text-[#F5F5F7] hover:text-[#F5F5F7] px-3 py-1 transition-colors cursor-pointer font-medium font-sans">Essa Semana</span>
                    <span className="text-[#F5F5F7] hover:text-[#F5F5F7] px-3 py-1 transition-colors cursor-pointer font-medium">Esse mês</span>
                    <span className="bg-[#111114] border border-[#24242A] text-[#F5F5F7] hover:text-[#F5F5F7] px-3 py-1.5 rounded-full ml-auto flex items-center gap-1.5 cursor-pointer transition-colors">
                      <Calendar className="w-3 h-3 text-[#F5F5F7]" />
                      <span>Escolher data</span>
                    </span>
                  </div>

                  {/* Desempenho de vendas Graph Container */}
                  <div className="bg-[#111114] border border-[#24242A] rounded-[16px] p-4 flex flex-col gap-2 flex-1 justify-between shadow-[0_0_0_1px_rgba(255,255,255,.02)]">
                    <div className="flex items-center gap-1.5">
                      {/* Speedometer/Chart Icon */}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[#F5F5F7]">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
                        <path d="M12 12L16 8" />
                      </svg>
                      <span className="font-semibold text-[#F5F5F7] text-[9px] uppercase tracking-wider">Desempenho de vendas</span>
                    </div>
                    
                    {/* SVG Chart with Gridlines & Axes */}
                    <div className="flex-1 w-full flex items-stretch gap-3 mt-2">
                      {/* Y-Axis Labels */}
                      <div className="flex flex-col justify-between text-[8px] text-[#F5F5F7] h-[80%] select-none pr-1">
                        <span>500</span>
                        <span>375</span>
                        <span>250</span>
                        <span>125</span>
                        <span>0</span>
                      </div>
                      {/* Chart Area */}
                      <div className="flex-1 flex flex-col justify-between relative">
                        <div className="flex-1 w-full relative">
                          {/* Grid Lines */}
                          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                            <div className="border-b border-dashed border-[#24242A] w-full h-0" />
                            <div className="border-b border-dashed border-[#24242A] w-full h-0" />
                            <div className="border-b border-dashed border-[#24242A] w-full h-0" />
                            <div className="border-b border-dashed border-[#24242A] w-full h-0" />
                          </div>
                          {/* SVG Curve */}
                          <svg className="w-full h-full" viewBox="0 0 300 80" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="glow-desktop" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3F6DF7" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#3F6DF7" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            <path d="M0,62 C20,62 30,70 42.8,70 C55,70 75,60 85.7,60 C96,60 118,68 128.5,68 C139,68 160,52.5 171.4,52.5 C182,52.5 204,55 214.2,55 C224,55 246,43.75 257.1,43.75 C268,43.75 288,35 300,35" fill="none" stroke="#3F6DF7" strokeWidth="2.5" />
                            <path d="M0,62 C20,62 30,70 42.8,70 C55,70 75,60 85.7,60 C96,60 118,68 128.5,68 C139,68 160,52.5 171.4,52.5 C182,52.5 204,55 214.2,55 C224,55 246,43.75 257.1,43.75 C268,43.75 288,35 300,35 L300,80 L0,80 Z" fill="url(#glow-desktop)" />
                            
                            {/* Desktop Chart Dots */}
                            <circle cx="0" cy="62" r="3.5" fill="#3F6DF7" stroke="#09090B" strokeWidth="1" />
                            <circle cx="42.8" cy="70" r="3.5" fill="#3F6DF7" stroke="#09090B" strokeWidth="1" />
                            <circle cx="85.7" cy="60" r="3.5" fill="#3F6DF7" stroke="#09090B" strokeWidth="1" />
                            <circle cx="128.5" cy="68" r="3.5" fill="#3F6DF7" stroke="#09090B" strokeWidth="1" />
                            <circle cx="171.4" cy="52.5" r="3.5" fill="#3F6DF7" stroke="#09090B" strokeWidth="1" />
                            <circle cx="214.2" cy="55" r="3.5" fill="#3F6DF7" stroke="#09090B" strokeWidth="1" />
                            <circle cx="257.1" cy="43.75" r="3.5" fill="#3F6DF7" stroke="#09090B" strokeWidth="1" />
                            <circle cx="300" cy="35" r="3.5" fill="#3F6DF7" stroke="#09090B" strokeWidth="1" />
                          </svg>
                        </div>
                        {/* X-Axis Labels */}
                        <div className="flex justify-between text-[8px] text-[#F5F5F7] pt-1">
                          <span>00:00</span>
                          <span>02:00</span>
                          <span>04:00</span>
                          <span>06:00</span>
                          <span>08:00</span>
                          <span>10:00</span>
                          <span>12:00</span>
                          <span>14:00</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Metric Cards Row (Single card divided vertically) */}
                  <div className="bg-[#111114] border border-[#24242A] rounded-[16px] p-3 grid grid-cols-2 gap-3 shrink-0 shadow-[0_0_0_1px_rgba(255,255,255,.01)]">
                    {/* Left Column: Pedidos feitos */}
                    <div className="flex items-center justify-between pr-3 border-r border-[#24242A]">
                      <div className="flex flex-col text-left">
                        <span className="text-[9px] text-[#F5F5F7] font-semibold">Pedidos feitos</span>
                        <span className="text-[7.5px] text-[#F5F5F7]">Todos</span>
                        <span className="font-bold text-[#F5F5F7] text-[14px] mt-0.5">652</span>
                      </div>
                      <span className="text-[8px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                        <span>+12</span>
                        <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="stroke-emerald-400">
                          <polyline points="18 15 12 9 6 15" />
                        </svg>
                      </span>
                    </div>

                    {/* Right Column: Pedidos pagos */}
                    <div className="flex items-center justify-between pl-3">
                      <div className="flex flex-col text-left">
                        <span className="text-[9px] text-[#F5F5F7] font-semibold">Pedidos pagos</span>
                        <span className="text-[7.5px] text-[#F5F5F7]">Todos</span>
                        <span className="font-bold text-[#F5F5F7] text-[14px] mt-0.5">231</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* 2. Phone Mockup (In the foreground, perfectly straight, centered-left overlay, bottom-aligned on desktop) */}
            <div className="absolute lg:bottom-[15%] left-[-5%] bottom-[0px] w-[40%] max-w-[240px] aspect-[9/19] bg-[#111114] rounded-[36px] shadow-[0_25px_65px_rgba(0,0,0,0.85)] p-[6px] flex flex-col z-10">
              {/* Phone Screen Inner */}
              <div className="w-full h-full bg-[#09090B] rounded-[30px] overflow-hidden flex flex-col justify-between p-3 select-none">
                
                {/* Dynamic Island Notch (Super Minimalist Pill) */}
                <div className="w-[68px] h-[14px] bg-[#111114] rounded-full mx-auto mb-2 relative flex items-center justify-center shrink-0">
                  <div className="absolute right-3.5 w-1 h-1 bg-[#1a1a2e] rounded-full opacity-60" />
                </div>

                {/* Status Bar / Navbar */}
                <div className="flex items-center justify-between px-2 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <Menu className="w-3.5 h-3.5 text-[#F5F5F7] stroke-[2px]" />
                    {/* Centered logo icon + text */}
                    <div className="flex items-center gap-1">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[#F5F5F7]">
                        <line x1="18" y1="20" x2="18" y2="10" />
                        <line x1="12" y1="20" x2="12" y2="4" />
                        <line x1="6" y1="20" x2="6" y2="14" />
                      </svg>
                      <span className="text-[10px] font-bold text-[#F5F5F7]">Dashboard</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-3.5 h-3.5 text-[#F5F5F7] stroke-[2px]" />
                    <Bell className="w-3.5 h-3.5 text-[#F5F5F7] stroke-[2px]" />
                  </div>
                </div>

                {/* Balance */}
                <div className="px-2 mt-3 flex items-center justify-between shrink-0">
                  <div className="flex flex-col text-left">
                    <span className="text-[#F5F5F7] text-[9px]">Total em vendas</span>
                    <span className="font-bold text-[#F5F5F7] text-[15px] tracking-tight mt-0.5">R$ 8.283,35</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#F5F5F7] shrink-0" />
                </div>

                {/* Segmented Controls */}
                <div className="px-2 mt-3 grid grid-cols-4 gap-1 text-center shrink-0">
                  {['Hoje', 'Ontem', 'Essa semana', 'Esse mês'].map((tab) => (
                    <button 
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-1 text-[8px] font-semibold rounded-full transition-all duration-250 ease-premium ${
                        activeTab === tab 
                          ? 'bg-[#3F6DF7] text-[#F5F5F7]' 
                          : 'bg-[#111114] border border-[#24242A] text-[#F5F5F7] hover:text-[#F5F5F7]'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Mobile Graph (Sparkline style: no axis or gridlines) */}
                <div className="px-1 flex-1 flex flex-col justify-end min-h-[90px] mt-4 relative">
                  <svg className="w-full h-full min-h-[80px]" viewBox="0 0 200 80" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="glow-mobile" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3F6DF7" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#3F6DF7" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0,62 C13.3,62 20,70 28.5,70 C36.6,70 50,60 57.1,60 C64,60 78.6,68 85.7,68 C92.6,68 106.6,52.5 114.2,52.5 C121.3,52.5 136,55 142.8,55 C149.3,55 164,43.75 171.4,43.75 C178.6,43.75 192,35 200,35" fill="none" stroke="#3F6DF7" strokeWidth="2.5" />
                    <path d="M0,62 C13.3,62 20,70 28.5,70 C36.6,70 50,60 57.1,60 C64,60 78.6,68 85.7,68 C92.6,68 106.6,52.5 114.2,52.5 C121.3,52.5 136,55 142.8,55 C149.3,55 164,43.75 171.4,43.75 C178.6,43.75 192,35 200,35 L200,80 L0,80 Z" fill="url(#glow-mobile)" />
                    
                    {/* Points on the curve */}
                    <circle cx="0" cy="62" r="3.5" fill="#3F6DF7" stroke="#09090B" strokeWidth="1.5" />
                    <circle cx="28.5" cy="70" r="3.5" fill="#3F6DF7" stroke="#09090B" strokeWidth="1.5" />
                    <circle cx="57.1" cy="60" r="3.5" fill="#3F6DF7" stroke="#09090B" strokeWidth="1.5" />
                    <circle cx="85.7" cy="68" r="3.5" fill="#3F6DF7" stroke="#09090B" strokeWidth="1.5" />
                    <circle cx="114.2" cy="52.5" r="3.5" fill="#3F6DF7" stroke="#09090B" strokeWidth="1.5" />
                    <circle cx="142.8" cy="55" r="3.5" fill="#3F6DF7" stroke="#09090B" strokeWidth="1.5" />
                    <circle cx="171.4" cy="43.75" r="3.5" fill="#3F6DF7" stroke="#09090B" strokeWidth="1.5" />
                    <circle cx="200" cy="35" r="3.5" fill="#3F6DF7" stroke="#09090B" strokeWidth="1.5" />
                  </svg>
                </div>

                {/* Stacked Metric Cards List (Pedidos feitos on top of Pedidos pagos) */}
                <div className="flex flex-col gap-1.5 px-1 mt-3 shrink-0">
                  {/* Top Card: Pedidos feitos */}
                  <div className="bg-[#111114] border border-[#24242A] rounded-[12px] p-2.5 flex items-center justify-between shadow-[0_0_0_1px_rgba(255,255,255,.01)]">
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] text-[#F5F5F7] font-semibold leading-tight">Pedidos feitos</span>
                      <span className="text-[7.5px] text-[#F5F5F7]">Todos</span>
                      <span className="font-bold text-[#F5F5F7] text-[11px] mt-0.5">652</span>
                    </div>
                    <span className="text-[7.5px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                      <span>+12</span>
                      <svg width="6.5" height="6.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="stroke-emerald-400">
                        <polyline points="18 15 12 9 6 15" />
                      </svg>
                    </span>
                  </div>

                  {/* Bottom Card: Pedidos pagos */}
                  <div className="bg-[#111114] border border-[#24242A] rounded-[12px] p-2.5 flex items-center justify-between shadow-[0_0_0_1px_rgba(255,255,255,.01)]">
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] text-[#F5F5F7] font-semibold leading-tight">Pedidos pagos</span>
                      <span className="text-[7.5px] text-[#F5F5F7]">Todos</span>
                      <span className="font-bold text-[#F5F5F7] text-[11px] mt-0.5">231</span>
                    </div>
                    <span className="text-[7.5px] font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                      <span>-04</span>
                      <svg width="6.5" height="6.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="stroke-rose-400">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Bottom Tab Bar */}
                <div className="flex items-center justify-between border-t border-[#24242A] pt-2 px-2 mt-3 shrink-0">
                  <div className="flex flex-col items-center gap-0.5 text-[#3F6DF7] cursor-pointer">
                    <TrendingUp className="w-3.5 h-3.5 stroke-[2px]" />
                    <span className="text-[7px] font-medium leading-none">Dash</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5 text-[#F5F5F7] hover:text-[#F5F5F7] transition-colors cursor-pointer">
                    <DollarSign className="w-3.5 h-3.5 stroke-[2px]" />
                    <span className="text-[7px] font-medium leading-none">Saldo</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5 text-[#F5F5F7] hover:text-[#F5F5F7] transition-colors cursor-pointer">
                    <ShoppingBag className="w-3.5 h-3.5 stroke-[2px]" />
                    <span className="text-[7px] font-medium leading-none">Produtos</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5 text-[#F5F5F7] hover:text-[#F5F5F7] transition-colors cursor-pointer">
                    <Settings className="w-3.5 h-3.5 stroke-[2px]" />
                    <span className="text-[7px] font-medium leading-none">Ajustes</span>
                  </div>
                </div>

                {/* Home Indicator Bar */}
                <div className="w-[35%] h-[4px] bg-[#F5F5F7]/30 rounded-full mx-auto mt-2 shrink-0" />

              </div>
            </div>

          </motion.div>

        </main>

        {/* Divider */}
        <div className="w-full border-b border-[#24242A] relative z-20 shrink-0 -mt-6 lg:-mt-12" />

        {/* Features Grid Section (Dark Mode, Blue Accent, ul/li layout) */}
        <div className="w-full bg-[#09090B] text-[#F5F5F7] relative z-20 border-b border-[#24242A]">
          <motion.ul
            variants={staggerFast}
            initial="hidden"
            whileInView="show"
            viewport={vp}
            
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full">
            {[
              {
                icon: (
                  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#3F6DF7]" fill="currentColor">
                    <path d="M5.283 18.36a3.505 3.505 0 0 0 2.493-1.032l3.6-3.6a.684.684 0 0 1 .946 0l3.613 3.613a3.504 3.504 0 0 0 2.493 1.032h.71l-4.56 4.56a3.647 3.647 0 0 1-5.156 0L4.85 18.36ZM18.428 5.627a3.505 3.505 0 0 0-2.493 1.032l-3.613 3.614a.67 6.7 0 0 1-.946 0l-3.6-3.6A3.505 3.505 0 0 0 5.283 5.64h-.434l4.573-4.572a3.646 3.646 0 0 1 5.156 0l4.559 4.559ZM1.068 9.422 3.79 6.699h1.492a2.483 2.483 0 0 1 1.744.722l3.6 3.6a1.73 1.73 0 0 0 2.443 0l3.614-3.613a2.482 2.482 0 0 1 1.744-.723h1.767l2.737 2.737a3.646 3.646 0 0 1 0 5.156l-2.736 2.736h-1.768a2.482 2.482 0 0 1-1.744-.722l-3.613-3.613a1.77 1.77 0 0 0-2.444 0l-3.6 3.6a2.483 2.483 0 0 1-1.744.722H3.791l-2.723-2.723a3.646 3.646 0 0 1 0-5.156" />
                  </svg>
                ),
                title: "Pagamento via PIX",
                text: "Receba na hora com aprovação instantânea e saques livres de burocracia."
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#3F6DF7]" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 10h20" />
                    <rect width="3" height="2" x="6" y="14" rx="0.5" fill="currentColor" stroke="none" />
                  </svg>
                ),
                title: "Cartão de Crédito",
                text: "Venda parcelada em até 12x com segurança e liquidação rápida em D+2."
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#3F6DF7]" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <path d="M12 11v6" />
                    <path d="M10 12.5h3.5a1.5 1.5 0 0 1 0 3H10.5a1.5 1.5 0 0 1 0-3H14" />
                  </svg>
                ),
                title: "Boleto Bancário",
                text: "Compensação rápida em até 3 dias úteis com conciliação automática."
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#3F6DF7]" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                ),
                title: "Checkout Transparente",
                text: "Checkout no seu domínio. Do seu jeito, feito para converter muito mais."
              }
            ].map((column, index) => (
              <motion.li
                key={index}
                variants={fadeUp}
                className={`flex flex-col text-left py-24 md:py-28 lg:py-36 px-8 lg:px-12 border-dashed border-[#24242A] border-b lg:border-b-0
                  ${index % 2 === 0 ? 'sm:border-r' : ''}
                  ${index < 2 ? 'sm:border-b' : ''}
                  ${index === 3 ? 'border-b-0' : ''}
                  lg:border-r lg:last:border-r-0 lg:border-b-0 lg:first:border-r`}
              >
                {/* Icon Row with Blue Bar */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-[3px] h-[22px] bg-[#3F6DF7] rounded-full shrink-0" />
                  {column.icon}
                </div>
                {/* Title */}
                <h3 className="text-[18px] md:text-[20px] font-bold text-[#F5F5F7] tracking-tight leading-snug mb-3">
                  {column.title}
                </h3>
                {/* Text Description */}
                <p className="text-[13.5px] md:text-[14.5px] text-[#F5F5F7] leading-relaxed">
                  {column.text}
                </p>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* Pricing CTA Section */}
        <div 
          className="w-full bg-[#09090B] relative z-20 border-b border-[#24242A] px-6 md:px-[52px] py-24 md:py-36 overflow-hidden"
          style={{
            backgroundImage: 'radial-gradient(#24242A 1.2px, transparent 1.2px)',
            backgroundSize: '24px 24px',
            backgroundPosition: 'center'
          }}
        >
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={vp}
            
            className="max-w-[1176px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
            {/* Left Column: Title & Subtitle */}
            <motion.div variants={fadeUp} className="flex flex-col items-start text-left max-w-[700px]">
              <h2 className="text-[36px] sm:text-[42px] md:text-[48px] lg:text-[52px] font-normal text-[#F5F5F7] tracking-tight leading-[1.08] mb-4">
                <span>Suas vendas merecem</span>
                <span className="block mt-2 text-shine font-normal">mais velocidade.</span>
              </h2>
              <p className="text-[15px] md:text-[16.5px] text-[#F5F5F7] font-medium leading-relaxed">
                Receba no mesmo dia via Pix e tenha cartões com liquidação em D+2, com transparência total e controle financeiro.
              </p>
            </motion.div>

            {/* Right Column: CTA Link */}
            <motion.div variants={fadeUp} className="flex items-center shrink-0">
              <a 
                href="#" 
                className="flex items-center gap-3 text-[#3F6DF7] hover:text-[#5C84FF] text-[16px] md:text-[18px] font-bold transition-all duration-250 ease-premium hover:translate-x-1 group"
              >
                <span>Ver taxas</span>
                <span className="w-8 h-8 rounded-full bg-[#3F6DF7]/15 flex items-center justify-center transition-all duration-250 group-hover:bg-[#3F6DF7] group-hover:text-[#F5F5F7]">
                  <ArrowRight className="w-4 h-4 text-[#3F6DF7] group-hover:text-white transition-colors duration-250 stroke-[2.5px]" />
                </span>
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Hatching Divider */}
        <div className="w-full h-12 bg-hatching border-b border-[#24242A] relative z-20 shrink-0" />

        {/* Integrations Section (Dark Mode, Blue Accent, Floating Badges) */}
        <div 
          className="w-full bg-[#09090B] relative z-20 border-b border-[#24242A] px-6 md:px-[52px] py-14 md:py-18 overflow-hidden flex items-center justify-center"
          style={{
            backgroundImage: 'radial-gradient(#24242A 1.2px, transparent 1.2px)',
            backgroundSize: '24px 24px',
            backgroundPosition: 'center'
          }}
        >
          {/* Relative wrapper that spans the max-width and acts as container for absolute badges */}
          <div className="w-full max-w-[1176px] min-h-[360px] flex items-center justify-center relative">
            
            {/* Central Content */}
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={vp}
              
              className="w-full max-w-[850px] mx-auto text-center flex flex-col items-center justify-center relative z-10">

              
              {/* Title */}
              <motion.h2 variants={fadeUp} className="text-[32px] sm:text-[38px] md:text-[44px] lg:text-[48px] font-normal text-[#F5F5F7] tracking-tight leading-[1.1] mb-5">
                <span className="block sm:inline whitespace-normal sm:whitespace-nowrap">Tecnologia pensada para</span>{" "}
                <span className="block mt-1 text-shine font-normal whitespace-normal sm:whitespace-nowrap">performance e estabilidade.</span>
              </motion.h2>

              {/* Description */}
              <motion.p variants={fadeUp} className="text-[14.5px] md:text-[16px] text-[#F5F5F7] leading-relaxed mb-8 max-w-[480px]">
                Tudo que você precisa para vender com tecnologia, segurança e conversão. Alta estabilidade para sua operação.
              </motion.p>

              {/* Action Buttons */}
              <motion.div variants={fadeUp} className="flex flex-col items-center gap-3">
                <ButtonWithIcon className="!h-[46px] text-[14px]">
                  Veja nossa documentação
                </ButtonWithIcon>
                <a href="#" className="text-[12.5px] font-medium text-[#F5F5F7] hover:text-[#3F6DF7] transition-all duration-250 mt-1 hover:underline">
                  ou veja llms.txt
                </a>
              </motion.div>
            </motion.div>

             {/* FLOATING BADGES (Framer Motion Animated - Giant Real Logos) */}
            
            {/* Left Side Badges */}
            
            {/* Left Side: Floating Pix Notifications (Asset Style) */}
            
            {/* Pix Notification 1 (Top Left) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
              viewport={{ once: true }}
              transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
              whileHover={{ scale: 1.02 }}
              className="absolute left-[3%] top-[8%] hidden md:flex items-start gap-2.5 w-[250px] p-2.5 rounded-[16px] bg-[#141416] text-[#F5F5F7] shadow-2xl transition-all cursor-default select-none text-left"
            >
              {/* Blue Asset Logo with White Frame */}
              <div className="w-7 h-7 rounded-lg bg-[#3F6DF7] border-2 border-white flex items-center justify-center shrink-0 font-sans font-black text-white text-[13.5px] select-none shadow-sm">
                A
              </div>
              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex justify-between items-baseline w-full leading-none">
                  <span className="text-[10px] font-bold text-[#F5F5F7]">Transferência recebida</span>
                  <span className="text-[8px] text-[#71717A] shrink-0 ml-2">agora</span>
                </div>
                <p className="text-[9.5px] text-[#A1A1AA] leading-normal mt-0.5">
                  Você recebeu uma transferência de R$ 197,00 de LUCAS DE SOUSA SILVA.
                </p>
              </div>
            </motion.div>

            {/* Pix Notification 2 (Middle Left) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: [0, 6, 0] }}
              viewport={{ once: true }}
              transition={{ duration: 6.8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              className="absolute left-[-45px] top-[48%] -translate-y-1/2 flex items-start gap-2.5 w-[250px] p-2.5 rounded-[16px] bg-[#141416] text-[#F5F5F7] shadow-2xl transition-all cursor-default select-none text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-[#3F6DF7] border-2 border-white flex items-center justify-center shrink-0 font-sans font-black text-white text-[13.5px] select-none shadow-sm">
                A
              </div>
              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex justify-between items-baseline w-full leading-none">
                  <span className="text-[10px] font-bold text-[#F5F5F7]">Transferência recebida</span>
                  <span className="text-[8px] text-[#71717A] shrink-0 ml-2">agora</span>
                </div>
                <p className="text-[9.5px] text-[#A1A1AA] leading-normal mt-0.5">
                  Você recebeu uma transferência de R$ 97,00 de MARIA EDUARDA GOMES.
                </p>
              </div>
            </motion.div>

            {/* Pix Notification 3 (Bottom Left) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: [0, -5, 0] }}
              viewport={{ once: true }}
              transition={{ duration: 5.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              className="absolute left-[5%] bottom-[8%] hidden md:flex items-start gap-2.5 w-[250px] p-2.5 rounded-[16px] bg-[#141416] text-[#F5F5F7] shadow-2xl transition-all cursor-default select-none text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-[#3F6DF7] border-2 border-white flex items-center justify-center shrink-0 font-sans font-black text-white text-[13.5px] select-none shadow-sm">
                A
              </div>
              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex justify-between items-baseline w-full leading-none">
                  <span className="text-[10px] font-bold text-[#F5F5F7]">Transferência recebida</span>
                  <span className="text-[8px] text-[#71717A] shrink-0 ml-2">agora</span>
                </div>
                <p className="text-[9.5px] text-[#A1A1AA] leading-normal mt-0.5">
                  Você recebeu uma transferência de R$ 297,00 de PEDRO HENRIQUE RESENDE.
                </p>
              </div>
            </motion.div>

            {/* Right Side: Floating Pix Notifications */}

            {/* Pix Notification 4 (Top Right) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
              viewport={{ once: true }}
              transition={{ duration: 6.4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.15 }}
              whileHover={{ scale: 1.02 }}
              className="absolute right-[3%] top-[8%] hidden md:flex items-start gap-2.5 w-[250px] p-2.5 rounded-[16px] bg-[#141416] text-[#F5F5F7] shadow-2xl transition-all cursor-default select-none text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-[#3F6DF7] border-2 border-white flex items-center justify-center shrink-0 font-sans font-black text-white text-[13.5px] select-none shadow-sm">
                A
              </div>
              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex justify-between items-baseline w-full leading-none">
                  <span className="text-[10px] font-bold text-[#F5F5F7]">Transferência recebida</span>
                  <span className="text-[8px] text-[#71717A] shrink-0 ml-2">agora</span>
                </div>
                <p className="text-[9.5px] text-[#A1A1AA] leading-normal mt-0.5">
                  Você recebeu uma transferência de R$ 380,00 de ALINE SANTOS COSTA.
                </p>
              </div>
            </motion.div>

            {/* Pix Notification 5 (Middle Right) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: [0, 5, 0] }}
              viewport={{ once: true }}
              transition={{ duration: 5.8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.45 }}
              whileHover={{ scale: 1.02 }}
              className="absolute right-[-45px] top-[48%] -translate-y-1/2 flex items-start gap-2.5 w-[250px] p-2.5 rounded-[16px] bg-[#141416] text-[#F5F5F7] shadow-2xl transition-all cursor-default select-none text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-[#3F6DF7] border-2 border-white flex items-center justify-center shrink-0 font-sans font-black text-white text-[13.5px] select-none shadow-sm">
                A
              </div>
              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex justify-between items-baseline w-full leading-none">
                  <span className="text-[10px] font-bold text-[#F5F5F7]">Transferência recebida</span>
                  <span className="text-[8px] text-[#71717A] shrink-0 ml-2">agora</span>
                </div>
                <p className="text-[9.5px] text-[#A1A1AA] leading-normal mt-0.5">
                  Você recebeu uma transferência de R$ 147,00 de CARLOS AUGUSTO PEREIRA.
                </p>
              </div>
            </motion.div>

            {/* Pix Notification 6 (Bottom Right) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: [0, -7, 0] }}
              viewport={{ once: true }}
              transition={{ duration: 6.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.75 }}
              whileHover={{ scale: 1.02 }}
              className="absolute right-[5%] bottom-[8%] hidden md:flex items-start gap-2.5 w-[250px] p-2.5 rounded-[16px] bg-[#141416] text-[#F5F5F7] shadow-2xl transition-all cursor-default select-none text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-[#3F6DF7] border-2 border-white flex items-center justify-center shrink-0 font-sans font-black text-white text-[13.5px] select-none shadow-sm">
                A
              </div>
              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex justify-between items-baseline w-full leading-none">
                  <span className="text-[10px] font-bold text-[#F5F5F7]">Transferência recebida</span>
                  <span className="text-[8px] text-[#71717A] shrink-0 ml-2">agora</span>
                </div>
                <p className="text-[9.5px] text-[#A1A1AA] leading-normal mt-0.5">
                  Você recebeu uma transferência de R$ 497,00 de JULIANA MARQUES FERREIRA.
                </p>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Bottom Hatching Divider */}
        <div className="w-full h-12 bg-hatching border-b border-[#24242A] relative z-20 shrink-0" />

        {/* Documentation & Easy Integration Grid Section */}
        <div className="w-full bg-[#09090B] relative z-20 border-b border-[#24242A]">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={vp}
            
            className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Top Left: Checkout Mockup Box */}
            <motion.div variants={fadeUp} className="border-b md:border-r border-[#24242A] p-8 md:p-16 flex items-center justify-center bg-[#09090B]/50 relative min-h-[360px]">
              {/* Mockup Checkout Window - Minimalist, static card */}
              <motion.div 
                whileHover={{ scale: 1.015 }}
                transition={{ type: "spring", stiffness: 150, damping: 25 }}
                className="w-full max-w-[380px] bg-[#111114] rounded-xl shadow-2xl relative z-10 select-none p-5 flex flex-col gap-4 text-left cursor-default"
              >
                {/* Amount to Pay (Animate in) */}
                <motion.div 
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                  className="flex justify-between items-center bg-[#0E0E11] rounded-lg p-3.5"
                >
                  <div className="flex flex-col">
                    <span className="text-[9.5px] text-[#71717A] uppercase tracking-wider font-semibold">Total a pagar</span>
                    <span className="text-[16px] font-bold text-[#F5F5F7] mt-0.5">R$ 197,00</span>
                  </div>
                  <span className="text-[9.5px] bg-[#3F6DF7]/10 text-[#3F6DF7] px-3 py-0.5 rounded-full font-medium">Pix</span>
                </motion.div>

                {/* Simplified Payment Method List (Animate in) */}
                <motion.div 
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  className="flex flex-col gap-1.5"
                >
                  <motion.div 
                    whileHover={{ x: 2, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="flex justify-between items-center p-3 bg-[#3F6DF7]/5 rounded-lg text-[10.5px] text-[#F5F5F7] font-medium transition-colors"
                  >
                    <span>Pix Copia e Cola</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3F6DF7]" />
                  </motion.div>
                  <motion.div 
                    whileHover={{ x: 2, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="flex justify-between items-center p-3 bg-[#0E0E11] rounded-lg text-[10.5px] text-[#71717A] opacity-60 hover:opacity-80 transition-opacity"
                  >
                    <span>Cartão de Crédito</span>
                  </motion.div>
                  <motion.div 
                    whileHover={{ x: 2, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="flex justify-between items-center p-3 bg-[#0E0E11] rounded-lg text-[10.5px] text-[#71717A] opacity-60 hover:opacity-80 transition-opacity"
                  >
                    <span>Boleto Bancário</span>
                  </motion.div>
                </motion.div>

                {/* Pix Key copy paste widget (Animate in) */}
                <motion.div 
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                  className="flex flex-col gap-2 p-3.5 bg-[#0E0E11] rounded-lg"
                >
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-mono text-[9.5px] text-[#71717A] truncate flex-1">00020126360014br.gov.bcb.pix253600...</span>
                    <button 
                      onClick={() => {
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="text-[10px] font-semibold text-[#3F6DF7] hover:text-[#5C84FF] transition-colors cursor-pointer shrink-0 select-none h-[15px] flex items-center justify-end min-w-[55px]"
                    >
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={copied ? "copied" : "copy"}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.15 }}
                        >
                          {copied ? "Copiado!" : "Copiar"}
                        </motion.span>
                      </AnimatePresence>
                    </button>
                  </div>
                  <span className="text-[8.5px] text-[#71717A] leading-normal">Copie a chave Pix acima ou use o QR Code no seu aplicativo bancário.</span>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Top Right: Mobile App Mockup Box */}
            <div className="border-b border-[#24242A] p-8 md:p-16 flex items-center justify-center bg-[#09090B]/50 relative min-h-[360px]">
              {/* Floating Mobile Screen - Minimalist, static card */}
              <motion.div 
                whileHover={{ scale: 1.015 }}
                transition={{ type: "spring", stiffness: 150, damping: 25 }}
                className="w-full max-w-[380px] h-[250px] bg-[#0E0E11] rounded-xl shadow-2xl relative z-10 overflow-hidden flex flex-col p-5 justify-between cursor-default"
              >
                {/* Floating Push Notification Banner (Animate in & update on new simulated sales) */}
                <motion.div 
                  initial={{ y: -24, opacity: 0 }}
                  animate={isNotificationActive ? { y: 0, opacity: 1 } : { y: -24, opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-[#111114]/95 rounded-xl p-3 flex items-center gap-2.5 shadow-lg z-20"
                >
                  {/* Official Asset Pay Logo Icon */}
                  <div className="w-6 h-6 rounded-md bg-[#3F6DF7] flex items-center justify-center shrink-0 shadow-sm">
                    <svg width="12" height="12" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 5L26 15H20L16 11L12 15H6L16 5Z" fill="#FFFFFF" />
                      <path d="M16 15L26 25H20L16 21L12 25H6L16 15Z" fill="#FFFFFF" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left leading-tight">
                    <div className="flex justify-between items-center text-[8.5px]">
                      <span className="font-bold text-[#F5F5F7]">Asset</span>
                      <span className="text-[7.5px] text-[#71717A]">agora</span>
                    </div>
                    <p className="text-[9px] font-bold text-[#3F6DF7] mt-0.5">
                      Venda Aprovada! R$ {saleNotification.amount},00
                    </p>
                  </div>
                </motion.div>

                {/* Dashboard summary underneath */}
                <div className="flex flex-col gap-2">
                  {/* Faturamento info (Animate in) */}
                  <motion.div 
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                    className="flex flex-col text-left justify-end min-h-[38px]"
                  >
                    <span className="text-[9px] text-[#71717A] uppercase tracking-wider font-semibold">Hoje</span>
                    <div className="h-[22px] overflow-hidden relative flex items-baseline mt-0.5">
                      <AnimatePresence mode="popLayout">
                        <motion.span 
                          key={liveBalance}
                          initial={{ y: 14, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -14, opacity: 0 }}
                          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                          className="text-[18px] font-bold text-[#F5F5F7] block"
                        >
                          R$ {liveBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  </motion.div>

                  {/* Sparkline Graphic - Blue path, draws/erases itself smoothly on simulated sales */}
                  <div className="h-[46px] relative">
                    <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                      <motion.path 
                        d="M0,35 C20,38 40,20 60,12 C80,18 90,6 100,2" 
                        fill="none" 
                        stroke="#3F6DF7" 
                        strokeWidth="2" 
                        animate={{ pathLength: sparklineDraw }}
                        transition={{ 
                          duration: sparklineDraw === 0 ? 0.4 : 1.2, 
                          ease: sparklineDraw === 0 ? "easeIn" : [0.25, 1, 0.5, 1] 
                        }}
                      />
                    </svg>
                  </div>
                </div>

                {/* Bottom App indicators (Animate in) */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="flex justify-between items-center text-[8px] text-[#71717A] border-t border-[#24242A]/30 pt-2"
                >
                  <span className="text-[#3F6DF7] font-semibold">Faturamento</span>
                  <span>Saques</span>
                </motion.div>
              </motion.div>
            </div>

            {/* Bottom Left: Documentação Copy */}
            <div className="border-b md:border-b-0 md:border-r border-[#24242A] p-8 md:p-16 flex flex-col justify-between min-h-[260px] text-left">
              <div>
                <h3 className="text-[22px] md:text-[24px] font-medium text-[#F5F5F7] tracking-tight mb-4">
                  Muito além de um gateway
                </h3>
                <p className="text-[14.5px] md:text-[15.5px] text-[#F5F5F7] leading-relaxed max-w-[460px]">
                  Uma plataforma completa de pagamentos projetada para dar velocidade e estabilidade para a sua operação.
                </p>
              </div>
              <div className="mt-8">
                <a 
                  href="#" 
                  className="inline-flex items-center gap-2 text-[#3F6DF7] hover:text-[#5C84FF] font-medium text-[15px] transition-all duration-250 hover:translate-x-1"
                >
                  <span>Acessar documentação</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Bottom Right: Integrar fácil Copy */}
            <div className="p-8 md:p-16 flex flex-col justify-between min-h-[260px] text-left">
              <div>
                <h3 className="text-[22px] md:text-[24px] font-medium text-[#F5F5F7] tracking-tight mb-4">
                  Sua operação na palma da mão
                </h3>
                <p className="text-[14.5px] md:text-[15.5px] text-[#F5F5F7] leading-relaxed max-w-[480px] mb-6">
                  Com o aplicativo da Asset, você acompanha suas vendas em tempo real, recebe notificações instantâneas a cada aprovação, monitora faturamento diário e gerencia seus saques com poucos toques.
                </p>
                
                {/* Context Link Copy Bar */}
                <div className="w-full max-w-[420px] h-[44px] rounded-lg bg-[#111114] border border-[#24242A] px-3.5 flex items-center justify-between text-[#F5F5F7] mb-6">
                  <div className="flex items-center gap-2 truncate">
                    <Link className="w-4 h-4 text-[#71717A] shrink-0" />
                    <span className="font-mono text-[13px] text-[#F5F5F7] truncate">assetpay.com/llms.txt</span>
                  </div>
                  <button className="text-[11px] font-semibold text-[#3F6DF7] hover:text-[#5C84FF] transition-colors cursor-pointer select-none">
                    Copiar
                  </button>
                </div>
              </div>
              
              {/* Favorite AI Buttons */}
              <div className="flex flex-wrap gap-2.5">
                {/* Claude */}
                <a 
                  href="#" 
                  className="h-[36px] px-3.5 rounded-full bg-[#111114] border border-[#24242A] hover:border-[#D97706]/40 flex items-center gap-2 text-[13px] text-[#F5F5F7] font-medium transition-all duration-200 select-none cursor-pointer"
                >
                  <svg width="15" height="15" viewBox="0 -.01 39.5 39.53" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                    <path d="m7.75 26.27 7.77-4.36.13-.38-.13-.21h-.38l-1.3-.08-4.44-.12-3.85-.16-3.73-.2-.94-.2-.88-1.16.09-.58.79-.53 1.13.1 2.5.17 3.75.26 2.72.16 4.03.42h.64l.09-.26-.22-.16-.17-.16-3.88-2.63-4.2-2.78-2.2-1.6-1.19-.81-.6-.76-.26-1.66 1.08-1.19 1.45.1.37.1 1.47 1.13 3.14 2.43 4.1 3.02.6.5.24-.17.03-.12-.27-.45-2.23-4.03-2.38-4.1-1.06-1.7-.28-1.02c-.1-.42-.17-.77-.17-1.2l1.23-1.67.68-.22 1.64.22.69.6 1.02 2.33 1.65 3.67 2.56 4.99.75 1.48.4 1.37.15.42h.26v-.24l.21-2.81.39-3.45.38-4.44.13-1.25.62-1.5 1.23-.81.96.46.79 1.13-.11.73-.47 3.05-.92 4.78-.6 3.2h.35l.4-.4 1.62-2.15 2.72-3.4 1.2-1.35 1.4-1.49.9-.71h1.7l1.25 1.86-.56 1.92-1.75 2.22-1.45 1.88-2.08 2.8-1.3 2.24.12.18.31-.03 4.7-1 2.54-.46 3.03-.52 1.37.64.15.65-.54 1.33-3.24.8-3.8.76-5.66 1.34-.07.05.08.1 2.55.24 1.09.06h2.67l4.97.37 1.3.86.78 1.05-.13.8-2 1.02-2.7-.64-6.3-1.5-2.16-.54h-.3v.18l1.8 1.76 3.3 2.98 4.13 3.84.21.95-.53.75-.56-.08-3.63-2.73-1.4-1.23-3.17-2.67h-.21v.28l.73 1.07 3.86 5.8.2 1.78-.28.58-1 .35-1.1-.2-2.26-3.17-2.33-3.57-1.88-3.2-.23.13-1.11 11.95-.52.61-1.2.46-1-.76-.53-1.23.53-2.43.64-3.17.52-2.52.47-3.13.28-1.04-.02-.07-.23.03-2.36 3.24-3.59 4.85-2.84 3.04-.68.27-1.18-.61.11-1.09.66-.97 3.93-5 2.37-3.1 1.53-1.79-.01-.26h-.09l-10.44 6.78-1.86.24-.8-.75.1-1.23.38-.4 3.14-2.16z" fill="#d97757" />
                  </svg>
                  <span>Usar Claude</span>
                </a>
                
                {/* ChatGPT */}
                <a 
                  href="#" 
                  className="h-[36px] px-3.5 rounded-full bg-[#111114] border border-[#24242A] hover:border-[#10A37F]/40 flex items-center gap-2 text-[13px] text-[#F5F5F7] font-medium transition-all duration-200 select-none cursor-pointer"
                >
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="#10A37F" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                    <path d="M14.949 6.547a3.94 3.94 0 0 0-.348-3.273 4.11 4.11 0 0 0-4.4-1.934A4.1 4.1 0 0 0 8.423.2 4.15 4.15 0 0 0 6.305.086a4.1 4.1 0 0 0-1.891.948 4.04 4.04 0 0 0-1.158 1.753 4.1 4.1 0 0 0-1.563.679A4 4 0 0 0 .554 4.72a3.99 3.99 0 0 0 .502 4.731 3.94 3.94 0 0 0 .346 3.274 4.11 4.11 0 0 0 4.402 1.933c.382.425.852.764 1.377.995.526.231 1.095.35 1.67.346 1.78.002 3.358-1.132 3.901-2.804a4.1 4.1 0 0 0 1.563-.68 4 4 0 0 0 1.14-1.253 3.99 3.99 0 0 0-.506-4.716m-6.097 8.406a3.05 3.05 0 0 1-1.945-.694l.096-.054 3.23-1.838a.53.53 0 0 0 .265-.455v-4.49l1.366.778q.02.011.025.035v3.722c-.003 1.653-1.361 2.992-3.037 2.996m-6.53-2.75a2.95 2.95 0 0 1-.36-2.01l.095.057L5.29 12.09a.53.53 0 0 0 .527 0l3.949-2.246v1.555a.05.05 0 0 1-.022.041L6.473 13.3c-1.454.826-3.311.335-4.15-1.098m-.85-6.94A3.02 3.02 0 0 1 3.07 3.949v3.785a.51.51 0 0 0 .262.451l3.93 2.237-1.366.779a.05.05 0 0 1-.048 0L2.585 9.342a2.98 2.98 0 0 1-1.113-4.094zm11.216 2.571L8.747 5.576l1.362-.776a.05.05 0 0 1 .048 0l3.265 1.86a3 3 0 0 1 1.173 1.207 2.96 2.96 0 0 1-.27 3.2 3.05 3.05 0 0 1-1.36.997V8.279a.52.52 0 0 0-.276-.445m1.36-2.015-.097-.057-3.226-1.855a.53.53 0 0 0-.53 0L6.249 6.153V4.598a.04.04 0 0 1 .019-.04L9.533 2.7a3.07 3.07 0 0 1 3.257.139c.474.325.843.778 1.066 1.303.223.526.289 1.103.191 1.664zM5.503 8.575 4.139 7.8a.05.05 0 0 1-.026-.037V4.049c0-.57.166-1.127.476-1.607s.752-.864 1.275-1.105a3.08 3.08 0 0 1 .012-.037z" />
                  </svg>
                  <span>Usar ChatGPT</span>
                </a>
                
                {/* Lovable */}
                <a 
                  href="#" 
                  className="h-[36px] px-3.5 rounded-full bg-[#111114] border border-[#24242A] hover:border-[#FE529A]/40 flex items-center gap-2 text-[13px] text-[#F5F5F7] font-medium transition-all duration-200 select-none cursor-pointer"
                >
                  <svg width="14" height="14" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                    <path fillRule="evenodd" clipRule="evenodd" d="M151.083 0c83.413 0 151.061 67.819 151.061 151.467v57.6h50.283c83.413 0 151.082 67.797 151.082 151.466 0 83.691-67.626 151.467-151.082 151.467H0V151.467C0 67.84 67.627 0 151.083 0z" fill="url(#lovable-grad-badge-docs)" />
                    <defs>
                      <radialGradient id="lovable-grad-badge-docs" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="rotate(92.545 118.724 174.844) scale(480.474 650.325)">
                        <stop offset=".25" stopColor="#FE7B02" />
                        <stop offset=".433" stopColor="#FE4230" />
                        <stop offset=".548" stopColor="#FE529A" />
                        <stop offset=".654" stopColor="#DD67EE" />
                        <stop offset=".95" stopColor="#4B73FF" />
                      </radialGradient>
                    </defs>
                  </svg>
                  <span>Usar Lovable</span>
                </a>
              </div>
            </div>

          </motion.div>
        </div>

        {/* Bottom Hatching Divider */}
        <div className="w-full h-12 bg-hatching border-b border-[#24242A] relative z-20 shrink-0" />

        {/* Solutions Suite Intro Section */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={vp}
          
          className="w-full bg-[#09090B] border-b border-[#24242A] px-6 md:px-[52px] py-20 md:py-28 flex flex-col md:flex-row items-start justify-between gap-8 md:gap-12 relative z-20">
          {/* Left Column: Heading */}
          <motion.div variants={fadeUp} className="flex-1 text-left max-w-[500px]">
            <h2 className="text-[36px] sm:text-[42px] md:text-[48px] lg:text-[52px] font-normal text-[#F5F5F7] tracking-tight leading-[1.08]">
              Venda hoje. Receba com{" "}
              <span className="relative inline-block px-1.5 font-normal">
                previsibilidade.
                <svg className="absolute -inset-x-2.5 -inset-y-3.5 w-[calc(100%+20px)] h-[calc(100%+28px)] text-[#3F6DF7] pointer-events-none select-none" viewBox="0 0 100 100" fill="none" preserveAspectRatio="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3,48 C10,12 85,8 96,44 C100,78 30,95 8,82 C-5,72 5,30 35,22" stroke="currentColor" strokeWidth="2.5" />
                </svg>
              </span>
            </h2>
          </motion.div>

          {/* Right Column: Description */}
          <motion.div variants={fadeUp} className="flex-1 text-left max-w-[520px] md:mt-2">
            <p className="text-[15px] md:text-[16.5px] text-[#F5F5F7] leading-relaxed">
              A Asset entrega até 98% de aprovação nas suas vendas. Enquanto outros tentam, você converte.
            </p>
          </motion.div>
        </motion.div>

        {/* 3-Column Isometric Features Grid */}
        <div className="w-full bg-[#09090B] px-6 md:px-[52px] pt-0 pb-0 relative z-20">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={vp}
            className="grid grid-cols-1 md:grid-cols-3 border-l border-r border-b border-[#24242A] rounded-none overflow-hidden bg-[#09090B]">
            
            {/* Column 1: Proteção Antifraude */}
            <motion.div variants={fadeUp} className="flex flex-col border-b md:border-b-0 md:border-r border-[#24242A]">
              {/* Illustration Top */}
              <div 
                className="h-[220px] md:h-[260px] border-b border-[#24242A] flex items-center justify-center relative overflow-hidden bg-[#09090B]/50"
                style={{
                  backgroundImage: 'radial-gradient(#24242A 1.1px, transparent 1.1px)',
                  backgroundSize: '18px 18px',
                  backgroundPosition: 'center'
                }}
              >
                {/* Risk Transaction List Mockup */}
                <motion.div 
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ type: "spring", stiffness: 150, damping: 25 }}
                  className="w-[240px] bg-[#0E0E11] rounded-xl p-4 flex flex-col gap-2 select-none text-left shadow-2xl relative z-10"
                >
                  <div className="flex justify-between items-center text-[10px] bg-[#09090B] px-2.5 py-2 rounded-lg">
                    <span className="font-semibold text-[#F5F5F7]">Lucas de Sousa</span>
                    <span className="px-2 py-0.5 rounded-full text-[8px] font-semibold bg-[#3F6DF7]/10 text-[#3F6DF7] flex items-center gap-1">
                      <svg className="w-2.5 h-2.5 text-[#3F6DF7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
                        <motion.path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }} />
                      </svg>
                      Aprovado
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] bg-[#09090B] px-2.5 py-2 rounded-lg">
                    <span className="font-semibold text-[#F5F5F7]">Carlos Pereira</span>
                    <span className="px-2 py-0.5 rounded-full text-[8px] font-semibold bg-[#3F6DF7]/10 text-[#3F6DF7] flex items-center gap-1">
                      <svg className="w-2.5 h-2.5 text-[#3F6DF7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
                        <motion.path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3, delay: 0.5 }} />
                      </svg>
                      Aprovado
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] bg-[#09090B] px-2.5 py-2 rounded-lg">
                    <div className="flex flex-col">
                      <span className="font-semibold text-[#F5F5F7]">Compra Suspeita</span>
                      <span className="text-[7.5px] text-[#71717A]">Cartão clonado</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[8px] font-semibold bg-white/5 text-[#A1A1AA] flex items-center gap-1">
                      <svg className="w-2.5 h-2.5 text-[#71717A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
                        <motion.path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3, delay: 1.0 }} />
                      </svg>
                      Bloqueado
                    </span>
                  </div>
                </motion.div>
              </div>
              
              {/* Copy Bottom */}
              <div className="p-8 md:p-10 flex flex-col justify-start text-left flex-1 bg-[#09090B]">
                <h3 className="text-[18px] md:text-[20px] font-semibold text-[#F5F5F7] tracking-tight leading-snug mb-3">
                  Antifraude inteligente.
                </h3>
                <p className="text-[13.5px] md:text-[14.5px] text-[#F5F5F7] leading-relaxed">
                  Aprovação rápida e eficiente com antifraude de última geração para proteger a sua operação de forma segura.
                </p>
              </div>
            </motion.div>

            {/* Column 2: Check-out Integrado */}
            <motion.div variants={fadeUp} className="flex flex-col border-b md:border-b-0 md:border-r border-[#24242A]">
              {/* Illustration Top */}
              <div 
                className="h-[220px] md:h-[260px] border-b border-[#24242A] flex items-center justify-center relative overflow-hidden bg-[#09090B]/50"
                style={{
                  backgroundImage: 'radial-gradient(#24242A 1.1px, transparent 1.1px)',
                  backgroundSize: '18px 18px',
                  backgroundPosition: 'center'
                }}
              >
                {/* Custom Domain Browser Mockup */}
                <motion.div 
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ type: "spring", stiffness: 150, damping: 25 }}
                  className="w-[240px] bg-[#0E0E11] rounded-xl overflow-hidden shadow-2xl flex flex-col text-left select-none"
                >
                  <div className="bg-[#111114] px-3.5 py-2.5 flex items-center gap-1.5">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                    </div>
                    <div className="flex-1 bg-[#09090B] rounded-lg px-2.5 py-1 text-[8.5px] text-[#A1A1AA] flex items-center gap-1.5 font-mono truncate">
                      <svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-[#71717A]">
                        {/* Locking/unlocking shackle animation */}
                        <motion.path 
                          d="M7 11V7a5 5 0 0 1 10 0v4" 
                          stroke="currentColor" 
                          strokeWidth="3.5" 
                          animate={{ y: checkoutTab === "card" ? 0 : -1.5 }} 
                          transition={{ duration: 0.4 }} 
                        />
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" fill="currentColor"/>
                      </svg>
                      <span>pay.sualoja.com/checkout</span>
                    </div>
                  </div>
                  <div className="p-3.5 flex flex-col gap-2 relative">
                    {/* Credit Card Row */}
                    <div className="relative flex justify-between items-center text-[9px] text-[#71717A] bg-[#09090B] px-3 py-2.5 rounded-lg overflow-hidden transition-all duration-350">
                      {checkoutTab === "card" && (
                        <motion.div 
                          layoutId="checkoutHighlight" 
                          className="absolute inset-0 bg-[#3F6DF7]/5 z-0" 
                          transition={{ type: "spring", stiffness: 200, damping: 25 }}
                        />
                      )}
                      <span className="z-10 relative">Cartão de Crédito</span>
                      <span className="font-mono text-[#F5F5F7] z-10 relative flex items-center gap-1.5">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[#71717A]">
                          <rect x="2" y="5" width="20" height="14" rx="2" />
                          <line x1="2" y1="10" x2="22" y2="10" />
                        </svg>
                        •••• 4321
                      </span>
                    </div>
                    {/* Pix Row */}
                    <div className="relative flex justify-between items-center text-[9px] text-[#71717A] bg-[#09090B] px-3 py-2.5 rounded-lg overflow-hidden transition-all duration-350">
                      {checkoutTab === "pix" && (
                        <motion.div 
                          layoutId="checkoutHighlight" 
                          className="absolute inset-0 bg-[#3F6DF7]/5 z-0" 
                          transition={{ type: "spring", stiffness: 200, damping: 25 }}
                        />
                      )}
                      <span className="z-10 relative">Pix Copia e Cola</span>
                      <div className="z-10 relative flex items-center gap-1.5">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[#71717A]">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#3F6DF7]" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Copy Bottom */}
              <div className="p-8 md:p-10 flex flex-col justify-start text-left flex-1 bg-[#09090B]">
                <h3 className="text-[18px] md:text-[20px] font-semibold text-[#F5F5F7] tracking-tight leading-snug mb-3">
                  Checkout no seu domínio.
                </h3>
                <p className="text-[13.5px] md:text-[14.5px] text-[#F5F5F7] leading-relaxed">
                  Checkout do seu jeito. Tecnologia, estabilidade e velocidade para vender mais todos os dias com conversão máxima.
                </p>
              </div>
            </motion.div>

            {/* Column 3: Assinaturas */}
            <motion.div variants={fadeUp} className="flex flex-col">
              {/* Illustration Top */}
              <div 
                className="h-[220px] md:h-[260px] border-b border-[#24242A] flex items-center justify-center relative overflow-hidden bg-[#09090B]/50"
                style={{
                  backgroundImage: 'radial-gradient(#24242A 1.1px, transparent 1.1px)',
                  backgroundSize: '18px 18px',
                  backgroundPosition: 'center'
                }}
              >
                {/* Instant Payout Widget */}
                <motion.div 
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ type: "spring", stiffness: 150, damping: 25 }}
                  className="w-[240px] bg-[#0E0E11] rounded-xl p-4 flex flex-col gap-3 shadow-2xl text-left select-none"
                >
                  <div className="flex justify-between items-baseline">
                    <span className="text-[8.5px] text-[#71717A] uppercase font-bold">Saldo disponível</span>
                    <motion.span 
                      key={withdrawBalance}
                      className="text-[14px] font-bold text-[#F5F5F7]"
                    >
                      R$ {withdrawBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </motion.span>
                  </div>
                  
                  {/* Action Button States */}
                  <div className="h-[28px] rounded-lg bg-[#3F6DF7] text-white text-[9.5px] font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-[#3F6DF7]/15 overflow-hidden relative">
                    {withdrawStep === 0 && (
                      <motion.span 
                        key="idle"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1"
                      >
                        Transferir via Pix
                      </motion.span>
                    )}
                    {withdrawStep === 1 && (
                      <motion.span 
                        key="loading"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center"
                      >
                        <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      </motion.span>
                    )}
                    {withdrawStep === 2 && (
                      <motion.span 
                        key="success"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1 text-white font-bold"
                      >
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
                          <motion.path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
                        </svg>
                        Saque Realizado
                      </motion.span>
                    )}
                  </div>
                  
                  {/* Status List with Ripple Dot */}
                  <motion.div 
                    animate={{ opacity: withdrawStep === 2 ? 1 : 0.1, y: withdrawStep === 2 ? 0 : 2 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center gap-2 text-[9px] text-[#71717A] bg-[#09090B] px-3 py-2.5 rounded-lg relative overflow-hidden"
                  >
                    <div className="relative w-1.5 h-1.5 flex items-center justify-center shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3F6DF7]" />
                      {withdrawStep === 2 && (
                        <motion.span 
                          initial={{ scale: 0.8, opacity: 0.8 }}
                          animate={{ scale: 2.8, opacity: 0 }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                          className="absolute w-1.5 h-1.5 rounded-full bg-[#3F6DF7]" 
                        />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-[#F5F5F7]">Pix enviado com sucesso</span>
                      <span className="text-[7.5px] text-[#71717A]">{withdrawStep === 2 ? "há 2 segundos" : "aguardando saque"}</span>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
              
              {/* Copy Bottom */}
              <div className="p-8 md:p-10 flex flex-col justify-start text-left flex-1 bg-[#09090B]">
                <h3 className="text-[18px] md:text-[20px] font-semibold text-[#F5F5F7] tracking-tight leading-snug mb-3">
                  Saque instantâneo.
                </h3>
                <p className="text-[13.5px] md:text-[14.5px] text-[#F5F5F7] leading-relaxed">
                  Com a Asset, seus saques são instantâneos, seguros e sem burocracia — porque escala de verdade não pode esperar.
                </p>
              </div>
            </motion.div>

          </motion.div>
        </div>

        {/* Bottom Hatching Divider */}
        <div className="w-full h-12 bg-hatching border-b border-[#24242A] relative z-20 shrink-0" />

        {/* Testimonials Section */}
        <div 
          className="w-full bg-[#09090B] border-b border-[#24242A] px-6 md:px-[52px] py-20 md:py-28 relative z-20 overflow-hidden"
          style={{
            backgroundImage: 'radial-gradient(#24242A 1.1px, transparent 1.1px)',
            backgroundSize: '18px 18px',
            backgroundPosition: 'center 0px'
          }}
        >
          {/* Header */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={vp}
            
            className="flex flex-col items-center mb-16 relative z-10">
            <motion.h2 variants={fadeUp} className="text-[36px] sm:text-[42px] md:text-[48px] lg:text-[52px] font-normal text-[#F5F5F7] text-center max-w-[720px] mx-auto tracking-tight leading-[1.08] mb-4">
              Performance que vira reconhecimento.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[14px] md:text-[15px] text-[#F5F5F7] text-center max-w-[580px] mx-auto leading-relaxed">
              Na Asset, resultados não passam despercebidos. Quem escala, bate metas e constrói números consistentes recebe placas oficiais de premiação — um reconhecimento tangível da performance que transforma vendas em crescimento real.
            </motion.p>
          </motion.div>

          {/* Marquee Wrapper with side fade gradients */}
          <div className="relative w-full overflow-hidden py-4 mb-12 select-none flex flex-col gap-6">
            {/* Fade Gradients */}
            <div className="absolute top-0 bottom-0 left-0 w-[60px] md:w-[140px] bg-gradient-to-r from-[#09090B] via-[#09090B]/90 to-transparent z-20 pointer-events-none" />
            <div className="absolute top-0 bottom-0 right-0 w-[60px] md:w-[140px] bg-gradient-to-l from-[#09090B] via-[#09090B]/90 to-transparent z-20 pointer-events-none" />
            
            {/* Styles for marquee */}
            <style>{`
              @keyframes marquee-left {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
              }
              @keyframes marquee-right {
                0% { transform: translateX(-50%); }
                100% { transform: translateX(0%); }
              }
              .marquee-row-left {
                display: flex;
                width: max-content;
                animation: marquee-left 32s linear infinite;
              }
              .marquee-row-right {
                display: flex;
                width: max-content;
                animation: marquee-right 32s linear infinite;
              }
              .marquee-row-left:hover, .marquee-row-right:hover {
                animation-play-state: paused;
              }
            `}</style>

            {/* Row 1: Scrolling Left */}
            <div className="marquee-row-left gap-6">
              {[
                {
                  name: "Daniel Reis",
                  handle: "@danielreis_dev",
                  initials: "DR",
                  bg: "bg-[#3F6DF7]/15 text-[#3F6DF7]",
                  text: "Se você precisa integrar pagamentos de forma ágil no seu app, o Asset Pay é disparado a melhor DX e suporte que você vai encontrar. Sem burocracia nenhuma."
                },
                {
                  name: "Brahma",
                  handle: "@CODIGOBRAHMA",
                  initials: "B",
                  bg: "bg-[#E2E8F0]/10 text-[#E2E8F0]",
                  text: "Incrível como é fácil implementar a API, qualquer idiota (eu) consegue usar. Ficou nível Stripe de facilidade."
                },
                {
                  name: "Micael Marques",
                  handle: "@micaelmrsilva",
                  initials: "MM",
                  bg: "bg-[#3F6DF7]/10 text-[#3F6DF7]",
                  text: "Nunca integrei tão fácil uma API como com o @assetpay. As empresas brasileiras deveriam aprender com o nível de simplicidade deles..."
                },
                {
                  name: "Gabi Dev",
                  handle: "@gabicodes",
                  initials: "GD",
                  bg: "bg-[#3F6DF7]/15 text-[#3F6DF7]",
                  text: "Finalmente um gateway de pagamento feito por devs para devs no Brasil. Sem burocracia jurídica na integração."
                },
                {
                  name: "Arthur Ramos",
                  handle: "@arthur_ram",
                  initials: "AR",
                  bg: "bg-[#E2E8F0]/10 text-[#E2E8F0]",
                  text: "Sério, a API de Pix deles é instantânea. O webhook nunca falhou uma única vez em 4 meses rodando em prod."
                },
                {
                  name: "Clara N.",
                  handle: "@clara_startup",
                  initials: "CN",
                  bg: "bg-[#3F6DF7]/10 text-[#3F6DF7]",
                  text: "Migramos nosso checkout recorrente para o Asset Pay e o churn diminuiu porque a experiência é muito mais fluida."
                }
              ].concat([
                {
                  name: "Daniel Reis",
                  handle: "@danielreis_dev",
                  initials: "DR",
                  bg: "bg-[#3F6DF7]/15 text-[#3F6DF7]",
                  text: "Se você precisa integrar pagamentos de forma ágil no seu app, o Asset Pay é disparado a melhor DX e suporte que você vai encontrar. Sem burocracia nenhuma."
                },
                {
                  name: "Brahma",
                  handle: "@CODIGOBRAHMA",
                  initials: "B",
                  bg: "bg-[#E2E8F0]/10 text-[#E2E8F0]",
                  text: "Incrível como é fácil implementar a API, qualquer idiota (eu) consegue usar. Ficou nível Stripe de facilidade."
                },
                {
                  name: "Micael Marques",
                  handle: "@micaelmrsilva",
                  initials: "MM",
                  bg: "bg-[#3F6DF7]/10 text-[#3F6DF7]",
                  text: "Nunca integrei tão fácil uma API como com o @assetpay. As empresas brasileiras deveriam aprender com o nível de simplicidade deles..."
                },
                {
                  name: "Gabi Dev",
                  handle: "@gabicodes",
                  initials: "GD",
                  bg: "bg-[#3F6DF7]/15 text-[#3F6DF7]",
                  text: "Finalmente um gateway de pagamento feito por devs para devs no Brasil. Sem burocracia jurídica na integração."
                },
                {
                  name: "Arthur Ramos",
                  handle: "@arthur_ram",
                  initials: "AR",
                  bg: "bg-[#E2E8F0]/10 text-[#E2E8F0]",
                  text: "Sério, a API de Pix deles é instantânea. O webhook nunca falhou uma única vez em 4 meses rodando em prod."
                },
                {
                  name: "Clara N.",
                  handle: "@clara_startup",
                  initials: "CN",
                  bg: "bg-[#3F6DF7]/10 text-[#3F6DF7]",
                  text: "Migramos nosso checkout recorrente para o Asset Pay e o churn diminuiu porque a experiência é muito mais fluida."
                }
              ]).map((dep, idx) => (
                <div 
                  key={idx}
                  className="w-[290px] md:w-[340px] shrink-0 bg-[#111114] rounded-2xl p-6 flex flex-col justify-between transition-all duration-250 hover:scale-[1.02] shadow-[0_6px_16px_rgba(0,0,0,0.3)] whitespace-normal"
                >
                  <div>
                    {/* User Profile info */}
                    <div className="flex items-center gap-3.5 mb-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border select-none shadow-sm ${
                        dep.bg.includes('#3F6DF7') 
                          ? 'bg-[#3F6DF7] border-white/40' 
                          : 'bg-[#F5F5F7] border-[#3F6DF7]/40'
                      }`}>
                        <svg width="15" height="15" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16 5L26 15H20L16 11L12 15H6L16 5Z" fill={dep.bg.includes('#3F6DF7') ? "#FFFFFF" : "#09090B"} />
                          <path d="M16 15L26 25H20L16 21L12 25H6L16 15Z" fill={dep.bg.includes('#3F6DF7') ? "#FFFFFF" : "#3F6DF7"} />
                        </svg>
                      </div>
                      <div className="flex flex-col text-left leading-tight">
                        <span className="text-[#F5F5F7] font-semibold text-[14px]">{dep.name}</span>
                        <span className="text-[#71717A] text-[12px]">{dep.handle}</span>
                      </div>
                    </div>
                    {/* Testimonial Text */}
                    <p className="text-[13.5px] md:text-[14px] text-[#F5F5F7] text-left leading-relaxed">
                      {dep.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Row 2: Scrolling Right */}
            <div className="marquee-row-right gap-6">
              {[
                {
                  name: "Lucas Silva",
                  handle: "@lucassilva_dev",
                  initials: "LS",
                  bg: "bg-[#E2E8F0]/10 text-[#E2E8F0]",
                  text: "Documentação extremamente clara e objetiva. Em menos de 10 minutos já estava com o ambiente de testes rodando perfeitamente!"
                },
                {
                  name: "Matheus",
                  handle: "@LopeMatheusC",
                  initials: "M",
                  bg: "bg-[#3F6DF7]/15 text-[#3F6DF7]",
                  text: "Realmente a api dos caras é bala pra integrar. (Amanhã já vai estar rodando em produção)"
                },
                {
                  name: "mat.dev",
                  handle: "@Mathp__",
                  initials: "MD",
                  bg: "bg-[#E2E8F0]/10 text-[#E2E8F0]",
                  text: "A taxa é muito pequena em relação a outras gateways de pagamento. R$ 0,80 fixo por transação é sensacional. É um gateway que vai crescer muito."
                },
                {
                  name: "Rafael Souza",
                  handle: "@rafa_code",
                  initials: "RS",
                  bg: "bg-[#3F6DF7]/10 text-[#3F6DF7]",
                  text: "Suporte no WhatsApp me ajudou às 23h de um domingo. Onde mais você consegue esse nível de atenção? Recomendo demais."
                },
                {
                  name: "Letícia Sales",
                  handle: "@let_startup",
                  initials: "LS",
                  bg: "bg-[#E2E8F0]/10 text-[#E2E8F0]",
                  text: "O painel deles é incrivelmente clean. Consigo ver todas as métricas de conversão do checkout sem precisar de relatórios complexos."
                },
                {
                  name: "Pedro L.",
                  handle: "@pedro_pm",
                  initials: "PL",
                  bg: "bg-[#3F6DF7]/15 text-[#3F6DF7]",
                  text: "O link de pagamento deles converte muito. O cliente final não precisa criar conta nem fazer login para pagar."
                }
              ].concat([
                {
                  name: "Lucas Silva",
                  handle: "@lucassilva_dev",
                  initials: "LS",
                  bg: "bg-[#E2E8F0]/10 text-[#E2E8F0]",
                  text: "Documentação extremamente clara e objetiva. Em menos de 10 minutos já estava com o ambiente de testes rodando perfeitamente!"
                },
                {
                  name: "Matheus",
                  handle: "@LopeMatheusC",
                  initials: "M",
                  bg: "bg-[#3F6DF7]/15 text-[#3F6DF7]",
                  text: "Realmente a api dos caras é bala pra integrar. (Amanhã já vai estar rodando em produção)"
                },
                {
                  name: "mat.dev",
                  handle: "@Mathp__",
                  initials: "MD",
                  bg: "bg-[#E2E8F0]/10 text-[#E2E8F0]",
                  text: "A taxa é muito pequena em relação a outras gateways de pagamento. R$ 0,80 fixo por transação é sensacional. É um gateway que vai crescer muito."
                },
                {
                  name: "Rafael Souza",
                  handle: "@rafa_code",
                  initials: "RS",
                  bg: "bg-[#3F6DF7]/10 text-[#3F6DF7]",
                  text: "Suporte no WhatsApp me ajudou às 23h de um domingo. Onde mais você consegue esse nível de atenção? Recomendo demais."
                },
                {
                  name: "Letícia Sales",
                  handle: "@let_startup",
                  initials: "LS",
                  bg: "bg-[#E2E8F0]/10 text-[#E2E8F0]",
                  text: "O painel deles é incrivelmente clean. Consigo ver todas as métricas de conversão do checkout sem precisar de relatórios complexos."
                },
                {
                  name: "Pedro L.",
                  handle: "@pedro_pm",
                  initials: "PL",
                  bg: "bg-[#3F6DF7]/15 text-[#3F6DF7]",
                  text: "O link de pagamento deles converte muito. O cliente final não precisa criar conta nem fazer login para pagar."
                }
              ]).map((dep, idx) => (
                <div 
                  key={idx}
                  className="w-[290px] md:w-[340px] shrink-0 bg-[#111114] rounded-2xl p-6 flex flex-col justify-between transition-all duration-250 hover:scale-[1.02] shadow-[0_6px_16px_rgba(0,0,0,0.3)] whitespace-normal"
                >
                  <div>
                    {/* User Profile info */}
                    <div className="flex items-center gap-3.5 mb-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border select-none shadow-sm ${
                        dep.bg.includes('#3F6DF7') 
                          ? 'bg-[#3F6DF7] border-white/40' 
                          : 'bg-[#F5F5F7] border-[#3F6DF7]/40'
                      }`}>
                        <svg width="15" height="15" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16 5L26 15H20L16 11L12 15H6L16 5Z" fill={dep.bg.includes('#3F6DF7') ? "#FFFFFF" : "#09090B"} />
                          <path d="M16 15L26 25H20L16 21L12 25H6L16 15Z" fill={dep.bg.includes('#3F6DF7') ? "#FFFFFF" : "#3F6DF7"} />
                        </svg>
                      </div>
                      <div className="flex flex-col text-left leading-tight">
                        <span className="text-[#F5F5F7] font-semibold text-[14px]">{dep.name}</span>
                        <span className="text-[#71717A] text-[12px]">{dep.handle}</span>
                      </div>
                    </div>
                    {/* Testimonial Text */}
                    <p className="text-[13.5px] md:text-[14px] text-[#F5F5F7] text-left leading-relaxed">
                      {dep.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center relative z-10">
            <button className="h-[42px] px-6 rounded-full bg-[#111114] border border-[#24242A] hover:border-[#3F6DF7] hover:bg-[#3F6DF7]/5 text-[#F5F5F7] font-semibold text-[13.5px] transition-all duration-250 cursor-pointer select-none">
              Ver mais histórias
            </button>
          </div>
        </div>

        {/* Bottom Hatching Divider */}
        <div className="w-full h-12 bg-hatching border-b border-[#24242A] relative z-20 shrink-0" />

        {/* Support Section */}
        <div className="w-full bg-[#09090B] px-6 md:px-[52px] py-20 md:py-28 relative z-20 overflow-hidden border-b border-[#24242A]">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={vp}
            
            className="max-w-[1176px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left Column: Premium Live Support Mockup */}
            <motion.div variants={fadeUpSlow} className="w-full relative">
              
              {/* Browser/App container */}
              <div className="relative bg-[#111114] border border-[#24242A] rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                {/* Dashboard / Workspace Area */}
                <div className="grid grid-cols-4 h-[360px] text-left">
                  {/* Sidebar mockup */}
                  <div className="col-span-1 border-r border-[#24242A] bg-[#131316] p-3.5 flex flex-col justify-between h-full">
                    <div className="flex flex-col gap-2.5">
                      {/* Logo placeholder */}
                      <div className="h-5 w-16 bg-[#24242A] rounded mb-4" />
                      {/* Menu items */}
                      <div className="h-7 rounded bg-[#24242A]/20" />
                      <div className="h-7 rounded bg-[#24242A]/20" />
                      {/* Active tab */}
                      <div className="h-7 rounded bg-[#24242A] flex items-center px-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#71717A] mr-2" />
                        <div className="h-2 w-12 bg-[#71717A]/60 rounded" />
                      </div>
                    </div>
                    {/* User profile item */}
                    <div className="flex items-center gap-2 pt-3 border-t border-[#24242A]">
                      <div className="w-6 h-6 rounded-full bg-[#24242A]" />
                      <div className="h-2 w-10 bg-[#24242A] rounded" />
                    </div>
                  </div>

                  {/* Chat interface */}
                  <div className="col-span-3 p-5 flex flex-col justify-between bg-[#111114] h-full overflow-hidden">
                    {/* Header info */}
                    <div className="flex items-center justify-between pb-3 border-b border-[#24242A] mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-semibold text-[#F5F5F7]">Atendimento via WhatsApp</span>
                      </div>
                      <span className="text-[10px] text-[#71717A]">Dev-to-Dev Support</span>
                    </div>

                    {/* Messages Body with super smooth custom Framer Motion transitions */}
                    <div className="flex flex-col gap-3 flex-1 overflow-y-auto mb-4 text-[12.5px] leading-relaxed select-none">
                      {/* Spacer to push items to the bottom naturally without layout shifting */}
                      <div className="flex-grow" />

                      {/* Incoming Msg 1 */}
                      {chatStep >= 0 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          className="bg-[#18181C] p-3 rounded-lg rounded-tl-none border border-[#24242A]/60 max-w-[85%]"
                        >
                          <p className="text-[#E2E8F0] font-normal">Olá! Já estamos analisando seu log de integração. Qual o ID da transação que deu erro?</p>
                        </motion.div>
                      )}

                      {/* Typing indicator for Dev (outgoing) */}
                      {chatStep === 0 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="bg-[#24242A] p-3 rounded-lg rounded-tr-none self-end flex items-center gap-1"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#71717A] animate-bounce [animation-delay:-0.3s]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#71717A] animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#71717A] animate-bounce" />
                        </motion.div>
                      )}

                      {/* Outgoing Msg 2 */}
                      {chatStep >= 1 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          className="bg-[#24242A] p-3 rounded-lg rounded-tr-none self-end max-w-[85%]"
                        >
                          <p className="text-[#E2E8F0] font-normal">O ID é tx_829a1b. Ele retorna status 400 no webhook de retorno de cobrança.</p>
                        </motion.div>
                      )}

                      {/* Typing indicator for Support (incoming) */}
                      {chatStep === 1 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="bg-[#18181C] p-3 rounded-lg rounded-tl-none border border-[#24242A]/60 flex items-center gap-1 w-fit"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#71717A] animate-bounce [animation-delay:-0.3s]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#71717A] animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#71717A] animate-bounce" />
                        </motion.div>
                      )}

                      {/* Incoming Msg Response 3 */}
                      {chatStep >= 2 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          className="bg-[#18181C] p-3 rounded-lg rounded-tl-none border border-[#24242A]/60 max-w-[85%]"
                        >
                          <p className="text-[#E2E8F0] font-normal">Ah, entendi! O header está sem o token de validação. Adicione o bearer token no seu webhook e tente novamente. Deve funcionar agora!</p>
                        </motion.div>
                      )}
                    </div>

                    {/* Input bar */}
                    <div className="flex items-center gap-2 bg-[#18181C] border border-[#24242A] rounded-lg p-1.5">
                      <div className="flex-1 px-2 text-[11.5px] text-[#55555C] select-none text-left">
                        Digite sua mensagem...
                      </div>
                      <button className="h-7 px-3 bg-[#131316] hover:bg-[#18181C] transition-colors border border-[#24242A] rounded text-[#E2E8F0] text-[11px] font-semibold flex items-center justify-center cursor-pointer">
                        Enviar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Support Copy Content */}
            <motion.div variants={fadeUp} className="flex flex-col text-left items-start">


              {/* Title */}
              <h2 className="text-[36px] sm:text-[42px] md:text-[48px] lg:text-[52px] font-normal text-[#F5F5F7] tracking-tight leading-[1.08] mb-6">
                Seu negócio não para.
                <span className="block text-shine font-normal mt-1">A gente também não.</span>
              </h2>

              {/* Subtitle */}
              <p className="text-[14px] md:text-[15.5px] text-[#F5F5F7] leading-relaxed mb-8">
                Gerente exclusivo e taxas sob medida. Na Asset, seu negócio é tratado com a atenção que merece, com suporte rápido e eficiente diretamente com quem entende do assunto.
              </p>

              {/* Action Button Link */}
              <a 
                href="#contato"
                className="flex items-center gap-1 text-[#F5F5F7] hover:text-[#F5F5F7] font-semibold text-[14px] border-b border-[#24242A] pb-0.5 w-fit transition-all duration-200 group"
              >
                Entre em contato
                <span className="transform group-hover:translate-x-0.5 transition-transform duration-200">→</span>
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Hatching Divider */}
        <div className="w-full h-12 bg-hatching border-b border-[#24242A] relative z-20 shrink-0" />

        {/* FAQ Section */}
        <div className="w-full bg-[#09090B] px-6 md:px-[52px] py-20 md:py-28 relative z-20 border-b border-[#24242A]">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={vp}
            
            className="max-w-[1176px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            
            {/* Left Column: FAQ Copy */}
            <motion.div variants={fadeUp} className="flex flex-col text-left items-start lg:sticky lg:top-24">
              <h2 className="text-[36px] sm:text-[42px] md:text-[48px] lg:text-[52px] font-normal text-[#F5F5F7] tracking-tight leading-[1.08] mb-6">
                Perguntas <span className="text-shine font-normal">Frequentes.</span>
              </h2>
              <p className="text-[14px] md:text-[15.5px] text-[#F5F5F7] leading-relaxed">
                Tudo o que você precisa saber sobre as taxas, aprovação e funcionamento da Asset.
              </p>
            </motion.div>

            {/* Right Column: Interactive Accordion List */}
            <motion.div variants={fadeUp} className="w-full border-t border-[#24242A]">
              {[
                {
                  question: "A Asset aplica alguma taxa além das mencionadas?",
                  answer: "Na Asset, prezamos pela total transparência com nossos clientes. As taxas para Pix, antecipação via Pix, cartão de crédito e antecipação de cartão de crédito são as únicas que cobramos."
                },
                {
                  question: "Quantos produtos posso vender pela Asset?",
                  answer: "Não há limite para o número de produtos digitais que você pode criar e vender na Asset."
                },
                {
                  question: "Quanto tempo demora para aprovar meu produto?",
                  answer: "A aprovação de produtos na Asset é rápida e eficiente. O processo pode ocorrer em até 24 horas úteis, garantindo que você possa iniciar suas vendas o quanto antes."
                },
                {
                  question: "Quanto tempo demora para o meu cadastro ser aprovado na plataforma?",
                  answer: "Após concluir o seu cadastro e salvar os dados inseridos, nossa equipe realizará uma análise minuciosa para garantir a precisão e conformidade com os comprovantes solicitados. O prazo para essa análise é de até 24 horas úteis."
                }
              ].map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={idx} className="border-b border-[#24242A]">
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full flex items-start gap-4 py-5 text-left text-[#F5F5F7] hover:text-white transition-colors cursor-pointer select-none"
                    >
                      {/* Bouncing/rotating Plus symbol */}
                      <span className="mt-1 shrink-0 flex items-center justify-center">
                        <motion.span
                          animate={{ rotate: isOpen ? 45 : 0 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="text-[18px] leading-none font-light text-[#3F6DF7]"
                        >
                          +
                        </motion.span>
                      </span>
                      <span className="text-[14px] md:text-[15.5px] font-medium leading-snug">
                        {faq.question}
                      </span>
                    </button>
                    
                    {/* Expandable Answer */}
                    <motion.div
                      initial={false}
                      animate={{ 
                        height: isOpen ? "auto" : 0,
                        opacity: isOpen ? 1 : 0
                      }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-5 pl-7 text-[13.5px] md:text-[14px] text-[#F5F5F7] leading-relaxed text-left">
                        {faq.answer}
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Hatching Divider */}
        <div className="w-full h-12 bg-hatching border-b border-[#24242A] relative z-20 shrink-0" />

        {/* CTA Section */}
        <div className="w-full bg-[#3F6DF7] px-6 md:px-[52px] py-16 md:py-24 relative z-20 overflow-hidden border-b border-[#24242A]">
          {/* Full Banner Edge-to-Edge Coins Background (100% Opacity, shifted further right) */}
          <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden">
            <img 
              src="/coins.webp" 
              alt="Coins Background" 
              className="w-full h-full object-cover object-center translate-x-28 md:translate-x-52 scale-110 opacity-100" 
            />
            {/* Soft blue gradient overlay ensuring left text legibility while coins fill edge to edge */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#3F6DF7] via-[#3F6DF7]/70 to-transparent" />
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={vp}
            className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-10 relative z-10"
          >
            {/* Left Column: Text */}
            <motion.div variants={fadeUp} className="flex flex-col text-left items-start z-10 max-w-[580px]">
              <h2 className="text-[38px] md:text-[50px] lg:text-[54px] font-normal text-white tracking-tight leading-[1.08] mb-5">
                Suas vendas merecem
                <span className="block font-bold text-white mt-1">mais velocidade.</span>
              </h2>
              <p className="text-[14.5px] md:text-[16px] text-white leading-relaxed mb-8 max-w-[460px]">
                Comece hoje mesmo com a maior taxa de aprovação do mercado e impulsione seus resultados.
              </p>
              <ButtonWithIcon className="!h-[48px] bg-[#F5F5F7] text-[#09090B] hover:bg-white text-[14.5px] shadow-2xl">
                Criar conta agora
              </ButtonWithIcon>
            </motion.div>
          </motion.div>
        </div>

        {/* Hatching Divider below CTA */}
        <div className="w-full h-12 bg-hatching border-b border-[#24242A] relative z-20 shrink-0" />

        {/* Footer Section */}
        <footer className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 pt-24 pb-8 flex flex-col overflow-hidden bg-[#09090B] relative z-20">
          
          {/* Top Section (Grid) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-0 mb-16 md:mb-24 items-start">
            
            {/* Left Col */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col h-full text-left">
              <AnimatedText 
                text="Asset Pay é a infraestrutura de pagamentos mais rápida e estável para a sua operação. Conecte sua operação e comece a vender com alta conversão." 
                className="text-[1.1rem] leading-[1.6] text-[#a1a1aa] max-w-[420px]" 
              />
              <div className="mt-16 lg:mt-32 flex items-center gap-4">
                <a href="#instagram" className="w-[42px] h-[42px] rounded-full border border-[#333] flex items-center justify-center text-[#a1a1aa] hover:bg-white hover:text-black hover:border-white transition-all duration-300">
                  <InstagramIcon />
                </a>
                <a href="#facebook" className="w-[42px] h-[42px] rounded-full border border-[#333] flex items-center justify-center text-[#a1a1aa] hover:bg-white hover:text-black hover:border-white transition-all duration-300">
                  <FacebookIcon />
                </a>
                <a href="#linkedin" className="w-[42px] h-[42px] rounded-full border border-[#333] flex items-center justify-center text-[#a1a1aa] hover:bg-white hover:text-black hover:border-white transition-all duration-300">
                  <LinkedinIcon />
                </a>
                <a href="#twitter" className="w-[42px] h-[42px] rounded-full border border-[#333] flex items-center justify-center text-[#a1a1aa] hover:bg-white hover:text-black hover:border-white transition-all duration-300">
                  <XIcon />
                </a>
              </div>
            </div>

            {/* Right Col */}
            <div className="lg:col-span-7 xl:col-span-7 lg:col-start-6 xl:col-start-6 grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-12 w-full pt-1 lg:pt-0 text-left">
              <div>
                <h4 className="text-white font-medium text-[1.1rem] mb-6">Produtos</h4>
                <AnimatedList 
                  items={[
                    { label: "Pix", href: "#pix" },
                    { label: "Cartão", href: "#cartao" },
                    { label: "Boleto", href: "#boleto" },
                    { label: "Assinaturas", href: "#assinaturas" },
                    { label: "Checkout", href: "#checkout" }
                  ]}
                  className="flex flex-col gap-2"
                />
              </div>
              <div>
                <h4 className="text-white font-medium text-[1.1rem] mb-6">Soluções</h4>
                <AnimatedList 
                  items={[
                    { label: "SaaS", href: "#saas" },
                    { label: "Micro-SaaS", href: "#microsaas" },
                    { label: "E-commerce", href: "#ecommerce" },
                    { label: "Marketplace", href: "#marketplace" },
                    { label: "Criadores", href: "#criadores" }
                  ]}
                  className="flex flex-col gap-2"
                />
              </div>
              <div>
                <h4 className="text-white font-medium text-[1.1rem] mb-6">Recursos</h4>
                <AnimatedList 
                  items={[
                    { label: "Documentação", href: "#docs" },
                    { label: "API Status", href: "#status" },
                    { label: "Calculadora", href: "#calc" },
                    { label: "Termos", href: "#termos" },
                    { label: "Suporte", href: "#suporte" }
                  ]}
                  className="flex flex-col gap-2"
                />
              </div>
            </div>
          </div>

          {/* The Massive Center Text (Animate letter-by-letter) */}
          <MassiveText text="Asset" />


        </footer>

        {/* Final Hatching Divider */}
        <div className="w-full h-12 bg-hatching border-b border-[#24242A] relative z-20 shrink-0" />

        {/* Floating Chat Bubble Action Button (FAB) */}
        <motion.button 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: easeTransition, delay: 0.6 }}
          className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-[#3F6DF7] text-[#F5F5F7] flex items-center justify-center hover:bg-[#5C84FF] hover:scale-105 active:scale-95 transition-all duration-250 ease-premium z-50 cursor-pointer"
        >
          <MessageCircle className="w-7 h-7 stroke-[2px]" />
        </motion.button>
      </div>

      {/* Right solid dark margin with rounded top-left junction */}
      <div className="flex-1 bg-[#09090B] rounded-tl-[12px] border-b border-l border-[#24242A]" />
    </div>
  </div>
  </>
  )
}

export default App
