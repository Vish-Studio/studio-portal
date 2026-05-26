import{j as r}from"./jsx-runtime-D_zvdyIk.js";import{B as e}from"./button-_wOG-Qwa.js";import{o as P,m as D,A}from"./material-lucide-icons-DONtn2OU.js";import"./material-icon-DL-uhJfy.js";const k={title:"Common/Button",component:e,tags:["autodocs"],parameters:{layout:"centered",backgrounds:{default:"white"}},argTypes:{variant:{control:"select",options:["primary","secondary","ghost","danger"]},size:{control:"select",options:["sm","md"]}},args:{children:"Save changes",variant:"primary",size:"md"}},a={},n={args:{variant:"secondary",children:"Cancel"}},s={args:{variant:"ghost",children:"Preview"}},t={args:{variant:"danger",children:"Delete",iconLeft:r.jsx(D,{size:14})}},o={args:{loading:!0,children:"Saving"}},i={render:()=>r.jsxs("div",{className:"flex flex-wrap items-center gap-3",children:[r.jsx(e,{iconLeft:r.jsx(P,{size:14}),children:"Primary"}),r.jsx(e,{variant:"secondary",children:"Secondary"}),r.jsx(e,{variant:"ghost",children:"Ghost"}),r.jsx(e,{variant:"danger",iconLeft:r.jsx(D,{size:14}),children:"Danger"}),r.jsx(e,{size:"sm",iconRight:r.jsx(A,{size:14}),children:"Small"}),r.jsx(e,{loading:!0,children:"Loading"})]})};var c,d,m;a.parameters={...a.parameters,docs:{...(c=a.parameters)==null?void 0:c.docs,source:{originalSource:"{}",...(m=(d=a.parameters)==null?void 0:d.docs)==null?void 0:m.source}}};var l,g,p;n.parameters={...n.parameters,docs:{...(l=n.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    variant: 'secondary',
    children: 'Cancel'
  }
}`,...(p=(g=n.parameters)==null?void 0:g.docs)==null?void 0:p.source}}};var u,h,v;s.parameters={...s.parameters,docs:{...(u=s.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    variant: 'ghost',
    children: 'Preview'
  }
}`,...(v=(h=s.parameters)==null?void 0:h.docs)==null?void 0:v.source}}};var x,y,f;t.parameters={...t.parameters,docs:{...(x=t.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    variant: 'danger',
    children: 'Delete',
    iconLeft: <Trash2 size={14} />
  }
}`,...(f=(y=t.parameters)==null?void 0:y.docs)==null?void 0:f.source}}};var B,S,j;o.parameters={...o.parameters,docs:{...(B=o.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    loading: true,
    children: 'Saving'
  }
}`,...(j=(S=o.parameters)==null?void 0:S.docs)==null?void 0:j.source}}};var z,L,w;i.parameters={...i.parameters,docs:{...(z=i.parameters)==null?void 0:z.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap items-center gap-3">
      <Button iconLeft={<Check size={14} />}>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger" iconLeft={<Trash2 size={14} />}>Danger</Button>
      <Button size="sm" iconRight={<ArrowRight size={14} />}>Small</Button>
      <Button loading>Loading</Button>
    </div>
}`,...(w=(L=i.parameters)==null?void 0:L.docs)==null?void 0:w.source}}};const E=["Primary","Secondary","Ghost","Danger","Loading","AllVariants"];export{i as AllVariants,t as Danger,s as Ghost,o as Loading,a as Primary,n as Secondary,E as __namedExportsOrder,k as default};
