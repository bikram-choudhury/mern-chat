import React from 'react';
import PropTypes from 'prop-types';
import { SERVER } from '../../settings';
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
    const { name, type, path } = props;
    const category = getCategoryFromType(type);
    return (
        <div className="preview-container">
            {
                {
                    'image': (
                        <img
                            src={`${SERVER}/${path}`}
                            alt={name}
                            className="file"
                        />
                    ),
                    'video': (
                        <video controls className="file">
                            <source src={`${SERVER}/${path}`} type={type} />
                        </video>
                    )
                }[category]
            }
        </div>
    );
}

FileViewer.propTypes = {
    name: PropTypes.string,
    type: PropTypes.string,
    path: PropTypes.string
}

export default FileViewer;