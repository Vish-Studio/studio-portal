import type { Meta, StoryObj } from '@storybook/react';
import { Briefcase, Mail, Phone, TrendingUp } from 'lucide-react';
import DetailHeroCard from '../detail-hero-card';

const meta = {
  title: 'Admin/DetailHeroCard',
  tags: ['autodocs'],
  parameters: { layout: 'centered', backgrounds: { default: 'app' } },
} satisfies Meta;

export default meta;

export const ClientExample: StoryObj = {
  render: () => (
    <div className="w-80">
      <DetailHeroCard>
        <DetailHeroCard.Hero>
          <DetailHeroCard.Glow />
          <div className="w-14 h-14 rounded-2xl bg-violet-500 flex items-center justify-center text-2xl font-black text-white mb-4">
            S
          </div>
          <h2 className="text-xl font-bold text-white">Sarah Mitchell</h2>
          <p className="text-sm text-gray-400 mt-0.5">Acme Corp</p>
          <p className="text-[11px] text-gray-600 mt-3">Client since Jan 5, 2026</p>
        </DetailHeroCard.Hero>

        <DetailHeroCard.Section className="space-y-3">
          <DetailHeroCard.IconRow icon={<Mail size={12} className="text-gray-400" />}>
            <span className="text-sm text-gray-300">sarah@acme.com</span>
          </DetailHeroCard.IconRow>
          <DetailHeroCard.IconRow icon={<Phone size={12} className="text-gray-400" />}>
            <span className="text-sm text-gray-300">+1 (555) 201-4400</span>
          </DetailHeroCard.IconRow>
        </DetailHeroCard.Section>

        <DetailHeroCard.Stats>
          <DetailHeroCard.Stat label="Projects" icon={<Briefcase size={11} />} value={3} sub="2 active" />
          <DetailHeroCard.Stat
            label="Value"
            icon={<TrendingUp size={11} />}
            value="$15k"
            sub="$11k paid"
            valueStyle={{ color: 'var(--color-accent-lime)' }}
          />
        </DetailHeroCard.Stats>

        <DetailHeroCard.Footer
          label="Outstanding balance"
          value={<span className="text-sm font-bold text-amber-400">$4,000</span>}
        />
      </DetailHeroCard>
    </div>
  ),
};

export const NoFooter: StoryObj = {
  render: () => (
    <div className="w-80">
      <DetailHeroCard>
        <DetailHeroCard.Hero>
          <DetailHeroCard.Glow />
          <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-2xl font-black text-white mb-4">
            J
          </div>
          <h2 className="text-xl font-bold text-white">James Lee</h2>
          <p className="text-sm text-gray-400 mt-0.5">Globex</p>
        </DetailHeroCard.Hero>
        <DetailHeroCard.Stats>
          <DetailHeroCard.Stat label="Projects" icon={<Briefcase size={11} />} value={2} sub="2 active" />
          <DetailHeroCard.Stat label="Value" icon={<TrendingUp size={11} />} value="$12k" sub="$9.5k paid"
            valueStyle={{ color: 'var(--color-accent-lime)' }} />
        </DetailHeroCard.Stats>
      </DetailHeroCard>
    </div>
  ),
};
