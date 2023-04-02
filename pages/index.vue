<script setup lang="ts">
interface IContent {
  type: "user" | "gpt";
  value: string;
}

let contentsEle: HTMLElement | null;
let count = 1;

const value = ref("");
const contents = ref<IContent[]>([]);

onMounted(() => {
  contentsEle = document.querySelector(".contents");
});

const handleKeyup = () => {
  const prompt = unref(value);
  contents.value.push({
    type: "user",
    value: prompt,
  });
  value.value = "";
  count++;
  nextTick(async () => {
    if (contentsEle) {
      Array.from(contentsEle.children).at(-1)?.scrollIntoView();
      $fetch("/chat", {
        method: "post",
        body: {
          content: prompt,
        },
      })
        .then(res => {
          contents.value.push({
            type: "gpt",
            value: res.message,
          });
        })
        .catch(err => {
          // console.log(err, "err");
          contents.value.push({
            type: "gpt",
            value: "请求失败-TODO",
          });
        });
    }
  });
};
</script>

<template>
  <div class="chat">
    <div class="contents">
      <div
        :class="['content', content.type]"
        v-for="(content, index) in contents"
        :key="index"
      >
        {{ content.value }}
      </div>
    </div>
    <div class="divider"></div>
    <div class="input">
      <textarea
        v-model="value"
        onkeydown="if (event.keyCode==13)return false;"
        placeholder="请输入内容..."
        @keyup.enter="handleKeyup"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat {
  width: 100%;
  height: 100%;
  color: $primary-color;
  border: 1px solid #f00;

  .divider {
    width: 100%;
    height: 1px;
    background-color: #f00;
  }

  .contents {
    overflow-y: auto;
    height: 70%;
    .content {
      width: 100%;
      padding: 12px;
      color: #fff;

      &.user {
        text-align: right;
        background-color: #ee3f4d;
      }
      &.gpt {
        text-align: left;
        background-color: #ed9db2;
      }
    }
  }
  .input {
    height: 30%;
    padding: 12px;
    textarea {
      width: 100%;
      height: 100%;
      outline: none;
      border: none;
      resize: none;
    }
  }
}
</style>
