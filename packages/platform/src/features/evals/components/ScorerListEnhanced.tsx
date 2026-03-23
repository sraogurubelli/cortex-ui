// @ts-nocheck
/**
 * Enhanced Scorer List Component
 *
 * Enhanced version with Canary UI, forms, dialogs, and CRUD operations.
 */

import { useState } from 'react';
import { RootForm, RenderForm, useZodValidationResolver, collectDefaultValues } from '@harnessio/forms';
import { inputFactory } from '../../../forms/input-factory';
import { Button, Dialog, Tabs, AlertDialog } from '@harnessio/ui/components';

const DialogContent = (p: any) => <div {...p} />;
const DialogHeader = (p: any) => <div {...p} />;
const DialogTitle = (p: any) => <div {...p} />;
const DialogBody = (p: any) => <div {...p} />;
const DialogFooter = (p: any) => <div {...p} />;
const TabsList = (p: any) => <div {...p} />;
const TabsTrigger = (p: any) => <button type="button" {...p} />;
const TabsContent = (p: any) => <div {...p} />;
import { showToast } from '../../../components/ui/toast';
import { ScorerCardEnhanced } from './ScorerCardEnhanced';
import { useScorers, useCreateScorer, useDeleteScorer } from '../hooks/useScorers';
import { scorerFormDefinition, type ScorerFormValues } from '../forms/scorer-form';
import type { ScorerResponse } from '../api/types';

export interface ScorerListEnhancedProps {
  onSelectScorer?: (uuid: string) => void;
  page?: number;
  limit?: number;
}

export function ScorerListEnhanced({
  onSelectScorer,
  page = 0,
  limit = 20,
}: ScorerListEnhancedProps) {
  const { data, isLoading, error } = useScorers(page, limit);
  const createScorer = useCreateScorer();
  const deleteScorer = useDeleteScorer();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; scorer: ScorerResponse | null }>({
    isOpen: false,
    scorer: null
  });
  const [activeTab, setActiveTab] = useState('all');

  const resolver = useZodValidationResolver(scorerFormDefinition, {
    requiredMessage: 'This field is required'
  });

  const handleCreateSubmit = async (values: ScorerFormValues) => {
    try {
      await createScorer.mutateAsync({
        name: values.name,
        identifier: values.identifier,
        type: values.type,
        description: values.description,
        config: values.config
      });

      showToast.success('Scorer created', {
        description: `Scorer "${values.name}" has been created successfully`
      });

      setIsCreateDialogOpen(false);
    } catch (err) {
      showToast.error('Failed to create scorer', {
        description: err instanceof Error ? err.message : 'Unknown error occurred'
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm.scorer) return;

    try {
      await deleteScorer.mutateAsync(deleteConfirm.scorer.uuid);

      showToast.success('Scorer deleted', {
        description: `Scorer "${deleteConfirm.scorer.name}" has been deleted`
      });

      setDeleteConfirm({ isOpen: false, scorer: null });
    } catch (err) {
      showToast.error('Failed to delete scorer', {
        description: err instanceof Error ? err.message : 'Unknown error occurred'
      });
    }
  };

  const scorers = data?.data ?? [];

  // Group scorers by type for the "By Type" tab
  const scorersByType = scorers.reduce((acc, scorer) => {
    const type = scorer.type || 'unknown';
    if (!acc[type]) acc[type] = [];
    acc[type].push(scorer);
    return acc;
  }, {} as Record<string, ScorerResponse[]>);

  if (isLoading) {
    return (
      <div className="p-8 text-center" style={{ color: 'var(--cn-text-subtle)' }}>
        Loading scorers...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center" style={{ color: 'var(--cn-destructive-default)' }}>
        Error: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="evals-scorer-list-enhanced">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold" style={{ color: 'var(--cn-text-default)' }}>
            Scorers
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--cn-text-muted)' }}>
            Manage evaluation scorers for assessing model outputs
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} variant="primary">
          Create Scorer
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Scorers ({scorers.length})</TabsTrigger>
          <TabsTrigger value="by-type">By Type</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {scorers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg mb-2" style={{ color: 'var(--cn-text-subtle)' }}>
                No scorers yet
              </p>
              <p className="text-sm mb-4" style={{ color: 'var(--cn-text-muted)' }}>
                Create your first scorer to evaluate model outputs
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)} variant="outline">
                Create Scorer
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {scorers.map((scorer: ScorerResponse) => (
                <div key={scorer.uuid} className="relative group">
                  <ScorerCardEnhanced scorer={scorer} onSelect={onSelectScorer} />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirm({ isOpen: true, scorer });
                    }}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="by-type" className="mt-6">
          {Object.entries(scorersByType).map(([type, typeScorers]) => (
            <div key={type} className="mb-8">
              <h3 className="text-lg font-medium mb-4 capitalize" style={{ color: 'var(--cn-text-default)' }}>
                {type.replace('_', ' ')} ({typeScorers.length})
              </h3>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {typeScorers.map((scorer: ScorerResponse) => (
                  <ScorerCardEnhanced
                    key={scorer.uuid}
                    scorer={scorer}
                    onSelect={onSelectScorer}
                  />
                ))}
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="recent" className="mt-6">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {scorers
              .sort((a, b) => {
                const dateA = new Date(a.updated_at || a.created_at || 0).getTime();
                const dateB = new Date(b.updated_at || b.created_at || 0).getTime();
                return dateB - dateA;
              })
              .slice(0, 6)
              .map((scorer: ScorerResponse) => (
                <ScorerCardEnhanced
                  key={scorer.uuid}
                  scorer={scorer}
                  onSelect={onSelectScorer}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Scorer Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Scorer</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <RootForm
              defaultValues={collectDefaultValues(scorerFormDefinition.inputs)}
              resolver={resolver}
              mode="onSubmit"
              validateAfterFirstSubmit={true}
              onSubmit={handleCreateSubmit}
            >
              {(rootForm) => (
                <>
                  <RenderForm factory={inputFactory} formDefinition={scorerFormDefinition} />
                  <DialogFooter className="mt-6">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => rootForm.submitForm()}
                      disabled={createScorer.isPending}
                    >
                      {createScorer.isPending ? 'Creating...' : 'Create'}
                    </Button>
                  </DialogFooter>
                </>
              )}
            </RootForm>
          </DialogBody>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirm.isOpen} onOpenChange={(open) => setDeleteConfirm({ isOpen: open, scorer: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Scorer</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <p style={{ color: 'var(--cn-text-default)' }}>
              Are you sure you want to delete the scorer "{deleteConfirm.scorer?.name}"?
            </p>
            <p className="mt-2 text-sm" style={{ color: 'var(--cn-text-muted)' }}>
              This action cannot be undone.
            </p>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm({ isOpen: false, scorer: null })}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteScorer.isPending}
            >
              {deleteScorer.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </AlertDialog>
    </div>
  );
}
