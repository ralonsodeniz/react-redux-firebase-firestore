import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

import { openModal } from "../../redux/modal/actions";
import { uploadFileToStorage } from "../../firebase/firebase.utils";

import CircularProgress from "../circular-progress/circular-progress";
import CustomButton from "../custom-button/custom-button";

import {
  UploadFileContainer,
  CircularProgressContainer,
  UpdateFileContainer,
  InputFileContainer,
  LabelFileContainer
} from "./file-uploader.styles";

const FileUploader = ({
  fileType,
  directory,
  fileName,
  urlAction,
  additionalAction,
  labelText,
  submitText,
  disabled,
  maxFileSizeInMB
}) => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleFileChange = useCallback(
    event => {
      if (event.target.files.length > 1) {
        const invalidNumberOfFilesModalData = {
          modalType: "SYSTEM_MESSAGE",
          modalProps: {
            text: "Please choose only one file"
          }
        };
        return dispatch(openModal(invalidNumberOfFilesModalData));
      }
      setFile(event.target.files[0]);
    },
    [dispatch]
  );

  const fileTypesRegex = {
    image: /\.(jpe?g|png|gif)$/i,
    video: /\.(avi|wmv|flv|mpg|mp4)$/i,
    imageOrvideo: /\.(jpe?g|png|gif|avi|wmv|flv|mpg|mp4)$/i
  };

  const handleFileUpload = useCallback(() => {
    if (file) {
      if (fileTypesRegex[fileType]) {
        if (fileTypesRegex[fileType].test(file.name)) {
          let proofFileType = "";
          if (fileType === "imageOrvideo") {
            proofFileType = fileTypesRegex.image.test(file.name)
              ? "image"
              : "video";
          } else {
            proofFileType = fileType
          }
          const fileSize = file.size / 1024 / 1024;
          if (fileSize > maxFileSizeInMB) {
            const invalidFileSizeModalData = {
              modalType: "SYSTEM_MESSAGE",
              modalProps: {
                text: `File is ${fileSize.toFixed(
                  2
                )} MB and the maximun file size is ${maxFileSizeInMB} MB`
              }
            };
            return dispatch(openModal(invalidFileSizeModalData));
          }

          uploadFileToStorage(
            directory,
            fileName,
            file,
            setProgress,
            setLoading,
            setFile,
            urlAction(proofFileType),
            additionalAction
          );
        } else {
          const invalidFileTypeModalData = {
            modalType: "SYSTEM_MESSAGE",
            modalProps: {
              text: "File type is not supported"
            }
          };
          dispatch(openModal(invalidFileTypeModalData));
        }
      } else {
        const incorrectFileTypeModalData = {
          modalType: "SYSTEM_MESSAGE",
          modalProps: {
            text: "Incorrect file type, choose image or video"
          }
        };
        dispatch(openModal(incorrectFileTypeModalData));
      }
    } else {
      const notFileSelectedModalData = {
        modalType: "SYSTEM_MESSAGE",
        modalProps: {
          text: "Please select a file first"
        }
      };
      dispatch(openModal(notFileSelectedModalData));
    }
  }, [
    dispatch,
    file,
    fileType,
    fileTypesRegex,
    urlAction,
    directory,
    fileName,
    additionalAction,
    maxFileSizeInMB
  ]);

  return (
    <UploadFileContainer>
      {loading ? (
        <CircularProgressContainer>
          <CircularProgress
            radius={34}
            progress={progress}
            color={"black"}
            backgroundColor={"transparent"}
          />
        </CircularProgressContainer>
      ) : (
        <UpdateFileContainer>
          <InputFileContainer
            type="file"
            id="file"
            name="file"
            onChange={handleFileChange}
            disabled={disabled}
          />
          <LabelFileContainer htmlFor="file">{labelText}</LabelFileContainer>
          <CustomButton
            type="button"
            text={submitText}
            onClick={handleFileUpload}
            disabled={disabled || !file}
          />
        </UpdateFileContainer>
      )}
    </UploadFileContainer>
  );
};

FileUploader.propTypes = {
  fileType: PropTypes.string.isRequired,
  directory: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  urlAction: PropTypes.func.isRequired,
  additionalAction: PropTypes.func,
  labelText: PropTypes.string.isRequired,
  submitText: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  maxFileSizeInMB: PropTypes.number.isRequired
};

export default FileUploader;
