import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{S as f}from"./status-icon-BHjbPUZJ.js";const y={title:"Common/StatusIcon",component:f,tags:["autodocs"],parameters:{layout:"centered",backgrounds:{default:"white"}},argTypes:{status:{control:"select",options:["active","inactive","pending"]}}},s={args:{status:"active"}},a={args:{status:"inactive"}},t={args:{status:"pending"}},r={render:()=>e.jsx("div",{className:"flex items-center gap-4",children:["active","inactive","pending"].map(c=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(f,{status:c}),e.jsx("span",{className:"text-sm text-gray-600 capitalize",children:c})]},c))})};var n,i,o;s.parameters={...s.parameters,docs:{...(n=s.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    status: 'active'
  }
}`,...(o=(i=s.parameters)==null?void 0:i.docs)==null?void 0:o.source}}};var m,p,d;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    status: 'inactive'
  }
}`,...(d=(p=a.parameters)==null?void 0:p.docs)==null?void 0:d.source}}};var u,l,g;t.parameters={...t.parameters,docs:{...(u=t.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    status: 'pending'
  }
}`,...(g=(l=t.parameters)==null?void 0:l.docs)==null?void 0:g.source}}};var v,x,S;r.parameters={...r.parameters,docs:{...(v=r.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-4">
      {(['active', 'inactive', 'pending'] as const).map(status => <div key={status} className="flex items-center gap-2">
          <StatusIcon status={status} />
          <span className="text-sm text-gray-600 capitalize">{status}</span>
        </div>)}
    </div>
}`,...(S=(x=r.parameters)==null?void 0:x.docs)==null?void 0:S.source}}};const I=["Active","Inactive","Pending","AllStatuses"];export{s as Active,r as AllStatuses,a as Inactive,t as Pending,I as __namedExportsOrder,y as default};
