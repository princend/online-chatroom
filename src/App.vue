<template>
  <div class="container md:container md:mx-auto">
    <div class="bg-gray-100 p-4 rounded-lg mb-4 h-96 overflow-y-auto  w-[200px] ">
      <div v-for="(message, index) in messages" :key="index" class="message bg-blue-500 text-white p-2 rounded-lg mb-2">
        {{ message }}
      </div>
    </div>
    <div class="input-area flex gap-2">
      <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="輸入訊息並按 Enter" class="flex-grow p-3 border border-gray-300 rounded-l-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <button @click="sendMessage" class="p-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition duration-200">
        發送
      </button>
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
  if (websocket.value 
  && websocket.value.readyState === WebSocket.OPEN 
  && newMessage.value.trim() !== '') {
    websocket.value.send(newMessage.value);
    messages.value.push('已發送: ' + newMessage.value);
    newMessage.value = ''; // 清空輸入框
  } else {
    alert('WebSocket 連線未開啟或訊息為空！');
  }
};
</script>

<style scoped>

/* 
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: sans-serif;
  padding: 20px;
  background-color: #f9fafb;
}

.message-area {
  width: 80%;
  height: 300px;
  border: 1px solid #e5e7eb;
  margin-bottom: 20px;
  padding: 10px;
  overflow-y: auto;
  background-color: #f3f4f6;
}

.message {
  padding: 8px;
  border-radius: 8px;
  margin-bottom: 8px;
}

.input-area {
  width: 80%;
  display: flex;
  gap: 0.5rem;
}

input {
  flex-grow: 1;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 1rem;
}

button {
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  background-color: #2563eb;
  color: white;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: #1d4ed8;
} */
@import './App.css';
</style>
