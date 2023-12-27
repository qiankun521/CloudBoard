import { SegmentedValue } from 'antd/es/segmented';
import styles from '../../assets/styles/Modal/LoginModal.module.scss';
import { Segmented, Form, Input, Button, Popover } from 'antd';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { observer } from 'mobx-react';
import { storeContext } from '../../stores/storeContext';
import { IoIosArrowBack } from "react-icons/io";
type Info = {
    email?: string,
    password?: string
}
const LoginModal = observer(() => {
    const [loginOption, setLoginOption] = useState('密码登录');//登录方式
    const [registerOption, setRegisterOption] = useState('邮箱注册');//注册方式
    const [loginRegister, setLoginRegister] = useState('login');//登录注册状态
    const [waiting, setWaiting] = useState(0);
    const [info, setInfo] = useState<Info>({});
    const containRef = useRef<HTMLDivElement>(null);
    const store = useContext(storeContext);
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            e.stopPropagation();
            if (containRef.current && containRef.current === e.target) {
                store.modalStore.setShowLoginModal(false);
            }
        }
        window.addEventListener('click', handleClick)
        return () => {
            window.removeEventListener('click', handleClick);
        }
    }, [store.modalStore])
    const handleLoginChange = (value: SegmentedValue) => {
        setLoginOption(value as string);
    }
    const handleRegisterChange = (value: SegmentedValue) => {
        setRegisterOption(value as string);
    }
    const handleLogin = (value: { username: string, password?: string, authcode?: string }) => {
        if (loginOption === '密码登录') {
            store.loginRegisterStore.login("password", value.username, value.password as string);
        } else {
            store.loginRegisterStore.login("authcode", value.username, value.authcode as string);
        }
    }
    const handleRegister = (value: { authcode: string }) => {
        store.loginRegisterStore.register(info.email as string, info.password as string, value.authcode);
        setLoginRegister('login');
    }
    const handleAuth = (value: Info) => {
        setLoginRegister('authcode');
        setInfo(value);
    }
    const handleSendAuthCode = (e: React.MouseEvent) => {
        if (waiting === 0 && info.email) {
            loginRegister === "login" ?
                store.loginRegisterStore.sendAuthCode(info.email as string, "login") :
                store.loginRegisterStore.sendAuthCode(info.email as string, "register");
            setWaiting(60);
        }
    }
    useEffect(() => {
        if (waiting === 0) return;
        const timeId = setTimeout(() => {
            setWaiting(waiting - 1);
        }, 1000)
        return () => {
            clearTimeout(timeId);
        }
    }, [waiting])
    return (
        <div className={styles.container} ref={containRef}>
            <div className={styles.loginBox}>
                <div className={styles.left}
                    style={{
                        backgroundImage: 'url(https://cdn.jsdelivr.net/gh/qiankun521/qiankun521@main/board2.png)',
                        backgroundSize: 'contain',
                        backgroundPosition: 'center'
                    }}
                >
                </div>
                {loginRegister === 'login' &&
                    <div className={styles.right}>
                        <h2>欢迎使用 简单白板</h2>
                        <Segmented
                            options={['密码登录', '验证码登录']}
                            defaultValue={'密码登录'}
                            onChange={handleLoginChange}
                            value={loginOption}
                        ></Segmented>
                        <Form
                            style={{
                                width: '100%',
                                marginTop: '24px'
                            }}
                            onFinish={handleLogin}
                        >
                            <Form.Item
                                name='username'
                                rules={[{ required: true, message: '请输入邮箱/手机号!' }]}
                            >
                                <Input className={styles.input} placeholder='邮箱/手机号' onChange={(e) => { setInfo({ email: e.target.value }) }}></Input>
                            </Form.Item>
                            {loginOption === '验证码登录' &&
                                <Form.Item
                                    name='authcode'
                                    rules={[
                                        { required: true, message: '请输入验证码!' },
                                        { len: 6, message: '验证码长度为6位!' },
                                    ]}
                                >
                                    <Input
                                        placeholder='验证码'
                                        className={styles.input}
                                        suffix={
                                            <div
                                                className={styles.sendButton}
                                                onClick={handleSendAuthCode}
                                            >{waiting > 0 ? `${waiting}秒后重发` : '发送验证码'}</div>
                                        }
                                    ></Input>
                                </Form.Item>
                            }
                            {loginOption === '密码登录' &&
                                <Form.Item
                                    name='password'
                                    rules={[{ required: true, message: '请输入密码!' }]}
                                >
                                    <Input className={styles.input} placeholder='密码'></Input>
                                </Form.Item>
                            }
                            <Form.Item>
                                <Button
                                    htmlType='submit'
                                    className={styles.loginButton}
                                    block
                                    disabled={store.loginRegisterStore.loginWaiting}
                                >登录</Button>
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    type='link'
                                    block
                                    className={styles.jumpButton}
                                    onClick={() => setLoginRegister('register')}>还没有账号？去注册</Button>
                            </Form.Item>
                        </Form>
                    </div>}
                {loginRegister === 'register' &&
                    <div className={styles.right}>
                        <h2>注册账号</h2>
                        <Segmented
                            options={['邮箱注册', '手机注册']}
                            onChange={handleRegisterChange}
                            defaultValue='邮箱注册'
                            value={registerOption}
                        ></Segmented>
                        <Form
                            style={{
                                width: '100%',
                                marginTop: '24px'
                            }}
                            onFinish={handleAuth}
                        >
                            <Form.Item
                                name='email'
                                rules={[
                                    { required: true, message: '请输入邮箱!' },
                                    { type: 'email', message: '请输入正确的邮箱格式!' }
                                ]}
                            >
                                <Input className={styles.input} placeholder='邮箱'></Input>
                            </Form.Item>
                            <Form.Item
                                name='password'
                                rules={[
                                    { required: true, message: '请输入密码!' },
                                    { min: 6, message: '密码长度不能小于6位!' }
                                ]}
                            >
                                <Input className={styles.input} placeholder='密码'></Input>
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    htmlType='submit'
                                    className={styles.loginButton}
                                    block
                                >注册</Button>
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    type='link'
                                    block
                                    onClick={() => setLoginRegister('login')}
                                    className={styles.jumpButton}
                                >已有账号？去登录</Button>
                            </Form.Item>
                        </Form>
                    </div>
                }
                {loginRegister === 'authcode' &&
                    <div className={styles.right}>
                        <div className={styles.authTitle}>
                            <div className={styles.backButton} onClick={() => setLoginRegister('register')}>
                                <IoIosArrowBack></IoIosArrowBack>
                            </div>
                            <h2>验证邮箱有效性</h2>
                        </div>
                        <p className={styles.tinyText}>已发送到{info.email}</p>
                        <Form
                            style={{
                                width: '100%',
                                marginTop: '24px'
                            }}
                            onFinish={handleRegister}
                        >
                            <Form.Item
                                name='authcode'
                                rules={[
                                    { required: true, message: '请输入验证码!' },
                                    { len: 6, message: '验证码长度为6位!' },
                                ]}
                            >
                                <Input
                                    placeholder='验证码'
                                    className={styles.input}
                                    suffix={
                                        <div
                                            className={styles.sendButton}
                                            onClick={handleSendAuthCode}
                                        >{waiting > 0 ? `${waiting}秒后重发` : '发送验证码'}</div>
                                    }
                                ></Input>
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    htmlType='submit'
                                    className={styles.loginButton}
                                    block
                                >确定</Button>
                            </Form.Item>
                        </Form>
                        <Popover
                            content={
                                <div
                                    style={{
                                        width: '300px',
                                        wordBreak: 'break-all',
                                        fontSize: '0.8rem'
                                    }}
                                >
                                    请检查是否在邮箱的垃圾邮件中，或者通过support@simpleboard.com联系我们
                                </div>
                            }
                            placement='bottom'
                        >
                            <p className={styles.tinyText}>未收到验证码？</p>
                        </Popover>
                    </div>
                }
            </div>
        </div>
    );
});
export default LoginModal;