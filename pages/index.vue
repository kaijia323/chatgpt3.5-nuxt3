<script setup lang="ts">
// import hljs from "highlight.js";
// import "highlight.js/styles/github.css";
// import "highlight.js/styles/vs2015.css";
import { fetchEventSource } from "@microsoft/fetch-event-source";

interface IContent {
  type: "user" | "gpt";
  value: string;
  id: string;
  className?: string;
}

let contentsEle: HTMLElement | null;
let count = 1;

const value = ref("");
const contents = ref<IContent[]>([]);

const _scroll = (ele: HTMLElement | null) => {
  if (ele) {
    // { block: "end", behavior: "smooth" }
    Array.from(ele.children).at(-1)?.scrollIntoView(false);
  }
};

onMounted(() => {
  contentsEle = document.querySelector(".contents");
});

const handleKeyup = () => {
  const id = Date.now() + "";
  const prompt = unref(value);
  contents.value.push({
    type: "user",
    value: prompt,
    id,
  });
  value.value = "";
  count++;
  nextTick(() => {
    if (contentsEle) {
      _scroll(contentsEle);
      const ctrl = new AbortController();
      fetchEventSource("/chat", {
        method: "POST",
        body: JSON.stringify({
          prompt,
          id,
        }),
        signal: ctrl.signal,
        // async onopen() {
        //   console.log("open");
        // },
        // TODO优化
        onmessage(msg) {
          const c = contents.value.find(i => i.type === "gpt" && i.id === id);
          if (msg.event === "chatgpt") {
            const data = JSON.parse(msg.data);
            if (!c) {
              contents.value.push({
                type: "gpt",
                value: data,
                id,
                // 打字机效果
                className: "flicker",
              });
            } else {
              c.value += data;
            }
            nextTick(() => {
              _scroll(contentsEle);
            });
          } else if (msg.event === "done" && c) {
            c.className = "";
          }
        },
        onclose: () => {
          console.log("onclose");
          ctrl.abort();
        },
        onerror: error => {
          console.log("onerror", error);

          ctrl.abort();
        },
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
        <div v-if="content.type === 'user'" class="user-question">
          {{ content.value }}
        </div>
        <pre
          v-else
        ><code :class="content.className" v-html="content.value"></code></pre>
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
          &.flicker::after {
            content: "";
            display: inline-block;
            margin-left: 4px;
            width: 2px;
            height: 1em;
            // line-height: 14px;
            background-color: #fff;
            vertical-align: text-bottom;
            animation: flicker 0.6s infinite reverse;
          }

          @keyframes flicker {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
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
