module.exports=[56704,(a,b,c)=>{b.exports=a.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(a,b,c)=>{b.exports=a.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},20635,(a,b,c)=>{b.exports=a.x("next/dist/server/app-render/action-async-storage.external.js",()=>require("next/dist/server/app-render/action-async-storage.external.js"))},14747,(a,b,c)=>{b.exports=a.x("path",()=>require("path"))},22734,(a,b,c)=>{b.exports=a.x("fs",()=>require("fs"))},78500,(a,b,c)=>{b.exports=a.x("node:async_hooks",()=>require("node:async_hooks"))},60526,(a,b,c)=>{b.exports=a.x("node:os",()=>require("node:os"))},9656,(a,b,c)=>{b.exports=a.x("node:tty",()=>require("node:tty"))},2157,(a,b,c)=>{b.exports=a.x("node:fs",()=>require("node:fs"))},50227,(a,b,c)=>{b.exports=a.x("node:path",()=>require("node:path"))},66680,(a,b,c)=>{b.exports=a.x("node:crypto",()=>require("node:crypto"))},74533,(a,b,c)=>{b.exports=a.x("node:child_process",()=>require("node:child_process"))},12714,(a,b,c)=>{b.exports=a.x("node:fs/promises",()=>require("node:fs/promises"))},12057,(a,b,c)=>{b.exports=a.x("node:util",()=>require("node:util"))},59639,(a,b,c)=>{b.exports=a.x("node:process",()=>require("node:process"))},87769,(a,b,c)=>{b.exports=a.x("node:events",()=>require("node:events"))},8591,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"useMergedRef",{enumerable:!0,get:function(){return e}});let d=a.r(72131);function e(a,b){let c=(0,d.useRef)(null),e=(0,d.useRef)(null);return(0,d.useCallback)(d=>{if(null===d){let a=c.current;a&&(c.current=null,a());let b=e.current;b&&(e.current=null,b())}else a&&(c.current=f(a,d)),b&&(e.current=f(b,d))},[a,b])}function f(a,b){if("function"!=typeof a)return a.current=b,()=>{a.current=null};{let c=a(b);return"function"==typeof c?c:()=>a(null)}}("function"==typeof c.default||"object"==typeof c.default&&null!==c.default)&&void 0===c.default.__esModule&&(Object.defineProperty(c.default,"__esModule",{value:!0}),Object.assign(c.default,c),b.exports=c.default)},92434,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"warnOnce",{enumerable:!0,get:function(){return d}});let d=a=>{}},9270,(a,b,c)=>{"use strict";b.exports=a.r(42602).vendored.contexts.AppRouterContext},36313,(a,b,c)=>{"use strict";b.exports=a.r(42602).vendored.contexts.HooksClientContext},18341,(a,b,c)=>{"use strict";b.exports=a.r(42602).vendored.contexts.ServerInsertedHtml},38783,(a,b,c)=>{"use strict";b.exports=a.r(42602).vendored["react-ssr"].ReactServerDOMTurbopackClient},51234,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"HandleISRError",{enumerable:!0,get:function(){return e}});let d=a.r(56704).workAsyncStorage;function e(a){let{error:b}=a;if(d){let a=d.getStore();if((null==a?void 0:a.isRevalidate)||(null==a?void 0:a.isStaticGeneration))throw console.error(b),b}return null}("function"==typeof c.default||"object"==typeof c.default&&null!==c.default)&&void 0===c.default.__esModule&&(Object.defineProperty(c.default,"__esModule",{value:!0}),Object.assign(c.default,c),b.exports=c.default)},40622,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"default",{enumerable:!0,get:function(){return g}});let d=a.r(87924),e=a.r(51234),f={error:{fontFamily:'system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',height:"100vh",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"},text:{fontSize:"14px",fontWeight:400,lineHeight:"28px",margin:"0 8px"}},g=function(a){let{error:b}=a,c=null==b?void 0:b.digest;return(0,d.jsxs)("html",{id:"__next_error__",children:[(0,d.jsx)("head",{}),(0,d.jsxs)("body",{children:[(0,d.jsx)(e.HandleISRError,{error:b}),(0,d.jsx)("div",{style:f.error,children:(0,d.jsxs)("div",{children:[(0,d.jsxs)("h2",{style:f.text,children:["Application error: a ",c?"server":"client","-side exception has occurred while loading ",window.location.hostname," (see the"," ",c?"server logs":"browser console"," for more information)."]}),c?(0,d.jsx)("p",{style:f.text,children:"Digest: "+c}):null]})})]})]})};("function"==typeof c.default||"object"==typeof c.default&&null!==c.default)&&void 0===c.default.__esModule&&(Object.defineProperty(c.default,"__esModule",{value:!0}),Object.assign(c.default,c),b.exports=c.default)},88595,91954,a=>{"use strict";a.s(["default",()=>f],88595);var b=a.i(87924),c=a.i(72131),d=a.i(38246);a.s(["SITE_CONFIG",()=>e],91954);let e={siteUrl:process.env.NEXT_PUBLIC_SITE_URL??"https://jessica-campos.pages.dev",brandName:"JCNI",brandFull:"Jéssica Campos Negócios Imobiliários",email:"contato@jessicacampos.com.br",instagramUrl:"https://www.instagram.com/jessicacampos7576?igsh=MWZtd25lcTRxYnJtMQ==",shortDescription:"Compra, venda e locação de imóveis em Sorocaba e região com atendimento consultivo direto e anúncios de alto padrão."};function f(){let[a,f]=(0,c.useState)(!1);(0,c.useEffect)(()=>{if(!a)return;let b=a=>{"Escape"===a.key&&f(!1)};return document.addEventListener("keydown",b),()=>document.removeEventListener("keydown",b)},[a]),(0,c.useEffect)(()=>(document.body.style.overflow=a?"hidden":"",()=>{document.body.style.overflow=""}),[a]);let g=()=>f(!1);return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("button",{type:"button",className:"mobile-menu-btn","aria-label":a?"Fechar menu":"Abrir menu","aria-expanded":a,"aria-controls":"mobile-nav-drawer",onClick:()=>f(a=>!a),children:a?(0,b.jsx)("svg",{width:"22",height:"22",viewBox:"0 0 22 22",fill:"none","aria-hidden":"true",children:(0,b.jsx)("path",{d:"M4 4l14 14M18 4L4 18",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"})}):(0,b.jsx)("svg",{width:"22",height:"22",viewBox:"0 0 22 22",fill:"none","aria-hidden":"true",children:(0,b.jsx)("path",{d:"M3 6h16M3 11h16M3 16h16",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"})})}),a&&(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("div",{className:"mobile-nav-overlay","aria-hidden":"true",onClick:g}),(0,b.jsxs)("nav",{id:"mobile-nav-drawer",className:"mobile-nav-drawer","aria-label":"Menu principal",children:[(0,b.jsx)(d.default,{href:"/comprar",className:"mobile-nav-link",onClick:g,children:"Comprar"}),(0,b.jsx)(d.default,{href:"/alugar",className:"mobile-nav-link",onClick:g,children:"Alugar"}),(0,b.jsx)(d.default,{href:"/imoveis",className:"mobile-nav-link",onClick:g,children:"Imóveis"}),(0,b.jsx)(d.default,{href:"/contato",className:"mobile-nav-link",onClick:g,children:"Contato"}),(0,b.jsx)("a",{href:e.instagramUrl,className:"mobile-nav-link mobile-nav-link--instagram",target:"_blank",rel:"noopener noreferrer",onClick:g,children:"Instagram"})]})]})]})}},50944,(a,b,c)=>{b.exports=a.r(74137)},33095,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),!function(a,b){for(var c in b)Object.defineProperty(a,c,{enumerable:!0,get:b[c]})}(c,{default:function(){return i},getImageProps:function(){return h}});let d=a.r(33354),e=a.r(94915),f=a.r(67161),g=d._(a.r(2305));function h(a){let{props:b}=(0,e.getImgProps)(a,{defaultLoader:g.default,imgConf:{deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[16,32,48,64,96,128,256,384],path:"/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!1}});for(let[a,c]of Object.entries(b))void 0===c&&delete b[a];return{props:b}}let i=f.Image},71987,(a,b,c)=>{b.exports=a.r(33095)},19720,a=>{"use strict";a.s(["BRAND_SETTINGS",()=>b,"SITE_IMAGES",()=>c]);let b={displayName:"Jéssica Campos",shortName:"Jéssica Campos",fullName:"Jéssica Campos Negócios Imobiliários",initials:"JCNI",logo:{mode:"image",imageUrl:"/images/logo_jcni.png",alt:"Logo da Jéssica Campos Negócios Imobiliários"}},c={homeHero:{id:"homeHero",label:"Banner principal da home",adminLocation:"Admin > Configurações > Imagens > Home > Banner principal",usage:"Imagem de fundo do hero da página inicial.",url:"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=82",alt:"Sala residencial ampla usada como imagem demonstrativa do banner principal",recommendedSize:"1800 x 1000 px, WebP, até 350 KB",isDemo:!0},jessicaPortrait:{id:"jessicaPortrait",label:"Foto institucional da Jéssica",adminLocation:"Admin > Configurações > Marca > Foto institucional",usage:"Imagem institucional usada no hero e na seção sobre a Jéssica.",url:"/images/jessica-campos.jpeg",alt:"Jéssica Campos, especialista em negócios imobiliários",recommendedSize:"1200 x 1600 px, WebP, até 300 KB",isDemo:!1},propertyCardApartment:{id:"propertyCardApartment",label:"Card demo de apartamento",adminLocation:"Admin > Imóveis > Fotos > Foto principal do imóvel",usage:"Imagem demonstrativa para visualizar cards antes do cadastro real.",url:"https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",alt:"Fachada residencial usada como imagem demonstrativa de imóvel",recommendedSize:"900 x 675 px, WebP, até 220 KB",isDemo:!0},propertyCardHouse:{id:"propertyCardHouse",label:"Card demo de casa",adminLocation:"Admin > Imóveis > Fotos > Foto principal do imóvel",usage:"Imagem demonstrativa para visualizar cards antes do cadastro real.",url:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",alt:"Casa contemporânea usada como imagem demonstrativa de imóvel",recommendedSize:"900 x 675 px, WebP, até 220 KB",isDemo:!0},propertyCardInterior:{id:"propertyCardInterior",label:"Card demo de interior",adminLocation:"Admin > Imóveis > Fotos > Galeria do imóvel",usage:"Imagem demonstrativa para composição de cards e landing pages.",url:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",alt:"Interior residencial usado como imagem demonstrativa de imóvel",recommendedSize:"900 x 675 px, WebP, até 220 KB",isDemo:!0},propertyCardCondo:{id:"propertyCardCondo",label:"Card demo de condomínio",adminLocation:"Admin > Imóveis > Fotos > Galeria do imóvel",usage:"Imagem demonstrativa para composição de cards e landing pages.",url:"https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",alt:"Área social residencial usada como imagem demonstrativa de imóvel",recommendedSize:"900 x 675 px, WebP, até 220 KB",isDemo:!0}};Object.values(c),process.env.NEXT_PUBLIC_WHATSAPP_PHONE_E164},15541,a=>{"use strict";a.s(["THEME_PRESETS",()=>b]);let b=[{id:"alto-padrao-neutro",name:"Alto Padrão Neutro",intent:"Preto suave, branco, cinza quente e acento discreto.",tokens:{"--color-bg":"#fbfaf7","--color-surface":"#ffffff","--color-surface-muted":"#f2eee8","--color-text":"#161616","--color-text-muted":"#65615b","--color-primary":"#20201e","--color-accent":"#866247","--color-accent-hover":"#6f5039","--color-border":"#ded8ce","--color-footer-bg":"#17191d","--color-footer-text":"#f4f0e8","--color-success":"#2f6f4e","--color-warning":"#9a6a20","--color-danger":"#9d2f2f"}},{id:"azul-confianca",name:"Azul Confiança",intent:"Base clara com acento azul escuro, mais institucional.",tokens:{"--color-bg":"#f7f9fb","--color-surface":"#ffffff","--color-surface-muted":"#edf2f7","--color-text":"#142033","--color-text-muted":"#5d6876","--color-primary":"#111b2d","--color-accent":"#264f78","--color-accent-hover":"#1d3f61","--color-border":"#d8e0e8","--color-footer-bg":"#111827","--color-footer-text":"#f5f7fb","--color-success":"#2f6f4e","--color-warning":"#94621f","--color-danger":"#983434"}},{id:"champagne-imobiliario",name:"Champagne Imobiliário",intent:"Off-white, dourado suave e contraste elegante.",tokens:{"--color-bg":"#fdf9f1","--color-surface":"#ffffff","--color-surface-muted":"#f3eadb","--color-text":"#1d1a17","--color-text-muted":"#6b6255","--color-primary":"#241f1a","--color-accent":"#9c7a3f","--color-accent-hover":"#816332","--color-border":"#e3d8c5","--color-footer-bg":"#181613","--color-footer-text":"#f8f0df","--color-success":"#2f6f4e","--color-warning":"#9a6a20","--color-danger":"#9d2f2f"}}]},65846,a=>{"use strict";a.s(["default",()=>m]);var b=a.i(87924),c=a.i(72131),d=a.i(38246),e=a.i(50944),f=a.i(60764);let g=["VENDA","ALUGUEL","AMBOS"],h=["APARTAMENTO","CASA","TERRENO","COMERCIAL","COBERTURA","KITNET","RURAL"],i={campolim:"Campolim",centro:"Centro",eden:"Eden","wanel-ville":"Wanel Ville","alem-ponte":"Alem Ponte",aparecidinha:"Aparecidinha","jardim-paulistano":"Jardim Paulistano","santa-rosalia":"Santa Rosalia"},j={DISPONIVEL:"Disponivel",RESERVADO:"Reservado",VENDIDO:"Vendido",LOCADO:"Locado",INATIVO:"Inativo"};function k(a,b){if(!a)return"";let c=a.trim().toUpperCase();return b.includes(c)?c:""}function l(a){if(!a)return"";let b=decodeURIComponent(a).trim().replace(/\+/g," ");if(!b)return"";let c=b.toLowerCase();return i[c]?i[c]:b.replace(/-/g," ")}function m(){return(0,b.jsx)(c.Suspense,{fallback:(0,b.jsx)("main",{className:"imoveis-page",children:(0,b.jsx)("p",{className:"estado",children:"Carregando imóveis..."})}),children:(0,b.jsx)(n,{})})}function n(){let a=(0,e.useRouter)(),i=(0,e.usePathname)(),m=(0,e.useSearchParams)(),[n,o]=(0,c.useState)([]),[p,q]=(0,c.useState)(!0),[r,s]=(0,c.useState)(""),[t,u]=(0,c.useState)(0),v=(0,c.useMemo)(()=>({finalidade:k(m.get("finalidade"),g),tipo:k(m.get("tipo"),h),bairro:l(m.get("bairro")),q:l(m.get("busca"))}),[m]);function w(b,c){let d=new URLSearchParams(m.toString());c?d.set(b,c):d.delete(b),d.delete("pagina"),a.replace(`${i}${d.toString()?`?${d.toString()}`:""}`)}return(0,c.useEffect)(()=>{let a=!0;return async function(){q(!0),s("");try{let b=m.toString(),c=await fetch(`/api/imoveis${b?`?${b}`:""}`,{cache:"no-store"});if(!c.ok)throw Error("Erro ao carregar imóveis");let d=await c.json();if(!a)return;o(d.imoveis??[]),u(d.paginacao?.total??0)}catch{if(!a)return;s("Não foi possível carregar os imóveis no momento.")}finally{a&&q(!1)}}(),()=>{a=!1}},[m]),(0,b.jsxs)("main",{className:"imoveis-page",children:[(0,b.jsx)(f.SiteHeader,{}),(0,b.jsxs)("section",{className:"imoveis-shell",children:[(0,b.jsxs)("div",{className:"imoveis-heading",children:[(0,b.jsx)("p",{className:"eyebrow",children:"Imóveis"}),(0,b.jsx)("h1",{children:"Imóveis em Sorocaba e região"}),(0,b.jsx)("p",{children:"Busca com filtros e URL compartilhável para facilitar o atendimento."})]}),(0,b.jsxs)("div",{className:"imoveis-filtros","aria-label":"Filtros de imóveis",children:[(0,b.jsx)("input",{type:"search",placeholder:"Código, bairro ou palavra-chave",value:v.q,onChange:a=>w("busca",a.target.value)}),(0,b.jsxs)("select",{value:v.finalidade,onChange:a=>w("finalidade",a.target.value),children:[(0,b.jsx)("option",{value:"",children:"Comprar ou alugar"}),(0,b.jsx)("option",{value:"VENDA",children:"Comprar"}),(0,b.jsx)("option",{value:"ALUGUEL",children:"Alugar"}),(0,b.jsx)("option",{value:"AMBOS",children:"Ambos"})]}),(0,b.jsxs)("select",{value:v.tipo,onChange:a=>w("tipo",a.target.value),children:[(0,b.jsx)("option",{value:"",children:"Todos os tipos"}),(0,b.jsx)("option",{value:"APARTAMENTO",children:"Apartamento"}),(0,b.jsx)("option",{value:"CASA",children:"Casa"}),(0,b.jsx)("option",{value:"TERRENO",children:"Terreno"}),(0,b.jsx)("option",{value:"COMERCIAL",children:"Comercial"}),(0,b.jsx)("option",{value:"COBERTURA",children:"Cobertura"}),(0,b.jsx)("option",{value:"KITNET",children:"Kitnet"}),(0,b.jsx)("option",{value:"RURAL",children:"Rural"})]}),(0,b.jsx)("input",{type:"text",placeholder:"Bairro",value:v.bairro,onChange:a=>w("bairro",a.target.value)})]}),p&&(0,b.jsx)("p",{className:"estado",children:"Carregando imóveis..."}),r&&(0,b.jsx)("p",{className:"erro",children:r}),!p&&!r&&(0,b.jsxs)(b.Fragment,{children:[(0,b.jsxs)("p",{className:"resultado",children:[t," imóvel(is) encontrado(s)"]}),0===n.length?(0,b.jsxs)("div",{className:"estado-vazio",children:[(0,b.jsx)("p",{children:"Nenhum imóvel encontrado para os filtros selecionados."}),(0,b.jsx)("button",{type:"button",onClick:()=>a.replace(i),children:"Limpar filtros"})]}):(0,b.jsx)("div",{className:"imoveis-grid",children:n.map(a=>(0,b.jsxs)(d.default,{href:`/imoveis/${a.slugUrl}`,className:"imovel-card",children:[(0,b.jsxs)("div",{className:"imovel-card-img",children:[a.fotos[0]?(0,b.jsx)("img",{src:a.fotos[0].url,alt:a.titulo,loading:"lazy"}):(0,b.jsx)("div",{className:"sem-foto",children:"Sem foto"}),"DISPONIVEL"!==a.status&&(0,b.jsx)("span",{className:`badge-status badge-${a.status.toLowerCase()}`,children:j[a.status]})]}),(0,b.jsxs)("div",{className:"imovel-card-body",children:[(0,b.jsx)("p",{className:"codigo",children:a.codigo}),(0,b.jsx)("h2",{children:a.titulo}),(0,b.jsx)("p",{className:"preco",children:a.preco.toLocaleString("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0})}),(0,b.jsxs)("p",{className:"local",children:[a.bairro,", ",a.cidade]}),(0,b.jsxs)("div",{className:"meta",children:[(0,b.jsx)("span",{children:a.area?`${a.area} m\xb2`:"-"}),(0,b.jsxs)("span",{children:[a.quartos??"-","q"]}),(0,b.jsxs)("span",{children:[a.banheiros??"-","b"]}),(0,b.jsxs)("span",{children:[a.vagas??"-","v"]})]})]})]},a.id))})]})]}),(0,b.jsx)("style",{children:`
        .imoveis-page { min-height: 100vh; background: var(--color-bg); }
        .imoveis-shell { width: min(1180px, calc(100% - 32px)); margin: 0 auto; padding: 28px 0 54px; }
        .imoveis-heading h1 { margin-bottom: 8px; }
        .imoveis-heading p { color: var(--color-text-muted); }
        .imoveis-filtros {
          margin-top: 22px;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 10px;
        }
        .imoveis-filtros input,
        .imoveis-filtros select {
          min-height: 44px;
          border: 1px solid var(--color-border);
          border-radius: 10px;
          background: var(--color-surface);
          padding: 0 12px;
          color: var(--color-text);
        }
        .resultado { margin: 18px 0 12px; font-size: 0.88rem; color: var(--color-text-muted); }
        .estado, .erro { margin-top: 18px; }
        .erro { color: #b91c1c; }
        .estado-vazio {
          margin-top: 18px;
          border: 1px solid var(--color-border);
          border-radius: 12px;
          background: var(--color-surface);
          padding: 16px;
        }
        .estado-vazio button {
          margin-top: 10px;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          background: var(--color-bg);
          min-height: 38px;
          padding: 0 12px;
          cursor: pointer;
        }
        .imoveis-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }
        .imovel-card {
          border: 1px solid var(--color-border);
          border-radius: 12px;
          background: var(--color-surface);
          overflow: hidden;
          color: inherit;
          text-decoration: none;
        }
        .imovel-card-img {
          position: relative;
          aspect-ratio: 4 / 3;
          background: var(--color-surface-muted);
        }
        .imovel-card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .sem-foto {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-muted);
          font-size: 0.84rem;
        }
        .badge-status {
          position: absolute;
          top: 10px;
          left: 10px;
          border-radius: 999px;
          padding: 4px 9px;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
        }
        .badge-reservado { background: #fef3c7; color: #92400e; }
        .badge-vendido { background: #dbeafe; color: #1e3a8a; }
        .badge-locado { background: #dcfce7; color: #14532d; }
        .imovel-card-body { padding: 12px; }
        .codigo { margin: 0; font-size: 0.76rem; color: var(--color-text-muted); }
        .imovel-card h2 {
          margin: 4px 0 8px;
          font-size: 1rem;
          line-height: 1.3;
        }
        .preco { margin: 0 0 6px; font-weight: 800; color: var(--color-primary); }
        .local { margin: 0 0 9px; font-size: 0.85rem; color: var(--color-text-muted); }
        .meta { display: flex; gap: 8px; color: var(--color-text-muted); font-size: 0.8rem; }

        @media (max-width: 980px) {
          .imoveis-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .imoveis-filtros { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }

        @media (max-width: 620px) {
          .imoveis-shell { width: min(1180px, calc(100% - 22px)); padding-top: 20px; }
          .imoveis-grid { grid-template-columns: 1fr; }
          .imoveis-filtros { grid-template-columns: 1fr; }
        }
      `})]})}}];

//# sourceMappingURL=%5Broot-of-the-server%5D__61648569._.js.map