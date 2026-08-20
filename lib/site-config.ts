export const siteConfig = {
  name: "Mohamed Abdul Shahid",
  shortName: "Abdul Shahid",
  username: "abdulshaahid",
  title: "Mohamed Abdul Shahid — Frontend Developer & UI/UX Designer",
  role: "Frontend Developer & UI/UX Designer",
  description:
    "React Frontend Developer, Design Engineer, and UI/UX Designer based in Kerala, India. Crafting purposeful digital experiences, high-performance web systems, and scalable design architectures.",
  url: (() => {
    if (process.env.NEXT_PUBLIC_SITE_URL) {
      return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
    }
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
      return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/\/$/, "")}`;
    }
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
    }
    return "https://abdulshaahid.me";
  })(),
  email: "abdulshaahid1@gmail.com",
  phone: "+91 62826 69441",
  phoneRaw: "+916282669441",
  location: {
    city: "Kerala",
    country: "India",
    addressRegion: "Kerala",
    addressCountry: "India",
  },
  socials: {
    github: "https://github.com/abdulshaahid",
    linkedin: "https://www.linkedin.com/in/mohamedabdulshahid/",
    instagram: "https://instagram.com/abdulshaahid/",
  },
  keywords: [
    "Mohamed Abdul Shahid",
    "Abdul Shahid",
    "Abdul Shaahid",
    "Frontend Developer",
    "Design Engineer",
    "UI/UX Designer",
    "React Developer",
    "Next.js Developer",
    "TypeScript Developer",
    "Tailwind CSS",
    "Framer Motion",
    "Web Design Portfolio",
    "Full Stack Developer Kerala",
    "Design Systems",
    "Web Performance",
    "Software Engineer",
  ],
  education: {
    institution: "MEA Engineering College",
    degree: "Bachelor of Technology in Computer Science & Engineering",
    location: "Kerala, India",
  },
  currentWork: {
    company: "Trawayl",
    role: "Design Engineer & Frontend Lead",
    url: "https://trawayl.com",
  },
} as const;

export type SiteConfig = typeof siteConfig;
