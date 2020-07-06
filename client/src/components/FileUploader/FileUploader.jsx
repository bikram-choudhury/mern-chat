import React, { createRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';
import { SERVER } from '../../settings';

const FileUploader = props => {
    const { handleOnLoad, meetingId } = props;
    const inputRef = createRef();

    const handleChange = event => {
        event.preventDefault();
        if (event.target.files && event.target.files.length) {
            const file = event.target.files[0];
            // preview: URL.createObjectURL(file),
            const formData = new FormData();
            formData.append('file', file);

            const config = {
                header: { 'content-type': 'multipart/form-data' }
            }
            Axios.post(`${SERVER}/api/uploadFiles/${meetingId}`, formData, config)
                .then(({ data }) => {
                    handleOnLoad({
                        name: file.name,
                        type: file.type,
                        path: data.filePath
                    })
                })
                .catch(error => console.error(error));
        }
    };

    const handleUpload = event => {
        event.stopPropagation();
        inputRef.current.click();
    };

    return (
        <Fragment>
            <input
                type="file"
                className="hidden"
                ref={holder => inputRef.current = holder}
                onChange={handleChange}
            />
            <button className="btn btn-primary upload-btn" onClick={handleUpload}>
                <i className="fa fa-paperclip attachment" aria-hidden="true"></i>
            </button>
        </Fragment>
    );
};

FileUploader.propTypes = {
    handleOnLoad: PropTypes.func.isRequired,
    meetingId: PropTypes.string.isRequired
}
export default FileUploader;