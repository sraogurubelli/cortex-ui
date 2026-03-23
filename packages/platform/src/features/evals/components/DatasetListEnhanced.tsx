// @ts-nocheck
/**
 * Enhanced Dataset List Component
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
import { DatasetCardEnhanced } from './DatasetCardEnhanced';
import { useDatasets, useCreateDataset, useDeleteDataset } from '../hooks/useDatasets';
import { datasetFormDefinition, type DatasetFormValues } from '../forms/dataset-form';
import type { EvalsDatasetResponse } from '../api/types';

export interface DatasetListEnhancedProps {
  onSelectDataset?: (uuid: string) => void;
  page?: number;
  limit?: number;
}

export function DatasetListEnhanced({
  onSelectDataset,
  page = 0,
  limit = 20,
}: DatasetListEnhancedProps) {
  const { data, isLoading, error } = useDatasets(page, limit);
  const createDataset = useCreateDataset();
  const deleteDataset = useDeleteDataset();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; dataset: EvalsDatasetResponse | null }>({
    isOpen: false,
    dataset: null
  });
  const [activeTab, setActiveTab] = useState('all');

  const resolver = useZodValidationResolver(datasetFormDefinition, {
    requiredMessage: 'This field is required'
  });

  const handleCreateSubmit = async (values: DatasetFormValues) => {
    try {
      await createDataset.mutateAsync({
        name: values.name,
        identifier: values.identifier,
        description: values.description
      });

      showToast.success('Dataset created', {
        description: `Dataset "${values.name}" has been created successfully`
      });

      setIsCreateDialogOpen(false);
    } catch (err) {
      showToast.error('Failed to create dataset', {
        description: err instanceof Error ? err.message : 'Unknown error occurred'
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm.dataset) return;

    try {
      await deleteDataset.mutateAsync(deleteConfirm.dataset.uuid);

      showToast.success('Dataset deleted', {
        description: `Dataset "${deleteConfirm.dataset.name}" has been deleted`
      });

      setDeleteConfirm({ isOpen: false, dataset: null });
    } catch (err) {
      showToast.error('Failed to delete dataset', {
        description: err instanceof Error ? err.message : 'Unknown error occurred'
      });
    }
  };

  const datasets = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="p-8 text-center" style={{ color: 'var(--cn-text-subtle)' }}>
        Loading datasets...
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
    <div className="evals-dataset-list-enhanced">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold" style={{ color: 'var(--cn-text-default)' }}>
            Datasets
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--cn-text-muted)' }}>
            Manage evaluation datasets for testing AI models
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} variant="primary">
          Create Dataset
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Datasets ({datasets.length})</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {datasets.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg mb-2" style={{ color: 'var(--cn-text-subtle)' }}>
                No datasets yet
              </p>
              <p className="text-sm mb-4" style={{ color: 'var(--cn-text-muted)' }}>
                Create your first dataset to get started with evaluations
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)} variant="outline">
                Create Dataset
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {datasets.map((dataset: EvalsDatasetResponse) => (
                <div key={dataset.uuid} className="relative group">
                  <DatasetCardEnhanced dataset={dataset} onSelect={onSelectDataset} />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirm({ isOpen: true, dataset });
                    }}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recent" className="mt-6">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {datasets
              .sort((a, b) => {
                const dateA = new Date(a.updated_at || a.created_at || 0).getTime();
                const dateB = new Date(b.updated_at || b.created_at || 0).getTime();
                return dateB - dateA;
              })
              .slice(0, 6)
              .map((dataset: EvalsDatasetResponse) => (
                <DatasetCardEnhanced
                  key={dataset.uuid}
                  dataset={dataset}
                  onSelect={onSelectDataset}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Dataset Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Dataset</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <RootForm
              defaultValues={collectDefaultValues(datasetFormDefinition.inputs)}
              resolver={resolver}
              mode="onSubmit"
              validateAfterFirstSubmit={true}
              onSubmit={handleCreateSubmit}
            >
              {(rootForm) => (
                <>
                  <RenderForm factory={inputFactory} formDefinition={datasetFormDefinition} />
                  <DialogFooter className="mt-6">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => rootForm.submitForm()}
                      disabled={createDataset.isPending}
                    >
                      {createDataset.isPending ? 'Creating...' : 'Create'}
                    </Button>
                  </DialogFooter>
                </>
              )}
            </RootForm>
          </DialogBody>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirm.isOpen} onOpenChange={(open) => setDeleteConfirm({ isOpen: open, dataset: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Dataset</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <p style={{ color: 'var(--cn-text-default)' }}>
              Are you sure you want to delete the dataset "{deleteConfirm.dataset?.name}"?
            </p>
            <p className="mt-2 text-sm" style={{ color: 'var(--cn-text-muted)' }}>
              This action cannot be undone. All items in this dataset will also be deleted.
            </p>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm({ isOpen: false, dataset: null })}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteDataset.isPending}
            >
              {deleteDataset.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </AlertDialog>
    </div>
  );
}
