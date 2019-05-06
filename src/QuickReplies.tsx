import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native'
import { IMessage, Reply } from './types'
import Color from './Color'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  quickReply: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    maxWidth: 160,
    paddingVertical: 7,
    paddingHorizontal: 12,
    height: 50,
    borderRadius: 13,
    margin: 3,
  },
  sendLink: {
    borderWidth: 0,
  },
  sendLinkText: {
    color: Color.defaultBlue,
    fontWeight: '600',
    fontSize: 17,
  },
})

interface QuickRepliesProps {
  currentMessage?: IMessage
  color?: string
  sendText: string
  onQuickReply?(reply: Reply[]): void
}

interface QuickRepliesState {
  replies: Reply[]
}

const sameReply = (currentReply: Reply) => (reply: Reply) =>
  currentReply.value === reply.value

const diffReply = (currentReply: Reply) => (reply: Reply) =>
  currentReply.value !== reply.value

export default class QuickReplies extends Component<
  QuickRepliesProps,
  QuickRepliesState
> {
  static defaultProps = {
    currentMessage: {
      quickReplies: [],
    },
    onQuickReply: () => {},
    color: Color.peterRiver,
    sendText: 'Send',
  }

  static propTypes = {
    currentMessage: PropTypes.object.isRequired,
    onQuickReply: PropTypes.func,
    color: PropTypes.string,
  }

  state = {
    replies: [],
  }

  handlePress = (reply: Reply) => () => {
    const { currentMessage } = this.props
    const { replies } = this.state
    if (currentMessage) {
      const { type } = currentMessage.quickReplies!
      switch (type) {
        case 'radio': {
          this.handleSend([reply])()
          return
        }

        case 'checkbox': {
          if (replies.find(sameReply(reply))) {
            this.setState({
              replies: this.state.replies.filter(diffReply(reply)),
            })
          } else {
            this.setState({ replies: [...this.state.replies, reply] })
          }
          return
        }

        default: {
          console.warn(`[GiftedChat.onQuickReply] unknown type: ` + type)
          return
        }
      }
    }
  }

  handleSend = (replies: Reply[]) => () => {
    if (this.props.onQuickReply) {
      this.props.onQuickReply(replies)
    }
  }

  render() {
    const { currentMessage, color, sendText } = this.props
    const { replies } = this.state
    if (!currentMessage && !currentMessage!.quickReplies) {
      return null
    }
    const { type } = currentMessage!.quickReplies!
    return (
      <View style={styles.container}>
        {currentMessage!.quickReplies!.values.map((reply: Reply) => {
          const selected = type === 'checkbox' && replies.find(sameReply(reply))
          return (
            <TouchableOpacity
              onPress={this.handlePress(reply)}
              style={[
                styles.quickReply,
                ,
                { borderColor: color },
                selected && { backgroundColor: color },
              ]}
              key={reply.value}
            >
              <Text
                numberOfLines={2}
                ellipsizeMode={'tail'}
                style={{ color: selected ? Color.white : color }}
              >
                {reply.title}
              </Text>
            </TouchableOpacity>
          )
        })}
        {replies.length > 0 && (
          <TouchableOpacity
            style={[styles.quickReply, styles.sendLink]}
            onPress={this.handleSend(replies)}
          >
            <Text style={styles.sendLinkText}>{sendText}</Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }
}