import React, { createRef, Fragment, useState } from 'react';
import { encodeImageToBase64 } from '../../Utils/Utils';

const FileUploader = props => {
    const { handleOnLoad } = props;
    const inputRef = createRef();
    const [file, setFile] = useState({ preview: '', raw: '', type: '' });

    const handleChange = event => {
        event.preventDefault();
        if (event.target.files && event.target.files.length) {
            const file = event.target.files[0];
            setFile({
                preview: URL.createObjectURL(file),
                raw: file
            });
            encodeImageToBase64(file)
                .then(base64File => {
                    handleOnLoad(base64File);
                    inputRef.current.reset();
                })
                .catch(error => console.log("encodeImageToBase64 error:", error));
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
}

export default FileUploader;