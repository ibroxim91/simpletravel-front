import httpClient from '@/shared/config/api/httpClient';
import { CHAT_MESSAGES } from '@/shared/config/api/URLs';

export type ChatSender = 'user' | 'admin';

export interface ChatMessage {
  id: number;
  conversation_id: number;
  sender: ChatSender;
  text: string;
  is_answered: boolean;
  created_at: string;
}

export interface SendChatMessagePayload {
  name: string;
  phone: string;
  message: string;
  conversation_id?: number | null;
}

export interface SendChatMessageResponse {
  conversation_id: number;
  message: ChatMessage;
}

const CONVERSATION_KEY = 'support_chat_conversation_id';
const PROFILE_KEY = 'support_chat_profile';
const LAST_READ_PREFIX = 'support_chat_last_read_';

export function getLastReadMessageId(conversationId: number): number {
  if (typeof window === 'undefined') return 0;
  const raw = localStorage.getItem(`${LAST_READ_PREFIX}${conversationId}`);
  if (!raw) return 0;
  const id = Number(raw);
  return Number.isFinite(id) ? id : 0;
}

export function setLastReadMessageId(conversationId: number, messageId: number) {
  localStorage.setItem(`${LAST_READ_PREFIX}${conversationId}`, String(messageId));
}

export function countUnreadAdminMessages(
  messages: ChatMessage[],
  lastReadMessageId: number,
): number {
  return messages.filter(
    (m) => m.sender === 'admin' && m.id > lastReadMessageId,
  ).length;
}

function unwrapMessages(payload: unknown): ChatMessage[] {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === 'object') {
    const obj = payload as { data?: ChatMessage[] };
    if (Array.isArray(obj.data)) return obj.data;
  }
  return [];
}

export function getStoredConversationId(): number | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(CONVERSATION_KEY);
  if (!raw) return null;
  const id = Number(raw);
  return Number.isFinite(id) ? id : null;
}

export function setStoredConversationId(id: number) {
  localStorage.setItem(CONVERSATION_KEY, String(id));
}

export function getStoredProfile(): { name: string; phone: string } {
  if (typeof window === 'undefined') return { name: '', phone: '' };
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return { name: '', phone: '' };
    const parsed = JSON.parse(raw);
    return {
      name: parsed.name ?? '',
      phone: parsed.phone ?? '',
    };
  } catch {
    return { name: '', phone: '' };
  }
}

export function setStoredProfile(name: string, phone: string) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify({ name, phone }));
}

export async function getChatMessages(conversationId: number) {
  const res = await httpClient.get<ChatMessage[] | { data: ChatMessage[] }>(
    CHAT_MESSAGES,
    {
      params: { conversation_id: conversationId },
    },
  );
  return unwrapMessages(res.data);
}

export async function sendChatMessage(payload: SendChatMessagePayload) {
  const res = await httpClient.post<SendChatMessageResponse>(CHAT_MESSAGES, payload);
  return res.data;
}
