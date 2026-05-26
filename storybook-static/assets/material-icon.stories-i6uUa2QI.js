import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{M as s}from"./material-icon-DL-uhJfy.js";const z={title:"Common/MaterialIcon",component:s,tags:["autodocs"],parameters:{layout:"centered",backgrounds:{default:"white"}},argTypes:{name:{control:"text"},size:{control:"number"}}},r={args:{name:"home",size:24}},t={render:()=>e.jsx("div",{className:"flex items-end gap-4",children:[12,16,20,24,32,40].map(a=>e.jsxs("div",{className:"flex flex-col items-center gap-1",children:[e.jsx(s,{name:"star",size:a}),e.jsxs("span",{className:"text-xs text-gray-400",children:[a,"px"]})]},a))})},n={render:()=>e.jsx("div",{className:"flex flex-wrap gap-4",children:["home","work","group","payments","settings","notifications","search","person","edit","delete","add","close","arrow_outward","expand_more","menu","code","palette","star"].map(a=>e.jsxs("div",{className:"flex flex-col items-center gap-1 w-16",children:[e.jsx(s,{name:a,size:20}),e.jsx("span",{className:"text-[9px] text-gray-400 text-center truncate w-full",children:a})]},a))})},c={render:()=>e.jsx("div",{className:"flex items-center gap-4",children:["home","person","calendar_month","check_circle","error"].map(a=>e.jsxs("div",{className:"flex flex-col items-center gap-1",children:[e.jsx(s,{name:a,size:28,fill:!0}),e.jsx("span",{className:"w-20 truncate text-center text-[10px] text-gray-400",children:a})]},a))})},o={render:()=>{const a=["home","calendar_month","group","work","task_alt","chat_bubble","credit_card","description","request_quote","dashboard","settings","search","notifications","person","edit_note","delete","add","close","event","schedule","link","payments","receipt_long","contract","design_services","rocket_launch","fact_check","route","warning","priority_high","visibility","open_in_new"];return e.jsx("div",{className:"grid max-w-4xl grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8",children:a.map(i=>e.jsxs("div",{className:"flex min-w-0 flex-col items-center gap-1 rounded-xl border border-gray-100 bg-white p-3",children:[e.jsx(s,{name:i,size:22}),e.jsx("span",{className:"w-full truncate text-center text-[10px] font-medium text-gray-400",children:i})]},i))})}};var l,d,m;r.parameters={...r.parameters,docs:{...(l=r.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    name: 'home',
    size: 24
  }
}`,...(m=(d=r.parameters)==null?void 0:d.docs)==null?void 0:m.source}}};var p,x,g;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: () => <div className="flex items-end gap-4">
      {[12, 16, 20, 24, 32, 40].map(s => <div key={s} className="flex flex-col items-center gap-1">
          <MaterialIcon name="star" size={s} />
          <span className="text-xs text-gray-400">{s}px</span>
        </div>)}
    </div>
}`,...(g=(x=t.parameters)==null?void 0:x.docs)==null?void 0:g.source}}};var u,h,f;n.parameters={...n.parameters,docs:{...(u=n.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-4">
      {['home', 'work', 'group', 'payments', 'settings', 'notifications', 'search', 'person', 'edit', 'delete', 'add', 'close', 'arrow_outward', 'expand_more', 'menu', 'code', 'palette', 'star'].map(name => <div key={name} className="flex flex-col items-center gap-1 w-16">
          <MaterialIcon name={name} size={20} />
          <span className="text-[9px] text-gray-400 text-center truncate w-full">{name}</span>
        </div>)}
    </div>
}`,...(f=(h=n.parameters)==null?void 0:h.docs)==null?void 0:f.source}}};var _,v,w;c.parameters={...c.parameters,docs:{...(_=c.parameters)==null?void 0:_.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-4">
      {['home', 'person', 'calendar_month', 'check_circle', 'error'].map(name => <div key={name} className="flex flex-col items-center gap-1">
          <MaterialIcon name={name} size={28} fill />
          <span className="w-20 truncate text-center text-[10px] text-gray-400">{name}</span>
        </div>)}
    </div>
}`,...(w=(v=c.parameters)==null?void 0:v.docs)==null?void 0:w.source}}};var y,N,k;o.parameters={...o.parameters,docs:{...(y=o.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: () => {
    const icons = ['home', 'calendar_month', 'group', 'work', 'task_alt', 'chat_bubble', 'credit_card', 'description', 'request_quote', 'dashboard', 'settings', 'search', 'notifications', 'person', 'edit_note', 'delete', 'add', 'close', 'event', 'schedule', 'link', 'payments', 'receipt_long', 'contract', 'design_services', 'rocket_launch', 'fact_check', 'route', 'warning', 'priority_high', 'visibility', 'open_in_new'];
    return <div className="grid max-w-4xl grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8">
        {icons.map(name => <div key={name} className="flex min-w-0 flex-col items-center gap-1 rounded-xl border border-gray-100 bg-white p-3">
            <MaterialIcon name={name} size={22} />
            <span className="w-full truncate text-center text-[10px] font-medium text-gray-400">{name}</span>
          </div>)}
      </div>;
  }
}`,...(k=(N=o.parameters)==null?void 0:N.docs)==null?void 0:k.source}}};const I=["Default","Sizes","Icons","Filled","AppIconSet"];export{o as AppIconSet,r as Default,c as Filled,n as Icons,t as Sizes,I as __namedExportsOrder,z as default};
