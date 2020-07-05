import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { SERVER } from '../../settings';
import './FileViewer.scss';
import { getFirstTwoLetters } from '../../Utils/Utils';

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
    const { name, type, path, sender } = props;
    const firstLetters = getFirstTwoLetters(sender.name);
    const category = getCategoryFromType(type);

    /* const downloadFile = filePath => {
        const api = `${SERVER}/api/download?filePath=${encodeURIComponent(filePath)}`;
        const anchor = document.createElement('a');
        anchor.href = api;
        anchor.click();
    } */
    return (
        <Fragment>
            {
                firstLetters ? (
                    <div className="user-img">
                        <div className="first-letters">{firstLetters}</div>
                    </div>
                ) : null
            }
            <div className={`preview-container ${category}`}>
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
                        ),
                        'others': (
                            <div className="file" onClick={() => downloadFile(path)}>
                                <span>{name}</span>
                            </div>
                        )
                    }[category]
                }
            </div>
        </Fragment>
    );
}

FileViewer.propTypes = {
    name: PropTypes.string,
    type: PropTypes.string,
    path: PropTypes.string,
    sender: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string
    })
}

export default FileViewer;