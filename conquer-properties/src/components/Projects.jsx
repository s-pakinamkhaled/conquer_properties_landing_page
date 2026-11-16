
import { useState, useEffect, useRef } from 'react'
import { ArrowRight } from './Icons'
import { useCallModal } from '../i18n/CallModalContext'
import { useLanguage } from '../i18n/LanguageContext'
import {
  trackProjectView,
  trackCustomEvent,
} from '../utils/metaTracking'

const MODON_GALLERY = Array.from({ length: 16 }, (_, i) => ({
  src: `/images/modon/modon-${String(i + 1).padStart(2, '0')}.jpg`,
  titleKey: `modonShot${i + 1}Title`,
  textKey: `modonShot${i + 1}Text`,
}))

const CITY_GATE_GALLERY = Array.from({ length: 4 }, (_, i) => ({
  src: `/images/city-gate/city-gate-0${i + 1}.jpg`,
  titleKey: `cityGateShot${i + 1}Title`,
  textKey: `cityGateShot${i + 1}Text`,
}))

const CITY_GATE_TEXT = {
  en: {
    kicker: 'Featured Development',
    eyebrow: 'BY QATARI DIAR',
    title: 'CITY GATE',
    lead: 'Luxury Meets Nature',
    body: 'Imagine waking up to breathtaking golf course views and living in a community where luxury meets nature. City Gate offers an exclusive lifestyle in New Cairo, featuring a spectacular 18-hole golf course, lush green landscapes, elegant residences, and world-class amenities.',
    close: 'Live beyond expectations. Invest in a lifestyle that stands out.',
    tags: [
      '18-Hole Golf Course',
      'Lush Green Landscapes',
      'Elegant Residences',
      'World-Class Amenities',
    ],
    cta: 'Enquire About City Gate',
    titles: [
      'City Gate',
      'Golf Course Views',
      'Green Landscapes',
      'Luxury Living',
    ],
    descriptions: [
      'Discover the City Gate lifestyle.',
      'Enjoy breathtaking golf course views.',
      'Experience beautiful green surroundings.',
      'Discover an exclusive residential lifestyle.',
    ],
  },
  ar: {
    kicker: 'مشروع مميز',
    eyebrow: 'من تطوير قطري ديار',
    title: 'CITY GATE',
    lead: 'حيث تلتقي الفخامة بالطبيعة',
    body: 'تخيل أن تستيقظ كل يوم على إطلالات خلابة على ملعب الجولف، وتعيش في مجتمع يجمع بين الفخامة والطبيعة. يقدم سيتي جيت أسلوب حياة استثنائيًا في القاهرة الجديدة، مع ملعب جولف عالمي مكون من 18 حفرة، ومساحات خضراء واسعة، ووحدات سكنية أنيقة، ومرافق عالمية المستوى.',
    close: 'عِش تجربة تتجاوز التوقعات واستثمر في أسلوب حياة استثنائي.',
    tags: [
      'ملعب جولف 18 حفرة',
      'مساحات خضراء',
      'وحدات سكنية أنيقة',
      'مرافق عالمية',
    ],
    cta: 'استفسر عن سيتي جيت',
    titles: [
      'سيتي جيت',
      'إطلالات ملعب الجولف',
      'مساحات خضراء',
      'حياة فاخرة',
    ],
    descriptions: [
      'اكتشف أسلوب الحياة في سيتي جيت.',
      'استمتع بإطلالات خلابة على ملعب الجولف.',
      'استمتع بالطبيعة والمساحات الخضراء.',
      'اكتشف تجربة سكنية استثنائية.',
    ],
  },
}

