import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{C as L,U as w,b as S,t as f,a as P,T as O}from"./material-lucide-icons-DONtn2OU.js";import{S as a}from"./stat-card-mltzYa0B.js";import"./material-icon-DL-uhJfy.js";const U={title:"Common/StatCard",component:a,tags:["autodocs"],parameters:{layout:"centered"},argTypes:{variant:{control:"select",options:["lime","surface","dark","white"]}}},r={args:{variant:"lime",icon:e.jsx(L,{size:16}),label:"Ongoing Projects",value:"12",badge:"68% capacity",badgeLabel:"Projects in progress"}},s={args:{variant:"surface",icon:e.jsx(w,{size:16}),label:"Client Overview",value:"24",badge:e.jsxs(e.Fragment,{children:[e.jsx(O,{size:14,className:"text-green-600"})," +12%"]}),badgeLabel:"Active this month"}},t={args:{variant:"dark",icon:e.jsx(S,{size:16}),label:"Payment Overview",value:"$18,240",valueSubLabel:"collected",badge:e.jsxs(e.Fragment,{children:[e.jsx(P,{size:14,className:"text-red-400"})," -5%"]}),badgeLabel:"Versus last month"}},i={args:{variant:"white",icon:e.jsx(f,{size:16}),label:"Total Projects",value:"36",badge:"8 active",badgeLabel:"in progress"}},n={render:()=>e.jsxs("div",{className:"grid grid-cols-2 gap-4 w-[700px]",children:[e.jsx(a,{variant:"lime",icon:e.jsx(L,{size:16}),label:"Ongoing Projects",value:"12",badge:"68% capacity",badgeLabel:"in progress"}),e.jsx(a,{variant:"surface",icon:e.jsx(w,{size:16}),label:"Client Overview",value:"24",badge:"+12%",badgeLabel:"vs last month"}),e.jsx(a,{variant:"dark",icon:e.jsx(S,{size:16}),label:"Payment Overview",value:"$18k",badge:"-5%",badgeLabel:"vs last month"}),e.jsx(a,{variant:"white",icon:e.jsx(f,{size:16}),label:"Total Projects",value:"36",badge:"8 active",badgeLabel:"in progress"})]})};var o,l,c;r.parameters={...r.parameters,docs:{...(o=r.parameters)==null?void 0:o.docs,source:{originalSource:`{
  args: {
    variant: 'lime',
    icon: <Command size={16} />,
    label: 'Ongoing Projects',
    value: '12',
    badge: '68% capacity',
    badgeLabel: 'Projects in progress'
  }
}`,...(c=(l=r.parameters)==null?void 0:l.docs)==null?void 0:c.source}}};var d,g,b;s.parameters={...s.parameters,docs:{...(d=s.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    variant: 'surface',
    icon: <Users size={16} />,
    label: 'Client Overview',
    value: '24',
    badge: <><TrendingUp size={14} className="text-green-600" /> +12%</>,
    badgeLabel: 'Active this month'
  }
}`,...(b=(g=s.parameters)==null?void 0:g.docs)==null?void 0:b.source}}};var m,v,p;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    variant: 'dark',
    icon: <CreditCard size={16} />,
    label: 'Payment Overview',
    value: '$18,240',
    valueSubLabel: 'collected',
    badge: <><TrendingDown size={14} className="text-red-400" /> -5%</>,
    badgeLabel: 'Versus last month'
  }
}`,...(p=(v=t.parameters)==null?void 0:v.docs)==null?void 0:p.source}}};var u,j,x;i.parameters={...i.parameters,docs:{...(u=i.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    variant: 'white',
    icon: <Briefcase size={16} />,
    label: 'Total Projects',
    value: '36',
    badge: '8 active',
    badgeLabel: 'in progress'
  }
}`,...(x=(j=i.parameters)==null?void 0:j.docs)==null?void 0:x.source}}};var C,h,z;n.parameters={...n.parameters,docs:{...(C=n.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-2 gap-4 w-[700px]">
      <StatCard variant="lime" icon={<Command size={16} />} label="Ongoing Projects" value="12" badge="68% capacity" badgeLabel="in progress" />
      <StatCard variant="surface" icon={<Users size={16} />} label="Client Overview" value="24" badge="+12%" badgeLabel="vs last month" />
      <StatCard variant="dark" icon={<CreditCard size={16} />} label="Payment Overview" value="$18k" badge="-5%" badgeLabel="vs last month" />
      <StatCard variant="white" icon={<Briefcase size={16} />} label="Total Projects" value="36" badge="8 active" badgeLabel="in progress" />
    </div>
}`,...(z=(h=n.parameters)==null?void 0:h.docs)==null?void 0:z.source}}};const A=["Lime","Surface","Dark","White","AllVariants"];export{n as AllVariants,t as Dark,r as Lime,s as Surface,i as White,A as __namedExportsOrder,U as default};
