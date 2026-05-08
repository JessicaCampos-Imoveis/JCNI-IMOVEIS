module.exports=[40711,a=>{"use strict";a.s(["default",()=>k]);var b=a.i(87924),c=a.i(72131),d=a.i(38246),e=a.i(71987);let f={DISPONIVEL:"Disponível",RESERVADO:"Reservado",VENDIDO:"Vendido",LOCADO:"Locado",INATIVO:"Inativo"},g={DISPONIVEL:"badge-disponivel",RESERVADO:"badge-reservado",VENDIDO:"badge-vendido",LOCADO:"badge-locado",INATIVO:"badge-inativo"},h={APARTAMENTO:"Apto",CASA:"Casa",TERRENO:"Terreno",COMERCIAL:"Comercial",COBERTURA:"Cobertura",KITNET:"Kitnet",RURAL:"Rural"};function i(a){return a.toLocaleString("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0})}function j({src:a}){return a}function k(){let[a,k]=(0,c.useState)([]),[l,m]=(0,c.useState)(null),[n,o]=(0,c.useState)(1),[p,q]=(0,c.useState)(""),[r,s]=(0,c.useState)(""),[t,u]=(0,c.useState)(""),[v,w]=(0,c.useState)(!0),[x,y]=(0,c.useState)(null),[z,A]=(0,c.useState)(null),[B,C]=(0,c.useState)(null),D=(0,c.useCallback)(async()=>{w(!0);try{let a=new URLSearchParams({pagina:String(n)});p&&a.set("busca",p),r&&a.set("status",r),t&&a.set("tipo",t);let b=await fetch(`/api/admin/imoveis?${a}`);if(!b.ok)throw Error("Erro ao buscar imóveis");let c=await b.json();k(c.imoveis),m(c.paginacao)}catch(a){console.error(a)}finally{w(!1)}},[n,p,r,t]);async function E(a,b){if(confirm(`Desativar "${b}"?

O im\xf3vel ser\xe1 marcado como Inativo e removido do site p\xfablico.`)){y(a);try{if(!(await fetch(`/api/admin/imoveis/${a}`,{method:"DELETE"})).ok)throw Error("Erro ao excluir");await D()}catch(a){alert("Erro ao desativar imóvel."),console.error(a)}finally{y(null)}}}async function F(){if(B){A(B.id);try{if(!(await fetch(`/api/admin/imoveis/${B.id}?purge=true`,{method:"DELETE"})).ok)throw Error("Erro ao purgar");C(null),await D()}catch(a){alert("Erro ao excluir permanentemente o imóvel."),console.error(a)}finally{A(null)}}}return(0,c.useEffect)(()=>{D()},[D]),(0,b.jsxs)("div",{className:"admin-imoveis-page",children:[(0,b.jsxs)("div",{className:"page-header",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("h1",{className:"page-title",children:"Imóveis"}),l&&(0,b.jsxs)("p",{className:"page-subtitle",children:[l.total," imóvel",1!==l.total?"is":""," cadastrado",1!==l.total?"s":""]})]}),(0,b.jsx)(d.default,{href:"/admin/imoveis/novo",className:"btn-primary",children:"+ Novo Imóvel"})]}),(0,b.jsxs)("div",{className:"filtros-bar",children:[(0,b.jsx)("input",{type:"search",placeholder:"Buscar por título, código ou bairro…",value:p,onChange:a=>{q(a.target.value),o(1)},className:"input-busca"}),(0,b.jsxs)("select",{value:r,onChange:a=>{s(a.target.value),o(1)},className:"select-filtro",children:[(0,b.jsx)("option",{value:"",children:"Todos os status"}),Object.entries(f).map(([a,c])=>(0,b.jsx)("option",{value:a,children:c},a))]}),(0,b.jsxs)("select",{value:t,onChange:a=>{u(a.target.value),o(1)},className:"select-filtro",children:[(0,b.jsx)("option",{value:"",children:"Todos os tipos"}),Object.entries(h).map(([a,c])=>(0,b.jsx)("option",{value:a,children:c},a))]})]}),v?(0,b.jsx)("div",{className:"loading-state",children:"Carregando…"}):0===a.length?(0,b.jsxs)("div",{className:"empty-state",children:[(0,b.jsx)("p",{children:"Nenhum imóvel encontrado."}),(0,b.jsx)(d.default,{href:"/admin/imoveis/novo",className:"btn-primary",children:"Cadastrar primeiro imóvel"})]}):(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("div",{className:"table-wrapper",children:(0,b.jsxs)("table",{className:"imoveis-table",children:[(0,b.jsx)("thead",{children:(0,b.jsxs)("tr",{children:[(0,b.jsx)("th",{children:"Foto"}),(0,b.jsx)("th",{children:"Código"}),(0,b.jsx)("th",{children:"Título / Bairro"}),(0,b.jsx)("th",{children:"Tipo"}),(0,b.jsx)("th",{children:"Preço"}),(0,b.jsx)("th",{children:"Status"}),(0,b.jsx)("th",{children:"Ações"})]})}),(0,b.jsx)("tbody",{children:a.map(a=>(0,b.jsxs)("tr",{children:[(0,b.jsx)("td",{className:"col-foto",children:a.fotos[0]?(0,b.jsx)(e.default,{loader:j,unoptimized:!0,src:a.fotos[0].url,alt:a.titulo,className:"thumb",width:56,height:40}):(0,b.jsx)("div",{className:"thumb-placeholder",children:"◻"})}),(0,b.jsx)("td",{className:"col-codigo",children:a.codigo}),(0,b.jsxs)("td",{className:"col-titulo",children:[(0,b.jsx)("span",{className:"titulo-linha",children:a.titulo}),(0,b.jsxs)("span",{className:"bairro-linha",children:[a.bairro,", ",a.cidade]})]}),(0,b.jsx)("td",{children:h[a.tipo]}),(0,b.jsx)("td",{className:"col-preco",children:i(a.preco)}),(0,b.jsx)("td",{children:(0,b.jsx)("span",{className:`badge ${g[a.status]}`,children:f[a.status]})}),(0,b.jsxs)("td",{className:"col-acoes",children:[(0,b.jsx)(d.default,{href:`/admin/imoveis/${a.id}/editar`,className:"btn-acao-editar",title:"Editar",children:"✏️"}),(0,b.jsx)("a",{href:`/imoveis/${a.slugUrl}`,target:"_blank",rel:"noopener noreferrer",className:"btn-acao-ver",title:"Ver no site",children:"👁"}),(0,b.jsx)("button",{onClick:()=>E(a.id,a.titulo),disabled:x===a.id,className:"btn-acao-excluir",title:"Desativar",children:x===a.id?"…":"🗑"}),(0,b.jsx)("button",{onClick:()=>C({id:a.id,titulo:a.titulo,codigo:a.codigo}),disabled:z===a.id,className:"btn-acao-purge",title:"Excluir permanentemente",children:"☠"})]})]},a.id))})]})}),(0,b.jsx)("div",{className:"imoveis-cards",children:a.map(a=>(0,b.jsxs)("div",{className:"imovel-card",children:[a.fotos[0]&&(0,b.jsx)(e.default,{loader:j,unoptimized:!0,src:a.fotos[0].url,alt:a.titulo,className:"card-foto",width:1200,height:640}),(0,b.jsxs)("div",{className:"card-body",children:[(0,b.jsxs)("div",{className:"card-header-line",children:[(0,b.jsx)("span",{className:"card-codigo",children:a.codigo}),(0,b.jsx)("span",{className:`badge ${g[a.status]}`,children:f[a.status]})]}),(0,b.jsx)("p",{className:"card-titulo",children:a.titulo}),(0,b.jsxs)("p",{className:"card-bairro",children:[a.bairro,", ",a.cidade]}),(0,b.jsx)("p",{className:"card-preco",children:i(a.preco)}),(0,b.jsxs)("div",{className:"card-acoes",children:[(0,b.jsx)(d.default,{href:`/admin/imoveis/${a.id}/editar`,className:"btn-card-editar",children:"Editar"}),(0,b.jsx)("button",{onClick:()=>E(a.id,a.titulo),disabled:x===a.id,className:"btn-card-excluir",children:x===a.id?"Aguarde…":"Desativar"}),(0,b.jsx)("button",{onClick:()=>C({id:a.id,titulo:a.titulo,codigo:a.codigo}),disabled:z===a.id,className:"btn-card-purge",children:"Excluir"})]})]})]},a.id))}),l&&l.totalPaginas>1&&(0,b.jsxs)("div",{className:"paginacao",children:[(0,b.jsx)("button",{onClick:()=>o(a=>a-1),disabled:n<=1,className:"btn-pagina",children:"← Anterior"}),(0,b.jsxs)("span",{className:"pagina-info",children:["Página ",n," de ",l.totalPaginas]}),(0,b.jsx)("button",{onClick:()=>o(a=>a+1),disabled:n>=l.totalPaginas,className:"btn-pagina",children:"Próxima →"})]})]}),B&&(0,b.jsx)("div",{className:"modal-overlay",onClick:a=>{a.target===a.currentTarget&&C(null)},children:(0,b.jsxs)("div",{className:"modal-purge",role:"dialog","aria-modal":"true","aria-labelledby":"modal-purge-title",children:[(0,b.jsx)("div",{className:"modal-purge-icon",children:"☠️"}),(0,b.jsx)("h2",{id:"modal-purge-title",children:"Excluir permanentemente"}),(0,b.jsxs)("div",{className:"modal-purge-aviso",children:[(0,b.jsx)("strong",{children:"Esta ação não pode ser desfeita."}),"O imóvel ",(0,b.jsx)("strong",{children:B.codigo})," — ",(0,b.jsx)("em",{children:B.titulo})," e todas as suas fotos serão excluídos permanentemente do sistema."]}),(0,b.jsxs)("div",{className:"modal-purge-acoes",children:[(0,b.jsx)("button",{onClick:()=>C(null),className:"btn-cancelar-purge",disabled:z===B.id,children:"Cancelar"}),(0,b.jsx)("button",{onClick:F,className:"btn-confirmar-purge",disabled:z===B.id,children:z===B.id?"Excluindo…":"Excluir permanentemente"})]})]})}),(0,b.jsx)("style",{children:`
        .admin-imoveis-page { padding: 1.5rem; max-width: 1200px; margin: 0 auto; }

        .page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
        .page-title { font-size: 1.5rem; font-weight: 700; margin: 0; }
        .page-subtitle { font-size: 0.875rem; color: #6b7280; margin: 0.25rem 0 0; }

        .btn-primary { background: #2563eb; color: #fff; padding: 0.5rem 1.25rem; border-radius: 6px; font-weight: 600; text-decoration: none; font-size: 0.875rem; white-space: nowrap; }
        .btn-primary:hover { background: #1d4ed8; }

        .filtros-bar { display: flex; gap: 0.75rem; margin-bottom: 1.25rem; flex-wrap: wrap; }
        .input-busca { flex: 1; min-width: 200px; padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.875rem; }
        .select-filtro { padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.875rem; background: #fff; }

        .loading-state, .empty-state { text-align: center; padding: 3rem 1rem; color: #6b7280; display: flex; flex-direction: column; align-items: center; gap: 1rem; }

        /* Tabela */
        .table-wrapper { overflow-x: auto; border: 1px solid #e5e7eb; border-radius: 8px; display: none; }
        .imoveis-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
        .imoveis-table th { background: #f9fafb; padding: 0.75rem 1rem; text-align: left; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb; white-space: nowrap; }
        .imoveis-table td { padding: 0.75rem 1rem; border-bottom: 1px solid #f3f4f6; vertical-align: middle; }
        .imoveis-table tr:last-child td { border-bottom: none; }
        .imoveis-table tr:hover td { background: #f9fafb; }

        .thumb { width: 56px; height: 40px; object-fit: cover; border-radius: 4px; }
        .thumb-placeholder { width: 56px; height: 40px; background: #e5e7eb; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #9ca3af; }
        .col-codigo { white-space: nowrap; font-family: monospace; font-size: 0.8rem; color: #6b7280; }
        .col-titulo { min-width: 200px; }
        .titulo-linha { display: block; font-weight: 500; }
        .bairro-linha { display: block; font-size: 0.8rem; color: #6b7280; margin-top: 2px; }
        .col-preco { white-space: nowrap; font-weight: 600; }
        .col-acoes { white-space: nowrap; }

        .btn-acao-editar, .btn-acao-ver, .btn-acao-excluir { background: none; border: none; cursor: pointer; font-size: 1rem; padding: 0.25rem; border-radius: 4px; text-decoration: none; }
        .btn-acao-editar:hover { background: #dbeafe; }
        .btn-acao-ver:hover { background: #dcfce7; }
        .btn-acao-excluir:hover { background: #fee2e2; }
        .btn-acao-excluir:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-acao-purge { background: none; border: none; cursor: pointer; font-size: 1rem; padding: 0.25rem; border-radius: 4px; text-decoration: none; color: #dc2626; }
        .btn-acao-purge:hover { background: #fee2e2; }
        .btn-acao-purge:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Badges */
        .badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
        .badge-disponivel { background: #dcfce7; color: #166534; }
        .badge-reservado { background: #fef9c3; color: #854d0e; }
        .badge-vendido { background: #dbeafe; color: #1e40af; }
        .badge-locado { background: #e0e7ff; color: #3730a3; }
        .badge-inativo { background: #f3f4f6; color: #6b7280; }

        /* Cards mobile */
        .imoveis-cards { display: flex; flex-direction: column; gap: 1rem; }
        .imovel-card { border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; background: #fff; }
        .card-foto { width: 100%; height: 160px; object-fit: cover; }
        .card-body { padding: 0.875rem 1rem; }
        .card-header-line { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; }
        .card-codigo { font-family: monospace; font-size: 0.8rem; color: #6b7280; }
        .card-titulo { font-weight: 600; margin: 0 0 0.25rem; }
        .card-bairro { font-size: 0.875rem; color: #6b7280; margin: 0 0 0.5rem; }
        .card-preco { font-weight: 700; font-size: 1rem; margin: 0 0 0.75rem; }
        .card-acoes { display: flex; gap: 0.5rem; }
        .btn-card-editar { flex: 1; text-align: center; padding: 0.5rem; border-radius: 6px; background: #2563eb; color: #fff; font-weight: 600; text-decoration: none; font-size: 0.875rem; }
        .btn-card-excluir { flex: 1; padding: 0.5rem; border-radius: 6px; background: #fee2e2; color: #dc2626; font-weight: 600; border: none; cursor: pointer; font-size: 0.875rem; }
        .btn-card-excluir:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-card-purge { flex: 1; padding: 0.5rem; border-radius: 6px; background: #dc2626; color: #fff; font-weight: 600; border: none; cursor: pointer; font-size: 0.875rem; }
        .btn-card-purge:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Modal Purge */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; }
        .modal-purge { background: #fff; border-radius: 12px; padding: 1.5rem; max-width: 480px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
        .modal-purge-icon { font-size: 2.5rem; text-align: center; margin-bottom: 0.75rem; }
        .modal-purge h2 { font-size: 1.125rem; font-weight: 700; text-align: center; margin: 0 0 0.75rem; color: #dc2626; }
        .modal-purge-aviso { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 0.875rem 1rem; font-size: 0.875rem; color: #7f1d1d; margin-bottom: 1.25rem; line-height: 1.5; }
        .modal-purge-aviso strong { display: block; margin-bottom: 0.25rem; }
        .modal-purge-acoes { display: flex; gap: 0.75rem; justify-content: flex-end; }
        .btn-cancelar-purge { padding: 0.5rem 1.25rem; border: 1px solid #d1d5db; border-radius: 6px; background: #fff; font-weight: 600; cursor: pointer; font-size: 0.875rem; }
        .btn-cancelar-purge:hover { background: #f3f4f6; }
        .btn-confirmar-purge { padding: 0.5rem 1.25rem; border-radius: 6px; background: #dc2626; color: #fff; font-weight: 600; border: none; cursor: pointer; font-size: 0.875rem; }
        .btn-confirmar-purge:hover:not(:disabled) { background: #b91c1c; }
        .btn-confirmar-purge:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Pagina\xe7\xe3o */
        .paginacao { display: flex; align-items: center; justify-content: center; gap: 1rem; margin-top: 1.5rem; }
        .btn-pagina { padding: 0.5rem 1rem; border: 1px solid #d1d5db; border-radius: 6px; background: #fff; cursor: pointer; font-size: 0.875rem; }
        .btn-pagina:hover:not(:disabled) { background: #f3f4f6; }
        .btn-pagina:disabled { opacity: 0.4; cursor: not-allowed; }
        .pagina-info { font-size: 0.875rem; color: #6b7280; }

        /* Breakpoints */
        @media (min-width: 768px) {
          .table-wrapper { display: block; }
          .imoveis-cards { display: none; }
        }

        @media (max-width: 640px) {
          .admin-imoveis-page { padding: 1rem; }
          .page-title { font-size: 1.3rem; }
          .btn-primary { width: 100%; text-align: center; }
          .filtros-bar { flex-direction: column; }
          .input-busca { min-width: 0; width: 100%; }
          .select-filtro { width: 100%; }
          .card-acoes { flex-wrap: wrap; }
          .btn-card-editar,
          .btn-card-excluir,
          .btn-card-purge { min-width: calc(50% - 0.25rem); }
          .modal-purge-acoes { flex-direction: column; }
          .btn-cancelar-purge,
          .btn-confirmar-purge { width: 100%; }
        }
      `})]})}}];

//# sourceMappingURL=src_app_admin_imoveis_page_tsx_5f67f27b._.js.map