import Button from '@mui/material/Button';
import React, { useEffect, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { dlt, post } from '../../utils/requests';
import FileViewer from '../FileViewer';

export default function ({
  setFileId,
  viewer = null,
  documentId = null,
  fileId = null,
  focusElId = null,
  inDataGrid = false,
}) {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const fileToBase64 = (f, cb) => {
    const reader = new FileReader();
    reader.readAsDataURL(f);
    reader.onload = function () {
      cb(null, reader.result);
    };
    reader.onerror = function (error) {
      cb(error, null);
    };
  };
  const onUploadFileChange = ({ target }) => {
    if (target.files < 1 || !target.validity.valid) {
      return;
    }
    fileToBase64(target.files[0], (err, result) => {
      if (result) {
        setFile(result);
        setFileName(target.files[0].name);
      }
    });
  };
  const deleteFile = () => {
    dlt({ viewer, documentId }, `files/${fileId}`, () => {
      setFileId((prevState) => (prevState === null ? 0 : null));
      setFileName(null);
    }, null);
  };

  useEffect(() => {
    if (fileName) {
      post({
        viewer, documentId, file, fileName,
      }, 'files', (data) => {
        if (data.id) {
          setFileId(data.id);
          const documentRefElement = document.querySelector(
            `[id=${focusElId}]`,
          );
          if (documentRefElement) setTimeout(() => documentRefElement.focus(), 100);
        }
      }, null);
    }
  }, [fileName]);
  useEffect(() => {
    if (!fileId) {
      setFileName(null);
    }
  }, [fileId]);
  return (
    <>
      {fileId && inDataGrid ? (
        <FileViewer fileId={fileId} deleteFile={deleteFile} />
      ) : (
        <>
          {fileName ? (
            <>
              {
                                inDataGrid ? (
                                  <LoadingButton loading variant="outlined">
                                    {fileName}
                                  </LoadingButton>
                                ) : (
                                  <Button
                                    variant="raised"
                                    component="span"
                                    startIcon={<DeleteIcon color="red" />}
                                    onClick={deleteFile}
                                  >
                                    {fileName}
                                  </Button>
                                )
                            }
            </>
          ) : (
            <>
              <input
                accept="application/pdf"
                style={{ display: 'none' }}
                id={documentId ? `raised-button-file-${documentId}` : 'raised-button-file'}
                multiple
                type="file"
                onChange={onUploadFileChange}
              />
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor={documentId ? `raised-button-file-${documentId}` : 'raised-button-file'}>
                <Button variant="raised" component="span">
                  hochladen
                </Button>
              </label>
            </>
          )}

        </>
      )}
    </>
  );
}
