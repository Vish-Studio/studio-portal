import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as l}from"./index-CwcVQgaJ.js";import{c as i,D as u}from"./ProjectsPage-CAOw35KA.js";import"./material-lucide-icons-DONtn2OU.js";import"./material-icon-DL-uhJfy.js";import"./Topbar-tut1kTIp.js";import"./avatar-dFltxqny.js";import"./button-_wOG-Qwa.js";import"./button-fab-DZabN1_q.js";import"./button-icon-CawgxlcK.js";import"./breadcrumb-DKmh_38m.js";import"./utils-C8nBGPD0.js";import"./chunk-EVOBXE3Y-DGJ5GPD4.js";import"./toggle-BSly7M3f.js";import"./table-wx5_20zr.js";import"./option-D_ooYKZb.js";import"./record-meta-CgG0toqV.js";import"./form-field-DyTk_Xv3.js";import"./card-content-BQKrQHv8.js";import"./confirm-dialog-GuOX49MJ.js";import"./modal-DISM86dM.js";import"./detail-hero-card-EgUtOYdH.js";import"./dropdown-menu-Bq6dRk_J.js";import"./form-sidebar-hzdYnAA1.js";import"./search-bar-DIZOrVWj.js";import"./status-badge-DWTpbZUN.js";import"./stat-card-mltzYa0B.js";import"./status-icon-BHjbPUZJ.js";import"./table-tab-Bqt7Fzjz.js";import"./tabs-Dm89Ay6N.js";import"./toast-C4JCdi7M.js";import"./tooltip-CFoL2YCS.js";import"./index-C8bfMtE3.js";import"./project-template-document-DfcFdOQB.js";const V={title:"Admin/Pickers/ClientPicker",component:i,tags:["autodocs"],parameters:{layout:"padded",backgrounds:{default:"white"}}},r={render:()=>{const[t,o]=l.useState("");return e.jsxs("div",{className:"w-80",children:[e.jsxs("p",{className:"text-xs text-gray-400 mb-2",children:["Selected: ",t||"—"]}),e.jsx(i,{clients:u,selectedId:t,onSelect:o})]})}},s={render:()=>{const[t,o]=l.useState("c1");return e.jsx("div",{className:"w-80",children:e.jsx(i,{clients:u,selectedId:t,onSelect:o})})}};var m,c,d;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => {
    const [id, setId] = useState('');
    return <div className="w-80">
        <p className="text-xs text-gray-400 mb-2">Selected: {id || '—'}</p>
        <ClientPicker clients={DEMO_CLIENTS} selectedId={id} onSelect={setId} />
      </div>;
  }
}`,...(d=(c=r.parameters)==null?void 0:c.docs)==null?void 0:d.source}}};var p,a,n;s.parameters={...s.parameters,docs:{...(p=s.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: () => {
    const [id, setId] = useState('c1');
    return <div className="w-80">
        <ClientPicker clients={DEMO_CLIENTS} selectedId={id} onSelect={setId} />
      </div>;
  }
}`,...(n=(a=s.parameters)==null?void 0:a.docs)==null?void 0:n.source}}};const W=["Empty","PreSelected"];export{r as Empty,s as PreSelected,W as __namedExportsOrder,V as default};
