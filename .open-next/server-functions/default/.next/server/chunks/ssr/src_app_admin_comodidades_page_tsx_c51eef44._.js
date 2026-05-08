module.exports=[54315,a=>{"use strict";a.s(["default",()=>e]);var b=a.i(87924),c=a.i(72131),d=a.i(38246);function e(){let[a,e]=(0,c.useState)([]),[f,g]=(0,c.useState)(!0),[h,i]=(0,c.useState)(""),[j,k]=(0,c.useState)(""),[l,m]=(0,c.useState)(""),[n,o]=(0,c.useState)(""),[p,q]=(0,c.useState)(""),[r,s]=(0,c.useState)(!1),[t,u]=(0,c.useState)(!1),v=(0,c.useCallback)(async()=>{g(!0),i("");try{let a=await fetch("/api/admin/comodidades/categorias");if(!a.ok)throw Error("Erro ao carregar comodidades");let b=await a.json();e(b),b.length>0&&!p&&q(b[0].id)}catch(a){i(a instanceof Error?a.message:"Erro ao carregar comodidades")}finally{g(!1)}},[p]);async function w(){let a=l.trim();if(a){s(!0);try{let b=await fetch("/api/admin/comodidades/categorias",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({nome:a})});if(!b.ok){let a=await b.json().catch(()=>({}));throw Error(a.error??"Erro ao criar categoria")}m(""),await v()}catch(a){alert(a instanceof Error?a.message:"Erro ao criar categoria")}finally{s(!1)}}}async function x(a){let b=prompt("Novo nome da categoria:",a.nome);if(!b||b.trim()===a.nome)return;let c=await fetch(`/api/admin/comodidades/categorias/${a.id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({nome:b.trim()})});if(!c.ok)return void alert((await c.json().catch(()=>({}))).error??"Erro ao atualizar categoria");await v()}async function y(a){if(!confirm(`Excluir categoria "${a.nome}"?`))return;let b=await fetch(`/api/admin/comodidades/categorias/${a.id}`,{method:"DELETE"});if(!b.ok)return void alert((await b.json().catch(()=>({}))).error??"Erro ao excluir categoria");await v()}async function z(){let a=n.trim();if(a&&p){u(!0);try{let b=await fetch("/api/admin/comodidades/itens",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({nome:a,categoriaId:p})});if(!b.ok){let a=await b.json().catch(()=>({}));throw Error(a.error??"Erro ao criar item")}o(""),await v()}catch(a){alert(a instanceof Error?a.message:"Erro ao criar item")}finally{u(!1)}}}async function A(a){let b=prompt("Novo nome do item:",a.nome);if(!b||b.trim()===a.nome)return;let c=await fetch(`/api/admin/comodidades/itens/${a.id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({nome:b.trim()})});if(!c.ok)return void alert((await c.json().catch(()=>({}))).error??"Erro ao atualizar item");await v()}async function B(a){if(!confirm(`Excluir item "${a.nome}"?`))return;let b=await fetch(`/api/admin/comodidades/itens/${a.id}`,{method:"DELETE"});if(!b.ok)return void alert((await b.json().catch(()=>({}))).error??"Erro ao excluir item");await v()}(0,c.useEffect)(()=>{v()},[v]);let C=j.trim().toLowerCase(),D=a.map(a=>({id:a.id,nome:a.nome,total:a.itens.length})),E=0===C.length?[]:a.flatMap(a=>a.itens.filter(a=>a.nome.toLowerCase().includes(C)).map(b=>({item:b,categoria:a})));return(0,b.jsxs)("div",{className:"admin-comodidades-page",children:[(0,b.jsx)("div",{className:"header-shell",children:(0,b.jsxs)("div",{children:[(0,b.jsx)(d.default,{href:"/admin",className:"breadcrumb",children:"← Dashboard"}),(0,b.jsx)("h1",{children:"Comodidades"}),(0,b.jsx)("p",{children:"Gerencie categorias e itens para vincular nos imóveis."})]})}),(0,b.jsxs)("section",{className:"top-controls","aria-label":"Busca e cadastro rápido",children:[(0,b.jsxs)("div",{className:"busca-wrap",children:[(0,b.jsx)("label",{htmlFor:"busca-comodidade",children:"Buscar comodidade ou categoria"}),(0,b.jsx)("input",{id:"busca-comodidade",value:j,onChange:a=>k(a.target.value),placeholder:"Buscar comodidade...",className:"input"})]}),(0,b.jsxs)("div",{className:"cadastro-rapido",children:[(0,b.jsxs)("div",{className:"cadastro-item",children:[(0,b.jsx)("label",{htmlFor:"nova-categoria",children:"Nova categoria"}),(0,b.jsxs)("div",{className:"linha-inline",children:[(0,b.jsx)("input",{id:"nova-categoria",value:l,onChange:a=>m(a.target.value),placeholder:"Nome da categoria",className:"input"}),(0,b.jsx)("button",{onClick:w,className:"btn-primary",disabled:r,children:r?"Salvando...":"Adicionar"})]})]}),(0,b.jsxs)("div",{className:"cadastro-item grow",children:[(0,b.jsx)("label",{htmlFor:"novo-item",children:"Nova comodidade"}),(0,b.jsxs)("div",{className:"linha-inline linha-item",children:[(0,b.jsx)("input",{id:"novo-item",value:n,onChange:a=>o(a.target.value),placeholder:"Nome da comodidade",className:"input"}),(0,b.jsx)("select",{value:p,onChange:a=>q(a.target.value),className:"input",children:a.map(a=>(0,b.jsx)("option",{value:a.id,children:a.nome},a.id))}),(0,b.jsx)("button",{onClick:z,className:"btn-primary",disabled:t||0===a.length,children:t?"Salvando...":"Adicionar"})]})]})]})]}),f&&(0,b.jsx)("p",{className:"estado",children:"Carregando..."}),h&&(0,b.jsx)("p",{className:"erro",children:h}),!f&&0===a.length&&(0,b.jsx)("p",{className:"estado",children:"Nenhuma categoria cadastrada."}),!f&&a.length>0&&(0,b.jsx)("section",{className:"resumo-categorias","aria-label":"Resumo por categoria",children:D.map(a=>(0,b.jsxs)("div",{className:"resumo-chip",children:[(0,b.jsx)("span",{children:a.nome}),(0,b.jsx)("strong",{children:a.total})]},a.id))}),!f&&a.length>0&&(0,b.jsx)("div",{className:"categorias-lista","aria-live":"polite",children:C?(0,b.jsxs)("section",{className:"categoria-card busca-card",children:[(0,b.jsxs)("div",{className:"categoria-header busca-header",children:[(0,b.jsxs)("h3",{children:['Resultados para "',j,'"']}),(0,b.jsxs)("span",{children:[E.length," encontrado(s)"]})]}),0===E.length?(0,b.jsx)("p",{className:"sem-itens",children:"Nenhuma comodidade encontrada."}):(0,b.jsx)("ul",{className:"itens-lista compacta",children:E.map(({item:a,categoria:c})=>(0,b.jsxs)("li",{className:"item-linha slim",children:[(0,b.jsxs)("div",{className:"item-main",children:[(0,b.jsx)("span",{className:"item-name",children:a.nome}),(0,b.jsx)("span",{className:"item-categoria",children:c.nome})]}),(0,b.jsxs)("details",{className:"acoes-menu",children:[(0,b.jsx)("summary",{"aria-label":`A\xe7\xf5es para ${a.nome}`,children:"⋮"}),(0,b.jsxs)("div",{className:"menu-popover",children:[(0,b.jsx)("button",{onClick:()=>A(a),children:"Editar"}),(0,b.jsx)("button",{className:"danger",onClick:()=>B(a),children:"Excluir"})]})]})]},`${c.id}-${a.id}`))})]}):a.map(a=>(0,b.jsxs)("details",{className:"categoria-card accordion",children:[(0,b.jsxs)("summary",{className:"categoria-summary",children:[(0,b.jsxs)("div",{className:"summary-main",children:[(0,b.jsx)("span",{className:"summary-arrow","aria-hidden":"true",children:"▸"}),(0,b.jsx)("h3",{children:a.nome}),(0,b.jsxs)("span",{className:"contador",children:[a.itens.length," itens"]})]}),(0,b.jsx)("div",{className:"summary-actions",onClick:a=>a.preventDefault(),children:(0,b.jsxs)("details",{className:"acoes-menu categoria-menu",children:[(0,b.jsx)("summary",{"aria-label":`A\xe7\xf5es da categoria ${a.nome}`,children:"⋮"}),(0,b.jsxs)("div",{className:"menu-popover",children:[(0,b.jsx)("button",{onClick:()=>x(a),children:"Editar categoria"}),(0,b.jsx)("button",{className:"danger",onClick:()=>y(a),children:"Excluir categoria"})]})]})})]}),0===a.itens.length?(0,b.jsx)("p",{className:"sem-itens",children:"Sem itens nesta categoria."}):(0,b.jsx)("ul",{className:"itens-lista compacta",children:a.itens.map(a=>(0,b.jsxs)("li",{className:"item-linha slim",children:[(0,b.jsx)("span",{className:"item-name",children:a.nome}),(0,b.jsxs)("details",{className:"acoes-menu",children:[(0,b.jsx)("summary",{"aria-label":`A\xe7\xf5es para ${a.nome}`,children:"⋮"}),(0,b.jsxs)("div",{className:"menu-popover",children:[(0,b.jsx)("button",{onClick:()=>A(a),children:"Editar"}),(0,b.jsx)("button",{className:"danger",onClick:()=>B(a),children:"Excluir"})]})]})]},a.id))})]},a.id))}),(0,b.jsx)("style",{children:`
        .admin-comodidades-page { padding: 1.5rem; max-width: 1160px; margin: 0 auto; }
        .header-shell { margin-bottom: 1rem; }
        .breadcrumb { font-size: 0.81rem; color: #6b7280; text-decoration: none; display: inline-block; margin-bottom: 0.45rem; }
        .breadcrumb:hover { color: #374151; }
        h1 { margin: 0; font-size: 1.72rem; color: #1f2937; }
        .header-shell p { margin: 0.3rem 0 0; color: #6b7280; font-size: 0.9rem; }

        .top-controls {
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          background: #fff;
          padding: 0.95rem;
          display: grid;
          gap: 0.8rem;
          margin-bottom: 0.9rem;
        }
        .busca-wrap,
        .cadastro-item { display: grid; gap: 0.32rem; }
        .busca-wrap label,
        .cadastro-item label { font-size: 0.76rem; color: #6b7280; font-weight: 600; }
        .cadastro-rapido { display: grid; gap: 0.7rem; }
        .linha-inline { display: flex; align-items: center; gap: 0.5rem; }
        .linha-item { flex-wrap: wrap; }
        .grow { min-width: 0; }
        .input {
          min-height: 38px;
          padding: 0 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.88rem;
          background: #fff;
          color: #111827;
          min-width: 0;
          flex: 1;
        }
        .btn-primary {
          min-height: 38px;
          border: none;
          border-radius: 8px;
          background: #2563eb;
          color: #fff;
          font-size: 0.84rem;
          font-weight: 600;
          padding: 0 0.9rem;
          cursor: pointer;
          white-space: nowrap;
        }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

        .resumo-categorias { display: flex; flex-wrap: wrap; gap: 0.45rem; margin-bottom: 0.75rem; }
        .resumo-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.42rem;
          border: 1px solid #e5e7eb;
          border-radius: 999px;
          padding: 0.35rem 0.62rem;
          background: #f9fafb;
          font-size: 0.77rem;
          color: #4b5563;
        }
        .resumo-chip strong {
          display: inline-flex;
          width: 1.25rem;
          height: 1.25rem;
          border-radius: 999px;
          align-items: center;
          justify-content: center;
          background: #dbeafe;
          color: #1e40af;
          font-size: 0.72rem;
        }

        .estado { color: #6b7280; font-size: 0.9rem; margin-top: 0.8rem; }
        .erro {
          color: #b91c1c;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 0.6rem 0.75rem;
          margin-top: 0.8rem;
          font-size: 0.86rem;
        }

        .categorias-lista { display: grid; gap: 0.6rem; }
        .categoria-card {
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          background: #fff;
          overflow: hidden;
        }
        .busca-card { padding: 0.8rem 0.85rem; }
        .busca-header { padding-bottom: 0.5rem; border-bottom: 1px solid #f1f5f9; margin-bottom: 0.55rem; }

        .accordion > summary {
          list-style: none;
          cursor: pointer;
        }
        .accordion > summary::-webkit-details-marker { display: none; }
        .categoria-summary {
          padding: 0.78rem 0.85rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.65rem;
        }
        .summary-main { display: inline-flex; align-items: center; gap: 0.5rem; min-width: 0; }
        .summary-main h3 {
          margin: 0;
          font-size: 0.96rem;
          color: #1f2937;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .summary-arrow { color: #6b7280; font-size: 0.7rem; transition: transform 0.15s ease; }
        .accordion[open] .summary-arrow { transform: rotate(90deg); }
        .contador {
          font-size: 0.77rem;
          color: #4b5563;
          background: #f3f4f6;
          border-radius: 999px;
          padding: 0.22rem 0.45rem;
        }

        .itens-lista { list-style: none; margin: 0; padding: 0; }
        .itens-lista.compacta { border-top: 1px solid #f1f5f9; }
        .item-linha {
          padding: 0.55rem 0.85rem;
          border-top: 1px solid #f8fafc;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }
        .item-linha:first-child { border-top: none; }
        .item-linha.slim { min-height: 38px; }
        .item-main { display: grid; gap: 0.15rem; }
        .item-name { color: #111827; font-size: 0.88rem; }
        .item-categoria { color: #6b7280; font-size: 0.73rem; }
        .sem-itens { color: #9ca3af; margin: 0; padding: 0.75rem 0.85rem; font-size: 0.85rem; }

        .acoes-menu {
          position: relative;
        }
        .acoes-menu > summary {
          list-style: none;
          cursor: pointer;
          color: #6b7280;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          width: 30px;
          height: 30px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 0.92rem;
          user-select: none;
          background: #fff;
        }
        .acoes-menu > summary::-webkit-details-marker { display: none; }
        .menu-popover {
          position: absolute;
          top: 34px;
          right: 0;
          z-index: 10;
          min-width: 140px;
          display: grid;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          box-shadow: 0 12px 28px rgba(17, 24, 39, 0.12);
          overflow: hidden;
        }
        .menu-popover button {
          border: none;
          background: #fff;
          color: #111827;
          text-align: left;
          padding: 0.55rem 0.7rem;
          font-size: 0.82rem;
          cursor: pointer;
        }
        .menu-popover button:hover { background: #f9fafb; }
        .menu-popover button.danger { color: #b91c1c; }
        .categoria-menu .menu-popover { min-width: 180px; }

        @media (min-width: 940px) {
          .cadastro-rapido {
            grid-template-columns: 1fr 1.6fr;
            align-items: end;
          }
        }

        @media (max-width: 640px) {
          .admin-comodidades-page { padding: 1rem; }
          h1 { font-size: 1.42rem; }
          .linha-inline { flex-direction: column; align-items: stretch; }
          .btn-primary { width: 100%; }
          .input { width: 100%; }
          .categoria-summary { padding: 0.72rem 0.72rem; }
          .item-linha { padding: 0.5rem 0.72rem; }
        }
      `})]})}}];

//# sourceMappingURL=src_app_admin_comodidades_page_tsx_c51eef44._.js.map