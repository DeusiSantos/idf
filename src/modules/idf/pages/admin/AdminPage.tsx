import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FileText, Trash2, Trees, UserCheck, Users, UserX } from "lucide-react";
import { EntityPicker } from "@/components/idf/EntityPicker";
import { PageHeader } from "@/components/idf/PageHeader";
import { ResourceWorkspace } from "@/components/idf/ResourceWorkspace";
import { StatusBadge } from "@/components/idf/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  createDocumentType,
  createForestSpecies,
  createUserProfile,
  deleteDocumentType,
  deleteForestSpecies,
  deleteUserProfile,
  disableUserProfile,
  enableUserProfile,
  getUsersTotalByRole,
  listDocumentTypes,
  listForestSpecies,
  listUserProfiles,
  updateDocumentType,
  updateForestSpecies,
  updateUserProfile,
} from "@/modules/idf/api/admin";
import { loadRoles } from "@/modules/idf/api/pickers";
import { SERVICE } from "@/modules/idf/config/modules";
import { fieldError, toProblem } from "@/modules/idf/hooks/useProblem";
import { useToast } from "@/hooks/use-toast";
import type {
  CreateDocumentTypeRequest,
  CreateForestSpeciesRequest,
  CreateUserProfileRequest,
  DocumentTypeDto,
  ForestSpeciesDto,
  GenderType,
  UserProfileDto,
} from "@/modules/idf/types";

const SpeciesWorkspace = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return (
    <ResourceWorkspace<ForestSpeciesDto, CreateForestSpeciesRequest>
      service={SERVICE.ADMIN}
      title="Espécies Florestais"
      description="Catálogo de espécies usado nos inventários, abates e toras."
      crumbs={[{ label: "Transversal" }, { label: "Administração" }, { label: "Espécies" }]}
      queryKey="admin-species"
      searchPlaceholder="Pesquisar por código ou nome comum"
      emptyMessage="Sem espécies registadas"
      statuses={["Active", "Inactive"]}
      stats={[
        { key: "total", label: "Total", status: "all", icon: Trees },
        { key: "active", label: "Activas", status: "Active", icon: Trees },
        { key: "inactive", label: "Inactivas", status: "Inactive", icon: Trees },
      ]}
      fetchPage={({ page, search, status }) =>
        listForestSpecies({
          page,
          pageSize: 10,
          commonName: search,
          isActive: status === "all" ? undefined : status === "Active",
        })
      }
      getStatus={(item) => (item.isActive ? "Active" : "Inactive")}
      getTitle={(item) => item.commonName}
      columns={[
        { key: "code", header: "Código", render: (item) => <span className="font-medium">{item.code}</span> },
        { key: "common", header: "Nome comum", render: (item) => item.commonName },
        { key: "scientific", header: "Nome científico", render: (item) => <em>{item.scientificName}</em> },
      ]}
      create={{
        label: "Nova espécie",
        dialogTitle: "Registar espécie florestal",
        initial: () => ({ code: "", scientificName: "", commonName: "" }),
        submit: createForestSpecies,
        render: ({ value, setValue, errors }) => (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sp-code">Código</Label>
              <Input
                id="sp-code"
                value={value.code}
                placeholder="MOG"
                onChange={(e) => setValue((prev) => ({ ...prev, code: e.target.value }))}
              />
              {fieldError(errors, "code") && <p className="text-sm text-destructive">{fieldError(errors, "code")}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="sp-common">Nome comum</Label>
              <Input
                id="sp-common"
                value={value.commonName}
                placeholder="Mogno"
                onChange={(e) => setValue((prev) => ({ ...prev, commonName: e.target.value }))}
              />
              {fieldError(errors, "commonName") && (
                <p className="text-sm text-destructive">{fieldError(errors, "commonName")}</p>
              )}
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="sp-scientific">Nome científico</Label>
              <Input
                id="sp-scientific"
                value={value.scientificName}
                placeholder="Swietenia macrophylla"
                onChange={(e) => setValue((prev) => ({ ...prev, scientificName: e.target.value }))}
              />
              {fieldError(errors, "scientificName") && (
                <p className="text-sm text-destructive">{fieldError(errors, "scientificName")}</p>
              )}
            </div>
          </div>
        ),
      }}
      detail={(item, { refresh, close }) => (
        <SpeciesEditForm
          species={item}
          onSaved={() => {
            refresh();
            toast({ title: "Espécie actualizada" });
          }}
          onDeleted={() => {
            queryClient.invalidateQueries({ queryKey: ["idf", "admin-species"] });
            toast({ title: "Espécie eliminada" });
            close();
          }}
        />
      )}
    />
  );
};

