import React from 'react';
import { CreateProjectModal } from '@/features/create-project/ui/CreateProjectModal';
import { CreateFolderModal } from '@/features/create-folder/ui/CreateFolderModal';
import { CreateLayoutModal } from '@/features/create-layout/ui/CreateLayoutModal';

export const Modals = () => {
  return (
    <>
      <CreateProjectModal />
      <CreateFolderModal />
      <CreateLayoutModal />
    </>
  );
};