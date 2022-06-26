<template>
  <div class="post-list">
        <div class="post" v-for="post in posts" :key="post.id">
            <div class="user-info">
                <a href="#">{{ userById(post.userId).name }}</a>

                <a href="#">
                  <img :src="userById(post.userId).avatar" alt="" class="avatar-large">
                </a>

                <p class="desktop-only text">107 posts</p>
            </div>
            <div class="post-content">
              <div>
                <p>
                  {{ post.text }}
                </p>
              </div>
              <!-- <a href="#" style="margin-left:auto" class="link-unstyled" title="Make a change">
                <i class="fa fa-pencil"></i>
              </a> -->
            </div>
            <div class="post-date text-">
              <AppDate :timestamp="post.publishedAt"/>
            </div>
        </div>
  </div>
</template>

<script>

export default {
  props: {
    posts: {
      required: true,
      type: Array
    }
  },
  computed: {
    users () {
      return this.$store.state.users
    }
  },
  methods: {
    userById (userId) {
      return this.users.find(p => p.id === userId)
    }

  }
}
</script>

<style>

</style>
