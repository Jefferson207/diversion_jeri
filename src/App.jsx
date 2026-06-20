import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import gsap from 'gsap'
import Lenis from 'lenis'
import {
  ArrowDown, ArrowRight, BadgeCheck, Box, ChevronDown, CircleDollarSign,
  Camera as Instagram, Clock3, Headphones, MapPin, Menu, MessageCircleMore as Whatsapp, Search, ShieldCheck,
  Sparkles, Star, Truck, X, Zap,
} from 'lucide-react'
import { categories, money, products, whatsappUrl } from './data'

const CONTACT_MESSAGE = 'Hola, vengo desde la página web de Diversiones Jerí y deseo información.'

function Brand({ compact = false }) {
  return <a className={`brand ${compact ? 'brand--compact' : ''}`} href="#inicio" aria-label="Diversiones Jerí, inicio">
    <img src="/brand/logo.png" alt="Diversiones Jerí" />
  </a>
}

function WhatsAppButton({ children, message = CONTACT_MESSAGE, className = '' }) {
  return <a className={className} href={whatsappUrl(message)} target="_blank" rel="noreferrer">
    {children}
  </a>
}

function ProductCard({ product, featured = false }) {
  const cardRef = useRef(null)
  const reduceMotion = useReducedMotion()
  const onMove = event => {
    if (reduceMotion || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    cardRef.current.style.setProperty('--rx', `${((event.clientY - rect.top) / rect.height - .5) * -7}deg`)
    cardRef.current.style.setProperty('--ry', `${((event.clientX - rect.left) / rect.width - .5) * 7}deg`)
    cardRef.current.style.setProperty('--mx', `${event.clientX - rect.left}px`)
    cardRef.current.style.setProperty('--my', `${event.clientY - rect.top}px`)
  }
  const reset = () => {
    if (!cardRef.current) return
    cardRef.current.style.setProperty('--rx', '0deg')
    cardRef.current.style.setProperty('--ry', '0deg')
  }
  return <motion.article layout ref={cardRef} className={`product-card ${featured ? 'product-card--featured' : ''}`}
    onMouseMove={onMove} onMouseLeave={reset} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }} transition={{ duration: .45 }}>
    <div className="product-card__glow" />
    <div className="product-card__visual">
      <span className="product-card__tag">{product.category}</span>
      <img src={product.image} alt={product.name} loading="lazy" />
      <span className="product-card__code">COD {product.code}</span>
    </div>
    <div className="product-card__body">
      <div><h3>{product.name}</h3><p>Lista para operar</p></div>
      <strong>{money(product.price)}</strong>
    </div>
    <WhatsAppButton className="card-action" message={`Hola, deseo información sobre el producto COD ${product.code}`}>
      <Whatsapp size={18} /> Solicitar por WhatsApp <ArrowRight size={17} />
    </WhatsAppButton>
  </motion.article>
}

const benefits = [
  [Truck,'Envíos a nivel nacional','Llegamos a todas las regiones del Perú.'],
  [ShieldCheck,'Garantía de 2 años','Respaldo real para tu inversión.'],
  [CircleDollarSign,'Máquinas rentables','Equipos pensados para generar ingresos.'],
  [Zap,'Bajo consumo eléctrico','Más horas de uso, menos costos.'],
  [Box,'Mayor y menor','Opciones para empezar o escalar.'],
  [Clock3,'Fácil programación','Configura tiempo, moneda y sonido.'],
  [Headphones,'Soporte postventa','Te acompañamos después de la compra.'],
]

