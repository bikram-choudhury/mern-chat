import React, { Fragment } from 'react';
import { decodeBase64FileUrl } from '../../Utils/Utils';
import './FileViewer.scss';

function getCategoryFromType(fileType) {
    if (/image/ig.test(fileType)) {
        return 'image';
    } else if (/video/ig.test(fileType)) {
        return 'video';
    } else {
        return 'others';
    }
}

const FileViewer = props => {
    const { file, name } = props;
    const { type, blobFile } = decodeBase64FileUrl(file);
    const category = getCategoryFromType(type);
    return (
        <div className="preview-container">
            {
                {
                    'image': (
                        <img
                            src={file}
                            alt={name}
                            className="file"
                        />
                    ),
                    'video': (
                        <video controls className="file">
                            <source src={blobFile} type={type} />
                        </video>
                    )
                }[category]
            }
        </div>
    );
}

export default FileViewer;