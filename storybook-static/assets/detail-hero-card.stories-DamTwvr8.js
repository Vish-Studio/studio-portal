import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{s as m,P as p,t as x,T as d}from"./material-lucide-icons-DONtn2OU.js";import{D as a}from"./detail-hero-card-EgUtOYdH.js";import"./material-icon-DL-uhJfy.js";const v={title:"Admin/DetailHeroCard",tags:["autodocs"],parameters:{layout:"centered",backgrounds:{default:"app"}}},t={render:()=>e.jsx("div",{className:"w-80",children:e.jsxs(a,{children:[e.jsxs(a.Hero,{children:[e.jsx(a.Glow,{}),e.jsx("div",{className:"w-14 h-14 rounded-2xl bg-violet-500 flex items-center justify-center text-2xl font-black text-white mb-4",children:"S"}),e.jsx("h2",{className:"text-xl font-bold text-white",children:"Sarah Mitchell"}),e.jsx("p",{className:"text-sm text-gray-400 mt-0.5",children:"Acme Corp"}),e.jsx("p",{className:"text-[11px] text-gray-600 mt-3",children:"Client since Jan 5, 2026"})]}),e.jsxs(a.Section,{className:"space-y-3",children:[e.jsx(a.IconRow,{icon:e.jsx(m,{size:12,className:"text-gray-400"}),children:e.jsx("span",{className:"text-sm text-gray-300",children:"sarah@acme.com"})}),e.jsx(a.IconRow,{icon:e.jsx(p,{size:12,className:"text-gray-400"}),children:e.jsx("span",{className:"text-sm text-gray-300",children:"+1 (555) 201-4400"})})]}),e.jsxs(a.Stats,{children:[e.jsx(a.Stat,{label:"Projects",icon:e.jsx(x,{size:11}),value:3,sub:"2 active"}),e.jsx(a.Stat,{label:"Value",icon:e.jsx(d,{size:11}),value:"$15k",sub:"$11k paid",valueStyle:{color:"var(--color-accent-lime)"}})]}),e.jsx(a.Footer,{label:"Outstanding balance",value:e.jsx("span",{className:"text-sm font-bold text-amber-400",children:"$4,000"})})]})})},s={render:()=>e.jsx("div",{className:"w-80",children:e.jsxs(a,{children:[e.jsxs(a.Hero,{children:[e.jsx(a.Glow,{}),e.jsx("div",{className:"w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-2xl font-black text-white mb-4",children:"J"}),e.jsx("h2",{className:"text-xl font-bold text-white",children:"James Lee"}),e.jsx("p",{className:"text-sm text-gray-400 mt-0.5",children:"Globex"})]}),e.jsxs(a.Stats,{children:[e.jsx(a.Stat,{label:"Projects",icon:e.jsx(x,{size:11}),value:2,sub:"2 active"}),e.jsx(a.Stat,{label:"Value",icon:e.jsx(d,{size:11}),value:"$12k",sub:"$9.5k paid",valueStyle:{color:"var(--color-accent-lime)"}})]})]})})};var r,l,o;t.parameters={...t.parameters,docs:{...(r=t.parameters)==null?void 0:r.docs,source:{originalSource:`{
  render: () => <div className="w-80">
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
          <DetailHeroCard.Stat label="Value" icon={<TrendingUp size={11} />} value="$15k" sub="$11k paid" valueStyle={{
          color: 'var(--color-accent-lime)'
        }} />
        </DetailHeroCard.Stats>

        <DetailHeroCard.Footer label="Outstanding balance" value={<span className="text-sm font-bold text-amber-400">$4,000</span>} />
      </DetailHeroCard>
    </div>
}`,...(o=(l=t.parameters)==null?void 0:l.docs)==null?void 0:o.source}}};var i,c,n;s.parameters={...s.parameters,docs:{...(i=s.parameters)==null?void 0:i.docs,source:{originalSource:`{
  render: () => <div className="w-80">
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
          <DetailHeroCard.Stat label="Value" icon={<TrendingUp size={11} />} value="$12k" sub="$9.5k paid" valueStyle={{
          color: 'var(--color-accent-lime)'
        }} />
        </DetailHeroCard.Stats>
      </DetailHeroCard>
    </div>
}`,...(n=(c=s.parameters)==null?void 0:c.docs)==null?void 0:n.source}}};const C=["ClientExample","NoFooter"];export{t as ClientExample,s as NoFooter,C as __namedExportsOrder,v as default};
