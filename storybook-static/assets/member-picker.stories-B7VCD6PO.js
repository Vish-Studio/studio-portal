import{j as t}from"./jsx-runtime-D_zvdyIk.js";import{r as E}from"./index-CwcVQgaJ.js";import{M as c}from"./toggle-BSly7M3f.js";import{j as M}from"./ProjectsPage-CAOw35KA.js";import"./table-wx5_20zr.js";import"./material-lucide-icons-DONtn2OU.js";import"./material-icon-DL-uhJfy.js";import"./utils-C8nBGPD0.js";import"./button-icon-CawgxlcK.js";import"./option-D_ooYKZb.js";import"./record-meta-CgG0toqV.js";import"./avatar-dFltxqny.js";import"./form-field-DyTk_Xv3.js";import"./Topbar-tut1kTIp.js";import"./button-_wOG-Qwa.js";import"./button-fab-DZabN1_q.js";import"./breadcrumb-DKmh_38m.js";import"./chunk-EVOBXE3Y-DGJ5GPD4.js";import"./card-content-BQKrQHv8.js";import"./confirm-dialog-GuOX49MJ.js";import"./modal-DISM86dM.js";import"./detail-hero-card-EgUtOYdH.js";import"./dropdown-menu-Bq6dRk_J.js";import"./form-sidebar-hzdYnAA1.js";import"./search-bar-DIZOrVWj.js";import"./status-badge-DWTpbZUN.js";import"./stat-card-mltzYa0B.js";import"./status-icon-BHjbPUZJ.js";import"./table-tab-Bqt7Fzjz.js";import"./tabs-Dm89Ay6N.js";import"./toast-C4JCdi7M.js";import"./tooltip-CFoL2YCS.js";import"./index-C8bfMtE3.js";import"./project-template-document-DfcFdOQB.js";const Z={title:"Admin/Pickers/MemberPicker",component:c,tags:["autodocs"],parameters:{layout:"padded",backgrounds:{default:"white"}}},o={render:()=>{const[s,m]=E.useState([]),d=e=>m(r=>r.includes(e)?r.filter(p=>p!==e):[...r,e]);return t.jsxs("div",{className:"w-80",children:[t.jsxs("p",{className:"text-xs text-gray-400 mb-2",children:["Selected: ",s.join(", ")||"—"]}),t.jsx(c,{members:M,selectedIds:s,onToggle:d})]})}},i={render:()=>{const[s,m]=E.useState(["m1","m3"]),d=e=>m(r=>r.includes(e)?r.filter(p=>p!==e):[...r,e]);return t.jsx("div",{className:"w-80",children:t.jsx(c,{members:M,selectedIds:s,onToggle:d})})}};var a,n,l;o.parameters={...o.parameters,docs:{...(a=o.parameters)==null?void 0:a.docs,source:{originalSource:`{
  render: () => {
    const [ids, setIds] = useState<string[]>([]);
    const toggle = (id: string) => setIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    return <div className="w-80">
        <p className="text-xs text-gray-400 mb-2">Selected: {ids.join(', ') || '—'}</p>
        <MemberPicker members={DEMO_MEMBERS} selectedIds={ids} onToggle={toggle} />
      </div>;
  }
}`,...(l=(n=o.parameters)==null?void 0:n.docs)==null?void 0:l.source}}};var g,u,x;i.parameters={...i.parameters,docs:{...(g=i.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => {
    const [ids, setIds] = useState<string[]>(['m1', 'm3']);
    const toggle = (id: string) => setIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    return <div className="w-80">
        <MemberPicker members={DEMO_MEMBERS} selectedIds={ids} onToggle={toggle} />
      </div>;
  }
}`,...(x=(u=i.parameters)==null?void 0:u.docs)==null?void 0:x.source}}};const $=["Empty","PreSelected"];export{o as Empty,i as PreSelected,$ as __namedExportsOrder,Z as default};