const SpeciesEditForm = ({
  species,
  onSaved,
  onDeleted,
}: {
  species: ForestSpeciesDto;
  onSaved: () => void;
  onDeleted: () => void;
}) => {
  const { toast } = useToast();
  const [commonName, setCommonName] = useState(species.commonName);
  const [scientificName, setScientificName] = useState(species.scientificName);
  const [isActive, setIsActive] = useState(species.isActive);

  const save = useMutation({
    mutationFn: () => updateForestSpecies(species.id, { commonName, scientificName, isActive }),
    onSuccess: onSaved,
    onError: (error) => toast({ variant: "destructive", title: "Não foi possível guardar", description: toProblem(error).detail }),
  });

  const remove = useMutation({
    mutationFn: () => deleteForestSpecies(species.id),
    onSuccess: onDeleted,
    onError: (error) => toast({ variant: "destructive", title: "Não foi possível eliminar", description: toProblem(error).detail }),
  });

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>Código</Label>
        <Input value={species.code} readOnly disabled />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-common">Nome comum</Label>
        <Input id="edit-common" value={commonName} onChange={(e) => setCommonName(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-scientific">Nome científico</Label>
        <Input id="edit-scientific" value={scientificName} onChange={(e) => setScientificName(e.target.value)} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <Checkbox checked={isActive} onCheckedChange={(checked) => setIsActive(!!checked)} />
        Espécie activa (disponível para selecção)
      </label>

      <Separator />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button disabled={save.isPending} onClick={() => save.mutate()}>
          Guardar alterações
        </Button>
        <Button variant="destructive" size="sm" disabled={remove.isPending} onClick={() => remove.mutate()}>
          <Trash2 className="mr-2 h-4 w-4" />
          Eliminar
        </Button>
      </div>
    </div>
  );
};

const DocumentTypesWorkspace = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return (
    <ResourceWorkspace<DocumentTypeDto, CreateDocumentTypeRequest>
      service={SERVICE.ADMIN}
      title="Tipos de Documento"
      description="Tipos de documento aceites nos registos de operadores e outros processos."
      crumbs={[{ label: "Transversal" }, { label: "Administração" }, { label: "Tipos de documento" }]}
      queryKey="admin-document-types"
      searchPlaceholder="Pesquisar por código"
      emptyMessage="Sem tipos de documento registados"
      statuses={["Active", "Inactive"]}
      stats={[
        { key: "total", label: "Total", status: "all", icon: FileText },
        { key: "active", label: "Activos", status: "Active", icon: FileText },
        { key: "inactive", label: "Inactivos", status: "Inactive", icon: FileText },
      ]}
      fetchPage={({ page, search, status }) =>
        listDocumentTypes({
          page,
          pageSize: 10,
          code: search,
          isActive: status === "all" ? undefined : status === "Active",
        })
      }
      getStatus={(item) => (item.isActive ? "Active" : "Inactive")}
      getTitle={(item) => item.name}
      columns={[
        { key: "code", header: "Código", render: (item) => <span className="font-medium">{item.code}</span> },
        { key: "name", header: "Nome", render: (item) => item.name },
        { key: "module", header: "Módulo", render: (item) => item.module },
        {
          key: "required",
          header: "Obrigatório",
          render: (item) => (item.isRequired ? <StatusBadge status="Active" /> : "—"),
        },
      ]}
      create={{
        label: "Novo tipo de documento",
        dialogTitle: "Registar tipo de documento",
        initial: () => ({ code: "", name: "", module: "", isRequired: false }),
        submit: createDocumentType,
        render: ({ value, setValue, errors }) => (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dt-code">Código</Label>
              <Input
                id="dt-code"
                value={value.code}
                placeholder="BI"
                onChange={(e) => setValue((prev) => ({ ...prev, code: e.target.value }))}
              />
              {fieldError(errors, "code") && <p className="text-sm text-destructive">{fieldError(errors, "code")}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dt-name">Nome</Label>
              <Input
                id="dt-name"
                value={value.name}
                placeholder="Bilhete de Identidade"
                onChange={(e) => setValue((prev) => ({ ...prev, name: e.target.value }))}
              />
              {fieldError(errors, "name") && <p className="text-sm text-destructive">{fieldError(errors, "name")}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dt-module">Módulo</Label>
              <Input
                id="dt-module"
                value={value.module}
                placeholder="Operadores"
                onChange={(e) => setValue((prev) => ({ ...prev, module: e.target.value }))}
              />
              {fieldError(errors, "module") && <p className="text-sm text-destructive">{fieldError(errors, "module")}</p>}
            </div>
            <label className="flex items-center gap-2 pt-6 text-sm">
              <Checkbox
                checked={value.isRequired}
                onCheckedChange={(checked) => setValue((prev) => ({ ...prev, isRequired: !!checked }))}
              />
              Obrigatório
            </label>
          </div>
        ),
      }}
      detail={(item, { refresh, close }) => (
        <DocumentTypeEditForm
          documentType={item}
          onSaved={() => {
            refresh();
            toast({ title: "Tipo de documento actualizado" });
          }}
          onDeleted={() => {
            queryClient.invalidateQueries({ queryKey: ["idf", "admin-document-types"] });
            toast({ title: "Tipo de documento eliminado" });
            close();
          }}
        />
      )}
    />
  );
};

const DocumentTypeEditForm = ({
  documentType,
  onSaved,
  onDeleted,
}: {
  documentType: DocumentTypeDto;
  onSaved: () => void;
  onDeleted: () => void;
}) => {
  const { toast } = useToast();
  const [name, setName] = useState(documentType.name);
  const [module, setModule] = useState(documentType.module);
  const [isRequired, setIsRequired] = useState(documentType.isRequired);
  const [isActive, setIsActive] = useState(documentType.isActive);

  const save = useMutation({
    mutationFn: () => updateDocumentType(documentType.id, { name, module, isRequired, isActive }),
    onSuccess: onSaved,
    onError: (error) => toast({ variant: "destructive", title: "Não foi possível guardar", description: toProblem(error).detail }),
  });

  const remove = useMutation({
    mutationFn: () => deleteDocumentType(documentType.id),
    onSuccess: onDeleted,
    onError: (error) => toast({ variant: "destructive", title: "Não foi possível eliminar", description: toProblem(error).detail }),
  });

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>Código</Label>
        <Input value={documentType.code} readOnly disabled />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-dt-name">Nome</Label>
        <Input id="edit-dt-name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-dt-module">Módulo</Label>
        <Input id="edit-dt-module" value={module} onChange={(e) => setModule(e.target.value)} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <Checkbox checked={isRequired} onCheckedChange={(checked) => setIsRequired(!!checked)} />
        Obrigatório
      </label>
      <label className="flex items-center gap-2 text-sm">
        <Checkbox checked={isActive} onCheckedChange={(checked) => setIsActive(!!checked)} />
        Activo (disponível para selecção)
      </label>

      <Separator />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button disabled={save.isPending} onClick={() => save.mutate()}>
          Guardar alterações
        </Button>
        <Button variant="destructive" size="sm" disabled={remove.isPending} onClick={() => remove.mutate()}>
          <Trash2 className="mr-2 h-4 w-4" />
          Eliminar
        </Button>
      </div>
    </div>
  );
};

const RolesBreakdown = () => {
  const { data } = useQuery({ queryKey: ["idf", "users-by-role"], queryFn: getUsersTotalByRole });
  if (!data?.roles.length) return null;

  return (
    <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {data.roles.map((r) => (
        <Card key={r.name} className="border-border/70 shadow-sm">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-primary">{r.totalUsers}</p>
            <p className="text-sm text-muted-foreground">{r.name ?? "Sem perfil"}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const UsersWorkspace = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return (
    <div className="space-y-4">
      <RolesBreakdown />
      <ResourceWorkspace<UserProfileDto, CreateUserProfileRequest>
        service={SERVICE.ADMIN}
        title="Utilizadores"
        description="Contas de acesso ao sistema — cria a conta e atribui logo o nível de acesso (perfil)."
        crumbs={[{ label: "Transversal" }, { label: "Administração" }, { label: "Utilizadores" }]}
        queryKey="admin-users"
        searchPlaceholder="Pesquisar por nome"
        emptyMessage="Sem utilizadores registados"
        statuses={["Active", "Inactive"]}
        stats={[
          { key: "total", label: "Total", status: "all", icon: Users },
          { key: "active", label: "Activos", status: "Active", icon: Users },
          { key: "inactive", label: "Inactivos", status: "Inactive", icon: Users },
        ]}
        fetchPage={({ page, search, status }) =>
          listUserProfiles({
            page,
            pageSize: 10,
            fullName: search,
            isActive: status === "all" ? undefined : status === "Active",
          })
        }
        getStatus={(item) => (item.isActive ? "Active" : "Inactive")}
        getTitle={(item) => item.fullName ?? "Utilizador"}
        columns={[
          { key: "name", header: "Nome", render: (item) => <span className="font-medium">{item.fullName}</span> },
          { key: "email", header: "Email", render: (item) => item.contact?.email ?? "—" },
          { key: "role", header: "Perfil", render: (item) => item.role?.name ?? "—" },
        ]}
        create={{
          label: "Novo utilizador",
          dialogTitle: "Criar conta de utilizador",
          dialogDescription: "Cria já a conta de acesso — o utilizador entra com este email e palavra-passe.",
          wide: true,
          initial: () => ({ fullName: "", email: "", password: "", phoneNumber: "", roleId: "" }),
          submit: createUserProfile,
          render: ({ value, setValue, errors }) => (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="u-name">Nome completo</Label>
                <Input
                  id="u-name"
                  value={value.fullName}
                  onChange={(e) => setValue((prev) => ({ ...prev, fullName: e.target.value }))}
                />
                {fieldError(errors, "fullName") && <p className="text-sm text-destructive">{fieldError(errors, "fullName")}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="u-email">Email</Label>
                <Input
                  id="u-email"
                  type="email"
                  value={value.email}
                  onChange={(e) => setValue((prev) => ({ ...prev, email: e.target.value }))}
                />
                {fieldError(errors, "email") && <p className="text-sm text-destructive">{fieldError(errors, "email")}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="u-phone">Telefone</Label>
                <Input
                  id="u-phone"
                  value={value.phoneNumber}
                  onChange={(e) => setValue((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="u-password">Palavra-passe</Label>
                <Input
                  id="u-password"
                  type="password"
                  value={value.password}
                  onChange={(e) => setValue((prev) => ({ ...prev, password: e.target.value }))}
                />
                {fieldError(errors, "password") && <p className="text-sm text-destructive">{fieldError(errors, "password")}</p>}
              </div>
              <EntityPicker
                id="u-role"
                label="Perfil de acesso"
                queryKey={["idf", "picker", "roles"]}
                load={loadRoles}
                value={value.roleId}
                onChange={(v) => setValue((prev) => ({ ...prev, roleId: v }))}
                error={fieldError(errors, "roleId")}
              />
            </div>
          ),
        }}
        detail={(item, { refresh, close }) => (
          <UserEditForm
            user={item}
            onSaved={() => {
              refresh();
              toast({ title: "Utilizador actualizado" });
            }}
            onDeleted={() => {
              queryClient.invalidateQueries({ queryKey: ["idf", "admin-users"] });
              toast({ title: "Utilizador eliminado" });
              close();
            }}
          />
        )}
      />
    </div>
  );
};

const GENDER_LABELS: Record<GenderType, string> = { Masculino: "Masculino", Feminino: "Feminino" };

const UserEditForm = ({
  user,
  onSaved,
  onDeleted,
}: {
  user: UserProfileDto;
  onSaved: () => void;
  onDeleted: () => void;
}) => {
  const { toast } = useToast();
  const [firstName, setFirstName] = useState(user.firstName ?? "");
  const [lastName, setLastName] = useState(user.lastName ?? "");
  const [gender, setGender] = useState<GenderType | null>((user.gender as GenderType) ?? null);
  const [email, setEmail] = useState(user.contact?.email ?? "");
  const [phoneNumber, setPhoneNumber] = useState(user.contact?.phoneNumber ?? "");
  const [street, setStreet] = useState(user.address?.street ?? "");
  const [municipality, setMunicipality] = useState(user.address?.municipality ?? "");
  const [province, setProvince] = useState(user.address?.province ?? "");
  const [roleId, setRoleId] = useState(user.roleId);

  const onError = (title: string) => (error: unknown) =>
    toast({ variant: "destructive", title, description: toProblem(error).detail });

  const save = useMutation({
    mutationFn: () =>
      updateUserProfile(user.id, {
        firstName: firstName.trim() || null,
        lastName: lastName.trim() || null,
        birthdate: user.birthdate,
        gender,
        contact: { email: email.trim() || null, phoneNumber: phoneNumber.trim() || null },
        identification: user.identification ?? { type: null, number: null },
        address: { street, municipality, province },
        roleId,
      }),
    onSuccess: onSaved,
    onError: onError("Não foi possível guardar"),
  });

  const activate = useMutation({
    mutationFn: () => enableUserProfile(user.id),
    onSuccess: onSaved,
    onError: onError("Não foi possível activar"),
  });

  const deactivate = useMutation({
    mutationFn: () => disableUserProfile(user.id),
    onSuccess: onSaved,
    onError: onError("Não foi possível desactivar"),
  });

  const remove = useMutation({
    mutationFn: () => deleteUserProfile(user.id),
    onSuccess: onDeleted,
    onError: onError("Não foi possível eliminar"),
  });

  const busy = activate.isPending || deactivate.isPending;

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>Email</Label>
        <Input value={user.contact?.email ?? ""} readOnly disabled />
        <p className="text-xs text-muted-foreground">O email de acesso não pode ser alterado por aqui.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="eu-first">Nome próprio</Label>
          <Input id="eu-first" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="eu-last">Apelido</Label>
          <Input id="eu-last" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="eu-phone">Telefone</Label>
          <Input id="eu-phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="eu-gender">Género</Label>
          <Select value={gender ?? ""} onValueChange={(v) => setGender(v as GenderType)}>
            <SelectTrigger id="eu-gender">
              <SelectValue placeholder="Não definido" />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(GENDER_LABELS) as GenderType[]).map((g) => (
                <SelectItem key={g} value={g}>
                  {GENDER_LABELS[g]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <EntityPicker
        id="eu-role"
        label="Perfil de acesso"
        queryKey={["idf", "picker", "roles"]}
        load={loadRoles}
        value={roleId}
        onChange={setRoleId}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2 sm:col-span-3">
          <Label htmlFor="eu-street">Endereço</Label>
          <Input id="eu-street" value={street} onChange={(e) => setStreet(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="eu-mun">Município</Label>
          <Input id="eu-mun" value={municipality} onChange={(e) => setMunicipality(e.target.value)} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="eu-prov">Província</Label>
          <Input id="eu-prov" value={province} onChange={(e) => setProvince(e.target.value)} />
        </div>
      </div>

      <Separator />

      <div className="flex flex-wrap items-center gap-2">
        <Button disabled={save.isPending} onClick={() => save.mutate()}>
          Guardar alterações
        </Button>
        {user.isActive ? (
          <Button variant="outline" size="sm" disabled={busy} onClick={() => deactivate.mutate()}>
            <UserX className="mr-2 h-4 w-4" />
            Desactivar
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled={busy} onClick={() => activate.mutate()}>
            <UserCheck className="mr-2 h-4 w-4" />
            Activar
          </Button>
        )}
      </div>

      <Separator />

      <Button variant="destructive" size="sm" disabled={remove.isPending} onClick={() => remove.mutate()}>
        <Trash2 className="mr-2 h-4 w-4" />
        Eliminar conta
      </Button>
    </div>
  );
};

const AdminPage = () => (
  <div className="space-y-6">
    <PageHeader
      title="Administração"
      description="Parametrização transversal: utilizadores, espécies florestais e tipos de documento."
      crumbs={[{ label: "Transversal" }, { label: "Administração" }]}
    />
    <Tabs defaultValue="users" className="space-y-4">
      <TabsList>
        <TabsTrigger value="users">Utilizadores</TabsTrigger>
        <TabsTrigger value="species">Espécies Florestais</TabsTrigger>
        <TabsTrigger value="documentTypes">Tipos de Documento</TabsTrigger>
      </TabsList>
      <TabsContent value="users">
        <UsersWorkspace />
      </TabsContent>
      <TabsContent value="species">
        <SpeciesWorkspace />
      </TabsContent>
      <TabsContent value="documentTypes">
        <DocumentTypesWorkspace />
      </TabsContent>
    </Tabs>
  </div>
);

export default AdminPage;
