import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as p}from"./index-CwcVQgaJ.js";import{M as a}from"./modal-DISM86dM.js";import"./material-lucide-icons-DONtn2OU.js";import"./material-icon-DL-uhJfy.js";const h={title:"Common/Modal",component:a,tags:["autodocs"],parameters:{layout:"fullscreen"}},s={render:()=>{const[o,t]=p.useState(!1);return e.jsxs("div",{className:"p-8 min-h-screen bg-gray-100 flex items-start",children:[e.jsx("button",{onClick:()=>t(!0),className:"px-4 py-2 bg-black text-white text-sm font-semibold rounded-xl",children:"Open Dialog"}),o&&e.jsx(a,{onClose:()=>t(!1),title:"Confirm Action",description:"Are you sure you want to proceed? This cannot be undone.",variant:"dialog",footer:e.jsxs("div",{className:"flex w-full gap-3",children:[e.jsx("button",{onClick:()=>t(!1),className:"flex-1 rounded-xl bg-gray-100 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200",children:"Cancel"}),e.jsx("button",{className:"flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700",children:"Delete"})]}),children:e.jsx("div",{className:"px-6 py-4",children:e.jsx("p",{className:"text-sm font-medium text-gray-500",children:"Footer actions are equal-width and consistently placed."})})})]})}},n={render:()=>{const[o,t]=p.useState(!1);return e.jsxs("div",{className:"p-8 min-h-screen bg-gray-100 flex items-start",children:[e.jsx("button",{onClick:()=>t(!0),className:"px-4 py-2 bg-black text-white text-sm font-semibold rounded-xl",children:"Open Sheet"}),o&&e.jsx(a,{onClose:()=>t(!1),title:"Project Details",variant:"sheet",children:e.jsx("div",{className:"px-6 py-4 text-sm text-gray-600",children:"Sheet modal content slides in from the bottom."})})]})}};var r,l,i;s.parameters={...s.parameters,docs:{...(r=s.parameters)==null?void 0:r.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = useState(false);
    return <div className="p-8 min-h-screen bg-gray-100 flex items-start">
        <button onClick={() => setOpen(true)} className="px-4 py-2 bg-black text-white text-sm font-semibold rounded-xl">
          Open Dialog
        </button>
        {open && <Modal onClose={() => setOpen(false)} title="Confirm Action" description="Are you sure you want to proceed? This cannot be undone." variant="dialog" footer={<div className="flex w-full gap-3">
                <button onClick={() => setOpen(false)} className="flex-1 rounded-xl bg-gray-100 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200">Cancel</button>
                <button className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700">Delete</button>
              </div>}>
            <div className="px-6 py-4">
              <p className="text-sm font-medium text-gray-500">Footer actions are equal-width and consistently placed.</p>
            </div>
          </Modal>}
      </div>;
  }
}`,...(i=(l=s.parameters)==null?void 0:l.docs)==null?void 0:i.source}}};var d,c,m;n.parameters={...n.parameters,docs:{...(d=n.parameters)==null?void 0:d.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = useState(false);
    return <div className="p-8 min-h-screen bg-gray-100 flex items-start">
        <button onClick={() => setOpen(true)} className="px-4 py-2 bg-black text-white text-sm font-semibold rounded-xl">
          Open Sheet
        </button>
        {open && <Modal onClose={() => setOpen(false)} title="Project Details" variant="sheet">
            <div className="px-6 py-4 text-sm text-gray-600">
              Sheet modal content slides in from the bottom.
            </div>
          </Modal>}
      </div>;
  }
}`,...(m=(c=n.parameters)==null?void 0:c.docs)==null?void 0:m.source}}};const y=["Dialog","Sheet"];export{s as Dialog,n as Sheet,y as __namedExportsOrder,h as default};
