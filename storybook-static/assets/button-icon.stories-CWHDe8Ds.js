import{j as s}from"./jsx-runtime-D_zvdyIk.js";import{B as t}from"./button-icon-CawgxlcK.js";import"./material-icon-DL-uhJfy.js";const v={title:"Common/Button/ButtonIcon",component:t,tags:["autodocs"],parameters:{layout:"centered",backgrounds:{default:"white"}},argTypes:{iconName:{control:"text"}}},e={args:{iconName:"notifications",clickHandler:()=>{},"aria-label":"Notifications"}},a={args:{iconName:"person",clickHandler:()=>{},"aria-label":"User menu"}},r={args:{iconName:"search",clickHandler:()=>{},"aria-label":"Search"}},o={render:()=>s.jsx(t,{iconName:"notifications",clickHandler:()=>{},"aria-label":"Notifications",children:s.jsx("div",{className:"absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"})})},n={render:()=>s.jsx("div",{className:"flex items-center gap-2",children:["search","notifications","person","settings","edit","delete"].map(c=>s.jsx(t,{iconName:c,clickHandler:()=>{},"aria-label":c},c))})};var i,l,d;e.parameters={...e.parameters,docs:{...(i=e.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    iconName: 'notifications',
    clickHandler: () => {},
    'aria-label': 'Notifications'
  }
}`,...(d=(l=e.parameters)==null?void 0:l.docs)==null?void 0:d.source}}};var m,p,u;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    iconName: 'person',
    clickHandler: () => {},
    'aria-label': 'User menu'
  }
}`,...(u=(p=a.parameters)==null?void 0:p.docs)==null?void 0:u.source}}};var g,N,f;r.parameters={...r.parameters,docs:{...(g=r.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    iconName: 'search',
    clickHandler: () => {},
    'aria-label': 'Search'
  }
}`,...(f=(N=r.parameters)==null?void 0:N.docs)==null?void 0:f.source}}};var b,h,k;o.parameters={...o.parameters,docs:{...(b=o.parameters)==null?void 0:b.docs,source:{originalSource:`{
  render: () => <ButtonIcon iconName="notifications" clickHandler={() => {}} aria-label="Notifications">
      <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
    </ButtonIcon>
}`,...(k=(h=o.parameters)==null?void 0:h.docs)==null?void 0:k.source}}};var x,H,B;n.parameters={...n.parameters,docs:{...(x=n.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-2">
      {['search', 'notifications', 'person', 'settings', 'edit', 'delete'].map(icon => <ButtonIcon key={icon} iconName={icon} clickHandler={() => {}} aria-label={icon} />)}
    </div>
}`,...(B=(H=n.parameters)==null?void 0:H.docs)==null?void 0:B.source}}};const I=["Notifications","Person","Search","WithBadge","Row"];export{e as Notifications,a as Person,n as Row,r as Search,o as WithBadge,I as __namedExportsOrder,v as default};
