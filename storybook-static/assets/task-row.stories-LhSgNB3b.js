import{j as s}from"./jsx-runtime-D_zvdyIk.js";import{s as i,t as j}from"./ProjectsPage-CAOw35KA.js";import"./index-CwcVQgaJ.js";import"./material-lucide-icons-DONtn2OU.js";import"./material-icon-DL-uhJfy.js";import"./Topbar-tut1kTIp.js";import"./avatar-dFltxqny.js";import"./button-_wOG-Qwa.js";import"./button-fab-DZabN1_q.js";import"./button-icon-CawgxlcK.js";import"./breadcrumb-DKmh_38m.js";import"./utils-C8nBGPD0.js";import"./chunk-EVOBXE3Y-DGJ5GPD4.js";import"./toggle-BSly7M3f.js";import"./table-wx5_20zr.js";import"./option-D_ooYKZb.js";import"./record-meta-CgG0toqV.js";import"./form-field-DyTk_Xv3.js";import"./card-content-BQKrQHv8.js";import"./confirm-dialog-GuOX49MJ.js";import"./modal-DISM86dM.js";import"./detail-hero-card-EgUtOYdH.js";import"./dropdown-menu-Bq6dRk_J.js";import"./form-sidebar-hzdYnAA1.js";import"./search-bar-DIZOrVWj.js";import"./status-badge-DWTpbZUN.js";import"./stat-card-mltzYa0B.js";import"./status-icon-BHjbPUZJ.js";import"./table-tab-Bqt7Fzjz.js";import"./tabs-Dm89Ay6N.js";import"./toast-C4JCdi7M.js";import"./tooltip-CFoL2YCS.js";import"./index-C8bfMtE3.js";import"./project-template-document-DfcFdOQB.js";const rt={title:"Admin/TaskRow",component:j,tags:["autodocs"],parameters:{layout:"padded",backgrounds:{default:"app"}}},r={args:{task:i.find(t=>t.status==="in-progress"&&t.priority==="high")},decorators:[t=>s.jsx("div",{className:"max-w-2xl",children:s.jsx(t,{})})]},o={args:{task:i.find(t=>t.status==="to-test"),showProject:!1},decorators:[t=>s.jsx("div",{className:"max-w-2xl",children:s.jsx(t,{})})]},a={args:{task:{...i[0],status:"todo",dueDate:"2024-01-01",title:"Overdue task example"}},decorators:[t=>s.jsx("div",{className:"max-w-2xl",children:s.jsx(t,{})})]},e={render:()=>s.jsx("div",{className:"max-w-2xl flex flex-col gap-2",children:["todo","in-progress","to-test","completed"].map(t=>{const m=i.find(w=>w.status===t);return m?s.jsx(j,{task:m},t):null})})};var p,d,c;r.parameters={...r.parameters,docs:{...(p=r.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    task: DEMO_TASKS.find(t => t.status === 'in-progress' && t.priority === 'high')!
  },
  decorators: [Story => <div className="max-w-2xl"><Story /></div>]
}`,...(c=(d=r.parameters)==null?void 0:d.docs)==null?void 0:c.source}}};var l,u,n;o.parameters={...o.parameters,docs:{...(l=o.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    task: DEMO_TASKS.find(t => t.status === 'to-test')!,
    showProject: false
  },
  decorators: [Story => <div className="max-w-2xl"><Story /></div>]
}`,...(n=(u=o.parameters)==null?void 0:u.docs)==null?void 0:n.source}}};var x,S,g;a.parameters={...a.parameters,docs:{...(x=a.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    task: {
      ...DEMO_TASKS[0],
      status: 'todo' as const,
      dueDate: '2024-01-01',
      title: 'Overdue task example'
    }
  },
  decorators: [Story => <div className="max-w-2xl"><Story /></div>]
}`,...(g=(S=a.parameters)==null?void 0:S.docs)==null?void 0:g.source}}};var f,k,v;e.parameters={...e.parameters,docs:{...(f=e.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: () => <div className="max-w-2xl flex flex-col gap-2">
      {(['todo', 'in-progress', 'to-test', 'completed'] as const).map(status => {
      const task = DEMO_TASKS.find(t => t.status === status);
      return task ? <TaskRow key={status} task={task} /> : null;
    })}
    </div>
}`,...(v=(k=e.parameters)==null?void 0:k.docs)==null?void 0:v.source}}};const ot=["Default","WithoutProject","Overdue","AllStatuses"];export{e as AllStatuses,r as Default,a as Overdue,o as WithoutProject,ot as __namedExportsOrder,rt as default};
