import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{D as r}from"./dropdown-menu-Bq6dRk_J.js";const v={title:"Common/DropdownMenu",component:r,tags:["autodocs"],parameters:{layout:"centered",backgrounds:{default:"white"}}},w=[{header:"Notifications",items:[{label:"New Client Assigned",description:"You have been assigned to Acme Inc."},{label:"System Update",description:"Maintenance scheduled for tonight."},{label:"Invoice Paid",description:"Globex paid INV-003 ($3,200)."}]}],g=[{header:"My Account",items:[{label:"Profile",onClick:()=>{}},{label:"Billing",onClick:()=>{}},{label:"Team",onClick:()=>{}},{label:"Subscription",onClick:()=>{}}]},{items:[{label:"Log out",onClick:()=>{},danger:!0}]}],i={render:()=>e.jsx("div",{className:"relative w-72",children:e.jsx(r,{sections:w,width:"w-72",align:"right"})})},s={render:()=>e.jsx("div",{className:"relative w-48",children:e.jsx(r,{sections:g,width:"w-48",align:"right"})})},t={render:()=>e.jsx("div",{className:"relative w-48",children:e.jsx(r,{sections:[{items:[{label:"Edit",onClick:()=>{}},{label:"Duplicate",onClick:()=>{}}]},{items:[{label:"Delete",onClick:()=>{},danger:!0}]}],width:"w-48"})})};var n,a,o;i.parameters={...i.parameters,docs:{...(n=i.parameters)==null?void 0:n.docs,source:{originalSource:`{
  render: () => <div className="relative w-72">
      <DropdownMenu sections={notifSections} width="w-72" align="right" />
    </div>
}`,...(o=(a=i.parameters)==null?void 0:a.docs)==null?void 0:o.source}}};var c,l,d;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
  render: () => <div className="relative w-48">
      <DropdownMenu sections={userSections} width="w-48" align="right" />
    </div>
}`,...(d=(l=s.parameters)==null?void 0:l.docs)==null?void 0:d.source}}};var m,u,p;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => <div className="relative w-48">
      <DropdownMenu sections={[{
      items: [{
        label: 'Edit',
        onClick: () => {}
      }, {
        label: 'Duplicate',
        onClick: () => {}
      }]
    }, {
      items: [{
        label: 'Delete',
        onClick: () => {},
        danger: true
      }]
    }]} width="w-48" />
    </div>
}`,...(p=(u=t.parameters)==null?void 0:u.docs)==null?void 0:p.source}}};const C=["Notifications","UserMenu","WithDanger"];export{i as Notifications,s as UserMenu,t as WithDanger,C as __namedExportsOrder,v as default};
