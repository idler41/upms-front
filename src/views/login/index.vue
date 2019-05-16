<template>
  <div class="login-container">
    <login-form v-if="action==='login'" :action.sync="action" />

    <register-form v-else :action.sync="action" />
  </div>

</template>

<script>

import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'

export default {
  name: 'Login',
  components: { RegisterForm, LoginForm },

  data() {
    return {
      action: 'login'
    }
  }
}
</script>

<style lang="scss" scoped>
  .login-container {
    position: relative;
  }
</style>
