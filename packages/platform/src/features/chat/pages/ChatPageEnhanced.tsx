// @ts-nocheck
/**
 * Enhanced ChatPage with Settings
 *
 * Full-screen chat interface with configurable model settings.
 * Uses @cortex/core Chat component with settings dialog.
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Chat,
  ChatPanel,
  useChat,
  useProject,
  type UIActionEvent,
} from '@cortex/core';
import { RootForm, RenderForm, useZodValidationResolver, collectDefaultValues } from '@harnessio/forms';
import { inputFactory } from '../../../forms/input-factory';
import { Button, Dialog, Tooltip, TooltipProvider } from '@harnessio/ui/components';

const DialogContent = (p: any) => <div {...p} />;
const DialogHeader = (p: any) => <div {...p} />;
const DialogTitle = (p: any) => <div {...p} />;
const DialogBody = (p: any) => <div {...p} />;
const DialogFooter = (p: any) => <div {...p} />;
const Badge = ({ children, ...props }: any) => <span {...props}>{children}</span>;
const TooltipTrigger = (p: any) => <span {...p} />;
const TooltipContent = (p: any) => <div {...p} />;
import { showToast } from '../../../components/ui/toast';
import { chatSettingsFormDefinition, type ChatSettingsFormValues } from '../forms/chat-settings-form';

export function ChatPageEnhanced() {
  const navigate = useNavigate();
  const { currentProject } = useProject();
  const projectUid = currentProject?.id ?? '';

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<ChatSettingsFormValues>({
    model: 'gpt-4',
    temperature: 0.7,
    max_tokens: 2000,
    top_p: 1.0,
    stream: true
  });

  const resolver = useZodValidationResolver(chatSettingsFormDefinition, {
    requiredMessage: 'This field is required'
  });

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
    newThread,
    loadThreads,
  } = useChat({
    projectUid,
    onUIAction: handleUIAction,
    // Pass settings to useChat hook (if supported)
    // model: settings.model,
    // temperature: settings.temperature,
    // etc.
  });

  useEffect(() => {
    if (projectUid) {
      loadThreads();
    }
  }, [projectUid, loadThreads]);

  const handleSettingsSubmit = (values: ChatSettingsFormValues) => {
    setSettings(values);
    showToast.success('Settings updated', {
      description: `Using model: ${values.model}`
    });
    setIsSettingsOpen(false);
  };

  const handleResetSettings = () => {
    const defaultSettings: ChatSettingsFormValues = {
      model: 'gpt-4',
      temperature: 0.7,
      max_tokens: 2000,
      top_p: 1.0,
      stream: true
    };
    setSettings(defaultSettings);
    showToast.success('Settings reset to defaults');
  };

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
        onNewThread={newThread}
        collapsible
        defaultCollapsed={false}
      />

      {/* Chat area */}
      <div className="flex-1 min-w-0 relative">
        {/* Settings Button */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          {/* Model Badge */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="outline" className="cursor-help">
                  {settings.model}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-xs">
                  <p className="font-medium mb-1">Current Settings</p>
                  <p>Model: {settings.model}</p>
                  <p>Temperature: {settings.temperature}</p>
                  <p>Max Tokens: {settings.max_tokens}</p>
                  <p>Streaming: {settings.stream ? 'On' : 'Off'}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Settings Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSettingsOpen(true)}
          >
            Settings
          </Button>
        </div>

        {/* Chat Component */}
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
            {
              id: 'settings',
              label: 'Change settings',
              icon: 'settings',
              onClick: () => setIsSettingsOpen(true),
            }
          ]}
        />
      </div>

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chat Settings</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <RootForm
              defaultValues={{ ...settings }}
              resolver={resolver}
              mode="onSubmit"
              validateAfterFirstSubmit={true}
              onSubmit={handleSettingsSubmit}
            >
              {(rootForm) => (
                <>
                  <RenderForm factory={inputFactory} formDefinition={chatSettingsFormDefinition} />
                  <DialogFooter className="mt-6 flex justify-between items-center">
                    <Button
                      variant="ghost"
                      onClick={handleResetSettings}
                      type="button"
                    >
                      Reset to Defaults
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
                        Cancel
                      </Button>
                      <Button variant="primary" onClick={() => rootForm.submitForm()}>
                        Save Settings
                      </Button>
                    </div>
                  </DialogFooter>
                </>
              )}
            </RootForm>
          </DialogBody>
        </DialogContent>
      </Dialog>
    </div>
  );
}
