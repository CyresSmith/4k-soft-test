import{q as d,b as x,h as k,v as l,r as f,u as T,g as j,i as S,k as y,j as e}from"./index-3e67b549.js";import{S as E,T as V}from"./Title-369f8987.js";import{C as v}from"./Container-4a444224.js";const A=()=>{const{token:s}=d(),t=x(),a=k(),{data:r,isLoading:C,error:o,isError:i,isSuccess:c}=l(s),[h,g]=f.useState("Verification page"),n=T(j);return f.useEffect(()=>{if(!(!s||n.accessToken)){if(c){const{user:m,accessToken:u,refreshToken:p}=r;t(S({user:m,accessToken:u,refreshToken:p})),y(u),a("/")}i&&g(o.message)}},[n.accessToken,r,t,o,i,c,a,s]),e.jsx(E,{children:e.jsx(v,{children:e.jsx(V,{children:h})})})},D=A;export{D as default};
