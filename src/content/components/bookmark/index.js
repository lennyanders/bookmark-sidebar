import { enableClickOpenCloseFolder, enableDragoverOpenFolder } from './folder';
import {
  enablePrevNextFocus,
  enableLeftRightKeyCloseOpenFolder,
  enableRightClickEditing,
} from './keyboard';
import { enableDragAndDrop } from './dragAndDrop';

export const enableBookmarkFeatures = () => {
  enableClickOpenCloseFolder();
  enableDragoverOpenFolder();

  enablePrevNextFocus();
  enableLeftRightKeyCloseOpenFolder();
  enableRightClickEditing();

  enableDragAndDrop();
};
