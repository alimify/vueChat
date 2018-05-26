try {
            var socket = io.connect();
        } catch (e) {
     
    console.log('Socket.Io Can not connected..')
        }

        new Vue({
            el: '#app',
            data: {
                ready: false,
                name: null,
                messageInput: null,
                messageBind: '',
                userTyping: false,
                connectionsCount: 0,
                online: 0,
                messages: [],
                onPressEnter: true,
                alertText:false
            },
            computed: {

            },
            methods: {
                userJoin() {
                    this.name ? (socket.emit('join', this.name), this.ready = true) : this.ready = false
                },
                send() {
                    this.messageBind = {
                        name: this.name,
                        text: this.messageInput
                    }
                    this.messageInput ? (this.messages.push(this.messageBind), socket.emit('newMessage', this.messageBind),
                        this.messageInput = null) : ''
                }

            },
            watch: {
                messageInput(value) {
                    value ? socket.emit('userTyping', this.name) : socket.emit('userTyping', false)
                }
            },
            created() {
                socket.on('newMessage', data => {
                    this.messages.push(data)
                })
                socket.on('userTyping', data => {
                    this.userTyping = data
                    setTimeout(() => {
                        this.userTyping = false
                    }, 10000);
                })
            socket.on('alertText',data => {
                this.alertText = data
                setTimeout(() => {
                this.alertText = false
                }, 3000);
            })

                socket.on('connectionCount', data => {
                    this.connectionsCount = data
                })

                socket.on('onlineCount', data => {
                    this.online = data
                })

            }
        })
