// slug notebook -> loader lazy della config.
// In futuro: affiancare/sostituire con fetch da Supabase (stesso formato JSON).
const loaders = {
  "prisma-orm": () => import("./configs/prismaFlowConfig.js"),
  "internet-browser": () => import("./configs/internetBrowserConfig.js"),
};

export const hasNotebook = (slug) =>
  Boolean(slug) && Object.hasOwn(loaders, slug);

export async function loadNotebookConfig(slug) {
  if (!hasNotebook(slug)) return null;
  const module = await loaders[slug]();
  return module.default;
}
