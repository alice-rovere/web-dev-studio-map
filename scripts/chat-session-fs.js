import { Volume } from "memfs";

export function createMemorySessionFs() {
  const fs = Volume.fromJSON({ "/workspace/.keep": "" }).promises;
  const parent = (path) => path.slice(0, path.lastIndexOf("/")) || "/";
  return {
    readFile: (path) => fs.readFile(path, "utf8"),
    async writeFile(path, content, mode) {
      await fs.mkdir(parent(path), { recursive: true });
      await fs.writeFile(path, content, mode === undefined ? undefined : { mode });
    },
    async appendFile(path, content, mode) {
      await fs.mkdir(parent(path), { recursive: true });
      await fs.appendFile(path, content, mode === undefined ? undefined : { mode });
    },
    async exists(path) {
      try {
        await fs.stat(path);
        return true;
      } catch (error) {
        if (error.code === "ENOENT") return false;
        throw error;
      }
    },
    async stat(path) {
      const stat = await fs.stat(path);
      return {
        isFile: stat.isFile(),
        isDirectory: stat.isDirectory(),
        size: stat.size,
        mtime: stat.mtime.toISOString(),
        birthtime: stat.birthtime.toISOString(),
      };
    },
    async mkdir(path, recursive, mode) {
      await fs.mkdir(path, mode === undefined ? { recursive } : { recursive, mode });
    },
    readdir: (path) => fs.readdir(path),
    async readdirWithTypes(path) {
      const entries = await fs.readdir(path, { withFileTypes: true });
      return entries.map((entry) => ({
        name: entry.name,
        type: entry.isDirectory() ? "directory" : "file",
      }));
    },
    async rm(path, recursive, force) {
      await fs.rm(path, { recursive, force });
    },
    rename: (source, target) => fs.rename(source, target),
  };
}
