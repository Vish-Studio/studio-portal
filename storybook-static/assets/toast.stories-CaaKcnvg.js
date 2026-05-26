import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{T as n}from"./toast-C4JCdi7M.js";import"./material-icon-DL-uhJfy.js";const w={title:"Common/Toast",component:n,tags:["autodocs"],parameters:{layout:"centered",backgrounds:{default:"white"}},argTypes:{status:{control:"select",options:["success","error","info"]},onDismiss:{action:"dismissed"}},args:{status:"success",title:"Changes saved",message:"Your updates were synced successfully."}},s={args:{status:"success",title:"Schedule created",message:"The meeting was added to the calendar."}},t={args:{status:"error",title:"Unable to save schedule",message:"Your account does not have permission to access this data."}},a={args:{status:"info",title:"Sync in progress",message:"We are updating the latest project data."}},r={args:{status:"success",title:"Profile updated",message:void 0}},o={render:()=>e.jsxs("div",{className:"flex w-[390px] flex-col gap-3",children:[e.jsx(n,{status:"success",title:"Client created",message:"Temporary login details are ready to share.",onDismiss:()=>{}}),e.jsx(n,{status:"error",title:"Unable to create record",message:"Amount must be greater than 0.",onDismiss:()=>{}}),e.jsx(n,{status:"info",title:"Sync in progress",message:"The app is refreshing Firestore data.",onDismiss:()=>{}})]})};var c,i,d;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    status: 'success',
    title: 'Schedule created',
    message: 'The meeting was added to the calendar.'
  }
}`,...(d=(i=s.parameters)==null?void 0:i.docs)==null?void 0:d.source}}};var u,m,l;t.parameters={...t.parameters,docs:{...(u=t.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    status: 'error',
    title: 'Unable to save schedule',
    message: 'Your account does not have permission to access this data.'
  }
}`,...(l=(m=t.parameters)==null?void 0:m.docs)==null?void 0:l.source}}};var p,g,h;a.parameters={...a.parameters,docs:{...(p=a.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    status: 'info',
    title: 'Sync in progress',
    message: 'We are updating the latest project data.'
  }
}`,...(h=(g=a.parameters)==null?void 0:g.docs)==null?void 0:h.source}}};var f,S,x;r.parameters={...r.parameters,docs:{...(f=r.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    status: 'success',
    title: 'Profile updated',
    message: undefined
  }
}`,...(x=(S=r.parameters)==null?void 0:S.docs)==null?void 0:x.source}}};var T,v,y;o.parameters={...o.parameters,docs:{...(T=o.parameters)==null?void 0:T.docs,source:{originalSource:`{
  render: () => <div className="flex w-[390px] flex-col gap-3">
      <Toast status="success" title="Client created" message="Temporary login details are ready to share." onDismiss={() => undefined} />
      <Toast status="error" title="Unable to create record" message="Amount must be greater than 0." onDismiss={() => undefined} />
      <Toast status="info" title="Sync in progress" message="The app is refreshing Firestore data." onDismiss={() => undefined} />
    </div>
}`,...(y=(v=o.parameters)==null?void 0:v.docs)==null?void 0:y.source}}};const A=["Success","Error","Info","WithoutMessage","AllStates"];export{o as AllStates,t as Error,a as Info,s as Success,r as WithoutMessage,A as __namedExportsOrder,w as default};
