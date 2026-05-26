import{j as c}from"./jsx-runtime-D_zvdyIk.js";import{r as l}from"./index-CwcVQgaJ.js";import{S as o}from"./search-bar-DIZOrVWj.js";import"./material-lucide-icons-DONtn2OU.js";import"./material-icon-DL-uhJfy.js";const j={title:"Common/SearchBar",component:o,tags:["autodocs"],parameters:{layout:"centered",backgrounds:{default:"white"}}},r={render:()=>{const[e,a]=l.useState("");return c.jsx(o,{value:e,onChange:a,placeholder:"Search here..."})}},t={render:()=>{const[e,a]=l.useState("Acme");return c.jsx(o,{value:e,onChange:a,placeholder:"Search clients..."})}},s={render:()=>{const[e,a]=l.useState("");return c.jsx(o,{value:e,onChange:a,placeholder:"Type to search...",autoFocus:!0})}};var n,u,p;r.parameters={...r.parameters,docs:{...(n=r.parameters)==null?void 0:n.docs,source:{originalSource:`{
  render: () => {
    const [val, setVal] = useState('');
    return <SearchBar value={val} onChange={setVal} placeholder="Search here..." />;
  }
}`,...(p=(u=r.parameters)==null?void 0:u.docs)==null?void 0:p.source}}};var d,m,h;t.parameters={...t.parameters,docs:{...(d=t.parameters)==null?void 0:d.docs,source:{originalSource:`{
  render: () => {
    const [val, setVal] = useState('Acme');
    return <SearchBar value={val} onChange={setVal} placeholder="Search clients..." />;
  }
}`,...(h=(m=t.parameters)==null?void 0:m.docs)==null?void 0:h.source}}};var S,i,v;s.parameters={...s.parameters,docs:{...(S=s.parameters)==null?void 0:S.docs,source:{originalSource:`{
  render: () => {
    const [val, setVal] = useState('');
    return <SearchBar value={val} onChange={setVal} placeholder="Type to search..." autoFocus />;
  }
}`,...(v=(i=s.parameters)==null?void 0:i.docs)==null?void 0:v.source}}};const B=["Default","WithValue","AutoFocused"];export{s as AutoFocused,r as Default,t as WithValue,B as __namedExportsOrder,j as default};
