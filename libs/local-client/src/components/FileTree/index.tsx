import React from 'react';
import FolderTree, { testData } from 'react-folder-tree';

import 'react-folder-tree/dist/style.css';


export const FileTree = () => {
  const onTreeStateChange = (state, event) => console.log(state, event);
  console.log(testData)
  return (
    <FolderTree
      data={testData}
      onChange={onTreeStateChange}
      showCheckbox={false} 
    />
  );
};
export default FileTree;