import { useState, useEffect, ChangeEvent, useRef, cloneElement, ReactElement } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'motion/react';
import Lenis from 'lenis';
import { 
  Menu, 
  X, 
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  Star,
  MessageSquare,
  Trophy,
  Smartphone,
  History,
  ShieldCheck,
  Target,
  Eye,
  Heart,
  MessageCircle,
  MapPin,
  Phone,
  Instagram
} from 'lucide-react';

/**
 * Counter Component for animated statistics
 */
function Counter({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let startTime: number | null = null;
      const duration = 2000; // 2 seconds

      const step = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        setCount(Math.floor(progress * value));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };

      window.requestAnimationFrame(step);
    }
  }, [isInView, value]);

  return <span ref={nodeRef}>{prefix}{count}{suffix}</span>;
}

/**
 * FAQ Item Component with sophisticated accordion animation
 */
function FAQItem({ question, answer, index }: { question: string; answer: string; index: number; key?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
      }}
      className="border-b border-black/5 last:border-0"
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-8 flex items-start gap-10 text-left group transition-all duration-700"
      >
        <span className="serif text-2xl text-black/10 group-hover:text-[#0B6EA8] transition-colors duration-700 pt-1">
          {index + 1 < 10 ? `0${index + 1}` : index + 1}
        </span>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-6">
            <h3 className={`serif text-xl md:text-2xl italic transition-colors duration-700 ${isOpen ? 'text-[#0B6EA8]' : 'text-black/80 group-hover:text-black'}`}>
              {question}
            </h3>
            <div className={`shrink-0 w-10 h-10 rounded-full border border-black/5 flex items-center justify-center transition-all duration-700 ${isOpen ? 'bg-black border-black rotate-180' : 'group-hover:border-black/20 group-hover:bg-black/5'}`}>
              <ChevronDown size={14} className={`transition-colors duration-700 ${isOpen ? 'text-white' : 'text-black/20 group-hover:text-black'}`} />
            </div>
          </div>
          
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: 'auto', opacity: 1, marginTop: 28 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="text-black/40 leading-relaxed text-[15px] max-w-2xl font-medium whitespace-pre-line">
                  {answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </button>
    </motion.div>
  );
}

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [phone, setPhone] = useState('');

  // Premium Animation Constants
  const premiumEase = [0.16, 1, 0.3, 1];
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: premiumEase }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  // Lenis Smooth Scroll Initialization
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.5,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Smooth scroll for anchors
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor && anchor.hash && anchor.origin === window.location.origin) {
        e.preventDefault();
        const targetElement = document.querySelector(anchor.hash);
        if (targetElement) {
          lenis.scrollTo(targetElement as HTMLElement, {
            offset: -100,
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      lenis.destroy();
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  const { scrollY, scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 1.05]);

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    let formatted = value;
    if (value.length > 2) {
      formatted = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    }
    if (value.length > 7) {
      formatted = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    }
    setPhone(formatted);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Início', href: '#inicio' },
    { name: 'Serviços', href: '#servicos' },
    { name: 'Diferenciais', href: '#diferenciais' },
    { name: 'Sobre Nós', href: '#sobre-nos' },
    { name: 'Essência', href: '#essencia' },
    { name: 'FAQ', href: '#faq' },
  ];

  const testimonials = [
    {
      name: "Machado & Amarante",
      role: "Condomínio Verificado | Fonte: Google",
      content: "Sistema Inteligente de Segurança altamente eficiente e eficaz. Adequado a novas tecnologias, consagrando como um excelente custo benefício. O sistema de portaria inteligente monitora seu edifício por 24 horas com extrema precisão."
    },
    {
      name: "Paulo Leonardi",
      role: "Condomínio Verificado | Fonte: Google",
      content: "Equipe muito atenciosa. Equipamentos de primeira linha e serviço de qualidade excelente. Empresa muito bem gerida, eficiente e com segurança à toda prova. Quem quer segurança de verdade no prédio deve escolher a 2S."
    },
    {
      name: "Fernando Arouca",
      role: "Condomínio Verificado | Fonte: Google",
      content: "O prédio onde moro adotou a portaria da 2S há quase 2 anos. No início há uma certa resistência à ideia, mas depois que os moradores se acostumaram nem pensam em voltar ao sistema antigo. Fora a economia gerada."
    },
    {
      name: "Henrique de Paula",
      role: "Condomínio Verificado | Fonte: Google",
      content: "Uma empresa líder no mercado e referência. Os colaboradores são extremamente educados e sempre dispostos a ajudar. A empresa é organizada, limpa e acessível. Os valores são os melhores do mercado."
    },
    {
      name: "Marcopolo Trajano",
      role: "Condomínio Verificado | Fonte: Google",
      content: "Excelente. Pessoas profissionais e local de trabalho muito sofisticado, moderno e tecnológico. Dá pra ver a operação e funcionamento da portaria remota em tempo real. Referência em tecnologia."
    },
    {
      name: "Daniel Volpe",
      role: "Condomínio Verificado | Fonte: Google",
      content: "Ótima empresa de portaria, tive a experiência através de um amigo morador de um condomínio deles, confesso que nem percebi a ausência do porteiro no local, super recomendo pela eficiência."
    }
  ];

  const [testiIndex, setTestiIndex] = useState(0);
  const nextTestimonial = () => setTestiIndex((prev) => (prev + 1) % (testimonials.length - 2));
  const prevTestimonial = () => setTestiIndex((prev) => (prev - 1 + (testimonials.length - 2)) % (testimonials.length - 2));

  return (
    <div className="min-h-screen bg-[#F7F7F4] text-[#111111] antialiased selection:bg-[#0B6EA8]/20 overflow-x-hidden">
      <motion.div 
        className="scroll-progress" 
        style={{ scaleX: scrollYProgress }} 
      />
      {/* Styles & Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');
        
        :root {
          --primary-blue: #0B6EA8;
          --bg-off-white: #F7F7F4;
        }

        body { 
          font-family: 'Instrument Sans', sans-serif;
          background-color: var(--bg-off-white);
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        .serif { font-family: 'Instrument Serif', serif; }
        .text-balanced { text-wrap: balance; }
        
        .hero-title {
          letter-spacing: -0.04em;
          line-height: 0.95;
        }

        .tracking-editorial {
          letter-spacing: 0.15em;
        }

        .shadow-premium {
          box-shadow: 0 20px 80px -20px rgba(0,0,0,0.08);
        }

        .scroll-progress {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: #0B6EA8;
          transform-origin: 0%;
          z-index: 100;
        }
      `}</style>

      {/* Header */}
      <header className="fixed top-4 md:top-8 left-0 w-full z-50 px-4 md:px-12 pointer-events-none">
        <nav 
          aria-label="Navegação Principal"
          className={`max-w-6xl mx-auto flex items-center justify-between px-6 md:px-8 py-3 rounded-full transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-auto border ${
            isScrolled 
              ? 'bg-white/80 backdrop-blur-xl border-black/5 shadow-premium' 
              : 'bg-white/5 backdrop-blur-sm border-white/10'
          }`}
        >
          {/* Logo Restoration */}
          <div className="flex items-center group cursor-pointer pointer-events-auto h-10 md:h-12">
            <a href="#inicio" aria-label="Voltar para o início" className="h-full w-auto relative flex items-center">
              <img 
                src="images/logo-2s.png" 
                alt="2S Portaria Logo" 
                width="140"
                height="48"
                className={`h-full w-auto object-contain transition-all duration-700 ${isScrolled ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute'}`}
                loading="eager"
              />
              <img 
                src="images/logo-2s-white.png" 
                alt="2S Portaria Logo Branca" 
                width="140"
                height="48"
                className={`h-full w-auto object-contain transition-all duration-700 ${!isScrolled ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute'}`}
                loading="eager"
              />
            </a>
          </div>

          {/* Nav Links */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link, idx) => (
              <a 
                key={link.name} 
                href={link.href}
                className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 hover:tracking-[0.35em] ${
                  isScrolled 
                    ? idx === 0 ? 'text-[#0B6EA8]' : 'text-black/40 hover:text-black' 
                    : idx === 0 ? 'text-white' : 'text-white/40 hover:text-white'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <button className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-700 pointer-events-auto active:scale-[0.98] ${
              isScrolled 
                ? 'bg-[#0B6EA8] text-white hover:bg-black shadow-lg shadow-[#0B6EA8]/10' 
                : 'bg-white text-black hover:bg-[#0B6EA8] hover:text-white'
            }`}>
              Solicitar proposta
            </button>
          </div>

          {/* Mobile Toggle */}
          <button 
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            className={`lg:hidden p-2 transition-colors duration-500 pointer-events-auto ${isScrolled ? 'text-black' : 'text-white'}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="lg:hidden absolute top-20 left-6 right-6 bg-white rounded-[1.5rem] shadow-2xl overflow-hidden pointer-events-auto border border-black/5"
            >
              <div className="p-8 flex flex-col gap-6">
                {navLinks.map((link) => (
                  <a key={link.name} href={link.href} className="text-xl font-normal serif text-black">{link.name}</a>
                ))}
                <div className="h-px w-full bg-black/5" />
                <button className="w-full py-4 rounded-xl bg-black text-white font-bold uppercase tracking-widest text-[10px]">
                  Solicitar proposta
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section - Full Bleed */}
      <section id="inicio" className="relative w-full h-[110vh] flex flex-col items-center justify-center overflow-hidden bg-black">
        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="absolute inset-0 z-0 will-change-transform"
        >
          {/* Background Image - Performance Optimized */}
          <img 
            src="images/fundo-hero.jpg"
            alt="Arquitetura premium representando segurança"
            loading="eager"
            fetchPriority="high"
            width="1920"
            height="1080"
            className="w-full h-full object-cover object-center opacity-40 grayscale-[0.3]"
            referrerPolicy="no-referrer"
          />
          {/* Sophisticated Overlay - Multi-layered for depth */}
          <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-black/20" />
        </motion.div>
          
        {/* Content Overlay */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center text-white pb-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Refined Headline */}
            <h1 className="serif text-[clamp(2.5rem,8vw,7.5rem)] font-light italic hero-title text-balanced tracking-tight">
              Reduzimos custos.<br />
              <span className="opacity-50">Elevamos segurança.</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Form Section - Extremely Compact & Clean */}
      <section id="contato" className="relative z-20 -mt-32 px-6 md:px-12 pb-32">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="bg-white rounded-[3rem] p-10 md:p-14 shadow-premium border border-black/5"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-14 pb-10 border-b border-black/5">
              <div className="text-center md:text-left">
                <h2 className="serif text-4xl md:text-5xl italic font-normal leading-none mb-3">Faça seu orçamento</h2>
                <p className="text-black/30 text-[9px] font-black tracking-[0.4em] uppercase">Proposta personalizada sob medida</p>
              </div>
              <button className="w-full md:w-auto px-12 h-14 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#0B6EA8] active:scale-[0.98] transition-all duration-700 flex items-center justify-center gap-4 group">
                Solicitar Agora <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 md:gap-x-12 gap-y-8 md:gap-y-10" onSubmit={(e) => e.preventDefault()}>
              {[
                { id: 'nome', label: 'Nome completo', placeholder: 'Seu nome', type: 'text', autocomplete: 'name' },
                { id: 'tel', label: 'Telefone / WhatsApp', placeholder: '(00) 00000-0000', type: 'tel', value: phone, onChange: handlePhoneChange, autocomplete: 'tel' },
                { id: 'email', label: 'E-mail corporativo', placeholder: 'seu@contato.com', type: 'email', autocomplete: 'email' },
                { id: 'perfil', label: 'O que você é?', type: 'select', options: ['Síndico (Morador)', 'Síndico (Profissional)', 'Subsíndico', 'Morador', 'Administrador', 'Outros'] },
                { id: 'unidades', label: 'Unidades no condomínio', type: 'select', options: ['1 a 50', '50 a 100', '100+'] },
                { id: 'condominio', label: 'Nome do condomínio', placeholder: 'Ex: Solar das Palmeiras', type: 'text' },
              ].map((field, idx) => (
                <div key={field.id || idx} className="flex flex-col gap-2 group">
                  <label htmlFor={field.id} className="text-[10px] font-black uppercase tracking-[0.3em] text-black/20 px-1 transition-colors group-focus-within:text-[#0B6EA8]">{field.label}</label>
                  {field.type === 'select' ? (
                    <div className="relative">
                      <select 
                        id={field.id}
                        className="appearance-none h-12 w-full bg-transparent border-b border-black/10 rounded-none px-1 outline-none focus:border-[#0B6EA8] transition-all text-sm font-medium cursor-pointer"
                      >
                        <option value="">Selecione...</option>
                        {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                      <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 text-black/20 pointer-events-none" size={12} />
                    </div>
                  ) : (
                    <input 
                      id={field.id}
                      type={field.type} 
                      autoComplete={field.autocomplete}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={field.placeholder}
                      className="h-12 w-full bg-transparent border-b border-black/10 rounded-none px-1 outline-none focus:border-[#0B6EA8] transition-all duration-700 text-sm font-medium placeholder:text-black/10 placeholder:font-light"
                    />
                  )}
                </div>
              ))}
            </form>
          </motion.div>
        </div>
      </section>

      {/* Services Section - "Nossos Serviços" */}
      <section id="servicos" className="py-24 md:py-40 px-4 md:px-12 bg-[#F7F7F4]">
        <div className="max-w-7xl mx-auto mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-10"
          >
            <div className="max-w-2xl">
              <span className="text-[10px] font-black tracking-[0.5em] uppercase text-[#0B6EA8] mb-6 md:mb-8 block">SOLUÇÕES 2S</span>
              <h2 className="serif text-[clamp(2rem,5vw,5rem)] font-light italic leading-[1] md:leading-[0.9] text-balanced mb-6">
                Nossos serviços para<br />
                cada realidade
              </h2>
            </div>
            <p className="max-w-xs text-sm text-black/40 font-medium leading-relaxed mb-4">
              Modelos operacionais pensados para elevar a segurança e adaptar-se à rotina do seu condomínio.
            </p>
          </motion.div>
        </div>

        <div className="max-w-[98%] mx-auto overflow-hidden">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 h-auto lg:h-[700px]"
          >
            {[
              {
                title: 'Portaria Remota',
                desc: 'Tecnologia inovadora de controle de acesso gerenciada por nossa central 24h, garantindo rigor e eficiência total.',
                image: 'images/portaria-remota.webp'
              },
              {
                title: 'Portaria Híbrida',
                desc: 'O melhor dos dois mundos: presença física durante o dia e vigilância remota absoluta durante a noite.',
                image: 'images/portaria-hibrida.webp'
              },
              {
                title: 'Portaria Autônoma',
                desc: 'Autonomia completa com integração via app, permitindo o gerenciamento direto de acessos pelo morador.',
                image: 'images/portaria-autonoma.webp'
              },
              {
                title: 'Portaria Presencial',
                desc: 'Excelência em atendimento físico com suporte tecnológico da 2S para condomínios de alto fluxo.',
                image: 'images/portaria-presencial.webp'
              }
            ].map((service, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="group relative h-[450px] lg:h-full overflow-hidden rounded-[2rem] bg-white cursor-pointer transition-all duration-1000 z-10"
              >
                {/* Image Background */}
                <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-105 will-change-transform">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    width="600"
                    height="800"
                    className="w-full h-full object-cover transition-all duration-1000"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-700" />
                </div>

                {/* Glassmorphism Hover Overlay */}
                <div className="absolute inset-0 bg-[#0B6EA8]/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-1000 flex flex-col justify-end p-12" />

                {/* Content Overlay */}
                <div className="absolute inset-0 p-12 flex flex-col justify-end text-white z-10">
                  <div className="transform transition-all duration-700 group-hover:-translate-y-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0B6EA8] mb-4 block transform transition-transform duration-700 origin-left group-hover:scale-110">0{idx + 1}</span>
                    <h3 className="serif text-4xl italic mb-4 leading-tight">{service.title}</h3>
                    
                    <div className="h-0 overflow-hidden transition-all duration-700 group-hover:h-auto group-hover:mt-2">
                      <p className="text-[14px] text-white/70 leading-relaxed opacity-0 transition-all duration-700 delay-100 group-hover:opacity-100 font-medium max-w-[240px]">
                        {service.desc}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hairline Border */}
                <div className="absolute inset-0 border border-black/5 rounded-[2rem] pointer-events-none group-hover:border-[#0B6EA8]/40 transition-colors duration-1000" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Us Section - Statistics & Counters */}
      <section id="diferenciais" className="py-24 md:py-40 px-6 md:px-12 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="text-center mb-16 md:mb-24"
          >
            <span className="text-[10px] font-black tracking-[0.5em] uppercase text-[#0B6EA8] mb-8 block font-editorial tracking-editorial">NOSSOS NÚMEROS</span>
            <h2 className="serif text-[clamp(2rem,5vw,5rem)] font-light italic leading-[1] md:leading-[0.9] text-balanced">
              Por que a 2S Portaria é<br />
              referência absoluta
            </h2>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8"
          >
            {[
              {
                icon: <History size={24} strokeWidth={1.2} />,
                value: 10,
                suffix: "",
                label: "ANOS DE SÓLIDA",
                sublabel: "Experiência no mercado"
              },
              {
                icon: <Trophy size={24} strokeWidth={1.2} />,
                value: 1,
                prefix: "Nº ",
                suffix: "º",
                label: "PIONEIRA EM RIO PRETO",
                sublabel: "Excelência técnica"
              },
              {
                icon: <ShieldCheck size={24} strokeWidth={1.2} />,
                value: 100,
                suffix: "%",
                label: "MARCA RECONHECIDA",
                sublabel: "Qualidade inquestionável"
              },
              {
                icon: <Smartphone size={24} strokeWidth={1.2} />,
                value: 50,
                suffix: "+",
                label: "CONDOMÍNIOS ATENDIDOS",
                sublabel: "Confiança total"
              }
            ].map((stat, idx) => (
              <motion.div 
                key={idx} 
                variants={fadeInUp}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-20 h-20 rounded-full border border-black/5 bg-white flex items-center justify-center text-[#0B6EA8] mb-10 transition-all duration-700 group-hover:bg-[#0B6EA8] group-hover:text-white group-hover:border-[#0B6EA8]">
                  {stat.icon}
                </div>
                <div className="serif text-6xl font-light italic mb-5 text-black">
                  <Counter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0B6EA8] mb-2">{stat.label}</p>
                <p className="text-[14px] text-black/30 font-medium">{stat.sublabel}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section - Sophisticated Slider */}
      <section id="depoimentos" className="py-40 bg-white relative">
          <div className="max-w-7xl mx-auto px-6 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-start"
            >
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#0B6EA8] mb-4">DEPOIMENTOS</span>
              <h3 className="serif text-4xl md:text-5xl lg:text-6xl font-light italic leading-tight text-balanced">O que nossos clientes<br />dizem sobre nós</h3>
            </motion.div>
            
            <div className="flex gap-4 mb-2">
              <button 
                onClick={prevTestimonial}
                className="w-14 h-14 rounded-full border border-black/10 flex items-center justify-center text-black/40 hover:text-[#0B6EA8] hover:border-[#0B6EA8] transition-all duration-300"
              >
                <ArrowLeft size={18} />
              </button>
              <button 
                onClick={nextTestimonial}
                className="w-14 h-14 rounded-full border border-black/10 flex items-center justify-center text-black/40 hover:text-[#0B6EA8] hover:border-[#0B6EA8] transition-all duration-300"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 overflow-visible">
            <div className="relative">
              <motion.div 
                className="flex gap-6"
                animate={{ x: `-${testiIndex * (100 / 3.1)}%` }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                {testimonials.map((testimonial, idx) => (
                   <div 
                     key={idx} 
                     className="w-full md:w-[calc(80%-12px)] lg:w-[calc(40%-16px)] shrink-0"
                   >
                     <div className="h-full p-12 rounded-[2.5rem] bg-[#F4F4F2] text-black flex flex-col justify-between border border-black/5 hover:border-black/10 hover:shadow-premium transition-all duration-700">
                       <div className="space-y-10">
                         {/* Header: Stars & Badge */}
                         <div className="flex items-center justify-between">
                           <div className="flex gap-1 text-[#0B6EA8]">
                             {[...Array(5)].map((_, i) => (
                               <Star key={i} size={14} fill="currentColor" stroke="none" />
                             ))}
                           </div>
                           <div className="px-5 py-2 rounded-full border border-black/5 bg-black/5 text-[9px] font-black uppercase tracking-[0.2em] text-black/40">
                             FEEDBACK VERIFICADO
                           </div>
                         </div>

                         {/* Content: Large Quote */}
                         <div className="relative">
                           <p className="text-[15px] leading-relaxed text-black/60 font-medium">
                             "{testimonial.content}"
                           </p>
                         </div>
                       </div>
                       
                       {/* Footer: User Info */}
                       <div className="mt-12 pt-10 border-t border-black/5 flex items-end justify-between">
                         <div className="space-y-1">
                           <h4 className="serif italic text-2xl leading-none text-black">{testimonial.name}</h4>
                           <p className="text-[10px] text-black/30 font-bold uppercase tracking-[0.2em]">{testimonial.role}</p>
                         </div>
                       </div>
                     </div>
                   </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

      {/* About Section - "Sobre Nós" */}
      <section id="sobre-nos" className="py-24 md:py-40 px-4 md:px-12 bg-white flex flex-col items-center overflow-hidden">
        <div className="max-w-7xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20 items-center">
            {/* Video Column - Offset for Async Rhythm */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 relative group"
            >
              <div className="relative aspect-[16/10] bg-black rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-premium transition-transform duration-1000 group-hover:scale-[1.01] will-change-transform">
                <iframe 
                  className="absolute inset-0 w-full h-full grayscale-[0.2] transition-all duration-1000 group-hover:grayscale-0"
                  src="https://www.youtube.com/embed/9LNPnPG9InY"
                  title="Vídeo Institucional 2S Portaria"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
                <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-[2rem] md:rounded-[2.5rem]" />
              </div>
            </motion.div>

            {/* Text Column */}
            <div className="lg:col-span-5 space-y-8 md:y-12">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.2 }}
                className="space-y-6 md:space-y-10"
              >
                <span className="text-[10px] font-black tracking-[0.5em] uppercase text-[#0B6EA8] font-editorial">Conheça nossa história</span>
                <h2 className="serif text-[clamp(2rem,5vw,5rem)] italic leading-[1] md:leading-[0.9] text-balanced">
                  Sobre nós
                </h2>
                
                <div className="space-y-6 max-w-sm">
                  <p className="text-sm text-black/40 leading-relaxed font-medium">
                    A 2S Portaria nasceu em 2015 como pioneira tecnológica em São José do Rio Preto, redefinindo o conceito de vigilância remota.
                  </p>
                  <p className="text-sm text-black/40 leading-relaxed font-medium">
                    Hoje somos referência no noroeste paulista, integrando hardware de última geração com protocolos de segurança inabaláveis.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Purpose Section - Mission, Vision, Values */}
      <section id="essencia" className="py-24 md:py-40 px-4 md:px-12 bg-[#0A0A0B] relative overflow-hidden">
        {/* Architectural Background Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="images/fundo-secao-nossa-essencia.webp" 
            alt="Arquitetura de fundo" 
            width="1920"
            height="1080"
            className="w-full h-full object-cover opacity-5 grayscale"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="mb-16 md:mb-24 flex flex-col items-start"
          >
            <span className="text-[10px] font-black tracking-[0.6em] uppercase text-[#0B6EA8] mb-6 block font-editorial tracking-editorial">PILARES DA EXCELÊNCIA</span>
            <h2 className="serif text-[clamp(2.5rem,5.5vw,5.5rem)] font-light italic leading-[1] md:leading-[0.9] text-white">
              Nossa Essência
            </h2>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {[
              {
                title: "Missão",
                icon: <Target size={22} strokeWidth={1.5} />,
                content: "Elevar a qualidade de vida através de protocolos tecnológicos de excelência absoluta."
              },
              {
                title: "Visão",
                icon: <Eye size={22} strokeWidth={1.5} />,
                content: "Ser a referência máxima nacional em segurança inteligente e bem-estar condominial."
              },
              {
                title: "Valores",
                icon: <Heart size={22} strokeWidth={1.5} />,
                content: "Transparência radical, ética inabalável e busca contínua pela excelência operacional."
              }
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                variants={fadeInUp}
                className="group relative p-12 bg-white/[0.02] border border-white/5 backdrop-blur-sm hover:bg-white/[0.04] hover:border-[#0B6EA8]/20 transition-all duration-1000 rounded-[2.5rem] overflow-hidden"
              >
                <div className="flex flex-col gap-10">
                  <div className="w-12 h-12 flex items-center justify-center text-[#0B6EA8] border border-white/10 group-hover:bg-[#0B6EA8] group-hover:text-white transition-all duration-700 rounded-full">
                    {item.icon}
                  </div>
                  
                  <div className="space-y-6">
                    <h3 className="serif text-3xl text-white italic leading-none">{item.title}</h3>
                    <p className="text-white/30 text-[14px] leading-relaxed group-hover:text-white/60 transition-colors duration-700 font-medium">
                      {item.content}
                    </p>
                  </div>

                  <span className="serif text-6xl text-white/[0.02] font-light italic absolute bottom-10 right-12 group-hover:text-[#0B6EA8]/10 transition-colors duration-1000">0{idx + 1}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section - Premium Accordion */}
      <section id="faq" className="py-24 md:py-40 px-4 md:px-12 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-32">
            {/* Title Column */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="lg:sticky lg:top-10"
              >
                <span className="text-[10px] font-black tracking-[0.6em] uppercase text-[#0B6EA8] mb-6 md:mb-8 block font-editorial tracking-editorial">SUPORTE & DÚVIDAS</span>
                <h2 className="serif text-[clamp(2rem,5.5vw,5.5rem)] font-light italic leading-[1] md:leading-[0.9] mb-8">
                  Perguntas<br />Frequentes
                </h2>
                <p className="text-black/40 text-sm leading-relaxed max-w-sm font-medium mb-10 md:mb-12">
                  Esclareça suas dúvidas fundamentais e entenda como elevamos o padrão de segurança em condomínios de alta performance.
                </p>
                
                <div className="mt-12 hidden lg:flex flex-col items-start pt-12 border-t border-black/5">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20 mb-8 font-editorial tracking-editorial">
                    Ainda tem dúvidas?
                  </p>
                  <a 
                    href="https://wa.me/551732017700" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-4 px-10 py-4 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#0B6EA8] transition-all duration-700 group shadow-lg shadow-black/5"
                  >
                    <MessageCircle size={14} className="transition-transform duration-700 group-hover:scale-110" />
                    Fale com um especialista
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Accordion Column */}
            <div className="lg:col-span-7">
              <motion.div 
                className="space-y-0"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
              >
                {[
                  {
                    q: "O que é a Portaria Remota e como funciona?",
                    a: "A Portaria Remota é um serviço de segurança que substitui a portaria presencial por uma central de monitoramento 24 horas. Nossos operadores treinados gerenciam o acesso ao condomínio remotamente, utilizando tecnologia de ponta. Isso significa que, mesmo sem um porteiro físico no local, o controle de entrada e saída é rigoroso e eficiente."
                  },
                  {
                    q: "Quais os tipos de portaria que a 2S oferece?",
                    a: "Oferecemos diversas modalidades para atender a sua necessidade específica:\n\n• Portaria Remota: Monitoramento e controle de acesso à distância.\n• Portaria Híbrida: Combina a presença de um profissional com o suporte da tecnologia remota.\n• Portaria Autônoma: Soluções tecnológicas que otimizam o acesso com mínima intervenção humana.\n• Portaria Presencial: Para condomínios que ainda preferem ou necessitam de um porteiro no local, mas com o suporte e a eficiência da 2S."
                  },
                  {
                    q: "Quais os benefícios da Portaria Remota?",
                    a: "A Portaria Remota com a 2S traz muitos benefícios, como:\n\n• Redução de Custos: Economia de até 70% nas despesas com pessoal.\n• Maior Segurança: Elimina falhas humanas e riscos associados à presença de porteiros.\n• Controle e Eficiência: Tecnologia de reconhecimento facial e monitoramento em tempo real.\n• Tranquilidade: Operadores treinados prontos para agir 24h por dia.\n• Modernidade: Facilitando o dia a dia de moradores e síndicos."
                  },
                  {
                    q: "Como funciona o reconhecimento facial?",
                    a: "O reconhecimento facial permite que os moradores acessem o condomínio de forma rápida e segura, utilizando o rosto como 'chave'. Isso elimina a necessidade de chaves ou controles remotos que podem ser perdidos ou clonados, garantindo que apenas pessoas autorizadas entrem."
                  },
                  {
                    q: "Em emergências, como a 2S atua?",
                    a: "Nossa central de monitoramento opera 24 horas por dia. Em caso de qualquer situação fora do padrão (portão aberto, falha de energia, tentativas de acesso indevido), nossos operadores treinados agem imediatamente, seguindo protocolos claros e utilizando tecnologia em tempo real."
                  },
                  {
                    q: "A tecnologia da 2S é segura?",
                    a: "Sim, a segurança é nossa prioridade. Utilizamos tecnologia de ponta, incluindo sistemas de monitoramento robustos e reconhecimento facial. Nossos operadores são especialmente treinados para lidar com diversas situações, assegurando um alto nível de proteção."
                  },
                  {
                    q: "A 2S atende condomínios de todos os tamanhos?",
                    a: "Sim, oferecemos soluções adaptadas para condomínios de todos os portes, desde pequenos até grandes complexos. Com experiência consolidada no mercado, temos a tecnologia ideal para melhorar a segurança do seu condomínio, independentemente do tamanho."
                  },
                  {
                    q: "Como posso solicitar um orçamento ou saber mais?",
                    a: "É muito simples! Você pode entrar em contato conosco através do link na bio do nosso Instagram ou preencher o formulário no topo desta página. Nossa equipe está pronta para entender a sua necessidade e apresentar a melhor solução."
                  }
                ].map((item, idx) => (
                  <FAQItem key={idx} question={item.q} answer={item.a} index={idx} />
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#161A20] py-24 md:py-40 px-4 md:px-12 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
            {/* Brand Column */}
            <div className="lg:col-span-6 space-y-8 md:space-y-12">
              <div className="flex items-center gap-6">
                <div className="h-20 md:h-32 w-auto">
                  <img 
                    src="images/logo-2s-white.png" 
                    alt="2S Portaria Logo Branca Footer" 
                    width="180"
                    height="64"
                    className="h-full w-auto object-contain"
                    loading="lazy"
                  />
                </div>
              </div>
              <p className="text-white/20 text-sm leading-relaxed max-w-sm font-medium">
                Sediada em São José do Rio Preto, a 2S é a autoridade máxima em vigilância remota de alto padrão no noroeste paulista.
              </p>
            </div>

            {/* Links Grid */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
              <nav className="space-y-8" aria-label="Menu do Rodapé">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0B6EA8] font-editorial">MENU</h4>
                <ul className="space-y-6">
                  {navLinks.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-all duration-500">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="space-y-8">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0B6EA8] font-editorial">CONTATO</h4>
                <div className="space-y-6">
                  <a href="tel:1732017700" className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-all duration-500">
                    <Phone size={14} strokeWidth={2} aria-hidden="true" /> (17) 3201-7700
                  </a>
                  <a href="tel:08003201770" className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-all duration-500">
                    <Phone size={14} strokeWidth={2} aria-hidden="true" /> 0800 3201 770
                  </a>
                  <a href="https://www.instagram.com/2sportariaremota/" target="_blank" rel="noopener noreferrer" aria-label="Seguir no Instagram" className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-all duration-500">
                    <Instagram size={14} strokeWidth={2} aria-hidden="true" /> Instagram
                  </a>
                </div>
              </div>

              <div className="space-y-8">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0B6EA8] font-editorial">LOCAL</h4>
                <div className="flex gap-4">
                  <MapPin size={18} strokeWidth={1.5} className="text-[#0B6EA8] shrink-0" aria-hidden="true" />
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/20 leading-relaxed">
                    Av. Alberto Andaló, 3942<br />
                    Vila Redentora<br />
                    SJ Rio Preto - SP
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 md:mt-40 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/10">
              © 2026 2S Portaria. Todos os direitos reservados.
            </p>
            <div className="flex gap-8 md:gap-12">
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/10 hover:text-white/30 cursor-pointer transition-colors">Privacidade</span>
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/10 hover:text-white/30 cursor-pointer transition-colors">Termos</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Support Widget */}
      <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50">
        <a 
          href="https://wa.me/551732017700"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar conosco no WhatsApp"
          className="w-14 h-14 md:w-16 md:h-16 bg-[#0B6EA8] text-white rounded-full flex items-center justify-center shadow-2xl shadow-[#0B6EA8]/30 hover:scale-110 active:scale-95 transition-all text-white"
        >
          <MessageSquare size={24} />
        </a>
      </div>
    </div>
  );
}
