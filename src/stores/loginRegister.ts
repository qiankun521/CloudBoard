import { makeAutoObservable, runInAction, autorun } from 'mobx';
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
        all: [],
        mine: [],
        others: [],
    }
    constructor(rootStore: Store) {
        makeAutoObservable(this);
        this.rootStore = rootStore;
        this.loadData();
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
        this.setLoginWaiting(true);
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
                        this.getWhiteBoard();
                    })
                    break;
                default:
                    throw new Error('网络故障');
            }
        }).catch((err) => {
            message.error(err.message);
        }).finally(() => {
            this.setLoginWaiting(false);
            message.destroy('login');
        })
    }
    logout() {
        this.islogged = false;
        this.info = {};
        this.whiteBoard = {
            all: [],
            mine: [],
            others: [],
        };
        this.clearData();
    }
    setLoginWaiting(waiting: boolean) {
        this.loginWaiting = waiting;
    }
    getWhiteBoard() {
        return Promise.all([this.getWhiteBoardOthers(), this.getWhiteBoardOwn()]).then((res) => {
            runInAction(() => {
                this.whiteBoard.others = res[0].data;
                this.whiteBoard.mine = res[1].data;
                this.whiteBoard.all = [];
                if (this.whiteBoard.mine) this.whiteBoard.all.push(...this.whiteBoard.mine);
                if (this.whiteBoard.others) this.whiteBoard.all.push(...this.whiteBoard.others);
                this.saveData();
            })
        }).catch((err) => {
            message.error(err.message);
        })
    }
    getWhiteBoardOthers() {
        if (!this.info.token) {
            return Promise.reject(new Error('未登录'));
        }
        return fetch(`${process.env.REACT_APP_REQUEST_URL}/room/list`, {
            method: 'GET',
            headers: {
                'Token': this.info.token
            },
        }).then((res) => {
            if (res.status === 200) {
                return res.json()
            } else if (res.status === 401) {
                this.logout();
                throw new Error('登录过期，请重新登录');
            } else {
                throw new Error('获取白板失败')
            }
        }).catch((err) => {
            message.error(err.message);
        })
    }
    getWhiteBoardOwn() {
        if (!this.info.token) {
            return Promise.reject(new Error('未登录'));
        }
        return fetch(`${process.env.REACT_APP_REQUEST_URL}/room/ownerList`, {
            method: 'GET',
            headers: {
                'Token': this.info.token
            },
        }).then((res) => {
            if (res.status === 200) {
                return res.json()
            } else if (res.status === 401) {
                this.logout();
                throw new Error('登录过期，请重新登录');
            } else {
                throw new Error('获取白板失败')
            }
        }).catch((err) => {
            message.error(err.message);
        })
    }
    createWhiteBoard(name?: string) {
        if (!this.info.token || !this.islogged) {
            message.error('未登录');
            this.rootStore.modalStore.setShowLoginModal(true);
            return;
        }
        if (!name) name = '未命名白板';
        return fetch(`${process.env.REACT_APP_REQUEST_URL}/room/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Token': this.info.token
            },
            body: JSON.stringify({
                name: name
            })
        }).then((res) => {
            if (res.status === 200) {
                return res.json()
            } else if(res.status===401){
                this.logout();
                throw new Error('登录过期，请重新登录');
            }else {
                throw new Error('创建白板失败')
            }
        }).then(async (res) => {
            switch (res.code) {
                case 0:
                    message.error(res.msg);
                    break;
                case 1:
                    message.success('创建成功');
                    await this.getWhiteBoard();
                    return res.data.uuid;
                default:
                    throw new Error('网络故障');
            }
        }).catch((err) => {
            return err;
        })
    }
    joinWhiteBoard(uuid: string) {
        if (!this.info.token || !this.islogged) {
            message.error('未登录');
            return;
        }
        return fetch(`${process.env.REACT_APP_REQUEST_URL}/room/join`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Token': this.info.token
            },
            body: JSON.stringify({
                uuid: uuid
            })
        }).then((res) => {
            if (res.status === 200) {
                return res.json()
            } else if(res.status===401){
                this.logout();
                throw new Error('登录过期，请重新登录');
            }else {
                throw new Error('加入白板失败')
            }
        }).then(async (res) => {
            switch (res.code) {
                case 0:
                    message.error(res.msg);
                    return;
                case 1:
                    message.success('加入成功');
                    await this.getWhiteBoard();
                    return res.data.id;
                default:
                    throw new Error('网络故障');
            }
        }).catch((err) => {
            message.error(err.message);
            return;
        })
    }
    saveData() {
        localStorage.setItem('islogged', this.islogged.toString());
        localStorage.setItem('info', JSON.stringify(this.info));
        localStorage.setItem('whiteBoard', JSON.stringify(this.whiteBoard));
    }
    clearData() {
        localStorage.removeItem('islogged');
        localStorage.removeItem('info');
        localStorage.removeItem('whiteBoard');
    }
    loadData() {
        const islogged = localStorage.getItem('islogged');
        const info = localStorage.getItem('info');
        const whiteBoard = localStorage.getItem('whiteBoard');
        if (islogged && info && whiteBoard) {
            this.islogged = JSON.parse(islogged);
            this.info = JSON.parse(info);
            this.whiteBoard = JSON.parse(whiteBoard);
        }
    }
}
export default LoginRegisterStore;