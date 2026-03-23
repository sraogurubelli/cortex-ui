/**
 * ChatPage — Full-screen chat interface wired to the current project.
 *
 * Uses the `useChat` hook from @cortex/core and renders the chat area
 * with a conversation history sidebar.
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Chat,
  ChatPanel,
  useChat,
  useProject,
  type UIActionEvent,
} from '@cortex/core';

export function ChatPage() {
  const navigate = useNavigate();
  const { currentProject } = useProject();

  const projectUid = currentProject?.id ?? '';

  const handleUIAction = (action: UIActionEvent) => {
    switch (action.action_type) {
      case 'navigate':
        navigate(String(action.args.page_id ?? '/'));
        break;
      case 'show_document':
        navigate(`/documents?doc=${action.args.document_id}`);
        break;
      case 'open_search':
        navigate(`/documents?q=${encodeURIComponent(String(action.args.query ?? ''))}`);
        break;
      default:
        console.log('Unhandled UI action:', action);
    }
  };

  const {
    messages,
    threads,
    activeThreadId,
    isStreaming,
    sendMessage,
    selectThread,
    deleteThread,
    newThread,
    loadThreads,
  } = useChat({
    projectUid,
    onUIAction: handleUIAction,
  });

  useEffect(() => {
    if (projectUid) {
      loadThreads();
    }
  }, [projectUid, loadThreads]);

  if (!currentProject) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8">
          <p className="text-cn-text-foreground-2 text-lg mb-2">No project selected</p>
          <p className="text-cn-text-foreground-3 text-sm">
            Select a project from the sidebar to start chatting.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Conversation sidebar */}
      <ChatPanel
        threads={threads}
        activeThreadId={activeThreadId}
        onSelectThread={selectThread}
        onDeleteThread={deleteThread}
        onNewThread={newThread}
        collapsible
        defaultCollapsed={false}
      />

      {/* Chat area */}
      <div className="flex-1 min-w-0">
        <Chat
          messages={messages}
          onSendMessage={sendMessage}
          loading={isStreaming}
          title={currentProject.name}
          placeholder="Ask anything about your project..."
          quickActions={[
            {
              id: 'search-docs',
              label: 'Search documents',
              icon: 'search',
              onClick: () => sendMessage('What documents are available in this project?'),
            },
            {
              id: 'summarize',
              label: 'Summarize project',
              icon: 'file-text',
              onClick: () => sendMessage('Give me a summary of this project.'),
            },
          ]}
        />
      </div>
    </div>
  );
}
