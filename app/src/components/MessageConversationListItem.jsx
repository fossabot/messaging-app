import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, pure, lifecycle } from 'recompose';

import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader/Subheader';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import Checkbox from 'material-ui/Checkbox';

import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';

import Message from './Message'
import ReplyCard from './ReplyCard'
import CustomFontIcon from './CustomFontIcon'
import CustomDropDown from './CustomDropDown'
import SuggestionField from './SuggestionField'

import { messageConversationContainer, messagePanelContainer, subheader_minilist } from '../styles/style';
import theme from '../styles/theme';
import history from 'utils/history';
import * as actions from 'constants/actions';

const NOTIFICATIONS = ['SYSTEM', 'VALIDATION_RESULT']

class MessageConversationListItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      backgroundColor: theme.palette.canvasColor,
      expanded: props.expanded != undefined ? props.expanded : true,
      cursor: 'auto',
    }
  }

  getBackgroundColor = (id) => {
    if (this.props.selectedMessageConversation && id == this.props.selectedMessageConversation.id) {
      return theme.palette.accent3Color
    } else {
      return this.state.backgroundColor
    }
  };

  onClick = (messageConversation) => {
    this.props.setSelectedMessageConversation(messageConversation)
    if (messageConversation && !messageConversation.read) {
      this.props.markMessageConversationsRead([messageConversation.id], this.props.selectedMessageType)
    }
    history.push(`/${messageConversation.messageType}/${messageConversation.id}`)
  }

  onMouseEnter = () => { this.setState({ cursor: 'pointer' }) }
  onMouseLeave = () => { this.setState({ cursor: 'auto' }) }

  updateMessageConversation = (updateMessageConversation, messageConversation, identifier, key) => {
    switch (identifier) {
      case 'STATUS':
        messageConversation.status = key;
        break;
      case 'PRIORITY':
        messageConversation.priority = key;
        break;
      case 'ASSIGNEE':
        messageConversation.assignee = key;
        break;
    }

    updateMessageConversation(messageConversation, identifier)
  }

  updateMessageConversationStatus = (child, identifier) => {
    this.props.updateMessageConversationStatus(child, identifier)
  }

  updateMessageConversationPriority = (child, identifier) => {
    this.props.updateMessageConversationPriority(child, identifier)
  }

  updateMessageConversationAssignee = (child, identifier) => {
    this.props.updateMessageConversationAssignee(child, identifier)
  }

  markUnread = (child) => {
    this.props.markMessageConversationsUnread([child.id], this.props.selectedMessageType)
  }

  deleteMessageConversations = (child) => {
    this.props.deleteMessageConversation(child.id, this.props.selectedMessageType)
  }

  render() {
    const messageConversation = this.props.messageConversation;
    const assigneValue = messageConversation.assignee != undefined ? messageConversation.assignee.displayName : 'None';
    const message = messageConversation.messages[0]
    const title = !this.props.notification ? message.sender.displayName : this.props.selectedMessageType.displayName
    const checked = _.find(this.props.checkedIds, {'id' : messageConversation.id}) != undefined

    return (
      <Paper style={{
        backgroundColor: this.getBackgroundColor(messageConversation.id),
        display: 'grid',
        gridTemplateColumns: '90% 10%',
        gridTemplateRows: '10% 90%',
        transition: 'all 0.2s ease-in-out',
        margin: this.props.wideview ? '10px 10px 10px 10px' : '',
        borderLeftStyle: !messageConversation.read && !this.state.expanded ? 'solid' : '',
        borderLeftWidth: '3px',
        borderLeftColor: theme.palette.primary1Color,
        cursor: this.state.cursor,
        boxSizing: 'border-box',
        position: 'relative',
        whiteSpace: 'nowrap',
      }}
        onClick={(event) => {
          event.target.innerText != '' && this.onClick(messageConversation)
        }}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <Subheader style={{
          ...subheader_minilist,
          color: theme.palette.accent4Color,
        }}>
          {title}
        </Subheader>
        <Checkbox
          checked={checked}
          style={{
            gridArea: '1 / 1',
            display: 'flex',
            alignSelf: 'center',
            paddingLeft: '10px',
            width: '50px'
          }}
          onCheck={(event, isInputChecked) => {
            this.props.setSelected(messageConversation, !messageConversation.selectedValue)
          }}
        />
        {this.state.cursor == 'pointer' &&
          <div
            style={{
              gridArea: '1 / 2',
              display: 'flex',
              justifyContent: 'flex-end',
              alignSelf: 'center',
            }}>
            <CustomFontIcon size={5} child={this.props.messageConversation} onClick={this.deleteMessageConversations} icon={'delete'} tooltip={'Delete'} />
            <CustomFontIcon size={5} child={this.props.messageConversation} onClick={this.markUnread} icon={'markunread'} tooltip={'Mark as unread'} />
          </div>}

        <CardText style={{
          gridArea: '2 / 1 / span 1 / span 2',
          overflow: this.state.expanded ? 'auto' : 'hidden',
          textOverflow: this.state.expanded ? 'initial' : 'ellipsis',
          whiteSpace: this.state.expanded ? 'normal' : 'nowrap',
          padding: '10px',
          fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
        }}>
          {message.text}
        </CardText>
      </Paper>
    )
  }
}

