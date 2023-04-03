<script setup lang="ts">
// import hljs from "highlight.js";
// import "highlight.js/styles/github.css";
// import "highlight.js/styles/vs2015.css";

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
  nextTick(() => {
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
      // .finally(() => hljs.highlightAll());
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
        <div v-if="content.type === 'user'" class="user-question">
          {{ content.value }}
        </div>
        <pre v-else><code v-html="content.value"></code></pre>
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
  border: 1px solid $primary-color;
  border-radius: 4px;

  .divider {
    width: 100%;
    height: 1px;
    background-color: $primary-color;
    transform: scaleY(0.5);
  }

  .contents {
    overflow-y: auto;
    height: 70%;
    padding: 12px;
    .content {
      width: 100%;
      margin-bottom: 12px;
      padding: 12px;
      color: #fff;
      border-radius: 4px;

      &.user {
        display: flex;
        justify-content: flex-end;
        .user-question {
          padding: 12px;
          background-color: $primary-background-color;
          width: fit-content;
          border-radius: inherit;
        }
      }
      &.gpt {
        text-align: left;
        background-color: $primary-background-color;
      }

      pre {
        margin: 0;
        code {
          word-break: break-word;
          white-space: pre-wrap;
          border-radius: 4px;
        }
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
