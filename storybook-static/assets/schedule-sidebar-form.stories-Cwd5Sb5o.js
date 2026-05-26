import{j as t}from"./jsx-runtime-D_zvdyIk.js";import{r as x}from"./index-CwcVQgaJ.js";import{S as a}from"./schedule-sidebar-form-V6mAmtA6.js";import"./avatar-dFltxqny.js";import"./button-_wOG-Qwa.js";import"./material-lucide-icons-DONtn2OU.js";import"./material-icon-DL-uhJfy.js";import"./button-fab-DZabN1_q.js";import"./button-icon-CawgxlcK.js";import"./breadcrumb-DKmh_38m.js";import"./utils-C8nBGPD0.js";import"./chunk-EVOBXE3Y-DGJ5GPD4.js";import"./toggle-BSly7M3f.js";import"./table-wx5_20zr.js";import"./option-D_ooYKZb.js";import"./record-meta-CgG0toqV.js";import"./form-field-DyTk_Xv3.js";import"./card-content-BQKrQHv8.js";import"./confirm-dialog-GuOX49MJ.js";import"./modal-DISM86dM.js";import"./detail-hero-card-EgUtOYdH.js";import"./dropdown-menu-Bq6dRk_J.js";import"./form-sidebar-hzdYnAA1.js";import"./search-bar-DIZOrVWj.js";import"./status-badge-DWTpbZUN.js";import"./stat-card-mltzYa0B.js";import"./status-icon-BHjbPUZJ.js";import"./table-tab-Bqt7Fzjz.js";import"./tabs-Dm89Ay6N.js";import"./toast-C4JCdi7M.js";import"./tooltip-CFoL2YCS.js";import"./index-C8bfMtE3.js";import"./ProjectsPage-CAOw35KA.js";import"./Topbar-tut1kTIp.js";import"./project-template-document-DfcFdOQB.js";const X={title:"Admin/Schedule/ScheduleSidebarForm",component:a,tags:["autodocs"],parameters:{layout:"fullscreen"}},r={render:()=>{const[s,e]=x.useState(!1);return t.jsxs("div",{className:"p-8 min-h-screen bg-gray-100 flex items-start",children:[t.jsx("button",{onClick:()=>e(!0),className:"px-4 py-2 bg-black text-white text-sm font-semibold rounded-xl",children:"Add Event"}),s&&t.jsx(a,{date:new Date,onAdd:(n,i)=>{console.log("Added",n,i),e(!1)},onClose:()=>e(!1)})]})}},o={render:()=>{const[s,e]=x.useState(!1);return t.jsxs("div",{className:"p-8 min-h-screen bg-gray-100 flex items-start",children:[t.jsx("button",{onClick:()=>e(!0),className:"px-4 py-2 bg-black text-white text-sm font-semibold rounded-xl",children:"Edit Event"}),s&&t.jsx(a,{date:new Date,initialEvent:{id:"ev1",type:"design-review",title:"Brand Refresh Design Review",time:"2:00 PM – 3:00 PM",projectId:"p1"},onAdd:(n,i)=>{console.log("Updated",n,i),e(!1)},onClose:()=>e(!1)})]})}};var d,p,m;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = useState(false);
    return <div className="p-8 min-h-screen bg-gray-100 flex items-start">
        <button onClick={() => setOpen(true)} className="px-4 py-2 bg-black text-white text-sm font-semibold rounded-xl">
          Add Event
        </button>
        {open && <ScheduleSidebarForm date={new Date()} onAdd={(event, date) => {
        console.log('Added', event, date);
        setOpen(false);
      }} onClose={() => setOpen(false)} />}
      </div>;
  }
}`,...(m=(p=r.parameters)==null?void 0:p.docs)==null?void 0:m.source}}};var l,c,u;o.parameters={...o.parameters,docs:{...(l=o.parameters)==null?void 0:l.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = useState(false);
    return <div className="p-8 min-h-screen bg-gray-100 flex items-start">
        <button onClick={() => setOpen(true)} className="px-4 py-2 bg-black text-white text-sm font-semibold rounded-xl">
          Edit Event
        </button>
        {open && <ScheduleSidebarForm date={new Date()} initialEvent={{
        id: 'ev1',
        type: 'design-review',
        title: 'Brand Refresh Design Review',
        time: '2:00 PM – 3:00 PM',
        projectId: 'p1'
      }} onAdd={(event, date) => {
        console.log('Updated', event, date);
        setOpen(false);
      }} onClose={() => setOpen(false)} />}
      </div>;
  }
}`,...(u=(c=o.parameters)==null?void 0:c.docs)==null?void 0:u.source}}};const Y=["NewEvent","EditEvent"];export{o as EditEvent,r as NewEvent,Y as __namedExportsOrder,X as default};
