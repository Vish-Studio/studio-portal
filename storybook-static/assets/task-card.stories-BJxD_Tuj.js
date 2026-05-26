import{j as d}from"./jsx-runtime-D_zvdyIk.js";import{r as c,s as t}from"./ProjectsPage-CAOw35KA.js";import"./index-CwcVQgaJ.js";import"./material-lucide-icons-DONtn2OU.js";import"./material-icon-DL-uhJfy.js";import"./Topbar-tut1kTIp.js";import"./avatar-dFltxqny.js";import"./button-_wOG-Qwa.js";import"./button-fab-DZabN1_q.js";import"./button-icon-CawgxlcK.js";import"./breadcrumb-DKmh_38m.js";import"./utils-C8nBGPD0.js";import"./chunk-EVOBXE3Y-DGJ5GPD4.js";import"./toggle-BSly7M3f.js";import"./table-wx5_20zr.js";import"./option-D_ooYKZb.js";import"./record-meta-CgG0toqV.js";import"./form-field-DyTk_Xv3.js";import"./card-content-BQKrQHv8.js";import"./confirm-dialog-GuOX49MJ.js";import"./modal-DISM86dM.js";import"./detail-hero-card-EgUtOYdH.js";import"./dropdown-menu-Bq6dRk_J.js";import"./form-sidebar-hzdYnAA1.js";import"./search-bar-DIZOrVWj.js";import"./status-badge-DWTpbZUN.js";import"./stat-card-mltzYa0B.js";import"./status-icon-BHjbPUZJ.js";import"./table-tab-Bqt7Fzjz.js";import"./tabs-Dm89Ay6N.js";import"./toast-C4JCdi7M.js";import"./tooltip-CFoL2YCS.js";import"./index-C8bfMtE3.js";import"./project-template-document-DfcFdOQB.js";const nr={title:"Admin/TaskCard",component:c,tags:["autodocs"],parameters:{layout:"padded",backgrounds:{default:"app"}}},o={args:{task:t.find(r=>r.status==="in-progress"&&r.priority==="high")}},a={args:{task:t.find(r=>r.status==="to-test")}},e={args:{task:t.find(r=>r.status==="todo"&&r.priority==="low")}},i={args:{task:t.find(r=>r.status==="completed")}},p={render:()=>d.jsx("div",{className:"grid grid-cols-2 xl:grid-cols-4 gap-3 max-w-4xl",children:["todo","in-progress","to-test","completed"].map(r=>{const s=t.find(n=>n.status===r);return s?d.jsx(c,{task:s},r):null})})},m={render:()=>d.jsx("div",{className:"grid grid-cols-3 gap-3 max-w-2xl",children:["high","medium","low"].map(r=>{const s=t.find(n=>n.priority===r);return s?d.jsx(c,{task:s},r):null})})};var l,u,g;o.parameters={...o.parameters,docs:{...(l=o.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    task: DEMO_TASKS.find(t => t.status === 'in-progress' && t.priority === 'high')!
  }
}`,...(g=(u=o.parameters)==null?void 0:u.docs)==null?void 0:g.source}}};var k,S,x;a.parameters={...a.parameters,docs:{...(k=a.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    task: DEMO_TASKS.find(t => t.status === 'to-test')!
  }
}`,...(x=(S=a.parameters)==null?void 0:S.docs)==null?void 0:x.source}}};var y,T,f;e.parameters={...e.parameters,docs:{...(y=e.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    task: DEMO_TASKS.find(t => t.status === 'todo' && t.priority === 'low')!
  }
}`,...(f=(T=e.parameters)==null?void 0:T.docs)==null?void 0:f.source}}};var h,A,w;i.parameters={...i.parameters,docs:{...(h=i.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    task: DEMO_TASKS.find(t => t.status === 'completed')!
  }
}`,...(w=(A=i.parameters)==null?void 0:A.docs)==null?void 0:w.source}}};var P,E,M;p.parameters={...p.parameters,docs:{...(P=p.parameters)==null?void 0:P.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 max-w-4xl">
      {(['todo', 'in-progress', 'to-test', 'completed'] as const).map(status => {
      const task = DEMO_TASKS.find(t => t.status === status);
      return task ? <TaskCard key={status} task={task} /> : null;
    })}
    </div>
}`,...(M=(E=p.parameters)==null?void 0:E.docs)==null?void 0:M.source}}};var _,O,D;m.parameters={...m.parameters,docs:{...(_=m.parameters)==null?void 0:_.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-3 gap-3 max-w-2xl">
      {(['high', 'medium', 'low'] as const).map(priority => {
      const task = DEMO_TASKS.find(t => t.priority === priority);
      return task ? <TaskCard key={priority} task={task} /> : null;
    })}
    </div>
}`,...(D=(O=m.parameters)==null?void 0:O.docs)==null?void 0:D.source}}};const cr=["HighPriorityInProgress","MediumPriorityToTest","LowPriorityTodo","Completed","AllStatuses","AllPriorities"];export{m as AllPriorities,p as AllStatuses,i as Completed,o as HighPriorityInProgress,e as LowPriorityTodo,a as MediumPriorityToTest,cr as __namedExportsOrder,nr as default};
