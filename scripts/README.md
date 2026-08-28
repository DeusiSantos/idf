# Scripts utilitários

## `sync_admin_divisions.py`

Sincroniza províncias, municípios e comunas (DPA 2024) na base de dados.

- Idempotente — usa `UPSERT` por `code`.
- Re-executável — pode correr quantas vezes for necessário.
- Limpa placeholders `N_A-*` em comunas, renomeando-as para `"{Município} (Sede)"`.

### Uso

```bash
# Aplicar (requer PGHOST/PGUSER/PGPASSWORD/PGDATABASE)
python3 scripts/sync_admin_divisions.py

# Apenas imprimir o SQL gerado
python3 scripts/sync_admin_divisions.py --dry-run

# Usar um ficheiro alternativo
python3 scripts/sync_admin_divisions.py --file caminho/para/dpa.xlsx
```

Fonte oficial: `scripts/data/admin_divisions_2024.xlsx` (folha `Planilha1`,
formato XLSForm cascade).

## `test_geo_integrity.py`

Bateria de verificações que confirma a integridade das relações
**província → município → comuna** após cada migração.

Verifica totais oficiais (21/325/541), órfãos, códigos duplicados,
códigos em falta e placeholders `N_A`/`N/A`.

### Uso

```bash
# Requer PGHOST/PGUSER/PGPASSWORD/PGDATABASE
python3 scripts/test_geo_integrity.py
```

Sai com código `0` quando todas as verificações passam e `1` em caso de
violações — pronto para integrar em pipelines de CI.

As mesmas regras estão cobertas em
`src/lib/__tests__/geoConsistency.test.ts`, que pode ser executado offline
(`bunx vitest run src/lib/__tests__/geoConsistency.test.ts`) para validar o
contrato do RPC `geo_consistency_report`.