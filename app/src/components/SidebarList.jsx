import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { List } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Toggle from 'material-ui/Toggle';

import i18n from 'd2-i18n';

import * as actions from 'constants/actions';
import history from 'utils/history';

import MessageTypeItem from './MessageTypeItem';
import theme from '../styles/theme';

const moment = require('moment');

class SidebarList extends Component {
    componentWillMount() {
        this.props.setSelectedMessageType(this.props.match.params.messageType);
    }

    render() {
        const gridColumn = this.props.gridColumn;
        const messageTypes = this.props.messageTypes;

        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: 'calc(100vh - 95px)',
                    gridArea: `2 / ${gridColumn} / span 1 / span 1`,
                    borderLeftStyle: gridColumn === 2 && 'solid',
                    borderLeftWidth: '0.5px',
                    borderLeftColor: theme.palette.accent4Color,
                    borderRightStyle: 'solid',
                    borderRightWidth: '1px',
                    borderRightColor: theme.palette.accent4Color,
                    overflowY: 'hidden',
                    minWidth: '200px',
                }}
            >
                <List
                    style={{
                        padding: '0px',
                        height: 'calc(100vh - 150px)',
                    }}
                >
                    {messageTypes &&
                        messageTypes.map(messageType => (
                            <div key={messageType.id}>
                                <MessageTypeItem
                                    messageType={messageType}
                                    onClick={() => {
                                        this.props.setSelectedMessageType(messageType.id);
                                        history.push(`/${messageType.id}`);
                                    }}
                                    selectedMessageType={this.props.selectedMessageType}
                                    loading={messageType.loading}
                                />
                                <Divider />
                            </div>
                        ))}
                </List>
                <Toggle
                    style={{ width: '', margin: '0px 20px 0px 20px' }}
                    label={`${i18n.t('Auto refresh')} (${moment(this.props.counter).format(
                        'mm:ss',
                    )})`}
                    toggled={this.props.autoRefresh}
                    onToggle={() => this.props.setAutoRefresh(!this.props.autoRefresh)}
                />
            </div>
        );
    }
}

export default compose(
    connect(
        state => ({
            selectedMessageType: state.messaging.selectedMessageType,
            messageTypes: state.messaging.messageTypes,
        }),
        dispatch => ({
            setSelectedMessageType: messageTypeId =>
                dispatch({ type: actions.SET_SELECTED_MESSAGE_TYPE, payload: { messageTypeId } }),
            clearCheckedIds: () => dispatch({ type: actions.CLEAR_CHECKED }),
        }),
        null,
        { pure: false },
    ),
)(SidebarList);
