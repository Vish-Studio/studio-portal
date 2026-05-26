import{j as o}from"./jsx-runtime-D_zvdyIk.js";import{r as a}from"./index-CwcVQgaJ.js";import{T as s}from"./table-tab-Bqt7Fzjz.js";import"./material-icon-DL-uhJfy.js";import"./tabs-Dm89Ay6N.js";import"./option-D_ooYKZb.js";import"./material-lucide-icons-DONtn2OU.js";import"./utils-C8nBGPD0.js";const E={title:"Common/TableTab",component:s,tags:["autodocs"],parameters:{layout:"padded",backgrounds:{default:"app"}}},l=[{key:"all",label:"All",count:24},{key:"active",label:"Active",count:18},{key:"inactive",label:"Inactive",count:4},{key:"lost",label:"Lost",count:2}],r={render:()=>{const[e,t]=a.useState("all");return o.jsx(s,{tabs:l,activeTab:e,onTabChange:t})}},n={render:()=>{const[e,t]=a.useState("all");return o.jsx(s,{tabs:l,activeTab:e,onTabChange:t,actionLabel:"Add Client",onAction:()=>{}})}},c={render:()=>{const[e,t]=a.useState("all"),[k,w]=a.useState("grid"),[y,x]=a.useState("recent"),[M,D]=a.useState("desc");return o.jsx(s,{tabs:l,activeTab:e,onTabChange:t,viewMode:k,onViewModeChange:w,sortValue:y,sortOptions:[{key:"recent",label:"Most recent"},{key:"name",label:"Name"},{key:"created",label:"Date created"}],onSortChange:x,sortDirection:M,onSortDirectionChange:D,actionLabel:"Add Task",onAction:()=>{}})}},i={render:()=>{const[e,t]=a.useState("all");return o.jsx("div",{className:"w-full max-w-lg",children:o.jsx(s,{tabs:l,activeTab:e,onTabChange:t})})}};var d,b,u;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:`{
  render: () => {
    const [active, setActive] = useState('all');
    return <TableTab tabs={TABS} activeTab={active} onTabChange={setActive} />;
  }
}`,...(u=(b=r.parameters)==null?void 0:b.docs)==null?void 0:u.source}}};var v,m,T;n.parameters={...n.parameters,docs:{...(v=n.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: () => {
    const [active, setActive] = useState('all');
    return <TableTab tabs={TABS} activeTab={active} onTabChange={setActive} actionLabel="Add Client" onAction={() => {}} />;
  }
}`,...(T=(m=n.parameters)==null?void 0:m.docs)==null?void 0:T.source}}};var p,S,A;c.parameters={...c.parameters,docs:{...(p=c.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: () => {
    const [active, setActive] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sort, setSort] = useState('recent');
    const [direction, setDirection] = useState<'asc' | 'desc'>('desc');
    return <TableTab tabs={TABS} activeTab={active} onTabChange={setActive} viewMode={viewMode} onViewModeChange={setViewMode} sortValue={sort} sortOptions={[{
      key: 'recent',
      label: 'Most recent'
    }, {
      key: 'name',
      label: 'Name'
    }, {
      key: 'created',
      label: 'Date created'
    }]} onSortChange={setSort} sortDirection={direction} onSortDirectionChange={setDirection} actionLabel="Add Task" onAction={() => {}} />;
  }
}`,...(A=(S=c.parameters)==null?void 0:S.docs)==null?void 0:A.source}}};var g,h,C;i.parameters={...i.parameters,docs:{...(g=i.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => {
    const [active, setActive] = useState('all');
    return <div className="w-full max-w-lg">
        <TableTab tabs={TABS} activeTab={active} onTabChange={setActive} />
      </div>;
  }
}`,...(C=(h=i.parameters)==null?void 0:h.docs)==null?void 0:C.source}}};const P=["WithTabs","WithAction","WithPageControls","TabsOnly"];export{i as TabsOnly,n as WithAction,c as WithPageControls,r as WithTabs,P as __namedExportsOrder,E as default};
