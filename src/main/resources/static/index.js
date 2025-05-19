var stompClient = null;

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    } else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}

/**
 * 连接 WebSocket 并订阅指定主题以接收消息。
 *
 * @function connect
 * @description 创建一个 SockJS 实例并与后端建立 WebSocket 连接，使用 STOMP 协议进行通信。
 *              连接成功后，订阅指定的主题路径 `/topic/hello`，并处理接收到的消息。
 *
 * @param {void} 无参数。
 * @returns {void} 无返回值。
 */
function connect() {
    // 创建一个 SockJS 实例，连接到指定的 WebSocket 端点。
    var socket = new SockJS("/ws/hello");

    // 使用 STOMP 协议封装 SockJS 实例，创建 STOMP 客户端。
    stompClient = Stomp.over(socket);

    // 调用 STOMP 客户端的 connect 方法，建立连接。
    stompClient.connect({}, function (frame) {
        // 连接成功后，调用 setConnected(true) 更新连接状态。
        setConnected(true);

        // 打印连接成功的日志信息。
        console.log('Connected: ' + frame);

        // 订阅指定的主题路径 `/topic/hello`，以便接收后端推送的消息。
        stompClient.subscribe('/topic/hello', function (greeting) {
            // 打印接收到的消息内容。
            console.log("resp: ", greeting.body);

            // 调用 showGreeting 方法处理并展示接收到的消息。
            showGreeting(greeting.body);
        });
    });
}


function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function sendName() {
    // 表示将消息转发到哪个目标，类似与http请求中的path路径，对应的是后端 @MessageMapping 修饰的方法
    stompClient.send("/app/hello", {}, JSON.stringify({'name': $("#name").val()}));
}

function showGreeting(message) {
    $("#greetings").prepend("<tr><td>" + message + "</td></tr>");
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $("#connect").click(function () {
        connect();
    });
    $("#disconnect").click(function () {
        disconnect();
    });
    $("#send").click(function () {
        sendName();
    });
});