import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getAuthenticatedAdmin } from "@/lib/admin-session";

const allowedContentTypes = ["image/jpeg", "image/png", "image/webp"];
const allowedPathname = /^vehicles\/draft\/\d{13}-[0-9a-f-]{36}\.(?:jpe?g|png|webp)$/i;
const maximumSizeInBytes = 8 * 1024 * 1024;
const maximumRequestBytes = 64 * 1024;

export async function POST(request: Request) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_STORE_ID) {
      return Response.json({ error: "Le stockage d’images n’est pas configuré. Contactez un administrateur." }, { status: 503 });
    }
    const contentLength = Number(request.headers.get("content-length") ?? "0");
    if (!Number.isFinite(contentLength) || contentLength > maximumRequestBytes) {
      return Response.json({ error: "Requête d’envoi invalide." }, { status: 413 });
    }
    const body = (await request.json()) as HandleUploadBody;
    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!allowedPathname.test(pathname)) {
          throw new Error("Invalid vehicle image path.");
        }

        return {
          allowedContentTypes,
          maximumSizeInBytes,
          addRandomSuffix: false,
          allowOverwrite: false,
          tokenPayload: JSON.stringify({ adminId: admin.id }),
        };
      },
    });

    return Response.json(response);
  } catch {
    return Response.json({ error: "Impossible de préparer l’envoi de l’image." }, { status: 400 });
  }
}
