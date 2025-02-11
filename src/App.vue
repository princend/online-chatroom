<template>
  <div class="container">
    <h1>Vue 3 WebSocket Demo</h1>
    <div class="message-area">
      <div v-for="(message, index) in messages" :key="index" class="message">
        {{ message }}
      </div>
    </div>
    <div class="input-area">
      <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="輸入訊息並按 Enter" />
      <button @click="sendMessage">發送</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const websocket = ref(null); // WebSocket 連線實例
const messages = ref([]); // 儲存接收到的訊息
const newMessage = ref(''); // 用於綁定輸入框的訊息

onMounted(() => {
  connectWebSocket();
});

onUnmounted(() => {
  closeWebSocket();
});

const connectWebSocket = () => {
  websocket.value = new WebSocket('ws://localhost:3000'); // 連接 WebSocket 伺服器 (注意 ws://)

  websocket.value.onopen = () => {
    console.log('WebSocket 連線已開啟');
    messages.value.push('WebSocket 連線已開啟');
  };

  websocket.value.onmessage = (event) => {
    console.log('接收到訊息:', event.data);
    messages.value.push('接收到: ' + event.data);
  };

  websocket.value.onclose = () => {
    console.log('WebSocket 連線已關閉');
    messages.value.push('WebSocket 連線已關閉');
  };

  websocket.value.onerror = (error) => {
    console.error('WebSocket 錯誤:', error);
    messages.value.push('WebSocket 錯誤: ' + error);
  };
};

const closeWebSocket = () => {
  if (websocket.value) {
    websocket.value.close();
    websocket.value = null;
  }
};

const sendMessage = () => {
  if (websocket.value && websocket.value.readyState === WebSocket.OPEN && newMessage.value.trim() !== '') {
    websocket.value.send(newMessage.value);
    messages.value.push('已發送: ' + newMessage.value);
    newMessage.value = ''; // 清空輸入框
  } else {
    alert('WebSocket 連線未開啟或訊息為空！');
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: sans-serif;
}

.message-area {
  width: 80%;
  height: 300px;
  border: 1px solid #ccc;
  margin-bottom: 20px;
  padding: 10px;
  overflow-y: auto;
}

.message {
  padding: 5px 0;
  border-bottom: 1px dotted #eee;
}

.input-area {
  width: 80%;
  display: flex;
}

input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px 0 0 5px;
}

button {
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 0 5px 5px 0;
  background-color: #eee;
  cursor: pointer;
}
</style>