# Botão "Ver ficha" após registo — cobertura sistema-inteiro

## Objectivo
Depois de submeter qualquer formulário de registo de entidade ou bem (agricultor, cooperativa, escola de campo, agente económico, infraestrutura, operador florestal, licença, permissão de transporte, viveiro, mecanização, POS, lote de café, programa INCER, armazém, lote laboratorial, etc.), o utilizador continua na listagem/formulário mas recebe um **toast persistente com botão "Ver ficha"** que abre a página dedicada do novo registo.

## Padrão único e reutilizável

### 1. Helper central
Novo módulo `src/lib/toastWithView.ts`:

```ts
toastRegistered({
  entity: "Agente económico",     // rótulo humano
  name: "ACME, Lda",              // identificador visível
  viewPath: `/incer/agentes/${id}`,
})
```

- Usa `sonner`, `duration: 10_000`, `action: { label: "Ver ficha", onClick: () => navigate(viewPath) }`.
- Devolve também um `openView()` caso o chamador queira abrir programaticamente.
- Hook complementar `useToastRegistered()` que injecta o `navigate` de `react-router-dom` para evitar boilerplate.

### 2. Mapa canónico de rotas de ficha
`src/lib/entityRoutes.ts` centraliza `entityDetailPath(entity, id)` para os tipos suportados. Facilita evoluções (mudança de URL num único ficheiro) e permite reutilizar noutros contextos (listagens, notificações, auditoria).

## Páginas de ficha (dedicadas)

Reutilizar as que já existem; criar apenas as em falta com layout consistente baseado num novo componente partilhado `EntityDetailShell` (`src/components/entity/EntityDetailShell.tsx`) que fornece cabeçalho, breadcrumb, blocos de metadados, tabs de secções e botões (editar, imprimir, voltar).

**Já existem** (integrar apenas o toast):
- Agricultores, cooperativas, escolas de campo, cartões, parcelas, campanhas, seguros, dossiês de crédito.
- Certificados INCER, notas de honorários, actas.
- Operadores florestais, licenças, permissões de transporte, viveiros, lotes de café, exportação/EUDR.

**A criar (ficha mínima com dados actuais)**:
- Agentes económicos INCER — `/incer/agentes/:id`
- Infraestruturas INCER (armazém/silo) — `/incer/infraestruturas/:id`
- Programas INCER — `/incer/programas/:id`
- Assistência técnica — `/incer/assistencia/:id`
- Distribuição de insumos — `/incer/insumos/:id`
- Produção de grãos — `/incer/producao/:id`
- Inspecções — `/incer/inspecoes/:id`
- Amostras/análises laboratoriais — `/incer/laboratorio/amostras/:id` e `/analises/:id`
- Entradas/saídas de armazém — `/incer/armazem/entradas/:id` e `/saidas/:id`
- Exportações/importações de grãos — `/incer/comercio/exportacoes/:id` e `/importacoes/:id`
- Parcerias — `/incer/parcerias/:id`
- Ocorrências fitossanitárias/climáticas — reutilizar dialog existente como página `/ocorrencias/:tipo/:id`
- Infraestruturas agrícolas / mercado — `/infraestruturas/:id`
- Centros de mecanização — `/mecanizacao/centros/:id`
- Ordens de serviço — `/mecanizacao/servicos/:id`
- Produtos POS — `/pos/produtos/:id`

Todas seguem `EntityDetailShell`, mostram os campos do registo em cartões agrupados, com placeholder "Ainda sem hist\u00f3rico" para tabs futuras.

## Integração nos formulários de registo

Percorrer todos os hooks/mutations `useCreate*` e páginas com submissão inline:

1. Após `mutateAsync`, receber o `id` do novo registo.
2. Chamar `toastRegistered({ entity, name, viewPath: entityDetailPath("<tipo>", id) })`.
3. Manter comportamento actual (fechar dialog, invalidar queries).

Módulos cobertos: Farmers, Cooperativas, Escolas, Cartões, Parcelas, Campanhas, Seguros, Crédito, INCER completo, Florestal completo, Mecanização, POS, Infraestruturas, Ocorrências, Programas de incentivos, Dossiês de dados, Exportações EUDR.

## Rotas
Registar todas as novas rotas em `src/App.tsx` protegidas por `ProtectedRoute` com os mesmos `requiredRoles` da listagem correspondente. Não altera sidebar.

## Fora de âmbito
- Não altero lógica de negócio, RLS ou triggers.
- Não crio tabs/histórico complexos nas novas fichas — apenas leitura dos campos existentes.
- Não mexo em fluxos públicos de verificação QR.

## Detalhes técnicos
- Sonner já está montado globalmente; nenhuma dependência nova.
- `EntityDetailShell` usa `QueryState` para loading/error/empty (padrão do projecto).
- Fichas novas usam hooks `useX(id)` existentes; onde não há hook singular, adiciono um `useEntityById(id)` fino sobre o hook de listagem em cache + fallback a `supabase.from(...).eq('id', id).maybeSingle()`.
- Mensagens em português; sem hardcode de cores (tokens semânticos).
- Testes: adiciono um teste de integração para `toastRegistered` (renderiza toast, clica acção, verifica navegação) e um smoke test do `EntityDetailShell`.

## Ordem de execução
1. Helper `toastWithView` + `entityRoutes` + `EntityDetailShell`.
2. Rotas e páginas de ficha em falta (INCER primeiro — contexto actual do utilizador — depois restantes).
3. Integrar toast nos formulários (INCER → Florestal → Farmers/Coop → Mecanização/POS → resto).
4. Testes e verificação visual em `/incer/agentes` e `/florestal/operadores`.
