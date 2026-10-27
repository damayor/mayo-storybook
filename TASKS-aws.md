# Despliegue 1: portafolio + Storybook en AWS (S3 + CloudFront)

Objetivo: dejar el portafolio en `/` y Storybook en `/storybook/` sirviéndose desde un solo bucket de S3 privado detrás de CloudFront. Por ahora sin dominio propio: se prueba con el dominio `dxxxx.cloudfront.net` que entrega AWS.

## Decisiones tomadas

* Un solo bucket, una sola distribución de CloudFront. Storybook se copia dentro del build del portafolio (`dist/storybook`).
* Bucket privado con Origin Access Control (OAC). Nunca público.
* CloudFront en modo pay-as-you-go (no en un plan de tarifa fija), para conservar la capa gratuita de 1 TB y 10M de peticiones al mes.
* Región del bucket: `eu-central-1`. Editable. El certificado de ACM (más adelante) siempre va en `us-east-1`.
* Sin WAF, sin NAT, sin EC2, sin balanceador. Todo eso cuesta plata y no hace falta aquí.

## Variables (ajusta y exporta en tu terminal)

```bash
export AWS_PROFILE=mayit
export REGION=eu-central-1
export BUCKET=mayit-eu-prd   # único a nivel global, solo minúsculas
export BUILD_DIR=dist                                  # cambia a "build" si tu proyecto usa esa carpeta
export DIST_ID=E1C1HWY060ZWD7                               # se llena en la Fase 4
```

## Reglas para Claude Code (si lo ejecutas ahí)

* Usa siempre el perfil `mayit`. Nunca uses credenciales de la cuenta raíz.
* Nunca imprimas, guardes ni commitees credenciales. No toques `~/.aws` ni archivos `.env` fuera de lo pedido.
* Antes de ejecutar cada comando de AWS, muéstralo y explica qué hace.
* Prohibido sin mi confirmación explícita: `aws s3 rb`, `aws s3 rm`, cambiar el bloqueo de acceso público, tocar IAM, facturación o Budgets, crear recursos que no estén en esta lista.
* Los pasos marcados **(MANUAL)** los hago yo en el navegador.

---

## Fase 0: Prerrequisitos

* [x] **(MANUAL)** Backup completo del `public_html` viejo por FTP, guardado en tu disco.
* [ ] **(MANUAL)** Decidir qué hacer con el dominio viejo, que vence este fin de semana: renovarlo un año o dejarlo caer. Si esa URL está en tu CV, LinkedIn o Instagram, mejor renovarlo y redirigirlo cuando tengas el nombre nuevo.
* [x] **(MANUAL)** Crear la cuenta de AWS y activar MFA en la cuenta raíz.
* [x] **(MANUAL)** En IAM crear un usuario para trabajar (por ejemplo `mayit-admin`) con MFA. Crea una access key para el CLI. No uses la cuenta raíz para el día a día.
* [x] **(MANUAL)** En AWS Budgets crear una alerta mensual de $5 con aviso a tu correo. Activa también Cost Anomaly Detection (gratis).
* [x] Instalar AWS CLI v2 y configurar el perfil:

```bash
aws configure --profile mayit
aws sts get-caller-identity --profile mayit   # debe mostrar tu usuario IAM, no "root"
```

## Fase 1: Preparar el build en el repo

* [x] Crear `scripts/assemble.mjs` (copia Storybook dentro del build, funciona en Windows, Mac y Linux):

```js
import { cpSync, rmSync, existsSync } from 'node:fs';

const buildDir = process.env.BUILD_DIR || 'dist';
const sbDir = 'storybook-static';

if (!existsSync(buildDir)) throw new Error(`No existe ${buildDir}. Corre el build primero.`);
if (!existsSync(sbDir)) throw new Error(`No existe ${sbDir}. Corre build-storybook primero.`);

rmSync(`${buildDir}/storybook`, { recursive: true, force: true });
cpSync(sbDir, `${buildDir}/storybook`, { recursive: true });
console.log(`Storybook copiado a ${buildDir}/storybook`);
```

