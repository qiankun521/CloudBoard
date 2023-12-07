import { makeAutoObservable, runInAction } from 'mobx';
import { UserInfo, WhiteBoard } from '../../global';
import { message } from 'antd';
import { Store } from './index';
class LoginRegisterStore {
    rootStore: Store
    islogged: boolean = false;
    loginWaiting: boolean = false;
    registerWaiting: boolean = false;
    info: UserInfo = {}
    whiteBoard: WhiteBoard = {
        all: {
            "1": {
                id: "1",
                name: "我的白板1",
                src: 'https://cdn.boardmix.cn/app/images/scenecut/board-ai-template.jpg',
                owner: "1",
                members: ["1"],
                lastEdit: "2021-4-1"
            },
            "2": {
                id: "2",
                name: "我的白板2",
                src: 'https://cdn.boardmix.cn/app/images/scenecut/board-ai-template.jpg',
                owner: "1",
                members: ["1"],
                lastEdit: "2021-4-1"
            },
        },
        mine: {
            "1": {
                id: "1",
                name: "我的白板1",
                src: 'https://cdn.boardmix.cn/app/images/scenecut/board-ai-template.jpg',
                owner: "1",
                members: ["1"],
                lastEdit: "2021-4-1"
            },
            "2": {
                id: "2",
                name: "我的白板2",
                src: 'https://cdn.boardmix.cn/app/images/scenecut/board-ai-template.jpg',
                owner: "1",
                members: ["1"],
                lastEdit: "2021-4-1"
            },
        },
        others: {},
    }
    constructor(rootStore: Store) {
        makeAutoObservable(this);
        this.rootStore = rootStore;
    }
    sendAuthCode(email: string, type: string) {
        fetch(`${process.env.REACT_APP_REQUEST_URL}/user/verification?type=${type}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email
            }),

        }).then((res) => {
            return res.json();
        }).then((res) => {
            switch (res.code) {
                case 0:
                    message.error(res.msg);
                    break;
                case 1:
                    message.success('验证码已发送');
                    break;
                default:
                    throw new Error('网络故障');
            }
        }).catch((err) => {
            message.error(err.message);
        })
    }
    register(email: string, password: string, authCode: string) {
        this.registerWaiting = true;
        message.loading({
            content: '注册中',
            key: 'register',
            duration: 0,
        });
        fetch(`${process.env.REACT_APP_REQUEST_URL}/user/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                code: authCode
            }),
        }).then((res) => {
            if (res.status === 200) {
                return res.json()
            } else {
                throw new Error('注册失败')
            }
        }).then((res) => {
            this.registerWaiting = false;
            switch (res.code) {
                case 0:
                    message.error(res.msg);
                    break;
                case 1:
                    message.success('注册成功');
                    break;
                default:
                    throw new Error('网络故障');
            }
        }).catch((err) => {
            this.registerWaiting = false;
            message.error(err.message);
        }).finally(() => {
            message.destroy('register');
        })
    }
    login(type: "authcode" | "password", email: string, pass: string) {
        this.loginWaiting = true;
        message.loading({
            content: '登录中',
            key: 'login',
            duration: 0,
        });
        fetch(`${process.env.REACT_APP_REQUEST_URL}/user${type === 'authcode' ? '/loginWithVerification' : "/loginWithPassword"}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                [type === 'authcode' ? 'code' : 'password']: pass
            }),
        }).then((res) => {
            if (res.status === 200) {
                return res.json()
            } else {
                throw new Error('登录失败')
            }
        }).then((res) => {
            switch (res.code) {
                case 0:
                    message.error(res.msg);
                    break;
                case 1:
                    message.success('登录成功');
                    runInAction(() => {
                        this.islogged = true;
                        this.info = res.data;
                        this.rootStore.modalStore.setShowLoginModal(false);
                    })
                    break;
                default:
                    throw new Error('网络故障');
            }
        }).catch((err) => {
            message.error(err.message);
        }).finally(() => {
            this.loginWaiting = false;
            message.destroy('login');
        })
    }
    logout() {
        this.islogged = false;
        this.info = {};
    }
}
export default LoginRegisterStore;