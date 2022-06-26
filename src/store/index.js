import { createStore } from 'vuex'

import sourceData from '@/data'
import { findById, upser } from '@/helpers'

export default createStore({
  state: {
    ...sourceData,
    authId: 'w9WeYrRVDaNNpxOkyVArjCKLSnD2'
  },
  getters: {
    authUser: state => {
      const user = findById(state.users, state.authId)
      if (!user) return null
      return {
        ...user,
        // authUser.postsCount
        get postsCount () {
          return this.posts.length
        },
        // authUser.posts
        get posts () {
          return Object.values(state.posts).filter(
            post => post.userId === user.id
          )
        },
        // authUser.posts
        get threadsCount () {
          return this.threads.length
        },
        get threads () {
          return Object.values(state.threads).filter(
            post => post.userId === user.id
          )
        }
      }
    }
  },
  actions: {
    createPost ({ commit, state }, post) {
      post.id = 'gggg' + Math.random()
      post.userId = state.authId
      post.publishedAt = Math.floor(Date.now() / 1000)
      commit('setPost', { post })
      commit('appendPostToThread', { postId: post.id, threadId: post.threadId })
    },
    async createThread ({ commit, state, dispatch }, { text, title, forumId }) {
      const id = 'gggg' + Math.random()
      const userId = state.authId
      const publishedAt = Math.floor(Date.now() / 1000)
      const thread = { forumId, title, publishedAt, userId, id }
      commit('setThread', { thread })
      commit('appendThreadToUser', { userId, threadId: id })
      commit('appendThreadToForum', { forumId, threadId: id })
      dispatch('createPost', { text, threadId: id })

      return findById(state.threads, id)
    },
    async updateThread ({ commit, state }, { title, text, id }) {
      const thread = findById(state.threads, id)
      const post = findById(state.posts, thread.posts[0])
      const newThread = { ...thread, title }
      const newPost = { ...post, text }
      commit('setThread', { thread: newThread })
      commit('setPost', { post: newPost })
      return newThread
    },
    updateUser ({ commit }, user) {
      commit('setUser', { user, userId: user.id })
    }
  },
  mutations: {
    setPost (state, { post }) {
      upser(state.posts, post)
    },
    setThread (state, { thread }) {
      upser(state.threads, thread)
    },
    setUser (state, { user, userId }) {
      const userIndex = state.users.findIndex(user => user.id === userId)
      state.users[userIndex] = user
    },
    appendPostToThread (state, { postId, threadId }) {
      const thread = findById(state.threads, threadId)
      thread.posts = thread.posts || []
      thread.posts.push(postId)
    },
    appendThreadToForum (state, { forumId, threadId }) {
      const forum = findById(state.forums, forumId)
      forum.threads = forum.threads || []
      forum.threads.push(threadId)
    },
    appendThreadToUser (state, { userId, threadId }) {
      const user = findById(state.users, userId)
      user.threads = user.threads || []
      user.threads.push(threadId)
    }
  }
})
