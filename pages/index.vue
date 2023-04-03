<script setup lang="ts">
import hljs from "highlight.js";
// import "highlight.js/styles/github.css";
import "highlight.js/styles/vs2015.css";

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
    console.log(prompt);
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
        })
        .finally(() => hljs.highlightAll());
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
  border: 1px solid #f00;

  .divider {
    width: 100%;
    height: 1px;
    background-color: #f00;
    transform: scaleY(0.5);
  }

  .contents {
    overflow-y: auto;
    height: 70%;
    .content {
      width: 100%;
      margin-bottom: 12px;
      padding: 12px;

      &.user {
        display: flex;
        justify-content: end;
        .user-question {
          padding: 12px;
          width: fit-content;
          background-color: #d2357d;
          border-radius: 8px;
        }
      }
      &.gpt {
        text-align: left;
      }

      pre {
        margin: 0;
        code {
          word-break: break-word;
          white-space: pre-wrap;
          border-radius: 8px;
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
