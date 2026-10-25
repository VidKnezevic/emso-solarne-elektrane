import { absUrl } from '@/lib/site';

export const dynamic = 'force-static';

const PAGES = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/elektro-punionice/', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/poticaji-za-solarne-elektrane-2026/', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/vodic-solarne-elektrane-2026/', priority: 0.8, changeFrequency: 'monthly' },
];

export default function sitemap() {
  const lastModified = new Date();
  return PAGES.map((p) => ({
    url: absUrl(p.path),
    lastModified,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
    alternates: { languages: { 'hr-HR': absUrl(p.path) } },
  }));
}