export default compose(
  connect(
    state => {
      return {
        selectedMessageConversation: state.messaging.selectedMessageConversation,
        selectedMessageType: state.messaging.selectedMessageType,
        checkedIds: state.messaging.checkedIds,
      }
    }
    ,
    dispatch => ({
      updateMessageConversationStatus: (messageConversation, identifier) => dispatch({ type: actions.UPDATE_MESSAGE_CONVERSATION_STATUS, payload: { messageConversation, identifier } }),
      updateMessageConversationPriority: (messageConversation, identifier) => dispatch({ type: actions.UPDATE_MESSAGE_CONVERSATION_PRIORITY, payload: { messageConversation, identifier } }),
      updateMessageConversationAssignee: (messageConversation, identifier) => dispatch({ type: actions.UPDATE_MESSAGE_CONVERSATION_ASSIGNEE, payload: { messageConversation, identifier } }),
      setSelected: (messageConversation, selectedValue) => dispatch({ type: actions.SET_SELECTED_VALUE, payload: { messageConversation, selectedValue } }),
      setSelectedMessageConversation: (messageConversation) => dispatch({ type: actions.SET_SELECTED_MESSAGE_CONVERSATION, payload: { messageConversation } }),
      markMessageConversationsUnread: (markedUnreadConversations, messageType) => dispatch({ type: actions.MARK_MESSAGE_CONVERSATIONS_UNREAD, payload: { markedUnreadConversations, messageType } }),
      markMessageConversationsRead: (markedReadConversations, messageType) => dispatch({ type: actions.MARK_MESSAGE_CONVERSATIONS_READ, payload: { markedReadConversations, messageType } }),
      deleteMessageConversation: (messageConversationId, messageType) => dispatch({ type: actions.DELETE_MESSAGE_CONVERSATION, payload: { messageConversationId, messageType } }),
    }),
  ),
)(MessageConversationListItem);

/*!this.props.disableLink && <Checkbox
            style={{
              gridArea: '1 / 1 / span 1 / span 1',
              marginLeft: '5px',
              display: 'flex',
              alignSelf: 'center',
            }}
            onCheck={() => this.setSelected(messageConversation, !messageConversation.selectedValue)}
          />
          
           {true &&
            <CustomDropDown
              gridColumn={4}
              subheader={'Status'}
              onChange={(event, key, value) => this.updateMessageConversation(this.updateMessageConversationStatus, messageConversation, 'STATUS', value)}
              value={messageConversation.status}
              children={
                [
                  <MenuItem key={'OPEN'} value={'OPEN'} primaryText="Open" />,
                  <MenuItem key={'PENDING'} value={'PENDING'} primaryText="Pending" />,
                  <MenuItem key={'INVALID'} value={'INVALID'} primaryText="Invalid" />,
                  <MenuItem key={'SOLVED'} value={'SOLVED'} primaryText="Solved" />
                ]
              }
            />
          }

          {true &&
            <CustomDropDown
              gridColumn={5}
              subheader={'Status'}
              onChange={(event, key, value) => this.updateMessageConversation(this.updateMessageConversationPriority, messageConversation, 'PRIORITY', value)}
              value={messageConversation.priority}
              children={
                [
                  <MenuItem key={'LOW'} value={'LOW'} primaryText="Low" />,
                  <MenuItem key={'MEDIUM'} value={'MEDIUM'} primaryText="Medium" />,
                  <MenuItem key={'HIGH'} value={'HIGH'} primaryText="High" />
                ]
              }
            />
          }
           {false &&
          <CustomDropDown
            gridColumn={3}
            subheader={'Assignee'}
            value={assigneValue}
            children={
              [
                <MenuItem key={assigneValue} value={assigneValue} primaryText={assigneValue} />,
                <SuggestionField
                  updateMessageConversation={(chip) => this.updateMessageConversation(this.updateMessageConversationAssignee, messageConversation, 'ASSIGNEE', chip)}
                  key={'suggestionField'}
                  label={'Assignee'}
                />
              ]
            }
          />
        }

          <div
            onClick={() => !this.props.disableLink && this.onClick(messageConversation)}
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
            style={{
              //cursor: this.props.disableLink ? 'auto' : this.state.cursor,
              gridArea: !this.props.disableLink ? '1 / 2 / span 1 / span 2' : '1 / 1 / span 1 / span 5',
              display: 'grid',
              gridTemplateColumns: '20% 80%',
              padding: '16px 0px 16px 16px',
              boxSizing: 'border-box',
              position: 'relative',
              whiteSpace: 'nowrap',
            }}
          >
          */