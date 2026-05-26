import{j as a}from"./jsx-runtime-D_zvdyIk.js";import{C as S}from"./card-content-BQKrQHv8.js";import{B as b}from"./button-icon-CawgxlcK.js";import"./material-icon-DL-uhJfy.js";const R={title:"Common/CardContent",component:S,tags:["autodocs"],parameters:{layout:"centered",backgrounds:{default:"app"}},argTypes:{variant:{control:"select",options:["white","lime","surface","dark"]}}},e=()=>a.jsx("div",{className:"px-6 py-5 text-sm text-gray-500",children:"Card body content goes here. This area scrolls independently."}),r={args:{variant:"white",iconName:"work",title:"Recent Projects",children:a.jsx(e,{})}},t={args:{variant:"white",iconName:"payments",title:"Financials",action:a.jsx(b,{iconName:"arrow_outward",clickHandler:()=>{},"aria-label":"View all"}),children:a.jsx(e,{})}},n={args:{variant:"surface",iconName:"group",title:"Assigned Team",children:a.jsx(e,{})}},s={args:{variant:"dark",iconName:"insights",title:"Analytics",children:a.jsx(e,{})}},i={args:{variant:"lime",iconName:"bolt",title:"Quick Actions",children:a.jsx(e,{})}},o={render:()=>a.jsx("div",{className:"grid grid-cols-2 gap-4 w-[640px]",children:["white","surface","dark","lime"].map(c=>a.jsx(S,{variant:c,iconName:"work",title:`${c} variant`,children:a.jsx("div",{className:"px-6 py-5 text-sm opacity-60",children:"Body content"})},c))})};var d,l,m;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    variant: 'white',
    iconName: 'work',
    title: 'Recent Projects',
    children: <Body />
  }
}`,...(m=(l=r.parameters)==null?void 0:l.docs)==null?void 0:m.source}}};var p,u,g;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    variant: 'white',
    iconName: 'payments',
    title: 'Financials',
    action: <ButtonIcon iconName="arrow_outward" clickHandler={() => {}} aria-label="View all" />,
    children: <Body />
  }
}`,...(g=(u=t.parameters)==null?void 0:u.docs)==null?void 0:g.source}}};var h,v,x;n.parameters={...n.parameters,docs:{...(h=n.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    variant: 'surface',
    iconName: 'group',
    title: 'Assigned Team',
    children: <Body />
  }
}`,...(x=(v=n.parameters)==null?void 0:v.docs)==null?void 0:x.source}}};var y,w,N;s.parameters={...s.parameters,docs:{...(y=s.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    variant: 'dark',
    iconName: 'insights',
    title: 'Analytics',
    children: <Body />
  }
}`,...(N=(w=s.parameters)==null?void 0:w.docs)==null?void 0:N.source}}};var k,j,f;i.parameters={...i.parameters,docs:{...(k=i.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    variant: 'lime',
    iconName: 'bolt',
    title: 'Quick Actions',
    children: <Body />
  }
}`,...(f=(j=i.parameters)==null?void 0:j.docs)==null?void 0:f.source}}};var B,C,A;o.parameters={...o.parameters,docs:{...(B=o.parameters)==null?void 0:B.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-2 gap-4 w-[640px]">
      {(['white', 'surface', 'dark', 'lime'] as const).map(variant => <CardContent key={variant} variant={variant} iconName="work" title={\`\${variant} variant\`}>
          <div className="px-6 py-5 text-sm opacity-60">Body content</div>
        </CardContent>)}
    </div>
}`,...(A=(C=o.parameters)==null?void 0:C.docs)==null?void 0:A.source}}};const D=["White","WithAction","Surface","Dark","Lime","AllVariants"];export{o as AllVariants,s as Dark,i as Lime,n as Surface,r as White,t as WithAction,D as __namedExportsOrder,R as default};
