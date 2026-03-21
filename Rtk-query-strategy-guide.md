# RTK Query — Strategy & Usage Guide

## Install

```bash
npm install @reduxjs/toolkit react-redux
```

---

## File Summary

### 6 NEW files to add

| File | What it does |
|---|---|
| `src/store/baseApi.ts` | Core config — base URL, auth token, 401 refresh. All API slices plug into this. Also exports `ApiResponse<T>` and `PaginatedResponse<T>` wrappers. |
| `src/store/index.ts` | Redux store setup — just wires baseApi reducer + middleware. |
| `src/store/api/authApi.ts` | Login, hash password, reset password, change password. Types are inside this file. |
| `src/store/api/userApi.ts` | Get users (paginated), get by ID, create, update. Types are inside this file. |
| `src/store/api/roleApi.ts` | Get roles (paginated), get grouped, create custom. Types are inside this file. |
| `src/store/api/permissionApi.ts` | Get all permissions. Types are inside this file. |

### 3 EXISTING files to update

| File | What changed |
|---|---|
| `src/main.tsx` | Wrapped app with `<Provider store={store}>` |
| `src/context/AuthContext.tsx` | Removed mock data, uses `useLoginMutation()` |
| `src/pages/auth/login/index.tsx` | Calls real `login(email, password)`, shows loading + API errors |

---

## How It All Connects

```
main.tsx
  └─ <Provider store={store}>        ← makes RTK Query available everywhere
       └─ <AuthProvider>              ← uses useLoginMutation internally
            └─ <App>
                 └─ Any page can call useGetUsersQuery(), etc.
```

---

## Query vs Mutation

**Query** = GET request. Auto-fetches when component mounts. Cached.

```tsx
const { data, isLoading, isFetching, isError } = useGetUsersQuery({ page: 1, limit: 10 });
const users = data?.data ?? [];
```

**Mutation** = POST / PATCH / DELETE. You trigger it manually.

```tsx
const [createUser, { isLoading: isCreating }] = useCreateUserMutation();

async function handleSave(formData) {
  try {
    await createUser(formData).unwrap();  // .unwrap() throws on error
    toast.success("Created!");
  } catch (err) {
    toast.error(err?.data?.message || "Failed");
  }
}
```

---

## Cache Auto-Refetch (Tags)

This is the key benefit. No more manual refetching after create/update.

```
useGetUsersQuery()       provides  →  tag: { User, "LIST" }
                                           ↑
useCreateUserMutation()  invalidates → tag: { User, "LIST" }
```

When `createUser` succeeds, RTK Query sees it invalidated `{ User, LIST }`, finds `getUsers` is providing that tag, and auto-refetches it. The table updates by itself.

---

## Loading States

RTK Query gives TWO loading flags:

| Flag | Meaning |
|---|---|
| `isLoading` | First load ever (no cached data exists) |
| `isFetching` | Any fetch including refetch (cached data may exist) |

Use them like this:

```tsx
// First load — show skeleton
if (isLoading) return <TableSkeleton />;

// Refetching — dim the table but keep showing data
<div className={isFetching ? "opacity-60" : ""}>
  <DataTable data={users} />
</div>
```

---

## Common Patterns

### Paginated list with server-side search

```tsx
const [search, setSearch] = useState("");
const [page, setPage] = useState(1);

// Auto-refetches when search or page changes
const { data, isLoading } = useGetUsersQuery({
  search: search || undefined,
  page,
  limit: 10,
});
```

### Fetch detail on click (skip until needed)

```tsx
const { data } = useGetUserByIdQuery(userId!, {
  skip: !userId,  // don't fetch until userId exists
});
```

### Use two queries together

```tsx
const { data: roles } = useGetRolesGroupedQuery();
const { data: perms } = useGetAllPermissionsQuery();
// Both run in parallel automatically
```

---

## Error Handling

### For mutations — try/catch with .unwrap()

```tsx
try {
  await createUser(formData).unwrap();
  toast.success("Done!");
} catch (err: any) {
  toast.error(err?.data?.message || "Something went wrong");
}
```

### For queries — use isError + error

```tsx
const { data, isError, error } = useGetUsersQuery({ page: 1 });

if (isError) {
  const msg = "data" in error ? (error.data as any)?.message : "Failed to load";
  return <ErrorBanner message={msg} />;
}
```

---

## Migration Order

1. `npm install @reduxjs/toolkit react-redux`
2. Add `src/store/baseApi.ts`
3. Add `src/store/index.ts`
4. Add `src/store/api/authApi.ts`
5. Update `src/main.tsx`
6. Update `src/context/AuthContext.tsx`
7. Update `src/pages/auth/login/index.tsx`
8. **Test login end-to-end**
9. Add `src/store/api/userApi.ts`
10. Add `src/store/api/roleApi.ts`
11. Add `src/store/api/permissionApi.ts`
12. Migrate pages one by one (replace mock data with hooks)
13. Delete `src/mockdata/` files as you go

---

## All Available Hooks

```tsx
// Auth
import { useLoginMutation } from "@/store/api/authApi";
import { useHashPasswordMutation } from "@/store/api/authApi";
import { useResetPasswordByAdminMutation } from "@/store/api/authApi";
import { useChangeMyPasswordMutation } from "@/store/api/authApi";

// Users
import { useGetUsersQuery } from "@/store/api/userApi";
import { useGetUserByIdQuery } from "@/store/api/userApi";
import { useCreateUserMutation } from "@/store/api/userApi";
import { useUpdateUserMutation } from "@/store/api/userApi";

// Roles
import { useGetRolesQuery } from "@/store/api/roleApi";
import { useGetRolesGroupedQuery } from "@/store/api/roleApi";
import { useCreateCustomRoleMutation } from "@/store/api/roleApi";

// Permissions
import { useGetAllPermissionsQuery } from "@/store/api/permissionApi";
```