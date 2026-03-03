# Release Guide

## Flujo de release

```
develop  ──── feature branches ────► develop
                                        │
                                   npm run release
                                        │
                                   git push --follow-tags
                                        │
                                   PR develop → main
                                        │
                                      main (producción)
```

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run release` | Auto-detecta el tipo de bump según commits (patch/minor/major) |
| `npm run release:patch` | Fuerza bump patch: `1.0.0 → 1.0.1` |
| `npm run release:minor` | Fuerza bump minor: `1.0.0 → 1.1.0` |
| `npm run release:major` | Fuerza bump major: `1.0.0 → 2.0.0` |

> El tipo de bump se determina automáticamente por los commits desde el último tag:
> - `fix:` → patch
> - `feat:` → minor
> - `feat!:` o `BREAKING CHANGE` → major

## Pasos paso a paso

### 1. Asegurarse de estar en `develop` y actualizado

```bash
git checkout develop
git pull origin develop
```

### 2. Verificar que los tests y lint pasen

```bash
npm run lint
npm test
```

### 3. Ejecutar el release

```bash
npm run release
```

Esto automáticamente:
- Determina la nueva versión según los commits (`feat`, `fix`, `feat!`)
- Actualiza `version` en `package.json`
- Ejecuta `scripts/bump-version.js` → actualiza versiones nativas:
  - `android/app/build.gradle` → `versionName` y `versionCode`
  - `ios/ruteo.xcodeproj/project.pbxproj` → `MARKETING_VERSION` y `CURRENT_PROJECT_VERSION`
- Actualiza `CHANGELOG.md` con los cambios de esta versión
- Crea un commit `chore(release): vX.Y.Z`
- Crea un git tag `vX.Y.Z`

### 4. Revisar los cambios generados

```bash
git log --oneline -3
cat CHANGELOG.md | head -30
```

Verificar que:
- La versión en `package.json` es correcta
- `android/app/build.gradle` tiene el `versionName` y `versionCode` actualizados
- `ios/ruteo.xcodeproj/project.pbxproj` tiene `MARKETING_VERSION` y `CURRENT_PROJECT_VERSION` actualizados
- `CHANGELOG.md` lista los cambios correctamente

### 5. Push con el tag

```bash
git push --follow-tags origin develop
```

### 6. Pull Request a main

Crear un PR de `develop` → `main` con título:
```
release: vX.Y.Z
```

## Versión de build (versionCode / CURRENT_PROJECT_VERSION)

El build number se calcula automáticamente con la fórmula:

```
buildNumber = major * 10000 + minor * 100 + patch
```

| Versión | Build number |
|---------|--------------|
| 1.0.0   | 10000        |
| 1.1.0   | 10100        |
| 1.2.3   | 10203        |
| 2.0.0   | 20000        |

## Tipos de commit y su efecto en el CHANGELOG

| Tipo | Sección en CHANGELOG | Efecto en versión |
|---|---|---|
| `feat:` | Features | minor bump |
| `fix:` | Bug Fixes | patch bump |
| `perf:` | Performance | patch bump |
| `refactor:` | Refactoring | patch bump |
| `build:` | Build System | patch bump |
| `feat!:` / `BREAKING CHANGE` | — | major bump |
| `chore:`, `docs:`, `style:`, `test:`, `ci:` | ocultos | sin bump |

## Hotfix en producción

Si se necesita un fix urgente sobre `main`:

```bash
git checkout main
git checkout -b hotfix/descripcion-del-fix

# ... hacer el fix y commitear con fix: ...

git checkout develop
git merge hotfix/descripcion-del-fix
git checkout main
git merge hotfix/descripcion-del-fix
npm run release:patch
git push --follow-tags origin main develop
git branch -d hotfix/descripcion-del-fix
```

## Primer release

Para iniciar el versionamiento en una versión específica:

```bash
npm run release -- --release-as 1.0.0
```