const testimonials = [
  ['María Fernanda','Restaurante familiar','La máquina se convirtió en la zona favorita de los niños. La atención y el envío fueron excelentes.'],
  ['Carlos R.','Emprendedor','Empecé con una máquina y hoy ya tengo cuatro. Son fáciles de programar y el soporte sí responde.'],
  ['Lucía Mendoza','Centro comercial','Los equipos llaman mucho la atención, consumen poco y llegaron listos para trabajar.'],
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Todos')
  const [sort, setSort] = useState('popular')
  const [lightbox, setLightbox] = useState(null)
  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, .22], [0, 100])
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true })
    let rafId
    const raf = time => { lenis.raf(time); rafId = requestAnimationFrame(raf) }
    rafId = requestAnimationFrame(raf)
    return () => { cancelAnimationFrame(rafId); lenis.destroy() }
  }, [])

  useEffect(() => {
    if (reduceMotion) return
    const context = gsap.context(() => {
      gsap.to('.orb--one', { x: 34, y: -28, duration: 4.5, repeat: -1, yoyo: true, ease: 'sine.inOut' })
      gsap.to('.orb--two', { x: -42, y: 34, duration: 5.5, repeat: -1, yoyo: true, ease: 'sine.inOut' })
      gsap.to('.hero-machine', { y: -16, rotate: 1.5, duration: 3.2, repeat: -1, yoyo: true, ease: 'sine.inOut' })
    })
    return () => context.revert()
  }, [reduceMotion])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    const result = products.filter(product => (category === 'Todos' || product.category === category) &&
      (!term || `${product.name} ${product.code} ${product.category}`.toLowerCase().includes(term)))
    return [...result].sort((a,b) => sort === 'low' ? a.price-b.price : sort === 'high' ? b.price-a.price : b.popularity-a.popularity)
  }, [query, category, sort])

  const featured = [products[1], products[18], products[41], products[49]]
  const gallery = [products[41], products[49], products[18], products[51], products[42], products[54]]

  return <>
    <motion.div className="progress" style={{ scaleX: scrollYProgress }} />
    <header className="nav glass">
      <Brand compact />
      <nav className={menuOpen ? 'nav__links open' : 'nav__links'}>
        <a href="#catalogo" onClick={() => setMenuOpen(false)}>Catálogo</a>
        <a href="#beneficios" onClick={() => setMenuOpen(false)}>Beneficios</a>
        <a href="#galeria" onClick={() => setMenuOpen(false)}>Galería</a>
        <a href="#contacto" onClick={() => setMenuOpen(false)}>Contacto</a>
      </nav>
      <WhatsAppButton className="nav__cta"><Whatsapp size={17} /> Cotiza ahora</WhatsAppButton>
      <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú">{menuOpen ? <X /> : <Menu />}</button>
    </header>

    <main>
      <section className="hero" id="inicio">
        <div className="hero__grid" /><div className="noise" /><div className="orb orb--one" /><div className="orb orb--two" />
        <div className="particles" aria-hidden="true">{Array.from({length: 18},(_,i)=><i key={i} style={{'--i':i}} />)}</div>
        <div className="container hero__inner">
          <motion.div className="hero__copy" initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }}>
            <span className="eyebrow"><Sparkles size={14} /> Diversión que hace crecer tu negocio</span>
            <h1>Máquinas recreativas que <span>llenan tu negocio de diversión</span></h1>
            <p>Venta de juegos electrónicos, kiddie rides y máquinas de entretenimiento para negocios. Envíos a todo el Perú y garantía de 2 años.</p>
            <div className="hero__actions">
              <a href="#catalogo" className="button button--primary">Ver catálogo <ArrowDown size={18} /></a>
              <WhatsAppButton className="button button--whatsapp"><Whatsapp size={19} /> Cotizar por WhatsApp</WhatsAppButton>
            </div>
            <div className="hero__trust"><div><strong>2 años</strong><span>de garantía</span></div><div><strong>Todo Perú</strong><span>envíos nacionales</span></div><div><strong>57+</strong><span>modelos disponibles</span></div></div>
          </motion.div>
          <motion.div className="hero__visual" style={{ y: heroY }} initial={{ opacity: 0, scale: .88 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: .2 }}>
            <div className="hero__halo" />
            <div className="balloon balloon--yellow" /><div className="balloon balloon--red" /><div className="hero-star">★</div>
            <div className="floating-chip chip--one"><span>Desde</span><strong>S/ 1,800</strong></div>
            <div className="floating-chip chip--two"><BadgeCheck size={18}/><span>Garantía<br/><strong>2 años</strong></span></div>
            <img className="hero-machine" src="/catalog/p15-2.png" alt="Máquina recreativa de Diversiones Jerí" />
          </motion.div>
        </div>
        <div className="hero-wave" />
        <a href="#destacados" className="scroll-cue"><span>Explorar</span><ChevronDown /></a>
      </section>

      <section className="section featured" id="destacados">
        <div className="container">
          <div className="section-heading"><div><span className="kicker">Selección Jerí</span><h2>Equipos que se roban <em>todas las miradas.</em></h2></div><p>Diseño, luces y experiencias que convierten el tiempo de espera en una nueva fuente de ingresos.</p></div>
          <div className="featured-grid">{featured.map(product => <ProductCard key={product.id} product={product} featured />)}</div>
        </div>
      </section>

      <section className="section catalog" id="catalogo">
        <div className="container">
          <div className="catalog__top"><div><span className="kicker">Catálogo 2026</span><h2>Encuentra tu próxima <em>máquina rentable.</em></h2></div><span className="result-count">{filtered.length} equipos</span></div>
          <div className="catalog__tools glass">
            <label className="search"><Search size={19}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar por nombre o código..." /></label>
            <div className="sort"><span>Ordenar</span><select value={sort} onChange={e=>setSort(e.target.value)}><option value="popular">Más populares</option><option value="low">Precio menor</option><option value="high">Precio mayor</option></select></div>
          </div>
          <div className="filters">{categories.map(item => <button key={item} className={category===item?'active':''} onClick={()=>setCategory(item)}>{item}</button>)}</div>
          <motion.div layout className="catalog-grid">
            <AnimatePresence mode="popLayout">{filtered.map(product => <ProductCard key={product.id} product={product} />)}</AnimatePresence>
          </motion.div>
          {!filtered.length && <div className="empty"><Search/><h3>No encontramos coincidencias</h3><p>Prueba con otro código o categoría.</p></div>}
        </div>
      </section>

      <section className="section benefits" id="beneficios">
        <div className="container benefits__layout">
          <div className="benefits__intro"><span className="kicker">Una inversión inteligente</span><h2>Tu negocio no necesita más decoración. <em>Necesita rentabilidad.</em></h2><p>Cada equipo está diseñado para operar fácil, atraer público y sumar ingresos desde el primer día.</p><WhatsAppButton className="text-link">Conversemos sobre tu espacio <ArrowRight/></WhatsAppButton></div>
          <div className="benefits__grid">{benefits.map(([Icon,title,text],i)=><motion.article key={title} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.05}}><span><Icon/></span><h3>{title}</h3><p>{text}</p></motion.article>)}</div>
        </div>
      </section>

      <section className="section gallery" id="galeria">
        <div className="container"><div className="section-heading"><div><span className="kicker">Galería</span><h2>El efecto <em>“quiero jugar”.</em></h2></div><p>Máquinas que destacan incluso en los espacios más competitivos.</p></div>
          <div className="masonry">{gallery.map((product,i)=><motion.button key={product.id} onClick={()=>setLightbox(product)} initial={{opacity:0,y:32}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.06}}><img src={product.image} alt={product.name}/><span><small>{product.category}</small>{product.name}</span><Sparkles/></motion.button>)}</div>
        </div>
      </section>

      <section className="section testimonials">
        <div className="container"><div className="center-heading"><span className="kicker">Clientes Jerí</span><h2>Negocios que ya están <em>generando más.</em></h2></div><div className="testimonial-grid">{testimonials.map(([name,type,text])=><article className="testimonial glass" key={name}><div className="stars">{Array.from({length:5},(_,i)=><Star key={i} size={17} fill="currentColor"/>)}</div><blockquote>“{text}”</blockquote><footer><span>{name[0]}</span><div><strong>{name}</strong><small>{type}</small></div></footer></article>)}</div></div>
      </section>

      <section className="location" id="contacto">
        <iframe title="Ubicación de Diversiones Jerí" loading="lazy" src="https://www.google.com/maps?q=Jir%C3%B3n%20Santa%20Leonor%206336%2C%20San%20Mart%C3%ADn%20de%20Porres%2C%20Lima&output=embed" />
        <div className="location__card glass"><span className="kicker">Visítanos en Lima</span><h2>Ven a conocer tu próxima máquina.</h2><p><MapPin/> Jirón Santa Leonor 6336, Urb. Santa Luisa, San Martín de Porres.</p><WhatsAppButton className="button button--primary"><Whatsapp/> Agendar una visita</WhatsAppButton></div>
      </section>
    </main>

    <footer className="footer"><div className="container footer__grid"><div><Brand/><p>Convierte diversión en un negocio rentable.</p></div><div><small>Contacto</small><a href="tel:+51946562627">+51 946 562 627</a><a href="mailto:diversionesjeri@gmail.com">diversionesjeri@gmail.com</a></div><div><small>Dirección</small><p>Jr. Santa Leonor 6336<br/>SMP, Lima, Perú</p></div><div><small>Síguenos</small><div className="socials"><a href="#" aria-label="Instagram"><Instagram/></a><a href={whatsappUrl(CONTACT_MESSAGE)} aria-label="WhatsApp"><Whatsapp/></a></div></div></div><div className="container footer__bottom"><span>© 2026 Diversiones Jerí</span><span>Máquinas que divierten. Negocios que crecen.</span></div></footer>

    <WhatsAppButton className="whatsapp-float"><span>¿Te ayudamos?</span><Whatsapp/></WhatsAppButton>
    <AnimatePresence>{lightbox && <motion.div className="lightbox" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setLightbox(null)}><button onClick={()=>setLightbox(null)}><X/></button><motion.div initial={{scale:.9,y:20}} animate={{scale:1,y:0}} onClick={e=>e.stopPropagation()}><img src={lightbox.image} alt={lightbox.name}/><h3>{lightbox.name}</h3><p>COD {lightbox.code} · {money(lightbox.price)}</p></motion.div></motion.div>}</AnimatePresence>
  </>
}

export default App
