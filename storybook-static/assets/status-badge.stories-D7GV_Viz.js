import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{S as a,C as g,P as v,T as s}from"./status-badge-DWTpbZUN.js";const Y={title:"Common/StatusBadge",component:a,tags:["autodocs"],parameters:{layout:"centered",backgrounds:{default:"white"}},argTypes:{variant:{control:"select",options:["green","amber","red","gray","blue","purple","violet"]}}},r={args:{label:"active",variant:"green"}},t={args:{label:"paused",variant:"amber"}},n={args:{label:"overdue",variant:"red"}},o={args:{label:"inactive",variant:"gray"}},l={args:{label:"in review",variant:"blue"}},d={args:{label:"planned",variant:"purple"}},c={args:{label:"blocked",variant:"violet"}},i={name:"All Variants — rounded square design",parameters:{docs:{description:{story:"Rounded-square chip with a 1.5×1.5 square dot indicator. `rounded-[6px]` replaces the legacy `rounded-full` pill shape."}}},render:()=>e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx(a,{label:"green",variant:"green"}),e.jsx(a,{label:"amber",variant:"amber"}),e.jsx(a,{label:"red",variant:"red"}),e.jsx(a,{label:"gray",variant:"gray"}),e.jsx(a,{label:"blue",variant:"blue"}),e.jsx(a,{label:"purple",variant:"purple"}),e.jsx(a,{label:"violet",variant:"violet"})]})},u={render:()=>e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx(g,{status:"active"}),e.jsx(g,{status:"inactive"}),e.jsx(g,{status:"lost"})]})},p={render:()=>e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx(v,{status:"active"}),e.jsx(v,{status:"paused"}),e.jsx(v,{status:"completed"})]})},m={name:"Task Statuses — in-progress, todo, to-test, completed",render:()=>e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx(s,{status:"todo"}),e.jsx(s,{status:"in-progress"}),e.jsx(s,{status:"to-test"}),e.jsx(s,{status:"completed"})]})};var b,x,S;r.parameters={...r.parameters,docs:{...(b=r.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    label: 'active',
    variant: 'green'
  }
}`,...(S=(x=r.parameters)==null?void 0:x.docs)==null?void 0:S.source}}};var j,B,f;t.parameters={...t.parameters,docs:{...(j=t.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    label: 'paused',
    variant: 'amber'
  }
}`,...(f=(B=t.parameters)==null?void 0:B.docs)==null?void 0:f.source}}};var y,h,w;n.parameters={...n.parameters,docs:{...(y=n.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    label: 'overdue',
    variant: 'red'
  }
}`,...(w=(h=n.parameters)==null?void 0:h.docs)==null?void 0:w.source}}};var k,T,P;o.parameters={...o.parameters,docs:{...(k=o.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    label: 'inactive',
    variant: 'gray'
  }
}`,...(P=(T=o.parameters)==null?void 0:T.docs)==null?void 0:P.source}}};var C,N,q;l.parameters={...l.parameters,docs:{...(C=l.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    label: 'in review',
    variant: 'blue'
  }
}`,...(q=(N=l.parameters)==null?void 0:N.docs)==null?void 0:q.source}}};var A,V,R;d.parameters={...d.parameters,docs:{...(A=d.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    label: 'planned',
    variant: 'purple'
  }
}`,...(R=(V=d.parameters)==null?void 0:V.docs)==null?void 0:R.source}}};var G,E,_;c.parameters={...c.parameters,docs:{...(G=c.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    label: 'blocked',
    variant: 'violet'
  }
}`,...(_=(E=c.parameters)==null?void 0:E.docs)==null?void 0:_.source}}};var O,z,D;i.parameters={...i.parameters,docs:{...(O=i.parameters)==null?void 0:O.docs,source:{originalSource:`{
  name: 'All Variants — rounded square design',
  parameters: {
    docs: {
      description: {
        story: 'Rounded-square chip with a 1.5×1.5 square dot indicator. \`rounded-[6px]\` replaces the legacy \`rounded-full\` pill shape.'
      }
    }
  },
  render: () => <div className="flex flex-wrap gap-2">
      <StatusBadge label="green" variant="green" />
      <StatusBadge label="amber" variant="amber" />
      <StatusBadge label="red" variant="red" />
      <StatusBadge label="gray" variant="gray" />
      <StatusBadge label="blue" variant="blue" />
      <StatusBadge label="purple" variant="purple" />
      <StatusBadge label="violet" variant="violet" />
    </div>
}`,...(D=(z=i.parameters)==null?void 0:z.docs)==null?void 0:D.source}}};var F,H,I;u.parameters={...u.parameters,docs:{...(F=u.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-2">
      <ClientStatusBadge status="active" />
      <ClientStatusBadge status="inactive" />
      <ClientStatusBadge status="lost" />
    </div>
}`,...(I=(H=u.parameters)==null?void 0:H.docs)==null?void 0:I.source}}};var J,K,L;p.parameters={...p.parameters,docs:{...(J=p.parameters)==null?void 0:J.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-2">
      <ProjectStatusBadge status="active" />
      <ProjectStatusBadge status="paused" />
      <ProjectStatusBadge status="completed" />
    </div>
}`,...(L=(K=p.parameters)==null?void 0:K.docs)==null?void 0:L.source}}};var M,Q,U;m.parameters={...m.parameters,docs:{...(M=m.parameters)==null?void 0:M.docs,source:{originalSource:`{
  name: 'Task Statuses — in-progress, todo, to-test, completed',
  render: () => <div className="flex flex-wrap gap-2">
      <TaskStatusBadge status="todo" />
      <TaskStatusBadge status="in-progress" />
      <TaskStatusBadge status="to-test" />
      <TaskStatusBadge status="completed" />
    </div>
}`,...(U=(Q=m.parameters)==null?void 0:Q.docs)==null?void 0:U.source}}};const Z=["Green","Amber","Red","Gray","Blue","Purple","Violet","AllVariants","ClientStatuses","ProjectStatuses","TaskStatuses"];export{i as AllVariants,t as Amber,l as Blue,u as ClientStatuses,o as Gray,r as Green,p as ProjectStatuses,d as Purple,n as Red,m as TaskStatuses,c as Violet,Z as __namedExportsOrder,Y as default};
