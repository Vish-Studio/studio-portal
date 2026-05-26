import{j as t}from"./jsx-runtime-D_zvdyIk.js";import{r as d}from"./index-CwcVQgaJ.js";import{C as o}from"./confirm-dialog-GuOX49MJ.js";import"./material-lucide-icons-DONtn2OU.js";import"./material-icon-DL-uhJfy.js";import"./modal-DISM86dM.js";import"./button-_wOG-Qwa.js";const v={title:"Common/ConfirmDialog",component:o,tags:["autodocs"],parameters:{layout:"fullscreen"}},n={render:()=>{const[s,e]=d.useState(!1);return t.jsxs("div",{className:"p-10 min-h-screen bg-gray-100 flex items-start",children:[t.jsx("button",{onClick:()=>e(!0),className:"px-4 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl",children:"Delete Project"}),t.jsx(o,{isOpen:s,title:"Delete project",message:'"Brand Refresh" will be permanently removed. This cannot be undone.',confirmLabel:"Delete",variant:"danger",onConfirm:()=>e(!1),onCancel:()=>e(!1)})]})}},r={render:()=>{const[s,e]=d.useState(!1);return t.jsxs("div",{className:"p-10 min-h-screen bg-gray-100 flex items-start",children:[t.jsx("button",{onClick:()=>e(!0),className:"px-4 py-2.5 bg-black text-white text-sm font-semibold rounded-xl",children:"Confirm Action"}),t.jsx(o,{isOpen:s,title:"Archive client",message:"This client will be moved to the archive. You can restore them later.",confirmLabel:"Archive",cancelLabel:"Keep",variant:"default",onConfirm:()=>e(!1),onCancel:()=>e(!1)})]})}};var a,i,l;n.parameters={...n.parameters,docs:{...(a=n.parameters)==null?void 0:a.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = useState(false);
    return <div className="p-10 min-h-screen bg-gray-100 flex items-start">
        <button onClick={() => setOpen(true)} className="px-4 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl">
          Delete Project
        </button>
        <ConfirmDialog isOpen={open} title="Delete project" message='"Brand Refresh" will be permanently removed. This cannot be undone.' confirmLabel="Delete" variant="danger" onConfirm={() => setOpen(false)} onCancel={() => setOpen(false)} />
      </div>;
  }
}`,...(l=(i=n.parameters)==null?void 0:i.docs)==null?void 0:l.source}}};var c,m,p;r.parameters={...r.parameters,docs:{...(c=r.parameters)==null?void 0:c.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = useState(false);
    return <div className="p-10 min-h-screen bg-gray-100 flex items-start">
        <button onClick={() => setOpen(true)} className="px-4 py-2.5 bg-black text-white text-sm font-semibold rounded-xl">
          Confirm Action
        </button>
        <ConfirmDialog isOpen={open} title="Archive client" message="This client will be moved to the archive. You can restore them later." confirmLabel="Archive" cancelLabel="Keep" variant="default" onConfirm={() => setOpen(false)} onCancel={() => setOpen(false)} />
      </div>;
  }
}`,...(p=(m=r.parameters)==null?void 0:m.docs)==null?void 0:p.source}}};const D=["DeleteDanger","DefaultConfirm"];export{r as DefaultConfirm,n as DeleteDanger,D as __namedExportsOrder,v as default};
