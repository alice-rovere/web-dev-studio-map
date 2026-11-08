import { fetchMapGraph, fetchNodeSections } from "./mapService";
import { fetchNotebooks } from "./notebookService";

const STOP_WORDS = new Set(["come", "cosa", "quale", "quali", "sono", "della", "delle", "dello", "nella", "nodi", "nodo", "questa", "questo", "vorrei", "puoi", "perché"]);

function words(value) {
  return [...new Set(value.toLocaleLowerCase("it").match(/[\p{L}\p{N}]{3,}/gu) ?? [])]
    .filter((word) => !STOP_WORDS.has(word));
}

export function selectRelevantItems(query, selectedNodeId, graph, notebooks) {
  const terms = words(query);
  const score = (text) => {
    const textWords = new Set(words(text));
    return terms.reduce((sum, term) => sum + (textWords.has(term) ? 1 : 0), 0);
  };
  const nodes = graph.nodes
    .map((node) => ({ node, score: score(`${node.label} ${node.slug} ${node.description}`) + (node.id === selectedNodeId ? 100 : 0) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.node.label.localeCompare(b.node.label))
    .slice(0, 3)
    .map(({ node }) => node);
  const nodeIds = new Set(nodes.map((node) => node.id));
  const paths = notebooks
    .map((notebook) => ({ notebook, score: score(`${notebook.slug} ${notebook.description} ${notebook.config?.title ?? ""}`) + (nodeIds.has(notebook.node_id) ? 1 : 0) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map(({ notebook }) => notebook);
  return { nodes, paths };
}

export async function collectChatContext(query, selectedNodeId) {
  const [graph, notebooks] = await Promise.all([fetchMapGraph(), fetchNotebooks()]);
  const { nodes, paths } = selectRelevantItems(query, selectedNodeId, graph, notebooks);
  const sections = await Promise.all(nodes.map((node) => fetchNodeSections(node.id)));
  const labels = new Map(graph.nodes.map((node) => [node.id, node.label]));
  const sources = [
    ...nodes.map((node, index) => ({
      name: `Nodo: ${node.label}`.slice(0, 200),
      content: JSON.stringify({
        label: node.label,
        description: node.description,
        best_practices: node.best_practices,
        naming_conventions: node.naming_conventions,
        categories: graph.categories.filter((link) => link.node_id === node.id).map((link) => link.category),
        parents: graph.parents.filter((link) => link.child_id === node.id).slice(0, 5).map((link) => labels.get(link.parent_id)),
        children: graph.parents.filter((link) => link.parent_id === node.id).slice(0, 5).map((link) => labels.get(link.child_id)),
        sections: sections[index].slice(0, 3).map(({ title, type, payload }) => ({ title, type, payload })),
      }).slice(0, 3500),
    })),
    ...paths.map((notebook) => ({
      name: `Percorso: ${notebook.config?.title || notebook.slug}`.slice(0, 200),
      content: JSON.stringify({ description: notebook.description, config: notebook.config }).slice(0, 3500),
    })),
  ];
  return sources;
}
