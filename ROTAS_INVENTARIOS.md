s# Rotas da API — Ecrã de Inventários (`/idf/inventories`)

Endpoints consumidos pelo frontend na listagem, detalhe e registo de árvores de inventários florestais.

## Diretos (`src/modules/idf/api/inventories.ts`)

| Ação na tela | Método | Endpoint |
|---|---|---|
| Listar inventários | GET | `/api/idf/forest-inventories` |
| Ver inventário (drawer / `/idf/inventories/:id`) | GET | `/api/idf/forest-inventories/{id}` |
| Criar inventário | POST | `/api/idf/forest-inventories` |
| Adicionar árvore | POST | `/api/idf/forest-inventories/{inventoryId}/trees` |
| Iniciar levantamento | POST | `/api/idf/forest-inventories/{id}/begin-survey` |
| Submeter | POST | `/api/idf/forest-inventories/{id}/submit` |
| Colocar em análise técnica | POST | `/api/idf/forest-inventories/{id}/begin-technical-review` |
| Validar | POST | `/api/idf/forest-inventories/{id}/validate` |
| Rejeitar | POST | `/api/idf/forest-inventories/{id}/reject` |

## Indiretos (pickers e labels usados dentro desta tela)

| Uso | Método | Endpoint |
|---|---|---|
| Selector "Concessão" (novo inventário) | GET | `/api/idf/concessions?Status=Active&PageSize=200` |
| Nome da concessão junto ao inventário (`EntityLabel` / `RelatedEntityCard`) | GET | `/api/idf/concessions/{id}` |
| Limite da concessão no mapa (`TreeForm`) | GET | `/api/idf/concessions/{id}` (mesmo endpoint acima) |
| Selector "Espécie" (registar árvore) | GET | `/api/idf/admin/forest-species?PageSize=500` |
| Nome da espécie em cada árvore listada (`EntityLabel kind="species"`) | GET | `/api/idf/admin/forest-species?Code={code}&PageSize=1` (uma chamada por árvore distinta) |

> `GET /api/idf/concessions/{concessionId}/inventories/{inventoryId}/trees` também existe em `inventories.ts`
> (`listInventoryTrees`) mas **não** é usado neste ecrã — é usado no ecrã de Planos de Maneio.

## Pedido à equipa de backend

Remover a exigência de autenticação obrigatória nas rotas acima usadas por este ecrã.
