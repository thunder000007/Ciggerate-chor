const fs = require('fs');
const path = require('path');
const root = path.resolve('android/app/src/main');
const javaDir = path.join(root, 'java/com/rafid/callbridge');
fs.mkdirSync(javaDir, {recursive:true});
const plugin = `package com.rafid.callbridge;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Build;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.InetAddress;
import java.util.Collections;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@CapacitorPlugin(name = "LocalLan")
public class LocalLanPlugin extends Plugin {
  private ServerSocket server;
  private Thread acceptThread;
  private final Set<Socket> clients = Collections.newSetFromMap(new ConcurrentHashMap<Socket, Boolean>());
  private Socket upstream;
  private BufferedWriter upstreamWriter;
  private volatile boolean running = false;
  private int seat = -1;

  @PluginMethod public void startHost(PluginCall call) {
    if (running) { call.resolve(new JSObject().put("ok", true).put("ip", "192.168.43.1")); return; }
    try {
      server = new ServerSocket(8765, 8, InetAddress.getByName("0.0.0.0"));
      running = true;
      acceptThread = new Thread(() -> {
        while (running) {
          try {
            Socket s = server.accept();
            clients.add(s);
            final int assigned = clients.size();
            new Thread(() -> readLoop(s, assigned, true)).start();
            JSObject e = new JSObject(); e.put("type","connected"); e.put("seat",assigned);
            notifyListeners("lanEvent", e);
          } catch (Exception ex) { if (running) emitError(ex.getMessage()); }
        }
      });
      acceptThread.start();
      call.resolve(new JSObject().put("ok",true).put("port",8765).put("ip","192.168.43.1"));
    } catch (Exception ex) { call.reject("Could not start LAN host: " + ex.getMessage()); }
  }

  @PluginMethod public void connect(PluginCall call) {
    String host = call.getString("host");
    if (host == null || host.trim().isEmpty()) { call.reject("Enter the host phone IP address"); return; }
    new Thread(() -> {
      try {
        upstream = new Socket(host.trim(), 8765);
        upstreamWriter = new BufferedWriter(new OutputStreamWriter(upstream.getOutputStream()));
        running = true;
        call.resolve(new JSObject().put("ok",true));
        readLoop(upstream, -1, false);
      } catch (Exception ex) { call.reject("Could not connect: " + ex.getMessage()); emitError(ex.getMessage()); }
    }).start();
  }

  @PluginMethod public void send(PluginCall call) {
    String message = call.getString("message");
    if (message == null) { call.reject("Missing message"); return; }
    try {
      if (upstream != null && upstream.isConnected() && !upstream.isClosed()) {
        synchronized (this) { upstreamWriter.write(message); upstreamWriter.newLine(); upstreamWriter.flush(); }
      } else {
        for (Socket s : clients) writeSocket(s, message);
      }
      call.resolve();
    } catch (Exception ex) { call.reject("Send failed: " + ex.getMessage()); }
  }

  private void readLoop(Socket s, int assigned, boolean isClient) {
    try {
      BufferedReader in = new BufferedReader(new InputStreamReader(s.getInputStream()));
      String line;
      while (running && (line = in.readLine()) != null) {
        JSObject e = new JSObject(); e.put("type","message"); e.put("message",line);
        if (isClient) { e.put("seat",assigned); for (Socket other : clients) if (other != s) writeSocket(other, line); }
        notifyListeners("lanEvent",e);
      }
    } catch (Exception ex) { if (running) emitError(ex.getMessage()); }
    finally { clients.remove(s); try { s.close(); } catch(Exception ignored) {} }
  }

  private void writeSocket(Socket s, String message) {
    try { BufferedWriter w = new BufferedWriter(new OutputStreamWriter(s.getOutputStream())); synchronized(w) { w.write(message); w.newLine(); w.flush(); } }
    catch(Exception ex) { emitError(ex.getMessage()); }
  }
  private void emitError(String message) { JSObject e = new JSObject(); e.put("type","error"); e.put("message",message == null ? "Network error" : message); notifyListeners("lanEvent",e); }

  @PluginMethod public void stop(PluginCall call) {
    running = false;
    try { if (server != null) server.close(); } catch(Exception ignored) {}
    try { if (upstream != null) upstream.close(); } catch(Exception ignored) {}
    for (Socket s : clients) try { s.close(); } catch(Exception ignored) {}
    clients.clear(); call.resolve();
  }
}
`;
fs.writeFileSync(path.join(javaDir,'LocalLanPlugin.java'), plugin);
const activity = path.join(javaDir,'MainActivity.java');
let main = fs.existsSync(activity) ? fs.readFileSync(activity,'utf8') : 'package com.rafid.callbridge;\n\nimport com.getcapacitor.BridgeActivity;\n\npublic class MainActivity extends BridgeActivity {}\n';
if (!main.includes('LocalLanPlugin.class')) {
  if (main.includes('public class MainActivity extends BridgeActivity {')) {
    main = main.replace('public class MainActivity extends BridgeActivity {', 'public class MainActivity extends BridgeActivity {\n    @Override\n    public void onCreate(android.os.Bundle savedInstanceState) {\n        registerPlugin(LocalLanPlugin.class);\n        super.onCreate(savedInstanceState);\n    }');
  } else {
    main = 'package com.rafid.callbridge;\n\nimport android.os.Bundle;\nimport com.getcapacitor.BridgeActivity;\n\npublic class MainActivity extends BridgeActivity {\n @Override public void onCreate(Bundle savedInstanceState) { registerPlugin(LocalLanPlugin.class); super.onCreate(savedInstanceState); }\n}\n';
  }
  fs.writeFileSync(activity,main);
}
const manifest = path.join(root,'AndroidManifest.xml');
let xml = fs.readFileSync(manifest,'utf8');
if (!xml.includes('android.permission.INTERNET')) xml = xml.replace('<manifest ', '<manifest ').replace(/(<manifest[^>]*>)/, '$1\n    <uses-permission android:name="android.permission.INTERNET" />');
fs.writeFileSync(manifest,xml);
console.log('Injected LocalLan native plugin and INTERNET permission.');
