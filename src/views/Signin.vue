<template>
  <div class="p-5">
    <h1 class="mb-4 text-center text-white">Sign In</h1>
    <form class="w-50 mx-auto" @submit.prevent="onSubmit">
      <div class="form-group">
        <label class="text-white" for="exampleInputEmail1">Session Name</label>
        <input
          ref="roomInput"
          type="text"
          class="form-control"
          placeholder="e.g. avengers/fantastic4..."
          v-model="room"
          required
        />
      </div>
      <div class="form-group">
        <label class="text-white" for="exampleInputPassword1">Your Name</label>
        <input ref="myNameInput" type="text" class="form-control" v-model="myName" required />
      </div>
      <div class="mt-4">
        <button type="submit" class="btn btn-primary mr-4">Join Session</button>
        <span class="text-light mr-2">OR</span>
        <a class="text-primary" href @click.prevent="observer">Join As Observer</a>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Signin extends Vue {
  room = '';
  myName = '';

  mounted() {
    this.myName = this.$store.getters.getName;
    this.room = this.$store.getters.getRoom;
    // focus on inputs
    if (!this.room) {
      (this.$refs.roomInput as HTMLInputElement).focus();
    } else if (!this.myName) {
      (this.$refs.myNameInput as HTMLInputElement).focus();
    }
  }

  onSubmit() {
    this.myName = this.myName.trim();
    if (this.room && this.myName) {
      this.$store.commit('setName', this.myName);
      this.$router.push('/' + this.room);
    }
  }

  observer() {
    if (this.room) {
      this.$router.push('/' + this.room + '?observer=1');
    } else {
      (this.$refs.roomInput as HTMLInputElement).focus();
    }
  }
}
</script>

<style scoped lang="scss"></style>
