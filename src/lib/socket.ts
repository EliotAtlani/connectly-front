/* eslint-disable @typescript-eslint/no-explicit-any */
// SocketManager.ts
import { io, Socket } from "socket.io-client";

class SocketManager {
  private socket: Socket | null = null;
  private token: string | null = null;
  private readonly URL: string = import.meta.env.VITE_API_WS_URL; // Update this to your server URL
  private isConnected: boolean = false;

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem("token", token);
  }

  getIsConnected(): boolean {
    return this.isConnected;
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem("token");
    }
    return this.token;
  }

  connect(): Socket | null {
    if (this.socket) {
      return this.socket;
    }

    const token = this.getToken();
    if (!token) {
      console.error("No token available. Cannot connect to socket.");
      return null;
    }

    this.socket = io(this.URL, {
      query: { token: token },
    });

    this.socket.on("connect", () => {
      console.log("Socket connected");
      this.isConnected = true;
    });

    this.socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected = false;

      this.socket = null;
    }
  }

  emit(event: string, data: any): void {
    if (!this.socket) {
      console.error("Socket not connected. Cannot emit event.");
      return;
    }
    this.socket.emit(event, data);
  }

  on(event: string, callback: (...args: any[]) => void): void {
    if (!this.socket) {
      console.error("Socket not connected. Cannot listen to event.");
      return;
    }
    this.socket.on(event, callback);
  }

  off(event: string, callback?: (...args: any[]) => void): void {
    if (!this.socket) {
      console.error("Socket not connected. Cannot remove listener.");
      return;
    }
    this.socket.off(event, callback);
  }
}

export const socketManager = new SocketManager();
