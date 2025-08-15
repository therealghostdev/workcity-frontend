import io, { type Socket } from "socket.io-client";

class SocketClient {
  private socket: any | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect(token: string) {
    if (this.socket?.connected) return;

    this.socket = io(
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
      {
        auth: { token },
      }
    );

    this.socket.on("connect", () => {
      console.log("[workcity] Socket connected");
    });

    this.socket.on("disconnect", () => {
      console.log("[workcity] Socket disconnected");
    });

    // Re-attach listeners
    this.listeners.forEach((callbacks, event) => {
      callbacks.forEach((callback) => {
        this.socket?.on(event, callback);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);

    if (this.socket) {
      this.socket.on(event, callback as any);
    }
  }

  off(event: string, callback?: Function) {
    if (callback) {
      const callbacks = this.listeners.get(event) || [];
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    } else {
      this.listeners.delete(event);
    }

    if (this.socket) {
      this.socket.off(event, callback as any);
    }
  }

  emit(event: string, data: any) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  joinConversation(conversationId: string) {
    this.emit("join_conversation", conversationId);
  }

  leaveConversation(conversationId: string) {
    this.emit("leave_conversation", conversationId);
  }

  sendMessage(conversationId: string, content: string) {
    this.emit("send_message", { conversationId, content });
  }
}

export const socketClient = new SocketClient();