* [x] Agregar en `package.json` (ajusta `build` y `build-storybook` a tus scripts reales):

```json
"scripts": {
  "build:all": "pnpm build && pnpm build-storybook && node scripts/assemble.mjs"
}
```

* [x] Correr `pnpm build:all` y probar local: `npx serve dist` y revisar `/` y `/storybook/`.
* [x] Anotar el tamaño total de la carpeta de build (`du -sh dist` o equivalente) para tener el dato real de almacenamiento. Respuesta=/223M dist

## Fase 2: Bucket de S3 privado

* [ ] Crear el bucket (en `us-east-1` se omite el `--create-bucket-configuration`):

```bash
aws s3api create-bucket --bucket $BUCKET --region $REGION \
  --create-bucket-configuration LocationConstraint=$REGION

aws s3api put-public-access-block --bucket $BUCKET \
  --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
```

* [x] Verificar que el bloqueo público quedó activo:

```bash
aws s3api get-public-access-block --bucket $BUCKET
```

## Fase 3: Primera subida

* [x] Subir todo excepto HTML con caché de una hora, y luego el HTML sin caché:

```bash
aws s3 sync $BUILD_DIR/ s3://$BUCKET --delete --exclude "*.html" \
  --cache-control "public,max-age=3600"

aws s3 sync $BUILD_DIR/ s3://$BUCKET --delete --exclude "*" --include "*.html" \
  --cache-control "no-cache"
```

* [x] Revisar el contenido: `aws s3 ls s3://$BUCKET --recursive | head -30`
* [ ] Si tienes assets pesados (por ejemplo `.glb`, `.ply`, `.wasm`), confirmar que subieron con el Content-Type correcto:

```bash
aws s3api head-object --bucket $BUCKET --key RUTA/DEL/ARCHIVO
```
Ejemplo: aws s3api head-object --bucket $BUCKET --key assets/meshes/mesh_berlin/alexplatz.ply y ContentType deberia ser binary/octet-stream

## Fase 4: CloudFront

Esta fase se hace en la consola la primera vez, para entender cada pieza. La interfaz cambia con frecuencia, así que ajusta si ves un flujo distinto.

* [ ] **(MANUAL)** Crear una función en CloudFront → Functions, nombre `spa-and-storybook`, runtime `cloudfront-js-2.0`, con este código. Guárdala y publícala. No la he probado, así que se prueba en la Fase 5:

```js
function handler(event) {
  var req = event.request;
  var uri = req.uri;

  if (uri === '/storybook') {
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: { location: { value: '/storybook/' } }
    };
  }
  if (uri.endsWith('/')) {
    req.uri = uri + 'index.html';
  } else if (!uri.includes('.') && !uri.startsWith('/storybook')) {
    req.uri = '/index.html'; // fallback del SPA del portafolio
  }
  return req;
}
```

* [x] **(MANUAL)** CloudFront → Create distribution, con esta configuración:
  * Modelo de precios: pay-as-you-go (no un plan de tarifa fija).
  * Origin: el bucket de S3 (el endpoint REST del bucket, no el "website endpoint").
  * Origin access: Origin access control settings (recommended). Crea un OAC nuevo.
  * Default root object: `index.html`.
  * Viewer protocol policy: Redirect HTTP to HTTPS.
  * Compress objects automatically: Sí.
  * WAF: desactivado (cuesta aparte).
  * Price class: dejar todas las ubicaciones, porque parte de tu audiencia está en Colombia y la capa gratuita cubre el tráfico.
* [x] **(MANUAL)** Asociar la función `spa-and-storybook` al evento Viewer request del comportamiento por defecto.
* [x] **(MANUAL)** CloudFront te muestra un aviso con una bucket policy generada para el OAC. Cópiala y pégala en S3 → tu bucket → Permissions → Bucket policy.
* [x] Esperar a que la distribución diga "Deployed" (unos 5 a 10 minutos). Anotar el ID y exportarlo:

