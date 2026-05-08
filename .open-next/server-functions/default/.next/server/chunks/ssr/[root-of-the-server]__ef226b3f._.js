module.exports=[93695,(a,b,c)=>{b.exports=a.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},62212,a=>{a.n(a.i(66114))},81388,a=>{a.n(a.i(32439))},21170,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"RedirectStatusCode",{enumerable:!0,get:function(){return d}});var d=function(a){return a[a.SeeOther=303]="SeeOther",a[a.TemporaryRedirect=307]="TemporaryRedirect",a[a.PermanentRedirect=308]="PermanentRedirect",a}({});("function"==typeof c.default||"object"==typeof c.default&&null!==c.default)&&void 0===c.default.__esModule&&(Object.defineProperty(c.default,"__esModule",{value:!0}),Object.assign(c.default,c),b.exports=c.default)},28859,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),!function(a,b){for(var c in b)Object.defineProperty(a,c,{enumerable:!0,get:b[c]})}(c,{REDIRECT_ERROR_CODE:function(){return e},RedirectType:function(){return f},isRedirectError:function(){return g}});let d=a.r(21170),e="NEXT_REDIRECT";var f=function(a){return a.push="push",a.replace="replace",a}({});function g(a){if("object"!=typeof a||null===a||!("digest"in a)||"string"!=typeof a.digest)return!1;let b=a.digest.split(";"),[c,f]=b,g=b.slice(2,-2).join(";"),h=Number(b.at(-2));return c===e&&("replace"===f||"push"===f)&&"string"==typeof g&&!isNaN(h)&&h in d.RedirectStatusCode}("function"==typeof c.default||"object"==typeof c.default&&null!==c.default)&&void 0===c.default.__esModule&&(Object.defineProperty(c.default,"__esModule",{value:!0}),Object.assign(c.default,c),b.exports=c.default)},44868,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),!function(a,b){for(var c in b)Object.defineProperty(a,c,{enumerable:!0,get:b[c]})}(c,{getRedirectError:function(){return g},getRedirectStatusCodeFromError:function(){return l},getRedirectTypeFromError:function(){return k},getURLFromRedirectError:function(){return j},permanentRedirect:function(){return i},redirect:function(){return h}});let d=a.r(21170),e=a.r(28859),f=a.r(20635).actionAsyncStorage;function g(a,b,c){void 0===c&&(c=d.RedirectStatusCode.TemporaryRedirect);let f=Object.defineProperty(Error(e.REDIRECT_ERROR_CODE),"__NEXT_ERROR_CODE",{value:"E394",enumerable:!1,configurable:!0});return f.digest=e.REDIRECT_ERROR_CODE+";"+b+";"+a+";"+c+";",f}function h(a,b){var c;throw null!=b||(b=(null==f||null==(c=f.getStore())?void 0:c.isAction)?e.RedirectType.push:e.RedirectType.replace),g(a,b,d.RedirectStatusCode.TemporaryRedirect)}function i(a,b){throw void 0===b&&(b=e.RedirectType.replace),g(a,b,d.RedirectStatusCode.PermanentRedirect)}function j(a){return(0,e.isRedirectError)(a)?a.digest.split(";").slice(2,-2).join(";"):null}function k(a){if(!(0,e.isRedirectError)(a))throw Object.defineProperty(Error("Not a redirect error"),"__NEXT_ERROR_CODE",{value:"E260",enumerable:!1,configurable:!0});return a.digest.split(";",2)[1]}function l(a){if(!(0,e.isRedirectError)(a))throw Object.defineProperty(Error("Not a redirect error"),"__NEXT_ERROR_CODE",{value:"E260",enumerable:!1,configurable:!0});return Number(a.digest.split(";").at(-2))}("function"==typeof c.default||"object"==typeof c.default&&null!==c.default)&&void 0===c.default.__esModule&&(Object.defineProperty(c.default,"__esModule",{value:!0}),Object.assign(c.default,c),b.exports=c.default)},89798,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),!function(a,b){for(var c in b)Object.defineProperty(a,c,{enumerable:!0,get:b[c]})}(c,{HTTPAccessErrorStatus:function(){return d},HTTP_ERROR_FALLBACK_ERROR_CODE:function(){return f},getAccessFallbackErrorTypeByStatus:function(){return i},getAccessFallbackHTTPStatus:function(){return h},isHTTPAccessFallbackError:function(){return g}});let d={NOT_FOUND:404,FORBIDDEN:403,UNAUTHORIZED:401},e=new Set(Object.values(d)),f="NEXT_HTTP_ERROR_FALLBACK";function g(a){if("object"!=typeof a||null===a||!("digest"in a)||"string"!=typeof a.digest)return!1;let[b,c]=a.digest.split(";");return b===f&&e.has(Number(c))}function h(a){return Number(a.digest.split(";")[1])}function i(a){switch(a){case 401:return"unauthorized";case 403:return"forbidden";case 404:return"not-found";default:return}}("function"==typeof c.default||"object"==typeof c.default&&null!==c.default)&&void 0===c.default.__esModule&&(Object.defineProperty(c.default,"__esModule",{value:!0}),Object.assign(c.default,c),b.exports=c.default)},16155,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"notFound",{enumerable:!0,get:function(){return e}});let d=""+a.r(89798).HTTP_ERROR_FALLBACK_ERROR_CODE+";404";function e(){let a=Object.defineProperty(Error(d),"__NEXT_ERROR_CODE",{value:"E394",enumerable:!1,configurable:!0});throw a.digest=d,a}("function"==typeof c.default||"object"==typeof c.default&&null!==c.default)&&void 0===c.default.__esModule&&(Object.defineProperty(c.default,"__esModule",{value:!0}),Object.assign(c.default,c),b.exports=c.default)},34557,(a,b,c)=>{"use strict";function d(){throw Object.defineProperty(Error("`forbidden()` is experimental and only allowed to be enabled when `experimental.authInterrupts` is enabled."),"__NEXT_ERROR_CODE",{value:"E488",enumerable:!1,configurable:!0})}Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"forbidden",{enumerable:!0,get:function(){return d}}),a.r(89798).HTTP_ERROR_FALLBACK_ERROR_CODE,("function"==typeof c.default||"object"==typeof c.default&&null!==c.default)&&void 0===c.default.__esModule&&(Object.defineProperty(c.default,"__esModule",{value:!0}),Object.assign(c.default,c),b.exports=c.default)},93845,(a,b,c)=>{"use strict";function d(){throw Object.defineProperty(Error("`unauthorized()` is experimental and only allowed to be used when `experimental.authInterrupts` is enabled."),"__NEXT_ERROR_CODE",{value:"E411",enumerable:!1,configurable:!0})}Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"unauthorized",{enumerable:!0,get:function(){return d}}),a.r(89798).HTTP_ERROR_FALLBACK_ERROR_CODE,("function"==typeof c.default||"object"==typeof c.default&&null!==c.default)&&void 0===c.default.__esModule&&(Object.defineProperty(c.default,"__esModule",{value:!0}),Object.assign(c.default,c),b.exports=c.default)},73808,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"isPostpone",{enumerable:!0,get:function(){return e}});let d=Symbol.for("react.postpone");function e(a){return"object"==typeof a&&null!==a&&a.$$typeof===d}},1567,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"isNextRouterError",{enumerable:!0,get:function(){return f}});let d=a.r(89798),e=a.r(28859);function f(a){return(0,e.isRedirectError)(a)||(0,d.isHTTPAccessFallbackError)(a)}("function"==typeof c.default||"object"==typeof c.default&&null!==c.default)&&void 0===c.default.__esModule&&(Object.defineProperty(c.default,"__esModule",{value:!0}),Object.assign(c.default,c),b.exports=c.default)},94783,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"unstable_rethrow",{enumerable:!0,get:function(){return function a(b){if((0,g.isNextRouterError)(b)||(0,f.isBailoutToCSRError)(b)||(0,i.isDynamicServerError)(b)||(0,h.isDynamicPostpone)(b)||(0,e.isPostpone)(b)||(0,d.isHangingPromiseRejectionError)(b))throw b;b instanceof Error&&"cause"in b&&a(b.cause)}}});let d=a.r(13091),e=a.r(73808),f=a.r(49640),g=a.r(1567),h=a.r(60384),i=a.r(96556);("function"==typeof c.default||"object"==typeof c.default&&null!==c.default)&&void 0===c.default.__esModule&&(Object.defineProperty(c.default,"__esModule",{value:!0}),Object.assign(c.default,c),b.exports=c.default)},60968,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"unstable_rethrow",{enumerable:!0,get:function(){return d}});let d=a.r(94783).unstable_rethrow;("function"==typeof c.default||"object"==typeof c.default&&null!==c.default)&&void 0===c.default.__esModule&&(Object.defineProperty(c.default,"__esModule",{value:!0}),Object.assign(c.default,c),b.exports=c.default)},73727,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),!function(a,b){for(var c in b)Object.defineProperty(a,c,{enumerable:!0,get:b[c]})}(c,{ReadonlyURLSearchParams:function(){return k},RedirectType:function(){return e.RedirectType},forbidden:function(){return g.forbidden},notFound:function(){return f.notFound},permanentRedirect:function(){return d.permanentRedirect},redirect:function(){return d.redirect},unauthorized:function(){return h.unauthorized},unstable_isUnrecognizedActionError:function(){return l},unstable_rethrow:function(){return i.unstable_rethrow}});let d=a.r(44868),e=a.r(28859),f=a.r(16155),g=a.r(34557),h=a.r(93845),i=a.r(60968);class j extends Error{constructor(){super("Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams")}}class k extends URLSearchParams{append(){throw new j}delete(){throw new j}set(){throw new j}sort(){throw new j}}function l(){throw Object.defineProperty(Error("`unstable_isUnrecognizedActionError` can only be used on the client."),"__NEXT_ERROR_CODE",{value:"E776",enumerable:!1,configurable:!0})}("function"==typeof c.default||"object"==typeof c.default&&null!==c.default)&&void 0===c.default.__esModule&&(Object.defineProperty(c.default,"__esModule",{value:!0}),Object.assign(c.default,c),b.exports=c.default)},70396,a=>{"use strict";a.s([]),a.i(73727)},42782,(a,b,c)=>{},54124,a=>{"use strict";a.s(["default",()=>p,"generateMetadata",()=>o,"revalidate",()=>i]);var b=a.i(7997),c=a.i(97647);a.i(70396);var d=a.i(73727),e=a.i(68803),f=a.i(85349),g=a.i(81341),h=a.i(66518);let i=3600,j={DISPONIVEL:"Disponivel",RESERVADO:"Reservado",VENDIDO:"Vendido",LOCADO:"Locado",INATIVO:"Inativo"},k={campolim:[-23.5229,-47.4693],centro:[-23.5017,-47.4581],eden:[-23.4167,-47.3633],"wanel-ville":[-23.4964,-47.5058],"alem-ponte":[-23.4885,-47.441],aparecidinha:[-23.4395,-47.417],"jardim-paulistano":[-23.5038,-47.4877],"santa-rosalia":[-23.4918,-47.4477]};function l(a){return null==a?"Não informado":a.toLocaleString("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0})}async function m(a){let b=await h.prisma.imovel.findFirst({where:{slugUrl:a,deletadoEm:null,status:{in:["DISPONIVEL","RESERVADO","VENDIDO","LOCADO"]}},select:{id:!0,codigo:!0,titulo:!0,descricao:!0,tipo:!0,finalidade:!0,status:!0,preco:!0,precoCondominio:!0,iptu:!0,bairro:!0,cidade:!0,estado:!0,area:!0,areaUtil:!0,quartos:!0,suites:!0,banheiros:!0,vagas:!0,slugUrl:!0,altTexto:!0,metaTitulo:!0,metaDescricao:!0,fotos:{select:{id:!0,url:!0,destaque:!0},orderBy:[{destaque:"desc"},{ordem:"asc"}]},comodidades:{select:{comodidade:{select:{id:!0,nome:!0,categoria:{select:{id:!0,nome:!0}}}}}}}});return b?{...b,preco:Number(b.preco),precoCondominio:null!=b.precoCondominio?Number(b.precoCondominio):null,iptu:null!=b.iptu?Number(b.iptu):null,area:null!=b.area?Number(b.area):null,areaUtil:null!=b.areaUtil?Number(b.areaUtil):null}:null}async function n(a){return(await h.prisma.imovel.findMany({where:{deletadoEm:null,status:{in:["DISPONIVEL","RESERVADO","VENDIDO","LOCADO"]},tipo:a.tipo,bairro:a.bairro,slugUrl:{not:a.slugUrl}},orderBy:{criadoEm:"desc"},take:4,select:{id:!0,slugUrl:!0,titulo:!0,preco:!0,bairro:!0,cidade:!0,status:!0,fotos:{select:{id:!0,url:!0},orderBy:[{destaque:"desc"},{ordem:"asc"}],take:1}}})).map(a=>({...a,preco:Number(a.preco)}))}async function o({params:a}){let{slug:b}=await a,c=await m(b);if(!c)return{title:"Imóvel não encontrado | Jéssica Campos",robots:{index:!1,follow:!1}};let d=c.metaTitulo??`${c.titulo} | ${c.codigo} | ${f.SITE_CONFIG.brandFull}`,e=c.metaDescricao??`${c.tipo} em ${c.bairro}, ${c.cidade}. Confira fotos, detalhes e fale com a J\xe9ssica.`,g=`${f.SITE_CONFIG.siteUrl}/imoveis/${c.slugUrl}`,h=c.fotos[0]?.url;return{title:d,description:e,alternates:{canonical:g},openGraph:{type:"website",url:g,title:d,description:e,images:h?[{url:h,alt:c.altTexto??c.titulo}]:void 0},twitter:{card:"summary_large_image",title:d,description:e,images:h?[h]:void 0}}}async function p({params:a}){let{slug:h}=await a,i=await m(h);i||(0,d.notFound)();let o=i.comodidades.reduce((a,b)=>{let c=b.comodidade.categoria.nome;return a[c]||(a[c]=[]),a[c].push(b.comodidade.nome),a},{}),p=await n(i),q=g.WHATSAPP_SETTINGS.messageTemplates.property.replace("{propertyCode}",i.codigo).replace("{propertyUrl}",`${f.SITE_CONFIG.siteUrl}/imoveis/${i.slugUrl}`),r=(0,g.buildWhatsAppHref)(q,"lp_imovel"),s={"@context":"https://schema.org","@type":"RealEstateListing",name:i.titulo,description:i.metaDescricao??i.descricao??`${i.tipo} em ${i.bairro}, ${i.cidade}`,url:`${f.SITE_CONFIG.siteUrl}/imoveis/${i.slugUrl}`,image:i.fotos.map(a=>a.url),datePosted:new Date().toISOString(),address:{"@type":"PostalAddress",addressLocality:i.bairro,addressRegion:i.estado,addressCountry:"BR"},offers:{"@type":"Offer",priceCurrency:"BRL",price:i.preco,availability:"DISPONIVEL"===i.status?"https://schema.org/InStock":"https://schema.org/LimitedAvailability"}};return(0,b.jsxs)("main",{className:"imovel-slug-page",children:[(0,b.jsx)(e.SiteHeader,{}),(0,b.jsxs)("section",{className:"imovel-shell",children:[(0,b.jsxs)("p",{className:"breadcrumb",children:[(0,b.jsx)(c.default,{href:"/imoveis",children:"Imóveis"})," / ",i.codigo]}),(0,b.jsxs)("div",{className:"title-row",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("h1",{children:i.titulo}),(0,b.jsxs)("p",{className:"sub",children:[i.bairro,", ",i.cidade," - ",i.estado]})]}),(0,b.jsxs)("div",{className:"title-side",children:[(0,b.jsx)("span",{className:`status status-${i.status.toLowerCase()}`,children:j[i.status]}),(0,b.jsx)("strong",{children:l(i.preco)})]})]}),(0,b.jsx)("div",{className:"gallery-grid",children:i.fotos.length>0?i.fotos.map(a=>(0,b.jsx)("img",{src:a.url,alt:i.altTexto??i.titulo,loading:"lazy"},a.id)):(0,b.jsx)("div",{className:"sem-fotos",children:"Sem fotos publicadas para este imóvel."})}),(0,b.jsxs)("div",{className:"ficha-grid",children:[(0,b.jsxs)("article",{className:"card",children:[(0,b.jsx)("h2",{children:"Resumo"}),(0,b.jsx)("p",{children:i.descricao||"Descrição em atualização."})]}),(0,b.jsxs)("article",{className:"card",children:[(0,b.jsx)("h2",{children:"Características"}),(0,b.jsxs)("ul",{children:[(0,b.jsxs)("li",{children:["Tipo: ",i.tipo]}),(0,b.jsxs)("li",{children:["Finalidade: ",i.finalidade]}),(0,b.jsxs)("li",{children:["Área total: ",i.area?`${i.area} m\xb2`:"Não informada"]}),(0,b.jsxs)("li",{children:["Área útil: ",i.areaUtil?`${i.areaUtil} m\xb2`:"Não informada"]}),(0,b.jsxs)("li",{children:["Quartos: ",i.quartos??"-"]}),(0,b.jsxs)("li",{children:["Suítes: ",i.suites??"-"]}),(0,b.jsxs)("li",{children:["Banheiros: ",i.banheiros??"-"]}),(0,b.jsxs)("li",{children:["Vagas: ",i.vagas??"-"]}),(0,b.jsxs)("li",{children:["Condomínio: ",l(i.precoCondominio)]}),(0,b.jsxs)("li",{children:["IPTU: ",l(i.iptu)]})]})]})]}),(0,b.jsxs)("section",{className:"cta-wrap card","aria-labelledby":"cta-whatsapp",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("h2",{id:"cta-whatsapp",children:"Gostou deste imóvel?"}),(0,b.jsx)("p",{children:"Fale direto com a Jéssica pelo WhatsApp com a referência do imóvel já preenchida."})]}),r?(0,b.jsxs)("a",{className:"whatsapp-cta",href:r,target:"_blank",rel:"noopener noreferrer",children:["Conversar sobre ",i.codigo]}):(0,b.jsx)("p",{className:"sem-dados",children:"WhatsApp ainda não configurado no painel."})]}),(0,b.jsxs)("section",{className:"map-wrap","aria-labelledby":"mapa-bairro",children:[(0,b.jsx)("h2",{id:"mapa-bairro",children:"Localização aproximada por bairro"}),(0,b.jsx)("p",{className:"sem-dados",children:"Mapa por bairro para preservar dados privados do proprietário."}),(0,b.jsx)("div",{className:"map-frame",children:(0,b.jsx)("iframe",{title:`Mapa do bairro ${i.bairro}`,src:function(a){let[b,c]=k[a.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim().replace(/\s+/g,"-")]??[-23.5017,-47.4581],d=[c-.035,b-.035,c+.035,b+.035].join(",");return`https://www.openstreetmap.org/export/embed.html?bbox=${d}&layer=mapnik&marker=${b},${c}`}(i.bairro),loading:"lazy",referrerPolicy:"no-referrer-when-downgrade"})})]}),(0,b.jsxs)("section",{className:"comodidades-wrap",children:[(0,b.jsx)("h2",{children:"Comodidades"}),0===Object.keys(o).length?(0,b.jsx)("p",{className:"sem-dados",children:"Comodidades não informadas."}):(0,b.jsx)("div",{className:"comodidades-grid",children:Object.entries(o).map(([a,c])=>(0,b.jsxs)("article",{className:"card",children:[(0,b.jsx)("h3",{children:a}),(0,b.jsx)("ul",{children:c.map(a=>(0,b.jsx)("li",{children:a},a))})]},a))})]}),(0,b.jsxs)("section",{className:"relacionados-wrap","aria-labelledby":"veja-tambem",children:[(0,b.jsx)("h2",{id:"veja-tambem",children:"Veja também"}),0===p.length?(0,b.jsx)("p",{className:"sem-dados",children:"Sem imóveis relacionados no momento."}):(0,b.jsx)("div",{className:"relacionados-grid",children:p.map(a=>(0,b.jsxs)(c.default,{href:`/imoveis/${a.slugUrl}`,className:"rel-card",children:[(0,b.jsx)("div",{className:"rel-card-img",children:a.fotos[0]?(0,b.jsx)("img",{src:a.fotos[0].url,alt:a.titulo,loading:"lazy"}):(0,b.jsx)("div",{className:"sem-foto",children:"Sem foto"})}),(0,b.jsxs)("div",{className:"rel-card-body",children:[(0,b.jsx)("p",{className:"codigo",children:"DISPONIVEL"!==a.status?j[a.status]:a.cidade}),(0,b.jsx)("h3",{children:a.titulo}),(0,b.jsx)("p",{className:"preco",children:l(a.preco)}),(0,b.jsxs)("p",{className:"local",children:[a.bairro,", ",a.cidade]})]})]},a.id))})]})]}),(0,b.jsx)("script",{type:"application/ld+json",dangerouslySetInnerHTML:{__html:JSON.stringify(s)}}),(0,b.jsx)("style",{children:`
        .imovel-slug-page { min-height: 100vh; background: var(--color-bg); }
        .imovel-shell { width: min(1180px, calc(100% - 32px)); margin: 0 auto; padding: 28px 0 54px; }
        .breadcrumb { font-size: 0.82rem; color: var(--color-text-muted); margin-bottom: 10px; }
        .breadcrumb a { color: var(--color-text-muted); text-decoration: none; }
        .title-row { display: flex; justify-content: space-between; gap: 14px; align-items: flex-start; }
        .sub { color: var(--color-text-muted); margin-top: 5px; }
        .title-side { display: grid; justify-items: end; gap: 8px; }
        .title-side strong { font-size: 1.3rem; color: var(--color-primary); }
        .status {
          border-radius: 999px;
          padding: 4px 10px;
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
        }
        .status-disponivel { background: #dcfce7; color: #166534; }
        .status-reservado { background: #fef3c7; color: #92400e; }
        .status-vendido { background: #dbeafe; color: #1e3a8a; }
        .status-locado { background: #e0e7ff; color: #3730a3; }
        .gallery-grid {
          margin-top: 16px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }
        .gallery-grid img {
          width: 100%;
          aspect-ratio: 4 / 3;
          object-fit: cover;
          border-radius: 10px;
          border: 1px solid var(--color-border);
        }
        .sem-fotos {
          border: 1px dashed var(--color-border);
          border-radius: 10px;
          padding: 20px;
          color: var(--color-text-muted);
          grid-column: 1 / -1;
        }
        .ficha-grid {
          margin-top: 14px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }
        .cta-wrap {
          margin-top: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .whatsapp-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 44px;
          padding: 0 16px;
          border-radius: 10px;
          background: #16a34a;
          color: #fff;
          text-decoration: none;
          font-weight: 700;
          white-space: nowrap;
        }
        .map-wrap { margin-top: 14px; }
        .map-frame {
          margin-top: 8px;
          border: 1px solid var(--color-border);
          border-radius: 12px;
          overflow: hidden;
          background: var(--color-surface);
        }
        .map-frame iframe {
          width: 100%;
          min-height: 320px;
          border: 0;
          display: block;
        }
        .card {
          border: 1px solid var(--color-border);
          border-radius: 12px;
          background: var(--color-surface);
          padding: 14px;
        }
        .card h2, .card h3 { margin-bottom: 8px; }
        .card p { color: var(--color-text-muted); line-height: 1.6; }
        .card ul { margin: 0; padding-left: 18px; display: grid; gap: 4px; color: var(--color-text); }
        .comodidades-wrap { margin-top: 14px; }
        .comodidades-grid { margin-top: 10px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
        .relacionados-wrap { margin-top: 14px; }
        .relacionados-grid {
          margin-top: 10px;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
        }
        .rel-card {
          border: 1px solid var(--color-border);
          border-radius: 12px;
          overflow: hidden;
          background: var(--color-surface);
          text-decoration: none;
          color: inherit;
        }
        .rel-card-img {
          aspect-ratio: 4 / 3;
          background: var(--color-surface-muted);
        }
        .rel-card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .rel-card-body { padding: 10px; }
        .rel-card-body h3 { margin: 3px 0 7px; font-size: 0.95rem; line-height: 1.35; }
        .sem-dados { color: var(--color-text-muted); margin-top: 6px; }

        @media (max-width: 920px) {
          .gallery-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .comodidades-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .relacionados-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }

        @media (max-width: 640px) {
          .imovel-shell { width: min(1180px, calc(100% - 22px)); }
          .title-row { flex-direction: column; }
          .title-side { justify-items: start; }
          .gallery-grid, .ficha-grid, .comodidades-grid, .relacionados-grid { grid-template-columns: 1fr; }
          .cta-wrap { flex-direction: column; align-items: flex-start; }
          .whatsapp-cta { width: 100%; }
        }
      `})]})}}];

//# sourceMappingURL=%5Broot-of-the-server%5D__ef226b3f._.js.map