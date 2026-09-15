import type { Route } from 'next';

import Link from 'next/link';

import { footerLinks } from '../_constants/footerLinks';

const FooterLinkGroups = () => (
  <div className="grid gap-8 py-10 sm:grid-cols-2 md:grid-cols-4 lg:py-12">
    {footerLinks.map((group) => (
      <div key={group.title}>
        <h4 className="font-display text-sm font-bold text-[#11233f]">{group.title}</h4>
        <ul className="mt-4 space-y-3">
          {group.links.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href as Route}
                className="inline-flex items-center gap-1 text-sm text-[#6c7280] transition hover:text-[#ff7a45]"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

export default FooterLinkGroups;