function ProjectCard({
  gallery,
  title,
  kicker,
  eyebrow,
  lead,
  body,
  close,
  tags,
  cta,
  brand,
  openModal,
  lang,
}) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((current) => (current + 1) % gallery.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [gallery])

  const shot = gallery[active]

  const handleEnquiry = () => {
    trackCustomEvent('ProjectEnquiryClick', {
      project_name: brand,
    })

    openModal()
  }

  const handleGalleryClick = (index) => {
    trackCustomEvent('ProjectGalleryImageClick', {
      project_name: brand,
      image_number: index + 1,
    })

    setActive(index)
  }

  return (
    <article
      className="project-showcase"
      data-track-project={brand}
    >
      <div className="project-info">
        <span className="project-label">
          {kicker}
        </span>

        <h3>{title}</h3>

        {eyebrow && (
          <p className="project-eyebrow">
            {eyebrow}
          </p>
        )}

        <p className="project-description">
          {lead}
        </p>

        <p className="project-details">
          {body}
        </p>

        <p className="project-close">
          {close}
        </p>

        <div className="project-tags">
          {tags.map((tag, index) => (
            <span key={index}>{tag}</span>
          ))}
        </div>

        <button
          type="button"
          className="btn btn-gold"
          onClick={handleEnquiry}
        >
          {cta}
          <ArrowRight />
        </button>
      </div>

      <div className="project-gallery">
        <div
          className="project-main-image"
          key={shot.src}
        >
          <img
            src={shot.src}
            alt={title}
            loading="lazy"
          />

          <div className="project-image-caption">
            <span>{brand}</span>
            <h4>{shot.title}</h4>
            <p>{shot.text}</p>
          </div>

          <div className="project-counter">
            {String(active + 1).padStart(2, '0')}
            <span>
              {' '}/ {String(gallery.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        <div className="project-thumbnails">
          {gallery.map((item, index) => (
            <button
              key={item.src}
              type="button"
              className={`project-thumbnail ${index === active ? 'active' : ''
                }`}
              onClick={() => handleGalleryClick(index)}
              aria-label={`View ${brand} image ${index + 1}`}
              aria-pressed={index === active}
            >
              <img
                src={item.src}
                alt=""
                loading="lazy"
              />
            </button>
          ))}
        </div>

        <div className="project-gallery-footer">
          <span>
            {lang === 'ar' ? 'اكتشف المشروع' : 'EXPLORE THE PROJECT'}
          </span>

          <span>
            {lang === 'ar' ? 'معرض صور تلقائي' : 'AUTOMATIC GALLERY'}
          </span>
        </div>
      </div>
    </article>
  )
}

export default function Projects() {
  const { t, lang } = useLanguage()
  const { openModal } = useCallModal()

  const projectsRef = useRef(null)

  // Track when each project becomes visible
  useEffect(() => {
    const elements = projectsRef.current?.querySelectorAll(
      '[data-track-project]'
    )

    if (!elements?.length) return undefined

    const viewed = new Set()

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const projectName = entry.target.dataset.trackProject

            if (!viewed.has(projectName)) {
              viewed.add(projectName)
              trackProjectView(projectName)
            }
          }
        })
      },
      { threshold: 0.5 }
    )

    elements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [])

  const city = CITY_GATE_TEXT[lang] || CITY_GATE_TEXT.en

  const modon = {
    gallery: MODON_GALLERY,
    title: t.modonTitle || 'MODON RAS EL HEKMA',
    kicker: t.modonKicker || 'Featured Project',
    eyebrow: t.modonEyebrow || 'The Destination',
    lead: t.modonLead || 'Discover a coastal destination where architecture meets the beauty of seaside living.',
    body: t.modonBody || 'Explore thoughtfully designed spaces, beautiful surroundings, and a setting created for memorable moments.',
    close: t.modonClose || 'Discover a new vision of coastal living with MODON.',
    tags: [
      t.modonTag1 || 'Coastal Living',
      t.modonTag2 || 'Modern Architecture',
      t.modonTag3 || 'Lifestyle Destination',
      t.modonTag4 || 'Premium Residences',
    ],
    cta: t.modonCta || 'Enquire About MODON',
    brand: 'MODON',
  }

  const cityGate = {
    gallery: CITY_GATE_GALLERY,
    title: city.title,
    kicker: city.kicker,
    eyebrow: city.eyebrow,
    lead: city.lead,
    body: city.body,
    close: city.close,
    tags: city.tags,
    cta: city.cta,
    brand: 'CITY GATE',
  }

  return (
    <section
      className="projects-v2"
      id="projects"
      ref={projectsRef}
    >
      <div className="container">
        <div className="projects-v2-heading">
          <span className="projects-v2-eyebrow">
            {t.projectsEyebrow}
          </span>

          <h2>{t.projectsTitle}</h2>

          <p>{t.projectsSubtitle}</p>
        </div>

        <ProjectCard
          {...modon}
          openModal={openModal}
          lang={lang}
        />

        <div className="project-section-divider" />

        <ProjectCard
          {...cityGate}
          openModal={openModal}
          lang={lang}
        />
      </div>
    </section>
  )
}
