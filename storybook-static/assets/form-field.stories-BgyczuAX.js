import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{F as r,i as a,s as O}from"./form-field-DyTk_Xv3.js";import{S as A,O as l}from"./option-D_ooYKZb.js";import"./index-CwcVQgaJ.js";import"./material-lucide-icons-DONtn2OU.js";import"./material-icon-DL-uhJfy.js";import"./utils-C8nBGPD0.js";const L={title:"Common/FormField",component:r,tags:["autodocs"],parameters:{layout:"centered",backgrounds:{default:"white"}}},s={args:{label:"Full Name",children:e.jsx("input",{placeholder:"e.g. Sarah Mitchell",className:a(!1)})}},t={args:{label:"Email Address",required:!0,children:e.jsx("input",{type:"email",placeholder:"you@studio.com",className:a(!1)})}},i={args:{label:"Email Address",required:!0,error:"Enter a valid email address",children:e.jsx("input",{type:"email",placeholder:"you@studio.com",className:a(!0)})}},c={args:{label:"Phone Number",hint:"Include country code, e.g. +1 (555) 000-0000",children:e.jsx("input",{type:"tel",placeholder:"+1 (555) 000-0000",className:a(!1)})}},o={args:{label:"Status",required:!0,children:e.jsxs(A,{className:O(!1),children:[e.jsx(l,{value:"active",children:"Active"}),e.jsx(l,{value:"inactive",children:"Inactive"}),e.jsx(l,{value:"lost",children:"Lost"})]})}},d={render:()=>e.jsxs("div",{className:"w-80 flex flex-col gap-4",children:[e.jsx(r,{label:"Full Name",required:!0,children:e.jsx("input",{placeholder:"Sarah Mitchell",className:a(!1)})}),e.jsx(r,{label:"Company Name",children:e.jsx("input",{placeholder:"Acme Corp",className:a(!1)})}),e.jsx(r,{label:"Email",required:!0,error:"Enter a valid email address",children:e.jsx("input",{type:"email",placeholder:"sarah@acme.com",className:a(!0)})}),e.jsx(r,{label:"Status",required:!0,children:e.jsxs(A,{className:O(!1),children:[e.jsx(l,{value:"active",children:"Active"}),e.jsx(l,{value:"inactive",children:"Inactive"})]})})]})};var n,m,u;s.parameters={...s.parameters,docs:{...(n=s.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    label: 'Full Name',
    children: <input placeholder="e.g. Sarah Mitchell" className={inputCls(false)} />
  }
}`,...(u=(m=s.parameters)==null?void 0:m.docs)==null?void 0:u.source}}};var p,h,v;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    label: 'Email Address',
    required: true,
    children: <input type="email" placeholder="you@studio.com" className={inputCls(false)} />
  }
}`,...(v=(h=t.parameters)==null?void 0:h.docs)==null?void 0:v.source}}};var F,N,x;i.parameters={...i.parameters,docs:{...(F=i.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    label: 'Email Address',
    required: true,
    error: 'Enter a valid email address',
    children: <input type="email" placeholder="you@studio.com" className={inputCls(true)} />
  }
}`,...(x=(N=i.parameters)==null?void 0:N.docs)==null?void 0:x.source}}};var f,g,S;c.parameters={...c.parameters,docs:{...(f=c.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    label: 'Phone Number',
    hint: 'Include country code, e.g. +1 (555) 000-0000',
    children: <input type="tel" placeholder="+1 (555) 000-0000" className={inputCls(false)} />
  }
}`,...(S=(g=c.parameters)==null?void 0:g.docs)==null?void 0:S.source}}};var b,j,y;o.parameters={...o.parameters,docs:{...(b=o.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    label: 'Status',
    required: true,
    children: <Select className={selectCls(false)}>
        <Option value="active">Active</Option>
        <Option value="inactive">Inactive</Option>
        <Option value="lost">Lost</Option>
      </Select>
  }
}`,...(y=(j=o.parameters)==null?void 0:j.docs)==null?void 0:y.source}}};var C,q,E;d.parameters={...d.parameters,docs:{...(C=d.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: () => <div className="w-80 flex flex-col gap-4">
      <FormField label="Full Name" required>
        <input placeholder="Sarah Mitchell" className={inputCls(false)} />
      </FormField>
      <FormField label="Company Name">
        <input placeholder="Acme Corp" className={inputCls(false)} />
      </FormField>
      <FormField label="Email" required error="Enter a valid email address">
        <input type="email" placeholder="sarah@acme.com" className={inputCls(true)} />
      </FormField>
      <FormField label="Status" required>
        <Select className={selectCls(false)}>
          <Option value="active">Active</Option>
          <Option value="inactive">Inactive</Option>
        </Select>
      </FormField>
    </div>
}`,...(E=(q=d.parameters)==null?void 0:q.docs)==null?void 0:E.source}}};const P=["Default","Required","WithError","WithHint","SelectField","FullForm"];export{s as Default,d as FullForm,t as Required,o as SelectField,i as WithError,c as WithHint,P as __namedExportsOrder,L as default};
