import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import './ResizableTextarea.scss';

const ResizableTextarea = props => {
    const {
        value,
        placeholder,
        changed
    } = props;
    let minRows = 1;
    const maxRows = 5;
    const [rows, setRows] = useState(minRows);

    useEffect(() => {
        if (!value) {
            setRows(minRows);
        }
    }, [value, minRows]);

    const handleChange = ({ target }) => {
        const lineHeight = 24;
        const previousRows = target.rows;
        target.rows = minRows; // reset number of rows in textarea 
        const currentRows = ~~(target.scrollHeight / lineHeight);
        if (currentRows === previousRows) {
            target.rows = currentRows;
        }
        if (currentRows >= maxRows) {
            target.rows = maxRows;
            target.scrollTop = target.scrollHeight;
        }
        const newRows = currentRows < maxRows ? currentRows : maxRows;
        setRows(newRows);
        changed(target.value);
    }
    return (
        <textarea
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            rows={rows}
        ></textarea>
    );
}

ResizableTextarea.propTypes = {
    value: PropTypes.string,
    placeholder: PropTypes.string,
    changed: PropTypes.func
}

export default ResizableTextarea;