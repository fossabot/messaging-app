import React from 'react';

import IconButton from 'material-ui/IconButton';

import Delete from 'material-ui-icons/Delete';
import MarkUnread from 'material-ui-icons/Markunread';
import Done from 'material-ui-icons/Done';

const CustomFontIcon = ({ child, selectedValue, onClick, icon, tooltip }) => {
    return (
        <IconButton
            style={{
                marginTop: '0px',
                padding: '0px',
            }}
            tooltip={tooltip}
            tooltipPosition="bottom-left"
        >
            {icon === 'delete' && (
                <Delete
                    onClick={event => {
                        event.stopPropagation();
                        event.preventDefault();

                        if (child) {
                            selectedValue !== child.id && onClick(child);
                        } else onClick();
                    }}
                />
            )}

            {icon === 'markunread' && (
                <MarkUnread
                    onClick={event => {
                        event.stopPropagation();
                        event.preventDefault();

                        if (child) {
                            selectedValue !== child.id && onClick(child);
                        } else onClick();
                    }}
                />
            )}

            {icon === 'done' && (
                <Done
                    onClick={event => {
                        event.stopPropagation();
                        event.preventDefault();

                        if (child) {
                            selectedValue !== child.id && onClick(child);
                        } else onClick();
                    }}
                />
            )}
        </IconButton>
    );
};

export default CustomFontIcon;
