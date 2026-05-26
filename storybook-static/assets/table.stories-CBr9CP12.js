import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{N as L,u as T,m as A}from"./material-lucide-icons-DONtn2OU.js";import{T as s,a as U,R as I}from"./table-wx5_20zr.js";import{S as R}from"./status-badge-DWTpbZUN.js";import"./material-icon-DL-uhJfy.js";import"./index-CwcVQgaJ.js";const m=[{id:"c1",name:"Sarah Mitchell",company:"Acme Corp",email:"sarah@acme.com",status:"active"},{id:"c2",name:"James Lee",company:"Globex",email:"james@globex.com",status:"active"},{id:"c3",name:"Priya Shah",company:"Initech",email:"priya@initech.com",status:"inactive"},{id:"c4",name:"Tony Nguyen",company:"Stark Ind.",email:"tony@stark.com",status:"lost"},{id:"c5",name:"Elena Vasquez",company:"Umbrella",email:"elena@umbrella.com",status:"active"}],f={active:"green",inactive:"amber",lost:"red"},D=[{label:"View",icon:e.jsx(L,{size:14}),onClick:()=>{}},{label:"Edit",icon:e.jsx(T,{size:14}),onClick:()=>{}},{label:"Delete",icon:e.jsx(A,{size:14}),onClick:()=>{},variant:"danger"}],n=[{key:"name",label:"Name",render:a=>e.jsxs("div",{children:[e.jsx("p",{className:"font-semibold text-gray-900",children:a.name}),e.jsx("p",{className:"text-xs text-gray-400 font-mono",children:a.id})]})},{key:"company",label:"Company",hideBelow:"md"},{key:"email",label:"Email",hideBelow:"lg",render:a=>e.jsx("span",{className:"text-gray-500",children:a.email})},{key:"status",label:"Status",render:a=>e.jsx(R,{label:a.status,variant:f[a.status]})},{key:"actions",label:"",align:"right",width:"w-10 md:w-auto",sortable:!1,render:()=>e.jsx(U,{actions:D})}],P=[{key:"name",label:"Name",render:a=>e.jsx("p",{className:"font-semibold text-gray-900",children:a.name})},{key:"company",label:"Company",hideBelow:"md"},{key:"status",label:"Status",render:a=>e.jsx(R,{label:a.status,variant:f[a.status]})},{key:"actions",label:"",align:"right",width:"w-10",sortable:!1,render:()=>e.jsx(I,{actions:D})}],G={title:"Common/TableData",component:s,tags:["autodocs"],parameters:{layout:"fullscreen",backgrounds:{default:"white"}}},t={name:"RowActions — responsive (desktop inline / mobile 3-dot)",parameters:{docs:{description:{story:"On `md+` screens action buttons appear inline. Below `md` a compact 3-dot dropdown is shown instead."}}},render:()=>e.jsx("div",{className:"p-6 h-screen",children:e.jsx(s,{columns:n,data:m,className:"h-80"})})},r={name:"RowActionsMenu — always 3-dot (legacy)",render:()=>e.jsx("div",{className:"p-6 h-screen",children:e.jsx(s,{columns:P,data:m,className:"h-80"})})},o={render:()=>e.jsx("div",{className:"p-6 h-screen",children:e.jsx(s,{columns:n,data:m,className:"h-96"})})},c={render:()=>e.jsx("div",{className:"p-6 h-screen",children:e.jsx(s,{columns:n,data:[],loading:!0,className:"h-96"})})},l={render:()=>e.jsx("div",{className:"p-6 h-screen",children:e.jsx(s,{columns:n,data:[],emptyMessage:"No clients yet.",className:"h-96"})})},i={render:()=>e.jsx("div",{className:"p-6 h-screen",children:e.jsx(s,{columns:n,data:m,defaultSort:{key:"name",dir:"asc"},className:"h-96"})})};var d,p,u;t.parameters={...t.parameters,docs:{...(d=t.parameters)==null?void 0:d.docs,source:{originalSource:`{
  name: 'RowActions — responsive (desktop inline / mobile 3-dot)',
  parameters: {
    docs: {
      description: {
        story: 'On \`md+\` screens action buttons appear inline. Below \`md\` a compact 3-dot dropdown is shown instead.'
      }
    }
  },
  render: () => <div className="p-6 h-screen">
      <TableData<Client> columns={COLUMNS_RESPONSIVE} data={DEMO} className="h-80" />
    </div>
}`,...(u=(p=t.parameters)==null?void 0:p.docs)==null?void 0:u.source}}};var h,N,y;r.parameters={...r.parameters,docs:{...(h=r.parameters)==null?void 0:h.docs,source:{originalSource:`{
  name: 'RowActionsMenu — always 3-dot (legacy)',
  render: () => <div className="p-6 h-screen">
      <TableData<Client> columns={COLUMNS_MENU} data={DEMO} className="h-80" />
    </div>
}`,...(y=(N=r.parameters)==null?void 0:N.docs)==null?void 0:y.source}}};var S,b,x;o.parameters={...o.parameters,docs:{...(S=o.parameters)==null?void 0:S.docs,source:{originalSource:`{
  render: () => <div className="p-6 h-screen">
      <TableData<Client> columns={COLUMNS_RESPONSIVE} data={DEMO} className="h-96" />
    </div>
}`,...(x=(b=o.parameters)==null?void 0:b.docs)==null?void 0:x.source}}};var g,v,j;c.parameters={...c.parameters,docs:{...(g=c.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => <div className="p-6 h-screen">
      <TableData<Client> columns={COLUMNS_RESPONSIVE} data={[]} loading className="h-96" />
    </div>
}`,...(j=(v=c.parameters)==null?void 0:v.docs)==null?void 0:j.source}}};var E,M,O;l.parameters={...l.parameters,docs:{...(E=l.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: () => <div className="p-6 h-screen">
      <TableData<Client> columns={COLUMNS_RESPONSIVE} data={[]} emptyMessage="No clients yet." className="h-96" />
    </div>
}`,...(O=(M=l.parameters)==null?void 0:M.docs)==null?void 0:O.source}}};var C,w,k;i.parameters={...i.parameters,docs:{...(C=i.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: () => <div className="p-6 h-screen">
      <TableData<Client> columns={COLUMNS_RESPONSIVE} data={DEMO} defaultSort={{
      key: 'name',
      dir: 'asc'
    }} className="h-96" />
    </div>
}`,...(k=(w=i.parameters)==null?void 0:w.docs)==null?void 0:k.source}}};const J=["ResponsiveActions","LegacyMenu","Populated","Loading","Empty","WithDefaultSort"];export{l as Empty,r as LegacyMenu,c as Loading,o as Populated,t as ResponsiveActions,i as WithDefaultSort,J as __namedExportsOrder,G as default};
