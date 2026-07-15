import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getAuthenticatedAdmin } from "@/lib/admin-session";

const allowedContentTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const allowedExtensions = /\.(?:jpe?g|png|webp|avif)$/i;

export async function POST(request: Request) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as HandleUploadBody;
  try {
    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith("vehicles/") || !allowedExtensions.test(pathname)) {
          throw new Error("Invalid vehicle image path.");
        }

        return {
          allowedContentTypes,
          maximumSizeInBytes: 10 * 1024 * 1024,
          addRandomSuffix: false,
          allowOverwrite: false,
          tokenPayload: JSON.stringify({ adminId: admin.id }),
        };
      },
    });

    return Response.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to prepare the upload.";
    return Response.json({ error: message }, { status: 400 });
  }
}
