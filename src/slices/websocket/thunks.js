export const connectWebSocket = (url) => (dispatch) => {
    console.log(`Attempting to connect to WebSocket at ${url}`);

    // Create the WebSocket connection
    const socket = new WebSocket(url);

    socket.onopen = () => {
        console.log("WebSocket connection established");
        // Dispatch any success action here if needed
    };

    socket.onmessage = (event) => {
        console.log("WebSocket message received:", event.data);
        // Dispatch actions based on websocket messages
    };

    socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        // Dispatch error action here if needed
    };

    socket.onclose = (event) => {
        console.log("WebSocket connection closed", event);
        // Dispatch close action here if needed
    };

    // Return an object that exposes a close method
    // (the useEffect in App.js expects to be able to call socket.close())
    return {
        close: () => {
            if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
                socket.close();
            }
        }
    };
};
