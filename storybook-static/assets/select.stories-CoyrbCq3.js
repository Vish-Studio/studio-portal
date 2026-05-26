import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{S as l,O as r}from"./option-D_ooYKZb.js";import{F as c}from"./form-field-DyTk_Xv3.js";import"./index-CwcVQgaJ.js";import"./material-lucide-icons-DONtn2OU.js";import"./material-icon-DL-uhJfy.js";import"./utils-C8nBGPD0.js";const P={title:"Common/Select",component:l,tags:["autodocs"],parameters:{layout:"centered",backgrounds:{default:"white"}}},i={args:{children:e.jsxs(e.Fragment,{children:[e.jsx(r,{value:"",children:"— Select an option —"}),e.jsx(r,{value:"active",children:"Active"}),e.jsx(r,{value:"inactive",children:"Inactive"}),e.jsx(r,{value:"lost",children:"Lost"})]})},decorators:[t=>e.jsx("div",{className:"w-72",children:e.jsx(t,{})})]},a={args:{hasError:!0,children:e.jsxs(e.Fragment,{children:[e.jsx(r,{value:"",children:"— Select an option —"}),e.jsx(r,{value:"active",children:"Active"})]})},decorators:[t=>e.jsx("div",{className:"w-72",children:e.jsx(t,{})})]},o={args:{disabled:!0,defaultValue:"active",children:e.jsxs(e.Fragment,{children:[e.jsx(r,{value:"active",children:"Active"}),e.jsx(r,{value:"inactive",children:"Inactive"})]})},decorators:[t=>e.jsx("div",{className:"w-72",children:e.jsx(t,{})})]},s={args:{className:"text-[11px] font-semibold text-gray-600 bg-gray-100 border-0 rounded-lg px-2.5 py-1.5 pr-6",children:e.jsxs(e.Fragment,{children:[e.jsx(r,{value:"all",children:"All"}),e.jsx(r,{value:"todo",children:"Todo"}),e.jsx(r,{value:"in-progress",children:"In Progress"}),e.jsx(r,{value:"to-test",children:"To Test"}),e.jsx(r,{value:"completed",children:"Completed"})]})}},n={render:()=>e.jsxs("div",{className:"w-72 flex flex-col gap-4",children:[e.jsx(c,{label:"Status",required:!0,children:e.jsxs(l,{children:[e.jsx(r,{value:"",children:"— Select status —"}),e.jsx(r,{value:"active",children:"Active"}),e.jsx(r,{value:"inactive",children:"Inactive"}),e.jsx(r,{value:"lost",children:"Lost"})]})}),e.jsx(c,{label:"Priority",required:!0,error:"Priority is required",children:e.jsxs(l,{hasError:!0,children:[e.jsx(r,{value:"",children:"— Select priority —"}),e.jsx(r,{value:"high",children:"High"}),e.jsx(r,{value:"medium",children:"Medium"}),e.jsx(r,{value:"low",children:"Low"})]})})]})};var d,p,u;i.parameters={...i.parameters,docs:{...(d=i.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    children: <>
        <Option value="">— Select an option —</Option>
        <Option value="active">Active</Option>
        <Option value="inactive">Inactive</Option>
        <Option value="lost">Lost</Option>
      </>
  },
  decorators: [Story => <div className="w-72"><Story /></div>]
}`,...(u=(p=i.parameters)==null?void 0:p.docs)==null?void 0:u.source}}};var v,m,h;a.parameters={...a.parameters,docs:{...(v=a.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    hasError: true,
    children: <>
        <Option value="">— Select an option —</Option>
        <Option value="active">Active</Option>
      </>
  },
  decorators: [Story => <div className="w-72"><Story /></div>]
}`,...(h=(m=a.parameters)==null?void 0:m.docs)==null?void 0:h.source}}};var x,O,j;o.parameters={...o.parameters,docs:{...(x=o.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    disabled: true,
    defaultValue: 'active',
    children: <>
        <Option value="active">Active</Option>
        <Option value="inactive">Inactive</Option>
      </>
  },
  decorators: [Story => <div className="w-72"><Story /></div>]
}`,...(j=(O=o.parameters)==null?void 0:O.docs)==null?void 0:j.source}}};var g,S,F;s.parameters={...s.parameters,docs:{...(g=s.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    className: 'text-[11px] font-semibold text-gray-600 bg-gray-100 border-0 rounded-lg px-2.5 py-1.5 pr-6',
    children: <>
        <Option value="all">All</Option>
        <Option value="todo">Todo</Option>
        <Option value="in-progress">In Progress</Option>
        <Option value="to-test">To Test</Option>
        <Option value="completed">Completed</Option>
      </>
  }
}`,...(F=(S=s.parameters)==null?void 0:S.docs)==null?void 0:F.source}}};var y,b,f;n.parameters={...n.parameters,docs:{...(y=n.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: () => <div className="w-72 flex flex-col gap-4">
      <FormField label="Status" required>
        <Select>
          <Option value="">— Select status —</Option>
          <Option value="active">Active</Option>
          <Option value="inactive">Inactive</Option>
          <Option value="lost">Lost</Option>
        </Select>
      </FormField>
      <FormField label="Priority" required error="Priority is required">
        <Select hasError>
          <Option value="">— Select priority —</Option>
          <Option value="high">High</Option>
          <Option value="medium">Medium</Option>
          <Option value="low">Low</Option>
        </Select>
      </FormField>
    </div>
}`,...(f=(b=n.parameters)==null?void 0:b.docs)==null?void 0:f.source}}};const T=["Default","WithError","Disabled","CompactFilter","InsideFormField"];export{s as CompactFilter,i as Default,o as Disabled,n as InsideFormField,a as WithError,T as __namedExportsOrder,P as default};
