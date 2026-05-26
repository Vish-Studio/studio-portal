import{j as t}from"./jsx-runtime-D_zvdyIk.js";import{r as c}from"./index-CwcVQgaJ.js";import{M as n}from"./month-year-nav-BRC7EUF1.js";import"./button-icon-CawgxlcK.js";import"./material-icon-DL-uhJfy.js";import"./button-_wOG-Qwa.js";import"./material-lucide-icons-DONtn2OU.js";import"./option-D_ooYKZb.js";import"./utils-C8nBGPD0.js";const f={title:"Admin/MonthYearNav",component:n,tags:["autodocs"],parameters:{layout:"centered",backgrounds:{default:"white"}}},e={render:()=>{const[a,m]=c.useState(new Date);return t.jsxs("div",{className:"flex flex-col items-center gap-4",children:[t.jsx(n,{value:a,onChange:m}),t.jsx("p",{className:"text-sm text-gray-500",children:a.toLocaleDateString("en-US",{month:"long",year:"numeric"})})]})}};var r,o,s;e.parameters={...e.parameters,docs:{...(r=e.parameters)==null?void 0:r.docs,source:{originalSource:`{
  render: () => {
    const [date, setDate] = useState(new Date());
    return <div className="flex flex-col items-center gap-4">
        <MonthYearNav value={date} onChange={setDate} />
        <p className="text-sm text-gray-500">
          {date.toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric'
        })}
        </p>
      </div>;
  }
}`,...(s=(o=e.parameters)==null?void 0:o.docs)==null?void 0:s.source}}};const D=["Interactive"];export{e as Interactive,D as __namedExportsOrder,f as default};