```bash
export DIST_ID=EXXXXXXXXXXXXX
aws cloudfront get-distribution --id $DIST_ID --query "Distribution.DomainName" --output text
```

## Fase 5: Verificación

Sustituye `dxxxx` por el dominio real que devolvió el comando anterior.

* [ ] `https://dxxxx.cloudfront.net/` carga el portafolio.
* [ ] Un deep link del portafolio (una ruta interna) sigue funcionando al recargar la página.
* [ ] `https://dxxxx.cloudfront.net/storybook` redirige a `/storybook/` y carga la documentación.
* [ ] `http://` redirige a `https://`.
* [ ] La URL directa del bucket (`https://BUCKET.s3.REGION.amazonaws.com/index.html`) devuelve Access Denied.
* [ ] La segunda petición sale del caché:

```bash
curl -sI https://dxxxx.cloudfront.net/ | grep -i x-cache
```

* [ ] Si algo falla en la ruta de Storybook, revisar la función de la Fase 4 antes que cualquier otra cosa.

## Fase 6: Script de deploy

* [ ] Borrar el `deploy.sh` viejo (era el deploy por FTP a Hostinger, ya no se usa) antes de crear el nuevo.
* [ ] Crear `deploy.sh` en la raíz del repo (en Windows, correrlo con Git Bash o WSL):

```bash
#!/usr/bin/env bash
set -euo pipefail
: "${BUCKET:?Falta BUCKET}" "${DIST_ID:?Falta DIST_ID}" "${BUILD_DIR:=dist}"

pnpm build:all

aws s3 sync "$BUILD_DIR/" "s3://$BUCKET" --delete --exclude "*.html" \
  --cache-control "public,max-age=3600"
aws s3 sync "$BUILD_DIR/" "s3://$BUCKET" --delete --exclude "*" --include "*.html" \
  --cache-control "no-cache"

aws cloudfront create-invalidation --distribution-id "$DIST_ID" --paths "/*"
```

* [ ] Agregar `"deploy": "bash deploy.sh"` a los scripts de `package.json`.
* [ ] Probar un deploy completo con `pnpm deploy` y verificar de nuevo la Fase 5.
* [ ] Recordar: `--delete` es seguro solo porque este bucket contiene únicamente este sitio.

## Fase 7: Permisos mínimos (opcional pero recomendado)

* [ ] **(MANUAL)** Crear un usuario IAM `mayit-deployer` con esta política (reemplaza los valores) y usar sus llaves para el perfil `mayit` en lugar de las del usuario admin:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": "arn:aws:s3:::BUCKET"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::BUCKET/*"
    },
    {
      "Effect": "Allow",
      "Action": ["cloudfront:CreateInvalidation"],
      "Resource": "arn:aws:cloudfront::ACCOUNT_ID:distribution/DIST_ID"
    }
  ]
}
```

Si `aws s3 sync` da AccessDenied, agrega `s3:GetObject` al segundo bloque.

## Fase 8: Vigilar costos

* [ ] A los 3 días revisar Cost Explorer y CloudFront → Reports. Debe salir casi en cero.
* [ ] Confirmar que llega el correo de prueba de la alerta de Budgets.
* [ ] Recordar que no hay tope duro de gasto: la alerta te avisa, no te frena.

## Pendiente para los siguientes despliegues (no hacer todavía)

* Dominio nuevo: comprarlo, pedir el certificado en ACM en `us-east-1` con validación por DNS, agregarlo como alternate domain name en CloudFront y apuntar el DNS.
* Backend del traductor de CV: función Lambda con Function URL, secretos fuera del código, concurrencia limitada, sin registrar el contenido de los CV.
* Apagar el hosting viejo de Hostinger solo cuando todo funcione con el dominio definitivo.