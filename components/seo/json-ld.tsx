import React from "react";
import { siteConfig } from "@/lib/site-config";

export function JsonLd() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteConfig.url}/#person`,
    name: siteConfig.name,
    alternateName: ["Abdul Shahid", "Abdul Shaahid", "Mohamed Abdul Shahid"],
    url: siteConfig.url,
    image: `${siteConfig.url}/profile-portrait-monochrome.png`,
    jobTitle: siteConfig.role,
    description: siteConfig.description,
    email: `mailto:${siteConfig.email}`,
    telephone: siteConfig.phoneRaw,
    worksFor: {
      "@type": "Organization",
      name: siteConfig.currentWork.company,
      url: siteConfig.currentWork.url,
    },
    alumniOf: {
      "@type": "EducationalOrganization",
      name: siteConfig.education.institution,
      location: siteConfig.education.location,
    },
    address: {
      "@type": "PostalAddress",
      addressRegion: siteConfig.location.addressRegion,
      addressCountry: siteConfig.location.addressCountry,
    },
    sameAs: [
      siteConfig.socials.github,
      siteConfig.socials.linkedin,
      siteConfig.socials.instagram,
    ],
    knowsAbout: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "UI/UX Design",
      "Frontend Architecture",
      "Design Systems",
      "Framer Motion",
      "GSAP",
      "Web Performance",
      "REST APIs",
      "React Native",
      "Astro",
      "Docker",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.title,
    description: siteConfig.description,
    inLanguage: "en-US",
    publisher: {
      "@id": `${siteConfig.url}/#person`,
    },
  };

  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${siteConfig.url}/#webpage`,
    url: siteConfig.url,
    name: siteConfig.title,
    description: siteConfig.description,
    inLanguage: "en-US",
    isPartOf: {
      "@id": `${siteConfig.url}/#website`,
    },
    about: {
      "@id": `${siteConfig.url}/#person`,
    },
    mainEntity: {
      "@id": `${siteConfig.url}/#person`,
    },
  };

  const portfolioSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "CreativeWork",
          name: "Trawayl",
          description:
            "Travel package marketplace with custom itinerary discovery and instant booking workflows.",
          url: "https://trawayl.com",
          creator: { "@id": `${siteConfig.url}/#person` },
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@type": "CreativeWork",
          name: "Trawerse",
          description:
            "Digital studio website showcasing services, projects, and creative capabilities.",
          url: "https://trawerse.com/",
          creator: { "@id": `${siteConfig.url}/#person` },
        },
      },
      {
        "@type": "ListItem",
        position: 3,
        item: {
          "@type": "CreativeWork",
          name: "Deyno Technologies",
          description:
            "Multi-product SaaS ecosystem showcasing ERP solutions across industries.",
          creator: { "@id": `${siteConfig.url}/#person` },
        },
      },
      {
        "@type": "ListItem",
        position: 4,
        item: {
          "@type": "CreativeWork",
          name: "Kerala Startup Carnival",
          description:
            "Startup event platform featuring speakers, schedule, interactive experience, and live registration.",
          url: "https://keralastartupcarnival.com/",
          creator: { "@id": `${siteConfig.url}/#person` },
        },
      },
      {
        "@type": "ListItem",
        position: 5,
        item: {
          "@type": "CreativeWork",
          name: "Flotilla",
          description:
            "Modern sustainability website highlighting ESG solutions, green metrics, and environmental impact.",
          url: "https://www.flotillagroup.com/",
          creator: { "@id": `${siteConfig.url}/#person` },
        },
      },
      {
        "@type": "ListItem",
        position: 6,
        item: {
          "@type": "CreativeWork",
          name: "Cliper.click",
          description:
            "Real-time cross-platform clipboard and file sharing utility across devices.",
          url: "https://cliper.click/",
          creator: { "@id": `${siteConfig.url}/#person` },
        },
      },
      {
        "@type": "ListItem",
        position: 7,
        item: {
          "@type": "CreativeWork",
          name: "Fortura Global Exim",
          description:
            "High-performance B2B equipment distribution landing page.",
          url: "https://forturaglobalexim.com/",
          creator: { "@id": `${siteConfig.url}/#person` },
        },
      },
      {
        "@type": "ListItem",
        position: 8,
        item: {
          "@type": "CreativeWork",
          name: "ReceiptLog",
          description:
            "AI-powered personal finance mobile application for instant receipt scanning, expense categorization, and budget tracking.",
          creator: { "@id": `${siteConfig.url}/#person` },
        },
      },
      {
        "@type": "ListItem",
        position: 9,
        item: {
          "@type": "CreativeWork",
          name: "TradeEase",
          description:
            "Modern stock and inventory management platform for tracking products, operations, and business analytics.",
          creator: { "@id": `${siteConfig.url}/#person` },
        },
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What services and frontend development do you specialize in?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "I specialize in building high-performance web applications, scalable design systems, interactive marketing landing pages, and cross-platform mobile apps. My primary tech stack includes React, Next.js, TypeScript, Tailwind CSS, and Framer Motion / GSAP for ultra-smooth micro-interactions and animations.",
        },
      },
      {
        "@type": "Question",
        name: "Do you design the UI/UX yourself?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, I design everything myself directly in code from concept to production. Rather than relying on static mockup tools, I conceptualize layout, typography, micro-interactions, and design systems natively with React and CSS — building polished, cohesive digital experiences from scratch.",
        },
      },
      {
        "@type": "Question",
        name: "Are you available for freelance projects or full-time roles?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! I am available for select freelance contracts, MVP product builds, frontend architecture consulting, and full-time frontend engineering opportunities (remote or hybrid).",
        },
      },
      {
        "@type": "Question",
        name: "What is your typical project turnaround timeline?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A high-converting landing page or design system setup typically takes 1–2 weeks. Full-scale SaaS web applications or MVP builds generally range from 3–6 weeks depending on feature scope, backend APIs, and revision cycles.",
        },
      },
      {
        "@type": "Question",
        name: "How do you ensure web performance and responsiveness?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "I follow a mobile-first, performance-obsessed philosophy. Every project undergoes bundle size optimization, semantic SEO structuring, Core Web Vitals audits, and thorough testing across iOS, Android, macOS, and Windows devices.",
        },
      },
      {
        "@type": "Question",
        name: "How do we get started working together?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can reach out directly via the contact form below, email me at abdulshaahid1@gmail.com, or connect on LinkedIn and GitHub. We'll discuss your project requirements, scope, and timeline.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
