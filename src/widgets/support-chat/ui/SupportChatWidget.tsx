'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, MessageCircle, Send, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  countUnreadAdminMessages,
  getChatMessages,
  getLastReadMessageId,
  getStoredConversationId,
  getStoredProfile,
  sendChatMessage,
  setLastReadMessageId,
  setStoredConversationId,
  setStoredProfile,
} from '../lib/api';

const COLORS = {
  primary: '#1764FC',
  primaryHover: '#084FE3',
  primaryDark: '#031753',
  text: '#112211',
  textMuted: '#646465',
  border: '#DFDFDF',
  surface: '#FAFBFC',
  white: '#FFFFFF',
};

type SupportChatWidgetProps = {
  variant?: 'fab' | 'bar';
};

function UnreadBadge({
  count,
  className = '-right-1 -top-1',
}: {
  count: number;
  className?: string;
}) {
  if (count <= 0) return null;

  return (
    <span
      className={`absolute flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white ${className}`}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}

export default function SupportChatWidget({
  variant = 'fab',
}: SupportChatWidgetProps) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [lastReadMessageId, setLastReadMessageIdState] = useState(0);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const profile = getStoredProfile();
    setName(profile.name);
    setPhone(profile.phone);
    const storedConversationId = getStoredConversationId();
    setConversationId(storedConversationId);
    if (storedConversationId) {
      setLastReadMessageIdState(getLastReadMessageId(storedConversationId));
    }
  }, []);

  const { data: messages = [], isFetching } = useQuery({
    queryKey: ['support-chat-messages', conversationId],
    queryFn: () => getChatMessages(conversationId!),
    enabled: !!conversationId,
    refetchInterval: 30_000,
  });

  const unreadCount =
    !open && conversationId
      ? countUnreadAdminMessages(messages, lastReadMessageId)
      : 0;

  useEffect(() => {
    if (!open || !conversationId || messages.length === 0) return;

    const maxId = Math.max(...messages.map((m) => m.id));
    setLastReadMessageId(conversationId, maxId);
    setLastReadMessageIdState(maxId);
  }, [open, conversationId, messages]);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, open]);

  const sendMutation = useMutation({
    mutationFn: sendChatMessage,
    onSuccess: (data) => {
      setStoredConversationId(data.conversation_id);
      setStoredProfile(name.trim(), phone.trim());
      setConversationId(data.conversation_id);
      setMessage('');
      setError('');
      queryClient.invalidateQueries({
        queryKey: ['support-chat-messages', data.conversation_id],
      });
      if (open) {
        setLastReadMessageId(data.conversation_id, data.message.id);
        setLastReadMessageIdState(data.message.id);
      }
    },
    onError: () => {
      setError(t('support_chat_send_error'));
    },
  });

  const handleSend = () => {
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedPhone || !trimmedMessage) {
      setError(t('support_chat_required'));
      return;
    }

    sendMutation.mutate({
      name: trimmedName,
      phone: trimmedPhone,
      message: trimmedMessage,
      conversation_id: conversationId,
    });
  };

  const panel = open ? (
    <div
      className={
        variant === 'bar'
          ? 'fixed bottom-[calc(3.25rem+env(safe-area-inset-bottom,0px))] left-0 right-0 z-[81] mx-auto flex h-[min(480px,65vh)] w-full max-w-[420px] flex-col overflow-hidden rounded-t-2xl border border-[#DFDFDF] bg-white shadow-[0_-8px_32px_rgba(17,34,17,0.12)] sm:left-auto sm:right-4 sm:rounded-2xl'
          : 'mb-3 flex h-[min(520px,70vh)] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-[#DFDFDF] bg-white shadow-[0_12px_40px_rgba(17,34,17,0.12)]'
      }
    >
      <div
        className="flex items-center justify-between px-4 py-3 text-white"
        style={{ backgroundColor: COLORS.primary }}
      >
        <div>
          <p className="text-sm font-semibold">{t('support_chat_title')}</p>
          <p className="text-xs text-white/80">{t('support_chat_brand')}</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-full p-1 hover:bg-white/15"
          aria-label={t('support_chat_close')}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div
        className="flex-1 space-y-2 overflow-y-auto px-3 py-3"
        style={{ backgroundColor: COLORS.surface }}
      >
        {isFetching && messages.length === 0 ? (
          <div className="flex justify-center py-8">
            <Loader2
              className="h-5 w-5 animate-spin"
              style={{ color: COLORS.primary }}
            />
          </div>
        ) : messages.length === 0 ? (
          <p
            className="rounded-xl bg-white px-3 py-2 text-xs shadow-sm"
            style={{ color: COLORS.textMuted }}
          >
            {t('support_chat_welcome')}
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'text-white'
                    : 'bg-white shadow-sm'
                }`}
                style={
                  msg.sender === 'user'
                    ? { backgroundColor: COLORS.primary }
                    : { color: COLORS.text }
                }
              >
                {msg.text}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <div className="space-y-2 border-t border-[#DFDFDF] bg-white p-3">
        <div className="grid grid-cols-2 gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('support_chat_name')}
            className="rounded-lg border border-[#DFDFDF] px-3 py-2 text-sm outline-none focus:border-[#1764FC]"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t('support_chat_phone')}
            className="rounded-lg border border-[#DFDFDF] px-3 py-2 text-sm outline-none focus:border-[#1764FC]"
          />
        </div>
        <div className="flex gap-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('support_chat_message')}
            rows={2}
            className="min-h-[44px] flex-1 resize-none rounded-lg border border-[#DFDFDF] px-3 py-2 text-sm outline-none focus:border-[#1764FC]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={sendMutation.isPending}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-white disabled:opacity-60"
            style={{ backgroundColor: COLORS.primary }}
            aria-label={t('support_chat_send')}
          >
            {sendMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
        {error ? <p className="text-xs text-red-500">{error}</p> : null}
      </div>
    </div>
  ) : null;

  if (variant === 'bar') {
    if (!mounted) return null;

    // Portal: selectour wrapperdagi overflow/transform fixed ni ishlamas qilib qo‘yadi (prod CSS da
    // `fixed` + `relative` conflict ham bo‘lgan — relative yutib, tugma footerdan oldin qolardi).
    return createPortal(
      <div
        className="pointer-events-none"
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 80,
        }}
      >
        <div className="pointer-events-auto">{panel}</div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="pointer-events-auto relative flex w-full min-h-[52px] items-center justify-center border-t border-[#084FE3]/20 px-4 text-sm font-semibold text-white shadow-[0_-4px_20px_rgba(23,100,252,0.2)] transition-colors hover:bg-[#084FE3]"
          style={{
            backgroundColor: COLORS.primary,
            height: 'calc(3.25rem + env(safe-area-inset-bottom, 0px))',
            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          }}
          aria-label={t('support_chat_open')}
        >
          {!open ? (
            <UnreadBadge count={unreadCount} className="right-4 top-2" />
          ) : null}
          {open ? t('support_chat_close') : t('support_chat_bar_label')}
        </button>
      </div>,
      document.body,
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-[80] max-md:bottom-4 max-md:right-4">
      {panel}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_4px_20px_rgba(23,100,252,0.35)] transition hover:scale-105 hover:bg-[#084FE3]"
        style={{ backgroundColor: COLORS.primary }}
        aria-label={t('support_chat_open')}
      >
        {!open ? <UnreadBadge count={unreadCount} /> : null}
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
