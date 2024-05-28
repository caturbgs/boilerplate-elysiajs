This is used for setup of the libraries used in the project. Example: database, redis, logger, etc.

There are two ways to create a library/plugin in the project:
1. Create a instance
2. Functional Callback

### 1. Create a instance
```typescript
// * create a plugin using instance
export const loggerPlugin = new Elysia().decorate("log", log);
```

### 2. Functional Callback
```typescript
// * create a plugin using functional callback
export const loggerPlugin = (app: Elysia) => app.decorate("log", log);
```

Reference: [ElysiaJS Plugin](https://elysiajs.com/essential/plugin)
