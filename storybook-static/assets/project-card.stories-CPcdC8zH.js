import{j as s}from"./jsx-runtime-D_zvdyIk.js";import{j as e,k as a,l as A,m as T}from"./ProjectsPage-CAOw35KA.js";import"./index-CwcVQgaJ.js";import"./material-lucide-icons-DONtn2OU.js";import"./material-icon-DL-uhJfy.js";import"./Topbar-tut1kTIp.js";import"./avatar-dFltxqny.js";import"./button-_wOG-Qwa.js";import"./button-fab-DZabN1_q.js";import"./button-icon-CawgxlcK.js";import"./breadcrumb-DKmh_38m.js";import"./utils-C8nBGPD0.js";import"./chunk-EVOBXE3Y-DGJ5GPD4.js";import"./toggle-BSly7M3f.js";import"./table-wx5_20zr.js";import"./option-D_ooYKZb.js";import"./record-meta-CgG0toqV.js";import"./form-field-DyTk_Xv3.js";import"./card-content-BQKrQHv8.js";import"./confirm-dialog-GuOX49MJ.js";import"./modal-DISM86dM.js";import"./detail-hero-card-EgUtOYdH.js";import"./dropdown-menu-Bq6dRk_J.js";import"./form-sidebar-hzdYnAA1.js";import"./search-bar-DIZOrVWj.js";import"./status-badge-DWTpbZUN.js";import"./stat-card-mltzYa0B.js";import"./status-icon-BHjbPUZJ.js";import"./table-tab-Bqt7Fzjz.js";import"./tabs-Dm89Ay6N.js";import"./toast-C4JCdi7M.js";import"./tooltip-CFoL2YCS.js";import"./index-C8bfMtE3.js";import"./project-template-document-DfcFdOQB.js";const vr={title:"Admin/ProjectCard",component:A,tags:["autodocs"],parameters:{layout:"padded",backgrounds:{default:"app"}},argTypes:{variant:{control:"select",options:["default","surface"]}}},J=a[0],W=a[2],q=a[3],z=a[5];a[1];const o={args:{project:J,allMembers:e,variant:"default"}},t={args:{project:J,allMembers:e,variant:"surface"}},i={args:{project:W,allMembers:e,variant:"surface"}},c={args:{project:q,allMembers:e,variant:"surface"}},n={args:{project:z,allMembers:e,variant:"surface"}},m={render:()=>s.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4",children:a.slice(0,6).map(r=>s.jsx(A,{project:r,allMembers:e,variant:"surface"},r.id))})},p={render:()=>s.jsx("div",{className:"flex flex-col gap-2 max-w-3xl",children:a.slice(0,6).map(r=>s.jsx(T,{project:r,allMembers:e},r.id))})},l={render:()=>s.jsx("div",{className:"flex flex-col gap-2 max-w-3xl",children:a.slice(0,3).map(r=>s.jsx(T,{project:r,allMembers:e,actions:[{label:"Edit project",onClick:()=>{}},{label:"Delete project",onClick:()=>{},variant:"danger"}]},r.id))})};var d,M,u;o.parameters={...o.parameters,docs:{...(d=o.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    project: branding,
    allMembers: DEMO_MEMBERS,
    variant: 'default'
  }
}`,...(u=(M=o.parameters)==null?void 0:M.docs)==null?void 0:u.source}}};var g,E,j;t.parameters={...t.parameters,docs:{...(g=t.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    project: branding,
    allMembers: DEMO_MEMBERS,
    variant: 'surface'
  }
}`,...(j=(E=t.parameters)==null?void 0:E.docs)==null?void 0:j.source}}};var f,b,x;i.parameters={...i.parameters,docs:{...(f=i.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    project: website,
    allMembers: DEMO_MEMBERS,
    variant: 'surface'
  }
}`,...(x=(b=i.parameters)==null?void 0:b.docs)==null?void 0:x.source}}};var S,v,O;c.parameters={...c.parameters,docs:{...(S=c.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    project: mobile,
    allMembers: DEMO_MEMBERS,
    variant: 'surface'
  }
}`,...(O=(v=c.parameters)==null?void 0:v.docs)==null?void 0:O.source}}};var D,C,_;n.parameters={...n.parameters,docs:{...(D=n.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    project: software,
    allMembers: DEMO_MEMBERS,
    variant: 'surface'
  }
}`,...(_=(C=n.parameters)==null?void 0:C.docs)==null?void 0:_.source}}};var P,R,w;m.parameters={...m.parameters,docs:{...(P=m.parameters)==null?void 0:P.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {DEMO_PROJECTS.slice(0, 6).map(p => <ProjectCard key={p.id} project={p} allMembers={DEMO_MEMBERS} variant="surface" />)}
    </div>
}`,...(w=(R=m.parameters)==null?void 0:R.docs)==null?void 0:w.source}}};var k,B,V;p.parameters={...p.parameters,docs:{...(k=p.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-2 max-w-3xl">
      {DEMO_PROJECTS.slice(0, 6).map(p => <ProjectCardMini key={p.id} project={p} allMembers={DEMO_MEMBERS} />)}
    </div>
}`,...(V=(B=p.parameters)==null?void 0:B.docs)==null?void 0:V.source}}};var N,h,y;l.parameters={...l.parameters,docs:{...(N=l.parameters)==null?void 0:N.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-2 max-w-3xl">
      {DEMO_PROJECTS.slice(0, 3).map(p => <ProjectCardMini key={p.id} project={p} allMembers={DEMO_MEMBERS} actions={[{
      label: 'Edit project',
      onClick: () => {}
    }, {
      label: 'Delete project',
      onClick: () => {},
      variant: 'danger'
    }]} />)}
    </div>
}`,...(y=(h=l.parameters)==null?void 0:h.docs)==null?void 0:y.source}}};const Or=["DefaultVariant","SurfaceVariant","WebsitePremium","MobileAppCompleted","SoftwarePremium","ServiceVariations","MiniVariant","MiniWithActions"];export{o as DefaultVariant,p as MiniVariant,l as MiniWithActions,c as MobileAppCompleted,m as ServiceVariations,n as SoftwarePremium,t as SurfaceVariant,i as WebsitePremium,Or as __namedExportsOrder,vr as default};
