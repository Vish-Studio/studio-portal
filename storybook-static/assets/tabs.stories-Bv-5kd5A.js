import{j as t}from"./jsx-runtime-D_zvdyIk.js";import{r as b}from"./index-CwcVQgaJ.js";import{M as r}from"./material-icon-DL-uhJfy.js";import{T as o}from"./tabs-Dm89Ay6N.js";import"./option-D_ooYKZb.js";import"./material-lucide-icons-DONtn2OU.js";import"./utils-C8nBGPD0.js";const x={title:"Common/Tabs",component:o},n=[{key:"all",label:"All",count:12},{key:"active",label:"Active",count:7},{key:"paused",label:"Paused",count:3},{key:"completed",label:"Completed",count:2}],e={args:{items:n,value:"all"},render:()=>{const[l,s]=b.useState("all");return t.jsx(o,{items:n,value:l,onChange:s})}},a={args:{items:[{key:"client",label:"Clients"},{key:"team",label:"Team"}],value:"client",mobileMode:"scroll"},render:()=>{const[l,s]=b.useState("client");return t.jsx(o,{mobileMode:"scroll",items:[{key:"client",label:"Clients",icon:t.jsx(r,{name:"person",size:16})},{key:"team",label:"Team",icon:t.jsx(r,{name:"groups",size:16})}],value:l,onChange:s})}};var i,c,m;e.parameters={...e.parameters,docs:{...(i=e.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    items: ITEMS,
    value: 'all'
  },
  render: () => {
    const [value, setValue] = useState('all');
    return <Tabs items={ITEMS} value={value} onChange={setValue} />;
  }
}`,...(m=(c=e.parameters)==null?void 0:c.docs)==null?void 0:m.source}}};var u,p,d;a.parameters={...a.parameters,docs:{...(u=a.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    items: [{
      key: 'client',
      label: 'Clients'
    }, {
      key: 'team',
      label: 'Team'
    }],
    value: 'client',
    mobileMode: 'scroll'
  },
  render: () => {
    const [value, setValue] = useState('client');
    return <Tabs mobileMode="scroll" items={[{
      key: 'client',
      label: 'Clients',
      icon: <MaterialIcon name="person" size={16} />
    }, {
      key: 'team',
      label: 'Team',
      icon: <MaterialIcon name="groups" size={16} />
    }]} value={value} onChange={setValue} />;
  }
}`,...(d=(p=a.parameters)==null?void 0:p.docs)==null?void 0:d.source}}};const S=["Default","WithIcons"];export{e as Default,a as WithIcons,S as __namedExportsOrder,x as default};
