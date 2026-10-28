import { useState } from "react";
import { Loader2, Upload } from "lucide-react";
import GlossaryText from "../GlossaryText";
import { uploadNoteImage } from "../../services/mapService";

const MAX_DIMENSION = 1600;

// Riduce le immagini grandi prima dell'upload (GIF escluse per non perdere l'animazione).
async function shrinkImage(file) {
  if (file.type === "image/gif") return file;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  if (scale === 1) {
    bitmap.close();
    return file;
  }

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const type = file.type === "image/png" ? "image/png" : "image/webp";
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, type, 0.85));
  return blob ? new File([blob], file.name, { type }) : file;
}

export function ImageView({ payload }) {
  const [zoomed, setZoomed] = useState(false);

  if (!payload.url) return null;

  return (
    <figure className="my-4">
      <button
        aria-label="Ingrandisci immagine"
        className="block w-full cursor-zoom-in"
        onClick={() => setZoomed(true)}
        type="button"
      >
        <img
          alt={payload.alt || payload.caption || ""}
          className="mx-auto max-h-120 rounded-lg border border-zinc-800 object-contain"
          loading="lazy"
          src={payload.url}
        />
      </button>
      {payload.caption && (
        <figcaption className="mt-2 text-center text-xs text-zinc-400">
          <GlossaryText>{payload.caption}</GlossaryText>
        </figcaption>
      )}
      {zoomed && (
        <div
          aria-label="Immagine ingrandita"
          aria-modal="true"
          className="fixed inset-0 z-100 flex cursor-zoom-out items-center justify-center bg-black/85 p-4"
          onClick={() => setZoomed(false)}
          onKeyDown={(event) => event.key === "Escape" && setZoomed(false)}
          ref={(element) => element?.focus()}
          role="dialog"
          tabIndex={-1}
        >
          <img
            alt={payload.alt || payload.caption || ""}
            className="max-h-full max-w-full object-contain"
            src={payload.url}
          />
        </div>
      )}
    </figure>
  );
}

export function ImageEditor({ payload, update, fieldClass, Label }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const uploaded = await uploadNoteImage(await shrinkImage(file));
      update((previous) => ({ ...previous, ...uploaded }));
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Caricamento non riuscito.",
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="grid gap-3">
      {payload.url && (
        <img
          alt={payload.alt || "Anteprima"}
          className="max-h-60 rounded-lg border border-zinc-800 object-contain"
          src={payload.url}
        />
      )}
      <label className="inline-flex w-fit cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-800 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800/50">
        {uploading ? (
          <Loader2 className="animate-spin" size={13} />
        ) : (
          <Upload size={13} />
        )}
        {payload.url ? "Sostituisci immagine" : "Carica immagine"}
        <input
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="sr-only"
          disabled={uploading}
          onChange={handleFile}
          type="file"
        />
      </label>
      {error && (
        <p className="text-xs text-rose-300" role="alert">
          {error}
        </p>
      )}
      <div className="grid gap-3 md:grid-cols-2">
        <label className="block">
          <Label>Didascalia</Label>
          <input
            className={fieldClass}
            onChange={(event) =>
              update((previous) => ({ ...previous, caption: event.target.value }))
            }
            value={payload.caption}
          />
        </label>
        <label className="block">
          <Label>Testo alternativo</Label>
          <input
            className={fieldClass}
            onChange={(event) =>
              update((previous) => ({ ...previous, alt: event.target.value }))
            }
            value={payload.alt}
          />
        </label>
      </div>
    </div>
  );
}
