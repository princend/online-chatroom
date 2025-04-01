<template>
  <div class="min-h-screen bg-gradient-to-b bg-gray-50  to-blue-950 p-4 w-[100vw]">
    <div class="max-w-md mx-auto">
      <!-- 標題區 -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">線上聊天室</h1>
        <div class="flex items-center justify-center space-x-2">
          <div class="w-3 h-3 rounded-full" :class="connectionStatusColor"></div>
          <span class="text-sm text-gray-600">{{ connectionStatusText }}</span>
        </div>
      </div>

      <!-- 聊天訊息區 -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="h-96 overflow-y-auto p-4 space-y-4">
          <div 
            v-for="(message, index) in messages" 
            :key="index"
            class="flex"
            :class="message.startsWith('已發送:') ? 'justify-end' : 'justify-start'"
          >
            <div 
              class="chat-bubble"
              :class="[
                message.startsWith('已發送:') ? 'sent text-blue-500' : 'received text-gray-800'
              ]"
            >
              {{ message }}
              <div class="text-xs mt-1 opacity-75">
                {{ new Date().toLocaleTimeString() }}
              </div>
            </div>
          </div>
        </div>

        <!-- 輸入區 -->
        <div class="border-t border-gray-200 p-4 bg-gray-50">
          <div class="flex justify-center gap-2">
            <input
              v-model="newMessage"
              @keyup.enter="sendMessage"
              placeholder="輸入訊息..."
              class="input-field text-blue-500"
            />
            <button 
              @click="sendMessage"
              class="send-btn"
            >
              發送
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

const websocket = ref(null); // WebSocket 連線實例
const messages = ref([]); // 儲存接收到的訊息
const newMessage = ref(''); // 用於綁定輸入框的訊息

// 計算屬性：連線狀態顏色
const connectionStatusColor = computed(() => {
  return websocket.value?.readyState === WebSocket.OPEN ? 'bg-green-500' : 'bg-red-500';
});

// 計算屬性：連線狀態文本
const connectionStatusText = computed(() => {
  return websocket.value?.readyState === WebSocket.OPEN ? '已連線' : '未連線';
});

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
@import './App.css';
</style>
