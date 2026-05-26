import{j as t}from"./jsx-runtime-D_zvdyIk.js";import{L as p}from"./toggle-BSly7M3f.js";import"./avatar-dFltxqny.js";import"./button-_wOG-Qwa.js";import"./button-fab-DZabN1_q.js";import"./button-icon-CawgxlcK.js";import"./breadcrumb-DKmh_38m.js";import"./card-content-BQKrQHv8.js";import"./confirm-dialog-GuOX49MJ.js";import"./detail-hero-card-EgUtOYdH.js";import"./dropdown-menu-Bq6dRk_J.js";import"./form-field-DyTk_Xv3.js";import"./form-sidebar-hzdYnAA1.js";import{M as g}from"./material-icon-DL-uhJfy.js";import"./modal-DISM86dM.js";import"./option-D_ooYKZb.js";import{R as d}from"./record-meta-CgG0toqV.js";import"./search-bar-DIZOrVWj.js";import{S as u}from"./status-badge-DWTpbZUN.js";import"./stat-card-mltzYa0B.js";import"./status-icon-BHjbPUZJ.js";import"./table-wx5_20zr.js";import"./table-tab-Bqt7Fzjz.js";import"./tabs-Dm89Ay6N.js";import"./toast-C4JCdi7M.js";import"./tooltip-CFoL2YCS.js";import{u as x,m as y}from"./material-lucide-icons-DONtn2OU.js";import"./index-CwcVQgaJ.js";import"./utils-C8nBGPD0.js";import"./chunk-EVOBXE3Y-DGJ5GPD4.js";import"./index-C8bfMtE3.js";const U={title:"Common/ListItemRow",component:p,tags:["autodocs"],parameters:{layout:"padded",backgrounds:{default:"app"}}},a={args:{title:"Implement checkout flow",subtitle:t.jsx(d,{items:[{label:"Brand Refresh",icon:"work"},{label:"High priority",icon:"priority_high"}]}),icon:t.jsx("div",{className:"flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-100 text-gray-700",children:t.jsx(g,{name:"task_alt",size:18})}),secondary:t.jsx("span",{className:"type-card-title text-gray-700",children:"Frontend"}),tertiary:t.jsx("span",{className:"type-card-title text-right text-gray-700",children:"May 27"}),status:t.jsx(u,{label:"in progress",variant:"blue"}),actions:[{label:"Edit",icon:t.jsx(x,{size:14}),onClick:()=>{}},{label:"Delete",icon:t.jsx(y,{size:14}),onClick:()=>{},variant:"danger"}]}},r={args:{title:"Compact row"},render:()=>t.jsx("div",{className:"flex flex-col gap-2",children:["Discovery call","Proposal draft","Client review"].map((i,e)=>t.jsx(p,{title:i,subtitle:t.jsx(d,{items:[{label:`Step ${e+1}`,icon:"route"}]}),tertiary:t.jsxs("span",{className:"type-card-title text-gray-700",children:[e+1,"d"]}),status:t.jsx(u,{label:e===2?"blocked":"planned",variant:e===2?"red":"gray"})},i))})};var s,o,l;a.parameters={...a.parameters,docs:{...(s=a.parameters)==null?void 0:s.docs,source:{originalSource:`{
  args: {
    title: 'Implement checkout flow',
    subtitle: <RecordMeta items={[{
      label: 'Brand Refresh',
      icon: 'work'
    }, {
      label: 'High priority',
      icon: 'priority_high'
    }]} />,
    icon: <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-100 text-gray-700">
        <MaterialIcon name="task_alt" size={18} />
      </div>,
    secondary: <span className="type-card-title text-gray-700">Frontend</span>,
    tertiary: <span className="type-card-title text-right text-gray-700">May 27</span>,
    status: <StatusBadge label="in progress" variant="blue" />,
    actions: [{
      label: 'Edit',
      icon: <Pencil size={14} />,
      onClick: () => undefined
    }, {
      label: 'Delete',
      icon: <Trash2 size={14} />,
      onClick: () => undefined,
      variant: 'danger'
    }]
  }
}`,...(l=(o=a.parameters)==null?void 0:o.docs)==null?void 0:l.source}}};var n,c,m;r.parameters={...r.parameters,docs:{...(n=r.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    title: 'Compact row'
  },
  render: () => <div className="flex flex-col gap-2">
      {['Discovery call', 'Proposal draft', 'Client review'].map((title, index) => <ListItemRow key={title} title={title} subtitle={<RecordMeta items={[{
      label: \`Step \${index + 1}\`,
      icon: 'route'
    }]} />} tertiary={<span className="type-card-title text-gray-700">{index + 1}d</span>} status={<StatusBadge label={index === 2 ? 'blocked' : 'planned'} variant={index === 2 ? 'red' : 'gray'} />} />)}
    </div>
}`,...(m=(c=r.parameters)==null?void 0:c.docs)==null?void 0:m.source}}};const V=["Default","CompactList"];export{r as CompactList,a as Default,V as __namedExportsOrder,U as default};
