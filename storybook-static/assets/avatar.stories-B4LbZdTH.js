import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{A as a,a as t}from"./avatar-dFltxqny.js";const C={title:"Common/Avatar",component:a,tags:["autodocs"],parameters:{layout:"centered",backgrounds:{default:"white"}},argTypes:{size:{control:"select",options:["xs","sm","md","lg"]},bordered:{control:"boolean"}}},m={args:{name:"Sarah Mitchell",size:"md"}},r={render:()=>e.jsxs("div",{className:"flex items-end gap-4",children:[e.jsx(a,{name:"Aisha Patel",id:"m1",size:"xs"}),e.jsx(a,{name:"Jordan Clarke",id:"m2",size:"sm"}),e.jsx(a,{name:"Mei Lin",id:"m3",size:"md"}),e.jsx(a,{name:"Samuel Osei",id:"m4",size:"lg"})]})},s={render:()=>e.jsx("div",{className:"flex items-center gap-3",children:[{name:"Aisha Patel",id:"m1"},{name:"Jordan Clarke",id:"m2"},{name:"Mei Lin",id:"m3"},{name:"Samuel Osei",id:"m4"},{name:"Priya Nair",id:"m5"},{name:"Tom Eriksen",id:"m6"}].map(n=>e.jsx(a,{name:n.name,id:n.id,size:"md"},n.id))})},i={render:()=>e.jsxs("div",{className:"flex -space-x-2",children:[e.jsx(a,{name:"Aisha Patel",id:"m1",size:"md",bordered:!0}),e.jsx(a,{name:"Jordan Clarke",id:"m2",size:"md",bordered:!0}),e.jsx(a,{name:"Mei Lin",id:"m3",size:"md",bordered:!0})]})},d={render:()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(t,{members:[{name:"Aisha Patel",id:"m1"},{name:"Jordan Clarke",id:"m2"},{name:"Mei Lin",id:"m3"}],size:"sm"}),e.jsx(t,{members:[{name:"Aisha Patel",id:"m1"},{name:"Jordan Clarke",id:"m2"},{name:"Mei Lin",id:"m3"},{name:"Samuel Osei",id:"m4"},{name:"Priya Nair",id:"m5"}],limit:3,size:"sm"})]})};var o,l,c;m.parameters={...m.parameters,docs:{...(o=m.parameters)==null?void 0:o.docs,source:{originalSource:`{
  args: {
    name: 'Sarah Mitchell',
    size: 'md'
  }
}`,...(c=(l=m.parameters)==null?void 0:l.docs)==null?void 0:c.source}}};var p,x,u;r.parameters={...r.parameters,docs:{...(p=r.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: () => <div className="flex items-end gap-4">
      <Avatar name="Aisha Patel" id="m1" size="xs" />
      <Avatar name="Jordan Clarke" id="m2" size="sm" />
      <Avatar name="Mei Lin" id="m3" size="md" />
      <Avatar name="Samuel Osei" id="m4" size="lg" />
    </div>
}`,...(u=(x=r.parameters)==null?void 0:x.docs)==null?void 0:u.source}}};var v,z,A;s.parameters={...s.parameters,docs:{...(v=s.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-3">
      {[{
      name: 'Aisha Patel',
      id: 'm1'
    }, {
      name: 'Jordan Clarke',
      id: 'm2'
    }, {
      name: 'Mei Lin',
      id: 'm3'
    }, {
      name: 'Samuel Osei',
      id: 'm4'
    }, {
      name: 'Priya Nair',
      id: 'm5'
    }, {
      name: 'Tom Eriksen',
      id: 'm6'
    }].map(m => <Avatar key={m.id} name={m.name} id={m.id} size="md" />)}
    </div>
}`,...(A=(z=s.parameters)==null?void 0:z.docs)==null?void 0:A.source}}};var f,S,g;i.parameters={...i.parameters,docs:{...(f=i.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: () => <div className="flex -space-x-2">
      <Avatar name="Aisha Patel" id="m1" size="md" bordered />
      <Avatar name="Jordan Clarke" id="m2" size="md" bordered />
      <Avatar name="Mei Lin" id="m3" size="md" bordered />
    </div>
}`,...(g=(S=i.parameters)==null?void 0:S.docs)==null?void 0:g.source}}};var h,k,j;d.parameters={...d.parameters,docs:{...(h=d.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4">
      <AvatarStack members={[{
      name: 'Aisha Patel',
      id: 'm1'
    }, {
      name: 'Jordan Clarke',
      id: 'm2'
    }, {
      name: 'Mei Lin',
      id: 'm3'
    }]} size="sm" />
      <AvatarStack members={[{
      name: 'Aisha Patel',
      id: 'm1'
    }, {
      name: 'Jordan Clarke',
      id: 'm2'
    }, {
      name: 'Mei Lin',
      id: 'm3'
    }, {
      name: 'Samuel Osei',
      id: 'm4'
    }, {
      name: 'Priya Nair',
      id: 'm5'
    }]} limit={3} size="sm" />
    </div>
}`,...(j=(k=d.parameters)==null?void 0:k.docs)==null?void 0:j.source}}};const M=["Default","Sizes","DifferentColors","Bordered","Stack"];export{i as Bordered,m as Default,s as DifferentColors,r as Sizes,d as Stack,M as __namedExportsOrder,C as default};
