# React Native Integration Guide

This game has been fully prepared for integration into a React Native App. It is bundled via [Vite](https://vitejs.dev/) to produce a static HTML5 package that easily runs inside a React Native `<WebView>`.

## 1. Bundle the Game

First, generate the static bundle. This will compile all files, transpile the TypeScript bridge, and output a clean production bundle inside the `dist` folder:

```bash
npm run build
```

*Note: The `vite.config.ts` has been specifically configured with `base: './'` so that the bundled game runs properly from a local file system path.*

## 2. Implement the GameWebView Component

In your React Native application, install the WebView package:
```bash
npm install react-native-webview
```

Then, you can drop in this pre-made component:

```tsx
import React, { useRef } from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';

// Define the shape of messages coming from the game
interface GameEvent {
  type: string;
  value: any;
}

export default function GameWebView() {
  const webviewRef = useRef<WebView>(null);

  // You can serve the 'dist' folder locally via an HTTP server
  // Or host it on a CDN.
  // For local bundled assets on iOS/Android, use a local URI strategy.
  const gameUrl = 'https://your-game-cdn.com/index.html';

  // Handle messages FROM the game
  const handleMessage = (event: any) => {
    try {
      const data: GameEvent = JSON.parse(event.nativeEvent.data);
      console.log('Received from game:', data);
      
      switch(data.type) {
        case 'gameLoaded':
          console.log('Game successfully loaded!');
          // Example: Send user data back into the game
          sendToGame('SET_PLAYER_NAME', { name: 'Player 1' });
          break;
        case 'score':
          console.log('Final Score:', data.value);
          break;
      }
    } catch(err) {
      console.error('Error parsing message from game', err);
    }
  };

  // Send messages TO the game
  const sendToGame = (type: string, value: any) => {
    if (webviewRef.current) {
      const script = `
        window.postMessage(JSON.stringify({ type: '${type}', value: ${JSON.stringify(value)} }), '*');
        true;
      `;
      webviewRef.current.injectJavaScript(script);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        ref={webviewRef}
        source={{ uri: gameUrl }}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowFileAccess={true}
        allowFileAccessFromFileURLs={true}
        allowUniversalAccessFromFileURLs={true}
        style={styles.webview}
        // Prevents the view from bouncing to create a native feel
        bounces={false}
        scrollEnabled={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Matches typical game backgrounds
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
```

## 3. Communication Bridge

The `src/bridge.ts` file acts as the router between React Native and the Game.

*   When the game wants to tell React Native something (like a score or state), it calls `sendEvent('eventName', value)`, which triggers `window.ReactNativeWebView.postMessage`.
*   When React Native wants to pause or update the game, it injects JavaScript (see `sendToGame` above) which is caught by the listeners inside `bridge.ts`.

You can now easily swap this out with other HTML5 mini-games just by changing the `source` URL and standardizing your `GameEvent` types!
