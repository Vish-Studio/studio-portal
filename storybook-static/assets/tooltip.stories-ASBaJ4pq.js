import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{T as N}from"./tooltip-CFoL2YCS.js";import"./index-CwcVQgaJ.js";import"./index-C8bfMtE3.js";const k={title:"Common/Tooltip",component:N,tags:["autodocs"],parameters:{layout:"centered",backgrounds:{default:"white"}}},d=({label:o})=>e.jsx("button",{className:"px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-xl",children:o}),t={args:{content:"Tooltip on top",side:"top",children:e.jsx(d,{label:"Hover me"})},decorators:[o=>e.jsx("div",{className:"p-16",children:e.jsx(o,{})})]},r={args:{content:"Tooltip on bottom",side:"bottom",children:e.jsx(d,{label:"Hover me"})},decorators:[o=>e.jsx("div",{className:"p-16",children:e.jsx(o,{})})]},s={args:{content:"Tooltip on left",side:"left",children:e.jsx(d,{label:"Hover me"})},decorators:[o=>e.jsx("div",{className:"p-16",children:e.jsx(o,{})})]},a={args:{content:"Tooltip on right",side:"right",children:e.jsx(d,{label:"Hover me"})},decorators:[o=>e.jsx("div",{className:"p-16",children:e.jsx(o,{})})]},c={render:()=>e.jsx("div",{className:"grid grid-cols-2 gap-12 p-16",children:["top","bottom","left","right"].map(o=>e.jsx("div",{className:"flex items-center justify-center",children:e.jsx(N,{content:`Side: ${o}`,side:o,children:e.jsx("button",{className:"px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl border border-gray-200",children:o})})},o))})};var i,l,n;t.parameters={...t.parameters,docs:{...(i=t.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    content: 'Tooltip on top',
    side: 'top',
    children: <Btn label="Hover me" />
  },
  decorators: [Story => <div className="p-16"><Story /></div>]
}`,...(n=(l=t.parameters)==null?void 0:l.docs)==null?void 0:n.source}}};var m,p,g;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    content: 'Tooltip on bottom',
    side: 'bottom',
    children: <Btn label="Hover me" />
  },
  decorators: [Story => <div className="p-16"><Story /></div>]
}`,...(g=(p=r.parameters)==null?void 0:p.docs)==null?void 0:g.source}}};var x,u,b;s.parameters={...s.parameters,docs:{...(x=s.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    content: 'Tooltip on left',
    side: 'left',
    children: <Btn label="Hover me" />
  },
  decorators: [Story => <div className="p-16"><Story /></div>]
}`,...(b=(u=s.parameters)==null?void 0:u.docs)==null?void 0:b.source}}};var h,v,y;a.parameters={...a.parameters,docs:{...(h=a.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    content: 'Tooltip on right',
    side: 'right',
    children: <Btn label="Hover me" />
  },
  decorators: [Story => <div className="p-16"><Story /></div>]
}`,...(y=(v=a.parameters)==null?void 0:v.docs)==null?void 0:y.source}}};var j,f,S;c.parameters={...c.parameters,docs:{...(j=c.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-2 gap-12 p-16">
      {(['top', 'bottom', 'left', 'right'] as const).map(side => <div key={side} className="flex items-center justify-center">
          <Tooltip content={\`Side: \${side}\`} side={side}>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl border border-gray-200">
              {side}
            </button>
          </Tooltip>
        </div>)}
    </div>
}`,...(S=(f=c.parameters)==null?void 0:f.docs)==null?void 0:S.source}}};const w=["Top","Bottom","Left","Right","AllSides"];export{c as AllSides,r as Bottom,s as Left,a as Right,t as Top,w as __namedExportsOrder,k as default};
