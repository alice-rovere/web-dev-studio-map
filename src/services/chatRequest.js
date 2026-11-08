import { collectChatContext } from "./chatContext";

export async function prepareChatRequest({
  message,
  messages,
  conversationSegment,
  useMap,
  selectedNodeId,
  collectContext = collectChatContext,
}) {
  const sources = useMap ? await collectContext(message, selectedNodeId) : [];
  const history = messages
    .filter((item) => item.conversationSegment === conversationSegment)
    .slice(-4)
    .map(({ role, content }) => ({ role, content: content.slice(0, 3000) }));
  return { message, history, sources };
}
