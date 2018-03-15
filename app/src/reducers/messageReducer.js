import * as actions from 'constants/actions';
import messageTypes from '../constants/messageTypes';

export const initialState = {
    messageConversations: {},
    messageTypes: messageTypes,
    messsageFilter: '',
    loaded: false,
};

function messageReducer(state = initialState, action) {
    switch (action.type) {
        case actions.MESSAGE_CONVERSATIONS_LOAD_SUCCESS:
            let messageTypes = state.messageTypes
            let messageType = _.find(messageTypes, {id: action.messageType});
            messageType.loaded = messageType.page == 1 ? action.payload.messageConversations.length :  messageType.loaded + action.payload.messageConversations.length
            messageType.total = action.payload.pager.total
            messageType.unread = action.nrOfUnread
            messageType.page = action.payload.pager.page
            messageTypes.splice( [_.findIndex(messageTypes, { 'id': action.messageType })], 1, messageType)

            const prevStateConversations = state.messageConversations[action.messageType]
            const replaceConversations = messageType.page == 1 ? action.payload.messageConversations :  _.unionWith( prevStateConversations, action.payload.messageConversations, _.isEqual )

            return {
                ...state,
                messageTypes: messageTypes,
                messageConversations: {
                    ...state.messageConversations,
                    [action.messageType]: replaceConversations,
                },
            };

        case actions.MESSAGE_CONVERSATIONS_UPDATE_SUCCESS:
            let updateMessageType = action.messageConversations[0].messageType
            let messageConversations = state.messageConversations[updateMessageType]

            action.messageConversations.map( messageConversation => {
                messageConversations.splice( [_.findIndex(messageConversations, { 'id': messageConversation.id })], 1, messageConversation )
            })

            return {
                ...state,
                messageConversations: {
                    ...state.messageConversations,
                    [updateMessageType]: messageConversations
                },
            };
        
        case actions.SET_MESSAGE_FILTER:
            return {
                ...state,
                messsageFilter: action.payload.messageFilter
            }
        
        case actions.MESSAGE_CONVERSATIONS_LOAD_FINISHED:
            return {
                ...state,
                loaded: true,
            }
        
        default:
            return state;
    }
}

export default messageReducer;