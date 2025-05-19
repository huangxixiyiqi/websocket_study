package com.git.hui.boot.websocket.stomp;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;

/**
 * Created by @author yihui in 10:37 19/4/18.
 */
@Controller
public class HelloController {

    /**
     * 当接收到客户端发送的消息时，该方法会被触发。客户端发送消息的路径为：/app/hello
     * （其中 /app 前缀是 StompConfiguration 中配置的）。该方法会对接收到的消息进行处理，
     * 并将处理结果推送给所有订阅了 /topic/hello 的消费者。
     *
     * @param content 客户端发送的消息内容，类型为 String。
     * @return 返回一个字符串，包含响应前缀 "resp: "、客户端发送的内容以及当前时间戳。
     */
    @MessageMapping("/hello")
    @SendTo("/topic/hello")
    public String sayHello(String content) {
        // 将客户端发送的内容与当前时间拼接，生成响应消息
        return "resp: " + content + " | " + LocalDateTime.now();
    }

}
