import{j as o}from"./jsx-runtime-D_zvdyIk.js";import{D as a,C as S}from"./ProjectsPage-CAOw35KA.js";import"./index-CwcVQgaJ.js";import"./material-lucide-icons-DONtn2OU.js";import"./material-icon-DL-uhJfy.js";import"./Topbar-tut1kTIp.js";import"./avatar-dFltxqny.js";import"./button-_wOG-Qwa.js";import"./button-fab-DZabN1_q.js";import"./button-icon-CawgxlcK.js";import"./breadcrumb-DKmh_38m.js";import"./utils-C8nBGPD0.js";import"./chunk-EVOBXE3Y-DGJ5GPD4.js";import"./toggle-BSly7M3f.js";import"./table-wx5_20zr.js";import"./option-D_ooYKZb.js";import"./record-meta-CgG0toqV.js";import"./form-field-DyTk_Xv3.js";import"./card-content-BQKrQHv8.js";import"./confirm-dialog-GuOX49MJ.js";import"./modal-DISM86dM.js";import"./detail-hero-card-EgUtOYdH.js";import"./dropdown-menu-Bq6dRk_J.js";import"./form-sidebar-hzdYnAA1.js";import"./search-bar-DIZOrVWj.js";import"./status-badge-DWTpbZUN.js";import"./stat-card-mltzYa0B.js";import"./status-icon-BHjbPUZJ.js";import"./table-tab-Bqt7Fzjz.js";import"./tabs-Dm89Ay6N.js";import"./toast-C4JCdi7M.js";import"./tooltip-CFoL2YCS.js";import"./index-C8bfMtE3.js";import"./project-template-document-DfcFdOQB.js";const rr={title:"Admin/ClientDetailCard",component:S,tags:["autodocs"],parameters:{layout:"centered",backgrounds:{default:"app"}}},r={args:{client:a[0]}},e={args:{client:a[2]}},t={args:{client:a[3]}},i={render:()=>o.jsx("div",{className:"flex flex-wrap gap-4 justify-center",children:a.slice(0,3).map(s=>o.jsx("div",{className:"w-72",children:o.jsx(S,{client:s})},s.id))})};var n,m,p;r.parameters={...r.parameters,docs:{...(n=r.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    client: DEMO_CLIENTS[0]
  } // Sarah Mitchell — active, has projects
}`,...(p=(m=r.parameters)==null?void 0:m.docs)==null?void 0:p.source}}};var c,l,d;e.parameters={...e.parameters,docs:{...(c=e.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    client: DEMO_CLIENTS[2]
  } // Priya Shah — inactive
}`,...(d=(l=e.parameters)==null?void 0:l.docs)==null?void 0:d.source}}};var u,C,g;t.parameters={...t.parameters,docs:{...(u=t.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    client: DEMO_CLIENTS[3]
  } // Tony Nguyen — lost
}`,...(g=(C=t.parameters)==null?void 0:C.docs)==null?void 0:g.source}}};var v,E,x;i.parameters={...i.parameters,docs:{...(v=i.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-4 justify-center">
      {DEMO_CLIENTS.slice(0, 3).map(c => <div key={c.id} className="w-72">
          <ClientDetailCard client={c} />
        </div>)}
    </div>
}`,...(x=(E=i.parameters)==null?void 0:E.docs)==null?void 0:x.source}}};const er=["ActiveClient","InactiveClient","LostClient","AllClients"];export{r as ActiveClient,i as AllClients,e as InactiveClient,t as LostClient,er as __namedExportsOrder,rr as default};
